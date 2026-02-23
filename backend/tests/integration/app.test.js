import { describe, expect, it, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import http from 'http';
import request from 'supertest';
import { AppError } from '../../src/utils/errors.js';

vi.mock('../../src/services/shortlistService.js', () => ({
  buildShortlist: vi.fn(async () => ({
    shortlist_id: '11111111-1111-1111-1111-111111111111',
    need: 'CRM',
    vendors: [],
    ranking: []
  })),
  listShortlists: vi.fn(async () => ([{ id: '1', need: 'x', results: { vendors: [] }, created_at: new Date().toISOString() }])),
  removeShortlist: vi.fn(async () => {})
}));

vi.mock('../../src/db/shortlistRepo.js', () => ({
  checkSupabaseHealth: vi.fn(async () => 10)
}));

vi.mock('../../src/llm/geminiClient.js', () => ({
  checkGeminiHealth: vi.fn(async () => 15)
}));

import app from '../../src/app.js';
import { buildShortlist } from '../../src/services/shortlistService.js';

const validPayload = {
  need: 'Find CRM',
  requirements: {
    budget_text: '$1200',
    region: 'US',
    must_have_features: ['SSO', 'Audit logs'],
    nice_to_have_features: ['Sandbox'],
    team_size: '20',
    compliance_constraints: [],
    weights: { budget: 3, region: 3, must_have: 5, nice_to_have: 2, team_size: 1, compliance: 2 }
  }
};

describe('app integration', () => {
  let server;

  beforeAll(async () => {
    server = http.createServer(app);
    await new Promise((resolve, reject) => {
      server.listen(0, '127.0.0.1', (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('builds shortlist for valid request', async () => {
    const res = await request(server)
      .post('/api/shortlists/build')
      .set('X-Forwarded-For', '203.0.113.10')
      .send(validPayload);

    expect(res.status).toBe(200);
    expect(res.body.shortlist_id).toBeTruthy();
  });

  it('rejects invalid request payload', async () => {
    const res = await request(server).post('/api/shortlists/build').send({ need: '', requirements: {} });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns status response', async () => {
    const res = await request(server).get('/api/status');
    expect([200, 503]).toContain(res.status);
    expect(res.body.services.express.ok).toBe(true);
  });

  it('rejects invalid shortlist list query', async () => {
    const res = await request(server).get('/api/shortlists?limit=all');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects invalid shortlist id param', async () => {
    const res = await request(server).delete('/api/shortlists/not-a-uuid');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 500 shape for unhandled service failure', async () => {
    vi.mocked(buildShortlist).mockRejectedValueOnce(new Error('boom'));
    const res = await request(server)
      .post('/api/shortlists/build')
      .set('X-Forwarded-For', '203.0.113.11')
      .send(validPayload);

    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe('INTERNAL_ERROR');
  });

  it('returns app error details for service app errors', async () => {
    vi.mocked(buildShortlist).mockRejectedValueOnce(new AppError(502, 'GEMINI_UPSTREAM_ERROR', 'Upstream error'));
    const res = await request(server)
      .post('/api/shortlists/build')
      .set('X-Forwarded-For', '203.0.113.12')
      .send(validPayload);

    expect(res.status).toBe(502);
    expect(res.body.error.code).toBe('GEMINI_UPSTREAM_ERROR');
  });

  it('enforces rate limit for repeated build calls', async () => {
    let last;
    for (let i = 0; i < 21; i += 1) {
      // Same client identity to exercise limiter.
      last = await request(server)
        .post('/api/shortlists/build')
        .set('X-Forwarded-For', '198.51.100.44')
        .send(validPayload);
    }

    expect(last.status).toBe(429);
    expect(last.body.error.code).toBe('RATE_LIMITED');
    expect(Number(last.headers['retry-after'] || '0')).toBeGreaterThan(0);
  });
});
