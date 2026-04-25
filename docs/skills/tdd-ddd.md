# Skill: TDD + DDD – Tests First, Domain Always

## Purpose

Apply **Test-Driven Development (TDD)** and **Domain-Driven Design (DDD)** principles to
every coding task. Writing tests first:

- Forces clarity about behaviour before implementation
- Prevents over-engineering ("don't code more than the test demands")
- Produces a living specification that serves as documentation
- Catches regressions immediately when the domain evolves

Domain-Driven Design ensures the code speaks the same language as the domain experts
(archers, coaches) and that complexity lives in the right layer.

---

## Core Cycle

```
RED  → Write a failing test that describes one small behaviour
GREEN → Write the minimum code to make the test pass
REFACTOR → Clean up without breaking tests
REPEAT
```

Never skip ahead. Never write implementation code that has no corresponding test.

---

## TDD Rules for This Project

### 1. Always Start With a Test File

Before creating any new file (`repository`, `service`, `hook`, `utility`), create the
corresponding `__tests__/` file first:

```
services/repositories/bowRepository.ts      ← implementation (written after tests)
services/repositories/__tests__/bowRepository.test.ts  ← written FIRST
```

For React Native components:

```
components/practice/ScoreInput.tsx
components/practice/__tests__/ScoreInput.test.tsx
```

### 2. One Behaviour Per Test

Each `it()` / `test()` block describes **one behaviour**. Name it in plain language:

```ts
it('returns AppError with NETWORK_ERROR when the API call fails', async () => { … });
it('queues the mutation offline when there is no network', async () => { … });
it('formats the score as "X" when the arrow hits the bullseye', () => { … });
```

Avoid `it('works correctly')` or `it('handles all cases')`.

### 3. Test the Domain, Not the Framework

- Test **repository methods** by mocking `authFetchClient` – not the actual network.
- Test **hooks** using `@testing-library/react-hooks` (or `renderHook` from
  `@testing-library/react-native`).
- Test **pure utilities** (e.g., `Ballistics.ts`) with plain unit tests – no mocks needed.
- Do **not** test implementation details (internal state, private helpers).

### 4. Acceptance Tests Before Component Tests

For a new screen or feature:

1. Write an **acceptance test** describing the full user journey (render → interact → assert UI)
2. Then write **unit tests** for the underlying service/repository logic
3. Then implement both

### 5. Mocking Conventions

```ts
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

---

## DDD Principles for This Project

### Ubiquitous Language

- All types, method names, variable names and comments must use the **domain vocabulary**
  defined in `docs/skills/domain-discovery.md`.
- Norwegian UI strings are user-facing; English is used in code. **Never mix them in code**.
- When a new concept is introduced, add it to the glossary immediately.

### Layered Architecture

```
Screen (app/)
  └── Hook / Context
        └── Repository (services/repositories/)
              └── authFetchClient (services/api/authFetch.ts)
```

- **Business rules** live in repositories or dedicated service files – never in React components.
- **UI logic** (loading states, error display) lives in hooks or screen files.
- **Domain types** live in `types/` and are shared across all layers.

### Entities, Value Objects & Aggregates

| DDD Concept     | Example in Bueboka                              |
| --------------- | ----------------------------------------------- |
| Entity          | `Bow`, `ArrowSet`, `Practice`, `Competition`    |
| Value Object    | `MarkValue`, `CalculatedMarks`, score number    |
| Aggregate Root  | `Practice` (owns its arrow scores)              |
| Repository      | `practiceRepository`, `bowRepository`           |
| Domain Service  | `Ballistics.ts` (stateless domain calculations) |

- Entities have identity (an `id`). Value objects are equal by value, not reference.
- Aggregates enforce their own invariants – validation sits in the repository layer or a
  dedicated validator, not spread across screens.

### Invariants & Validation

Express domain rules as named checks:

```ts
// BAD
if (score < 0 || score > 10) throw new Error('Invalid score');

// GOOD
function isValidArrowScore(score: number): boolean {
  return score >= 0 && score <= 10; // FITA scoring: 0–10
}
```

Write a test for every invariant before adding the validation code.

---

## Step-by-Step Workflow for a New Feature

```
1. DISCOVER   – Run domain-discovery skill: ask questions, agree on behaviour
2. MODEL      – Identify/extend domain types in types/
3. TEST (RED) – Write failing tests for the repository method(s)
4. IMPLEMENT  – Write the minimum repository code to pass the tests
5. TEST (RED) – Write failing tests for the hook / business logic
6. IMPLEMENT  – Write the minimum hook code to pass the tests
7. TEST (RED) – Write a failing component/acceptance test
8. IMPLEMENT  – Wire up the screen/component
9. REFACTOR   – Clean up all three layers; all tests must stay green
10. COMMIT    – Follow commit message conventions in AGENTS.md
```

Never move to the next step until the current tests pass.

---

## File Naming

| Type                  | Location                                        |
| --------------------- | ----------------------------------------------- |
| Repository test       | `services/repositories/__tests__/*.test.ts`     |
| Hook test             | `hooks/__tests__/*.test.ts`                     |
| Component test        | `components/<folder>/__tests__/*.test.tsx`      |
| Utility / domain test | `utils/__tests__/*.test.ts`                     |
| Screen test           | `app/(tabs)/<screen>/__tests__/*.test.tsx`      |

---

## Quick Reference Card

```
❶ No implementation file without a test file.
❷ Red → Green → Refactor. Always.
❸ One test = one behaviour. Name it in plain language.
❹ Tests mock at the boundary (network, storage) – not internal details.
❺ Domain types first, then repository, then hook, then UI.
❻ Ubiquitous language in code; Norwegian only in user-facing strings.
❼ Invariants are named functions with their own tests.
```

