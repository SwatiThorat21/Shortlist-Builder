export default function HistoryList({ items, onDelete, onOpen }) {
  if (!items.length) {
    return <p>No shortlist history available yet.</p>;
  }

  return (
    <div className="history-list">
      {items.map((item) => {
        const vendors = item.results?.vendors || [];
        const top = [...vendors].sort((a, b) => b.score - a.score)[0];
        return (
          <article
            className="card cursor-pointer transition hover:border-sky-300 hover:shadow-md"
            key={item.id}
            onClick={() => onOpen(item)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpen(item);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Open shortlist for ${item.need}`}
          >
            <h3>{item.need}</h3>
            <p>Created: {new Date(item.created_at).toLocaleString()}</p>
            <p>Top vendor: {top ? `${top.name} (${top.score})` : 'N/A'}</p>
            <button
              className="mt-1 inline-flex items-center text-sm font-semibold text-rose-600 underline decoration-rose-300 underline-offset-2 transition hover:text-rose-700"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
            >
              Delete
            </button>
          </article>
        );
      })}
    </div>
  );
}
