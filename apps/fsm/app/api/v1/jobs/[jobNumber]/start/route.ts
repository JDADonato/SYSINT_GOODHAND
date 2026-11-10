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
    const { job, outboxMessage } = await jobsStore.startJob(jobNumber, correlationId);

    logger.info(
      { correlationId, jobNumber: job.jobNumber, status: job.status, outboxId: outboxMessage.id },
      'Job transitioned to In Progress; OP-06 written to outbox'
    );

    return NextResponse.json({
      success: true,
      jobNumber: job.jobNumber,
      status: job.status,
      outboxMessageId: outboxMessage.id
    });
  } catch (err: any) {
    return createErrorResponse(
      err.category || 'BUSINESS_RULE_VIOLATED',
      err.message || 'Cannot start job',
      correlationId
    );
  }
}
