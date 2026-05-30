# Skill: Git Branching Workflow

## Purpose

Protect `main` and `dev` from direct pushes. All changes flow through feature/fix branches
and pull requests, ensuring CI passes before code reaches the next environment.

---

## Branch Hierarchy

```
main          ← production; receives merges only from dev via PR
  └── dev     ← integration branch; receives merges from feature/fix branches via PR
        ├── feat/description
        ├── fix/description
        └── chore/description
```

---

## Rules

### 1. Never Push Directly to `main` or `dev`

All work happens on a branch created **from `dev`**. No commits should be pushed
directly to `main` or `dev` — always go through a pull request.

### 2. Branch From `dev`

Every new branch must be based on the latest `dev`:

```bash
git checkout dev
git pull origin dev
git checkout -b fix/short-description
```

Use the Conventional Commits type as the branch prefix (`feat/`, `fix/`, `refactor/`,
`chore/`, `ci/`, `test/`, `docs/`).

### 3. Pull Request to `dev` First

When work is ready, push the branch and open a PR targeting `dev`:

```bash
git push -u origin fix/short-description
gh pr create --base dev --title "fix: short description" --body "..."
```

The PR must pass CI before merging.

### 4. Promote `dev` to `main` Only After CI Succeeds

Once changes are merged into `dev` and the pipeline succeeds, open a PR from `dev`
to `main`:

```bash
gh pr create --base main --head dev --title "release: merge dev into main" --body "..."
```

Only merge this PR when all checks pass.

### 5. Summary

```
feature/fix branch  →  PR to dev  →  CI passes  →  merge
dev                 →  PR to main →  CI passes  →  merge
```

No shortcuts. No force-pushes to protected branches.
