import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

function ServiceStatus({ label, value }) {
  const ok = Boolean(value?.ok);
  const latency = value?.latency_ms;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-900">{label}</h3>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
          }`}
        >
          {ok ? 'Healthy' : 'Down'}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-700">
        Latency:{' '}
        <span className="font-medium text-slate-900">
          {typeof latency === 'number' ? `${latency} ms` : 'N/A'}
        </span>
      </p>
    </article>
  );
}

export default function StatusPage() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadStatus() {
    try {
      setLoading(true);
      setError('');
      const response = await api.fetchStatus();
      setStatus(response);
    } catch (e) {
      setError(e.message || 'Failed to load status');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">System Status</h2>
          <p className="mt-1 text-sm text-slate-600">Live backend dependency health and response latency.</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 disabled:opacity-60"
          onClick={loadStatus}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error ? <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      {!status && loading ? (
        <p className="mb-3 rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-600">Loading status...</p>
      ) : null}

      {status ? (
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-3">
            <p className="text-sm text-slate-700">
              Overall:{' '}
              <span className={`font-semibold ${status.ok ? 'text-emerald-700' : 'text-rose-700'}`}>
                {status.ok ? 'Healthy' : 'Degraded'}
              </span>
            </p>
            <p className="mt-1 text-xs text-slate-500">Updated: {new Date(status.timestamp).toLocaleString()}</p>
          </div>
          <ServiceStatus label="Express" value={status.services.express} />
          <ServiceStatus label="Supabase" value={status.services.supabase} />
          <ServiceStatus label="Gemini" value={status.services.gemini} />
        </div>
      ) : null}
    </section>
  );
}
