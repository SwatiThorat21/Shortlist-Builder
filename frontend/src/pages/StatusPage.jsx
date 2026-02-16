import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

function ServiceStatus({ label, value }) {
  return (
    <div className="card status-row">
      <strong>{label}</strong>
      <span className={value.ok ? 'ok' : 'bad'}>{value.ok ? 'Green' : 'Red'}</span>
      <span>{value.latency_ms ?? 'N/A'} ms</span>
    </div>
  );
}

export default function StatusPage() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.fetchStatus().then(setStatus).catch((e) => setError(e.message || 'Failed to load status'));
  }, []);

  return (
    <section>
      <h2>System Status</h2>
      {error ? <p className="error">{error}</p> : null}
      {!status ? <p>Loading status...</p> : null}
      {status ? (
        <>
          <ServiceStatus label="Express" value={status.services.express} />
          <ServiceStatus label="Supabase" value={status.services.supabase} />
          <ServiceStatus label="Gemini" value={status.services.gemini} />
        </>
      ) : null}
    </section>
  );
}
