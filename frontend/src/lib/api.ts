const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

interface RequestOptions extends RequestInit {
  body?: any;
}

const apiRequest = async (endpoint: string, options: RequestOptions = {}) => {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Something went wrong');
  }

  return response.json();
};

export const api = {
  get: (endpoint: string) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint: string, body: any) => apiRequest(endpoint, { method: 'POST', body }),
  put: (endpoint: string, body: any) => apiRequest(endpoint, { method: 'PUT', body }),
  delete: (endpoint: string) => apiRequest(endpoint, { method: 'DELETE' }),
};
