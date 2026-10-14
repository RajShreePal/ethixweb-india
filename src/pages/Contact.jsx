import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Wrap, Eyebrow } from '../components/ui.jsx';
import { FORM_SERVICES, BUDGETS, LINKS } from '../lib/content.js';
import usePageMeta from '../lib/usePageMeta.js';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const EMPTY = { name: '', email: '', phone: '', company: '', service: '', budget: '', message: '', consent: false, website: '' };

function check(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Enter a valid email address.';
  if (f.phone.trim() && !/^(?:(?:\+91|91|0)?[6-9]\d{9}|\+\d{8,15})$/.test(f.phone.replace(/[\s\-().]/g, ''))) e.phone = 'Enter a valid Indian mobile number, or an international number starting with +.';
  if (!f.service) e.service = 'Choose a service.';
  if (f.message.trim().length < 10) e.message = 'Tell us a little more (at least 10 characters).';
  if (!f.consent) e.consent = 'Please accept the privacy notice.';
  return e;
}

function Field({ id, label, error, optional, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">{label}{optional && <span className="font-normal text-muted"> (optional)</span>}</label>
      {children}
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-sm text-accent">{error}</p>}
    </div>
  );
}
const input = 'mt-1 w-full rounded-md border border-black/25 bg-white px-3 py-2.5 text-base';

export default function Contact() {
  usePageMeta('Contact', 'Tell Ethixweb about your project. Send an enquiry or book a 30-minute call.');
  const [params] = useSearchParams();
  const initial = FORM_SERVICES.some((s) => s.value === params.get('service')) ? params.get('service') : '';
  const [f, setF] = useState({ ...EMPTY, service: initial });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState('');
  const [status, setStatus] = useState('idle');
  const [token, setToken] = useState('');
  const box = useRef(null);
  const widgetId = useRef(null);

  useEffect(() => {
    if (!SITE_KEY) return undefined;
    const mount = () => {
      widgetId.current = window.turnstile.render(box.current, {
        sitekey: SITE_KEY,
        callback: setToken,
        'expired-callback': () => setToken(''),
        'error-callback': () => setToken(''),
      });
    };
    if (window.turnstile) mount();
    else {
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true;
      s.onload = mount;
      document.head.appendChild(s);
    }
    return () => { if (widgetId.current !== null && window.turnstile) window.turnstile.remove(widgetId.current); };
  }, []);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (status === 'sending') return;
    const errs = check(f);
    setErrors(errs);
    if (Object.keys(errs).length) { setBanner('Please fix the highlighted fields.'); return; }
    if (!token) { setBanner('Please complete the bot check before sending.'); return; }
    setStatus('sending'); setBanner('');
    try {
      const r = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, turnstileToken: token }) });
      const d = await r.json().catch(() => null);
      if (r.ok && d?.ok === true) { setStatus('done'); return; }
      if (d?.fields) setErrors(d.fields);
      setBanner(d?.error || 'Something went wrong. Please try again, or email us directly.');
    } catch {
      setBanner('We could not reach the server. Check your connection and try again.');
    }
    setStatus('idle'); setToken('');
    if (widgetId.current !== null && window.turnstile) window.turnstile.reset(widgetId.current);
  }

  return (
    <Wrap className="py-16 sm:py-20">
      <div className="grid gap-14 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-3 font-display text-4xl">Tell us about your project.</h1>
          <p className="mt-4 text-muted">Share what you want to improve. We will reply with sensible next steps, not a generic pitch.</p>
          <ul className="mt-8 space-y-3">
            <li><a className="font-semibold text-accent underline" href={`mailto:${LINKS.email}`}>{LINKS.email}</a></li>
            <li><a className="font-semibold text-accent underline" href={LINKS.calendly} target="_blank" rel="noopener noreferrer">Book a 30-minute call</a></li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          {status === 'done' ? (
            <div role="status" className="rounded-lg border border-black/10 bg-white p-8">
              <h2 className="font-display text-2xl">Thank you. We have your enquiry.</h2>
              <p className="mt-2 text-muted">It has been saved and our team will get back to you by email.</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-5">
              {banner && <p role="alert" className="rounded-md border border-accent bg-white p-3 text-sm text-accent">{banner}</p>}
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Name" error={errors.name}><input id="name" className={input} value={f.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined} maxLength={100} /></Field>
                <Field id="email" label="Business email" error={errors.email}><input id="email" type="email" className={input} value={f.email} onChange={set('email')} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined} maxLength={254} /></Field>
                <Field id="phone" label="Phone" optional error={errors.phone}><input id="phone" type="tel" className={input} value={f.phone} onChange={set('phone')} autoComplete="tel" placeholder="98765 43210 or +1 415 555 0123" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-err' : undefined} /></Field>
                <Field id="company" label="Company" optional error={errors.company}><input id="company" className={input} value={f.company} onChange={set('company')} autoComplete="organization" maxLength={120} /></Field>
                <Field id="service" label="Service of interest" error={errors.service}>
                  <select id="service" className={input} value={f.service} onChange={set('service')} aria-invalid={!!errors.service} aria-describedby={errors.service ? 'service-err' : undefined}>
                    <option value="">Select a service</option>{FORM_SERVICES.map((s) => <option key={s.value} value={s.value}>{s.title}</option>)}
                  </select></Field>
                <Field id="budget" label="Estimated budget" optional error={errors.budget}>
                  <select id="budget" className={input} value={f.budget} onChange={set('budget')}><option value="">Prefer not to say</option>{BUDGETS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}</select></Field>
              </div>
              <Field id="message" label="Project details" error={errors.message}><textarea id="message" rows={6} className={input} value={f.message} onChange={set('message')} maxLength={4000} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-err' : undefined} /></Field>

              {/* Honeypot: real visitors never see or fill this field. */}
              <div className="absolute -left-[9999px]" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} /></label></div>

              <div>
                <label className="flex items-start gap-3 text-sm"><input id="consent" type="checkbox" className="mt-1 h-4 w-4" checked={f.consent} onChange={set('consent')} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'consent-err' : undefined} />
                  <span>I agree to Ethixweb using these details to respond to my enquiry, as described in the <a className="underline" href={LINKS.privacy} target="_blank" rel="noopener noreferrer">privacy policy</a>.</span></label>
                {errors.consent && <p id="consent-err" role="alert" className="mt-1 text-sm text-accent">{errors.consent}</p>}
              </div>

              {SITE_KEY ? <div ref={box} /> : <p role="alert" className="text-sm text-accent">Bot protection is not configured (missing VITE_TURNSTILE_SITE_KEY), so the form cannot be submitted yet.</p>}
              <button type="submit" disabled={status === 'sending' || !SITE_KEY} className="rounded-md bg-accent px-7 py-3 font-semibold text-white hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60">
                {status === 'sending' ? 'Sending…' : 'Send enquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </Wrap>
  );
}
