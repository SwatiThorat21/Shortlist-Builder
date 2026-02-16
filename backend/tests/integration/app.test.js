import { describe, expect, it, vi, beforeEach } from 'vitest';
import request from 'supertest';

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

describe('app integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('builds shortlist for valid request', async () => {
    const res = await request(app).post('/api/shortlists/build').send({
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
    });

    expect(res.status).toBe(200);
    expect(res.body.shortlist_id).toBeTruthy();
  });

  it('rejects invalid request payload', async () => {
    const res = await request(app).post('/api/shortlists/build').send({ need: '', requirements: {} });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns status response', async () => {
    const res = await request(app).get('/api/status');
    expect([200, 503]).toContain(res.status);
    expect(res.body.services.express.ok).toBe(true);
  });
});
