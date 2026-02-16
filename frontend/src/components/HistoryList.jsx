export default function HistoryList({ items, onDelete }) {
  if (!items.length) {
    return <p>No shortlist history available yet.</p>;
  }

  return (
    <div className="history-list">
      {items.map((item) => {
        const vendors = item.results?.vendors || [];
        const top = [...vendors].sort((a, b) => b.score - a.score)[0];
        return (
          <article className="card" key={item.id}>
            <h3>{item.need}</h3>
            <p>Created: {new Date(item.created_at).toLocaleString()}</p>
            <p>Top vendor: {top ? `${top.name} (${top.score})` : 'N/A'}</p>
            <button onClick={() => onDelete(item.id)}>Delete</button>
          </article>
        );
      })}
    </div>
  );
}
