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

**Tech stack:** React Native 0.85, Expo SDK 56, TypeScript 6, Expo Router (file-based navigation).

### Navigation (`app/`)

File-based routing via Expo Router:

- `app/_layout.tsx` — root layout; wraps in `AuthProvider`, initialises Sentry, runs version check
- `app/index.tsx` — entry redirect
- `app/auth.tsx` — login/register screen
- `app/intro.tsx` — first-launch intro/language picker
- `app/achievements.tsx` — achievements screen
- `app/(tabs)/` — main tab navigation (home, aktivitet, sightMarks, settings, skyttere[hidden])
- `app/skyttere/` — public profile directory (list + `[id]` detail)
- Auth guard in root layout redirects unauthenticated users to `/auth`

### State management (`contexts/`)

Context API only — no Redux or Zustand. A single `AuthContext` (667 lines) owns the auth state and exposes login, register, logout, and OAuth flows. Tokens are stored in SecureStore (`auth_token`, `bueboka.session_token`).

### Data layer (`services/`)

Three sub-layers:

1. **HTTP** — `services/api/authFetch.ts` exports `authFetchClient` (better-auth `$fetch` with SecureStore credentials). This is the canonical HTTP client; the legacy axios client in `services/api/client.ts` is not used in new code.
2. **Repositories** (`services/repositories/`) — 9 repositories (practice, bow, arrows, user, sightMarks, achievement, competition, roundType, publicProfile). Each uses `authFetchClient` and wraps errors with `handleApiError()`, which maps API errors to an `AppError` with Norwegian user-facing messages.
3. **Offline** (`services/offline/`) — `offlineMutation()` wraps any repository call and enqueues it on `NETWORK_ERROR`. `syncManager` drains the queue (keyed `offline_queue:{userId}` in AsyncStorage) when connectivity returns. Handlers are registered via `registerOfflineHandlers()` inside `AuthContext`.

### Components (`components/`)

Organised by feature folder (`auth/`, `practice/`, `home/`, `skyttere/`, `sightMarks/`, `settings/`, `onboarding/`, `intro/`, `achievements/`, `aktivitet/`) plus `common/` for shared primitives.

#### Common components (`components/common/`)

Reusable UI primitives used throughout the app. Each lives in its own folder with optional `*Styles.ts`:

- **Badge** — variant-based label (`default`, `training`, `competition`, `primary`, `secondary`, `ghost`) with size presets and optional icon
- **Button** — pressable with `filled`/`outline` types, `standard`/`warning`/`tertiary` variants, `small`/`normal` sizes, loading state
- **Checkbox** — accessible checkbox with label, disabled state
- **DataValue** — displays a value with optional suffix/capitalisation, or a "Ingen data" pill when empty
- **DatePicker** — native date picker with iOS modal and Android native picker, Norwegian locale
- **FloatingTabBar** — custom bottom tab bar with animated press feedback
- **GoogleLogo** — SVG Google "G" logo
- **Input** — text input with label, help text, error state, optional icon/addons, forwardRef
- **Message** — info card with icon, title, description, and optional action button
- **MobileActionButton** — FAB with animated expanding menu (practice, competition, bow, arrows)
- **ModalHeader** — header with title and close (X) button
- **ModalWrapper** — modal overlay with backdrop tap-to-close, optional full-screen mode
- **Notch** — drag handle bar for bottom sheets
- **OfflineBanner** — connectivity status bar using `useNetworkState` and `useOfflineQueue` hooks
- **Select** — dropdown with optional search, creatable options, Android modal positioning
- **Textarea** — multiline text input with label, help text, error state, forwardRef
- **Toggle** — animated switch with accessibility role `switch`
- **UpdateRequired** — full-screen forced update prompt with store link
- **icons/ArcheryIcons** — SVG bow and arrow icons

### Hooks (`hooks/`)

Custom hooks include `useAuth`, `useNetworkState`, `useOfflineQueue`, `useOnboarding`. Tests live in `hooks/__tests__/`.

### Internationalisation (`lib/i18n/`)

Two locales: Norwegian (`no`, default) and English (`en`). Translations are plain TypeScript objects. `LanguageContext` exposes `useTranslation()` → `{ t, locale, setLanguage }`. Tests in `lib/i18n/__tests__/`.

### Utilities (`utils/`)

- `Ballistics.ts` — sight mark trajectory calculations
- `Constants.ts` — app-wide constants
- `NorwegianClubs.ts` — club directory
- `helpers/` — pure functions: `capitalizeFirstLetter`, `hexToRgba`, `handleNumberChange`, `labelUtils`, `practiceHelpers`, `sortItems`

### Types (`types/`)

13 domain interfaces. Key enums: `Environment` (INDOOR/OUTDOOR), `PracticeCategory` (Norwegian archery styles: SKIVE_INDOOR, SKIVE_OUTDOOR, JAKT_3D, FELT), `WeatherCondition`, `BowType`, `Material`.

### Styling

- **Never hardcode hex values** — import from `styles/colors.ts`, which is the single source of truth.
- Primary: `#053546` (dark navy), Secondary: `#227B9A` (teal).
- Use React Native `StyleSheet.create()`. Icons are per-icon FontAwesome imports for tree-shaking.
- **Separate style files** — keep styles in a dedicated `*Styles.ts` file next to the component (e.g. `Badge/BadgeStyles.ts`). Never define `StyleSheet.create()` in the same file as JSX markup. Export as `export const styles = StyleSheet.create({…})` (or `export const defaultStyles` for input-type components).

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

### Branching model

`dev` is the default integration branch. `main` is production. Never push directly to either — all changes go through PRs. See `docs/skills/git-branching.md` for the full workflow.

1. Branch from `dev` (e.g. `fix/short-description`, `feat/short-description`)
2. Open a PR targeting `dev` — merge only after CI passes
3. Promote `dev` → `main` via a separate PR — merge only after CI passes

- Merging into `dev` triggers the **preview** EAS workflow — builds and submits to TestFlight (iOS) and Google Play internal track (Android) for beta testing.
- Merging into `main` triggers the **production** EAS workflow — builds and submits to the App Store and Google Play production track.

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
