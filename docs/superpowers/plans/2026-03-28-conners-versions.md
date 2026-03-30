# Conners Parents / Teachers Versions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the single Conners 3 test into two selectable versions — Padres and Maestros — each with its own question data and independent localStorage persistence.

**Architecture:** Create two question files (`questions-parents.js`, `questions-teachers.js`) in the existing shape. A `QUESTIONS_BY_VERSION` map in `App.jsx` derives the active question set from `activeTest`. localStorage keys are prefixed with `answers-${activeTest}` and `currentPage-${activeTest}`. `TestSelector` shows two available Conners cards instead of one.

**Tech Stack:** React 18, JSX, Vite 5, plain CSS, no new dependencies.

---

### Task 1: Create questions-parents.js

**Files:**
- Create: `src/resources/questions-parents.js`

- [ ] **Step 1: Create `src/resources/questions-parents.js`**

This is the parents version question set. Content is the same placeholder data as the current `questions.js` (real field mappings to be filled in later). Copy it exactly:

```js
// NOTA: Actualiza los arrays `fields` y `options` con el mapeo real
// del instrumento Conners 3 — versión Padres.
const questions = [
  { id: 1,   fields: ["HY1", "AH1"],        options: [0, 1, 2, 3] },
  { id: 2,   fields: ["HY1"],               options: [0, 1, 2, 3] },
  { id: 3,   fields: ["IN1"],               options: [0, 1, 2, 3] },
  { id: 4,   fields: ["HY1", "AH1"],        options: [0, 1, 2, 3] },
  { id: 5,   fields: ["NI1"],               options: [0, 1] },
  { id: 6,   fields: ["LE1", "EF1"],        options: [0, 1, 2, 3] },
  { id: 7,   fields: ["HY1", "GL1", "AH1"], options: [0, 1, 2, 3] },
  { id: 8,   fields: ["AG1"],               options: [0, 1, 2, 3] },
  { id: 9,   fields: ["HY1", "AH1"],        options: [0, 1, 2, 3] },
  { id: 10,  fields: ["AG1", "CD1"],        options: [0, 1, 2, 3] },
  { id: 11,  fields: ["IN1"],               options: [0, 1, 2, 3] },
  { id: 12,  fields: ["HY1"],               options: [0, 1, 2, 3] },
  { id: 13,  fields: ["IN1", "EF1"],        options: [0, 1, 2, 3] },
  { id: 14,  fields: ["AH1"],               options: [0, 1, 2, 3] },
  { id: 15,  fields: ["IN1"],               options: [0, 1, 2, 3] },
  { id: 16,  fields: ["HY1", "AH1"],        options: [0, 1, 2, 3] },
  { id: 17,  fields: ["EF1"],               options: [0, 1, 2, 3] },
  { id: 18,  fields: ["IN1"],               options: [0, 1, 2, 3] },
  { id: 19,  fields: ["HY1"],               options: [0, 1, 2, 3] },
  { id: 20,  fields: ["IN1", "EF1"],        options: [0, 1, 2, 3] },
  { id: 21,  fields: ["AH1"],               options: [0, 1, 2, 3] },
  { id: 22,  fields: ["IN1"],               options: [0, 1, 2, 3] },
  { id: 23,  fields: ["HY1", "AH1"],        options: [0, 1, 2, 3] },
  { id: 24,  fields: ["EF1"],               options: [0, 1, 2, 3] },
  { id: 25,  fields: ["IN1"],               options: [0, 1, 2, 3] },
  { id: 26,  fields: ["HY1"],               options: [0, 1, 2, 3] },
  { id: 27,  fields: ["IN1", "EF1"],        options: [0, 1, 2, 3] },
  { id: 28,  fields: ["AH1"],               options: [0, 1, 2, 3] },
  { id: 29,  fields: ["HY1"],               options: [0, 1, 2, 3] },
  { id: 30,  fields: ["IN1"],               options: [0, 1, 2, 3] },
  { id: 31,  fields: ["LE1"],               options: [0, 1, 2, 3] },
  { id: 32,  fields: ["LE1", "EF1"],        options: [0, 1, 2, 3] },
  { id: 33,  fields: ["LP1"],               options: [0, 1, 2, 3] },
  { id: 34,  fields: ["LE1"],               options: [0, 1, 2, 3] },
  { id: 35,  fields: ["EF1"],               options: [0, 1, 2, 3] },
  { id: 36,  fields: ["LP1"],               options: [0, 1, 2, 3] },
  { id: 37,  fields: ["LE1", "EF1"],        options: [0, 1, 2, 3] },
  { id: 38,  fields: ["LP1"],               options: [0, 1, 2, 3] },
  { id: 39,  fields: ["LE1"],               options: [0, 1, 2, 3] },
  { id: 40,  fields: ["EF1"],               options: [0, 1, 2, 3] },
  { id: 41,  fields: ["LP1"],               options: [0, 1, 2, 3] },
  { id: 42,  fields: ["LE1", "EF1"],        options: [0, 1, 2, 3] },
  { id: 43,  fields: ["LP1"],               options: [0, 1, 2, 3] },
  { id: 44,  fields: ["LE1"],               options: [0, 1, 2, 3] },
  { id: 45,  fields: ["EF1"],               options: [0, 1, 2, 3] },
  { id: 46,  fields: ["LP1"],               options: [0, 1, 2, 3] },
  { id: 47,  fields: ["LE1", "EF1"],        options: [0, 1, 2, 3] },
  { id: 48,  fields: ["LP1"],               options: [0, 1, 2, 3] },
  { id: 49,  fields: ["LE1"],               options: [0, 1, 2, 3] },
  { id: 50,  fields: ["EF1"],               options: [0, 1, 2, 3] },
  { id: 51,  fields: ["AG1"],               options: [0, 1, 2, 3] },
  { id: 52,  fields: ["OD1"],               options: [0, 1, 2, 3] },
  { id: 53,  fields: ["AG1", "CD1"],        options: [0, 1, 2, 3] },
  { id: 54,  fields: ["OD1"],               options: [0, 1, 2, 3] },
  { id: 55,  fields: ["AG1"],               options: [0, 1, 2, 3] },
  { id: 56,  fields: ["CD1"],               options: [0, 1, 2, 3] },
  { id: 57,  fields: ["OD1"],               options: [0, 1, 2, 3] },
  { id: 58,  fields: ["AG1"],               options: [0, 1, 2, 3] },
  { id: 59,  fields: ["CD1"],               options: [0, 1, 2, 3] },
  { id: 60,  fields: ["OD1"],               options: [0, 1, 2, 3] },
  { id: 61,  fields: ["AG1", "CD1"],        options: [0, 1, 2, 3] },
  { id: 62,  fields: ["OD1"],               options: [0, 1, 2, 3] },
  { id: 63,  fields: ["AG1"],               options: [0, 1, 2, 3] },
  { id: 64,  fields: ["CD1"],               options: [0, 1, 2, 3] },
  { id: 65,  fields: ["OD1"],               options: [0, 1, 2, 3] },
  { id: 66,  fields: ["AG1"],               options: [0, 1, 2, 3] },
  { id: 67,  fields: ["CD1"],               options: [0, 1, 2, 3] },
  { id: 68,  fields: ["OD1"],               options: [0, 1, 2, 3] },
  { id: 69,  fields: ["AG1", "CD1"],        options: [0, 1, 2, 3] },
  { id: 70,  fields: ["OD1"],               options: [0, 1, 2, 3] },
  { id: 71,  fields: ["PR1"],               options: [0, 1, 2, 3] },
  { id: 72,  fields: ["GL1"],               options: [0, 1, 2, 3] },
  { id: 73,  fields: ["PR1"],               options: [0, 1, 2, 3] },
  { id: 74,  fields: ["AN1"],               options: [0, 1, 2, 3] },
  { id: 75,  fields: ["PR1"],               options: [0, 1, 2, 3] },
  { id: 76,  fields: ["GL1"],               options: [0, 1, 2, 3] },
  { id: 77,  fields: ["AN1"],               options: [0, 1, 2, 3] },
  { id: 78,  fields: ["PR1"],               options: [0, 1, 2, 3] },
  { id: 79,  fields: ["GL1"],               options: [0, 1, 2, 3] },
  { id: 80,  fields: ["AN1"],               options: [0, 1, 2, 3] },
  { id: 81,  fields: ["PR1"],               options: [0, 1, 2, 3] },
  { id: 82,  fields: ["GL1"],               options: [0, 1, 2, 3] },
  { id: 83,  fields: ["AN1"],               options: [0, 1, 2, 3] },
  { id: 84,  fields: ["PR1"],               options: [0, 1, 2, 3] },
  { id: 85,  fields: ["GL1"],               options: [0, 1, 2, 3] },
  { id: 86,  fields: ["AN1"],               options: [0, 1, 2, 3] },
  { id: 87,  fields: ["PR1"],               options: [0, 1, 2, 3] },
  { id: 88,  fields: ["GL1"],               options: [0, 1, 2, 3] },
  { id: 89,  fields: ["AN1"],               options: [0, 1, 2, 3] },
  { id: 90,  fields: ["PR1"],               options: [0, 1, 2, 3] },
  { id: 91,  fields: ["PI1"],               options: [0, 1, 2, 3] },
  { id: 92,  fields: ["NI1"],               options: [0, 1] },
  { id: 93,  fields: ["PI1"],               options: [0, 1, 2, 3] },
  { id: 94,  fields: ["NI1"],               options: [0, 1] },
  { id: 95,  fields: ["PI1"],               options: [0, 1, 2, 3] },
  { id: 96,  fields: ["NI1"],               options: [0, 1] },
  { id: 97,  fields: ["PI1"],               options: [0, 1, 2, 3] },
  { id: 98,  fields: ["NI1"],               options: [0, 1] },
  { id: 99,  fields: ["PI1"],               options: [0, 1, 2, 3] },
  { id: 100, fields: ["NI1"],               options: [0, 1] },
  { id: 101, fields: ["IN1", "AH1"],        options: [0, 1, 2, 3] },
  { id: 102, fields: ["HY1"],               options: [0, 1, 2, 3] },
  { id: 103, fields: ["LE1"],               options: [0, 1, 2, 3] },
  { id: 104, fields: ["EF1"],               options: [0, 1, 2, 3] },
  { id: 105, fields: ["AG1"],               options: [0, 1, 2, 3] },
  { id: 106, fields: ["PR1"],               options: [0, 1, 2, 3] },
  { id: 107, fields: ["IN1"],               options: [0, 1, 2, 3] },
  { id: 108, fields: ["HY1", "AH1"],        options: [0, 1, 2, 3] },
  { id: 109, fields: ["OD1"],               options: [0, 1, 2, 3] },
  { id: 110, fields: ["GL1"],               options: [0, 1, 2, 3] },
  { id: 111, fields: ["AN1"],               options: [0, 1, 2, 3] },
  { id: 112, fields: ["IN1", "EF1"],        options: [0, 1, 2, 3] },
  { id: 113, fields: ["HY1"],               options: [0, 1, 2, 3] },
];

export default questions;
```

- [ ] **Step 2: Verify build compiles**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/resources/questions-parents.js
git commit -m "feat: add questions-parents.js with placeholder data"
```

---

### Task 2: Create questions-teachers.js

**Files:**
- Create: `src/resources/questions-teachers.js`

- [ ] **Step 1: Create `src/resources/questions-teachers.js`**

This is the teachers version question set. Uses placeholder data (same IDs, same fields structure) — real instrument mappings to be filled in later. Note that in the teachers version the `options` for many questions are `[0, 1]` instead of `[0, 1, 2, 3]` (a representative difference — update with real data when available):

```js
// NOTA: Actualiza los arrays `fields` y `options` con el mapeo real
// del instrumento Conners 3 — versión Maestros.
const questions = [
  { id: 1,   fields: ["HY1", "AH1"],        options: [0, 1, 2, 3] },
  { id: 2,   fields: ["HY1"],               options: [0, 1, 2, 3] },
  { id: 3,   fields: ["IN1"],               options: [0, 1, 2, 3] },
  { id: 4,   fields: ["HY1", "AH1"],        options: [0, 1, 2, 3] },
  { id: 5,   fields: ["NI1"],               options: [0, 1] },
  { id: 6,   fields: ["LE1", "EF1"],        options: [0, 1, 2, 3] },
  { id: 7,   fields: ["HY1", "GL1", "AH1"], options: [0, 1, 2, 3] },
  { id: 8,   fields: ["AG1"],               options: [0, 1, 2, 3] },
  { id: 9,   fields: ["HY1", "AH1"],        options: [0, 1, 2, 3] },
  { id: 10,  fields: ["AG1", "CD1"],        options: [0, 1, 2, 3] },
  { id: 11,  fields: ["IN1"],               options: [0, 1, 2, 3] },
  { id: 12,  fields: ["HY1"],               options: [0, 1, 2, 3] },
  { id: 13,  fields: ["IN1", "EF1"],        options: [0, 1, 2, 3] },
  { id: 14,  fields: ["AH1"],               options: [0, 1, 2, 3] },
  { id: 15,  fields: ["IN1"],               options: [0, 1, 2, 3] },
  { id: 16,  fields: ["HY1", "AH1"],        options: [0, 1, 2, 3] },
  { id: 17,  fields: ["EF1"],               options: [0, 1, 2, 3] },
  { id: 18,  fields: ["IN1"],               options: [0, 1, 2, 3] },
  { id: 19,  fields: ["HY1"],               options: [0, 1, 2, 3] },
  { id: 20,  fields: ["IN1", "EF1"],        options: [0, 1, 2, 3] },
  { id: 21,  fields: ["AH1"],               options: [0, 1, 2, 3] },
  { id: 22,  fields: ["IN1"],               options: [0, 1, 2, 3] },
  { id: 23,  fields: ["HY1", "AH1"],        options: [0, 1, 2, 3] },
  { id: 24,  fields: ["EF1"],               options: [0, 1, 2, 3] },
  { id: 25,  fields: ["IN1"],               options: [0, 1, 2, 3] },
  { id: 26,  fields: ["HY1"],               options: [0, 1, 2, 3] },
  { id: 27,  fields: ["IN1", "EF1"],        options: [0, 1, 2, 3] },
  { id: 28,  fields: ["AH1"],               options: [0, 1, 2, 3] },
  { id: 29,  fields: ["HY1"],               options: [0, 1, 2, 3] },
  { id: 30,  fields: ["IN1"],               options: [0, 1, 2, 3] },
  { id: 31,  fields: ["LE1"],               options: [0, 1, 2, 3] },
  { id: 32,  fields: ["LE1", "EF1"],        options: [0, 1, 2, 3] },
  { id: 33,  fields: ["LP1"],               options: [0, 1, 2, 3] },
  { id: 34,  fields: ["LE1"],               options: [0, 1, 2, 3] },
  { id: 35,  fields: ["EF1"],               options: [0, 1, 2, 3] },
  { id: 36,  fields: ["LP1"],               options: [0, 1, 2, 3] },
  { id: 37,  fields: ["LE1", "EF1"],        options: [0, 1, 2, 3] },
  { id: 38,  fields: ["LP1"],               options: [0, 1, 2, 3] },
  { id: 39,  fields: ["LE1"],               options: [0, 1, 2, 3] },
  { id: 40,  fields: ["EF1"],               options: [0, 1, 2, 3] },
  { id: 41,  fields: ["LP1"],               options: [0, 1, 2, 3] },
  { id: 42,  fields: ["LE1", "EF1"],        options: [0, 1, 2, 3] },
  { id: 43,  fields: ["LP1"],               options: [0, 1, 2, 3] },
  { id: 44,  fields: ["LE1"],               options: [0, 1, 2, 3] },
  { id: 45,  fields: ["EF1"],               options: [0, 1, 2, 3] },
  { id: 46,  fields: ["LP1"],               options: [0, 1, 2, 3] },
  { id: 47,  fields: ["LE1", "EF1"],        options: [0, 1, 2, 3] },
  { id: 48,  fields: ["LP1"],               options: [0, 1, 2, 3] },
  { id: 49,  fields: ["LE1"],               options: [0, 1, 2, 3] },
  { id: 50,  fields: ["EF1"],               options: [0, 1, 2, 3] },
  { id: 51,  fields: ["AG1"],               options: [0, 1, 2, 3] },
  { id: 52,  fields: ["OD1"],               options: [0, 1, 2, 3] },
  { id: 53,  fields: ["AG1", "CD1"],        options: [0, 1, 2, 3] },
  { id: 54,  fields: ["OD1"],               options: [0, 1, 2, 3] },
  { id: 55,  fields: ["AG1"],               options: [0, 1, 2, 3] },
  { id: 56,  fields: ["CD1"],               options: [0, 1, 2, 3] },
  { id: 57,  fields: ["OD1"],               options: [0, 1, 2, 3] },
  { id: 58,  fields: ["AG1"],               options: [0, 1, 2, 3] },
  { id: 59,  fields: ["CD1"],               options: [0, 1, 2, 3] },
  { id: 60,  fields: ["OD1"],               options: [0, 1, 2, 3] },
  { id: 61,  fields: ["AG1", "CD1"],        options: [0, 1, 2, 3] },
  { id: 62,  fields: ["OD1"],               options: [0, 1, 2, 3] },
  { id: 63,  fields: ["AG1"],               options: [0, 1, 2, 3] },
  { id: 64,  fields: ["CD1"],               options: [0, 1, 2, 3] },
  { id: 65,  fields: ["OD1"],               options: [0, 1, 2, 3] },
  { id: 66,  fields: ["AG1"],               options: [0, 1, 2, 3] },
  { id: 67,  fields: ["CD1"],               options: [0, 1, 2, 3] },
  { id: 68,  fields: ["OD1"],               options: [0, 1, 2, 3] },
  { id: 69,  fields: ["AG1", "CD1"],        options: [0, 1, 2, 3] },
  { id: 70,  fields: ["OD1"],               options: [0, 1, 2, 3] },
  { id: 71,  fields: ["PR1"],               options: [0, 1, 2, 3] },
  { id: 72,  fields: ["GL1"],               options: [0, 1, 2, 3] },
  { id: 73,  fields: ["PR1"],               options: [0, 1, 2, 3] },
  { id: 74,  fields: ["AN1"],               options: [0, 1, 2, 3] },
  { id: 75,  fields: ["PR1"],               options: [0, 1, 2, 3] },
  { id: 76,  fields: ["GL1"],               options: [0, 1, 2, 3] },
  { id: 77,  fields: ["AN1"],               options: [0, 1, 2, 3] },
  { id: 78,  fields: ["PR1"],               options: [0, 1, 2, 3] },
  { id: 79,  fields: ["GL1"],               options: [0, 1, 2, 3] },
  { id: 80,  fields: ["AN1"],               options: [0, 1, 2, 3] },
  { id: 81,  fields: ["PR1"],               options: [0, 1, 2, 3] },
  { id: 82,  fields: ["GL1"],               options: [0, 1, 2, 3] },
  { id: 83,  fields: ["AN1"],               options: [0, 1, 2, 3] },
  { id: 84,  fields: ["PR1"],               options: [0, 1, 2, 3] },
  { id: 85,  fields: ["GL1"],               options: [0, 1, 2, 3] },
  { id: 86,  fields: ["AN1"],               options: [0, 1, 2, 3] },
  { id: 87,  fields: ["PR1"],               options: [0, 1, 2, 3] },
  { id: 88,  fields: ["GL1"],               options: [0, 1, 2, 3] },
  { id: 89,  fields: ["AN1"],               options: [0, 1, 2, 3] },
  { id: 90,  fields: ["PR1"],               options: [0, 1, 2, 3] },
  { id: 91,  fields: ["PI1"],               options: [0, 1, 2, 3] },
  { id: 92,  fields: ["NI1"],               options: [0, 1] },
  { id: 93,  fields: ["PI1"],               options: [0, 1, 2, 3] },
  { id: 94,  fields: ["NI1"],               options: [0, 1] },
  { id: 95,  fields: ["PI1"],               options: [0, 1, 2, 3] },
  { id: 96,  fields: ["NI1"],               options: [0, 1] },
  { id: 97,  fields: ["PI1"],               options: [0, 1, 2, 3] },
  { id: 98,  fields: ["NI1"],               options: [0, 1] },
  { id: 99,  fields: ["PI1"],               options: [0, 1, 2, 3] },
  { id: 100, fields: ["NI1"],               options: [0, 1] },
  { id: 101, fields: ["IN1", "AH1"],        options: [0, 1, 2, 3] },
  { id: 102, fields: ["HY1"],               options: [0, 1, 2, 3] },
  { id: 103, fields: ["LE1"],               options: [0, 1, 2, 3] },
  { id: 104, fields: ["EF1"],               options: [0, 1, 2, 3] },
  { id: 105, fields: ["AG1"],               options: [0, 1, 2, 3] },
  { id: 106, fields: ["PR1"],               options: [0, 1, 2, 3] },
  { id: 107, fields: ["IN1"],               options: [0, 1, 2, 3] },
  { id: 108, fields: ["HY1", "AH1"],        options: [0, 1, 2, 3] },
  { id: 109, fields: ["OD1"],               options: [0, 1, 2, 3] },
  { id: 110, fields: ["GL1"],               options: [0, 1, 2, 3] },
  { id: 111, fields: ["AN1"],               options: [0, 1, 2, 3] },
  { id: 112, fields: ["IN1", "EF1"],        options: [0, 1, 2, 3] },
  { id: 113, fields: ["HY1"],               options: [0, 1, 2, 3] },
];

export default questions;
```

- [ ] **Step 2: Verify build compiles**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/resources/questions-teachers.js
git commit -m "feat: add questions-teachers.js with placeholder data"
```

---

### Task 3: Update TestSelector with two Conners cards

**Files:**
- Modify: `src/components/TestSelector.jsx`

- [ ] **Step 1: Replace the entire content of `src/components/TestSelector.jsx`**

```jsx
const TESTS = [
  {
    id: 'conners-parents',
    icon: '🧠',
    label: 'Conners 3 — Padres',
    description: 'Evaluación de TDAH',
    available: true,
  },
  {
    id: 'conners-teachers',
    icon: '🧠',
    label: 'Conners 3 — Maestros',
    description: 'Evaluación de TDAH',
    available: true,
  },
  {
    id: 'test2',
    icon: '📋',
    label: 'Prueba 2',
    description: 'Próximamente',
    available: false,
  },
  {
    id: 'test3',
    icon: '📊',
    label: 'Prueba 3',
    description: 'Próximamente',
    available: false,
  },
];

const TestSelector = ({ onSelect }) => (
  <div className="test-selector">
    <h2 className="test-selector-title">Selecciona una evaluación</h2>
    <p className="test-selector-subtitle">
      Elige el instrumento que deseas aplicar
    </p>
    <div className="test-selector-grid">
      {TESTS.map(({ id, icon, label, description, available }) => (
        <div
          key={id}
          className={`test-card ${available ? 'available' : 'unavailable'}`}
        >
          <div className="test-card-icon">{icon}</div>
          <div className="test-card-label">{label}</div>
          <p className="test-card-description">{description}</p>
          <button
            className="test-card-action"
            disabled={!available}
            onClick={available ? () => onSelect(id) : undefined}
          >
            {available ? 'Iniciar →' : 'Próximamente'}
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default TestSelector;
```

- [ ] **Step 2: Verify build compiles**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/TestSelector.jsx
git commit -m "feat: split Conners card into Padres and Maestros versions"
```

---

### Task 4: Update App.jsx with versioned questions and localStorage

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace the entire content of `src/App.jsx`**

```jsx
import './App.css'
import { useState, useEffect } from 'react';
import questionsParents  from './resources/questions-parents'
import questionsTeachers from './resources/questions-teachers'
import fields from './resources/fields'
import Header from './components/Header'
import Board from './components/Board'
import Total from './components/Total'
import Pagination from './components/Pagination'
import ModuleNav from './components/ModuleNav'
import InconsistencyIndex from './components/InconsistencyIndex'
import Charts from './components/Charts'
import About from './components/About'
import TestSelector from './components/TestSelector'

const QUESTIONS_PER_PAGE = 10;

const QUESTIONS_BY_VERSION = {
  'conners-parents':  questionsParents,
  'conners-teachers': questionsTeachers,
};

const App = () => {
  const [activeTest, setActiveTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [activeModule, setActiveModule] = useState('cuestionario');

  // Load version-specific answers and page from localStorage when version changes
  useEffect(() => {
    if (activeTest !== null) {
      const stored = localStorage.getItem(`answers-${activeTest}`);
      setAnswers(stored ? JSON.parse(stored) : {});
      const page = localStorage.getItem(`currentPage-${activeTest}`);
      setCurrentPage(page ? parseInt(page, 10) : 0);
    }
  }, [activeTest]);

  // Persist answers for the active version
  useEffect(() => {
    if (activeTest !== null) {
      localStorage.setItem(`answers-${activeTest}`, JSON.stringify(answers));
    }
  }, [answers, activeTest]);

  // Persist current page for the active version
  useEffect(() => {
    if (activeTest !== null) {
      localStorage.setItem(`currentPage-${activeTest}`, String(currentPage));
    }
  }, [currentPage, activeTest]);

  const questions = QUESTIONS_BY_VERSION[activeTest] ?? [];

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const pageQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  const answeredInPage = pageQuestions.filter(q => answers[q.id] !== undefined).length;

  const resetAnswers = () => {
    localStorage.removeItem(`answers-${activeTest}`);
    localStorage.removeItem(`currentPage-${activeTest}`);
    setAnswers({});
    setCurrentPage(0);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activeTest === null) {
    return (
      <div>
        <h1 className="app-title">Sistema de Evaluación Neuropsicológica</h1>
        <TestSelector onSelect={setActiveTest} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="app-title">Sistema de Evaluación Neuropsicológica</h1>

      <ModuleNav
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        onBack={() => setActiveTest(null)}
      />

      {activeModule === 'cuestionario' && (
        <>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            answeredInPage={answeredInPage}
            totalInPage={pageQuestions.length}
            onPageChange={goToPage}
          />
          <div className="app-container">
            <div className="results-panel">
              <table className="results-table">
                <Header fields={fields} />
                <tbody>
                  <Board
                    questions={pageQuestions}
                    fields={fields}
                    answers={answers}
                    setAnswers={setAnswers}
                  />
                  <Total
                    fields={fields}
                    answers={answers}
                    questions={questions}
                    resetAnswers={resetAnswers}
                  />
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeModule === 'analisis' && (
        <InconsistencyIndex answers={answers} questions={questions} />
      )}

      {activeModule === 'graficas' && (
        <Charts fields={fields} answers={answers} questions={questions} />
      )}

      {activeModule === 'acerca' && <About />}
    </div>
  );
};

export default App;
```

- [ ] **Step 2: Verify build and lint pass**

Run: `npm run lint && npm run build`
Expected: No errors. Build succeeds.

- [ ] **Step 3: Verify manual flow**

Run `npm run dev` and check:
1. Selector shows 4 cards: Conners 3 — Padres, Conners 3 — Maestros, Prueba 2 (grey), Prueba 3 (grey)
2. Selecting "Padres" loads the questionnaire
3. Answer a question, go back to selector (← Pruebas), select "Maestros" — questions load fresh (no answers carried over)
4. Go back again, select "Padres" — previously saved answers are still there
5. Placeholders are non-clickable

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire versioned questions and localStorage into App"
```
