export default function HistoryList({ items, onDelete, onOpen }) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 text-sm text-slate-600">
        No shortlist history available yet.
      </div>
    );
  }

  return (
    <div className="space-y-5 px-1 sm:px-3">
      {items.map((item) => {
        const vendors = item.results?.vendors || [];
        const top = [...vendors].sort((a, b) => b.score - a.score)[0];
        const createdAt = new Date(item.created_at).toLocaleString();

        return (
          <article key={item.id} className="card rounded-2xl border-slate-200/90 bg-white/95 p-4 shadow-sm transition hover:border-sky-300 hover:shadow-md sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold leading-6 text-slate-900 sm:text-lg">{item.need}</h3>
              <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                {vendors.length} vendors
              </span>
            </div>

            <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              <p>
                <span className="font-medium text-slate-900">Created:</span> {createdAt}
              </p>
              <p>
                <span className="font-medium text-slate-900">Top vendor:</span> {top ? `${top.name} (${top.score})` : 'N/A'}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
                onClick={() => onOpen(item)}
                aria-label={`Open shortlist for ${item.need}`}
              >
                Open
              </button>
              <button
                type="button"
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
                onClick={() => onDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
