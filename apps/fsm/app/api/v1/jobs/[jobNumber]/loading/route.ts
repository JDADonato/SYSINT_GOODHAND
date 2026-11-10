import { NextResponse, type NextRequest } from 'next/server';
import { createErrorResponse } from '@/lib/errors';
import { jobsStore } from '@/lib/services/jobs-store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ jobNumber: string }> }
) {
  const correlationId = req.headers.get('x-correlation-id') || crypto.randomUUID();
  const { jobNumber } = await params;

  try {
    const body = await req.json();
    const { sku, loadedQuantity } = body;

    if (!sku || typeof loadedQuantity !== 'number') {
      return createErrorResponse('VALIDATION_FAILED', 'sku and loadedQuantity (number) are required', correlationId);
    }

    const job = jobsStore.confirmLoading(jobNumber, sku, loadedQuantity);

    return NextResponse.json({
      success: true,
      jobNumber: job.jobNumber,
      items: job.items
    });
  } catch (err: any) {
    return createErrorResponse(
      err.category || 'VALIDATION_FAILED',
      err.message || 'Failed to confirm loading',
      correlationId
    );
  }
}
