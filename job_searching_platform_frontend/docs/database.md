# Talenvia Database Design (SQL-first, Postgres-oriented)

## Scope

This document defines the core relational schema for Talenvia. It is SQL-first and maps cleanly onto Postgres. It is intentionally designed to support:

- User authentication and roles
- Skills-based profiles and job skill matching
- Job listings and searchable filters
- Application tracking with event timelines
- Mock tests (attempts + answers)
- Gamified challenges
- Notifications
- AI mentor sessions and messages

The frontend should treat this as backend implementation guidance; the actual frontend will rely on the REST contract in `docs/api.md`.

## Type and enum suggestions

Postgres enums (or constrained text with CHECK constraints) are recommended for stable, low-cardinality domains:

- `user_role`: `candidate`, `admin`
- `job_type`: `full_time`, `part_time`, `contract`, `internship`, `remote`
- `seniority`: `intern`, `junior`, `mid`, `senior`, `lead`
- `application_status`: `draft`, `submitted`, `interviewing`, `offer`, `rejected`, `withdrawn`
- `test_question_type`: `single_choice`, `multi_choice`, `free_text`
- `notification_type`: `application_update`, `job_recommendation`, `system`, `mentor`

If enums are avoided for migration flexibility, use `TEXT` with CHECK constraints.

## Tables

## users

Represents accounts and login identity.

### Key columns

- `id` UUID PK
- `email` CITEXT (or TEXT) unique, not null
- `password_hash` TEXT not null
- `full_name` TEXT not null
- `role` `user_role` not null default `candidate`
- `created_at` TIMESTAMPTZ not null default now()
- `updated_at` TIMESTAMPTZ not null default now()
- `last_login_at` TIMESTAMPTZ null

### Indexes

- Unique index on `email`
- Optional index on `role` for admin queries

## profiles

One-to-one extension of user for career info. Keep “profile” separate to avoid widening the users table and to simplify privacy controls later.

### Key columns

- `user_id` UUID PK, FK -> `users.id` (on delete cascade)
- `headline` TEXT null
- `summary` TEXT null
- `experience` JSONB not null default `[]`  
  Stored as JSONB for flexibility in representing experiences without multiple join tables early.
- `education` JSONB not null default `[]`
- `preferences` JSONB not null default `{}`  
  For location/job-type preferences, etc.
- `updated_at` TIMESTAMPTZ not null default now()

### Indexes

- Primary key on `user_id`

## skills

Canonical skill dictionary.

### Key columns

- `id` UUID PK
- `name` TEXT unique not null (normalized to lowercase)
- `created_at` TIMESTAMPTZ not null default now()

### Indexes

- Unique index on `name`

## user_skills (bridge)

Many-to-many between users (via profile) and skills.

### Key columns

- `user_id` UUID FK -> `users.id` (on delete cascade)
- `skill_id` UUID FK -> `skills.id`
- `proficiency` SMALLINT null (optional 1–5)
- `years` NUMERIC(4,1) null
- PK: (`user_id`, `skill_id`)

### Indexes

- Index on `skill_id` to support “find users with skill”
- Composite index on (`user_id`, `skill_id`) is the PK

## jobs

Job postings.

### Key columns

- `id` UUID PK
- `title` TEXT not null
- `company` TEXT not null
- `location` TEXT null
- `job_type` `job_type` not null
- `seniority` `seniority` null
- `salary_min` INTEGER null
- `salary_max` INTEGER null
- `currency` CHAR(3) null
- `description` TEXT not null
- `apply_url` TEXT null
- `posted_at` TIMESTAMPTZ not null
- `is_active` BOOLEAN not null default true
- `metadata` JSONB not null default `{}`  
  Useful for source, remote policy, tags, ingest details.
- `created_at` TIMESTAMPTZ not null default now()

### Indexes

- B-tree index on (`title`)
- B-tree index on (`location`)
- Composite index on (`title`, `location`) for common search patterns
- If using full-text search: GIN index on `to_tsvector('english', title || ' ' || company || ' ' || description)`

## job_skills (bridge)

Many-to-many between jobs and skills.

### Key columns

- `job_id` UUID FK -> `jobs.id` (on delete cascade)
- `skill_id` UUID FK -> `skills.id`
- PK: (`job_id`, `skill_id`)

### Indexes

- Index on `skill_id` for “find jobs needing skill”
- Index on `job_id` (covered by PK but sometimes a separate index helps depending on plan)

## applications

Applications created by users for jobs.

### Key columns

- `id` UUID PK
- `user_id` UUID FK -> `users.id` (on delete cascade)
- `job_id` UUID FK -> `jobs.id` (on delete restrict)
- `status` `application_status` not null default `draft`
- `notes` TEXT null
- `created_at` TIMESTAMPTZ not null default now()
- `updated_at` TIMESTAMPTZ not null default now()

### Constraints and indexes

- Unique constraint on (`user_id`, `job_id`) to prevent duplicates (optional; some users may apply multiple times, but typically not desired)
- Index on (`user_id`, `updated_at DESC`) for listing applications
- Index on (`job_id`) for analytics/admin use
- Index on (`status`) for filtering

## application_events

Timeline events for applications (status changes, notes, interview scheduling). This powers `/applications/:id/timeline`.

### Key columns

- `id` UUID PK
- `application_id` UUID FK -> `applications.id` (on delete cascade)
- `event_type` TEXT not null  
  Example values: `created`, `status_changed`, `note_added`, `interview_scheduled`
- `from_status` `application_status` null
- `to_status` `application_status` null
- `note` TEXT null
- `created_at` TIMESTAMPTZ not null default now()

### Indexes

- Index on (`application_id`, `created_at ASC`)

## tests

Test definitions.

### Key columns

- `id` UUID PK
- `title` TEXT not null
- `category` TEXT not null
- `estimated_minutes` INTEGER null
- `is_active` BOOLEAN not null default true
- `created_at` TIMESTAMPTZ not null default now()

### Indexes

- Index on (`category`)

## test_questions

Questions belonging to tests.

### Key columns

- `id` UUID PK
- `test_id` UUID FK -> `tests.id` (on delete cascade)
- `type` `test_question_type` not null
- `prompt` TEXT not null
- `choices` JSONB null  
  For choice questions, store an array of strings.
- `correct_answer` JSONB null  
  Store server-evaluable correct answer; do not expose to frontend.
- `difficulty` TEXT null
- `position` INTEGER not null default 0

### Indexes

- Index on (`test_id`, `position`)

## test_attempts

A user’s attempt at a test.

### Key columns

- `id` UUID PK
- `test_id` UUID FK -> `tests.id` (on delete cascade)
- `user_id` UUID FK -> `users.id` (on delete cascade)
- `started_at` TIMESTAMPTZ not null default now()
- `submitted_at` TIMESTAMPTZ null
- `duration_seconds` INTEGER null
- `score` NUMERIC(5,4) null
- `correct_count` INTEGER null
- `total_count` INTEGER null

### Indexes

- Index on (`user_id`, `started_at DESC`)
- Index on (`test_id`)

## test_answers

Answers within a test attempt.

### Key columns

- `id` UUID PK
- `attempt_id` UUID FK -> `test_attempts.id` (on delete cascade)
- `question_id` UUID FK -> `test_questions.id` (on delete restrict)
- `answer` JSONB not null  
  For single-choice: `{ "selectedChoiceIndex": 1 }`, for free-text: `{ "text": "..." }`
- `is_correct` BOOLEAN null (computed on submission)
- `created_at` TIMESTAMPTZ not null default now()

### Indexes

- Unique constraint on (`attempt_id`, `question_id`)
- Index on (`attempt_id`)

## challenges

Challenge definitions.

### Key columns

- `id` UUID PK
- `title` TEXT not null
- `description` TEXT not null
- `starts_at` TIMESTAMPTZ not null
- `ends_at` TIMESTAMPTZ not null
- `rules` JSONB not null default `{}`  
  For thresholds, scoring, evidence requirements.
- `created_at` TIMESTAMPTZ not null default now()

### Indexes

- Index on (`starts_at`)
- Index on (`ends_at`)

## challenge_participants

Users participating in challenges.

### Key columns

- `challenge_id` UUID FK -> `challenges.id` (on delete cascade)
- `user_id` UUID FK -> `users.id` (on delete cascade)
- `joined_at` TIMESTAMPTZ not null default now()
- `completed_at` TIMESTAMPTZ null
- `progress` JSONB not null default `{}`  
  For tracking progress metrics.
- PK: (`challenge_id`, `user_id`)

### Indexes

- Index on (`user_id`, `joined_at DESC`)
- Index on (`completed_at`) for completion queries

## notifications

Notifications for users.

### Key columns

- `id` UUID PK
- `user_id` UUID FK -> `users.id` (on delete cascade)
- `type` `notification_type` not null
- `title` TEXT not null
- `body` TEXT not null
- `created_at` TIMESTAMPTZ not null default now()
- `read_at` TIMESTAMPTZ null
- `payload` JSONB not null default `{}`  
  For deep links, related entity IDs.

### Indexes

- Index on (`user_id`, `created_at DESC`)
- Index on (`user_id`, `read_at`) to support unread queries
- Partial index on unread notifications is recommended:
  `WHERE read_at IS NULL`

## mentor_sessions

Conversation container for AI mentor chats.

### Key columns

- `id` UUID PK
- `user_id` UUID FK -> `users.id` (on delete cascade)
- `title` TEXT null
- `created_at` TIMESTAMPTZ not null default now()
- `updated_at` TIMESTAMPTZ not null default now()

### Indexes

- Index on (`user_id`, `updated_at DESC`)

## mentor_messages

Message log for mentor chat sessions.

### Key columns

- `id` UUID PK
- `session_id` UUID FK -> `mentor_sessions.id` (on delete cascade)
- `role` TEXT not null  
  Example values: `user`, `assistant`, `system`
- `content` TEXT not null
- `created_at` TIMESTAMPTZ not null default now()
- `payload` JSONB not null default `{}`  
  Useful for token usage, citations, safety flags, or tool calls.

### Indexes

- Index on (`session_id`, `created_at ASC`)

## Relationships summary

- `users` 1—1 `profiles`
- `users` N—M `skills` via `user_skills`
- `jobs` N—M `skills` via `job_skills`
- `users` 1—N `applications`
- `jobs` 1—N `applications`
- `applications` 1—N `application_events`
- `tests` 1—N `test_questions`
- `users` 1—N `test_attempts`
- `test_attempts` 1—N `test_answers`
- `challenges` N—M `users` via `challenge_participants`
- `users` 1—N `notifications`
- `users` 1—N `mentor_sessions` 1—N `mentor_messages`

## Notes on JSONB usage

JSONB is intentionally used where schema flexibility is valuable:

- `profiles.experience`, `profiles.education`, `profiles.preferences`
- `jobs.metadata`
- `challenges.rules`, `challenge_participants.progress`
- `notifications.payload`
- `mentor_messages.payload`
- `test_questions.choices`, `test_questions.correct_answer`, `test_answers.answer`

As the product matures, JSONB fields can be normalized if strong querying requirements emerge, but this baseline schema is sufficient for MVP while maintaining a clean relational core.
