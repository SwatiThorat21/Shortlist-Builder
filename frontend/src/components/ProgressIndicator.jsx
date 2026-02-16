export default function ProgressIndicator({ loading, step }) {
  if (!loading) return null;
  return (
    <div className="progress-box" role="status" aria-live="polite">
      <div className="spinner" />
      <p>Building shortlist: {step}</p>
    </div>
  );
}
