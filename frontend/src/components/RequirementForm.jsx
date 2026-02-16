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
    <form onSubmit={handleSubmit} className="card">
      <h2>What do you need?</h2>
      <label>
        Need
        <textarea value={need} onChange={(e) => setNeed(e.target.value)} rows={3} required />
      </label>
      <label>
        Budget range (required)
        <input value={budgetText} onChange={(e) => setBudgetText(e.target.value)} required />
      </label>
      <label>
        Region
        <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="US, EU, APAC" />
      </label>
      <label>
        Must-have features (comma separated)
        <input value={mustHave} onChange={(e) => setMustHave(e.target.value)} />
      </label>
      <label>
        Nice-to-have features (comma separated)
        <input value={niceToHave} onChange={(e) => setNiceToHave(e.target.value)} />
      </label>
      <label>
        Team size
        <input value={teamSize} onChange={(e) => setTeamSize(e.target.value)} />
      </label>
      <label>
        Compliance constraints (comma separated)
        <input value={compliance} onChange={(e) => setCompliance(e.target.value)} placeholder="SOC2, HIPAA, GDPR" />
      </label>

      {error ? <p className="error">{error}</p> : null}
      <button type="submit" disabled={loading}>Build Shortlist</button>
    </form>
  );
}
