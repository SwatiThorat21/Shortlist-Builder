export function generateMarkdownReport({ need, requirements, vendors, ranking }) {
  const ranked = ranking.map((name) => vendors.find((v) => v.name === name)).filter(Boolean);

  const lines = [
    '# Vendor Shortlist Report',
    '',
    '## Need',
    need,
    '',
    '## Requirements',
    `- Budget: ${requirements.budget_text}`,
    `- Region: ${requirements.region || 'N/A'}`,
    `- Team Size: ${requirements.team_size || 'N/A'}`,
    `- Must-have: ${requirements.must_have_features.join(', ') || 'N/A'}`,
    `- Nice-to-have: ${requirements.nice_to_have_features.join(', ') || 'N/A'}`,
    `- Compliance: ${requirements.compliance_constraints.join(', ') || 'N/A'}`,
    '',
    '## Ranked Vendors'
  ];

  ranked.forEach((vendor, idx) => {
    lines.push(`### ${idx + 1}. ${vendor.name}`);
    lines.push(`- Website: ${vendor.website}`);
    lines.push(`- Price range: ${vendor.price_range}`);
    lines.push(`- Score: ${vendor.score}`);
    lines.push(`- Matched features: ${vendor.matched_features.join(', ') || 'N/A'}`);
    lines.push(`- Missing features: ${vendor.missing_features.join(', ') || 'N/A'}`);
    lines.push(`- Risks: ${vendor.risks.join(', ') || 'N/A'}`);
    lines.push('- Evidence:');
    vendor.evidence.forEach((e) => lines.push(`  - ${e.url}: "${e.quote}"`));
    lines.push('');
  });

  return lines.join('\n');
}

export function downloadMarkdown(filename, content) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
