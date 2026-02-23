export function normalizeBudgetCategory(input) {
  const text = (input || '').toLowerCase();
  const nums = [...text.matchAll(/\$?([0-9]+(?:,[0-9]{3})*)/g)].map((m) => Number(m[1].replaceAll(',', '')));
  const max = nums.length ? Math.max(...nums) : null;

  if (/free|startup|cheap|low/i.test(text) || (max !== null && max < 1000)) return 'low';
  if (/mid|standard|growth/i.test(text) || (max !== null && max < 5000)) return 'mid';
  if (/high|advanced|scale/i.test(text) || (max !== null && max < 20000)) return 'high';
  if (/enterprise|custom|contact sales/i.test(text) || (max !== null && max >= 20000)) return 'enterprise';
  return 'unknown';
}

export function normalizePriceCategory(priceRange) {
  const text = (priceRange || '').toLowerCase();
  if (/free|\$0|low|basic/.test(text)) return 'low';
  if (/high|pro|premium|\$[1-9][0-9]{3,4}/.test(text)) return 'high';
  if (/mid|standard|\$[1-9][0-9]{1,3}/.test(text)) return 'mid';
  if (/enterprise|custom|contact sales/.test(text)) return 'enterprise';
  return 'unknown';
}
