# Talenvia Implementation Checklist (Frontend-first)

## Scope

This checklist maps the intended Talenvia architecture and API/DB contracts into concrete implementation steps for the existing React container at `career-connect-platform-41644-41653/job_searching_platform_frontend/`.

The backend API is assumed to be implemented subsequently. The frontend should be written against the endpoint contract in `docs/api.md` and should use `REACT_APP_API_BASE` for all HTTP calls.

## 1) Project setup and dependencies

### 1.1 Add routing

Implement client-side routing to support the page/route list in `docs/architecture.md`.

- Add a routing library (typical choice: `react-router-dom`).
- Create `src/routes/index.jsx` and define public vs protected route groups.
- Implement `src/routes/ProtectedRoute.jsx`.

### 1.2 Add server-state management

Introduce a standard server state and caching layer:

- Add React Query (TanStack Query).
- Create `src/app/AppProviders.jsx` to wrap the app with `QueryClientProvider`.
- Ensure error handling and retries are consistent (e.g., limited retry count, no retry on 401).

### 1.3 Add auth state store

Add a minimal global store for auth:

- Create `src/state/authStore.js` (Context+reducer or Zustand).
- Store:
  - `accessToken`
  - `user` (id, email, fullName, role)
  - `status` (`anonymous | authenticating | authenticated`)
- Provide methods:
  - `login`, `logout`, `hydrate`, `setTokens`

## 2) Environment configuration

### 2.0 Configure Supabase (CRA env vars)

Supabase Auth is used by the frontend. Configure these environment variables (preferred CRA names):

- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_KEY` (anon/public key)

Supported legacy fallbacks (prefer not to use in CRA deployments):

- `SUPABASE_URL`
- `SUPABASE_KEY`

The app will warn (non-production) if Supabase config is missing.

### 2.1 Use REACT_APP_API_BASE consistently

In `src/services/httpClient.js`, define:

- `API_BASE = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || ''`

All services should call endpoints relative to `API_BASE`.

### 2.2 Optional URLs

If needed for future integrations, keep configuration support for:

- `REACT_APP_FRONTEND_URL` (for building share links)
- `REACT_APP_WS_URL` (if mentor chat moves to WebSockets later)

## 3) Folder structure and file creation

Implement the folder structure described in `docs/architecture.md`:

- `src/pages/` for route-level components
- `src/components/` for reusable UI
- `src/services/` for API clients
- `src/hooks/`, `src/utils/`, `src/styles/`, `src/routes/`, `src/state/`

The current `src/App.js` should become either a pure shell wrapper or be replaced by a route-first entry where `index.js` renders `AppProviders` and the router.

## 4) Service layer (API clients)

### 4.1 Implement a fetch wrapper

Create `src/services/httpClient.js` responsible for:

- Prefixing URLs with `API_BASE`
- Adding `Authorization` header when `accessToken` is present
- Parsing JSON responses consistently
- Normalizing errors into a stable shape (e.g., `{ code, message, details }`)
- Handling 401:
  - clear auth state
  - redirect to `/login` (preferably via a navigation helper used by the UI layer)

### 4.2 Implement endpoint-specific clients

Create the following clients (as separate modules to keep page code thin):

- `authApi.js`:
  - `register`, `login`, `me`
- `jobsApi.js`:
  - `listJobs`, `getJob`
- `applicationsApi.js`:
  - `listApplications`, `createApplication`, `getApplication`, `updateApplication`, `deleteApplication`, `getTimeline`
- `profilesApi.js`:
  - `getMyProfile`, `updateSkills`
- `testsApi.js`:
  - `listTests`, `getTest`, `submitTest`
- `challengesApi.js`:
  - `listChallenges`, `joinChallenge`, `completeChallenge`
- `notificationsApi.js`:
  - `listNotifications`, `markRead`
- `aiApi.js`:
  - `matchJobs`, `mentorChat`

These should match the request/response shapes in `docs/api.md`.

## 5) React Query hooks

For each API area, create hooks in `src/hooks/` (or colocated in services) that wrap React Query and encode cache keys:

- Jobs:
  - `useJobs({ q, skills, location, type, page, pageSize })`
  - `useJob(id)`
- Applications:
  - `useApplications({ status, page, pageSize })`
  - `useApplication(id)`
  - `useApplicationTimeline(id)`
  - mutations: create/update/delete with invalidation
- Profile:
  - `useMyProfile()`
  - `useUpdateSkills()`
- Tests:
  - `useTests()`, `useTest(id)`, `useSubmitTest(id)`
- Challenges:
  - `useChallenges()`, `useJoinChallenge(id)`, `useCompleteChallenge(id)`
- Notifications:
  - `useNotifications()`, `useMarkNotificationsRead()`
- AI:
  - `useAiMatch()`, `useAiMentorChat()`

For list endpoints, include query params in cache keys so separate filter combinations do not collide.

## 6) Page implementation order (minimum viable UI)

The user request includes at least a login page. The following order minimizes dependency complexity:

1. `LoginPage` (public)
2. `RegisterPage` (public)
3. `ProtectedRoute` + `DashboardPage` (protected shell)
4. `JobSearchPage` + `JobDetailsPage`
5. `ProfilePage` (skills editor)
6. `ApplicationsPage` + `ApplicationTimeline`
7. `NotificationsPage`
8. `MockTestsPage` + `MockTestTakePage`
9. `ChallengesPage`
10. `MentorPage`
11. `SettingsPage`

Each page should start with static UI and mock data, then wire in API hooks once the service layer is complete.

## 7) Styling and theming implementation

### 7.1 Replace demo theme variables with Executive Gray

The current theme variables are placeholders in `src/App.css`. Convert them into semantic tokens aligned with Executive Gray:

- Background/surface/text tokens for “classic corporate” design
- Border and shadow tokens for subtle depth
- Button tokens for primary/secondary/disabled states

### 7.2 Layout system

Implement a consistent layout that matches the work item’s layout description:

- Top navigation bar (brand + search + user menu)
- Sidebar (navigation and/or filters)
- Main content area for job listings and detail pages
- Responsive behavior:
  - Sidebar collapses into a drawer on small screens
  - Job list and details stack vertically on mobile

## 8) Security and auth handling notes (frontend)

### 8.1 JWT storage strategy

For MVP, a common approach is to store the access token in memory and persist in `localStorage` only if required. For a more secure approach:

- Prefer HttpOnly cookies for refresh tokens (server-set).
- Keep access tokens short-lived and renew via refresh endpoint or cookie-based session.

The frontend should be written so that switching storage strategies does not change page code. Only the auth store and http client should need changes.

### 8.2 Private routes

All private pages must be behind `ProtectedRoute`. A protected route should:

- Check auth state.
- If unknown/unhydrated, show a loading state.
- If unauthenticated, redirect to `/login` with a `returnTo` query parameter.

### 8.3 Input validation and AI endpoints

The frontend must validate and constrain inputs before calling AI endpoints:

- Limit message length and number of messages sent per request.
- Debounce “match” calls (e.g., triggered by profile changes).
- Respect 429 with `Retry-After` by disabling the submit button temporarily and showing a clear UI message.

## 9) Test strategy (frontend)

Use the existing CRA test runner and add tests as core components land:

- `ProtectedRoute` redirect behavior
- `AuthForm` validation behavior
- `httpClient`:
  - attaches Authorization header when token exists
  - normalizes 4xx/5xx into consistent errors

Avoid over-testing layout CSS; focus on behavior and rendering of key states (loading/error/empty).

## 10) Contract alignment checklist

Before wiring a page to the backend, verify:

- The endpoint exists in `docs/api.md`.
- Request query params match the frontend filter model.
- Response shape includes fields needed by the page components.
- Pagination model is implemented (page/pageSize + pageInfo).
- Error codes cover expected UI cases:
  - `UNAUTHORIZED` for login expiry
  - `VALIDATION_ERROR` for forms
  - `RATE_LIMITED` for AI

## 11) Future considerations (non-blocking for MVP)

- Add WebSocket support for mentor streaming responses if needed (use `REACT_APP_WS_URL`).
- Add admin pages gated by `user.role === 'admin'`.
- Consider full-text search performance on jobs via Postgres `tsvector` + GIN index.
- Add audit logging for application status changes and mentor usage metrics.

This checklist is designed so a frontend developer can start implementing Talenvia immediately in this repository, using stable API contracts and a Postgres-ready schema for the backend that will follow.
