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
