import { describe, expect, it } from 'vitest';
import { shortlistBuildRequestSchema, shortlistListQuerySchema } from '../../src/schemas/shortlistSchemas.js';

describe('shortlist schema boundaries', () => {
  it('rejects unknown top-level keys', () => {
    const result = shortlistBuildRequestSchema.safeParse({
      need: 'Find CRM',
      requirements: { budget_text: '$1000' },
      extra: true
    });

    expect(result.success).toBe(false);
  });

  it('rejects too many must-have features', () => {
    const result = shortlistBuildRequestSchema.safeParse({
      need: 'Find CRM',
      requirements: {
        budget_text: '$1000',
        must_have_features: Array.from({ length: 21 }, (_, i) => `feature-${i}`)
      }
    });

    expect(result.success).toBe(false);
  });

  it('rejects too-long need text', () => {
    const result = shortlistBuildRequestSchema.safeParse({
      need: 'a'.repeat(2001),
      requirements: { budget_text: '$1000' }
    });

    expect(result.success).toBe(false);
  });

  it('coerces list limit and validates numeric bounds', () => {
    const parsed = shortlistListQuerySchema.parse({ limit: '5' });
    expect(parsed.limit).toBe(5);
    expect(shortlistListQuerySchema.safeParse({ limit: '100' }).success).toBe(false);
  });
});
