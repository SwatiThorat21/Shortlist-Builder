import { describe, expect, it } from 'vitest';
import { generateMarkdownReport } from '../utils/markdown.js';

describe('markdown export', () => {
  it('contains required sections', () => {
    const md = generateMarkdownReport({
      need: 'CRM',
      requirements: {
        budget_text: '$1000',
        region: 'US',
        team_size: '20',
        must_have_features: ['SSO'],
        nice_to_have_features: [],
        compliance_constraints: []
      },
      ranking: ['Acme'],
      vendors: [
        {
          name: 'Acme',
          website: 'https://acme.com',
          price_range: '$999',
          score: 90,
          matched_features: ['SSO'],
          missing_features: [],
          risks: [],
          evidence: [{ url: 'https://acme.com/docs', quote: 'Supports SSO' }]
        }
      ]
    });

    expect(md).toContain('# Vendor Shortlist Report');
    expect(md).toContain('## Need');
    expect(md).toContain('## Ranked Vendors');
    expect(md).toContain('Supports SSO');
  });
});
