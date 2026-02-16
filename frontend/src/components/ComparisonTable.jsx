import { useMemo, useState } from 'react';

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
      <h2>Comparison</h2>
      <table>
        <thead>
          <tr>
            <th>Vendor</th>
            <th>Price range</th>
            <th>Score</th>
            <th>Matched features</th>
            <th>Risks</th>
            <th>Exclude</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {shortlist.vendors.map((vendor) => (
            <tr key={vendor.name}>
              <td>{vendor.name}</td>
              <td>{vendor.price_range}</td>
              <td>{vendor.score}</td>
              <td>{vendor.matched_features.slice(0, 3).join(', ')}</td>
              <td>{vendor.risks.slice(0, 2).join(', ')}</td>
              <td>
                <input
                  type="checkbox"
                  checked={Boolean(excluded[vendor.name])}
                  onChange={(e) => setExcluded((cur) => ({ ...cur, [vendor.name]: e.target.checked }))}
                  aria-label={`Exclude ${vendor.name}`}
                />
              </td>
              <td>
                <button type="button" onClick={() => setExpanded((cur) => ({ ...cur, [vendor.name]: !cur[vendor.name] }))}>
                  {expanded[vendor.name] ? 'Hide' : 'Show'}
                </button>
              </td>
            </tr>
          ))}
          {shortlist.vendors.map((vendor) => (
            expanded[vendor.name] ? (
                <tr key={`${vendor.name}-details`}>
                  <td colSpan={7}>
                    <strong>Missing:</strong> {vendor.missing_features.join(', ') || 'None'}
                    <br />
                    <strong>Evidence:</strong>
                    <ul>
                      {vendor.evidence.map((e, idx) => (
                        <li key={`${vendor.name}-e-${idx}`}>
                          <a href={e.url} target="_blank" rel="noreferrer">{e.url}</a> - "{e.quote}"
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
            ) : null
          ))}
        </tbody>
      </table>
      <p><strong>Ranking:</strong> {ranked.map((v) => v.name).join(' > ')}</p>
    </div>
  );
}
