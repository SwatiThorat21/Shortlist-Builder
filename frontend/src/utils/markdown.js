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

function sanitizePdfText(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E]/g, '?');
}

function wrapLine(line, maxChars = 92) {
  if (!line || line.length <= maxChars) return [line || ' '];
  const words = line.split(' ');
  const wrapped = [];
  let current = '';

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars) {
      if (current) wrapped.push(current);
      current = word;
    } else {
      current = candidate;
    }
  });

  if (current) wrapped.push(current);
  return wrapped;
}

function buildPdfFromLines(lines) {
  const pageHeight = 842;
  const marginTop = 800;
  const lineHeight = 15;
  const maxLinesPerPage = 48;

  const normalized = lines
    .flatMap((line) => wrapLine(line))
    .map((line) => sanitizePdfText(line));

  const pages = [];
  for (let i = 0; i < normalized.length; i += maxLinesPerPage) {
    pages.push(normalized.slice(i, i + maxLinesPerPage));
  }
  if (pages.length === 0) pages.push(['Vendor Shortlist Report']);

  const objects = [];
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  objects.push('2 0 obj\n<< /Type /Pages /Kids [] /Count 0 >>\nendobj\n');
  objects.push('3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');

  const pageObjectNums = [];

  pages.forEach((pageLines, index) => {
    const pageObjNum = 4 + (index * 2);
    const contentObjNum = pageObjNum + 1;
    pageObjectNums.push(pageObjNum);

    const contentLines = pageLines.map((line, lineIdx) => {
      if (lineIdx === 0) return `(${line || ' '}) Tj`;
      return `T* (${line || ' '}) Tj`;
    }).join('\n');

    const contentStream = `BT\n/F1 11 Tf\n50 ${marginTop} Td\n${lineHeight} TL\n${contentLines}\nET`;
    const streamLength = new TextEncoder().encode(contentStream).length;

    objects.push(
      `${pageObjNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 ${pageHeight}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjNum} 0 R >>\nendobj\n`
    );
    objects.push(
      `${contentObjNum} 0 obj\n<< /Length ${streamLength} >>\nstream\n${contentStream}\nendstream\nendobj\n`
    );
  });

  const kids = pageObjectNums.map((n) => `${n} 0 R`).join(' ');
  objects[1] = `2 0 obj\n<< /Type /Pages /Kids [${kids}] /Count ${pageObjectNums.length} >>\nendobj\n`;

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  objects.forEach((obj) => {
    offsets.push(new TextEncoder().encode(pdf).length);
    pdf += obj;
  });

  const xrefStart = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
}

export function downloadPdfReport(filename, reportMarkdown) {
  const lines = reportMarkdown.split('\n');
  const pdfBlob = buildPdfFromLines(lines);
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
