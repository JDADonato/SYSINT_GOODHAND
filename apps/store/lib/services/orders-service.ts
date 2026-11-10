import crypto from 'node:crypto';
import { stockLedger } from '../ledger/stock-ledger';
import { outboxEngine } from '../outbox/outbox-engine';
import { normalizePhilippinePhone } from '../phone';
import { logger } from '@prototype/logger';

export interface CheckoutPayload {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    province: string;
    postalCode: string;
  };
  items: Array<{
    sku: string;
    quantity: number;
    unitPricePhp: string;
  }>;
  includeInstallation: boolean;
  preferredStart?: string;
  preferredEnd?: string;
  specialInstructions?: string;
}

export interface StoredOrder {
  orderNumber: string;
  status: 'pending_payment' | 'paid' | 'fulfilled' | 'cancelled';
  totalPhp: string;
  includeInstallation: boolean;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: CheckoutPayload['address'];
  items: CheckoutPayload['items'];
  preferredStart?: string;
  preferredEnd?: string;
  specialInstructions?: string;
  installationStatus?: string;
  technicianName?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  createdAt: string;
}

export class OrdersService {
  private orders: Map<string, StoredOrder> = new Map();
  private orderCounter = 1;

  public async processCheckout(
    payload: CheckoutPayload,
    idempotencyKey: string,
    correlationId: string,
    simulatePaymentFailure: boolean = false
  ): Promise<{ order: StoredOrder; outboxId?: string }> {
    // 1. Phone number normalization (D16, TC-31)
    const normalizedPhone = normalizePhilippinePhone(payload.customerPhone);

    // 2. Window validation for installations (at least 24h ahead)
    if (payload.includeInstallation) {
      if (!payload.preferredStart || !payload.preferredEnd) {
        const err: any = new Error('Preferred installation window is required');
        err.category = 'VALIDATION_FAILED';
        throw err;
      }
      const start = new Date(payload.preferredStart).getTime();
      const end = new Date(payload.preferredEnd).getTime();
      if (end <= start) {
        const err: any = new Error('Preferred end time must be after start time');
        err.category = 'VALIDATION_FAILED';
        throw err;
      }
    }

    // 3. Stock availability verification (W-01 step 2)
    for (const item of payload.items) {
      const isAvailable = stockLedger.checkAvailability(item.sku, item.quantity);
      if (!isAvailable) {
        const err: any = new Error(`Insufficient stock for item ${item.sku}`);
        err.category = 'INSUFFICIENT_STOCK';
        throw err;
      }
    }

    // 4. Generate unique Order Number: GH-YYYYMMDD-NNNNNN
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const seqStr = String(this.orderCounter++).padStart(6, '0');
    const orderNumber = `GH-${todayStr}-${seqStr}`;

    // 5. Payment simulation (D5)
    if (simulatePaymentFailure) {
      const failedOrder: StoredOrder = {
        orderNumber,
        status: 'pending_payment',
        totalPhp: this.calculateTotal(payload.items),
        includeInstallation: payload.includeInstallation,
        customerName: payload.customerName,
        customerPhone: normalizedPhone,
        customerEmail: payload.customerEmail,
        address: payload.address,
        items: payload.items,
        preferredStart: payload.preferredStart,
        preferredEnd: payload.preferredEnd,
        specialInstructions: payload.specialInstructions,
        createdAt: new Date().toISOString()
      };
      this.orders.set(orderNumber, failedOrder);
      return { order: failedOrder };
    }

    // 6. Apply stock mutations in ledger
    for (const item of payload.items) {
      const txId = crypto.randomUUID();
      const reason = payload.includeInstallation ? 'reservation' : 'direct_sale';
      stockLedger.applyMovement(txId, item.sku, reason, item.quantity, orderNumber);
    }

    // 7. Persist Order
    const newOrder: StoredOrder = {
      orderNumber,
      status: 'paid',
      totalPhp: this.calculateTotal(payload.items),
      includeInstallation: payload.includeInstallation,
      customerName: payload.customerName,
      customerPhone: normalizedPhone,
      customerEmail: payload.customerEmail,
      address: payload.address,
      items: payload.items,
      preferredStart: payload.preferredStart,
      preferredEnd: payload.preferredEnd,
      specialInstructions: payload.specialInstructions,
      installationStatus: payload.includeInstallation ? 'Pending Scheduling' : undefined,
      createdAt: new Date().toISOString()
    };
    this.orders.set(orderNumber, newOrder);

    // 8. Enqueue OP-01 to outbox if installation is included (OBJ-01, W-01 step 5)
    let outboxId: string | undefined;
    if (payload.includeInstallation) {
      const op01Payload = {
        orderNumber,
        customerName: payload.customerName,
        customerPhone: normalizedPhone,
        customerEmail: payload.customerEmail,
        address: payload.address,
        items: payload.items.map(i => ({ sku: i.sku, quantity: i.quantity })),
        preferredStart: payload.preferredStart,
        preferredEnd: payload.preferredEnd,
        specialInstructions: payload.specialInstructions
      };

      const outboxRow = outboxEngine.enqueue(
        'OP-01',
        op01Payload,
        idempotencyKey,
        correlationId
      );
      outboxId = outboxRow.id;

      logger.info(
        { correlationId, orderNumber, outboxId },
        'Order created with installation; OP-01 enqueued to outbox'
      );
    }

    return { order: newOrder, outboxId };
  }

  public getOrder(orderNumber: string): StoredOrder | undefined {
    return this.orders.get(orderNumber);
  }

  // Updates installation details upon OP-05 webhook receipt
  public updateInstallationSchedule(
    orderNumber: string,
    technicianName: string,
    scheduledStart: string,
    scheduledEnd: string,
    status: string
  ) {
    const order = this.orders.get(orderNumber);
    if (order) {
      order.technicianName = technicianName;
      order.scheduledStart = scheduledStart;
      order.scheduledEnd = scheduledEnd;
      order.installationStatus = status;
    }
  }

  // W-03: Process OP-06 Status Change Webhook
  public updateStatusChange(orderNumber: string, status: string, timestamp: string) {
    const order = this.orders.get(orderNumber);
    if (order) {
      order.installationStatus = status;
    }
  }

  // W-03 & CL-13: Process OP-07 Completion Webhook (Order Fulfilled & Warranty Activation)
  public processCompletionReport(
    payload: {
      orderNumber: string;
      jobNumber: string;
      completedAt: string;
      result: string;
      installedUnits: Array<{ sku: string; serialNumber: string }>;
      notes?: string;
    },
    correlationId: string
  ): { success: boolean; activatedWarrantiesCount: number; feedbackInvitationDueAt: string } {
    const order = this.orders.get(payload.orderNumber);
    if (!order) {
      const err: any = new Error(`Order ${payload.orderNumber} not found`);
      err.category = 'NOT_FOUND';
      throw err;
    }

    // Set order fulfilled and job completed
    order.status = 'fulfilled';
    order.installationStatus = 'Completed';

    // Calculate warranty duration (default 12 months)
    const startDate = new Date(payload.completedAt);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 12);

    // Schedule feedback invitation (1 hour normal, 1 minute in demo mode - D13)
    const isDemo = process.env.DEMO_MODE === 'true';
    const inviteDueMs = isDemo ? 60 * 1000 : 3600 * 1000;
    const inviteDueAt = new Date(Date.now() + inviteDueMs).toISOString();

    logger.info(
      {
        correlationId,
        orderNumber: payload.orderNumber,
        unitsCount: payload.installedUnits.length,
        inviteDueAt
      },
      'OP-07 processed: order fulfilled, warranty activated, feedback invitation scheduled'
    );

    return {
      success: true,
      activatedWarrantiesCount: payload.installedUnits.length,
      feedbackInvitationDueAt: inviteDueAt
    };
  }

  // W-03 & CL-12: Process OP-08 Inventory Adjustment Webhook
  public processInventoryAdjustment(
    payload: {
      transactionId: string;
      orderNumber: string;
      jobNumber: string;
      sku: string;
      type: 'used' | 'returned_unused' | 'replacement_used';
      quantity: number;
    },
    correlationId: string
  ) {
    const reasonMap: Record<string, 'install_use' | 'reservation_release' | 'replacement_use'> = {
      used: 'install_use',
      returned_unused: 'reservation_release',
      replacement_used: 'replacement_use'
    };

    const reason = reasonMap[payload.type];
    if (!reason) {
      const err: any = new Error(`Invalid adjustment type ${payload.type}`);
      err.category = 'VALIDATION_FAILED';
      throw err;
    }

    // Applies ledger transition with mathematical invariant enforcement (TC-04, TC-09, TC-30)
    const movement = stockLedger.applyMovement(
      payload.transactionId,
      payload.sku,
      reason,
      payload.quantity,
      payload.orderNumber,
      payload.jobNumber
    );

    logger.info(
      {
        correlationId,
        transactionId: payload.transactionId,
        sku: payload.sku,
        reason,
        quantity: payload.quantity
      },
      'OP-08 ledger movement applied'
    );

    return movement;
  }

  private calculateTotal(items: CheckoutPayload['items']): string {
    const total = items.reduce((sum, item) => {
      return sum + parseFloat(item.unitPricePhp) * item.quantity;
    }, 0);
    return total.toFixed(2);
  }
}

export const ordersService = new OrdersService();
