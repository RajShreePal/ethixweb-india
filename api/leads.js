import { createHash } from 'node:crypto';
import { validateLead } from './_lib/validate.js';
import { db, json, rateLimited, clientIp, originAllowed } from './_lib/server.js';

async function turnstileOk(token, ip) {
  if (!token || typeof token !== 'string') return false;
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY || '', response: token, remoteip: ip }),
    });
    return (await r.json()).success === true;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, error: 'Method not allowed.' });
  }
  if (!originAllowed(req)) return json(res, 403, { ok: false, error: 'Origin not allowed.' });
  if (Number(req.headers['content-length'] || 0) > 16 * 1024) return json(res, 413, { ok: false, error: 'Request too large.' });

  const ip = clientIp(req);
  if (rateLimited(ip)) return json(res, 429, { ok: false, error: 'Too many requests. Please try again in a few minutes.' });

  const body = req.body && typeof req.body === 'object' ? req.body : {};

  // Honeypot: bots fill the hidden "website" field. Pretend success, store nothing.
  if (typeof body.website === 'string' && body.website.trim() !== '') return json(res, 200, { ok: true });

  const result = validateLead(body);
  if (!result.ok) return json(res, 422, { ok: false, error: 'Please correct the highlighted fields.', fields: result.errors });

  if (!(await turnstileOk(body.turnstileToken, ip))) {
    return json(res, 400, { ok: false, error: 'Bot check failed. Please refresh and try again.' });
  }

  const d = result.data;
  const dedupe_hash = createHash('sha256').update(`${d.email}|${d.service}|${d.message}`).digest('hex');

  try {
    const { error } = await db().from('leads').insert({ ...d, dedupe_hash, status: 'new' });
    // 23505 = same enquiry already stored; it IS persisted, so confirm without a second row.
    if (error && error.code !== '23505') throw error;
    return json(res, 201, { ok: true });
  } catch {
    console.error('lead insert failed');
    return json(res, 503, { ok: false, error: 'We could not save your enquiry right now. Please try again shortly.' });
  }
}
