import { describe, expect, it } from 'vitest';
import { shortlistBuildRequestSchema } from '../../src/schemas/shortlistSchemas.js';

describe('shortlistSchemas', () => {
  it('accepts request without weights and applies defaults', () => {
    const parsed = shortlistBuildRequestSchema.parse({
      need: 'Find CRM',
      requirements: {
        budget_text: '$1000'
      }
    });

    expect(parsed.requirements.weights).toEqual({
      budget: 3,
      region: 3,
      must_have: 5,
      nice_to_have: 2,
      team_size: 2,
      compliance: 3
    });
  });

  it('does not require minimum 3 requirements', () => {
    const result = shortlistBuildRequestSchema.safeParse({
      need: 'Find CRM',
      requirements: {
        budget_text: '$1000',
        region: 'US'
      }
    });

    expect(result.success).toBe(true);
  });
});
