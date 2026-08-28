# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Bueboka** — archery tracking app for iOS, Android and Web. React Native 0.85 / Expo SDK 56 / TypeScript / Expo Router. The backend is a separate Next.js server (not in this repo); the app talks to it over `EXPO_PUBLIC_API_URL` (must include the `/api` suffix).

UI copy is Norwegian and English (see i18n below). Code, identifiers and comments are English.

## Commands

```bash
npm start              # Expo dev server
npm run ios            # expo run:ios (dev build, not Expo Go)
npm run android        # expo run:android
npm run web            # expo start --web

npm test               # jest --ci  (also runs on pre-push via husky)
npm run test:watch
npm run lint           # expo lint
npm run format         # prettier --write .
```

Single test file / single test:

```bash
npx jest services/repositories/__tests__/bowRepository.test.ts
npx jest -t "returns AppError when the request fails"
```

`.env` needs `EXPO_PUBLIC_API_URL` (e.g. `http://localhost:3000/api` — use your LAN IP, not `localhost`, when testing on a device) and optionally `EXPO_PUBLIC_CLARITY_KEY`. Build-time values come from EAS env vars, see `docs/BUILD_ENVIRONMENT.md`.

## Architecture

### Layering

Screens/components → hooks → **repositories** → `authFetchClient` → backend. Never call `fetch`/`axios` from a component; go through a repository.

1. **HTTP** — `services/api/authFetch.ts` exports `authFetchClient`, an axios-shaped wrapper (`get/post/put/patch/delete`) around better-auth's `$fetch`. It unwraps better-auth's `{data, error}` envelope and reports unexpected failures to Sentry. This is the only HTTP client; axios remains a dependency solely because `handleApiError()` still narrows on `AxiosError`.
2. **Repositories** — `services/repositories/*.ts`, one object literal per entity (`bowRepository`, `practiceRepository`, `arrowsRepository`, `userRepository`, `sightMarksRepository`, `achievementRepository`, `competitionRepository`, `roundTypeRepository`). Every method wraps its call in `try/catch` and rethrows `handleApiError(error)`. `services/repositories/README.md` documents each method with examples. Public profiles and stats live outside this pattern in `services/api/publicProfilesApi.ts` and `statsApi.ts`.
3. **Errors** — `services/api/errors.ts`. `handleApiError()` maps status codes to an `AppError(code, norwegianMessage)`. User-facing error text is Norwegian and belongs here, not at the call site.

### Auth

`services/auth/authClient.ts` builds a better-auth client with the `expoClient` plugin (scheme `bueboka`, SecureStore-backed `authStorage`). `contexts/AuthContext.tsx` (~670 lines) owns all auth state and exposes login/register/logout/OAuth via the `useAuth` hook. It also calls `registerOfflineHandlers()` on mount.

Route guarding is layout-based, not middleware: `app/index.tsx` redirects to `/intro`, `/auth` or `/(tabs)/home`; `app/(tabs)/_layout.tsx` redirects to `/auth` when unauthenticated and blocks the hardware back gesture while authenticated.

### Offline queue

Mutations that fail with `AppError.code === 'NETWORK_ERROR'` are enqueued and replayed later:

- `offlineMutation({ type, payload }, () => repo.create(data), userId)` — call this at the screen/component level, wrapping the repository call. `type` must match a handler name.
- `services/offline/handlers.ts` registers every handler name (`bows/create`, `practices/addEnd`, …). **Adding a new offline-capable mutation means adding a handler here**, otherwise queued operations are dropped.
- `services/offline/syncManager.ts` drains the queue with retry/backoff when connectivity returns; the queue lives in AsyncStorage under `offline_queue:{userId}` (config in `services/api/constants.ts`).
- `useOfflineQueue()` starts/stops the sync manager and exposes status for UI.

### i18n

`lib/i18n/` holds a flat-key `TranslationKeys` interface plus `translations/no.ts` and `translations/en.ts` — both must stay in sync with the interface or TypeScript fails. `contexts/LanguageContext.tsx` resolves the locale from AsyncStorage (`bueboka_language`) → OS locale → `no`, and reconciles with the server profile once per user. Components read copy via `const { t } = useTranslation()` then `t['practice.saveButton']`.

Note: `jestSetup.ts` globally mocks `@/contexts/LanguageContext` to return the Norwegian bundle, so component tests assert against Norwegian strings without wrapping in a provider.

### Other conventions

- Path alias `@/*` maps to the repo root.
- **Never hardcode hex colors** — import from `styles/colors.ts` (single source of truth, aligned with the web design tokens).
- Styles go in a sibling `*Styles.ts` file using `StyleSheet.create()`, not inline in the component.
- Import FontAwesome icons individually (`@fortawesome/free-solid-svg-icons/faHome`) so they tree-shake.
- Feature components live in `components/<feature>/`, shared primitives in `components/common/<Name>/`, each with its own folder + styles + test.
- Sentry initialises in `app/_layout.tsx` only when `EXPO_PUBLIC_APP_ENV !== 'development'`.

## Testing

Jest + `jest-expo` in a jsdom environment; `clearMocks`/`restoreMocks` are on. Tests live in `__tests__/` next to the code (a few older ones sit alongside the source — either is accepted).

Mock at boundaries only:

- repository tests mock `@/services/api/authFetch`
- hook and component tests mock the repositories
- pure utilities (`utils/Ballistics.ts`, `utils/helpers/*`) get plain unit tests, no mocks

`jestSetup.ts` already mocks AsyncStorage, FontAwesome, safe-area-context, better-auth, expo-router and the language context — check it before adding a local mock.

The project follows TDD/DDD: write the failing test first, one behaviour per `it()`, named in plain language. Full workflow in `docs/skills/tdd-ddd.md`, domain vocabulary discovery in `docs/skills/domain-discovery.md`.

## Domain vocabulary

Norwegian domain terms appear in routes and UI: **bue** (bow), **pilsett** (arrow set), **økt** (practice session), **skytter** (archer — `/skyttere` is the public profile directory), **siktemerke** (sight mark), **konkurranse** (competition). Practice categories are `SKIVE_INDOOR`, `SKIVE_OUTDOOR`, `JAKT_3D` (3D hunting), `FELT` (field). Scoring is FITA 0–10 per arrow, aggregated per end ("round") and per session.

`utils/Ballistics.ts` computes sight marks from measured reference marks — pure math, well covered by tests, treat carefully.

## Git workflow

`dev` is the integration branch, `main` is production. **Never push directly to either.**

1. Branch from an up-to-date `dev`, prefixed with the Conventional Commits type: `feat/`, `fix/`, `refactor/`, `chore/`, `ci/`, `test/`, `docs/`.
2. PR into `dev`; merge only when CI (`.github/workflows/test.yml` — runs `npm test`) is green.
3. Promote with a separate `dev` → `main` PR.

Commits use Conventional Commits, summary under ~70 chars, body explains _why_. Merging into `dev` triggers the EAS preview workflow (TestFlight + Play internal); merging into `main` triggers production submission. See `docs/skills/git-branching.md`.

### Version bumps

When bumping the app version, update **both** `expo.version` and `expo.ios.infoPlist.CFBundleShortVersionString` in `app.json` — they must match. Build numbers auto-increment on EAS (`appVersionSource: "remote"`).

## Related files

`VIBE.md` is the equivalent config for Mistral Vibe and covers the same ground in more detail (domain vocabulary tables, TDD cycle, commit conventions). Keep the two in sync when architecture changes.
