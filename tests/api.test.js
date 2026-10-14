import test from 'node:test';
import assert from 'node:assert/strict';
import leads from '../api/leads.js';
import adminLeads from '../api/admin/leads.js';

const mkRes = () => ({ code: 0, body: null, setHeader() {}, status(c) { this.code = c; return this; }, json(b) { this.body = b; return this; } });
const call = async (h, req) => { const res = mkRes(); await h({ headers: {}, query: {}, ...req }, res); return res; };

test('admin API: no token -> 401 for GET and PATCH', async () => {
  assert.equal((await call(adminLeads, { method: 'GET' })).code, 401);
  assert.equal((await call(adminLeads, { method: 'PATCH', body: { id: 'x', status: 'closed' } })).code, 401);
});
test('admin API: token with no server config never returns data', async () => {
  const r = await call(adminLeads, { method: 'GET', headers: { authorization: 'Bearer fake' } });
  assert.notEqual(r.code, 200);
});
test('leads API: GET -> 405', async () => assert.equal((await call(leads, { method: 'GET' })).code, 405));
test('leads API: invalid body -> 422 with field errors', async () => {
  const r = await call(leads, { method: 'POST', headers: { 'x-forwarded-for': '10.0.0.1' }, body: { name: '', email: 'bad' } });
  assert.equal(r.code, 422); assert.ok(r.body.fields.email);
});
test('leads API: honeypot stores nothing and returns generic ok', async () => {
  const r = await call(leads, { method: 'POST', headers: { 'x-forwarded-for': '10.0.0.2' }, body: { website: 'http://spam' } });
  assert.deepEqual([r.code, r.body.ok], [200, true]);
});
test('leads API: 6th request from one IP in the window -> 429', async () => {
  let r;
  for (let i = 0; i < 6; i++) r = await call(leads, { method: 'POST', headers: { 'x-forwarded-for': '10.0.0.3' }, body: { website: 'x' } });
  assert.equal(r.code, 429);
});
