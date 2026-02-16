import { Router } from 'express';
import { checkSupabaseHealth } from '../db/shortlistRepo.js';
import { checkGeminiHealth } from '../llm/geminiClient.js';

const router = Router();

router.get('/', async (_req, res) => {
  const checks = {
    express: { ok: true, latency_ms: 1 },
    supabase: { ok: false, latency_ms: null },
    gemini: { ok: false, latency_ms: null }
  };

  try {
    checks.supabase.latency_ms = await checkSupabaseHealth();
    checks.supabase.ok = true;
  } catch {
    checks.supabase.ok = false;
  }

  try {
    checks.gemini.latency_ms = await checkGeminiHealth();
    checks.gemini.ok = true;
  } catch {
    checks.gemini.ok = false;
  }

  const ok = checks.express.ok && checks.supabase.ok && checks.gemini.ok;
  res.status(ok ? 200 : 503).json({ ok, services: checks, timestamp: new Date().toISOString() });
});

export default router;
