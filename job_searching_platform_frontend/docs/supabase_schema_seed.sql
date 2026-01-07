-- Talenvia / Career Connect — Supabase Postgres schema + RLS + seed data
-- Source: docs/database.md (adapted for Supabase Auth + requested extra tables)
--
-- How to run:
-- 1) Supabase Dashboard -> SQL Editor -> New query -> paste this entire file -> Run
-- 2) Or via supabase CLI (if you have it): supabase db reset / supabase migration up
--
-- Notes:
-- - We use auth.users as the canonical user identity.
-- - "profiles" is a 1:1 extension table keyed by auth user id.
-- - Most user-owned tables have RLS enforcing auth.uid() ownership.
-- - Seed data is public/demo where appropriate (jobs, skills, tests, challenges).
--
-- Safety:
-- - This file uses CREATE IF NOT EXISTS patterns where possible.
-- - Re-running may conflict with PKs/unique constraints; seed uses ON CONFLICT where possible.

-- Ensure required extensions
create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- Enums (as recommended in docs/database.md)
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('candidate', 'admin');
  end if;

  if not exists (select 1 from pg_type where typname = 'job_type') then
    create type public.job_type as enum ('full_time', 'part_time', 'contract', 'internship', 'remote');
  end if;

  if not exists (select 1 from pg_type where typname = 'seniority') then
    create type public.seniority as enum ('intern', 'junior', 'mid', 'senior', 'lead');
  end if;

  if not exists (select 1 from pg_type where typname = 'application_status') then
    create type public.application_status as enum ('draft', 'submitted', 'interviewing', 'offer', 'rejected', 'withdrawn');
  end if;

  if not exists (select 1 from pg_type where typname = 'test_question_type') then
    create type public.test_question_type as enum ('single_choice', 'multi_choice', 'free_text');
  end if;

  if not exists (select 1 from pg_type where typname = 'notification_type') then
    create type public.notification_type as enum ('application_update', 'job_recommendation', 'system', 'mentor');
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- Core tables (auth.users is the "users" table)
-- -----------------------------------------------------------------------------

-- profiles: 1:1 with auth.users
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'candidate',
  headline text null,
  summary text null,
  experience jsonb not null default '[]'::jsonb,
  education jsonb not null default '[]'::jsonb,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- skills: canonical dictionary
create table if not exists public.skills (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- user_skills: bridge between users and skills
create table if not exists public.user_skills (
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete restrict,
  proficiency smallint null check (proficiency is null or (proficiency >= 1 and proficiency <= 5)),
  years numeric(4,1) null check (years is null or years >= 0),
  created_at timestamptz not null default now(),
  primary key (user_id, skill_id)
);

create index if not exists idx_user_skills_skill_id on public.user_skills(skill_id);

-- jobs
create table if not exists public.jobs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  company text not null,
  location text null,
  job_type public.job_type not null,
  seniority public.seniority null,
  salary_min integer null,
  salary_max integer null,
  currency char(3) null,
  description text not null,
  apply_url text null,
  posted_at timestamptz not null,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_jobs_title on public.jobs(title);
create index if not exists idx_jobs_location on public.jobs(location);
create index if not exists idx_jobs_title_location on public.jobs(title, location);
create index if not exists idx_jobs_active_posted_at on public.jobs(is_active, posted_at desc);

-- job_skills: bridge between jobs and skills
create table if not exists public.job_skills (
  job_id uuid not null references public.jobs(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete restrict,
  primary key (job_id, skill_id)
);

create index if not exists idx_job_skills_skill_id on public.job_skills(skill_id);

-- applications
create table if not exists public.applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete restrict,
  status public.application_status not null default 'draft',
  notes text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_applications_user_job unique (user_id, job_id)
);

create index if not exists idx_applications_user_updated_at on public.applications(user_id, updated_at desc);
create index if not exists idx_applications_job_id on public.applications(job_id);
create index if not exists idx_applications_status on public.applications(status);

-- application_events (timeline)
create table if not exists public.application_events (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid not null references public.applications(id) on delete cascade,
  event_type text not null,
  from_status public.application_status null,
  to_status public.application_status null,
  note text null,
  created_at timestamptz not null default now()
);

create index if not exists idx_application_events_app_created_at on public.application_events(application_id, created_at asc);

-- notifications
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz null,
  payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_notifications_user_created_at on public.notifications(user_id, created_at desc);
create index if not exists idx_notifications_user_read_at on public.notifications(user_id, read_at);
create index if not exists idx_notifications_user_unread on public.notifications(user_id, created_at desc) where read_at is null;

-- -----------------------------------------------------------------------------
-- Mock Tests domain (docs: tests, test_questions, test_attempts, test_answers)
-- Requested table names in task: tests, questions, attempts, answers
-- We'll keep docs naming as canonical and provide views for requested names.
-- -----------------------------------------------------------------------------

create table if not exists public.tests (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null,
  estimated_minutes integer null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_tests_category on public.tests(category);

create table if not exists public.test_questions (
  id uuid primary key default uuid_generate_v4(),
  test_id uuid not null references public.tests(id) on delete cascade,
  type public.test_question_type not null,
  prompt text not null,
  choices jsonb null,
  correct_answer jsonb null,
  difficulty text null,
  position integer not null default 0
);

create index if not exists idx_test_questions_test_position on public.test_questions(test_id, position);

create table if not exists public.test_attempts (
  id uuid primary key default uuid_generate_v4(),
  test_id uuid not null references public.tests(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  submitted_at timestamptz null,
  duration_seconds integer null,
  score numeric(5,4) null,
  correct_count integer null,
  total_count integer null
);

create index if not exists idx_test_attempts_user_started_at on public.test_attempts(user_id, started_at desc);
create index if not exists idx_test_attempts_test_id on public.test_attempts(test_id);

create table if not exists public.test_answers (
  id uuid primary key default uuid_generate_v4(),
  attempt_id uuid not null references public.test_attempts(id) on delete cascade,
  question_id uuid not null references public.test_questions(id) on delete restrict,
  answer jsonb not null,
  is_correct boolean null,
  created_at timestamptz not null default now(),
  constraint uq_test_answers_attempt_question unique (attempt_id, question_id)
);

create index if not exists idx_test_answers_attempt_id on public.test_answers(attempt_id);

-- Views to satisfy requested generic names: questions, attempts, answers
create or replace view public.questions as
select * from public.test_questions;

create or replace view public.attempts as
select * from public.test_attempts;

create or replace view public.answers as
select * from public.test_answers;

-- -----------------------------------------------------------------------------
-- Challenges domain
-- -----------------------------------------------------------------------------

create table if not exists public.challenges (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  rules jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_challenges_starts_at on public.challenges(starts_at);
create index if not exists idx_challenges_ends_at on public.challenges(ends_at);

create table if not exists public.challenge_participants (
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  completed_at timestamptz null,
  progress jsonb not null default '{}'::jsonb,
  primary key (challenge_id, user_id)
);

create index if not exists idx_challenge_participants_user_joined_at on public.challenge_participants(user_id, joined_at desc);
create index if not exists idx_challenge_participants_completed_at on public.challenge_participants(completed_at);

-- -----------------------------------------------------------------------------
-- Mentor chat domain
-- -----------------------------------------------------------------------------

create table if not exists public.mentor_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_mentor_sessions_user_updated_at on public.mentor_sessions(user_id, updated_at desc);

create table if not exists public.mentor_messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.mentor_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_mentor_messages_session_created_at on public.mentor_messages(session_id, created_at asc);

-- -----------------------------------------------------------------------------
-- Helper trigger to update updated_at
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_applications_updated_at on public.applications;
create trigger trg_applications_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

drop trigger if exists trg_mentor_sessions_updated_at on public.mentor_sessions;
create trigger trg_mentor_sessions_updated_at
before update on public.mentor_sessions
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- RLS setup
-- -----------------------------------------------------------------------------
-- Enable RLS
alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.user_skills enable row level security;
alter table public.jobs enable row level security;
alter table public.job_skills enable row level security;
alter table public.applications enable row level security;
alter table public.application_events enable row level security;
alter table public.notifications enable row level security;
alter table public.tests enable row level security;
alter table public.test_questions enable row level security;
alter table public.test_attempts enable row level security;
alter table public.test_answers enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_participants enable row level security;
alter table public.mentor_sessions enable row level security;
alter table public.mentor_messages enable row level security;

-- PROFILES: user can read/write own profile
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- SKILLS: publicly readable; only service role/admin should modify.
drop policy if exists "skills_select_all" on public.skills;
create policy "skills_select_all"
on public.skills for select
using (true);

-- (No insert/update/delete policy for anon/auth users)

-- USER_SKILLS: user can manage only their rows; can read only their rows.
drop policy if exists "user_skills_select_own" on public.user_skills;
create policy "user_skills_select_own"
on public.user_skills for select
using (auth.uid() = user_id);

drop policy if exists "user_skills_insert_own" on public.user_skills;
create policy "user_skills_insert_own"
on public.user_skills for insert
with check (auth.uid() = user_id);

drop policy if exists "user_skills_update_own" on public.user_skills;
create policy "user_skills_update_own"
on public.user_skills for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "user_skills_delete_own" on public.user_skills;
create policy "user_skills_delete_own"
on public.user_skills for delete
using (auth.uid() = user_id);

-- JOBS + JOB_SKILLS: publicly readable
drop policy if exists "jobs_select_all" on public.jobs;
create policy "jobs_select_all"
on public.jobs for select
using (is_active = true);

drop policy if exists "job_skills_select_all" on public.job_skills;
create policy "job_skills_select_all"
on public.job_skills for select
using (true);

-- APPLICATIONS: user owned
drop policy if exists "applications_select_own" on public.applications;
create policy "applications_select_own"
on public.applications for select
using (auth.uid() = user_id);

drop policy if exists "applications_insert_own" on public.applications;
create policy "applications_insert_own"
on public.applications for insert
with check (auth.uid() = user_id);

drop policy if exists "applications_update_own" on public.applications;
create policy "applications_update_own"
on public.applications for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "applications_delete_own" on public.applications;
create policy "applications_delete_own"
on public.applications for delete
using (auth.uid() = user_id);

-- APPLICATION_EVENTS: readable if user owns parent application; writable similarly
drop policy if exists "application_events_select_via_application_owner" on public.application_events;
create policy "application_events_select_via_application_owner"
on public.application_events for select
using (
  exists (
    select 1
    from public.applications a
    where a.id = application_events.application_id
      and a.user_id = auth.uid()
  )
);

drop policy if exists "application_events_insert_via_application_owner" on public.application_events;
create policy "application_events_insert_via_application_owner"
on public.application_events for insert
with check (
  exists (
    select 1
    from public.applications a
    where a.id = application_events.application_id
      and a.user_id = auth.uid()
  )
);

drop policy if exists "application_events_update_via_application_owner" on public.application_events;
create policy "application_events_update_via_application_owner"
on public.application_events for update
using (
  exists (
    select 1
    from public.applications a
    where a.id = application_events.application_id
      and a.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.applications a
    where a.id = application_events.application_id
      and a.user_id = auth.uid()
  )
);

drop policy if exists "application_events_delete_via_application_owner" on public.application_events;
create policy "application_events_delete_via_application_owner"
on public.application_events for delete
using (
  exists (
    select 1
    from public.applications a
    where a.id = application_events.application_id
      and a.user_id = auth.uid()
  )
);

-- NOTIFICATIONS: user owned
drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own"
on public.notifications for select
using (auth.uid() = user_id);

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own"
on public.notifications for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "notifications_delete_own" on public.notifications;
create policy "notifications_delete_own"
on public.notifications for delete
using (auth.uid() = user_id);

-- Tests and questions: publicly readable (active), attempts/answers are user-owned.
drop policy if exists "tests_select_active" on public.tests;
create policy "tests_select_active"
on public.tests for select
using (is_active = true);

drop policy if exists "test_questions_select_all" on public.test_questions;
create policy "test_questions_select_all"
on public.test_questions for select
using (true);

drop policy if exists "test_attempts_select_own" on public.test_attempts;
create policy "test_attempts_select_own"
on public.test_attempts for select
using (auth.uid() = user_id);

drop policy if exists "test_attempts_insert_own" on public.test_attempts;
create policy "test_attempts_insert_own"
on public.test_attempts for insert
with check (auth.uid() = user_id);

drop policy if exists "test_attempts_update_own" on public.test_attempts;
create policy "test_attempts_update_own"
on public.test_attempts for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "test_answers_select_via_attempt_owner" on public.test_answers;
create policy "test_answers_select_via_attempt_owner"
on public.test_answers for select
using (
  exists (
    select 1 from public.test_attempts ta
    where ta.id = test_answers.attempt_id and ta.user_id = auth.uid()
  )
);

drop policy if exists "test_answers_insert_via_attempt_owner" on public.test_answers;
create policy "test_answers_insert_via_attempt_owner"
on public.test_answers for insert
with check (
  exists (
    select 1 from public.test_attempts ta
    where ta.id = test_answers.attempt_id and ta.user_id = auth.uid()
  )
);

drop policy if exists "test_answers_update_via_attempt_owner" on public.test_answers;
create policy "test_answers_update_via_attempt_owner"
on public.test_answers for update
using (
  exists (
    select 1 from public.test_attempts ta
    where ta.id = test_answers.attempt_id and ta.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.test_attempts ta
    where ta.id = test_answers.attempt_id and ta.user_id = auth.uid()
  )
);

-- challenges: publicly readable; participation is user-owned
drop policy if exists "challenges_select_all" on public.challenges;
create policy "challenges_select_all"
on public.challenges for select
using (true);

drop policy if exists "challenge_participants_select_own" on public.challenge_participants;
create policy "challenge_participants_select_own"
on public.challenge_participants for select
using (auth.uid() = user_id);

drop policy if exists "challenge_participants_insert_own" on public.challenge_participants;
create policy "challenge_participants_insert_own"
on public.challenge_participants for insert
with check (auth.uid() = user_id);

drop policy if exists "challenge_participants_update_own" on public.challenge_participants;
create policy "challenge_participants_update_own"
on public.challenge_participants for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- mentor sessions/messages: user-owned via session ownership
drop policy if exists "mentor_sessions_select_own" on public.mentor_sessions;
create policy "mentor_sessions_select_own"
on public.mentor_sessions for select
using (auth.uid() = user_id);

drop policy if exists "mentor_sessions_insert_own" on public.mentor_sessions;
create policy "mentor_sessions_insert_own"
on public.mentor_sessions for insert
with check (auth.uid() = user_id);

drop policy if exists "mentor_sessions_update_own" on public.mentor_sessions;
create policy "mentor_sessions_update_own"
on public.mentor_sessions for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "mentor_sessions_delete_own" on public.mentor_sessions;
create policy "mentor_sessions_delete_own"
on public.mentor_sessions for delete
using (auth.uid() = user_id);

drop policy if exists "mentor_messages_select_via_session_owner" on public.mentor_messages;
create policy "mentor_messages_select_via_session_owner"
on public.mentor_messages for select
using (
  exists (
    select 1 from public.mentor_sessions s
    where s.id = mentor_messages.session_id and s.user_id = auth.uid()
  )
);

drop policy if exists "mentor_messages_insert_via_session_owner" on public.mentor_messages;
create policy "mentor_messages_insert_via_session_owner"
on public.mentor_messages for insert
with check (
  exists (
    select 1 from public.mentor_sessions s
    where s.id = mentor_messages.session_id and s.user_id = auth.uid()
  )
);

drop policy if exists "mentor_messages_delete_via_session_owner" on public.mentor_messages;
create policy "mentor_messages_delete_via_session_owner"
on public.mentor_messages for delete
using (
  exists (
    select 1 from public.mentor_sessions s
    where s.id = mentor_messages.session_id and s.user_id = auth.uid()
  )
);

-- -----------------------------------------------------------------------------
-- Seed data (skills, jobs, tests/questions, challenges)
-- -----------------------------------------------------------------------------

-- Seed skills (normalized lowercase)
insert into public.skills (name) values
  ('react'),
  ('javascript'),
  ('typescript'),
  ('css'),
  ('nodejs'),
  ('postgresql'),
  ('docker'),
  ('cicd'),
  ('graphql'),
  ('sql'),
  ('powerbi'),
  ('aws'),
  ('terraform'),
  ('kubernetes'),
  ('testing'),
  ('api design')
on conflict (name) do nothing;

-- Seed jobs
-- We insert jobs with deterministic UUIDs so job_skills can reference them.
-- Use uuid_generate_v5 to keep stable IDs per title/company.
-- If uuid-ossp doesn't include uuid_generate_v5 in your project, replace with uuid_generate_v4 and adjust job_skills accordingly.
with job_rows as (
  select
    uuid_generate_v5(uuid_ns_url(), 'job:nimbus-labs:frontend-engineer-react') as id,
    'Frontend Engineer (React)'::text as title,
    'Nimbus Labs'::text as company,
    'Remote (US)'::text as location,
    'full_time'::public.job_type as job_type,
    'mid'::public.seniority as seniority,
    110000::int as salary_min,
    145000::int as salary_max,
    'USD'::char(3) as currency,
    'Build modern React interfaces for a fast-growing SaaS platform with a strong design system culture.'::text as summary,
    'You will work closely with Product and Design to ship high-quality UI. Responsibilities include building reusable components, optimizing performance, and collaborating on frontend architecture.'::text as description,
    'https://example.com/apply/job-001'::text as apply_url,
    now() - interval '2 days' as posted_at,
    jsonb_build_object('source','seed','remotePolicy','remote') as metadata
  union all
  select
    uuid_generate_v5(uuid_ns_url(), 'job:cobalt-systems:backend-engineer-nodejs'),
    'Backend Engineer (Node.js)',
    'Cobalt Systems',
    'Austin, TX (Hybrid)',
    'full_time'::public.job_type,
    'senior'::public.seniority,
    135000,
    175000,
    'USD'::char(3),
    'Own backend services for job ingestion and search at scale. Focus on reliability and clean API contracts.',
    'You will design and implement APIs, data pipelines, and service architecture. You’ll partner with frontend to deliver consistent contracts.',
    'https://example.com/apply/job-002',
    now() - interval '4 days',
    jsonb_build_object('source','seed','remotePolicy','hybrid')
  union all
  select
    uuid_generate_v5(uuid_ns_url(), 'job:harborworks:fullstack-developer'),
    'Full Stack Developer',
    'HarborWorks',
    'New York, NY',
    'contract'::public.job_type,
    'mid'::public.seniority,
    80,
    110,
    'USD'::char(3),
    '6-month contract building customer-facing features and internal tooling with React + Node.',
    'You’ll build full-stack features end-to-end, contribute to a GraphQL schema, and help maintain a high-quality CI pipeline.',
    'https://example.com/apply/job-003',
    now() - interval '5 days',
    jsonb_build_object('source','seed')
  union all
  select
    uuid_generate_v5(uuid_ns_url(), 'job:northstar-talent:data-analyst'),
    'Data Analyst (SQL + BI)',
    'Northstar Talent',
    'London, UK',
    'full_time'::public.job_type,
    'junior'::public.seniority,
    40000,
    55000,
    'GBP'::char(3),
    'Help the team turn data into insights. Build dashboards, standardize metrics, and support decision-making.',
    'You’ll work with stakeholders to define metrics, develop dashboards, and validate data quality.',
    'https://example.com/apply/job-004',
    now() - interval '6 days',
    jsonb_build_object('source','seed')
  union all
  select
    uuid_generate_v5(uuid_ns_url(), 'job:vantaforge:devops-engineer'),
    'DevOps Engineer (Cloud Infrastructure)',
    'VantaForge',
    'Remote (EMEA)',
    'full_time'::public.job_type,
    'lead'::public.seniority,
    90000,
    120000,
    'EUR'::char(3),
    'Lead infrastructure improvements across environments with Terraform and Kubernetes, with a focus on security and observability.',
    'You’ll establish IaC patterns, standardize deployment workflows, and build reliable monitoring and alerting.',
    'https://example.com/apply/job-005',
    now() - interval '10 days',
    jsonb_build_object('source','seed','remotePolicy','remote')
)
insert into public.jobs (id, title, company, location, job_type, seniority, salary_min, salary_max, currency, description, apply_url, posted_at, metadata)
select id, title, company, location, job_type, seniority, salary_min, salary_max, currency, description, apply_url, posted_at, metadata
from job_rows
on conflict (id) do nothing;

-- job_skills mapping based on the above jobs + seeded skills
-- (Uses skill lookup by name)
insert into public.job_skills (job_id, skill_id)
select
  uuid_generate_v5(uuid_ns_url(), 'job:nimbus-labs:frontend-engineer-react'),
  s.id
from public.skills s
where s.name in ('react','javascript','typescript','css','api design')
on conflict do nothing;

insert into public.job_skills (job_id, skill_id)
select
  uuid_generate_v5(uuid_ns_url(), 'job:cobalt-systems:backend-engineer-nodejs'),
  s.id
from public.skills s
where s.name in ('nodejs','postgresql','docker','cicd','api design')
on conflict do nothing;

insert into public.job_skills (job_id, skill_id)
select
  uuid_generate_v5(uuid_ns_url(), 'job:harborworks:fullstack-developer'),
  s.id
from public.skills s
where s.name in ('react','nodejs','graphql','postgresql','testing')
on conflict do nothing;

insert into public.job_skills (job_id, skill_id)
select
  uuid_generate_v5(uuid_ns_url(), 'job:northstar-talent:data-analyst'),
  s.id
from public.skills s
where s.name in ('sql','powerbi')
on conflict do nothing;

insert into public.job_skills (job_id, skill_id)
select
  uuid_generate_v5(uuid_ns_url(), 'job:vantaforge:devops-engineer'),
  s.id
from public.skills s
where s.name in ('aws','terraform','kubernetes','docker')
on conflict do nothing;

-- Seed tests + questions
with t as (
  select uuid_generate_v5(uuid_ns_url(), 'test:frontend-fundamentals') as id,
         'Frontend Fundamentals'::text as title,
         'frontend'::text as category,
         30::int as estimated_minutes
  union all
  select uuid_generate_v5(uuid_ns_url(), 'test:sql-basics'),
         'SQL Basics',
         'data',
         25
)
insert into public.tests (id, title, category, estimated_minutes, is_active)
select id, title, category, estimated_minutes, true
from t
on conflict (id) do nothing;

-- Questions for Frontend Fundamentals
insert into public.test_questions (test_id, type, prompt, choices, correct_answer, difficulty, position)
values
(
  uuid_generate_v5(uuid_ns_url(), 'test:frontend-fundamentals'),
  'single_choice',
  'What does CORS stand for?',
  jsonb_build_array('Cross-Origin Resource Sharing','Cross-Origin Request Security','Core-Origin Resource System','Cross-Object Resource Sharing'),
  jsonb_build_object('selectedChoiceIndex', 0),
  'easy',
  1
),
(
  uuid_generate_v5(uuid_ns_url(), 'test:frontend-fundamentals'),
  'single_choice',
  'In React, which hook is primarily used for managing local component state?',
  jsonb_build_array('useMemo','useEffect','useState','useCallback'),
  jsonb_build_object('selectedChoiceIndex', 2),
  'easy',
  2
),
(
  uuid_generate_v5(uuid_ns_url(), 'test:frontend-fundamentals'),
  'free_text',
  'Briefly explain the difference between "props" and "state" in React.',
  null,
  null,
  'medium',
  3
)
on conflict do nothing;

-- Questions for SQL Basics
insert into public.test_questions (test_id, type, prompt, choices, correct_answer, difficulty, position)
values
(
  uuid_generate_v5(uuid_ns_url(), 'test:sql-basics'),
  'single_choice',
  'Which clause is used to filter rows in a SELECT statement?',
  jsonb_build_array('GROUP BY','WHERE','ORDER BY','HAVING'),
  jsonb_build_object('selectedChoiceIndex', 1),
  'easy',
  1
),
(
  uuid_generate_v5(uuid_ns_url(), 'test:sql-basics'),
  'single_choice',
  'Which index type is typically recommended for Postgres full-text search?',
  jsonb_build_array('B-tree','Hash','GIN','BRIN'),
  jsonb_build_object('selectedChoiceIndex', 2),
  'medium',
  2
)
on conflict do nothing;

-- Seed challenges
with c as (
  select uuid_generate_v5(uuid_ns_url(), 'challenge:7-day-application-sprint') as id,
         '7-day Application Sprint'::text as title,
         'Apply to 10 roles in 7 days. Track submissions and keep momentum.'::text as description,
         date_trunc('day', now()) + interval '1 day' as starts_at,
         date_trunc('day', now()) + interval '8 day' as ends_at,
         jsonb_build_object('applicationsTarget', 10, 'days', 7) as rules
  union all
  select uuid_generate_v5(uuid_ns_url(), 'challenge:mock-test-streak'),
         'Mock Test Streak',
         'Complete 3 mock tests this week to build confidence.',
         date_trunc('day', now()),
         date_trunc('day', now()) + interval '7 day',
         jsonb_build_object('testsTarget', 3, 'days', 7)
)
insert into public.challenges (id, title, description, starts_at, ends_at, rules)
select id, title, description, starts_at, ends_at, rules
from c
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- Convenience: create profile row automatically when a new auth user is created
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, role, updated_at)
  values (new.id, 'candidate', now())
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();

-- Ensure the function owner has privileges (Supabase typically sets this up).
-- End of script.
