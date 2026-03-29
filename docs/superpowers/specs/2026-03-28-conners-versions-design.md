# Conners Parents / Teachers Versions Design

**Date:** 2026-03-28
**Status:** Approved

## Overview

Split the single Conners 3 test into two separate versions — Padres (parents) and Maestros (teachers). Both share the same 113 question IDs and the same 14 assessment fields, but each version has its own `fields[]` mappings and `options[]` per question. Each version persists its answers and current page independently in `localStorage`.

## Data Layer

### New files

- `src/resources/questions-parents.js` — 113 questions, shape: `{ id, fields[], options[] }`. Initial content copied from current `questions.js` (placeholder data, to be updated with real instrument mapping).
- `src/resources/questions-teachers.js` — 113 questions, same shape. Separate `fields[]` and `options[]` per question for the teachers version.

`src/resources/questions.js` is left untouched. It can be removed in a future cleanup once real data populates the two new files.

`src/resources/fields.js` is unchanged — both versions use the same 14 field keys.

### Version lookup map in `App.jsx`

```js
import questionsParents  from './resources/questions-parents'
import questionsTeachers from './resources/questions-teachers'

const QUESTIONS_BY_VERSION = {
  'conners-parents':  questionsParents,
  'conners-teachers': questionsTeachers,
};
```

`questions` used throughout the component is derived as:
```js
const questions = QUESTIONS_BY_VERSION[activeTest] ?? [];
```

## State & localStorage

`activeTest` values change from `'conners'` to `'conners-parents'` or `'conners-teachers'`.

Each version gets its own `localStorage` keys:
- `answers-conners-parents` / `answers-conners-teachers`
- `currentPage-conners-parents` / `currentPage-conners-teachers`

When `activeTest` changes (user picks a version, or returns to selector and picks again), a `useEffect` re-loads the correct answers and page:

```js
useEffect(() => {
  if (activeTest !== null) {
    const stored = localStorage.getItem(`answers-${activeTest}`);
    setAnswers(stored ? JSON.parse(stored) : {});
    const page = localStorage.getItem(`currentPage-${activeTest}`);
    setCurrentPage(page ? parseInt(page, 10) : 0);
  }
}, [activeTest]);
```

The existing `useEffect` hooks that persist answers and currentPage are updated to use `answers-${activeTest}` and `currentPage-${activeTest}` as keys.

`resetAnswers` is updated to clear the version-specific keys.

## TestSelector

The single `conners` card is replaced with two available cards:

```js
{ id: 'conners-parents',  icon: '🧠', label: 'Conners 3 — Padres',   description: 'Evaluación de TDAH', available: true },
{ id: 'conners-teachers', icon: '🧠', label: 'Conners 3 — Maestros', description: 'Evaluación de TDAH', available: true },
```

The two placeholder cards (Prueba 2, Prueba 3) remain unchanged.

## Components Unchanged

Board, Header, Total, Pagination, InconsistencyIndex, Charts, About — none of these need changes. They all receive the already-resolved `questions` array and `fields` array as props, so they are version-agnostic.

The `InconsistencyIndex` uses hardcoded question ID pairs (97, 100), (42, 63), etc. These IDs exist in both versions, so no change needed.

## Out of Scope

- Real instrument data for `questions-parents.js` and `questions-teachers.js` (placeholder data, to be filled with actual Conners 3 field mappings)
- Migration of any existing `answers` / `currentPage` keys in localStorage from the old `'conners'` format
