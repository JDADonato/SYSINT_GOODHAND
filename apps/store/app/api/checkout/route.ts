import { NextResponse, type NextRequest } from 'next/server';
import { ordersService } from '@/lib/services/orders-service';
import { outboxEngine } from '@/lib/outbox/outbox-engine';
import { logger } from '@prototype/logger';

export async function POST(req: NextRequest) {
  const correlationId = req.headers.get('x-correlation-id') || crypto.randomUUID();
  const idempotencyKey = req.headers.get('idempotency-key') || crypto.randomUUID();

  try {
    const body = await req.json();

    const { order, outboxId } = await ordersService.processCheckout(
      body,
      idempotencyKey,
      correlationId,
      body.simulatePaymentFailure || false
    );

    // Opportunistic immediate attempt if an outbox message was created (Section 3.3)
    if (outboxId) {
      const outboxRow = outboxEngine.getOutboxRows().find(r => r.id === outboxId);
      if (outboxRow) {
        // Attempt dispatching to FSM
        const fsmBaseUrl = process.env.STORE_FSM_BASE_URL || 'http://localhost:3100/api/v1';
        outboxEngine.deliverMessage(outboxRow, async (opId, payload, key, corrId) => {
          try {
            const res = await fetch(`${fsmBaseUrl}/installations`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer fake_or_service_token`,
                'Idempotency-Key': key,
                'X-Correlation-Id': corrId
              },
              body: JSON.stringify(payload)
            });
            return { status: res.status };
          } catch (err: any) {
            return { status: 503 };
          }
        }).catch(err => {
          logger.warn({ outboxId, err: err.message }, 'Immediate outbox attempt deferred to drain worker');
        });
      }
    }

    return NextResponse.json(
      {
        orderNumber: order.orderNumber,
        status: order.status,
        totalPhp: order.totalPhp,
        includeInstallation: order.includeInstallation,
        installationStatus: order.installationStatus
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        error: {
          category: err.category || 'VALIDATION_FAILED',
          message: err.message || 'Checkout failed',
          correlationId
        }
      },
      { status: err.category === 'INSUFFICIENT_STOCK' ? 409 : 422 }
    );
  }
}
