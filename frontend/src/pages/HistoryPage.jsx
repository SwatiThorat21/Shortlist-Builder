import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HistoryList from '../components/HistoryList.jsx';
import { api } from '../services/api.js';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

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

  async function handleDeleteConfirm() {
    if (!pendingDeleteId) return;
    try {
      await api.deleteShortlist(pendingDeleteId);
      await load();
    } catch (e) {
      setError(e.message || 'Failed to delete shortlist');
    } finally {
      setPendingDeleteId(null);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleOpen(item) {
    const shortlist = item.results || { need: item.need, vendors: [], ranking: [] };
    navigate('/results', { state: { shortlist, requirements: item.requirements || null } });
  }

  function handleDeleteRequest(id) {
    setPendingDeleteId(id);
  }

  return (
    <section>
      <h2>History</h2>
      {loading ? <p>Loading...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      <HistoryList items={items} onDelete={handleDeleteRequest} onOpen={handleOpen} />

      {pendingDeleteId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">Delete shortlist?</h3>
            <p className="mt-2 text-sm text-slate-600">
              This action cannot be undone. The selected shortlist will be permanently removed.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setPendingDeleteId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
