export default function ProgressIndicator({ loading, step }) {
  if (!loading) return null;
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="progress-modal">
        <p className="progress-title">Building your shortlist</p>
        <p className="progress-step">{step}</p>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" />
        </div>
      </div>
    </div>
  );
}
