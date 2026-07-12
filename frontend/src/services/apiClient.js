export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

export async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('perintis_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If using FormData, let the browser set the Content-Type with the correct boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('perintis_token');
    localStorage.removeItem('perintis_user');
    window.dispatchEvent(new Event('auth-expired'));
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || 'Terjadi kesalahan pada server');
    error.status = response.status;
    error.code = data?.code || 'UNKNOWN_ERROR';
    error.data = data;
    throw error;
  }

  return data;
}
