# Bueboka – AI Agent Guide

## Overview

React Native archery-tracking app built with **Expo SDK 55**, **Expo Router** (file-based navigation), and **TypeScript**. Targets iOS, Android, and Web from a single codebase.

## Architecture

```
app/              ← Expo Router screens (file = route)
  _layout.tsx     ← Root: AuthProvider + Sentry wrap; gates (tabs) vs auth
  auth.tsx        ← Login/register screen
  (tabs)/         ← All authenticated tab screens
components/       ← UI components
  common/         ← Shared primitives (Button, Input, Select, OfflineBanner…)
  practice/       ← Practice-specific components
  profile/        ← Bow/arrow form & detail components
services/
  api/            ← HTTP clients and error handling
  auth/           ← Better Auth client + token storage
  offline/        ← Offline queue + sync manager
  repositories/   ← Data access layer (one file per entity)
types/            ← Shared TypeScript types
styles/colors.ts  ← Single source of truth for all colors
```

## Path Alias

`@/*` resolves to the project root (e.g., `@/services/repositories` → `./services/repositories`).

## Key Workflows

| Task       | Command           |
| ---------- | ----------------- |
| Dev server | `npm start`       |
| iOS        | `npm run ios`     |
| Android    | `npm run android` |
| Tests      | `npm test`        |
| Lint       | `npm run lint`    |
| Format     | `npm run format`  |

## Environment Configuration

**Local Development**: Set `EXPO_PUBLIC_API_URL` in `.env` (e.g., `http://192.168.x.x:3000/api`) to point at a local backend. Auth base URL is derived automatically as `$EXPO_PUBLIC_API_URL/auth`.

**Preview/Production Builds**: Use EAS Secrets to inject the production API URL at build time. See `docs/BUILD_ENVIRONMENT.md` for complete setup instructions. The `.env` file is used for local dev only - preview/production builds override it with the EAS secret value.

## HTTP & Auth

All repository calls use `authFetchClient` from `services/api/authFetch.ts`, which wraps `authClient.$fetch` (better-auth's internal fetch) with `credentials: 'include'`. Do **not** use the Axios `client` in `services/api/client.ts` for new code – it exists for legacy compatibility.

Auth tokens are stored in `expo-secure-store` under two keys: `auth_token` and `bueboka.session_token`. `WebBrowser.maybeCompleteAuthSession()` is called at module level in `contexts/AuthContext.tsx` – required for iOS OAuth deep-link completion.

## Repository Pattern

Each entity has a dedicated repository (`services/repositories/bowRepository.ts`, etc.) exported via `services/repositories/index.ts`. Import directly:

```ts
import { bowRepository, practiceRepository } from '@/services/repositories';
```

All API errors are routed through `handleApiError()` → `AppError` (code + message). User-facing error messages are written in **Norwegian**.

## Offline Support

Mutations that may fail offline use `offlineMutation()` from `services/offline/mutationHelper.ts`:

```ts
await offlineMutation({ type: 'bows/create', payload: data }, () => bowRepository.create(data), userId);
```

On `NETWORK_ERROR`, the operation is queued in `AsyncStorage` (`offline_queue:{userId}`). Handlers are registered with `syncManager.registerHandler('bows/create', fn)` in `services/offline/handlers.ts` and wired up via `registerOfflineHandlers()` called from `AuthContext`.

## Navigation & Auth Guard

`app/_layout.tsx` shows `(tabs)` stack when `isAuthenticated`, otherwise `auth`. A second guard in `app/(tabs)/_layout.tsx` redirects to `/auth` if not authenticated. Use `useFocusEffect` + `useCallback` to reload data when a tab regains focus (see `app/(tabs)/home/index.tsx`).

## Styling Conventions

- `StyleSheet.create()` from React Native (no CSS-in-JS library)
- All color values from `styles/colors.ts` – never hardcode hex strings
- Platform differences handled inline: `Platform.OS === 'ios' ? ... : ...`
- FontAwesome icons imported **per-icon** for tree-shaking:
  ```ts
  import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
  ```

## Sentry & Monitoring

Sentry and Microsoft Clarity are initialized only when `NODE_ENV !== 'development'` and not running in Expo Go. Use `Sentry.addBreadcrumb()` for notable non-error events; `Sentry.captureException()` for caught errors in services.

## Testing

Jest + `jest-expo` preset. Setup file: `jestSetup.ts`. Mocks for native modules are handled by jest-expo. Run `npm test` for CI mode.

Test files live next to their source in `__tests__/` sub-folders:

| Source location                 | Test location                               |
| ------------------------------- | ------------------------------------------- |
| `services/repositories/*.ts`    | `services/repositories/__tests__/*.test.ts` |
| `hooks/*.ts`                    | `hooks/__tests__/*.test.ts`                 |
| `components/<folder>/*.tsx`     | `components/<folder>/__tests__/*.test.tsx`  |
| `utils/*.ts`                    | `utils/__tests__/*.test.ts`                 |
| `app/(tabs)/<screen>/index.tsx` | `app/(tabs)/<screen>/__tests__/*.test.tsx`  |

---

## Skill 1 – Domain Discovery: Questions Before Code

> Full specification: [`docs/skills/domain-discovery.md`](docs/skills/domain-discovery.md)

Before writing any implementation code, build a shared understanding of the domain and requirements. Do **not** start coding immediately when a request is ambiguous.

### Rules

1. **Ask 2–5 focused questions** covering the biggest unknowns for every non-trivial task. Prioritise: business purpose, acceptance criteria, data ownership, offline behaviour, and architecture fit.

2. Use the **domain glossary** to confirm terminology. If a concept has no existing name in the codebase, propose a Norwegian-aligned name and confirm it before creating files.

3. After receiving answers, **restate your understanding in one paragraph** before writing code.

4. If the developer says "just go ahead", code the most reasonable interpretation and list all assumptions explicitly.

5. **Never invent domain concepts.** If a type or entity for the concept doesn't exist yet, raise it as a question rather than silently creating a new one.

---

## Skill 2 – TDD + DDD: Tests First, Domain Always

> Full specification: [`docs/skills/tdd-ddd.md`](docs/skills/tdd-ddd.md)

Apply TDD and DDD on every coding task. Code is written in this strict order: **domain types → repository tests → repository implementation → hook tests → hook implementation → component/acceptance tests → component → refactor**.

### Cycle

```
RED   → Write a failing test for one behaviour
GREEN → Write the minimum code to pass it
REFACTOR → Clean up; all tests stay green
REPEAT
```

### Rules

1. **Write the test file before the implementation file.** No exceptions.
2. **One `it()` block = one behaviour.** Name it in plain language.
3. **Mock at the boundary only** – `authFetchClient` for repo tests; repositories for hook/screen tests.
4. **Domain types in `types/` first**, before any repository or component code.
5. **Invariants are named functions with their own tests.**
6. **Never skip to implementation.** Use `it.todo()` if tests must be deferred.

### Combined Workflow

```
DISCOVER  → ask questions (Skill 1)
MODEL     → extend/create types/
TEST RED  → repository test
IMPLEMENT → repository method
TEST RED  → hook test
IMPLEMENT → hook
TEST RED  → component/acceptance test
IMPLEMENT → screen/component
REFACTOR  → all tests green
COMMIT    → follow commit conventions below
```

## Commit Message Conventions

Follow these guidelines when creating commit messages:

### Format

```
<type>: <short summary (50 chars max)>

<detailed description>

- List specific changes made
- Explain why changes were necessary
- Mention any breaking changes or important notes
- Reference related issues if applicable

Co-authored-by: AI Assistant <ai@assistant.dev>
```

### Commit Types

- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code restructuring without changing functionality
- `style:` Formatting, missing semicolons, etc.
- `docs:` Documentation changes
- `test:` Adding or updating tests
- `chore:` Maintenance tasks, dependency updates

### Description Guidelines

- **Always include a detailed description** explaining what was changed and why
- Be specific about which files or components were modified
- Explain the reasoning behind architectural decisions
- List any trade-offs or considerations made
- Mention impact on other parts of the codebase

### AI Attribution

When AI has assisted in generating code or making changes, **always include** the co-authorship line:

```
Co-authored-by: AI Assistant <ai@assistant.dev>
```

This ensures transparency about AI contributions and proper attribution.

### Example

```
refactor: Extract Aktivitet screen components into separate files

Refactored the Aktivitet screen to follow project architecture patterns
by extracting UI components into a dedicated aktivitet folder.

Changes made:
- Created AktivitetHeader component with icon, title, and filter tabs
- Extracted FilterTabs as reusable component (Alle, Treninger, Konkurranser)
- Created PracticeList component handling loading, empty, and populated states
- Added EmptyState component with contextual messages
- Extracted LoadMoreButton with loading state
- Moved all styles to AktivitetStyles.ts following project conventions
- Updated main screen to use new components, reducing from 370 to 233 lines

Benefits:
- Better separation of concerns
- Improved maintainability and testability
- Consistent with Settings screen architecture
- Components are now reusable across the app

Co-authored-by: AI Assistant <ai@assistant.dev>
```
