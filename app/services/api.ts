const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';
const TOKEN_KEY = 'setho-api-token';


type RequestOptions = RequestInit & {authenticated?: boolean};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (options.authenticated) {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error('Faça login para continuar.');
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(API_URL + path, {...options, headers});
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? 'Não foi possível concluir a operação.');
  }
  return data as T;
}

export const tokenStorage = {
  save(token: string) {
    sessionStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    sessionStorage.removeItem(TOKEN_KEY);
  },
};

export const api = {
  health: () => request('/health'),

  auth: {
    register: (data: object) => request<{access_token: string; user: object}>('/auth/register', {
      method: 'POST', body: JSON.stringify(data),
    }),
    login: (email: string, password: string) =>
      request<{access_token: string; user: object}>('/auth/login', {
        method: 'POST', body: JSON.stringify({email, password}),
      }),
    me: () => request<{user: object}>('/auth/me', {authenticated: true}),
  },

  organizations: {
    list: (query = '') => request(`/organizations${query ? `?q=${encodeURIComponent(query)}` : ''}`),
    get: (id: number) => request(`/organizations/${id}`),
    update: (id: number, data: object) => request(`/organizations/${id}`, {
      method: 'PATCH', body: JSON.stringify(data), authenticated: true,
    }),
  },

  projects: {
    list: (organizationId?: number) =>
      request(`/projects${organizationId ? `?organization_id=${organizationId}` : ''}`),
    get: (id: number) => request(`/projects/${id}`),
    create: (data: object) => request('/projects', {
      method: 'POST', body: JSON.stringify(data), authenticated: true,
    }),
    update: (id: number, data: object) => request(`/projects/${id}`, {
      method: 'PATCH', body: JSON.stringify(data), authenticated: true,
    }),
  },

  opportunities: {
    list: (organizationId?: number) =>
      request(`/opportunities${organizationId ? `?organization_id=${organizationId}` : ''}`),
    create: (data: object) => request('/opportunities', {
      method: 'POST', body: JSON.stringify(data), authenticated: true,
    }),
    register: (id: number) => request(`/opportunities/${id}/registrations`, {
      method: 'POST', authenticated: true,
    }),
    mine: () => request('/opportunities/registrations/me', {authenticated: true}),
    organizationRegistrations: () =>
      request('/opportunities/registrations/organization', {authenticated: true}),
  },

  donations: {
    create: (data: object) => request('/donations', {
      method: 'POST', body: JSON.stringify(data), authenticated: true,
    }),
    mine: () => request('/donations/me', {authenticated: true}),
    received: () => request('/donations/received', {authenticated: true}),
  },
};
