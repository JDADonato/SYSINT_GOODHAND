import crypto from 'node:crypto';
import {
  CreateInstallationRequestSchema,
  type CreateInstallationRequest,
  type InstallationJobResponse,
  type JobStatus
} from '@prototype/contract';

export interface StoredJob {
  id: string;
  jobNumber: string;
  orderNumber: string;
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
  serviceArea: string;
  status: JobStatus;
  technicianId?: string;
  technicianName?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  preferredStart: string;
  preferredEnd: string;
  specialInstructions?: string;
  items: Array<{
    sku: string;
    quantity: number;
    loadedQuantity: number;
  }>;
  version: number;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  jobId: string;
  technicianId: string;
  periodStart: string;
  periodEnd: string;
  status: 'active' | 'released';
  createdAt: string;
}

export interface ProcessedMessage {
  idempotencyKey: string;
  operationId: string;
  requestHash: string;
  responseStatus: number;
  responseBody: any;
  createdAt: string;
}

export interface OutboxMessage {
  id: string;
  operationId: string;
  payload: any;
  idempotencyKey: string;
  correlationId: string;
  status: 'pending' | 'delivered' | 'failed';
  attempts: number;
  nextAttemptAt: string;
  createdAt: string;
}

// In-Memory resilient store with singleton state
class JobsStore {
  private jobs: Map<string, StoredJob> = new Map();
  private appointments: Appointment[] = [];
  private processedMessages: Map<string, ProcessedMessage> = new Map();
  private outboxMessages: OutboxMessage[] = [];
  private jobCounter = 1;

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Initial active seed job
    const initialJob: StoredJob = {
      id: 'job-uuid-1',
      jobNumber: 'JOB-20261110-000001',
      orderNumber: 'GH-20261110-000001',
      customerName: 'Juan Dela Cruz',
      customerPhone: '+639171234567',
      customerEmail: 'juan@example.com',
      address: {
        line1: '123 Ayala Ave',
        city: 'Makati',
        province: 'Metro Manila',
        postalCode: '1226'
      },
      serviceArea: 'Metro Manila',
      status: 'Scheduled',
      technicianId: 'tech-uuid-1',
      technicianName: 'Arnel Mendoza',
      scheduledStart: '2026-11-12T09:00:00+08:00',
      scheduledEnd: '2026-11-12T11:00:00+08:00',
      preferredStart: '2026-11-12T09:00:00+08:00',
      preferredEnd: '2026-11-12T11:00:00+08:00',
      specialInstructions: 'Gate code 4321',
      items: [
        { sku: 'GH-CCTV-001', quantity: 2, loadedQuantity: 0 }
      ],
      version: 1,
      idempotencyKey: 'idemp-seed-1',
      createdAt: '2026-11-10T08:00:00+08:00',
      updatedAt: '2026-11-10T08:00:00+08:00'
    };

    this.jobs.set(initialJob.jobNumber, initialJob);

    // Initial appointment
    this.appointments.push({
      id: 'appt-1',
      jobId: initialJob.id,
      technicianId: 'tech-uuid-1',
      periodStart: '2026-11-12T09:00:00+08:00',
      periodEnd: '2026-11-12T11:00:00+08:00',
      status: 'active',
      createdAt: '2026-11-10T08:00:00+08:00'
    });
  }

  public hashPayload(payload: any): string {
    return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  }

  public async createInstallationJob(
    payload: any,
    idempotencyKey: string,
    correlationId: string
  ): Promise<{ status: 200 | 201; body: InstallationJobResponse }> {
    const requestHash = this.hashPayload(payload);

    // 1. Idempotency Check (CL-07)
    const existingMessage = this.processedMessages.get(idempotencyKey);
    if (existingMessage) {
      if (existingMessage.requestHash !== requestHash) {
        const error: any = new Error('Reusing idempotency key with different payload');
        error.category = 'IDEMPOTENCY_KEY_CONFLICT';
        throw error;
      }
      return { status: 200, body: existingMessage.responseBody };
    }

    // 2. Schema Validation (CL-01, CL-02, CL-03)
    const parsed = CreateInstallationRequestSchema.safeParse(payload);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      const error: any = new Error(firstIssue?.message || 'Validation failed');
      error.category = 'VALIDATION_FAILED';
      error.field = firstIssue?.path.join('.');
      throw error;
    }

    const validData: CreateInstallationRequest = parsed.data;

    // 3. Generate sequential Job Number: JOB-YYYYMMDD-NNNNNN
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const seqStr = String(this.jobCounter++).padStart(6, '0');
    const jobNumber = `JOB-${todayStr}-${seqStr}`;

    const newJob: StoredJob = {
      id: crypto.randomUUID(),
      jobNumber,
      orderNumber: validData.orderNumber,
      customerName: validData.customerName,
      customerPhone: validData.customerPhone,
      customerEmail: validData.customerEmail,
      address: validData.address,
      serviceArea: validData.address.province || validData.address.city,
      status: 'Pending Scheduling',
      preferredStart: validData.preferredStart,
      preferredEnd: validData.preferredEnd,
      specialInstructions: validData.specialInstructions,
      items: validData.items.map(item => ({
        sku: item.sku,
        quantity: item.quantity,
        loadedQuantity: 0
      })),
      version: 1,
      idempotencyKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.jobs.set(jobNumber, newJob);

    const responseBody: InstallationJobResponse = {
      jobNumber: newJob.jobNumber,
      orderNumber: newJob.orderNumber,
      status: newJob.status,
      items: newJob.items.map(i => ({ sku: i.sku, quantity: i.quantity })),
      createdAt: newJob.createdAt
    };

    // Store in processed_messages
    this.processedMessages.set(idempotencyKey, {
      idempotencyKey,
      operationId: 'OP-01',
      requestHash,
      responseStatus: 201,
      responseBody,
      createdAt: new Date().toISOString()
    });

    return { status: 201, body: responseBody };
  }

  public getJob(jobNumber: string): StoredJob | undefined {
    return this.jobs.get(jobNumber);
  }

  public listJobs(): StoredJob[] {
    return Array.from(this.jobs.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Double-booking check: EXCLUDE USING gist (technician_id WITH =, period WITH &&) WHERE status = 'active'
  public checkAppointmentOverlap(technicianId: string, startIso: string, endIso: string): boolean {
    const reqStart = new Date(startIso).getTime();
    const reqEnd = new Date(endIso).getTime();

    return this.appointments.some(appt => {
      if (appt.technicianId !== technicianId || appt.status !== 'active') return false;
      const apptStart = new Date(appt.periodStart).getTime();
      const apptEnd = new Date(appt.periodEnd).getTime();
      // Overlap condition: reqStart < apptEnd && reqEnd > apptStart
      return reqStart < apptEnd && reqEnd > apptStart;
    });
  }

  public async assignTechnician(
    jobNumber: string,
    technicianId: string,
    technicianName: string,
    scheduledStart: string,
    scheduledEnd: string,
    correlationId: string
  ): Promise<{ job: StoredJob; outboxMessage: OutboxMessage }> {
    const job = this.jobs.get(jobNumber);
    if (!job) {
      const error: any = new Error(`Job ${jobNumber} not found`);
      error.category = 'NOT_FOUND';
      throw error;
    }

    // Check exclusion constraint guard (TC-11, OBJ-02)
    const hasConflict = this.checkAppointmentOverlap(technicianId, scheduledStart, scheduledEnd);
    if (hasConflict) {
      const error: any = new Error(
        `Technician ${technicianName} already has an active overlapping appointment during this window.`
      );
      error.category = 'SCHEDULE_CONFLICT';
      throw error;
    }

    // Insert active appointment
    const appointment: Appointment = {
      id: crypto.randomUUID(),
      jobId: job.id,
      technicianId,
      periodStart: scheduledStart,
      periodEnd: scheduledEnd,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    this.appointments.push(appointment);

    // Update job status to 'Scheduled'
    job.technicianId = technicianId;
    job.technicianName = technicianName;
    job.scheduledStart = scheduledStart;
    job.scheduledEnd = scheduledEnd;
    job.status = 'Scheduled';
    job.updatedAt = new Date().toISOString();
    job.version += 1;

    // Write OP-05 outbox message (Section 3.3 & W-02)
    const outboxMessage: OutboxMessage = {
      id: crypto.randomUUID(),
      operationId: 'OP-05',
      payload: {
        jobNumber: job.jobNumber,
        orderNumber: job.orderNumber,
        technicianName,
        scheduledStart,
        scheduledEnd,
        status: job.status
      },
      idempotencyKey: crypto.randomUUID(),
      correlationId: correlationId || crypto.randomUUID(),
      status: 'pending',
      attempts: 0,
      nextAttemptAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    this.outboxMessages.push(outboxMessage);

    return { job, outboxMessage };
  }

  public listTechnicianJobs(technicianId: string): StoredJob[] {
    return Array.from(this.jobs.values()).filter(j => j.technicianId === technicianId);
  }

  public getOutboxMessages(): OutboxMessage[] {
    return this.outboxMessages;
  }
}

export const jobsStore = new JobsStore();
