# GitHub Copilot – Custom Instructions for Bueboka

This file configures GitHub Copilot's behaviour for the **Bueboka** archery-tracking app.
Read `AGENTS.md` for full project context. The two skills below are **always active**.

---

## Skill 1 – Domain Discovery: Questions Before Code

> Full specification: `docs/skills/domain-discovery.md`

**Before writing any implementation code**, build a shared understanding of the domain and
requirements. Do **not** start coding immediately when a request is ambiguous.

### Rules

1. **Ask 2–5 focused questions** covering the biggest unknowns for every non-trivial task.
   Prioritise: business purpose, acceptance criteria, data ownership, offline behaviour,
   and architecture fit.

2. Use the domain glossary to confirm terminology. If a concept has no existing name in the
   codebase (`types/`, repositories, UI labels), propose a Norwegian-aligned name and confirm
   it before creating files.

3. After receiving answers, **restate your understanding in one paragraph** before writing
   code. Example:
   > "So I'll add a `skytterId` field to `Practice`, expose a `getBySkytter(id)` method in
   > `practiceRepository`, and display the results in a new tab inside the Skyttere screen.
   > Offline support is not required for this view. Is that correct?"

4. If the developer says "just go ahead", code the most reasonable interpretation and list
   all assumptions explicitly at the top of your response.

5. **Never invent domain concepts.** If a type or entity for the concept doesn't exist yet,
   raise it as a question rather than silently creating a new one.

---

## Skill 2 – TDD + DDD: Tests First, Domain Always

> Full specification: `docs/skills/tdd-ddd.md`

Apply TDD and DDD on every coding task. Code is written in this strict order:
**domain types → repository tests → repository implementation → hook tests → hook
implementation → component/acceptance tests → component implementation → refactor**.

### Rules

1. **Write the test file before the implementation file.** No exceptions.
   - Repo tests → `services/repositories/__tests__/*.test.ts`
   - Hook tests → `hooks/__tests__/*.test.ts`
   - Component tests → `components/<folder>/__tests__/*.test.tsx`

2. **Red → Green → Refactor.** Each cycle adds exactly one behaviour. Do not write more
   implementation than is needed to make the current failing test pass.

3. **Name tests as behaviours** in plain English:
   ```ts
   it('queues the create mutation when offline', async () => { … });
   it('returns an AppError with code VALIDATION_ERROR for an empty bow name', () => { … });
   ```

4. **Mock at the boundary only** – mock `authFetchClient` for repository tests; mock
   repositories for hook/screen tests. Never mock internal functions.

5. **Domain types live in `types/`.** Extend or create types *before* writing any
   repository or component code. Confirm new type names align with the ubiquitous language
   (see `docs/skills/domain-discovery.md` glossary).

6. **Invariants are named functions with tests.** Express every business rule as a
   named predicate or validator and write a test for it before implementing it.

7. **Never skip to implementation.** If a time-pressure shortcut is requested, note the
   missing tests explicitly and create placeholder `it.todo()` entries so they aren't lost.

---

## Combined Workflow

```
DISCOVER  → ask questions (Skill 1)
MODEL     → types/ entities
TEST RED  → repository test
IMPLEMENT → repository
TEST RED  → hook test
IMPLEMENT → hook
TEST RED  → component test
IMPLEMENT → component
REFACTOR  → all tests green
COMMIT    → follow AGENTS.md commit conventions
```

---

## Project Quick-Reference

- **Framework**: Expo SDK 55, Expo Router, TypeScript
- **HTTP**: `authFetchClient` from `@/services/api/authFetch` (never Axios for new code)
- **Data**: Repository pattern – `@/services/repositories`
- **Errors**: `handleApiError()` → `AppError`; user messages in **Norwegian**
- **Offline**: `offlineMutation()` from `@/services/offline/mutationHelper`
- **Colours**: `@/styles/colors` – never hardcode hex values
- **Icons**: import per-icon from `@fortawesome/free-solid-svg-icons/<iconName>`
- **Tests**: Jest + jest-expo; run with `npm test`

