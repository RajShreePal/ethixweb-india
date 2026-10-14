import { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import useSession from '../lib/useSession.js';
import usePageMeta from '../lib/usePageMeta.js';
import { listLeads, updateStatus, AuthError } from '../lib/adminApi.js';
import { FORM_SERVICES, BUDGETS } from '../lib/content.js';

const STATUSES = ['new', 'contacted', 'qualified', 'closed'];
const PAGE_SIZE = 20;
const serviceName = (v) => FORM_SERVICES.find((s) => s.value === v)?.title || v;
const budgetName = (v) => BUDGETS.find((b) => b.value === v)?.label || '—';
const fmt = (d) => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

export default function Admin() {
  const session = useSession();
  const nav = useNavigate();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [qInput, setQInput] = useState('');
  const [q, setQ] = useState('');
  const [tick, setTick] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [open, setOpen] = useState(null);

  usePageMeta('Admin', 'Administrator dashboard.', { noindex: true });

  const signOut = useCallback(async (message) => {
    await supabase?.auth.signOut();
    nav('/admin/login', { replace: true, state: message ? { message } : undefined });
  }, [nav]);

  useEffect(() => {
    if (!session) return undefined;
    let live = true;
    setLoading(true); setError('');
    listLeads({ page, pageSize: PAGE_SIZE, ...(status && { status }), ...(q && { q }) })
      .then((d) => { if (live) { setRows(d.leads); setTotal(d.total); } })
      .catch((e) => { if (!live) return; if (e instanceof AuthError) signOut(e.message); else setError(e.message); })
      .finally(() => live && setLoading(false));
    return () => { live = false; };
  }, [session, page, status, q, tick, signOut]);

  async function change(lead, next) {
    setNotice(''); setError('');
    try {
      const { lead: saved } = await updateStatus(lead.id, next);
      setRows((r) => r.map((x) => (x.id === saved.id ? saved : x)));
      setOpen(saved);
      setNotice(`Status updated to "${saved.status}".`);
    } catch (e) {
      if (e instanceof AuthError) signOut(e.message); else setError(e.message);
    }
  }

  if (session === undefined) return <p className="p-8">Loading…</p>;
  if (!session) return <Navigate to="/admin/login" replace />;

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const ctl = 'rounded-md border border-black/25 bg-white px-3 py-2';
  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Enquiries</h1>
        <div className="flex gap-2">
          <button className={ctl} onClick={() => setTick((t) => t + 1)}>Refresh</button>
          <button className="rounded-md bg-ink px-4 py-2 text-paper" onClick={() => signOut()}>Log out</button>
        </div>
      </div>

      <form className="mt-6 flex flex-wrap gap-3" onSubmit={(e) => { e.preventDefault(); setPage(1); setQ(qInput.trim()); }}>
        <label className="sr-only" htmlFor="q">Search by name or email</label>
        <input id="q" className={`${ctl} min-w-60 flex-1`} placeholder="Search name or email" value={qInput} onChange={(e) => setQInput(e.target.value)} maxLength={100} />
        <label className="sr-only" htmlFor="st">Status</label>
        <select id="st" className={ctl} value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
          <option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className={ctl}>Search</button>
      </form>

      <div aria-live="polite" className="mt-4 min-h-6 text-sm">
        {notice && <span className="text-green-800">{notice}</span>}
        {error && <span role="alert" className="text-accent">{error}</span>}
      </div>

      <div className="mt-2 overflow-x-auto rounded-lg border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand"><tr>{['Name', 'Email', 'Company', 'Service', 'Status', 'Submitted'].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">Loading…</td></tr>}
            {!loading && !rows.length && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No enquiries match.</td></tr>}
            {!loading && rows.map((l) => (
              <tr key={l.id} className="border-t border-black/10 hover:bg-paper">
                <td className="px-4 py-3"><button className="font-semibold text-accent underline" onClick={() => { setNotice(''); setOpen(l); }}>{l.name}</button></td>
                <td className="px-4 py-3">{l.email}</td><td className="px-4 py-3">{l.company || '—'}</td>
                <td className="px-4 py-3">{serviceName(l.service)}</td><td className="px-4 py-3">{l.status}</td><td className="px-4 py-3 whitespace-nowrap">{fmt(l.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span>{total} total · page {page} of {pages}</span>
        <span className="flex gap-2">
          <button className={ctl} disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <button className={ctl} disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
        </span>
      </div>

      {open && (
        <section aria-label="Lead details" className="mt-8 rounded-lg border border-black/10 bg-white p-6">
          <div className="flex items-start justify-between gap-4"><h2 className="font-display text-2xl">{open.name}</h2><button className={ctl} onClick={() => setOpen(null)}>Close</button></div>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            {[['Email', open.email], ['Phone', open.phone || '—'], ['Company', open.company || '—'], ['Service', serviceName(open.service)], ['Budget', budgetName(open.budget)], ['Submitted', fmt(open.created_at)]].map(([k, v]) => <div key={k}><dt className="font-semibold">{k}</dt><dd className="break-words text-muted">{v}</dd></div>)}
          </dl>
          <p className="mt-4 text-sm font-semibold">Message</p><p className="mt-1 whitespace-pre-wrap text-sm">{open.message}</p>
          <label htmlFor="ls" className="mt-5 block text-sm font-semibold">Status</label>
          <select id="ls" className={ctl} value={open.status} onChange={(e) => change(open, e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        </section>
      )}
    </main>
  );
}
