import { Wrap, Eyebrow, Button } from '../components/ui.jsx';
import { LINKS } from '../lib/content.js';
import usePageMeta from '../lib/usePageMeta.js';

const POINTS = [
  ['Mobile-first by default', 'For many Indian customers the phone is the first and only screen. Layouts, forms and tap targets are designed for small screens first.'],
  ['Practical automation', 'We start with the repeated work that costs time, such as missed follow-ups and re-typed data, and automate that before anything ambitious.'],
  ['Fits Indian business workflows', 'Enquiries often arrive over calls, chats and forms. We connect these into one pipeline, and handle Indian mobile numbers and INR budgets in our own forms.'],
  ['Clear communication', 'Plain scope, reviewable stages and a documented handoff, so you always know what is being built and why.'],
];
export default function About() {
  usePageMeta('About', 'Ethixweb USA LLC, registered in Wyoming, with India as one of its hub locations. Our approach for Indian businesses.');
  return (
    <Wrap className="py-16 sm:py-20">
      <Eyebrow>About</Eyebrow>
      <h1 className="mt-3 max-w-3xl font-display text-4xl sm:text-5xl">A digital operations team, with India as one of our hubs.</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted">Ethixweb is operated by Ethixweb USA LLC, registered in Wyoming, United States. We work with teams across time zones, and India is one of our hub locations.</p>
      <div className="mt-14 grid gap-8 sm:grid-cols-2">
        {POINTS.map(([t, d]) => <div key={t} className="border-l-4 border-accent pl-5"><h2 className="font-display text-xl">{t}</h2><p className="mt-2 text-muted">{d}</p></div>)}
      </div>
      <div className="mt-14 rounded-lg bg-sand p-8">
        <h2 className="font-display text-2xl">What clients say</h2>
        <p className="mt-2 max-w-2xl text-muted">We would rather you read independent feedback than our own summary of it.</p>
        <p className="mt-4"><a className="font-semibold text-accent underline" href={LINKS.trustpilot} target="_blank" rel="noopener noreferrer">Read Ethixweb reviews on Trustpilot</a></p>
      </div>
      <div className="mt-10"><Button to="/contact">Talk to us</Button></div>
    </Wrap>
  );
}
