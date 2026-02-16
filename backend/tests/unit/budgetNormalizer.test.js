import { describe, expect, it } from 'vitest';
import { normalizeBudgetCategory, normalizePriceCategory } from '../../src/services/budgetNormalizer.js';

describe('budgetNormalizer', () => {
  it('categorizes free-text budget values', () => {
    expect(normalizeBudgetCategory('under $500 monthly')).toBe('low');
    expect(normalizeBudgetCategory('$2500 / month')).toBe('mid');
    expect(normalizeBudgetCategory('$12000 annual')).toBe('high');
    expect(normalizeBudgetCategory('enterprise custom pricing')).toBe('enterprise');
  });

  it('categorizes extracted price range text', () => {
    expect(normalizePriceCategory('Free tier available')).toBe('low');
    expect(normalizePriceCategory('Standard starts at $99')).toBe('mid');
    expect(normalizePriceCategory('Premium starts at $2500')).toBe('high');
    expect(normalizePriceCategory('Contact sales for enterprise')).toBe('enterprise');
  });
});
