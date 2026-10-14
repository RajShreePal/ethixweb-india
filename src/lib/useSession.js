import { useEffect, useState } from 'react';
import { supabase } from './supabase.js';

// undefined = still loading, null = signed out, object = signed in
export default function useSession() {
  const [session, setSession] = useState(undefined);
  useEffect(() => {
    if (!supabase) { setSession(null); return undefined; }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  return session;
}
