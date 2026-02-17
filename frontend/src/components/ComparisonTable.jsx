import { Fragment, useMemo, useState } from 'react';

function scoreTone(score) {
  if (score >= 85) return 'bg-emerald-50 text-emerald-700';
  if (score >= 70) return 'bg-sky-50 text-sky-700';
  return 'bg-amber-50 text-amber-700';
}

export default function ComparisonTable({ shortlist }) {
  const [excluded, setExcluded] = useState({});
  const [expanded, setExpanded] = useState({});

  const ranked = useMemo(
    () => shortlist.vendors.filter((v) => !excluded[v.name]).sort((a, b) => b.score - a.score),
    [shortlist, excluded]
  );

  if (!shortlist.vendors.length) return <p>No vendors found.</p>;

  return (
    <div className="card">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-slate-900">Comparison</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {ranked.length} active / {shortlist.vendors.length} total
        </span>
      </div>
      <div className="space-y-3 md:hidden">
        {shortlist.vendors.map((vendor) => {
          const isExcluded = Boolean(excluded[vendor.name]);
          return (
          <article key={vendor.name} className={`rounded-xl border bg-white p-4 shadow-sm transition ${isExcluded ? 'border-slate-200/70 opacity-70' : 'border-slate-200'}`}>
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-base font-bold text-slate-900">{vendor.name}</h3>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${scoreTone(vendor.score)}`}>
                Score {vendor.score}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <p><span className="font-semibold text-slate-900">Price:</span> {vendor.price_range}</p>
              <p><span className="font-semibold text-slate-900">Matched:</span> {vendor.matched_features.slice(0, 3).join(', ') || 'None'}</p>
              <p><span className="font-semibold text-slate-900">Risks:</span> {vendor.risks.slice(0, 2).join(', ') || 'None listed'}</p>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={isExcluded}
                  onChange={(e) => setExcluded((cur) => ({ ...cur, [vendor.name]: e.target.checked }))}
                  aria-label={`Exclude ${vendor.name} mobile`}
                />
                Exclude
              </label>
              <button
                type="button"
                className="rounded-md px-2 py-1 text-sm font-medium text-sky-700 transition hover:bg-sky-50 hover:text-sky-800"
                onClick={() => setExpanded((cur) => ({ ...cur, [vendor.name]: !cur[vendor.name] }))}
              >
                {expanded[vendor.name] ? 'Hide details' : 'Show details'}
              </button>
            </div>

            {expanded[vendor.name] ? (
              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                <p className="mb-2">
                  <span className="font-medium text-slate-900">Missing must-have:</span>{' '}
                  {vendor.missing_features.join(', ') || 'None'}
                </p>
                <p className="mb-1 font-medium text-slate-900">Evidence</p>
                <ul className="list-disc space-y-1 pl-5">
                  {vendor.evidence.map((e, idx) => (
                    <li key={`${vendor.name}-mobile-e-${idx}`}>
                      <a href={e.url} target="_blank" rel="noreferrer" className="text-sky-700 underline">
                        {e.url}
                      </a>{' '}
                      <span>- "{e.quote}"</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>
        );})}
      </div>

      <div className="hidden w-full overflow-x-auto rounded-xl border border-slate-200 md:block">
        <table className="w-full min-w-[1020px] border-separate border-spacing-0 bg-white">
          <thead className="bg-slate-50">
            <tr>
              <th className="w-[18%] border-b border-slate-200 px-4 py-3 text-left align-top text-xs font-semibold uppercase tracking-wide text-slate-600">Vendor</th>
              <th className="w-[25%] border-b border-slate-200 px-4 py-3 text-left align-top text-xs font-semibold uppercase tracking-wide text-slate-600">Price range</th>
              <th className="w-[9%] border-b border-slate-200 px-4 py-3 text-left align-top text-xs font-semibold uppercase tracking-wide text-slate-600">Score</th>
              <th className="w-[19%] border-b border-slate-200 px-4 py-3 text-left align-top text-xs font-semibold uppercase tracking-wide text-slate-600">Matched features</th>
              <th className="w-[21%] border-b border-slate-200 px-4 py-3 text-left align-top text-xs font-semibold uppercase tracking-wide text-slate-600">Risks</th>
              <th className="w-[4%] border-b border-slate-200 px-4 py-3 text-left align-top text-xs font-semibold uppercase tracking-wide text-slate-600">Exclude</th>
              <th className="w-[4%] border-b border-slate-200 px-4 py-3 text-left align-top text-xs font-semibold uppercase tracking-wide text-slate-600">Details</th>
            </tr>
          </thead>
          <tbody>
            {shortlist.vendors.map((vendor) => {
              const isExcluded = Boolean(excluded[vendor.name]);
              return (
              <Fragment key={vendor.name}>
                <tr className={`text-[15px] text-slate-900 transition ${isExcluded ? 'bg-slate-50/50 text-slate-500' : 'hover:bg-sky-50/40'}`}>
                  <td className="border-b border-slate-200 px-4 py-3 align-top font-semibold">{vendor.name}</td>
                  <td className="border-b border-slate-200 px-4 py-3 align-top break-words text-sm">{vendor.price_range}</td>
                  <td className="border-b border-slate-200 px-4 py-3 align-top">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${scoreTone(vendor.score)}`}>
                      {vendor.score}
                    </span>
                  </td>
                  <td className="border-b border-slate-200 px-4 py-3 align-top text-sm text-slate-700">
                    {vendor.matched_features.slice(0, 4).join(', ') || 'No matched features'}
                  </td>
                  <td className="border-b border-slate-200 px-4 py-3 align-top text-sm text-slate-700">
                    {vendor.risks.slice(0, 3).join(', ') || 'No major risks listed'}
                  </td>
                  <td className="border-b border-slate-200 px-4 py-3 align-top">
                    <input
                      type="checkbox"
                      checked={isExcluded}
                      onChange={(e) => setExcluded((cur) => ({ ...cur, [vendor.name]: e.target.checked }))}
                      aria-label={`Exclude ${vendor.name}`}
                    />
                  </td>
                  <td className="border-b border-slate-200 px-4 py-3 align-top">
                    <button
                      type="button"
                      className="rounded-md border border-slate-300 px-2 py-1 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                      onClick={() => setExpanded((cur) => ({ ...cur, [vendor.name]: !cur[vendor.name] }))}
                    >
                      {expanded[vendor.name] ? 'Hide' : 'Show'}
                    </button>
                  </td>
                </tr>
                <tr aria-hidden={!expanded[vendor.name]}>
                  <td className="px-4 pt-0 pb-3 align-top" colSpan={7}>
                    <div
                      className={`overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-sm font-normal text-slate-700 transition-all duration-300 ${
                        expanded[vendor.name] ? 'max-h-[700px] opacity-100 p-4' : 'max-h-0 opacity-0 p-0'
                      }`}
                    >
                      <p className="mb-2">
                        <span className="font-medium text-slate-900">Missing must-have features:</span>{' '}
                        {vendor.missing_features.join(', ') || 'None'}
                      </p>
                      <p className="mb-2 font-medium text-slate-900">Evidence</p>
                      <ul className="list-disc space-y-1 pl-5">
                        {vendor.evidence.map((e, idx) => (
                          <li key={`${vendor.name}-e-${idx}`} className="leading-6">
                            <a
                              href={e.url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-medium text-sky-700 underline decoration-sky-300 underline-offset-2 hover:text-sky-800"
                            >
                              {e.url}
                            </a>{' '}
                            <span className="text-slate-600">- "{e.quote}"</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                </tr>
              </Fragment>
            );})}
          </tbody>
        </table>
      </div>
      {!ranked.length ? <p className="mt-3 text-sm text-slate-600">All vendors are currently excluded.</p> : null}
      <p className="mt-3 text-base text-slate-800"><strong>Ranking:</strong> {ranked.map((v) => v.name).join(' > ')}</p>
    </div>
  );
}
