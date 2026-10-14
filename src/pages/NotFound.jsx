import { Wrap, Button } from '../components/ui.jsx';
import usePageMeta from '../lib/usePageMeta.js';
export default function NotFound() {
  usePageMeta('Page not found', 'The page you are looking for does not exist.', { noindex: true });
  return (
    <Wrap className="py-28 text-center">
      <p className="font-display text-7xl text-accent">404</p>
      <h1 className="mt-4 font-display text-3xl">This page does not exist.</h1>
      <p className="mt-3 text-muted">The link may be old or mistyped.</p>
      <div className="mt-8 flex justify-center gap-4"><Button to="/">Back to home</Button><Button to="/contact" variant="secondary">Contact us</Button></div>
    </Wrap>
  );
}
