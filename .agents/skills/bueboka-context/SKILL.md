---
name: bueboka-context
description: When working in the Bueboka archery tracking app project. Provides project-specific context, architecture understanding, and development guidelines for this Expo/React Native application.
metadata:
  version: 1.0.0
  project: Bueboka
  type: context
---

# Bueboka Project Context Skill

You are working in the **Bueboka** archery tracking application - a comprehensive React Native/Expo app for tracking archery practice sessions, equipment, and competitions.

## When to Use This Skill

This skill is **automatically active** when working in the `/Users/haakon/Prosjekter/Buboka-app` directory. It provides:

1. **Project Understanding** - Instant context about the codebase structure
2. **Architecture Guidance** - How to implement features following existing patterns
3. **Domain Knowledge** - Archery terminology and domain model
4. **Development Workflow** - TDD, DDD, and git conventions
5. **Quick References** - Common patterns, file locations, and conventions

## Project Quick Reference

### What is Bueboka?
- **Purpose**: Archery tracking app for iOS, Android, and Web
- **Users**: Archers who want to track practice sessions, manage equipment, and improve skills
- **Domain**: Archery (bueskyting), practice sessions (økt/trening), equipment (bue, pilsett)

### Tech Stack
```
Framework: React Native 0.85 + Expo SDK 56
Language: TypeScript 6
Navigation: Expo Router (file-based)
State: React Context API
Auth: better-auth + Expo SecureStore
Styling: React Native StyleSheet + custom colors
Testing: Jest + jest-expo + @testing-library/react-native
Offline: AsyncStorage queue + automatic sync
Monitoring: Sentry + Microsoft Clarity
```

### Key Directories
```
app/           # Screens & navigation (Expo Router)
components/    # Reusable UI components
contexts/      # React Context providers
services/      # Data layer (API, repositories, offline)
  ├── api/           # HTTP clients (use authFetchClient!)
  ├── repositories/  # 9 repositories (practice, bow, arrow, etc.)
  └── offline/       # Queue & sync manager
types/         # TypeScript domain types
hooks/         # Custom React hooks
utils/         # Utilities & domain logic
styles/        # Styling (colors.ts is source of truth)
lib/           # Libraries (i18n)
docs/          # Documentation & workflow guides
```

## Architecture Patterns

### Repository Pattern
All data access goes through repositories. Each repository:
1. Uses `authFetchClient` from `services/api/authFetch.ts`
2. Wraps API calls with `handleApiError()`
3. For mutations: wraps with `offlineMutation()` for offline support

```typescript
// Example: services/repositories/practiceRepository.ts
import { authFetchClient } from '@/services/api/authFetch';
import { handleApiError } from '@/services/api/errorHandler';
import { offlineMutation } from '@/services/offline/mutationHelper';
import type { Practice } from '@/types/Practice';

export const practiceRepository = {
  async getAll(): Promise<Practice[]> {
    return offlineMutation(
      async () => {
        const response = await authFetchClient<Practice[]>('/practice');
        return handleApiError(response);
      },
      'practice-getAll'
    );
  },
  
  async create(practice: Omit<Practice, 'id'>): Promise<Practice> {
    return offlineMutation(
      async () => {
        const response = await authFetchClient<Practice>('/practice', {
          method: 'POST',
          body: JSON.stringify(practice),
        });
        return handleApiError(response);
      },
      'practice-create'
    );
  },
};
```

### Component Organization
Components are organized by feature:
```
components/
├── common/           # Shared primitives (Button, Input, Modal, etc.)
├── auth/            # Login, register, OAuth buttons
├── practice/        # Practice session cards, forms, lists
├── home/            # Home screen components
├── sightMarks/      # Ballistics calculator
├── settings/        # Settings screens
├── achievements/    # Achievement badges, progress
└── onboarding/      # First-launch flow
```

Each component folder can have:
- `ComponentName.tsx` - The component
- `ComponentNameStyles.ts` - Styles (required for non-trivial components)
- `__tests__/ComponentName.test.tsx` - Tests

### Navigation (Expo Router)
File-based routing:
```
app/
├── _layout.tsx          # Root layout (AuthProvider, Sentry)
├── index.tsx            # Entry point (redirects)
├── auth.tsx             # Login screen
├── intro.tsx            # Language picker
└── (tabs)/               # Tab navigator
    ├── _layout.tsx      # Tab layout
    ├── home/           # Home tab
    ├── aktivitet/      # Activity tab
    ├── sightMarks/     # Ballistics tab
    └── settings/       # Settings tab
```

## Domain Model (Ubiquitous Language)

### Core Entities

| Entity | Type | Description |
|--------|------|-------------|
| Practice | `Practice` | Practice session (økt/trening) with scores, distance, weather |
| Bow | `Bow` | Bow equipment (bue) |
| ArrowSet | `ArrowSet` | Set of arrows (pilsett) |
| SightMark | `SightMark` | Sight mark configuration (siktmerke) |
| Competition | `Competition` | Competition tracking (konkurranse) |
| Achievement | `Achievement` | User achievements |
| User | `User` | User profile |
| PublicProfile | `PublicProfile` | Public archer profile (skytter) |

### Important Enums

```typescript
// Environment
enum Environment {
  INDOOR = 'INDOOR',
  OUTDOOR = 'OUTDOOR',
}

// Practice Category (Norwegian archery styles)
enum PracticeCategory {
  SKIVE_INDOOR = 'SKIVE_INDOOR',
  SKIVE_OUTDOOR = 'SKIVE_OUTDOOR',
  JAKT_3D = 'JAKT_3D',
  FELT = 'FELT',
}

// Weather Condition
enum WeatherCondition {
  SUNNY = 'SUNNY',
  CLOUDY = 'CLOUDY',
  RAINY = 'RAINY',
  WINDY = 'WINDY',
  SNOWY = 'SNOWY',
}

// Bow Type
enum BowType {
  RECURVE = 'RECURVE',
  COMPOUND = 'COMPOUND',
  LONGBOW = 'LONGBOW',
  BAREBOW = 'BAREBOW',
}
```

### Norwegian ↔ English Mapping

| Norwegian (UI) | English (Code) | Notes |
|---------------|----------------|-------|
| Økt | practice | Session |
| Trening | practice | Training session |
| Konkurranse | competition | Competition |
| Bue | bow | Bow |
| Pil | arrow | Single arrow |
| Pilsett | arrowSet | Set of arrows |
| Siktmerke | sightMark | Sight mark |
| Skytter | archer / user | Archer / user |
| Avstand | distance | In metres |
| Målskive | target | Target face |
| Poeng | score / points | Points |
| Merke | mark | Mark value |
| Bane | range / lane | Shooting range |
| Rundetype | roundType | Round type |

## Development Workflow

### 1. Before Coding: Domain Discovery

**Always** ask these questions before implementing:

1. **User Goal**: What problem does this solve for the archer?
2. **Domain Concepts**: What archery-specific concepts are involved?
3. **Norwegian Terms**: What are the Norwegian terms in the UI?
4. **Existing Types**: Does this concept exist in `types/` or repositories?
5. **Acceptance Criteria**: What does success look like?
6. **Data**: What data is read/mutated? Which repository?
7. **Offline**: Should this work offline? What queue key?
8. **Architecture**: Which screen? New component? Navigation changes?

### 2. TDD + DDD Cycle

Follow this **strict** order:

```
1. DISCOVER   → Ask questions, clarify requirements
2. MODEL      → Create/update types in types/
3. TEST (RED) → Write failing repository tests
4. IMPLEMENT  → Write repository code to pass tests
5. TEST (RED) → Write failing hook/business logic tests
6. IMPLEMENT  → Write hook code to pass tests
7. TEST (RED) → Write failing component/acceptance tests
8. IMPLEMENT  → Wire up the UI
9. REFACTOR   → Clean up, keep tests green
10. COMMIT    → Conventional commit message
```

**Never skip steps. Never write implementation without tests.**

### 3. File Creation Order

When adding a new feature:

```bash
# 1. Create type (if new domain concept)
touch types/NewConcept.ts

# 2. Create repository tests
touch services/repositories/__tests__/newConceptRepository.test.ts

# 3. Create repository
touch services/repositories/newConceptRepository.ts

# 4. Create hook tests (if needed)
touch hooks/__tests__/useNewConcept.test.ts

# 5. Create hook
touch hooks/useNewConcept.ts

# 6. Create component tests
touch components/newFeature/__tests__/NewComponent.test.tsx

# 7. Create component styles
touch components/newFeature/NewComponentStyles.ts

# 8. Create component
touch components/newFeature/NewComponent.tsx

# 9. Create screen (if needed)
touch app/new-screen.tsx

# 10. Update index file
touch types/index.ts
```

## Common Tasks

### Adding a New Repository

1. Create test file: `services/repositories/__tests__/newRepository.test.ts`
2. Create implementation: `services/repositories/newRepository.ts`
3. Export from index: `services/repositories/index.ts`
4. Use `authFetchClient` and `offlineMutation`
5. Wrap errors with `handleApiError()`

### Adding a New Screen

1. Create screen: `app/new-screen.tsx`
2. Add to navigation (Expo Router handles routing by file structure)
3. Use existing components from `components/common/`
4. Import types from `types/`
5. Use hooks from `hooks/` for state

### Adding Offline Support

For any mutating operation:

```typescript
import { offlineMutation } from '@/services/offline/mutationHelper';

// In your repository method:
async createItem(item: Item): Promise<Item> {
  return offlineMutation(
    async () => {
      const response = await authFetchClient<Item>('/items', {
        method: 'POST',
        body: JSON.stringify(item),
      });
      return handleApiError(response);
    },
    'items-create'  // Unique key for this mutation type
  );
}
```

The queue is automatically synced when network returns via `syncManager`.

## Testing Guidelines

### Mocking Strategy

Mock at the **boundary**, not implementation details:

```typescript
// For repository tests - mock authFetchClient
jest.mock('@/services/api/authFetch', () => ({
  authFetchClient: jest.fn(),
}));

// For hook/screen tests - mock repositories
jest.mock('@/services/repositories', () => ({
  practiceRepository: {
    getAll: jest.fn(),
    create: jest.fn(),
  },
}));

// For offline tests - mock offlineMutation
jest.mock('@/services/offline/mutationHelper', () => ({
  offlineMutation: jest.fn((fn) => fn()),
}));
```

### Test Naming

```typescript
// GOOD - describes behavior
it('returns practices sorted by date descending');
it('queues mutation when offline');
it('displays error message when fetch fails');

// BAD - vague
it('works correctly');
it('handles all cases');
it('test 1');
```

### Test Structure

```typescript
describe('practiceRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('returns practices sorted by date descending', async () => {
      // Arrange
      const mockPractices = [
        { id: '1', date: '2024-01-01' },
        { id: '2', date: '2024-01-02' },
      ];
      (authFetchClient as jest.Mock).mockResolvedValue(mockPractices);

      // Act
      const result = await practiceRepository.getAll();

      // Assert
      expect(result).toEqual([
        { id: '2', date: '2024-01-02' },
        { id: '1', date: '2024-01-01' },
      ]);
    });
  });
});
```

## Styling Conventions

### Colors
**Never hardcode colors**. Always import from `styles/colors.ts`:

```typescript
import { colors } from '@/styles/colors';

// Usage in component
<View style={{ backgroundColor: colors.primary }}>
  <Text style={{ color: colors.text }}>
    Hello
  </Text>
</View>

// Usage in StyleSheet
import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: 16,
  },
});
```

### Color Palette
```typescript
// styles/colors.ts
primary: '#053546',      // Dark navy
secondary: '#227B9A',    // Teal
accent: '#29B6F6',       // Light blue
background: '#F5F5F5',   // Light gray
text: '#053546',         // Dark navy
textSecondary: '#666',   // Gray
white: '#FFFFFF',
black: '#000000',
error: '#E74C3C',       // Red
success: '#2ECC71',     // Green
warning: '#F39C12',      // Orange
```

### Component Styles
- **Always** create a separate `*Styles.ts` file
- **Never** define `StyleSheet.create()` in the same file as JSX
- Export styles as named export

```typescript
// components/common/Button/ButtonStyles.ts
export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  filled: {
    backgroundColor: colors.primary,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
});
```

## Git Workflow

### Branching
1. Always branch from `dev`
2. Use conventional commit type prefix
3. Never push directly to `main` or `dev`

```bash
# Start a new feature
git checkout dev
git pull origin dev
git checkout -b feat/add-practice-statistics

# Commit changes
git add types/PracticeStatistics.ts
git add services/repositories/practiceStatisticsRepository.ts
git commit -m "feat: add practice statistics calculations

Calculate average score, best practice, and improvement over time.

Co-Authored-By: Mistral Vibe <vibe@mistral.ai>"

# Push and create PR
git push -u origin feat/add-practice-statistics
gh pr create --base dev --title "feat: add practice statistics"
```

### Commit Message Format

```
<type>(<optional scope>): <short summary in present tense, lowercase>

<optional body - explain *why*, not *what*
wrap at 72 characters>

Co-Authored-By: Mistral Vibe <vibe@mistral.ai>
```

**Types**: feat, fix, refactor, perf, test, docs, style, chore, ci

### Version Bumping

- EAS auto-increments **build numbers** - never touch
- Bump **marketing version** in `app.json` when merging to `main`
- Follow semver: patch (fixes), minor (features), major (breaking)

## Common Pitfalls & How to Avoid

### ❌ Using deprecated axios client
```typescript
// BAD
import { apiClient } from '@/services/api/client';

// GOOD
import { authFetchClient } from '@/services/api/authFetch';
```

### ❌ Hardcoding colors
```typescript
// BAD
<View style={{ backgroundColor: '#053546' }}>

// GOOD
import { colors } from '@/styles/colors';
<View style={{ backgroundColor: colors.primary }}>
```

### ❌ Mixing languages in code
```typescript
// BAD - Norwegian in code
const økt = await practiceRepository.getById(id);

// GOOD - English in code, Norwegian in UI
const practice = await practiceRepository.getById(id);
```

### ❌ Skipping tests
```typescript
// BAD - No test file
services/repositories/newRepository.ts

// GOOD - Test file exists
services/repositories/__tests__/newRepository.test.ts
services/repositories/newRepository.ts
```

### ❌ Direct pushes to protected branches
```bash
# BAD
git commit -m "fix: bug"
git push origin main

# GOOD
git commit -m "fix: bug"
git push origin fix/bug-fix
gh pr create --base dev
```

### ❌ Forgetting offline support
```typescript
// BAD - No offline support
async createPractice(practice: Practice) {
  return authFetchClient<Practice>('/practice', { method: 'POST', body: JSON.stringify(practice) });
}

// GOOD - With offline support
async createPractice(practice: Practice) {
  return offlineMutation(
    async () => {
      const response = await authFetchClient<Practice>('/practice', {
        method: 'POST',
        body: JSON.stringify(practice),
      });
      return handleApiError(response);
    },
    'practice-create'
  );
}
```

## Important Files Reference

### Configuration
- `app.json` - Expo configuration, version, splash screen
- `eas.json` - EAS build configuration
- `.env.example` - Environment variables template
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `babel.config.js` - Babel configuration
- `metro.config.js` - Metro bundler configuration
- `jest.config.js` - Jest configuration

### Entry Points
- `index.js` - Expo entry point
- `app/_layout.tsx` - Root layout with providers
- `app/index.tsx` - App entry redirect

### Core Services
- `services/api/authFetch.ts` - Primary HTTP client
- `services/offline/syncManager.ts` - Offline sync logic
- `services/repositories/index.ts` - All repositories export
- `contexts/AuthContext.tsx` - Authentication state
- `contexts/LanguageContext.tsx` - i18n context

## Useful Commands

### Development
```bash
npm start              # Start Expo dev server
npm run ios           # iOS simulator
npm run android        # Android emulator
npm run web           # Browser
```

### Testing
```bash
npm test                  # All tests (CI mode)
npm run test:watch        # Watch mode
npx jest path/to/test     # Specific test
```

### Code Quality
```bash
npm run lint              # Lint
npm run format            # Format
npm run format:check      # Check formatting
```

### Build & Deploy
```bash
eas build --profile preview --platform ios    # Preview build
eas build --profile production --platform ios # Production build
eas env:list                              # List environment variables
eas env:create EXPO_PUBLIC_API_URL ...      # Create environment variable
```

### Git
```bash
git status
 git checkout -b feat/feature-name
git push -u origin feat/feature-name
gh pr create --base dev --title "feat: description"
```

## Error Handling

All API errors should be wrapped with `handleApiError()`:

```typescript
import { handleApiError } from '@/services/api/errorHandler';

try {
  const response = await authFetchClient<Practice[]>('/practice');
  return handleApiError(response);
} catch (error) {
  // handleApiError already handles it, but you can add additional logic
  throw error;
}
```

The `AppError` type contains:
- `code`: Error code (NETWORK_ERROR, VALIDATION_ERROR, etc.)
- `message`: User-facing message in Norwegian
- `details`: Optional additional details

## Internationalization (i18n)

The app supports Norwegian (no) and English (en):

```typescript
import { useTranslation } from '@/lib/i18n';

function MyComponent() {
  const { t, locale, setLanguage } = useTranslation();
  
  return (
    <Text>{t('common.save')}</Text>
  );
}
```

Translations are in `lib/i18n/translations/`:
- `no.ts` - Norwegian translations
- `en.ts` - English translations

## Monitoring & Analytics

### Sentry
- Crash reporting and breadcrumbs
- Initialized in `app/_layout.tsx`
- Disabled in development
- Configuration in `app.json`

### Microsoft Clarity
- Session recording
- Lazy-initialized after Sentry
- Configuration via `EXPO_PUBLIC_CLARITY_KEY`

## Resources

### Documentation
- `README.md` - Project overview and setup
- `CLAUDE.md` - Claude Code context (similar to this file)
- `VIBE.md` - Vibe context (this file)
- `docs/BUILD_ENVIRONMENT.md` - EAS build configuration
- `docs/skills/domain-discovery.md` - Domain discovery workflow
- `docs/skills/tdd-ddd.md` - TDD + DDD workflow
- `docs/skills/git-branching.md` - Git branching model

### Related Projects
- **Backend API**: Separate repository (API endpoint configured in `.env`)
- **Web Version**: [github.com/Aaronshades/bueboka-web](https://github.com/Aaronshades/bueboka-web)
- **Website**: [rusasdesign.no](https://rusasdesign.no)

## Quick Answers to Common Questions

### Q: Where do I add a new screen?
A: In `app/` directory. Expo Router uses file-based routing. Add your `.tsx` file and it will be automatically routable.

### Q: How do I access auth state?
A: Use the `useAuth` hook from `hooks/useAuth` or access `AuthContext` directly.

### Q: How do I make an API call?
A: Use `authFetchClient` from `services/api/authFetch.ts` for authenticated requests.

### Q: How do I handle offline?
A: Wrap mutations with `offlineMutation()` from `services/offline/mutationHelper`.

### Q: Where are the colors defined?
A: In `styles/colors.ts`. Never hardcode colors.

### Q: How do I add a new domain type?
A: Add it to `types/`, export from `types/index.ts`, and add to domain glossary.

### Q: What's the git workflow?
A: Branch from `dev`, PR to `dev`, then PR `dev` to `main`. Never push directly to protected branches.

### Q: How do I test a repository?
A: Mock `authFetchClient`, call the repository method, assert the result.

### Q: What's the Norwegian word for X?
A: Check the domain glossary in `docs/skills/domain-discovery.md` or `VIBE.md`.

## Summary

This skill provides instant context for working in the Bueboka project. When you're in this directory:

✅ You know the architecture and patterns
✅ You understand the domain model
✅ You follow TDD + DDD workflow
✅ You use the correct HTTP client (`authFetchClient`)
✅ You implement offline support for mutations
✅ You write tests first
✅ You follow git conventions
✅ You use the design system (colors, components)

**Happy coding! 🏹**
