import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../services/api.js', () => ({
  api: {
    listShortlists: vi.fn(async () => ({
      items: [{ id: '1', need: 'Need A', created_at: new Date().toISOString(), results: { vendors: [] } }]
    })),
    deleteShortlist: vi.fn(async () => null)
  }
}));

import HistoryPage from '../pages/HistoryPage.jsx';

describe('HistoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads records', async () => {
    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Need A')).toBeInTheDocument();
    });
  });
});
