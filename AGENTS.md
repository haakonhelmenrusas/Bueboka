# AGENTS.md - Instructions for AI Agents in Bueboka Project

This file provides instructions for AI agents (Mistral Vibe, Claude Code, etc.) when working with the Bueboka codebase.

## Project Identity

**Project**: Bueboka (Archery Tracking App)  
**Repository**: https://github.com/Aaronshades/Bueboka-app  
**Language**: TypeScript  
**Framework**: React Native + Expo SDK 56  
**Current Version**: 2.0.2  

## Active Instructions

### 1. Always Reference Project Documentation
- Read `VIBE.md` for complete project context
- Read `CLAUDE.md` for development workflow and conventions
- Check `docs/skills/` for specific workflow guides

### 2. Follow Existing Patterns
- Use `authFetchClient` from `services/api/authFetch.ts` for all API calls
- Never use the deprecated axios client in `services/api/client.ts`
- Wrap mutations with `offlineMutation()` for offline support
- Always import colors from `styles/colors.ts` - never hardcode hex values
- Use Norwegian in UI strings, English in code and variable names

### 3. Development Workflow
- **Before coding**: Run through domain discovery checklist
- **Always**: Write tests first (TDD)
- **Follow**: The 10-step TDD+DDD workflow from `docs/skills/tdd-ddd.md`
- **Use**: File-based routing via Expo Router

### 4. Code Quality
- Follow existing code style and conventions
- Use TypeScript strictly
- Match existing naming conventions
- Keep components focused and reusable

### 5. Git Workflow
- Branch from `dev` for all new work
- Use conventional commit messages
- Never push directly to `main` or `dev`
- PR to `dev` first, then PR `dev` to `main`

## Common Commands Reference

### Development
```bash
npm start              # Start Expo dev server
npm run ios           # Run on iOS
npm run android        # Run on Android
npm run web           # Run on web
```

### Testing
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npx jest <path>        # Run specific test
```

### Code Quality
```bash
npm run lint          # Lint code
npm run format        # Format code
npm run format:check  # Check formatting
```

### Build & Deploy
```bash
eas build --profile preview --platform ios    # Preview build
eas build --profile production --platform ios # Production build
```

## File Structure Quick Reference

```
├── app/                    # Screens & navigation (Expo Router)
│   ├── _layout.tsx        # Root layout with providers
│   ├── index.tsx          # Entry point
│   └── (tabs)/            # Main tab navigation
│
├── components/            # Reusable components
│   ├── common/           # Shared primitives
│   └── <feature>/        # Feature-specific components
│
├── contexts/              # React Context
│   ├── AuthContext.tsx   # Authentication
│   └── LanguageContext.tsx # i18n
│
├── services/              # Data layer
│   ├── api/              # HTTP clients
│   │   └── authFetch.ts  # Primary client (use this!)
│   ├── repositories/     # Data repositories
│   └── offline/          # Offline support
│
├── types/                 # TypeScript types
├── hooks/                 # Custom hooks
├── utils/                 # Utilities
├── styles/                # Styling (colors.ts)
└── docs/                  # Documentation
```

## Domain Knowledge

### Archery Terms (Norwegian ↔ English)

| Norwegian | English (Code) | Notes |
|-----------|----------------|-------|
| Økt | practice | Training session |
| Trening | practice | Training |
| Konkurranse | competition | Competition |
| Bue | bow | Bow equipment |
| Pil | arrow | Single arrow |
| Pilsett | arrowSet | Set of arrows |
| Siktmerke | sightMark | Sight mark |
| Skytter | archer / user | Archer |
| Avstand | distance | In metres |
| Målskive | target | Target face |
| Poeng | score | Points |
| Merke | mark | Mark value |
| Bane | range | Shooting range |

### Core Entities
- **Practice**: Training session with scores, distance, weather
- **Bow**: Bow equipment with specifications
- **ArrowSet**: Set of arrows
- **SightMark**: Sight mark configuration
- **Competition**: Competition tracking
- **Achievement**: User achievements

## Important Patterns

### Repository Pattern
```typescript
import { authFetchClient } from '@/services/api/authFetch';
import { offlineMutation } from '@/services/offline/mutationHelper';
import { handleApiError } from '@/services/api/errorHandler';

export const repository = {
  async getAll() {
    return offlineMutation(
      async () => {
        const response = await authFetchClient<Type[]>('/endpoint');
        return handleApiError(response);
      },
      'endpoint-getAll'
    );
  },
};
```

### Component with Styles
```typescript
// Component.tsx
import { styles } from './ComponentStyles';

export function Component() {
  return <View style={styles.container}>...</View>;
}

// ComponentStyles.ts
import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    padding: 16,
  },
});
```

### Test Pattern
```typescript
// __tests__/repository.test.ts
jest.mock('@/services/api/authFetch', () => ({
  authFetchClient: jest.fn(),
}));

describe('repository', () => {
  it('returns data when API call succeeds', async () => {
    (authFetchClient as jest.Mock).mockResolvedValue(mockData);
    const result = await repository.getAll();
    expect(result).toEqual(expected);
  });
});
```

## When in Doubt

1. Check existing similar code in the codebase
2. Read `VIBE.md` and `CLAUDE.md`
3. Follow the patterns established in existing files
4. Ask for clarification if the requirement is ambiguous

## Do Not

- ❌ Use deprecated axios client
- ❌ Hardcode colors
- ❌ Mix Norwegian/English in code
- ❌ Skip tests
- ❌ Push directly to main/dev
- ❌ Forget offline support for mutations
- ❌ Create components without separate style files
- ❌ Use `any` type in TypeScript

## Always

- ✅ Use `authFetchClient`
- ✅ Import colors from `styles/colors.ts`
- ✅ Write tests first
- ✅ Use `offlineMutation()` for mutations
- ✅ Follow git workflow
- ✅ Use English in code, Norwegian in UI
- ✅ Create separate style files
- ✅ Use proper TypeScript types
