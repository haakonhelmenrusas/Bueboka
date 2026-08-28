# VIBE.md - Mistral Vibe Configuration for Bueboka

This file provides guidance to Mistral Vibe when working with the **Bueboka** archery-tracking app codebase.

## Project Overview

**Bueboka** is a comprehensive archery tracking application for iOS, Android, and Web. It helps archers track their practice sessions, manage equipment, and improve their skills with detailed statistics and offline support.

- **App Name:** Bueboka
- **Domain:** Archery tracking and progress management
- **Target Users:** Archers (competitive and recreational), coaches
- **Platforms:** iOS, Android, Web (via Expo)
- **Language:** Norwegian (primary UI), English (code)

## Commands

```bash
# Development
npm start              # Start Expo dev server
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
npm run web            # Run in browser

# Testing & Quality
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

- `EXPO_PUBLIC_API_URL` — backend base URL including `/api` (e.g., `http://localhost:3000/api`)
- `EXPO_PUBLIC_CLARITY_KEY` — Microsoft Clarity key (leave empty to disable)

Production/preview secrets live in EAS (see `docs/BUILD_ENVIRONMENT.md`).

## Architecture

### Tech Stack

- **Framework:** React Native 0.85, Expo SDK 56
- **Language:** TypeScript 6
- **Navigation:** Expo Router (file-based navigation)
- **State Management:** Context API (no Redux or Zustand)
- **HTTP Client:** `authFetchClient` (better-auth `$fetch` wrapper)
- **Storage:** AsyncStorage (for offline queue), SecureStore (for tokens)
- **Testing:** Jest + jest-expo, jsdom environment
- **Styling:** React Native StyleSheet, colors from `styles/colors.ts`
- **Icons:** FontAwesome (per-icon imports for tree-shaking)

### Project Structure

```
Bueboka-app/
├── app/                      # Screens & Navigation (Expo Router)
│   ├── _layout.tsx           # Root layout with AuthProvider, LanguageProvider, Sentry
│   ├── index.tsx             # Entry redirect (intro / auth / tabs)
│   ├── auth.tsx              # Login/register screen
│   ├── intro.tsx             # First-launch intro/language picker
│   ├── achievements.tsx      # Achievements screen
│   ├── (tabs)/               # Main tab navigation
│   │   ├── home/             # Home tab (+ statistics screen)
│   │   ├── aktivitet/        # Activity/Practice list
│   │   ├── sightMarks/       # Sight marks management
│   │   └── settings/         # App settings
│   └── skyttere/             # Public profile directory (list + [id] detail)
│
├── components/               # React Components
│   ├── common/               # Shared UI primitives
│   │   ├── Badge/            # Variant-based labels
│   │   ├── Button/           # Pressable with variants
│   │   ├── Checkbox/         # Accessible checkbox
│   │   ├── DataValue/        # Value display with empty state
│   │   ├── DatePicker/       # Native date picker
│   │   ├── FloatingTabBar/   # Custom bottom tab bar
│   │   ├── Input/            # Text input with label
│   │   ├── Message/          # Info card with icon
│   │   ├── ModalWrapper/     # Modal overlay
│   │   ├── OfflineBanner/    # Connectivity status
│   │   ├── Select/           # Dropdown with search
│   │   ├── Textarea/         # Multiline text input
│   │   ├── Toggle/           # Animated switch
│   │   └── MobileActionButton/ # Floating action button
│   │
│   └── [feature]/            # Feature-specific components
│       ├── auth/
│       ├── practice/
│       ├── home/
│       ├── skyttere/
│       ├── sightMarks/
│       ├── settings/
│       ├── onboarding/
│       ├── intro/
│       ├── achievements/
│       └── aktivitet/
│
├── contexts/                 # React Contexts
│   ├── AuthContext.tsx       # Auth state management
│   └── LanguageContext.tsx   # i18n context
│
├── hooks/                    # Custom React Hooks
│   ├── useAuth.ts
│   ├── useNetworkState.ts
│   ├── useOfflineQueue.ts
│   ├── useOnboarding.ts
│   └── useFingerSlipDetection.ts
│
├── services/                 # Business Logic & Data Layer
│   ├── api/                  # HTTP clients
│   │   ├── authFetch.ts      # The HTTP client (better-auth wrapper)
│   │   ├── constants.ts      # API URLs, storage keys, queue config
│   │   ├── errors.ts         # Error handling utilities
│   │   ├── publicProfilesApi.ts # Public shooter profiles (not a repository)
│   │   ├── statsApi.ts       # Statistics endpoints (not a repository)
│   │   └── uploadAvatar.ts   # Avatar multipart upload
│   │
│   ├── auth/                 # better-auth client, storage, token helpers
│   │
│   ├── repositories/         # Repository pattern (data access)
│   │   ├── practiceRepository.ts
│   │   ├── bowRepository.ts
│   │   ├── arrowsRepository.ts
│   │   ├── userRepository.ts
│   │   ├── sightMarksRepository.ts
│   │   ├── achievementRepository.ts
│   │   ├── competitionRepository.ts
│   │   └── roundTypeRepository.ts
│   │
│   ├── offline/              # Offline-first support
│   │   ├── mutationHelper.ts # offlineMutation() wrapper
│   │   ├── operationQueue.ts # AsyncStorage-backed queue
│   │   ├── handlers.ts       # Operation type → repository handler map
│   │   └── syncManager.ts    # Drains the queue when online
│   │
│   └── index.ts              # Service exports
│
├── types/                    # Domain Types (TypeScript)
│   ├── index.ts              # Type exports
│   ├── Practice.ts           # Practice session types
│   ├── Bow.ts                # Bow equipment
│   ├── ArrowSet.ts           # Arrow set equipment
│   ├── Competition.ts        # Competition types
│   ├── SightMarks.ts         # Sight marks for bow
│   ├── Achievement.ts        # User achievements
│   ├── User.ts               # User profile
│   ├── PublicProfile.ts      # Public shooter profile
│   ├── CalculatedMarks.ts    # Score calculations
│   ├── MarkValue.ts          # Score values
│   ├── MarkSet.ts            # Mark configurations
│   └── Statistics.ts         # Statistics types
│
├── utils/                    # Utilities & Domain Logic
│   ├── Ballistics.ts         # Sight mark trajectory calculations
│   ├── Constants.ts          # App-wide constants
│   ├── NorwegianClubs.ts     # Norwegian archery clubs directory
│   └── helpers/              # Pure utility functions
│       ├── capitalizeFirstLetter.ts
│       ├── hexToRgba.ts
│       ├── handleNumberChange.ts
│       ├── labelUtils.ts
│       ├── practiceHelpers.ts
│       ├── achievementLabels.ts
│       └── sortItems.ts
│
├── styles/                   # Styling
│   └── colors.ts             # Color palette (single source of truth)
│
├── lib/                      # Libraries & i18n
│   └── i18n/                 # Internationalization
│       ├── index.ts          # getTranslations(), isLocale(), DEFAULT_LOCALE
│       ├── types.ts          # Locale + flat TranslationKeys interface
│       └── translations/
│           ├── no.ts         # Norwegian translations
│           └── en.ts         # English translations
│
├── docs/                     # Documentation
│   └── skills/               # Agent skills documentation
│       ├── domain-discovery.md
│       ├── tdd-ddd.md
│       └── git-branching.md
│
└── .agents/                  # Agent skills configuration
    └── skills/              # Symlinked agent skills
```

### Navigation (Expo Router)

File-based routing via Expo Router. Guarding is layout-based, not middleware:

- `app/index.tsx` redirects to `/intro` (first launch), `/auth`, or `/(tabs)/home`
- `app/(tabs)/_layout.tsx` redirects to `/auth` when unauthenticated and blocks the back gesture while authenticated
- Main tabs: home, aktivitet, sightMarks, settings — rendered through the custom `FloatingTabBar`
- Public profile directory at `/skyttere/` (top-level stack, not a tab)

### State Management

Context API only — no Redux or Zustand:

- `AuthContext` (667 lines) owns auth state and exposes login, register, logout, and OAuth flows
- Tokens stored in SecureStore (`auth_token`, `bueboka.session_token`)

### Data Layer

Three sub-layers:

1. **HTTP** — `services/api/authFetch.ts` exports `authFetchClient` (better-auth `$fetch` with SecureStore credentials). This is the canonical HTTP client.
2. **Repositories** — 8 repositories in `services/repositories/` each use `authFetchClient` and wrap errors with `handleApiError()`, which maps API errors to an `AppError` with Norwegian user-facing messages. Public profiles and statistics are the exceptions: they live in `services/api/publicProfilesApi.ts` and `services/api/statsApi.ts`.
3. **Offline** — `offlineMutation()` wraps a repository call at the call site (screen/component level, not inside the repository) and enqueues it on `NETWORK_ERROR`. `syncManager` drains the queue (keyed `offline_queue:{userId}` in AsyncStorage) when connectivity returns. Handlers registered via `registerOfflineHandlers()` inside `AuthContext`. **A new offline-capable mutation needs a matching handler in `services/offline/handlers.ts`** — queued operations with an unregistered `type` are dropped.

### Component Philosophy

- **Reusable primitives** in `components/common/`
- **Feature-specific** components in `components/[feature]/`
- **Separate style files** — keep styles in dedicated `*Styles.ts` next to component
- **Never hardcode colors** — always import from `styles/colors.ts`

### Internationalization

The app ships Norwegian and English. Never hardcode user-facing copy in a component.

- `lib/i18n/types.ts` defines a flat `TranslationKeys` interface (`'practice.saveButton'` style keys). `translations/no.ts` and `translations/en.ts` must both implement it in full — a missing key is a TypeScript error.
- `contexts/LanguageContext.tsx` resolves the locale from AsyncStorage (`bueboka_language`) → OS locale → `no`, and reconciles once per user with the server profile.
- Read copy with `const { t } = useTranslation()` then `t['practice.saveButton']`.

## Domain Knowledge

### Archery Concepts

| Concept          | Description                                          |
| ---------------- | ---------------------------------------------------- |
| **Bue**          | Bow (equipment)                                      |
| **Pilsett**      | Arrow set                                            |
| **Økt**          | Practice session                                     |
| **Skytter**      | Shooter/Archer                                       |
| **Bane**         | Range/Track                                          |
| **Skive**        | Indoor target shooting (SKIVE_INDOOR, SKIVE_OUTDOOR) |
| **Jakt 3D**      | 3D hunting archery                                   |
| **Felt**         | Field archery                                        |
| **Siktemerking** | Sight mark                                           |
| **Merkverdi**    | Mark value (score for hitting a ring)                |
| **Konkurranse**  | Competition                                          |

### Practice Categories (PracticeCategory enum)

- SKIVE_INDOOR - Indoor target shooting
- SKIVE_OUTDOOR - Outdoor target shooting
- JAKT_3D - 3D hunting archery
- FELT - Field archery

### Environment (Environment enum)

- INDOOR
- OUTDOOR

### Bow Types (BowType enum)

- RECURVE
- COMPOUND
- BAREBOW
- LONGBOW
- TRADITIONAL

### Weather Conditions (WeatherCondition enum)

- SUNNY
- CLOUDY
- RAIN
- WINDY
- SNOW
- FOG

### Scoring

- FITA standard: 0-10 points
- Scores tracked per arrow, aggregated per end (series of arrows), and per practice session

## Development Workflow

### Domain Discovery First

Understand the ubiquitous language (see `docs/skills/domain-discovery.md`) before implementing. The full TDD/DDD workflow is in `docs/skills/tdd-ddd.md`.

**Write tests before implementation** — repositories are the mock boundary.

### TDD/DDD Cycle

```
DISCOVER  → ask questions (domain-discovery)
MODEL     → types/ entities
TEST RED  → repository test
IMPLEMENT → repository
TEST RED  → hook test
IMPLEMENT → hook
TEST RED  → component test
IMPLEMENT → component
REFACTOR  → all tests green
COMMIT    → follow conventions below
```

### Testing Conventions

- Mock at boundaries only: mock `authFetchClient` when testing repositories; mock repositories when testing hooks or screens
- Test locations mirror source: `services/repositories/__tests__/`, `hooks/__tests__/`, `components/<folder>/__tests__/`
- Framework: Jest + jest-expo, jsdom environment, `clearMocks`/`restoreMocks` enabled
- `jestSetup.ts` already mocks AsyncStorage, FontAwesome, safe-area-context, better-auth, expo-router and `@/contexts/LanguageContext` — check it before adding a local mock. Because the language context is globally mocked to the Norwegian bundle, component tests assert Norwegian copy without wrapping in a provider.

### File Structure for New Features

1. Create domain types in `types/`
2. Create repository interface and tests in `services/repositories/__tests__/`
3. Implement repository in `services/repositories/`
4. Create hook tests in `hooks/__tests__/`
5. Implement hook in `hooks/`
6. Create component tests in `components/[feature]/__tests__/`
7. Implement component in `components/[feature]/`
8. Create screen in `app/` and wire everything together

## Git Workflow

### Branching Model

- `dev` is the default integration branch
- `main` is production
- Never push directly to either — all changes go through PRs

Steps:

1. Branch from `dev` (e.g., `fix/short-description`, `feat/short-description`)
2. Open a PR targeting `dev` — merge only after CI passes
3. Promote `dev` → `main` via a separate PR — merge only after CI passes

### CI/CD

- Merging into `dev` triggers **preview** EAS workflow → TestFlight (iOS) and Google Play internal track (Android)
- Merging into `main` triggers **production** EAS workflow → App Store and Google Play production

### Commit Messages — Conventional Commits

All commits follow the [Conventional Commits](https://www.conventionalcommits.org/) spec:

```
<type>(<optional scope>): <short summary in present tense, lowercase>

<optional body — wrap at 72 chars, explain *why* not *what*>

Generated by Mistral Vibe.
Co-Authored-By: Mistral Vibe <vibe@mistral.ai>
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
chore(deps): pin react-native-reanimated to 4.3.1 for SDK 56
```

### Co-Author Trailer

Every commit Vibe helps write must end with:

```
Generated by Mistral Vibe.
Co-Authored-By: Mistral Vibe <vibe@mistral.ai>
```

Use a HEREDOC when committing to preserve the trailing newline:

```bash
git commit -m "$(cat <<'EOF'
fix: short summary

Optional body explaining why.

Generated by Mistral Vibe.
Co-Authored-By: Mistral Vibe <vibe@mistral.ai>
EOF
)"
```

## Quality Standards

### Testing

- **No implementation file without a test file**
- **Red → Green → Refactor** — always
- **One test = one behaviour** — name it in plain language
- **Tests mock at the boundary** (network, storage) — not internal details
- **Domain types first**, then repository, then hook, then UI
- **Ubiquitous language in code** — code and identifiers in English; user-facing copy goes through the i18n bundles, never inline strings
- **Invariants are named functions** with their own tests

### Code Style

- **Never hardcode hex color values** — import from `styles/colors.ts`
- **Primary color:** `#053546` (dark navy)
- **Secondary color:** `#227B9A` (teal)
- **Use React Native `StyleSheet.create()`**
- **Separate style files** — keep styles in dedicated `*Styles.ts` file next to the component
- **Import icons per-icon** from `@fortawesome/free-solid-svg-icons/<iconName>` for tree-shaking
- **TypeScript strict mode** — all code is typed

### Error Handling

- All API errors wrapped with `handleApiError()` → returns `AppError` with Norwegian user-facing messages
- User messages are always in **Norwegian**
- Error handling centralized in `services/api/errors.ts`

## Monitoring

- **Sentry** — crash reporting and breadcrumbs, initialized in root layout
- **Microsoft Clarity** — session recording, lazy-initialized after Sentry
- Both are disabled in development

## Offline Support

- Automatic queuing of mutations when offline
- Queue stored in AsyncStorage under `offline_queue:{userId}`
- Automatic sync when connectivity returns
- Handlers registered in `AuthContext` via `registerOfflineHandlers()`

## Key Files Reference

| Purpose          | File                                 | Description                            |
| ---------------- | ------------------------------------ | -------------------------------------- |
| Entry            | `index.js`                           | Expo entry point                       |
| App Entry        | `app/index.tsx`                      | Redirects to auth or home              |
| Auth             | `app/auth.tsx`                       | Login/register screen                  |
| Root Layout      | `app/_layout.tsx`                    | AuthProvider, LanguageProvider, Sentry |
| Main Tabs        | `app/(tabs)/_layout.tsx`             | Tab navigation + auth guard            |
| HTTP Client      | `services/api/authFetch.ts`          | better-auth wrapper with SecureStore   |
| Auth Client      | `services/auth/authClient.ts`        | better-auth + expoClient plugin        |
| Error Handling   | `services/api/errors.ts`             | Maps API errors to AppError            |
| API Config       | `services/api/constants.ts`          | Base URLs, storage keys, queue config  |
| Types            | `types/index.ts`                     | Type exports                           |
| Colors           | `styles/colors.ts`                   | Color palette                          |
| i18n             | `lib/i18n/index.ts`                  | Translation lookup                     |
| i18n Context     | `contexts/LanguageContext.tsx`       | `useTranslation()` provider            |
| Offline          | `services/offline/mutationHelper.ts` | `offlineMutation()` wrapper            |
| Offline Handlers | `services/offline/handlers.ts`       | Operation type → repository handler    |
| Sync             | `services/offline/syncManager.ts`    | Sync queue when online                 |
| Test Setup       | `jestSetup.ts`                       | Global mocks for all test suites       |

## Common Patterns

### Repository Method

```typescript
import { authFetchClient as client } from '@/services/api/authFetch';
import { handleApiError } from '@/services/api/errors';
import { Practice } from '@/types';

export const practiceRepository = {
  async getById(id: string): Promise<Practice> {
    try {
      const response = await client.get<{ practice: Practice }>(`/practices/${id}`);
      return response.data.practice;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
```

### Component Structure

```
components/practice/ScoreInput/
├── ScoreInput.tsx          # Component logic
├── ScoreInputStyles.ts     # Styles
└── __tests__/
    └── ScoreInput.test.tsx # Tests
```

### Hook Structure

```
hooks/usePractice.ts          # Hook implementation
hooks/__tests__/
└── usePractice.test.ts      # Hook tests
```

## Useful Queries

Find all repositories:

```bash
grep -r "Repository" services/repositories/ --include="*.ts"
```

Find all types:

```bash
ls -la types/*.ts
```

Find all hooks:

```bash
ls -la hooks/*.ts
```

Find all screens:

```bash
find app/ -name "*.tsx" -type f | grep -v _layout | grep -v index
```

## Resources

- **Repository:** https://github.com/Aaronshades/Bueboka-app
- **Web Version:** https://bueboka.no
- **App Store:** https://apps.apple.com/no/app/bueboka/id6448108838
- **Play Store:** https://play.google.com/store/apps/details?id=com.aaronshade.bueboka
- **Website:** https://rusasdesign.no
- **Documentation:** See `docs/` directory

---

**Note:** This configuration is for Mistral Vibe. For other agents, see their respective configuration files.
