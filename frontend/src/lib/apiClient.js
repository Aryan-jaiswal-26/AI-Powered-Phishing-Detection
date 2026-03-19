const API_BASE = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json();
}

export function analyzeContent(payload) {
  return request('/analyze', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getHistory(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/history${query ? `?${query}` : ''}`);
}

export function deleteHistory(ids = []) {
  return request('/history', {
    method: 'DELETE',
    body: JSON.stringify({ ids })
  });
}

export function getSystemHealth() {
  return request('/system-health');
}

export function getVaultItems() {
  return request('/vault');
}

export function addVaultItem(payload) {
  return request('/vault', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function clearVaultItems() {
  return request('/vault', {
    method: 'DELETE'
  });
}
