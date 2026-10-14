import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Wrap, Button } from './ui.jsx';
import { SERVICES, LINKS } from '../lib/content.js';

const NAV = [['/', 'Home'], ['/services', 'Services'], ['/about', 'About'], ['/contact', 'Contact']];
const linkCls = ({ isActive }) => `py-2 text-base font-medium hover:text-accent ${isActive ? 'text-accent' : ''}`;

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">Skip to content</a>
      <header className="sticky top-0 z-40 border-b border-black/10 bg-paper/95">
        <Wrap className="flex h-16 items-center justify-between">
          <Link to="/" className="font-display text-2xl font-bold">Ethix<span className="text-accent">web</span> <span className="font-sans text-sm font-medium text-muted">India</span></Link>
          <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
            {NAV.map(([to, label]) => <NavLink key={to} to={to} end className={linkCls}>{label}</NavLink>)}
            <Button to="/contact">Start a project</Button>
          </nav>
          <button className="p-2 md:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </Wrap>
        {open && (
          <nav id="mobile-nav" aria-label="Mobile" className="flex flex-col gap-1 border-t border-black/10 px-5 py-4 md:hidden">
            {NAV.map(([to, label]) => <NavLink key={to} to={to} end className={linkCls}>{label}</NavLink>)}
            <div className="pt-2"><Button to="/contact">Start a project</Button></div>
          </nav>
        )}
      </header>
      <main id="main"><Outlet /></main>
      <footer className="mt-24 bg-ink text-paper">
        <Wrap className="grid gap-10 py-14 sm:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-bold">Ethix<span className="text-accent">web</span></p>
            <p className="mt-3 text-sm text-white/70">Ethixweb USA LLC. Registered in Wyoming, United States, with India as one of our hub locations.</p>
          </div>
          <div>
            <p className="font-semibold">Services</p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">{SERVICES.map((s) => <li key={s.value}><Link className="hover:text-white" to={`/services#${s.value}`}>{s.title}</Link></li>)}</ul>
          </div>
          <div>
            <p className="font-semibold">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li><a className="hover:text-white" href={`mailto:${LINKS.email}`}>{LINKS.email}</a></li>
              <li><a className="hover:text-white" href={LINKS.calendly} target="_blank" rel="noopener noreferrer">Book a 30-minute call</a></li>
              <li><a className="hover:text-white" href={LINKS.trustpilot} target="_blank" rel="noopener noreferrer">Reviews on Trustpilot</a></li>
              <li><a className="hover:text-white" href={LINKS.privacy} target="_blank" rel="noopener noreferrer">Privacy policy</a></li>
            </ul>
          </div>
        </Wrap>
        <p className="border-t border-white/10 py-5 text-center text-xs text-white/50">© 2026 Ethixweb. All rights reserved.</p>
      </footer>
    </>
  );
}
