import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('axios', () => ({
  default: {
    get: vi.fn()
  }
}));

vi.mock('dns/promises', () => ({
  default: {
    lookup: vi.fn()
  }
}));

vi.mock('../../src/db/cacheRepo.js', () => ({
  getCachedPage: vi.fn(),
  setCachedPage: vi.fn(async () => true)
}));

import axios from 'axios';
import dns from 'dns/promises';
import { fetchAndExtract } from '../../src/scraper/pageFetcher.js';
import { getCachedPage } from '../../src/db/cacheRepo.js';

describe('pageFetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns cached content without fetching', async () => {
    vi.mocked(getCachedPage).mockResolvedValueOnce('cached text');
    const result = await fetchAndExtract('https://example.com/pricing');
    expect(result).toBe('cached text');
    expect(vi.mocked(axios.get)).not.toHaveBeenCalled();
  });

  it('blocks local URLs', async () => {
    await expect(fetchAndExtract('http://localhost:3000')).rejects.toMatchObject({
      code: 'SCRAPE_URL_BLOCKED'
    });
  });

  it('rejects unsupported response content type', async () => {
    vi.mocked(getCachedPage).mockResolvedValueOnce(null);
    vi.mocked(dns.lookup).mockResolvedValueOnce([{ address: '93.184.216.34', family: 4 }]);
    vi.mocked(axios.get).mockResolvedValueOnce({
      status: 200,
      data: '{"ok":true}',
      headers: { 'content-type': 'application/json' }
    });

    await expect(fetchAndExtract('https://example.com/pricing')).rejects.toMatchObject({
      code: 'SCRAPE_CONTENT_TYPE_UNSUPPORTED'
    });
  });
});
