import { useState } from 'react';
import RequirementForm from '../components/RequirementForm.jsx';
import ProgressIndicator from '../components/ProgressIndicator.jsx';
import ComparisonTable from '../components/ComparisonTable.jsx';
import MarkdownExportButton from '../components/MarkdownExportButton.jsx';
import { api } from '../services/api.js';

const steps = ['vendor discovery', 'scraping vendor pages', 'extracting structured fields', 'scoring and ranking'];

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('');
  const [shortlist, setShortlist] = useState(null);
  const [requirements, setRequirements] = useState(null);

  async function handleSubmit(payload) {
    setLoading(true);
    setError('');
    setShortlist(null);
    setRequirements(payload.requirements);

    const timer = setInterval(() => {
      setStep((cur) => {
        const idx = steps.indexOf(cur);
        if (idx === -1 || idx === steps.length - 1) return steps[0];
        return steps[idx + 1];
      });
    }, 900);

    setStep(steps[0]);

    try {
      const result = await api.buildShortlist(payload);
      setShortlist(result);
    } catch (e) {
      if (e?.status === 429 || e?.code === 'GEMINI_RATE_LIMIT') {
        const retry = e?.details?.retryAfterSeconds;
        const retryText = typeof retry === 'number' ? ` Retry in about ${retry}s.` : '';
        setError(`Gemini API quota/rate limit reached.${retryText} Check API plan/billing, then try again.`);
      } else {
        setError(e.message || 'Failed to build shortlist');
      }
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  }

  return (
    <section>
      <RequirementForm onSubmit={handleSubmit} loading={loading} />
      <ProgressIndicator loading={loading} step={step} />
      {error ? <p className="error">{error}</p> : null}
      {shortlist ? (
        <>
          <ComparisonTable shortlist={shortlist} />
          <MarkdownExportButton shortlist={shortlist} requirements={requirements} />
        </>
      ) : null}
    </section>
  );
}
