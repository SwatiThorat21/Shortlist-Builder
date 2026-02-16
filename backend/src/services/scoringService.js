import { normalizeBudgetCategory, normalizePriceCategory } from './budgetNormalizer.js';

function mismatchDistance(a, b) {
  const order = ['low', 'mid', 'high', 'enterprise'];
  const ai = order.indexOf(a);
  const bi = order.indexOf(b);
  if (ai < 0 || bi < 0) return 1;
  return Math.abs(ai - bi);
}

export function scoreVendor({ vendor, requirements }) {
  let score = 100;
  const weights = {
    budget: 3,
    region: 3,
    must_have: 5,
    nice_to_have: 2,
    team_size: 2,
    compliance: 3,
    ...(requirements.weights || {})
  };

  const budgetWeight = 1 + weights.budget / 5;
  const mustHaveWeight = 1 + weights.must_have / 3;
  const regionWeight = 1 + weights.region / 5;
  const complianceWeight = 1 + weights.compliance / 5;

  const budgetCategory = normalizeBudgetCategory(requirements.budget_text);
  const vendorPriceCategory = normalizePriceCategory(vendor.price_range);
  score -= mismatchDistance(budgetCategory, vendorPriceCategory) * 10 * budgetWeight;

  const mustHaves = new Set(requirements.must_have_features.map((f) => f.toLowerCase()));
  const matched = new Set(vendor.matched_features.map((f) => f.toLowerCase()));
  let missingMustHave = 0;
  for (const feature of mustHaves) {
    if (!matched.has(feature)) missingMustHave += 1;
  }
  score -= missingMustHave * 16 * mustHaveWeight;

  if (requirements.region && !vendor.regional_support.toLowerCase().includes(requirements.region.toLowerCase())) {
    score -= 12 * regionWeight;
  }

  if (requirements.compliance_constraints.length) {
    const riskText = vendor.risks.join(' ').toLowerCase();
    const missingCompliance = requirements.compliance_constraints.filter(
      (c) => riskText.includes(`no ${c.toLowerCase()}`) || riskText.includes(`missing ${c.toLowerCase()}`)
    ).length;
    score -= missingCompliance * 12 * complianceWeight;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function rankVendors(vendors) {
  return [...vendors].sort((a, b) => b.score - a.score);
}
