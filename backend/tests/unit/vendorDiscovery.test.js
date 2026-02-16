import { describe, expect, it, vi } from 'vitest';

vi.mock('../../src/llm/geminiClient.js', () => ({
  generateStructuredJson: vi
    .fn()
    .mockResolvedValueOnce('not json')
    .mockResolvedValueOnce(JSON.stringify({
      vendors: [
        {
          vendor_name: 'Acme',
          official_website: 'https://acme.com',
          pricing_url: 'https://acme.com/pricing',
          docs_url: 'https://acme.com/docs'
        },
        {
          vendor_name: 'Beta',
          official_website: 'https://beta.com',
          pricing_url: 'https://beta.com/pricing',
          docs_url: 'https://beta.com/docs'
        },
        {
          vendor_name: 'Gamma',
          official_website: 'https://gamma.com',
          pricing_url: 'https://gamma.com/pricing',
          docs_url: 'https://gamma.com/docs'
        }
      ]
    }))
}));

import { discoverVendors } from '../../src/llm/vendorDiscovery.js';

describe('vendorDiscovery', () => {
  it('retries once on invalid JSON and then succeeds', async () => {
    const result = await discoverVendors({
      need: 'CRM',
      requirements: { budget_text: '$1000', must_have_features: [], nice_to_have_features: [], compliance_constraints: [] },
      maxVendors: 5
    });

    expect(result).toHaveLength(3);
    expect(result[0].vendor_name).toBe('Acme');
  });
});
