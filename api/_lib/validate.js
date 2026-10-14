export const SERVICES = ['website-design','web-applications','ai-automation','ai-receptionist','crm-integrations','seo-growth','ads','maintenance-support','other'];
export const BUDGETS = ['under-1l','1l-3l','3l-10l','10l-plus','not-sure'];
export const STATUSES = ['new','contacted','qualified','closed'];

const clean = (v) => (typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim() : '');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizePhone(raw) {
  const s = clean(raw).replace(/[\s\-().]/g, '');
  if (!s) return { value: null };
  const india = s.match(/^(?:\+91|91|0)?([6-9]\d{9})$/);
  if (india) return { value: `+91${india[1]}` };
  if (/^\+\d{8,15}$/.test(s)) return { value: s };
  return { error: 'Enter a valid Indian mobile number or an international number starting with +.' };
}

export function validateLead(body) {
  const b = body && typeof body === 'object' ? body : {};
  const errors = {};
  const name = clean(b.name);
  const email = clean(b.email).toLowerCase();
  const company = clean(b.company);
  const message = clean(b.message);
  const phone = normalizePhone(b.phone);

  if (name.length < 2 || name.length > 100) errors.name = 'Enter your name (2-100 characters).';
  if (!EMAIL.test(email) || email.length > 254) errors.email = 'Enter a valid email address.';
  if (phone.error) errors.phone = phone.error;
  if (company.length > 120) errors.company = 'Company name is too long (max 120).';
  if (!SERVICES.includes(b.service)) errors.service = 'Choose a service.';
  if (b.budget && !BUDGETS.includes(b.budget)) errors.budget = 'Choose a valid budget range.';
  if (message.length < 10 || message.length > 4000) errors.message = 'Tell us about your project (10-4000 characters).';
  if (b.consent !== true) errors.consent = 'Please accept the privacy notice.';

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: { name, email, phone: phone.value, company: company || null, service: b.service, budget: b.budget || null, message },
  };
}

export function validateStatusUpdate(body) {
  const id = body && typeof body.id === 'string' ? body.id : '';
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { ok: false, error: 'Invalid lead id.' };
  if (!STATUSES.includes(body.status)) return { ok: false, error: 'Invalid status.' };
  return { ok: true, id, status: body.status };
}
