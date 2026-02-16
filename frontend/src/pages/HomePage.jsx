import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RequirementForm from '../components/RequirementForm.jsx';
import ProgressIndicator from '../components/ProgressIndicator.jsx';
import { api } from '../services/api.js';

const steps = ['vendor discovery', 'scraping vendor pages', 'extracting structured fields', 'scoring and ranking'];

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('');

  async function handleSubmit(payload) {
    setLoading(true);
    setError('');

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
      navigate('/results', { state: { shortlist: result, requirements: payload.requirements } });
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
      <div className={loading ? 'content-blur' : ''}>
        <RequirementForm onSubmit={handleSubmit} loading={loading} />
        {error ? <p className="error">{error}</p> : null}
      </div>
      <ProgressIndicator loading={loading} step={step} />
    </section>
  );
}
