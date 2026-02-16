import { describe, expect, it } from 'vitest';
import { scoreVendor } from '../../src/services/scoringService.js';

const requirements = {
  budget_text: '$1000 monthly',
  region: 'US',
  must_have_features: ['SSO', 'Audit logs'],
  nice_to_have_features: ['Sandbox'],
  team_size: '20',
  compliance_constraints: ['SOC2'],
  weights: {
    budget: 4,
    region: 4,
    must_have: 5,
    nice_to_have: 2,
    team_size: 2,
    compliance: 4
  }
};

describe('scoringService', () => {
  it('applies heavy penalty for missing must-have requirements', () => {
    const score = scoreVendor({
      requirements,
      vendor: {
        price_range: 'Standard starts at $999',
        matched_features: ['SSO'],
        missing_features: ['Audit logs'],
        risks: [],
        regional_support: 'US, EU'
      }
    });
    expect(score).toBeLessThan(80);
  });

  it('applies penalties for budget and region mismatch', () => {
    const score = scoreVendor({
      requirements,
      vendor: {
        price_range: 'Enterprise custom',
        matched_features: ['SSO', 'Audit logs'],
        missing_features: [],
        risks: ['No SOC2 attestation'],
        regional_support: 'APAC only'
      }
    });
    expect(score).toBeLessThan(60);
  });

  it('scores vendor when weights are not provided', () => {
    const { weights, ...requirementsWithoutWeights } = requirements;
    const score = scoreVendor({
      requirements: requirementsWithoutWeights,
      vendor: {
        price_range: 'Standard starts at $999',
        matched_features: ['SSO', 'Audit logs'],
        missing_features: [],
        risks: [],
        regional_support: 'US, EU'
      }
    });

    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
