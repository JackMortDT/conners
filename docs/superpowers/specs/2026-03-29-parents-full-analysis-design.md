# Parents Full Analysis — Design Spec

**Date:** 2026-03-29
**Branch:** claude/test-selector-landing-page

---

## Overview

This spec covers three related deliverables:

1. **Data fixes** — correct field mappings and option values in `questions-parents.js`, `fields.js`, and `InconsistencyIndex.jsx`
2. **Age input** — persistent age field in the app header, available across all modules
3. **New "Análisis clínico" tab** — a dedicated clinical analysis page composed of five sub-sections for the Parents form, with a placeholder for other forms

---

## 1. Data Fixes

### `fields.js`
- Rename `'GLI'` → `'GI'` to match the instrument scoring grid column header.

### `questions-parents.js`
Full rewrite of all 108 question entries. Key rules:
- **Consistent field names**: both halves of the grid (Part 1: Q1–63, Part 2: Q64–108) map to the same 13 combined keys: `IN`, `HY`, `LP`, `EF`, `AG`, `PR`, `GI`, `AN`, `AH`, `CD`, `OD`, `PI`, `NI`. No `"1"` or `"2"` suffixes.
- **Correct option arrays** read from the scoring grid images. Most questions use `[0,1,2,3]` but several have special scoring:
  - `[1,1,0,0]` — e.g. Q1, Q8 (NI reversed)
  - `[3,2,1,0]` — e.g. Q9, Q64, Q72 (reversed scale)
  - `[0,0,1,1]` — e.g. Q18, Q26, Q32, Q42 (NI stepped)
  - `[1,0,0,0]` — e.g. Q31, Q38 (PI single-point)
  - `[0,0,0,1]` — e.g. Q33, Q74, Q80, Q105 (PI/NI single last-point)
- **Screener-only items** (Q4, Q17, Q20 and others not contributing to any scale) keep `fields: []`.
- **Multi-field items** (e.g. Q16 → `["AG","CD"]`, Q47 → `["IN","AH"]`) preserve all field memberships.

### `InconsistencyIndex.jsx`
- Replace current `PAIRS` constant with the correct 10 pairs from the instrument's Response Style Analysis sheet:
  `(44,67), (12,23), (36,60), (14,81), (19,98), (45,99), (94,102), (75,79), (13,92), (39,83)`
- Fix inconsistency threshold: `A >= 6` → **`A >= 7`**
- PI/NI threshold remains `>= 5` (already correct).
- Update field references from `'PI1'`/`'NI1'` to `'PI'`/`'NI'` to match updated field keys.

---

## 2. Age Input

### State
- `age` state added to `App.jsx` as a number (or `null` if not entered).
- Persisted in `localStorage` keyed per test: `age-conners-parents`, `age-conners-teachers`.
- Loaded when `activeTest` changes; cleared (set to `null`) when returning to test selector.

### UI placement
- A small `"Edad:"` label + number input rendered in the header area, **inline with the module tabs** in `ModuleNav.jsx`, visible whenever a test is active.
- Accepts whole numbers, reasonable range 6–17.
- `age` is passed as a prop from `App.jsx` through to any component that needs it.

---

## 3. New "Análisis clínico" Tab

### `ModuleNav.jsx`
- Add 4th tab with key `'clinico'` and label `"Análisis clínico"`.
- Tab is always rendered when a test is active (not hidden for Teachers).

### `App.jsx` routing
```jsx
{activeModule === 'clinico' && (
  activeTest === 'conners-parents'
    ? <ClinicalAnalysisParents answers={answers} questions={questions} age={age} />
    : <ClinicalAnalysisPlaceholder />
)}
```

`ClinicalAnalysisPlaceholder` renders a simple Spanish message: "Análisis clínico no disponible para esta versión."

### Component tree

```
src/components/
  ClinicalAnalysisParents.jsx   ← composes all 5 sections in order
  DSM5Counts.jsx                ← ADHD Inattentive + Hyperactive-Impulsive
  ConductDisorder.jsx           ← Conduct Disorder + ODD side by side
  ImpairmentItems.jsx           ← items 106–108
  ADHDIndex.jsx                 ← transposing table + probability lookup
  ScreenerItems.jsx             ← Anxiety/Depression screener + Severe Conduct
```

All child components receive `{ answers, questions, age }` as props and compute derived values internally via `useMemo`.

---

## 4. Component Logic

### `DSM5Counts.jsx`
Two tables side by side: ADHD Inattentive (left) and ADHD Hyperactive-Impulsive (right).

**Inattentive items (A1a–A1i):**

| Criterion | Item | May be Indicated | Indicated |
|-----------|------|-----------------|-----------|
| A1a | 47 | — | 2, 3 |
| A1b | 95 | — | 2, 3 |
| A1c | 35 | — | 2, 3 |
| A1d | 68 + 79 | — | 2, 3 (BOTH required) |
| A1e | 84 | — | 2, 3 |
| A1f | 28 | 2 | 3 |
| A1g | 97 | — | 2, 3 |
| A1h | 101 | — | 2, 3 |
| A1i | 2 | — | 2, 3 |

**Hyperactive-Impulsive items (A2a–A2i):**

| Criterion | Item | May be Indicated | Indicated |
|-----------|------|-----------------|-----------|
| A2a | 98 | — | 2, 3 |
| A2b | 93 | — | 2, 3 |
| A2c | 69 or 99 | 1 | 2, 3 (EITHER) |
| A2d | 71 | — | 2, 3 |
| A2e | 54 or 45 | 1 | 2, 3 (EITHER) |
| A2f | 3 | — | 2, 3 |
| A2g | 43 | — | 2, 3 |
| A2h | 61 | — | 2, 3 |
| A2i | 104 | — | 2, 3 |

**Checkmark rules:**
- A1d: checkmark only if a Required Score has been circled for **both** items 68 and 79
- A2c: checkmark if **either** item 69 or 99 has a Required Score
- A2e: checkmark if **either** item 54 or 45 has a Required Score
- All others: checkmark if the item score matches any Required Score column

**Thresholds (shown based on age prop):**
- Age ≤ 16: criteria probably met if Total Symptom Count ≥ 6
- Age ≥ 17: criteria probably met if Total Symptom Count ≥ 5
- If `age === null`: show both rows, let clinician decide
- ADHD Combined: flagged if both Inattentive and Hyperactive-Impulsive criteria are met

### `ConductDisorder.jsx`
Two tables side by side.

**Conduct Disorder (CD) items:**

| Criterion | Item | May be Indicated | Indicated |
|-----------|------|-----------------|-----------|
| A1 | 16 | 1 | 2, 3 |
| A2 | 30 | 1 | 2, 3 |
| A3 | 27 | — | 1, 2, 3 |
| A4 | 39 | — | 1, 2, 3 |
| A5 | 41 | — | 1, 2, 3 |
| A6 | 96 | — | 1, 2, 3 |
| A7 | 11 | — | 1, 2, 3 |
| A8 | 78 | — | 1, 2, 3 |
| A9 | 65 | — | 1, 2, 3 |
| A10 | 89 | — | 1, 2, 3 |
| A11 | 56 | — | 2, 3 |
| A12 | 58 | — | 1, 2, 3 |
| A13 | 91 | 1 | 2, 3 |
| A14 | 76 | — | 1, 2, 3 |
| A15 | 6 | 1 | 2, 3 |

Flag: Total Symptom Count ≥ 3

**Oppositional Defiant Disorder (ODD) items:**

| Criterion | Item | May be Indicated | Indicated |
|-----------|------|-----------------|-----------|
| A1 | 14 | — | 2, 3 |
| A2 | 73 | — | 2, 3 |
| A3 | 48 | 1 | 2, 3 |
| A4 | 102 | — | 2, 3 |
| A5 | 94 | — | 2, 3 |
| A6 | 59 | — | 2, 3 |
| A7 | 21 | — | 2, 3 |
| A8 | 57 | 1 | 2, 3 |

Flag: Total Symptom Count ≥ 4

### `ImpairmentItems.jsx`
Simple 3-row table. Items 106, 107, 108 with Spanish labels and their raw scores (0–3). No threshold flagging — informational only.

| Item | Content |
|------|---------|
| 106 | Los problemas de su hijo afectan seriamente el trabajo escolar o las calificaciones |
| 107 | Los problemas de su hijo afectan seriamente las amistades y relaciones |
| 108 | Los problemas de su hijo afectan seriamente la vida en casa |

### `ADHDIndex.jsx`
10-item visual transposing table. For each item, show:
- Item number
- Item score (from `answers`)
- Transposing Rule grid (visual arrows mapping 0→x, 1→y, 2→z, 3→w)
- Transposed Score box

**Items and transposing rules (from Image 8):**

| Item | Transposing Rule |
|------|-----------------|
| 19 | 0→0, 1→1, 2→2, 3→2 |
| 35 | 0→0, 1→0, 2→2, 3→2 (only 0 and 2) |
| 47 | 0→0, 1→1, 2→2, 3→2 |
| 67 | 0→0, 1→1, 2→2, 3→2 |
| 84 | 0→0, 1→1, 2→2, 3→2 |
| 88 | 0→0, 1→2, 2→2, 3→2 (only 0 and 2) |
| 98 | 0→0, 1→0, 2→2, 3→2 (only 0 and 2) |
| 99 | 0→0, 1→1, 2→2, 3→2 |
| 101 | 0→0, 1→1, 2→2, 3→2 |
| 104 | 0→0, 1→1, 2→2, 3→2 |

Sum of transposed scores → Total Transposed Score (0–20).

**Probability lookup table:**

| Total | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|-------|---|---|---|---|---|---|---|---|---|---|----|----|----|----|----|----|----|----|----|----|-----|
| Prob% | 11 | 29 | 41 | 51 | 56 | 64 | 71 | 77 | 82 | 87 | 91 | 94 | 97 | 98 | 99 | 99 | 99 | 99 | 99 | 99 | 99 |

### `ScreenerItems.jsx`
Two panels side by side.

**Screener Items** — flag if item score ≥ 1:

| Group | Item | Content |
|-------|------|---------|
| Anxiety | 4 | Preocupaciones |
| Anxiety | 20 | Dificultad para controlar preocupaciones |
| Anxiety | 70 | Nervioso o inquieto |
| Anxiety | 100 | Irritable |
| Depression | 17 | Sentimientos de inutilidad |
| Depression | 66 | Cansado; poca energía |
| Depression | 82 | Pérdida de interés o placer |
| Depression | 103 | Triste, sombrío o irritable |

"Further investigation may be necessary" checkmark shown if any item in the group is ≥ 1.

**Severe Conduct Critical Items** — flag if item score ≥ 1:

| Item | Content |
|------|---------|
| 11 | Sexo forzado |
| 27 | Usa un arma |
| 41 | Crueldad con animales |
| 78 | Prender fuego |
| 89 | Allanamiento de morada |
| 96 | Robo con enfrentamiento |

"Immediate Attention Recommended" checkmark shown per item if score ≥ 1.

---

## 5. Styling

All new components follow existing `App.css` conventions:
- Plain CSS, no framework
- Spanish UI labels throughout
- Mobile breakpoint at 640px: side-by-side tables stack vertically
- Flagged rows use existing `guideline-flagged` class pattern or a new `flagged` class consistent with current style

---

## 6. Future: Teachers form

When Teachers clinical analysis is needed, add `ClinicalAnalysisTeachers.jsx` following the same pattern. Update `App.jsx` routing from the `ClinicalAnalysisPlaceholder` branch. No structural changes to other components required.

---

## Files Changed / Created

**Modified:**
- `src/resources/fields.js`
- `src/resources/questions-parents.js`
- `src/components/InconsistencyIndex.jsx`
- `src/components/ModuleNav.jsx`
- `src/App.jsx`
- `src/App.css`

**Created:**
- `src/components/ClinicalAnalysisParents.jsx`
- `src/components/ClinicalAnalysisPlaceholder.jsx`
- `src/components/DSM5Counts.jsx`
- `src/components/ConductDisorder.jsx`
- `src/components/ImpairmentItems.jsx`
- `src/components/ADHDIndex.jsx`
- `src/components/ScreenerItems.jsx`
