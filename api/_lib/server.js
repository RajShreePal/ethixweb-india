import { createClient } from '@supabase/supabase-js';

export function db() {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('config');
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
}

export const json = (res, status, body) => {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(body);
};

const hits = new Map(); // best-effort per instance; see README "Known limitations"
export function rateLimited(key, max = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > max;
}

export const clientIp = (req) => (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';

export function originAllowed(req) {
  const allowed = process.env.ALLOWED_ORIGIN;
  return !allowed || req.headers.origin === allowed;
}

// Verifies the Supabase JWT, then checks the user is in admin_users.
export async function requireAdmin(req) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const supabase = db();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  const { data: row } = await supabase.from('admin_users').select('user_id').eq('user_id', data.user.id).maybeSingle();
  return row ? { supabase, user: data.user } : null;
}
