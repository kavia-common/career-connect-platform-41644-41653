# Talenvia API Design (REST)

## Scope and conventions

This document defines an implementation-ready REST API contract for Talenvia. The frontend will call these endpoints using `REACT_APP_API_BASE` as the base URL.

Unless noted otherwise:

- All requests and responses use JSON.
- Authenticated endpoints require `Authorization: Bearer <accessToken>`.
- Time fields are ISO-8601 strings in UTC (e.g., `2026-01-07T06:00:00Z`).
- IDs are UUIDs unless otherwise specified.
- Errors use a consistent JSON shape.

### Base URL

The frontend should build requests as:

- `GET ${REACT_APP_API_BASE}/jobs?...`

### Headers

- `Content-Type: application/json` (for requests with bodies)
- `Authorization: Bearer <token>` (for authenticated requests)

### Standard error shape

On error, the API should return:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Skills must be a non-empty array",
    "details": { "field": "skills" }
  }
}
```

`code` should be stable for frontend handling (e.g., `UNAUTHORIZED`, `NOT_FOUND`, `RATE_LIMITED`).

## Authentication

### JWT strategy

- Access token: short-lived JWT used for `Authorization` header.
- Refresh token: recommended for production. This can be returned in the login response (and stored by the client) or set as an HttpOnly cookie by the server. The exact refresh endpoint is intentionally not mandated here, but the security notes in `docs/implementation_checklist.md` describe a recommended strategy.

### Role model

Users have a `role` field:

- `candidate` (default)
- `admin` (reserved for later moderation/admin features)

The role is returned as part of `/auth/me` to enable conditional UI later.

## Pagination, filtering, and sorting

### Pagination convention

For collection endpoints:

- Request query params: `page` (1-based), `pageSize`
- Response includes `items` and `pageInfo`

Example response:

```json
{
  "items": [ /* ... */ ],
  "pageInfo": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 1250,
    "totalPages": 63
  }
}
```

### Rate limiting convention (especially AI endpoints)

If a request is rate limited, return:

- HTTP `429`
- `Retry-After` header (seconds)
- error payload with `code = RATE_LIMITED`

## Endpoint definitions

## Auth

### POST /auth/register

Registers a new user account.

#### Request body

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!",
  "fullName": "Alex Candidate"
}
```

#### Response (201)

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "Alex Candidate",
    "role": "candidate",
    "createdAt": "2026-01-07T06:00:00Z"
  },
  "accessToken": "jwt",
  "refreshToken": "optional_refresh_token"
}
```

### POST /auth/login

Authenticates a user and returns tokens.

#### Request body

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

#### Response (200)

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "Alex Candidate",
    "role": "candidate"
  },
  "accessToken": "jwt",
  "refreshToken": "optional_refresh_token"
}
```

### GET /auth/me

Returns the currently authenticated user.

#### Auth

Required.

#### Response (200)

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "Alex Candidate",
    "role": "candidate"
  }
}
```

## Jobs

### GET /jobs

Lists jobs with filters. Intended for the Job Search page.

#### Query parameters

- `q` (string, optional): full-text search across title/company/description
- `skills` (comma-separated string, optional): e.g., `react,nodejs`
- `location` (string, optional)
- `type` (string, optional): `full_time | part_time | contract | internship | remote`
- `seniority` (string, optional): `intern | junior | mid | senior | lead`
- `page` (number, default 1)
- `pageSize` (number, default 20)

#### Response (200)

```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Frontend Engineer",
      "company": "Example Inc",
      "location": "London, UK",
      "jobType": "full_time",
      "seniority": "mid",
      "salaryMin": 60000,
      "salaryMax": 80000,
      "currency": "GBP",
      "postedAt": "2026-01-05T12:00:00Z",
      "skills": ["react", "typescript"],
      "summary": "Short listing summary suitable for cards"
    }
  ],
  "pageInfo": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 1250,
    "totalPages": 63
  }
}
```

### GET /jobs/:id

Returns full details of a job.

#### Path parameters

- `id` (UUID): job identifier

#### Response (200)

```json
{
  "job": {
    "id": "uuid",
    "title": "Frontend Engineer",
    "company": "Example Inc",
    "location": "London, UK",
    "jobType": "full_time",
    "seniority": "mid",
    "salaryMin": 60000,
    "salaryMax": 80000,
    "currency": "GBP",
    "postedAt": "2026-01-05T12:00:00Z",
    "description": "Long description in plain text or sanitized HTML",
    "applyUrl": "https://example.com/apply",
    "skills": ["react", "typescript"],
    "metadata": {
      "source": "imported",
      "remotePolicy": "hybrid"
    }
  }
}
```

## Applications

### GET /applications

Lists the current user’s applications.

#### Auth

Required.

#### Query parameters

- `status` (optional): `draft | submitted | interviewing | offer | rejected | withdrawn`
- `page`, `pageSize`

#### Response (200)

```json
{
  "items": [
    {
      "id": "uuid",
      "jobId": "uuid",
      "jobTitle": "Frontend Engineer",
      "company": "Example Inc",
      "status": "submitted",
      "createdAt": "2026-01-06T10:00:00Z",
      "updatedAt": "2026-01-06T10:00:00Z"
    }
  ],
  "pageInfo": { "page": 1, "pageSize": 20, "totalItems": 3, "totalPages": 1 }
}
```

### POST /applications

Creates a new application for the authenticated user.

#### Auth

Required.

#### Request body

```json
{
  "jobId": "uuid",
  "notes": "Optional notes",
  "status": "draft"
}
```

#### Response (201)

```json
{
  "application": {
    "id": "uuid",
    "jobId": "uuid",
    "userId": "uuid",
    "status": "draft",
    "notes": "Optional notes",
    "createdAt": "2026-01-06T10:00:00Z",
    "updatedAt": "2026-01-06T10:00:00Z"
  }
}
```

### GET /applications/:id

Fetches a single application.

#### Auth

Required.

#### Response (200)

```json
{
  "application": {
    "id": "uuid",
    "jobId": "uuid",
    "userId": "uuid",
    "status": "submitted",
    "notes": "Optional notes",
    "createdAt": "2026-01-06T10:00:00Z",
    "updatedAt": "2026-01-07T09:00:00Z"
  }
}
```

### PUT /applications/:id

Updates application fields.

#### Auth

Required.

#### Request body

```json
{
  "status": "interviewing",
  "notes": "Recruiter call scheduled"
}
```

#### Response (200)

```json
{
  "application": {
    "id": "uuid",
    "status": "interviewing",
    "notes": "Recruiter call scheduled",
    "updatedAt": "2026-01-07T09:00:00Z"
  }
}
```

### DELETE /applications/:id

Deletes an application.

#### Auth

Required.

#### Response (204)

No body.

### GET /applications/:id/timeline

Returns a timeline of application events.

#### Auth

Required.

#### Response (200)

```json
{
  "items": [
    {
      "id": "uuid",
      "applicationId": "uuid",
      "eventType": "status_changed",
      "fromStatus": "submitted",
      "toStatus": "interviewing",
      "note": "Recruiter call scheduled",
      "createdAt": "2026-01-07T09:00:00Z"
    }
  ]
}
```

## Profiles

### GET /profiles/me

Returns the authenticated user’s profile.

#### Auth

Required.

#### Response (200)

```json
{
  "profile": {
    "userId": "uuid",
    "headline": "Frontend Engineer",
    "summary": "Short professional summary",
    "experience": [
      {
        "company": "Example Inc",
        "title": "Engineer",
        "startDate": "2023-01-01",
        "endDate": null,
        "highlights": ["Built UI systems"]
      }
    ],
    "education": [
      {
        "school": "Example University",
        "degree": "BSc Computer Science",
        "startYear": 2018,
        "endYear": 2022
      }
    ],
    "skills": ["react", "typescript", "css"],
    "updatedAt": "2026-01-07T06:00:00Z"
  }
}
```

### PUT /profiles/skills

Updates the authenticated user’s skills. This is a targeted endpoint to simplify the UI.

#### Auth

Required.

#### Request body

```json
{
  "skills": ["react", "typescript", "nodejs"]
}
```

#### Response (200)

```json
{
  "profile": {
    "userId": "uuid",
    "skills": ["react", "typescript", "nodejs"],
    "updatedAt": "2026-01-07T06:00:00Z"
  }
}
```

## Mock Tests

### GET /tests

Lists available mock tests.

#### Auth

Required.

#### Query parameters

- `page`, `pageSize`

#### Response (200)

```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Frontend Fundamentals",
      "category": "frontend",
      "questionCount": 20,
      "estimatedMinutes": 30
    }
  ],
  "pageInfo": { "page": 1, "pageSize": 20, "totalItems": 10, "totalPages": 1 }
}
```

### GET /tests/:id

Gets test detail including questions.

#### Auth

Required.

#### Response (200)

```json
{
  "test": {
    "id": "uuid",
    "title": "Frontend Fundamentals",
    "category": "frontend",
    "questions": [
      {
        "id": "uuid",
        "type": "single_choice",
        "prompt": "What does CORS stand for?",
        "choices": ["...", "..."],
        "difficulty": "easy"
      }
    ]
  }
}
```

### POST /tests/:id/submit

Submits a test attempt.

#### Auth

Required.

#### Request body

```json
{
  "answers": [
    { "questionId": "uuid", "selectedChoiceIndex": 1 }
  ],
  "durationSeconds": 1400
}
```

#### Response (200)

```json
{
  "attempt": {
    "id": "uuid",
    "testId": "uuid",
    "userId": "uuid",
    "score": 0.85,
    "correctCount": 17,
    "totalCount": 20,
    "submittedAt": "2026-01-07T06:10:00Z"
  }
}
```

## Challenges

### GET /challenges

Lists gamified challenges.

#### Auth

Required.

#### Query parameters

- `status` (optional): `active | upcoming | completed`
- `page`, `pageSize`

#### Response (200)

```json
{
  "items": [
    {
      "id": "uuid",
      "title": "7-day Application Sprint",
      "description": "Apply to 10 roles in 7 days",
      "startsAt": "2026-01-08T00:00:00Z",
      "endsAt": "2026-01-15T00:00:00Z"
    }
  ],
  "pageInfo": { "page": 1, "pageSize": 20, "totalItems": 4, "totalPages": 1 }
}
```

### POST /challenges/:id/join

Joins a challenge.

#### Auth

Required.

#### Response (200)

```json
{
  "participant": {
    "challengeId": "uuid",
    "userId": "uuid",
    "joinedAt": "2026-01-07T06:00:00Z",
    "completedAt": null
  }
}
```

### POST /challenges/:id/complete

Marks a challenge as completed for the authenticated user (or records completion).

#### Auth

Required.

#### Request body (optional)

```json
{
  "evidence": { "applicationsSubmitted": 10 }
}
```

#### Response (200)

```json
{
  "participant": {
    "challengeId": "uuid",
    "userId": "uuid",
    "completedAt": "2026-01-15T00:00:00Z"
  }
}
```

## Notifications

### GET /notifications

Lists notifications for the authenticated user.

#### Auth

Required.

#### Query parameters

- `unreadOnly` (boolean, optional)
- `page`, `pageSize`

#### Response (200)

```json
{
  "items": [
    {
      "id": "uuid",
      "type": "application_update",
      "title": "Application status updated",
      "body": "Your application moved to interviewing.",
      "createdAt": "2026-01-07T06:00:00Z",
      "readAt": null
    }
  ],
  "pageInfo": { "page": 1, "pageSize": 20, "totalItems": 5, "totalPages": 1 }
}
```

### POST /notifications/mark-read

Marks one or more notifications as read.

#### Auth

Required.

#### Request body

```json
{
  "ids": ["uuid", "uuid"]
}
```

#### Response (200)

```json
{
  "updated": 2
}
```

## AI Matching

### POST /ai/match

Returns a ranked list of jobs given a profile snapshot and preferences. Intended to power recommendations on Dashboard/Job Search.

#### Auth

Required.

#### Rate limit

Recommended: strict (e.g., 30 requests/minute per user). The server should return 429 on excess.

#### Request body

```json
{
  "profile": {
    "skills": ["react", "typescript"],
    "experienceYears": 3,
    "seniority": "mid"
  },
  "preferences": {
    "location": "London",
    "jobType": "full_time"
  }
}
```

#### Response (200)

```json
{
  "matches": [
    {
      "jobId": "uuid",
      "score": 0.92,
      "reasons": ["Skills match: react, typescript", "Location match"]
    }
  ]
}
```

## AI Mentor

### POST /ai/mentor

Chat endpoint that returns a single assistant response given a conversation context. The frontend can either send a `sessionId` and incremental messages or send the full conversation each time.

#### Auth

Required.

#### Rate limit

Recommended: strict and burst-controlled (e.g., 10 requests/minute per user) with 429 support.

#### Request body

```json
{
  "sessionId": "uuid_or_null",
  "messages": [
    { "role": "user", "content": "Help me tailor my resume for frontend roles." }
  ],
  "context": {
    "profileSkills": ["react", "typescript"],
    "targetRole": "Frontend Engineer"
  }
}
```

#### Response (200)

```json
{
  "sessionId": "uuid",
  "message": {
    "role": "assistant",
    "content": "Here is a structured way to tailor your resume..."
  }
}
```
