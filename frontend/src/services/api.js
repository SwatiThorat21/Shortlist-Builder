const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    let payload = { error: { message: 'Request failed' } };
    try {
      payload = await response.json();
    } catch {
      // noop
    }
    const error = new Error(payload.error?.message || 'Request failed');
    error.status = response.status;
    error.code = payload.error?.code;
    error.details = payload.error?.details;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  buildShortlist: (payload) => request('/api/shortlists/build', { method: 'POST', body: JSON.stringify(payload) }),
  listShortlists: (limit = 5) => request(`/api/shortlists?limit=${limit}`),
  deleteShortlist: (id) => request(`/api/shortlists/${id}`, { method: 'DELETE' }),
  fetchStatus: async () => {
    const response = await fetch(`${API_BASE}/api/status`);
    const body = await response.json();
    return body;
  }
};
