create extension if not exists pgcrypto;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  phone text check (phone is null or char_length(phone) <= 20),
  company text check (company is null or char_length(company) <= 120),
  service text not null check (service in ('website-design','web-applications','ai-automation','ai-receptionist','crm-integrations','seo-growth','ads','maintenance-support','other')),
  budget text check (budget is null or budget in ('under-1l','1l-3l','3l-10l','10l-plus','not-sure')),
  message text not null check (char_length(message) between 10 and 4000),
  status text not null default 'new' check (status in ('new','contacted','qualified','closed')),
  dedupe_hash text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_status_idx on public.leads (status);
create index leads_email_idx on public.leads (lower(email));

create function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger leads_touch before update on public.leads
  for each row execute function public.touch_updated_at();

alter table public.leads enable row level security;
alter table public.admin_users enable row level security;

-- Anonymous visitors get no direct table access. Inserts go through /api/leads (service role).
revoke all on public.leads, public.admin_users from anon, authenticated;
grant select on public.leads to authenticated;
grant update (status) on public.leads to authenticated;
grant select on public.admin_users to authenticated;

create policy "admins read leads" on public.leads for select to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));
create policy "admins update lead status" on public.leads for update to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));
create policy "admins see own row" on public.admin_users for select to authenticated
  using (user_id = auth.uid());
-- Make someone an admin (run in SQL editor after creating them in Auth > Users):
-- insert into public.admin_users (user_id) select id from auth.users where email = 'owner@example.com';
