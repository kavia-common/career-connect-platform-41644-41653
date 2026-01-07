# Supabase schema + RLS + seed (Talenvia)

This repo contains the frontend only, but we’ve prepared an implementation-ready Supabase Postgres schema matching `docs/database.md`.

## What was added

- SQL script: `docs/supabase_schema_seed.sql`
- It creates:
  - Enums: `user_role`, `job_type`, `seniority`, `application_status`, `test_question_type`, `notification_type`
  - Tables:
    - **auth.users** (Supabase Auth) as the canonical user table
    - `profiles`
    - `skills`, `user_skills`
    - `jobs`, `job_skills`
    - `applications`, `application_events`
    - `notifications`
    - `tests`, `test_questions`, `test_attempts`, `test_answers`
    - `challenges`, `challenge_participants`
    - `mentor_sessions`, `mentor_messages`
  - Views (to match generic names requested): `questions`, `attempts`, `answers`

## RLS policy approach (scoped by auth.uid())

- Public read tables:
  - `skills`: SELECT for all
  - `jobs`: SELECT where `is_active = true`
  - `job_skills`: SELECT for all
  - `tests`: SELECT where `is_active = true`
  - `test_questions`: SELECT for all
  - `challenges`: SELECT for all

- User-owned tables:
  - `profiles`: user can SELECT/INSERT/UPDATE only their own row (`user_id = auth.uid()`)
  - `user_skills`: user can CRUD only their own rows (`user_id = auth.uid()`)
  - `applications`: user can CRUD only their own rows (`user_id = auth.uid()`)
  - `application_events`: user can CRUD only if they own the parent application
  - `notifications`: user can SELECT/UPDATE/DELETE only their own rows
  - `test_attempts`: user can SELECT/INSERT/UPDATE only their own rows
  - `test_answers`: user can SELECT/INSERT/UPDATE only if they own the parent attempt
  - `challenge_participants`: user can SELECT/INSERT/UPDATE only their own rows
  - `mentor_sessions`: user can CRUD only their own rows
  - `mentor_messages`: user can SELECT/INSERT/DELETE only if they own the parent session

## Seed data included (for UI demo)

- Skills: react/javascript/typescript/css/nodejs/postgresql/docker/cicd/graphql/sql/powerbi/aws/terraform/kubernetes/testing/api design
- Jobs: 5 seeded jobs + job_skills mapping
- Tests: "Frontend Fundamentals" + "SQL Basics" + sample questions
- Challenges: "7-day Application Sprint" + "Mock Test Streak"

## How to run the SQL

1) Open **Supabase Dashboard** for your project  
2) Go to **SQL Editor**  
3) Create a **New query**  
4) Paste the full contents of `docs/supabase_schema_seed.sql`  
5) Run it

## Notes / gotchas

- The seed uses `uuid_generate_v5(uuid_ns_url(), ...)` for stable IDs. If your Supabase project doesn’t have `uuid_generate_v5`, either:
  - enable the extension (already included via `create extension if not exists "uuid-ossp";`), or
  - replace seeded IDs with `uuid_generate_v4()` and update the dependent inserts.
- Write access to public dictionaries (`skills`, `jobs`, etc.) is intentionally not granted to anon/authenticated users. Use the Supabase **service role** key or dashboard to manage them.
