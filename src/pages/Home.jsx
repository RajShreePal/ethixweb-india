import { Link } from 'react-router-dom';
import { Wrap, Eyebrow, H2, Button } from '../components/ui.jsx';
import { SERVICES, LINKS } from '../lib/content.js';
import usePageMeta from '../lib/usePageMeta.js';

const PROBLEMS = [
  ['Missed calls and enquiries', 'AI receptionists and chat agents answer, qualify and book around the clock.'],
  ['Invisible on Google', 'Technical and local SEO so the right customers can find you.'],
  ['Disconnected tools', 'CRM integrations and automations that put leads, calls and calendars in one place.'],
  ['A slow, dated website', 'Fast, mobile-first sites built around a clear enquiry path.'],
  ['Unclear ad spend', 'Campaigns with conversion tracking, so spend is measured against enquiries.'],
];
const STEPS = [['Discover', 'We learn your business, customers and current tools.'], ['Strategize', 'We agree scope, priorities and how success is measured.'], ['Build', 'We design and develop in reviewable stages.'], ['Launch', 'We test, deploy and hand over with clear documentation.'], ['Improve', 'We support, measure and refine after launch.']];
const CONCEPTS = [
  ['Clinic enquiry and booking flow', 'Patients call after hours and bookings are missed.', 'An AI receptionist plus calendar and CRM integration.', 'AI receptionists'],
  ['Distributor order dashboard', 'Orders arrive over calls and spreadsheets.', 'A web application with order status and reporting.', 'Web applications'],
  ['Local services lead desk', 'Enquiries from ads, forms and calls sit in separate places.', 'One pipeline with tracked sources and automated follow-ups.', 'CRM integrations'],
];
const FAQ = [
  ['What do you work on?', 'AI receptionists, automation, websites, web applications, CRM integrations, SEO, advertising, and ongoing support.'],
  ['How does a project start?', 'Send an enquiry or book a 30-minute call. We discuss goals and current tools, then agree a scope.'],
  ['How long will it take?', 'It depends on scope. We give a timeline after discovery rather than quoting before we understand the work.'],
  ['What does it cost?', 'Pricing depends on scope, so we do not publish fixed prices. The enquiry form has budget ranges in INR to help us respond sensibly.'],
];

export default function Home() {
  usePageMeta('We run the tech. You run the business.', 'Ethixweb manages your digital operation: AI receptionists, automation, websites, CRM integrations, SEO and ads for growing Indian businesses.');
  return (
    <>
      <section className="bg-ink text-paper">
        <Wrap className="py-20 sm:py-28">
          <Eyebrow>Digital operations team for Indian businesses</Eyebrow>
          <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight sm:text-6xl">We run the tech. You run the business.</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">From AI receptionists and CRM integrations to websites, SEO and ads, one accountable team looks after the systems that bring in and handle enquiries.</p>
          <div className="mt-9 flex flex-wrap gap-4"><Button to="/contact">Start a project</Button><Button to="/services" variant="secondary">Explore services</Button></div>
        </Wrap>
      </section>

      <Wrap className="pt-20">
        <Eyebrow>What we do</Eyebrow><H2>Senior operators for the systems that grow the business.</H2>
        <ul className="mt-10 grid gap-px overflow-hidden rounded-lg border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <li key={s.value} className="bg-paper p-6"><h3 className="font-semibold">{s.title}</h3><p className="mt-2 text-sm text-muted">{s.summary}</p></li>
          ))}
        </ul>
        <p className="mt-6"><Link className="font-semibold text-accent underline" to="/services">See every service in detail</Link></p>
      </Wrap>

      <section className="mt-20 bg-sand py-20"><Wrap>
        <Eyebrow>Common problems</Eyebrow><H2>Where businesses lose enquiries, and how we address it.</H2>
        <dl className="mt-10 grid gap-6 sm:grid-cols-2">
          {PROBLEMS.map(([p, s]) => <div key={p} className="border-l-4 border-accent pl-5"><dt className="font-semibold">{p}</dt><dd className="mt-1 text-muted">{s}</dd></div>)}
        </dl>
      </Wrap></section>

      <Wrap className="pt-20">
        <Eyebrow>How it works</Eyebrow><H2>Discover, strategize, build, launch, improve.</H2>
        <ol className="mt-10 grid gap-6 sm:grid-cols-5">
          {STEPS.map(([t, d], i) => <li key={t}><span className="font-display text-3xl text-accent">0{i + 1}</span><h3 className="mt-2 font-semibold">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p></li>)}
        </ol>
      </Wrap>

      <Wrap className="pt-20">
        <Eyebrow>Illustrative concepts</Eyebrow><H2>How these solutions could look for an Indian business.</H2>
        <p className="mt-3 text-sm text-muted">These are concept projects, not client work. For feedback from real clients, see our <a className="underline" href={LINKS.trustpilot} target="_blank" rel="noopener noreferrer">Trustpilot reviews</a>.</p>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {CONCEPTS.map(([t, p, s, c]) => (
            <li key={t} className="rounded-lg border border-black/10 bg-white p-6">
              <span className="rounded bg-ink px-2 py-1 text-xs font-semibold text-paper">Concept</span>
              <h3 className="mt-4 font-display text-xl">{t}</h3>
              <p className="mt-3 text-sm"><strong>Problem:</strong> {p}</p><p className="mt-2 text-sm"><strong>Approach:</strong> {s}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-accent">{c}</p>
            </li>
          ))}
        </ul>
      </Wrap>

      <section className="mt-20 bg-ink py-20 text-paper"><Wrap className="grid gap-12 md:grid-cols-2">
        <div><Eyebrow>Why Ethixweb</Eyebrow><H2>Built like an internal technology team.</H2>
          <p className="mt-4 text-white/70">Strategy, design, development, automation, launch and support sit with one team, with clean architecture, secure defaults and a clear handoff.</p></div>
        <div><Eyebrow>For India</Eyebrow><h3 className="mt-3 font-display text-3xl">Made for how Indian businesses are reached.</h3>
          <p className="mt-4 text-white/70">Most enquiries start on a phone, so we design mobile-first. We build for startups, SMEs and professional firms, with INR budget ranges and Indian mobile-number handling in our own forms.</p>
          <p className="mt-3"><Link className="font-semibold underline" to="/about">Read our approach</Link></p></div>
      </Wrap></section>

      <Wrap className="pt-20">
        <Eyebrow>FAQ</Eyebrow><H2>Common questions.</H2>
        <div className="mt-8 max-w-3xl divide-y divide-black/10 border-y border-black/10">
          {FAQ.map(([q, a]) => <details key={q} className="py-4"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-2 text-muted">{a}</p></details>)}
        </div>
      </Wrap>

      <Wrap className="pt-20"><div className="rounded-lg bg-accent p-10 text-white sm:p-14">
        <h2 className="font-display text-3xl sm:text-4xl">Want to work with us?</h2>
        <p className="mt-3 max-w-xl text-white/90">Tell us about your business and what is slowing it down. We will reply with sensible next steps.</p>
        <div className="mt-7"><Link to="/contact" className="inline-flex rounded-md bg-white px-6 py-3 font-semibold text-ink hover:bg-ink hover:text-white">Discuss your project</Link></div>
      </div></Wrap>
    </>
  );
}
