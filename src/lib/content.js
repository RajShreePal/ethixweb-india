// Service values must match SERVICES in api/_lib/validate.js exactly.
export const SERVICES = [
  { value: 'ai-receptionist', title: 'AI receptionists', summary: 'Voice and chat agents that answer, qualify, route and book enquiries so your team can stay focused.', uses: ['Answering calls and chats outside office hours', 'Qualifying enquiries before they reach your team', 'Booking appointments into your calendar'] },
  { value: 'ai-automation', title: 'AI automation', summary: 'Workflow automation, internal copilots and data syncs built around how your team actually works.', uses: ['Moving enquiry data between tools automatically', 'Drafting routine replies for human review', 'Replacing repeated manual spreadsheet steps'] },
  { value: 'website-design', title: 'Website development', summary: 'Fast, mobile-first websites with clear positioning, conversion paths, analytics and SEO foundations.', uses: ['Redesigning a dated or slow website', 'Launching a new business or service line', 'Building focused campaign landing pages'] },
  { value: 'web-applications', title: 'Web applications', summary: 'Custom portals, dashboards, booking flows and software tools for daily operations.', uses: ['Customer or dealer portals', 'Internal dashboards and reporting views', 'Booking and request-management flows'] },
  { value: 'crm-integrations', title: 'CRM integrations', summary: 'HubSpot, GoHighLevel, Zapier, forms, calls and calendars connected into a single pipeline.', uses: ['Sending website enquiries straight into your CRM', 'Connecting call and calendar data to pipeline stages', 'Cleaning up disconnected lead tools'] },
  { value: 'seo-growth', title: 'SEO', summary: 'Technical SEO, local SEO, content systems and measurement aimed at durable organic demand.', uses: ['Fixing technical issues that hold a site back', 'Local visibility for city-based services', 'Tracking which pages bring real enquiries'] },
  { value: 'ads', title: 'Advertising', summary: 'Google and Meta campaigns tied to tracking, so spend can be judged against enquiries.', uses: ['Launching or restructuring search campaigns', 'Setting up conversion tracking', 'Reviewing where ad spend is going'] },
  { value: 'maintenance-support', title: 'Maintenance & support', summary: 'Fast fixes, updates, uptime care and reporting from a responsive team.', uses: ['Small site changes without long waits', 'Routine updates and monitoring', 'A named team to contact when something breaks'] },
];
export const FORM_SERVICES = [...SERVICES.map(({ value, title }) => ({ value, title })), { value: 'other', title: 'Something else' }];
export const BUDGETS = [
  { value: 'under-1l', label: 'Under ₹1 lakh' }, { value: '1l-3l', label: '₹1–3 lakh' },
  { value: '3l-10l', label: '₹3–10 lakh' }, { value: '10l-plus', label: '₹10 lakh+' }, { value: 'not-sure', label: 'Not sure yet' },
];
export const LINKS = {
  email: 'info@ethixweb.com',
  calendly: 'https://calendly.com/ethixweb-agency/30min',
  trustpilot: 'https://www.trustpilot.com/review/ethixweb.com',
  privacy: 'https://www.ethixweb.com/policies/privacy',
};
