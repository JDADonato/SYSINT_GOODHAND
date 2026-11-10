import { NextResponse, type NextRequest } from 'next/server';
import { outboxEngine } from '@/lib/outbox/outbox-engine';
import { createStoreToFsmServiceToken } from '@/lib/auth';
import { logger } from '@prototype/logger';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET_STORE || 'change_me_cron_secret_store_at_least_32_characters';

  // Protect internal drain endpoint
  if (authHeader !== `Bearer ${cronSecret}` && process.env.DEMO_MODE !== 'true') {
    return NextResponse.json({ error: 'Unauthorized drain request' }, { status: 401 });
  }

  const fsmBaseUrl = process.env.STORE_FSM_BASE_URL || 'http://localhost:3100/api/v1';

  logger.info('[store:drain] Starting outbox queue drain cycle...');

  const result = await outboxEngine.drainQueue(async (opId, payload, key, corrId) => {
    try {
      let endpoint = `${fsmBaseUrl}/installations`;
      let method = 'POST';
      let scope = 'installations:create';
      let bodyData = payload;

      if (opId === 'OP-10') {
        endpoint = `${fsmBaseUrl}/installations/${payload.jobNumber}/feedback`;
        method = 'POST';
        scope = 'feedback:write';
        // Ensure strictly only technician feedback is passed
        bodyData = {
          rating: payload.rating,
          comment: payload.comment,
          technicianTags: payload.technicianTags || [],
          customerFirstName: payload.customerFirstName,
          submittedAt: payload.submittedAt
        };
      } else if (opId === 'OP-11') {
        endpoint = `${fsmBaseUrl}/installations/${payload.jobNumber}/feedback`;
        method = 'PATCH';
        scope = 'feedback:write';
        bodyData = {
          rating: payload.rating,
          comment: payload.comment,
          technicianTags: payload.technicianTags || [],
          customerFirstName: payload.customerFirstName,
          submittedAt: payload.submittedAt
        };
      }

      const token = await createStoreToFsmServiceToken([scope]);

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Idempotency-Key': key,
          'X-Correlation-Id': corrId
        },
        body: JSON.stringify(bodyData)
      });
      return { status: res.status };
    } catch {
      return { status: 503 };
    }
  });

  logger.info(result, '[store:drain] Finished outbox queue drain cycle');

  return NextResponse.json(result);
}
