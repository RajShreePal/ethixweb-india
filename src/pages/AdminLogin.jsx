import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import useSession from '../lib/useSession.js';
import usePageMeta from '../lib/usePageMeta.js';

export default function AdminLogin() {
  const session = useSession();
  const nav = useNavigate();
  const { state } = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(state?.message || '');
  const [busy, setBusy] = useState(false);
  usePageMeta('Admin sign in', 'Administrator sign in.', { noindex: true });

  if (session) return <Navigate to="/admin" replace />;

  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    if (!supabase) { setError('Supabase is not configured (missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY).'); return; }
    setBusy(true); setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (err) { setError('Invalid email or password.'); return; }
    nav('/admin', { replace: true });
  }

  const input = 'mt-1 w-full rounded-md border border-black/25 bg-white px-3 py-2.5';
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-5">
      <h1 className="font-display text-3xl">Admin sign in</h1>
      <p className="mt-2 text-sm text-muted">Authorised administrators only.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        {error && <p role="alert" className="rounded-md border border-accent bg-white p-3 text-sm text-accent">{error}</p>}
        <div><label htmlFor="email" className="text-sm font-semibold">Email</label><input id="email" type="email" required autoComplete="username" className={input} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><label htmlFor="pw" className="text-sm font-semibold">Password</label><input id="pw" type="password" required autoComplete="current-password" className={input} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <button disabled={busy} className="w-full rounded-md bg-accent px-6 py-3 font-semibold text-white hover:bg-ink disabled:opacity-60">{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </main>
  );
}
