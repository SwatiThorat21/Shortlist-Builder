import { downloadPdfReport, generateMarkdownReport } from '../utils/markdown.js';

export default function MarkdownExportButton({ shortlist, requirements }) {
  if (!shortlist) return null;

  const handleClick = () => {
    const content = generateMarkdownReport({
      need: shortlist.need,
      requirements,
      vendors: shortlist.vendors,
      ranking: shortlist.ranking
    });
    downloadPdfReport('vendor-shortlist-report.pdf', content);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
      Download PDF Report
    </button>
  );
}
