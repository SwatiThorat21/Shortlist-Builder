import { downloadMarkdown, generateMarkdownReport } from '../utils/markdown.js';

export default function MarkdownExportButton({ shortlist, requirements }) {
  if (!shortlist) return null;

  const handleClick = () => {
    const content = generateMarkdownReport({
      need: shortlist.need,
      requirements,
      vendors: shortlist.vendors,
      ranking: shortlist.ranking
    });
    downloadMarkdown('vendor-shortlist-report.md', content);
  };

  return <button onClick={handleClick}>Export Markdown report</button>;
}
