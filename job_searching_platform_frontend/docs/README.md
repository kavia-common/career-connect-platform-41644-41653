# Talenvia Documentation

## Overview

This folder contains implementation-ready documentation for the Talenvia job searching platform, scoped to the React frontend container in this repository.

## Documents

- `architecture.md` — Frontend structure, routes, components, state management, theming, and integration boundaries.
- `api.md` — REST API contract that the frontend will call (JWT bearer auth, pagination, request/response shapes).
- `database.md` — SQL-first Postgres schema design for backend implementation guidance.
- `implementation_checklist.md` — Concrete steps to implement Talenvia in this repository’s React container.

## Environment variables

The frontend should use `REACT_APP_API_BASE` as the primary API base URL for all HTTP requests.
