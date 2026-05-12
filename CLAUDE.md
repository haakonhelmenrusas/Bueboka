# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start              # Start Expo dev server
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
npm run web            # Run in browser
npm test               # Run Jest tests (CI mode)
npm run test:watch     # Run tests in watch mode
npm run lint           # Lint with Expo linter
npm run format         # Format with Prettier
npm run format:check   # Check formatting without writing
```

Run a single test file:
```bash
npx jest services/repositories/__tests__/practiceRepository.test.ts
```

## Environment

Requires `.env` with:
- `EXPO_PUBLIC_API_URL` — backend base URL including `/api` (e.g. `http://localhost:3000/api`)
- `EXPO_PUBLIC_CLARITY_KEY` — Microsoft Clarity key (leave empty to disable)

Production/preview secrets live in EAS (see `docs/BUILD_ENVIRONMENT.md`).

## Architecture

**Tech stack:** React Native, Expo SDK 55, TypeScript, Expo Router (file-based navigation).

### Navigation (`app/`)

File-based routing via Expo Router:

- `app/_layout.tsx` — root layout; wraps in `AuthProvider`, initialises Sentry, runs version check
- `app/(tabs)/` — main tab navigation (home, aktivitet, sightMarks, settings, skyttere[hidden])
- Auth guard in root layout redirects unauthenticated users to `/auth`

### State management (`contexts/`)

Context API only — no Redux or Zustand. A single `AuthContext` (667 lines) owns the auth state and exposes login, register, logout, and OAuth flows. Tokens are stored in SecureStore (`auth_token`, `bueboka.session_token`).

### Data layer (`services/`)

Three sub-layers:

1. **HTTP** — `services/api/authFetch.ts` exports `authFetchClient` (better-auth `$fetch` with SecureStore credentials). This is the canonical HTTP client; the legacy axios client in `services/api/client.ts` is not used in new code.
2. **Repositories** (`services/repositories/`) — 9 repositories (practice, bow, arrows, user, sightMarks, achievement, competition, roundType, publicProfile). Each uses `authFetchClient` and wraps errors with `handleApiError()`, which maps API errors to an `AppError` with Norwegian user-facing messages.
3. **Offline** (`services/offline/`) — `offlineMutation()` wraps any repository call and enqueues it on `NETWORK_ERROR`. `syncManager` drains the queue (keyed `offline_queue:{userId}` in AsyncStorage) when connectivity returns. Handlers are registered via `registerOfflineHandlers()` inside `AuthContext`.

### Components (`components/`)

Organised by feature folder (`auth/`, `practice/`, `home/`, `skyttere/`, `sightMarks/`, `settings/`) plus `common/` for shared primitives (Button, Input, Select, Badge, etc.).

### Hooks (`hooks/`)

Custom hooks include `useAuth`, `useNetworkState`, `useOfflineQueue`. Tests live in `hooks/__tests__/`.

### Types (`types/`)

13 domain interfaces. Key enums: `Environment` (INDOOR/OUTDOOR), `PracticeCategory` (Norwegian archery styles: SKIVE_INDOOR, SKIVE_OUTDOOR, JAKT_3D, FELT), `WeatherCondition`, `BowType`, `Material`.

### Styling

- **Never hardcode hex values** — import from `styles/colors.ts`, which is the single source of truth.
- Primary: `#053546` (dark navy), Secondary: `#227B9A` (teal).
- Use React Native `StyleSheet.create()`. Icons are per-icon FontAwesome imports for tree-shaking.

### Monitoring

- **Sentry** — crash reporting and breadcrumbs, initialised in root layout.
- **Microsoft Clarity** — session recording, lazy-initialised after Sentry to prevent crash conflicts.
- Both are disabled in development.

## Testing conventions

- Mock at boundaries only: mock `authFetchClient` when testing repositories; mock repositories when testing hooks or screens.
- Test locations mirror source: `services/repositories/__tests__/`, `hooks/__tests__/`, `components/<folder>/__tests__/`.
- Framework: Jest + jest-expo, jsdom environment.

## Development workflow

Domain discovery first — understand the ubiquitous language (see `docs/skills/domain-discovery.md`) before implementing. The full TDD/DDD workflow is in `docs/skills/tdd-ddd.md`. Write tests before implementation; repositories are the mock boundary.

## Git workflow

### Commit messages — Conventional Commits

All commits follow the [Conventional Commits](https://www.conventionalcommits.org/) spec. Format:

```
<type>(<optional scope>): <short summary in present tense, lowercase>

<optional body — wrap at 72 chars, explain *why* not *what*>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

**Types:**

- `feat` — new feature visible to the user
- `fix` — bug fix
- `refactor` — internal change with no behavioural difference
- `perf` — performance improvement
- `test` — adding or fixing tests only
- `docs` — documentation only
- `style` — formatting, whitespace, missing semicolons (no logic change)
- `chore` — build config, dependency bumps, tooling
- `ci` — changes to CI/EAS workflows or configuration

Keep the summary under 70 chars. Use the body for the "why" — what was the user-visible problem, what constraint forced this approach, what alternatives were rejected.

**Examples:**

```
fix: handle 404 from version endpoint without blocking startup
refactor(auth): split AuthContext into login and session hooks
chore(deps): pin react-native-reanimated to 4.2.1 for SDK 55
```

### Co-Author trailer

Every commit Claude helps write must end with:

```
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Use a HEREDOC when committing to preserve the trailing newline:

```bash
git commit -m "$(cat <<'EOF'
fix: short summary

Optional body explaining why.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

### Other rules

- Only commit when explicitly asked.
- Prefer new commits over amending — never amend a pushed commit.
- Stage specific files by name; avoid `git add -A` so secrets (`.env`, keys) don't slip in.
- Never use `--no-verify` or `--no-gpg-sign` unless explicitly requested.
