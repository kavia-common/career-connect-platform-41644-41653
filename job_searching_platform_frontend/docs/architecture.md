# Talenvia Architecture (Frontend + Integration View)

## Scope and repository context

Talenvia is a React-based job searching platform that will be implemented inside this repository’s existing React container at `career-connect-platform-41644-41653/job_searching_platform_frontend/`.

The container is currently a minimal Create React App setup using `react-scripts` with no router, no API client abstraction, and a simple CSS-variable-driven theme toggle in `src/App.js` and `src/App.css`. The intent of this document is to define an implementation-ready frontend structure and integration boundaries so that the UI can be developed now while the backend API is implemented subsequently.

## High-level architecture

Talenvia follows a client-side rendered (CSR) React architecture:

1. The user interacts with the React application in the browser.
2. The frontend calls a backend API over HTTPS using a configurable base URL from environment variables.
3. Authentication uses JWT bearer tokens. The frontend stores tokens securely (see security notes) and protects private routes.
4. Data-fetching uses a standard caching layer to avoid duplicating state and to provide a consistent loading/error model.

### Component-level view

At a high level, Talenvia is organized into:

- A routing layer that maps URLs to pages and enforces authentication for protected pages.
- A service layer that owns HTTP concerns (base URL, auth header injection, error normalization).
- A data layer that provides query/mutation hooks for pages and components.
- A component library (in-repo, no UI framework required) implementing layout primitives and feature components.

The application is intended to remain “lightweight” in the style of the existing template: functional components, minimal dependencies, and plain CSS (or CSS Modules) with theme variables aligned to the Executive Gray style guide.

## Pages and routes

The following routes define the product surface. These are presented as canonical URLs; whether you use nested routes is an implementation choice.

### Public routes

- `/login` — Login page
- `/register` — Registration page

### Protected routes (JWT required)

- `/dashboard` — Overview (recent searches, saved jobs, application summary, recommended jobs)
- `/jobs` — Job Search (list + filters)
- `/jobs/:id` — Job Details
- `/applications` — Applications list and management
- `/applications/:id` — Application details (optional; can be a modal or separate route)

- `/tests` — Mock Tests list
- `/tests/:id` — Mock Test take page
- `/challenges` — Challenges list (gamified)
- `/notifications` — Notifications center
- `/mentor` — AI career mentor chat UI
- `/settings` — Preferences, account settings, theme selection, logout

### Route protection

All protected routes must enforce authentication. A `ProtectedRoute` component (or wrapper) should:

- check for a valid access token in an auth store;
- optionally validate token freshness by calling `/auth/me` on app start;
- redirect unauthenticated users to `/login`, preserving an intended return URL.

## Key UI components

These components are intended to be reusable and implemented in `src/components/`:

- `Navbar` — top navigation, search entry (optional), account actions
- `Sidebar` — page-level navigation and/or job filters (depending on page)
- `JobCard` — job summary card for listings
- `JobFilters` — skill/location/type filters; drives query parameters
- `Pagination` — generic pagination control
- `SkillTag` — reusable pill/tag for skills, selectable/removable
- `ApplicationTimeline` — renders application events chronologically
- `TestQuestion` — renders a question and answer control(s)
- `ChallengeBadge` — gamified badge UI element
- `NotificationItem` — list item with read/unread styling and timestamp
- `ChatWidget` — mentor chat UI with conversation list and message composer
- `ProtectedRoute` — route guard described above
- `AuthForm` — shared form layout/validation for login/register

The page layer (`src/pages/`) composes these components and binds them to API hooks.

## State management and data fetching

### Recommendation

Use:

- React Query (TanStack Query) for server state: fetching, caching, pagination, retries, and mutations.
- A small client state store for auth/session and UI preferences using either:
  - React Context + reducer for minimal dependencies, or
  - Zustand for simpler global state without prop drilling.

This keeps server state (jobs, applications, profile, tests, notifications) out of custom global stores, avoiding duplicated caches and complex synchronization logic.

### What belongs where

- React Query: lists, details, timelines, notifications, tests, challenges, mentor sessions/messages fetched from API.
- Auth store (Context/Zustand): access token, refresh token (if used), user identity, role, auth status.
- Local component state: form fields, UI toggles, filter panel open/close, pagination controls (unless kept in URL).

### URL as state

For Job Search, filters and pagination should be reflected in the URL query string (for shareability and browser navigation). For example:

- `/jobs?q=frontend&skills=react,typescript&location=London&type=full_time&page=2&pageSize=20`

## Styling and theming (Executive Gray)

### Style guide alignment

The Executive Gray theme provides a clean, professional aesthetic with charcoal and silver tones:

- Primary: `#374151`
- Secondary: `#9CA3AF`
- Background: `#F9FAFB`
- Surface: `#FFFFFF`
- Text: `#111827`
- Success: `#059669`
- Error: `#DC2626`

### Practical approach in this repo

The current template already uses CSS variables in `src/App.css` and toggles a `data-theme` attribute on `document.documentElement`. Talenvia should keep that approach, but replace the current demo palette with Executive Gray variables and add semantic tokens (e.g., `--color-primary`, `--color-surface`, `--color-text`, `--color-border`, `--shadow-sm`).

Pages and components should consume semantic variables rather than hard-coded colors so that theme changes remain localized.

## Proposed `src/` folder structure

This structure is designed to be implementation-ready and scalable, while fitting the existing CRA setup:

- `src/`
  - `app/`
    - `AppShell.jsx` (layout shell with Navbar/Sidebar slots)
    - `AppProviders.jsx` (QueryClientProvider, AuthProvider, ThemeProvider)
  - `routes/`
    - `index.jsx` (route definitions)
    - `ProtectedRoute.jsx`
  - `pages/`
    - `LoginPage.jsx`
    - `RegisterPage.jsx`
    - `DashboardPage.jsx`
    - `JobSearchPage.jsx`
    - `JobDetailsPage.jsx`
    - `ApplicationsPage.jsx`

    - `MockTestsPage.jsx`
    - `MockTestTakePage.jsx`
    - `ChallengesPage.jsx`
    - `NotificationsPage.jsx`
    - `MentorPage.jsx`
    - `SettingsPage.jsx`
  - `components/`
    - `layout/`
      - `Navbar.jsx`
      - `Sidebar.jsx`
    - `jobs/`
      - `JobCard.jsx`
      - `JobFilters.jsx`
      - `Pagination.jsx`
    - `profile/`
      - `SkillTag.jsx`
    - `applications/`
      - `ApplicationTimeline.jsx`
    - `tests/`
      - `TestQuestion.jsx`
    - `challenges/`
      - `ChallengeBadge.jsx`
    - `notifications/`
      - `NotificationItem.jsx`
    - `mentor/`
      - `ChatWidget.jsx`
    - `auth/`
      - `AuthForm.jsx`
  - `hooks/`
    - `useAuth.js`
    - `useTheme.js`
    - `useDebounce.js`
  - `services/`
    - `httpClient.js` (fetch wrapper, base URL, auth header injection)
    - `authApi.js`
    - `jobsApi.js`
    - `applicationsApi.js`
    - `profilesApi.js`
    - `testsApi.js`
    - `challengesApi.js`
    - `notificationsApi.js`
    - `aiApi.js` (AI match + mentor)
  - `state/`
    - `authStore.js` (Context+reducer or Zustand)
  - `utils/`
    - `formatters.js` (dates, money, etc.)
    - `validators.js` (client-side form validation rules)
    - `constants.js`
  - `styles/`
    - `theme.css` (CSS variables and base theme)
    - `components.css` (shared component primitives)
  - `index.js` (existing entry; should render providers + routes)
  - `App.css` (may be replaced by `styles/theme.css` over time)

## Environment variables and configuration

The frontend should use `REACT_APP_API_BASE` as the primary base URL for backend HTTP calls. If additional environment variables exist (such as `REACT_APP_BACKEND_URL`), the frontend should still standardize on a single “base URL” constant so services can be configured consistently.

A typical approach in `services/httpClient.js` is:

- `const API_BASE = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || ''`

This keeps configuration consistent across environments without hard-coding URLs.

## Minimal data flow (frontend perspective)

1. On login/register:
   - User submits `AuthForm`.
   - Frontend calls `POST /auth/login` or `POST /auth/register`.
   - Backend returns access token (and optionally refresh token).
   - Frontend stores token(s) and navigates to `/dashboard`.

2. On app start / route entry:
   - `ProtectedRoute` checks auth state.
   - Optionally call `GET /auth/me` to confirm session and load user profile summary.

3. Job search:
   - Filters update URL query parameters.
   - React Query fetches `GET /jobs` with query params.
   - Clicking a job navigates to `/jobs/:id` and fetches `GET /jobs/:id`.

4. Application management:
   - Create or update an application via `POST/PUT /applications`.
   - Render timeline via `GET /applications/:id/timeline`.

5. AI features:
   - Job matching uses `POST /ai/match` and returns ranked jobs.
   - Mentor uses `POST /ai/mentor` to exchange chat turns.

## Security notes (frontend-facing)

- Protected routes must never render sensitive content if unauthenticated.
- Tokens should be stored with care. If a refresh-token cookie strategy is used, prefer HttpOnly cookies for refresh tokens and keep access tokens short-lived.
- All API calls should attach `Authorization: Bearer <token>` when authenticated.
- The frontend should handle 401 responses by clearing auth state and redirecting to `/login`.
- AI endpoints should be treated as higher-risk. The frontend should implement basic debounce/throttling and display clear error states when rate limited.

## Backend boundary assumptions

This frontend architecture assumes a backend API implementing REST endpoints defined in `docs/api.md`, with Postgres as the persistence layer as defined in `docs/database.md`. The frontend should be developed to those contracts, but services should be written so the base URL and headers can be changed without touching page code.

This separation allows backend implementation to proceed independently while keeping the UI stable.
