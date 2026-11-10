import { NextResponse, type NextRequest } from 'next/server';
import { createErrorResponse } from '@/lib/errors';
import { jobsStore } from '@/lib/services/jobs-store';
import { logger } from '@prototype/logger';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ jobNumber: string }> }
) {
  const correlationId = req.headers.get('x-correlation-id') || crypto.randomUUID();
  const { jobNumber } = await params;

  try {
    const body = await req.json();
    const { technicianId, technicianName, scheduledStart, scheduledEnd } = body;

    if (!technicianId || !technicianName || !scheduledStart || !scheduledEnd) {
      return createErrorResponse(
        'VALIDATION_FAILED',
        'technicianId, technicianName, scheduledStart, and scheduledEnd are required',
        correlationId
      );
    }

    // Execute assignment with exclusion constraint validation (TC-11)
    const { job, outboxMessage } = await jobsStore.assignTechnician(
      jobNumber,
      technicianId,
      technicianName,
      scheduledStart,
      scheduledEnd,
      correlationId
    );

    logger.info(
      {
        correlationId,
        jobNumber: job.jobNumber,
        technicianName,
        status: job.status,
        outboxId: outboxMessage.id
      },
      'Technician assigned and OP-05 written to outbox'
    );

    return NextResponse.json({
      success: true,
      job: {
        jobNumber: job.jobNumber,
        orderNumber: job.orderNumber,
        status: job.status,
        technicianName: job.technicianName,
        scheduledStart: job.scheduledStart,
        scheduledEnd: job.scheduledEnd
      },
      outboxMessageId: outboxMessage.id
    });
  } catch (err: any) {
    return createErrorResponse(
      err.category || 'SCHEDULE_CONFLICT',
      err.message || 'Scheduling conflict',
      correlationId
    );
  }
}
