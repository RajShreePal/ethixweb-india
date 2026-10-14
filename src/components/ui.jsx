import { Link } from 'react-router-dom';
export const Wrap = ({ children, className = '' }) => <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
export const Eyebrow = ({ children }) => <p className="text-sm font-semibold uppercase tracking-widest text-accent">{children}</p>;
export const H2 = ({ children }) => <h2 className="mt-3 max-w-3xl font-display text-3xl leading-tight sm:text-4xl">{children}</h2>;
export function Button({ to, variant = 'primary', children }) {
  const base = 'inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-semibold transition-colors';
  const styles = variant === 'primary' ? 'bg-accent text-white hover:bg-ink' : 'border border-current hover:bg-ink hover:text-paper';
  return <Link to={to} className={`${base} ${styles}`}>{children}</Link>;
}
