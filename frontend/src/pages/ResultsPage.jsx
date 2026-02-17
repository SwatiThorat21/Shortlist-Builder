import { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ComparisonTable from '../components/ComparisonTable.jsx';
import MarkdownExportButton from '../components/MarkdownExportButton.jsx';

const RESULTS_STORAGE_KEY = 'vendor_shortlist_results_v1';

function formatList(items) {
  return items?.length ? items.join(', ') : 'Not provided';
}

export default function ResultsPage() {
  const location = useLocation();
  const persisted = useMemo(() => {
    try {
      const raw = sessionStorage.getItem(RESULTS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const shortlist = location.state?.shortlist || persisted?.shortlist;
  const requirements = location.state?.requirements || persisted?.requirements;

  useEffect(() => {
    if (!location.state?.shortlist) return;
    const payload = {
      shortlist: location.state.shortlist,
      requirements: location.state.requirements || null
    };

    try {
      sessionStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage errors (private mode/quota).
    }
  }, [location.state]);

  if (!shortlist) {
    return (
      <section className="card">
        <h2>No shortlist data found</h2>
        <p>Build a new shortlist from the home page to view results here.</p>
        <Link to="/">Go to Home</Link>
      </section>
    );
  }

  return (
    <section>
      <h2>Shortlist Results</h2>
      <div className="card">
        <h3 className="mb-3 text-lg font-semibold text-slate-900">Your Inputs</h3>
        <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          <p className="sm:col-span-2">
            <span className="font-semibold text-slate-900">Need:</span> {shortlist.need || 'Not provided'}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Budget:</span> {requirements?.budget_text || 'Not provided'}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Region:</span> {requirements?.region || 'Not provided'}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Team size:</span> {requirements?.team_size || 'Not provided'}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Must-have:</span> {formatList(requirements?.must_have_features)}
          </p>
          <p className="sm:col-span-2">
            <span className="font-semibold text-slate-900">Nice-to-have:</span> {formatList(requirements?.nice_to_have_features)}
          </p>
          <p className="sm:col-span-2">
            <span className="font-semibold text-slate-900">Compliance:</span> {formatList(requirements?.compliance_constraints)}
          </p>
        </div>
      </div>
      <ComparisonTable shortlist={shortlist} />
      <MarkdownExportButton shortlist={shortlist} requirements={requirements} />
    </section>
  );
}
