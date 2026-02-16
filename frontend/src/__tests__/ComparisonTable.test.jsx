import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ComparisonTable from '../components/ComparisonTable.jsx';

describe('ComparisonTable', () => {
  it('recalculates ranking when vendor is excluded', () => {
    const shortlist = {
      vendors: [
        { name: 'A', price_range: '$10', score: 90, matched_features: ['x'], missing_features: [], risks: [], evidence: [] },
        { name: 'B', price_range: '$20', score: 80, matched_features: ['x'], missing_features: [], risks: [], evidence: [] }
      ]
    };

    render(<ComparisonTable shortlist={shortlist} />);
    expect(screen.getByText(/A > B/)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Exclude A'));
    expect(screen.getByText(/B/)).toBeInTheDocument();
  });
});
