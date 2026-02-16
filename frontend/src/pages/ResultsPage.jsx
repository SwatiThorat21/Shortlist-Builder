import { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ComparisonTable from '../components/ComparisonTable.jsx';
import MarkdownExportButton from '../components/MarkdownExportButton.jsx';

const RESULTS_STORAGE_KEY = 'vendor_shortlist_results_v1';

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
      <ComparisonTable shortlist={shortlist} />
      <MarkdownExportButton shortlist={shortlist} requirements={requirements} />
    </section>
  );
}
