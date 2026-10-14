import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLead, normalizePhone, validateStatusUpdate } from '../api/_lib/validate.js';

const good = { name: 'Asha Rao', email: 'Asha@Example.com', phone: '98765 43210', service: 'seo-growth', budget: '1l-3l', message: 'We need local SEO help.', consent: true };

test('valid lead is normalised', () => {
  const r = validateLead(good);
  assert.equal(r.ok, true);
  assert.equal(r.data.email, 'asha@example.com');
  assert.equal(r.data.phone, '+919876543210');
});
test('rejects bad email, enum, missing consent, short message', () => {
  const r = validateLead({ ...good, email: 'x', service: 'nope', consent: false, message: 'hi' });
  assert.deepEqual(Object.keys(r.errors).sort(), ['consent', 'email', 'message', 'service']);
});
test('phone rules', () => {
  assert.equal(normalizePhone('12345').error !== undefined, true);
  assert.equal(normalizePhone('+14155550123').value, '+14155550123');
});
test('status update rejects unknown status and bad id', () => {
  assert.equal(validateStatusUpdate({ id: 'x', status: 'new' }).ok, false);
  assert.equal(validateStatusUpdate({ id: '11111111-1111-1111-1111-111111111111', status: 'hacked' }).ok, false);
});
