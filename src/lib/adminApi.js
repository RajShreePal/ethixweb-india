import { supabase } from './supabase.js';

export class AuthError extends Error {}

async function call(method, path, body) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new AuthError('Please sign in.');
  const r = await fetch(path, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const d = await r.json().catch(() => null);
  if (r.status === 401) throw new AuthError('Your session expired or this account is not authorised.');
  if (!r.ok || !d?.ok) throw new Error(d?.error || 'Request failed. Please try again.');
  return d;
}

export const listLeads = (params) => call('GET', `/api/admin/leads?${new URLSearchParams(params)}`);
export const updateStatus = (id, status) => call('PATCH', '/api/admin/leads', { id, status });
