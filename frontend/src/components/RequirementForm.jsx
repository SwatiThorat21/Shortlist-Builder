import { useMemo, useState } from 'react';

function toArray(input) {
  return input
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function RequirementForm({ onSubmit, loading }) {
  const [need, setNeed] = useState('');
  const [budgetText, setBudgetText] = useState('');
  const [region, setRegion] = useState('');
  const [mustHave, setMustHave] = useState('');
  const [niceToHave, setNiceToHave] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [compliance, setCompliance] = useState('');
  const [error, setError] = useState('');

  const payload = useMemo(() => ({
    need: need.trim(),
    requirements: {
      budget_text: budgetText.trim(),
      region: region.trim(),
      must_have_features: toArray(mustHave),
      nice_to_have_features: toArray(niceToHave),
      team_size: teamSize.trim(),
      compliance_constraints: toArray(compliance)
    }
  }), [need, budgetText, region, mustHave, niceToHave, teamSize, compliance]);

  function validate() {
    if (!payload.need) return 'Need cannot be empty';
    if (!payload.requirements.budget_text) return 'Budget is required';
    return '';
  }

  function handleSubmit(e) {
    e.preventDefault();
    const msg = validate();
    setError(msg);
    if (msg) return;
    onSubmit(payload);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-xl shadow-slate-200/60 backdrop-blur sm:p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Build Your Vendor Shortlist</h2>
        <p className="mt-2 text-sm text-slate-600">
          Share your needs and constraints. We&apos;ll find and score the best-fit vendors.
        </p>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
            <svg viewBox="0 0 24 24" width="16" height="16" className="h-4 w-4 text-sky-600" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 7h8M8 12h8M8 17h5" />
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
            What do you need?
          </span>
          <textarea
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            rows={4}
            required
            placeholder="Example: We need a CRM for a 20-person sales team with workflow automation and reporting."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          />
        </label>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
              <svg viewBox="0 0 24 24" width="16" height="16" className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1v22M17 5H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H6" />
              </svg>
              Budget range
            </span>
            <input
              value={budgetText}
              onChange={(e) => setBudgetText(e.target.value)}
              required
              placeholder="Example: $500 - $2,000/month"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
              <svg viewBox="0 0 24 24" width="16" height="16" className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
              </svg>
              Region
            </span>
            <input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="US, EU, APAC, or Global"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
              <svg viewBox="0 0 24 24" width="16" height="16" className="h-4 w-4 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 12 2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              Must-have features
            </span>
            <input
              value={mustHave}
              onChange={(e) => setMustHave(e.target.value)}
              placeholder="SSO, Role-based access, API access"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
              <svg viewBox="0 0 24 24" width="16" height="16" className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M2 12h20" />
              </svg>
              Nice-to-have features
            </span>
            <input
              value={niceToHave}
              onChange={(e) => setNiceToHave(e.target.value)}
              placeholder="AI insights, Mobile app, Custom dashboards"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
              <svg viewBox="0 0 24 24" width="16" height="16" className="h-4 w-4 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Team size
            </span>
            <input
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              placeholder="Example: 15 users"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
              <svg viewBox="0 0 24 24" width="16" height="16" className="h-4 w-4 text-rose-600" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z" />
              </svg>
              Compliance constraints
            </span>
            <input
              value={compliance}
              onChange={(e) => setCompliance(e.target.value)}
              placeholder="SOC 2, HIPAA, GDPR, ISO 27001"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </label>
        </div>
      </div>

      {error ? (
        <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 hover:from-sky-500 hover:to-blue-600 hover:shadow-xl hover:shadow-sky-500/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Building...' : 'Build Shortlist'}
      </button>
    </form>
  );
}
