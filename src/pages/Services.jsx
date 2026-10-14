import { Wrap, Eyebrow, Button } from '../components/ui.jsx';
import { SERVICES } from '../lib/content.js';
import usePageMeta from '../lib/usePageMeta.js';

export default function Services() {
  usePageMeta('Services', 'AI receptionists, automation, websites, web applications, CRM integrations, SEO, advertising and support from Ethixweb.');
  return (
    <Wrap className="py-16 sm:py-20">
      <Eyebrow>Services</Eyebrow>
      <h1 className="mt-3 max-w-3xl font-display text-4xl sm:text-5xl">One accountable team for your digital operation.</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted">Each service can stand alone or work together. Examples below show typical uses, not guaranteed results.</p>
      <div className="mt-14 divide-y divide-black/10 border-y border-black/10">
        {SERVICES.map((s) => (
          <section key={s.value} id={s.value} className="grid gap-6 py-10 md:grid-cols-3" aria-labelledby={`h-${s.value}`}>
            <div><h2 id={`h-${s.value}`} className="font-display text-2xl">{s.title}</h2><p className="mt-3 text-muted">{s.summary}</p></div>
            <div className="md:col-span-2"><p className="text-sm font-semibold uppercase tracking-wide text-accent">Typical uses</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">{s.uses.map((u) => <li key={u}>{u}</li>)}</ul>
              <div className="mt-6"><Button to={`/contact?service=${s.value}`} variant="secondary">Enquire about {s.title.toLowerCase()}</Button></div></div>
          </section>
        ))}
      </div>
    </Wrap>
  );
}
