import { Fragment, useMemo, useState } from 'react';

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
      <h2 className="mb-3 text-xl font-semibold text-slate-900">Comparison</h2>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[860px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="w-[16%] px-3 py-2 text-left align-top text-sm font-semibold text-slate-800">Vendor</th>
              <th className="w-[26%] px-3 py-2 text-left align-top text-sm font-semibold text-slate-800">Price range</th>
              <th className="w-[7%] px-3 py-2 text-left align-top text-sm font-semibold text-slate-800">Score</th>
              <th className="w-[20%] px-3 py-2 text-left align-top text-sm font-semibold text-slate-800">Matched features</th>
              <th className="w-[23%] px-3 py-2 text-left align-top text-sm font-semibold text-slate-800">Risks</th>
              <th className="w-[4%] px-3 py-2 text-left align-top text-sm font-semibold text-slate-800">Exclude</th>
              <th className="w-[4%] px-3 py-2 text-left align-top text-sm font-semibold text-slate-800">Details</th>
            </tr>
          </thead>
          <tbody>
            {shortlist.vendors.map((vendor) => (
              <Fragment key={vendor.name}>
                <tr className="border-b border-slate-200/80 text-[15px] font-semibold text-slate-900">
                  <td className="px-3 py-2 align-top">{vendor.name}</td>
                  <td className="px-3 py-2 align-top break-words">{vendor.price_range}</td>
                  <td className="px-3 py-2 align-top">{vendor.score}</td>
                  <td className="px-3 py-2 align-top break-words">{vendor.matched_features.slice(0, 3).join(', ')}</td>
                  <td className="px-3 py-2 align-top break-words">{vendor.risks.slice(0, 2).join(', ')}</td>
                  <td className="px-3 py-2 align-top">
                    <input
                      type="checkbox"
                      checked={Boolean(excluded[vendor.name])}
                      onChange={(e) => setExcluded((cur) => ({ ...cur, [vendor.name]: e.target.checked }))}
                      aria-label={`Exclude ${vendor.name}`}
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <button
                      type="button"
                      className="rounded-md px-2 py-1 text-sm font-medium text-sky-700 transition hover:bg-sky-50 hover:text-sky-800"
                      onClick={() => setExpanded((cur) => ({ ...cur, [vendor.name]: !cur[vendor.name] }))}
                    >
                      {expanded[vendor.name] ? 'Hide' : 'Show'}
                    </button>
                  </td>
                </tr>
                <tr aria-hidden={!expanded[vendor.name]}>
                  <td className="px-3 pt-0 pb-2 align-top" colSpan={7}>
                    <div
                      className={`ml-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-sm font-normal text-slate-700 transition-all duration-300 ${
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
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-base text-slate-800"><strong>Ranking:</strong> {ranked.map((v) => v.name).join(' > ')}</p>
    </div>
  );
}
