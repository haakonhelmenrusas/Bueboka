# Bueboka — agent context (lean)

Archery tracking app (React Native + Expo SDK 58, TypeScript, Expo Router, Context API, better-auth).
Domain language: Norwegian UI / English code (økt=practice, konkurranse=competition, utfordring=challenge, bue=bow, pilsett=arrowSet).

## Layout
```
app/          # expo-router screens (incl. (tabs)/, utfordringer/, varsler/)
components/   # by feature; *Styles.ts beside each component; __tests__ beside tests
services/     # api/ (authFetchClient!), repositories/, offline/ (offlineMutation)
hooks/ contexts/ types/ utils/ lib/i18n/ styles/colors.ts (never hardcode colors)
docs/         # workflow docs; VIBE.md = full project context (read on demand)
```

## Rules
- API calls only via `authFetchClient` (`services/api/authFetch.ts`), errors via `handleApiError()`; mutations wrapped in `offlineMutation()`.
- TDD+DDD: types → repository tests → repository → hook tests → hook → component tests → component → screen. Conventional commits; branch from `dev`, PR to `dev`.
- Tests: Jest + RNTL v14 (**async**: `await render/renderHook/fireEvent`, `await act(async …)`); mock at boundaries.
- Full details: read `VIBE.md` (project context), `docs/skills/*` (TDD/DDD, domain discovery, git), `docs/PUSH_NOTIFICATIONS.md`.
- Skills available on demand: `bueboka-context` (project deep-dive), ASO skills, etc.
