import { NextResponse, type NextRequest } from 'next/server';
import { outboxEngine } from '@/lib/outbox/outbox-engine';
import { logger } from '@prototype/logger';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET_STORE || 'change_me_cron_secret_store_at_least_32_characters';

  // Protect internal drain endpoint
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized drain request' }, { status: 401 });
  }

  const fsmBaseUrl = process.env.STORE_FSM_BASE_URL || 'http://localhost:3100/api/v1';

  logger.info('[store:drain] Starting outbox queue drain cycle...');

  const result = await outboxEngine.drainQueue(async (opId, payload, key, corrId) => {
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
    } catch {
      return { status: 503 };
    }
  });

  logger.info(result, '[store:drain] Finished outbox queue drain cycle');

  return NextResponse.json(result);
}
