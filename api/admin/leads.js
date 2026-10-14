import { validateStatusUpdate, STATUSES } from '../_lib/validate.js';
import { json, requireAdmin, originAllowed } from '../_lib/server.js';

const COLUMNS = 'id,name,email,phone,company,service,budget,message,status,created_at,updated_at';

export default async function handler(req, res) {
  if (!originAllowed(req)) return json(res, 403, { ok: false, error: 'Origin not allowed.' });

  let admin;
  try {
    admin = await requireAdmin(req);
  } catch {
    return json(res, 500, { ok: false, error: 'Server configuration error.' });
  }
  if (!admin) return json(res, 401, { ok: false, error: 'Unauthorized.' });
  const { supabase } = admin;

  if (req.method === 'GET') {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const size = Math.min(50, Math.max(1, parseInt(req.query.pageSize, 10) || 20));
    const from = (page - 1) * size;
    let q = supabase.from('leads').select(COLUMNS, { count: 'exact' }).order('created_at', { ascending: false }).range(from, from + size - 1);

    if (STATUSES.includes(req.query.status)) q = q.eq('status', req.query.status);
    const term = String(req.query.q || '').replace(/[%_,()\\*]/g, ' ').trim().slice(0, 100);
    if (term) q = q.or(`name.ilike.%${term}%,email.ilike.%${term}%`);

    const { data, count, error } = await q;
    if (error) return json(res, 500, { ok: false, error: 'Could not load enquiries.' });
    return json(res, 200, { ok: true, leads: data, total: count ?? 0, page, pageSize: size });
  }

  if (req.method === 'PATCH') {
    const v = validateStatusUpdate(req.body);
    if (!v.ok) return json(res, 422, { ok: false, error: v.error });
    const { data, error } = await supabase.from('leads').update({ status: v.status }).eq('id', v.id).select(COLUMNS).maybeSingle();
    if (error) return json(res, 500, { ok: false, error: 'Could not update status.' });
    if (!data) return json(res, 404, { ok: false, error: 'Lead not found.' });
    return json(res, 200, { ok: true, lead: data });
  }

  res.setHeader('Allow', 'GET, PATCH');
  return json(res, 405, { ok: false, error: 'Method not allowed.' });
}
