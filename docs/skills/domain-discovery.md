# Skill: Domain Discovery – Questions Before Code

## Purpose

Build a shared understanding of the domain and requirements **before writing a single line
of code**. Rushing into implementation without clarity wastes effort and produces solutions
that solve the wrong problem. This skill ensures the AI and developer are aligned on *what*
to build and *why* before moving to *how*.

---

## When to Activate

Trigger this skill whenever a request involves any of the following:

- A new feature or screen
- A new data entity or relationship
- A change to existing business logic
- Ambiguous terminology or overlapping concepts
- Integration with external systems (API, offline queue, auth)
- Anything that touches the ubiquitous language of the domain

---

## Discovery Checklist

Before writing code, work through the relevant questions below. Not all questions apply
to every task – use judgment to pick the most valuable ones.

### 1. Business & Domain Purpose

- What is the **user goal** behind this feature? (e.g., "I want to log a training session
  so I can track my progress over time")
- What **archery-specific concepts** are involved? (e.g., distance, target face, arrow
  diameter, bow type)
- What is the **Norwegian term** for this concept in the app's ubiquitous language?
- Does this concept already exist in `types/` or in a repository? If yes, what is it called?

### 2. Acceptance Criteria

- What does **success look like** from the user's perspective?
- What are the **happy-path** steps the user takes?
- What **edge cases** must be handled? (e.g., no arrows registered, offline, empty state)
- What should happen on **error**? (Norwegian error messages, AppError codes)

### 3. Data & State

- What **data** does this feature read or mutate?
- Which **repository** owns this data? (bow, practice, arrowSet, competition, sightMarks…)
- Does offline support apply? If yes, which `offlineMutation` type string should be used?
- Are there **relationships** between entities that need to be respected?

### 4. Architecture Fit

- Which **screen / tab** does this belong to? Does a route already exist?
- Does this require a **new component**, or can existing ones in `components/` be reused?
- Does this affect **navigation**? If yes, what params are passed?
- Does this need a **new repository method** or extend an existing one?

### 5. Constraints & Trade-offs

- Are there **performance concerns**? (list length, image loading, heavy computation)
- Are there **platform differences** (iOS / Android / Web) to handle?
- Does this affect **auth state** or require user identity checks?
- Is this feature **behind a flag** or always visible?

---

## How to Use This Skill

When a request is received, **do not start coding immediately**. Instead:

1. Read the request carefully and identify which checklist areas are unclear or missing.
2. Ask **2–5 focused questions** that cover the biggest unknowns.
3. Wait for answers, then confirm your understanding in one short paragraph before coding.
4. If the developer says "just go ahead", code the most reasonable interpretation and
   call out the assumptions explicitly at the top of your response.

### Example Opening

> Before I implement this, I have a few questions to make sure we build the right thing:
>
> 1. Should this work offline, or is an internet connection always required?
> 2. Is a "økt" (session) the same as a "trening" (practice) in this context, or are they different concepts?
> 3. Should the archer select an existing pil-sett (arrow set) when logging this, or is it optional?

---

## Domain Glossary (Bueboka)

Keep these terms consistent across types, variable names, UI labels, and error messages:

| Norwegian (domain) | English (code variable) | Entity / Type        |
| ------------------ | ----------------------- | -------------------- |
| Økt / Trening      | practice                | `Practice`           |
| Konkurranse        | competition             | `Competition`        |
| Bue                | bow                     | `Bow`                |
| Pil / Pilsett      | arrow / arrowSet        | `ArrowSet`           |
| Siktmerke          | sightMark               | `SightMark`          |
| Skytter            | archer / user           | `User` / `PublicProfile` |
| Avstand            | distance                | `number` (metres)    |
| Målskive           | target                  | string (face type)   |
| Poeng              | score / points          | `number`             |
| Bane               | range / lane            | `string`             |

Add new terms here whenever a new concept is introduced to preserve the ubiquitous language.

