import { useEffect, useState } from 'react';
import HistoryList from '../components/HistoryList.jsx';
import { api } from '../services/api.js';

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setError('');
      const response = await api.listShortlists(5);
      setItems(response.items || []);
    } catch (e) {
      setError(e.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this shortlist?')) return;
    try {
      await api.deleteShortlist(id);
      await load();
    } catch (e) {
      setError(e.message || 'Failed to delete shortlist');
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section>
      <h2>History</h2>
      {loading ? <p>Loading...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      <HistoryList items={items} onDelete={handleDelete} />
    </section>
  );
}
