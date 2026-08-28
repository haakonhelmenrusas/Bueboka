# VIBE.md - Project Context for Bueboka

This file provides project-specific context to Mistral Vibe when working with the Bueboka codebase.

## Project Overview

**Bueboka** is a comprehensive archery tracking application for iOS, Android, and Web. Built with **React Native**, **Expo SDK 56**, **TypeScript**, and **Expo Router**.

- **App Stores**: [Google Play](https://play.google.com/store/apps/details?id=com.aaronshade.bueboka) | [App Store](https://apps.apple.com/no/app/bueboka/id6448108838)
- **Web Version**: [bueboka.no](https://bueboka.no)
- **Current Version**: 2.0.2
- **Repository**: [github.com/Aaronshades/Bueboka-app](https://github.com/Aaronshades/Bueboka-app)

### Core Features
- Practice session tracking with scores, distances, and weather conditions
- Equipment management for bows and arrow sets
- Offline support with automatic sync via `syncManager`
- Secure authentication (email, Google, Apple) via better-auth
- Data visualization and statistics
- Ballistics calculator for sight marks
- Achievements system
- Competitions tracking
- Public profiles for archers

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment (see .env.example)
cp .env.example .env
# Edit .env with your API_URL

# Start development server
npm start

# Run on platform
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Browser

# Run tests
npm test         # CI mode
npm run test:watch

# Lint & format
npm run lint
npm run format
```

## Architecture

### Tech Stack
- **Framework**: React Native 0.85, Expo SDK 56
- **Language**: TypeScript 6
- **Navigation**: Expo Router (file-based)
- **State Management**: React Context API (no Redux/Zustand)
- **Authentication**: better-auth with Expo SecureStore
- **Styling**: React Native StyleSheet, custom color system
- **Testing**: Jest + jest-expo, @testing-library/react-native
- **Monitoring**: Sentry (crash reporting), Microsoft Clarity (analytics)
- **Offline**: AsyncStorage queue with automatic sync

### Project Structure

```
bueboka-app/
├── app/                    # Expo Router screens & navigation
│   ├── _layout.tsx        # Root layout with AuthProvider, Sentry
│   ├── index.tsx          # Entry redirect
│   ├── auth.tsx           # Login/register screen
│   ├── intro.tsx          # First-launch onboarding
│   └── (tabs)/            # Main tab navigation
│
├── components/            # Reusable UI components
│   ├── common/            # Shared primitives (Button, Input, Modal, etc.)
│   ├── auth/              # Authentication components
│   ├── practice/          # Practice/session components
│   ├── home/              # Home screen components
│   ├── sightMarks/        # Ballistics calculator components
│   ├── settings/          # Settings components
│   └── ...
│
├── contexts/              # React Context providers
│   ├── AuthContext.tsx    # Authentication state (667 lines)
│   └── LanguageContext.tsx # i18n (no/en)
│
├── services/              # Data layer
│   ├── api/               # HTTP clients
│   │   ├── authFetch.ts   # Primary client (better-auth $fetch)
│   │   └── client.ts     # Legacy axios client (deprecated)
│   ├── repositories/      # 9 repositories (practice, bow, arrows, etc.)
│   ├── offline/           # Offline queue & sync manager
│   └── auth/              # Authentication services
│
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Auth state access
│   ├── useNetworkState.ts # Connectivity monitoring
│   ├── useOfflineQueue.ts # Offline mutation queue
│   └── useOnboarding.ts   # Onboarding flow
│
├── types/                 # TypeScript domain types
│   ├── Practice.ts        # Practice session types
│   ├── Bow.ts             # Bow/equipment types
│   ├── ArrowSet.ts       # Arrow set types
│   ├── SightMarks.ts      # Ballistics types
│   ├── Competition.ts     # Competition types
│   └── ...
│
├── utils/                 # Utilities & domain logic
│   ├── Ballistics.ts      # Sight mark calculations
│   ├── Constants.ts       # App-wide constants
│   └── helpers/           # Pure functions
│
├── styles/                # Styling
│   └── colors.ts          # Single source of truth for colors
│
├── lib/                   # Libraries
│   └── i18n/              # Internationalization (no, en)
│
└── docs/                  # Documentation
    └── skills/            # Development workflow docs
```

### Domain Glossary (Ubiquitous Language)

| Norwegian (UI) | English (Code) | Type/Entity |
|---------------|----------------|-------------|
| Økt / Trening | practice | Practice |
| Konkurranse | competition | Competition |
| Bue | bow | Bow |
| Pil / Pilsett | arrow / arrowSet | ArrowSet |
| Siktmerke | sightMark | SightMark |
| Skytter | archer / user | User / PublicProfile |
| Avstand | distance | number (metres) |
| Målskive | target | string (face type) |
| Poeng | score / points | number |
| Bane | range / lane | string |
| Merke | mark | MarkValue |
| Rundetype | roundType | RoundType |
| Bueskyting | archery | - |

## Key Files & Their Purpose

### Navigation (`app/`)
- **`app/_layout.tsx`**: Root layout wrapper. Initializes Sentry, wraps in AuthProvider, sets up tab navigation
- **`app/index.tsx`**: Entry point, redirects based on auth state
- **`app/auth.tsx`**: Login/registration screen
- **`app/intro.tsx`**: First-launch language picker
- **`app/(tabs)/_layout.tsx`**: Main tab navigator with 5 tabs
- **`app/(tabs)/home/`**: Home screen with recent practices
- **`app/(tabs)/aktivitet/`**: Activity/practices list
- **`app/(tabs)/sightMarks/`**: Ballistics calculator
- **`app/(tabs)/settings/`**: App settings
- **`app/achievements.tsx`**: Achievements overview
- **`app/skyttere/`**: Public archer profiles directory

### State Management (`contexts/`)
- **`AuthContext.tsx`**: Manages authentication state, tokens in SecureStore, OAuth flows
- **`LanguageContext.tsx`**: i18n context with translations for Norwegian (no) and English (en)

### Data Layer (`services/`)
- **`services/api/authFetch.ts`**: **Primary HTTP client**. Uses better-auth `$fetch` with SecureStore credentials
- **`services/api/client.ts`**: Legacy axios client (deprecated, don't use for new code)
- **`services/repositories/`**: 9 repositories each wrapping API calls with error handling:
  - practiceRepository.ts
  - bowRepository.ts
  - arrowRepository.ts
  - userRepository.ts
  - sightMarksRepository.ts
  - achievementRepository.ts
  - competitionRepository.ts
  - roundTypeRepository.ts
  (public profiles and stats are not repositories: see services/api/publicProfilesApi.ts and statsApi.ts)
- **`services/offline/`**: 
  - `mutationHelper.ts`: `offlineMutation()` wraps repository calls, queues on NETWORK_ERROR
  - `syncManager.ts`: Drains queue when connectivity returns, keyed `offline_queue:{userId}` in AsyncStorage
  - Offline handlers registered via `registerOfflineHandlers()` in AuthContext

### Components (`components/`)
Organized by feature. Common primitives in `components/common/`:
- Button, Input, Select, Textarea, Checkbox, Toggle, ModalWrapper, Message, Badge, DataValue, DatePicker, FloatingTabBar, OfflineBanner, etc.

## Development Workflow

### Before Coding: Domain Discovery
1. **Always** run through `docs/skills/domain-discovery.md` checklist
2. Clarify: user goal, archery concepts, Norwegian terms, existing types
3. Define: acceptance criteria, data touched, repositories involved, offline support
4. Plan: architecture fit (screen, component, repository, navigation)

### TDD + DDD Cycle
Follow `docs/skills/tdd-ddd.md`:
1. **DISCOVER**: Ask questions, agree on behavior
2. **MODEL**: Identify/extend domain types in `types/`
3. **TEST (RED)**: Write failing tests for repository
4. **IMPLEMENT**: Minimum code to pass tests
5. **TEST (RED)**: Write failing tests for hooks/business logic
6. **IMPLEMENT**: Minimum hook code
7. **TEST (RED)**: Write failing component/acceptance test
8. **IMPLEMENT**: Wire up screen/component
9. **REFACTOR**: Clean up all layers, tests stay green
10. **COMMIT**: Follow conventional commits

### Mocking Conventions
```typescript
// Mock authFetchClient for repository tests
jest.mock('@/services/api/authFetch', () => ({
  authFetchClient: jest.fn(),
}));

// Mock repositories in hook/screen tests
jest.mock('@/services/repositories', () => ({
  bowRepository: { getAll: jest.fn(), create: jest.fn() },
}));

// Mock offline mutation helper
jest.mock('@/services/offline/mutationHelper', () => ({
  offlineMutation: jest.fn(),
}));
```

### Offline Support
- All repository calls should use `offlineMutation()` for mutating operations
- Queue is stored in AsyncStorage with key `offline_queue:{userId}`
- Sync is triggered automatically when network reconnects
- Register handlers: `registerOfflineHandlers()` called in AuthContext

## Testing

### Test Locations
```
services/repositories/__tests__/*.test.ts  # Repository tests
hooks/__tests__/*.test.ts                 # Hook tests
components/<folder>/__tests__/*.test.tsx  # Component tests
app/(tabs)/<screen>/__tests__/*.test.tsx  # Screen tests
utils/__tests__/*.test.ts                 # Utility tests
```

### Framework
- Jest + jest-expo
- @testing-library/react-native
- jsdom environment

### Principles
- Mock at boundaries only (mock `authFetchClient`, not internal details)
- Test behavior, not implementation
- One behavior per test
- Name tests in plain language

## Git Workflow

### Branching Model
```
main ← production (receives merges from dev via PR)
  └── dev ← integration (receives merges from feature branches via PR)
        ├── feat/description
        ├── fix/description
        └── chore/description
```

### Rules
1. **Never push directly to `main` or `dev`** - always use PRs
2. Branch from `dev` with conventional commit type prefix
3. PR to `dev` first, then PR `dev` to `main`
4. Merging to `dev` triggers preview builds (TestFlight, Google Play internal)
5. Merging to `main` triggers production builds

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
```
<type>(<optional scope>): <short summary in present tense, lowercase>

<optional body - wrap at 72 chars, explain *why* not *what*>

Co-Authored-By: Mistral Vibe <vibe@mistral.ai>
```

**Types**: feat, fix, refactor, perf, test, docs, style, chore, ci

### Version Bumping
- EAS auto-increments **build numbers** - never touch manually
- **Marketing version** in `app.json` → `"version"` - bump when merging to `main`
- Bump for: new features, significant bug fixes, UI changes users notice
- Skip for: refactors, test-only changes, docs, cleanup, dependency bumps
- Follow semver: patch for fixes, minor for features, major for breaking changes

## Environment & Configuration

### Environment Variables
- **Local Development**: `.env` file with local API URL
- **Preview/Production Builds**: EAS environment variables

Required in `.env`:
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_CLARITY_KEY= (optional, leave empty to disable)
```

### EAS Configuration
- `eas.json` defines preview and production profiles
- Both have `"autoIncrement": true` for build numbers
- Production API URL set via EAS secrets: `EXPO_PUBLIC_API_URL`
- See `docs/BUILD_ENVIRONMENT.md` for detailed setup

## Styling Conventions

### Colors
**Never hardcode hex values** - import from `styles/colors.ts`:
- Primary: `#053546` (dark navy)
- Secondary: `#227B9A` (teal)
- Accent: `#29B6F6` (light blue)

### Style Files
- Keep styles in dedicated `*Styles.ts` file next to component
- Use `StyleSheet.create()` - never define styles in same file as JSX
- Export as `export const styles = StyleSheet.create({...})`

### Icons
- Use FontAwesome imports per-icon for tree-shaking
- Import from `@fortawesome/react-native-fontawesome`

## Monitoring

### Sentry
- Crash reporting and breadcrumbs
- Initialized in `app/_layout.tsx`
- Disabled in development

### Microsoft Clarity
- Session recording
- Lazy-initialized after Sentry in `app/_layout.tsx`
- Disabled in development

## Common Commands

```bash
# Development
npm start              # Start Expo dev server
npm run ios           # Run on iOS simulator
npm run android        # Run on Android emulator
npm run web           # Run in browser

# Testing
npm test              # Run all tests (CI mode)
npm run test:watch    # Run tests in watch mode
npx jest <path>        # Run specific test file

# Code Quality
npm run lint          # Lint with Expo linter
npm run format        # Format with Prettier
npm run format:check  # Check formatting

# Git
 git status
 git checkout -b feat/feature-name  # Create feature branch
 git push -u origin feat/feature-name
 gh pr create --base dev --title "feat: description"

# EAS Build
eas build --profile preview --platform ios   # Preview build
eas build --profile production --platform ios # Production build
```

## Important Patterns

### Error Handling
- API errors are wrapped with `handleApiError()` in repositories
- Maps to `AppError` with Norwegian user-facing messages
- See `types/AppError.ts` for error codes

### Repository Pattern
```typescript
// services/repositories/practiceRepository.ts
export const practiceRepository = {
  async getAll() {
    return offlineMutation(
      async () => {
        const response = await authFetchClient<Practice[]>('/practice');
        return handleApiError(response);
      },
      'practice-getAll'
    );
  },
  // ...
};
```

### Offline Mutation
```typescript
import { offlineMutation } from '@/services/offline/mutationHelper';

// Wraps any async function, queues on network error
offlineMutation(async () => {
  // Your API call here
}, 'unique-key-for-this-mutation');
```

## Common Pitfalls

1. **Using deprecated axios client** - Use `authFetchClient` from `services/api/authFetch.ts`
2. **Hardcoding colors** - Always import from `styles/colors.ts`
3. **Mixing Norwegian/English in code** - Code: English only. UI: Norwegian (or translated)
4. **Skipping tests** - Always write tests first (TDD)
5. **Direct pushes to protected branches** - Always use PRs
6. **Forgetting offline support** - Most mutations should use `offlineMutation()`

## Resources

- **Documentation**: `docs/` directory
- **Skills**: `docs/skills/` for development workflows
- **API**: Backend repository (separate from this app)
- **Design**: [Figma](https://figma.com) (if applicable)

## Contacts

- **Project Lead**: Haakon
- **Email**: kontakt@rusåsdesign.no
- **Repository**: [github.com/Aaronshades/Bueboka-app](https://github.com/Aaronshades/Bueboka-app)

---

*Generated for Mistral Vibe - Project Context Document*
