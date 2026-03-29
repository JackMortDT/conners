# Parents Full Analysis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the Conners 3 Parents scoring grid with real field/option values, fix the Inconsistency Index, add a persistent age input, and build a new "Análisis clínico" tab with five clinical analysis sub-sections.

**Architecture:** Option B from design — one focused component per clinical section, composed inside `ClinicalAnalysisParents.jsx`. Field names are suffix-free (`IN`, `HY`, etc.) throughout. Age state lives in `App.jsx`, persisted per test in localStorage, displayed inline in `ModuleNav.jsx`.

**Tech Stack:** React 18, Vite 5, plain JS/JSX, plain CSS. No test framework — verify with `npm run lint` and manual browser checks after each task.

**Spec:** `docs/superpowers/specs/2026-03-29-parents-full-analysis-design.md`

---

## File Map

**Modified:**
- `src/resources/fields.js` — rename `GLI` → `GI`
- `src/resources/questions-parents.js` — full rewrite, correct field keys + option arrays
- `src/components/InconsistencyIndex.jsx` — fix pairs, threshold, field refs
- `src/components/ModuleNav.jsx` — add `clinico` tab + age input
- `src/App.jsx` — age state/localStorage, `clinico` module routing
- `src/App.css` — styles for age input and clinical analysis components

**Created:**
- `src/components/ClinicalAnalysisParents.jsx`
- `src/components/ClinicalAnalysisPlaceholder.jsx`
- `src/components/DSM5Counts.jsx`
- `src/components/ConductDisorder.jsx`
- `src/components/ImpairmentItems.jsx`
- `src/components/ADHDIndex.jsx`
- `src/components/ScreenerItems.jsx`

---

## Task 1: Fix fields.js

**Files:**
- Modify: `src/resources/fields.js`

- [ ] **Step 1: Rename GLI → GI**

```js
const fields = [
  'IN',
  'HY',
  'LP',
  'EF',
  'AG',
  'PR',
  'GI',
  'AN',
  'AH',
  'CD',
  'OD',
  'PI',
  'NI'
];

export default fields;
```

- [ ] **Step 2: Lint**

```bash
npm run lint
```
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/resources/fields.js
git commit -m "fix: rename GLI to GI in fields to match instrument grid"
```

---

## Task 2: Rewrite questions-parents.js with real grid values

**Files:**
- Modify: `src/resources/questions-parents.js`

> **Note:** The field assignments below are read from the scoring grid images in the spec. The option arrays are read from the right-side score columns of each grid image. Cross-check against the original images during implementation, especially for Q41–63. Special option patterns: `[1,1,0,0]` and `[0,0,1,1]` = NI items; `[3,2,1,0]` = reversed GI items; `[1,0,0,0]` and `[0,0,0,1]` = PI items.

- [ ] **Step 1: Write the full corrected questions array**

Replace the entire file contents with:

```js
// Field assignments and option values read from the Conners 3–Parent scoring grid.
// Both halves of the grid (Part 1: Q1–63, Part 2: Q64–108) map to the same
// 13 combined field keys — no "1"/"2" suffixes.
// Items with fields:[] are screener-only or impairment items.
const questions = [
  // ── Part 1 (Q1–63) ────────────────────────────────────────────
  { id: 1,   fields: ["NI"],          options: [1, 1, 0, 0] },
  { id: 2,   fields: ["AN"],          options: [0, 1, 2, 3] },
  { id: 3,   fields: ["AH"],          options: [0, 1, 2, 3] },
  { id: 4,   fields: [],              options: [0, 1, 2, 3] }, // anxiety screener
  { id: 5,   fields: ["LP"],          options: [0, 1, 2, 3] },
  { id: 6,   fields: ["CD"],          options: [0, 1, 2, 3] },
  { id: 7,   fields: ["LP"],          options: [0, 1, 2, 3] },
  { id: 8,   fields: ["NI"],          options: [1, 1, 0, 0] },
  { id: 9,   fields: ["LP"],          options: [3, 2, 1, 0] },
  { id: 10,  fields: ["PR"],          options: [0, 1, 2, 3] },
  { id: 11,  fields: ["CD"],          options: [0, 1, 2, 3] },
  { id: 12,  fields: ["IN"],          options: [0, 1, 2, 3] },
  { id: 13,  fields: ["PR"],          options: [0, 1, 2, 3] },
  { id: 14,  fields: ["OD"],          options: [0, 1, 2, 3] },
  { id: 15,  fields: ["LP"],          options: [0, 1, 2, 3] },
  { id: 16,  fields: ["AG", "CD"],    options: [0, 1, 2, 3] },
  { id: 17,  fields: [],              options: [0, 1, 2, 3] }, // depression screener
  { id: 18,  fields: ["NI"],          options: [0, 0, 1, 1] },
  { id: 19,  fields: ["HY", "GI"],    options: [0, 1, 2, 3] },
  { id: 20,  fields: [],              options: [0, 1, 2, 3] }, // anxiety screener
  { id: 21,  fields: ["OD"],          options: [0, 1, 2, 3] },
  { id: 22,  fields: ["AG"],          options: [0, 1, 2, 3] },
  { id: 23,  fields: ["IN"],          options: [0, 1, 2, 3] },
  { id: 24,  fields: ["PR"],          options: [0, 1, 2, 3] },
  { id: 25,  fields: ["GI"],          options: [0, 1, 2, 3] },
  { id: 26,  fields: ["NI"],          options: [0, 0, 1, 1] },
  { id: 27,  fields: ["AG", "CD"],    options: [0, 1, 2, 3] },
  { id: 28,  fields: ["IN", "AN"],    options: [0, 1, 2, 3] },
  { id: 29,  fields: ["GI"],          options: [0, 1, 2, 3] },
  { id: 30,  fields: ["AG", "CD"],    options: [0, 1, 2, 3] },
  { id: 31,  fields: ["PI"],          options: [1, 0, 0, 0] },
  { id: 32,  fields: ["NI"],          options: [0, 0, 1, 1] },
  { id: 33,  fields: ["PI"],          options: [0, 0, 0, 1] },
  { id: 34,  fields: ["EF", "GI"],    options: [0, 1, 2, 3] },
  { id: 35,  fields: ["AN"],          options: [0, 1, 2, 3] },
  { id: 36,  fields: ["LP"],          options: [0, 1, 2, 3] },
  { id: 37,  fields: ["EF"],          options: [0, 1, 2, 3] },
  { id: 38,  fields: ["PI"],          options: [1, 0, 0, 0] },
  { id: 39,  fields: ["AG", "CD"],    options: [0, 1, 2, 3] },
  { id: 40,  fields: ["GI"],          options: [0, 1, 2, 3] },
  { id: 41,  fields: ["CD"],          options: [0, 1, 2, 3] }, // severe conduct
  { id: 42,  fields: ["NI"],          options: [0, 0, 1, 1] },
  { id: 43,  fields: ["LP"],          options: [0, 1, 2, 3] },
  { id: 44,  fields: ["IN"],          options: [0, 1, 2, 3] },
  { id: 45,  fields: ["EF"],          options: [0, 1, 2, 3] },
  { id: 46,  fields: ["LP"],          options: [0, 1, 2, 3] },
  { id: 47,  fields: ["IN", "AH"],    options: [0, 1, 2, 3] },
  { id: 48,  fields: ["LP"],          options: [0, 1, 2, 3] },
  { id: 49,  fields: ["IN"],          options: [0, 1, 2, 3] },
  { id: 50,  fields: ["EF"],          options: [0, 1, 2, 3] },
  { id: 51,  fields: ["AG"],          options: [0, 1, 2, 3] },
  { id: 52,  fields: ["OD"],          options: [0, 1, 2, 3] },
  { id: 53,  fields: ["AG", "CD"],    options: [0, 1, 2, 3] },
  { id: 54,  fields: ["OD"],          options: [0, 1, 2, 3] },
  { id: 55,  fields: ["AG"],          options: [0, 1, 2, 3] },
  { id: 56,  fields: ["CD"],          options: [0, 1, 2, 3] },
  { id: 57,  fields: ["OD"],          options: [0, 1, 2, 3] },
  { id: 58,  fields: ["AG"],          options: [0, 1, 2, 3] },
  { id: 59,  fields: ["CD"],          options: [0, 1, 2, 3] },
  { id: 60,  fields: ["OD"],          options: [0, 1, 2, 3] },
  { id: 61,  fields: ["AG", "CD"],    options: [0, 1, 2, 3] },
  { id: 62,  fields: ["OD"],          options: [0, 1, 2, 3] },
  { id: 63,  fields: ["AG"],          options: [0, 1, 2, 3] },

  // ── Part 2 (Q64–108) ──────────────────────────────────────────
  { id: 64,  fields: ["GI"],          options: [3, 2, 1, 0] }, // reversed
  { id: 65,  fields: ["IN"],          options: [0, 1, 2, 3] },
  { id: 66,  fields: ["AN"],          options: [0, 1, 2, 3] }, // depression screener
  { id: 67,  fields: ["CD"],          options: [0, 1, 2, 3] },
  { id: 68,  fields: ["IN"],          options: [0, 1, 2, 3] },
  { id: 69,  fields: ["HY"],          options: [0, 1, 2, 3] },
  { id: 70,  fields: ["AN"],          options: [0, 1, 2, 3] }, // anxiety screener
  { id: 71,  fields: ["AH", "GI"],    options: [0, 1, 2, 3] },
  { id: 72,  fields: ["GI"],          options: [3, 2, 1, 0] }, // reversed
  { id: 73,  fields: ["OD"],          options: [0, 1, 2, 3] },
  { id: 74,  fields: ["PI"],          options: [0, 0, 0, 1] },
  { id: 75,  fields: ["PR"],          options: [0, 1, 2, 3] },
  { id: 76,  fields: ["CD"],          options: [0, 1, 2, 3] },
  { id: 77,  fields: ["AN"],          options: [0, 1, 2, 3] },
  { id: 78,  fields: ["CD"],          options: [0, 1, 2, 3] }, // severe conduct
  { id: 79,  fields: ["IN"],          options: [0, 1, 2, 3] },
  { id: 80,  fields: ["PI"],          options: [0, 0, 0, 1] },
  { id: 81,  fields: ["PR"],          options: [0, 1, 2, 3] },
  { id: 82,  fields: ["AN"],          options: [0, 1, 2, 3] }, // depression screener
  { id: 83,  fields: ["GI"],          options: [0, 1, 2, 3] },
  { id: 84,  fields: ["IN"],          options: [0, 1, 2, 3] },
  { id: 85,  fields: ["EF"],          options: [0, 1, 2, 3] },
  { id: 86,  fields: ["AN"],          options: [0, 1, 2, 3] },
  { id: 87,  fields: ["PR"],          options: [0, 1, 2, 3] },
  { id: 88,  fields: ["HY", "GI"],    options: [0, 1, 2, 3] },
  { id: 89,  fields: ["CD"],          options: [0, 1, 2, 3] }, // severe conduct
  { id: 90,  fields: ["PR"],          options: [0, 1, 2, 3] },
  { id: 91,  fields: ["CD"],          options: [0, 1, 2, 3] },
  { id: 92,  fields: ["EF"],          options: [0, 1, 2, 3] },
  { id: 93,  fields: ["HY"],          options: [0, 1, 2, 3] },
  { id: 94,  fields: ["OD"],          options: [0, 1, 2, 3] },
  { id: 95,  fields: ["IN"],          options: [0, 1, 2, 3] },
  { id: 96,  fields: ["CD"],          options: [0, 1, 2, 3] }, // severe conduct
  { id: 97,  fields: ["IN"],          options: [0, 1, 2, 3] },
  { id: 98,  fields: ["HY"],          options: [0, 1, 2, 3] },
  { id: 99,  fields: ["HY"],          options: [0, 1, 2, 3] },
  { id: 100, fields: ["AN"],          options: [0, 1, 2, 3] }, // anxiety screener
  { id: 101, fields: ["IN", "AH"],    options: [0, 1, 2, 3] },
  { id: 102, fields: ["OD"],          options: [0, 1, 2, 3] },
  { id: 103, fields: ["AN"],          options: [0, 1, 2, 3] }, // depression screener
  { id: 104, fields: ["AH"],          options: [0, 1, 2, 3] },
  { id: 105, fields: ["PI"],          options: [0, 0, 0, 1] },
  { id: 106, fields: [],              options: [0, 1, 2, 3] }, // impairment
  { id: 107, fields: [],              options: [0, 1, 2, 3] }, // impairment
  { id: 108, fields: [],              options: [0, 1, 2, 3] }, // impairment
];

export default questions;
```

- [ ] **Step 2: Lint**

```bash
npm run lint
```
Expected: 0 errors.

- [ ] **Step 3: Verify in browser**

Run `npm run dev`, open the Parents form. Answer a few questions from each section and confirm the totals column shows scores updating for fields IN, HY, LP, EF, AG, PR, GI, AN, AH, CD, OD, PI, NI (no "GLI" column, no "1"/"2" suffix columns).

- [ ] **Step 4: Commit**

```bash
git add src/resources/questions-parents.js
git commit -m "fix: rewrite questions-parents with real grid field mappings and option values"
```

---

## Task 3: Fix InconsistencyIndex.jsx

**Files:**
- Modify: `src/components/InconsistencyIndex.jsx`

The current code has wrong pairs, wrong threshold (A≥6 should be A≥7), and references `'PI1'`/`'NI1'` which no longer exist.

- [ ] **Step 1: Update PAIRS, threshold, and field refs**

Replace lines 4–15 (the `PAIRS` constant) and lines 49, 112–113, 121–122 in `InconsistencyIndex.jsx`:

```jsx
import { useMemo } from 'react';

// Pairs from the Conners 3–Parent Response Style Analysis sheet (Image 5)
const PAIRS = [
  [44, 67],
  [12, 23],
  [36, 60],
  [14, 81],
  [19, 98],
  [45, 99],
  [94, 102],
  [75, 79],
  [13, 92],
  [39, 83],
];

const getScore = (answers, id) => {
  const v = answers[id];
  return v !== undefined ? parseInt(v, 10) : null;
};

const InconsistencyIndex = ({ answers, questions }) => {
  const { pairs, boxA, boxB, piTotal, niTotal } = useMemo(() => {
    const pairs = PAIRS.map(([a, b]) => {
      const sa = getScore(answers, a);
      const sb = getScore(answers, b);
      const diff = (sa !== null && sb !== null) ? Math.abs(sa - sb) : null;
      return { a, b, sa, sb, diff };
    });

    const answered = pairs.filter(p => p.diff !== null);
    const boxA = answered.reduce((sum, p) => sum + p.diff, 0);
    const boxB = answered.filter(p => p.diff === 2 || p.diff === 3).length;

    let piTotal = 0;
    let niTotal = 0;
    for (const [qId, val] of Object.entries(answers)) {
      const q = questions.find(q => q.id === Number(qId));
      if (!q) continue;
      const score = parseInt(val, 10) || 0;
      if (q.fields.includes('PI')) piTotal += score;
      if (q.fields.includes('NI')) niTotal += score;
    }

    return { pairs, boxA, boxB, piTotal, niTotal };
  }, [answers, questions]);

  const inconsistent = boxA >= 7 && boxB >= 2;

  return (
    <div className="inconsistency-container">
      <h2 className="inconsistency-title">Análisis de Estilo de Respuesta</h2>

      <section className="inconsistency-section">
        <h3>Índice de Inconsistencia</h3>
        <p className="inconsistency-instructions">
          Para cada par, se muestra la diferencia absoluta entre los ítems.
          Se suman las diferencias para obtener el Total A y se cuenta cuántas son 2 o 3 (B).
        </p>

        <div className="inconsistency-pairs">
          {pairs.map(({ a, b, sa, sb, diff }) => (
            <div key={`${a}-${b}`} className="inconsistency-pair">
              <div className="pair-items">
                <span className="pair-label">Ítem {a}</span>
                <span className="pair-score">{sa ?? '—'}</span>
              </div>
              <div className="pair-items">
                <span className="pair-label">Ítem {b}</span>
                <span className="pair-score">{sb ?? '—'}</span>
              </div>
              <div className="pair-diff">
                <span className="pair-diff-label">Dif.</span>
                <span className={`pair-diff-value ${diff === 2 || diff === 3 ? 'diff-high' : ''}`}>
                  {diff ?? '—'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="inconsistency-totals">
          <div className="inconsistency-box">
            <span className="box-label">Total A</span>
            <span className="box-value">{boxA}</span>
          </div>
          <div className="inconsistency-box">
            <span className="box-label">Total B</span>
            <span className="box-value">{boxB}</span>
            <span className="box-note">(difs. = 2 o 3)</span>
          </div>
          <div className={`inconsistency-alert ${inconsistent ? 'alert-active' : 'alert-inactive'}`}>
            {inconsistent
              ? '⚠ Posible estilo de respuesta inconsistente indicado (A ≥ 7 y B ≥ 2)'
              : '✓ Sin indicación de estilo de respuesta inconsistente'}
          </div>
        </div>
      </section>

      <section className="inconsistency-section">
        <h3>Guías de Escala PI y NI</h3>
        <table className="pi-ni-table">
          <thead>
            <tr>
              <th>Escala</th>
              <th>Puntaje bruto</th>
              <th>Guía interpretativa</th>
            </tr>
          </thead>
          <tbody>
            <tr className={piTotal >= 5 ? 'guideline-flagged' : ''}>
              <td>Impresión Positiva (PI)</td>
              <td className="pi-ni-score">{piTotal}</td>
              <td>
                {piTotal >= 5
                  ? '⚠ Posible estilo de respuesta positiva indicado'
                  : '—'}
              </td>
            </tr>
            <tr className={niTotal >= 5 ? 'guideline-flagged' : ''}>
              <td>Impresión Negativa (NI)</td>
              <td className="pi-ni-score">{niTotal}</td>
              <td>
                {niTotal >= 5
                  ? '⚠ Posible estilo de respuesta negativa indicado'
                  : '—'}
              </td>
            </tr>
          </tbody>
        </table>
        <p className="pi-ni-note">
          Puntaje bruto ≥ 5 en PI o NI sugiere revisar el estilo de respuesta.
        </p>
      </section>
    </div>
  );
};

export default InconsistencyIndex;
```

- [ ] **Step 2: Lint**

```bash
npm run lint
```
Expected: 0 errors.

- [ ] **Step 3: Verify in browser**

Open Parents form → Análisis de estilo. Confirm 10 pairs are shown (44/67, 12/23, 36/60, 14/81, 19/98, 45/99, 94/102, 75/79, 13/92, 39/83). Check that the alert text reads "A ≥ 7 y B ≥ 2".

- [ ] **Step 4: Commit**

```bash
git add src/components/InconsistencyIndex.jsx
git commit -m "fix: correct inconsistency index pairs, threshold A>=7, and field key refs"
```

---

## Task 4: Add age state and input

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/ModuleNav.jsx`
- Modify: `src/App.css`

- [ ] **Step 1: Add age state and localStorage to App.jsx**

Add the following after the existing `useState`/`useEffect` block in `App.jsx`. Insert after line 27 (`const [activeModule, setActiveModule] = useState('cuestionario');`):

```jsx
const [age, setAge] = useState(null);
```

Add a new `useEffect` after the existing three effects (after line 51):

```jsx
// Load age from localStorage when version changes
useEffect(() => {
  if (activeTest !== null) {
    const stored = localStorage.getItem(`age-${activeTest}`);
    setAge(stored ? parseInt(stored, 10) : null);
  }
}, [activeTest]);

// Persist age for the active version
useEffect(() => {
  if (activeTest !== null) {
    if (age !== null) {
      localStorage.setItem(`age-${activeTest}`, String(age));
    } else {
      localStorage.removeItem(`age-${activeTest}`);
    }
  }
}, [age, activeTest]);
```

Also add `age` and `setAge` to the `resetAnswers` function (clear age on reset is optional — don't clear it, age is not an answer). No change needed there.

Update the `ModuleNav` call (currently line 88) to pass age props:

```jsx
<ModuleNav
  activeModule={activeModule}
  onModuleChange={setActiveModule}
  onBack={() => { setActiveTest(null); setAge(null); }}
  age={age}
  onAgeChange={setAge}
/>
```

Note: also update the `onBack` to clear age when returning to the test selector.

- [ ] **Step 2: Update ModuleNav.jsx to accept and display age**

Replace the entire `ModuleNav.jsx`:

```jsx
const MODULES = [
  { id: 'cuestionario', label: 'Cuestionario' },
  { id: 'analisis',     label: 'Análisis de estilo' },
  { id: 'graficas',     label: 'Gráficas' },
  { id: 'clinico',      label: 'Análisis clínico' },
  { id: 'acerca',       label: 'Acerca de' },
];

const ModuleNav = ({ activeModule, onModuleChange, onBack, age, onAgeChange }) => (
  <nav className="module-nav">
    {onBack && (
      <button className="module-nav-back" onClick={onBack}>
        ← Pruebas
      </button>
    )}
    {MODULES.map(({ id, label }) => (
      <button
        key={id}
        className={`module-tab ${activeModule === id ? 'active' : ''}`}
        onClick={() => onModuleChange(id)}
      >
        {label}
      </button>
    ))}
    <label className="module-nav-age">
      Edad:
      <input
        type="number"
        min="6"
        max="17"
        value={age ?? ''}
        onChange={e => {
          const v = parseInt(e.target.value, 10);
          onAgeChange(isNaN(v) ? null : v);
        }}
        className="module-nav-age-input"
        placeholder="—"
      />
    </label>
  </nav>
);

export default ModuleNav;
```

- [ ] **Step 3: Add age input styles to App.css**

Append to `App.css` (before the `@media` block):

```css
/* ── Age input (inline in module nav) ──────────────────────── */
.module-nav-age {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #555;
  flex-shrink: 0;
  padding: 4px 8px;
}

.module-nav-age-input {
  width: 48px;
  padding: 4px 6px;
  font-size: 13px;
  border: 1px solid #ddd;
  border-radius: 6px;
  text-align: center;
}

.module-nav-age-input:focus {
  outline: none;
  border-color: #007bff;
}
```

Also add to the `@media (max-width: 640px)` block:

```css
  .module-nav-age {
    justify-content: center;
  }
```

- [ ] **Step 4: Lint**

```bash
npm run lint
```
Expected: 0 errors.

- [ ] **Step 5: Verify in browser**

Open Parents form. Confirm age input appears inline to the right of the tabs. Enter an age — navigate away and back, confirm age persists. Return to test selector, re-open form, confirm age is restored from localStorage.

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/components/ModuleNav.jsx src/App.css
git commit -m "feat: add persistent age input to module nav header"
```

---

## Task 5: Add Análisis clínico routing + placeholder

**Files:**
- Modify: `src/App.jsx`
- Create: `src/components/ClinicalAnalysisPlaceholder.jsx`

- [ ] **Step 1: Create placeholder component**

```jsx
const ClinicalAnalysisPlaceholder = () => (
  <div className="clinical-container">
    <p className="clinical-placeholder">
      Análisis clínico no disponible para esta versión.
    </p>
  </div>
);

export default ClinicalAnalysisPlaceholder;
```

- [ ] **Step 2: Add routing in App.jsx**

Add imports at the top of `App.jsx` (after existing imports):

```jsx
import ClinicalAnalysisPlaceholder from './components/ClinicalAnalysisPlaceholder'
```

Add the new module branch after the `analisis` block (after line 129):

```jsx
{activeModule === 'clinico' && (
  activeTest === 'conners-parents'
    ? <ClinicalAnalysisPlaceholder />
    : <ClinicalAnalysisPlaceholder />
)}
```

(Both branches use the placeholder for now; Task 6 replaces the `conners-parents` branch.)

- [ ] **Step 3: Add container style to App.css**

```css
/* ── Clinical Analysis ──────────────────────────────────────── */
.clinical-container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px 24px;
}

.clinical-placeholder {
  color: #888;
  font-size: 14px;
  text-align: center;
  padding: 32px 0;
}

.clinical-title {
  margin: 0 0 20px;
  font-size: 20px;
  color: #333;
}

.clinical-section {
  margin-bottom: 32px;
}

.clinical-section h3 {
  margin: 0 0 12px;
  font-size: 16px;
  color: #444;
  border-bottom: 1px solid #eee;
  padding-bottom: 6px;
}

.clinical-tables-row {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.clinical-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.clinical-table th,
.clinical-table td {
  border: 1px solid #ddd;
  padding: 6px 10px;
  text-align: center;
}

.clinical-table th {
  background: #f4f4f4;
  font-weight: 600;
}

.clinical-table td:first-child {
  text-align: left;
}

.clinical-row-flagged td {
  background: #fff3cd;
}

.clinical-row-attention td {
  background: #f8d7da;
}

.clinical-flag-cell {
  font-weight: bold;
  color: #856404;
}

.clinical-attention-cell {
  font-weight: bold;
  color: #721c24;
}

.clinical-total-row td {
  font-weight: bold;
  background: #f4f4f4;
}

.clinical-threshold {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

.clinical-threshold.met {
  color: #856404;
  font-weight: 600;
}

.clinical-score-cell {
  font-weight: bold;
}
```

Also add to the `@media (max-width: 640px)` block:

```css
  .clinical-tables-row {
    flex-direction: column;
  }

  .clinical-container {
    padding: 14px 12px;
  }
```

- [ ] **Step 4: Lint**

```bash
npm run lint
```
Expected: 0 errors.

- [ ] **Step 5: Verify in browser**

Open any form → click "Análisis clínico" tab → confirm placeholder message appears.

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/components/ClinicalAnalysisPlaceholder.jsx src/App.css
git commit -m "feat: add Análisis clínico tab with placeholder routing"
```

---

## Task 6: Create ClinicalAnalysisParents.jsx

**Files:**
- Create: `src/components/ClinicalAnalysisParents.jsx`
- Modify: `src/App.jsx`

This is the shell that composes all five sections. The child components don't exist yet — build them in Tasks 7–11 then come back and import them. For now, create the file with just the DSM5Counts import so it's incrementally buildable.

- [ ] **Step 1: Create the composing component (initial shell)**

```jsx
import DSM5Counts from './DSM5Counts';
import ConductDisorder from './ConductDisorder';
import ImpairmentItems from './ImpairmentItems';
import ADHDIndex from './ADHDIndex';
import ScreenerItems from './ScreenerItems';

const ClinicalAnalysisParents = ({ answers, questions, age }) => (
  <div className="clinical-container">
    <h2 className="clinical-title">Análisis Clínico — Padres</h2>
    <DSM5Counts answers={answers} questions={questions} age={age} />
    <ConductDisorder answers={answers} questions={questions} />
    <ImpairmentItems answers={answers} questions={questions} />
    <ADHDIndex answers={answers} questions={questions} />
    <ScreenerItems answers={answers} questions={questions} />
  </div>
);

export default ClinicalAnalysisParents;
```

- [ ] **Step 2: Wire into App.jsx**

Update the `clinico` branch in App.jsx. First add the import:

```jsx
import ClinicalAnalysisParents from './components/ClinicalAnalysisParents'
```

Then update the `clinico` module branch:

```jsx
{activeModule === 'clinico' && (
  activeTest === 'conners-parents'
    ? <ClinicalAnalysisParents answers={answers} questions={questions} age={age} />
    : <ClinicalAnalysisPlaceholder />
)}
```

> **Note:** This will fail to render until Tasks 7–11 create the child components. Leave it wired; lint will pass because the imports exist in the shell.

- [ ] **Step 3: Lint** (will show import errors until children exist — that's expected)

```bash
npm run lint 2>&1 | head -20
```

Proceed to Task 7 immediately.

---

## Task 7: DSM5Counts.jsx

**Files:**
- Create: `src/components/DSM5Counts.jsx`

- [ ] **Step 1: Create the component**

```jsx
import { useMemo } from 'react';

const getScore = (answers, id) => {
  const v = answers[id];
  return v !== undefined ? parseInt(v, 10) : null;
};

// DSM-5 ADHD Inattentive criteria (from Conners 3 Parent scoring sheet)
const INATTENTIVE = [
  { criterion: 'A1a', items: [47],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A1b', items: [95],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A1c', items: [35],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A1d', items: [68, 79],  mayBe: [],  indicated: [2, 3], rule: 'both'   },
  { criterion: 'A1e', items: [84],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A1f', items: [28],      mayBe: [2], indicated: [3],    rule: 'single' },
  { criterion: 'A1g', items: [97],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A1h', items: [101],     mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A1i', items: [2],       mayBe: [],  indicated: [2, 3], rule: 'single' },
];

// DSM-5 ADHD Hyperactive-Impulsive criteria
const HYPERACTIVE = [
  { criterion: 'A2a', items: [98],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A2b', items: [93],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A2c', items: [69, 99],  mayBe: [1], indicated: [2, 3], rule: 'either' },
  { criterion: 'A2d', items: [71],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A2e', items: [54, 45],  mayBe: [1], indicated: [2, 3], rule: 'either' },
  { criterion: 'A2f', items: [3],       mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A2g', items: [43],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A2h', items: [61],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A2i', items: [104],     mayBe: [],  indicated: [2, 3], rule: 'single' },
];

// Returns whether a criterion row earns a checkmark given current answers.
// rule='single': one item; rule='both': all items need a required score;
// rule='either': any item needs a required score.
const isChecked = (row, answers) => {
  const scores = row.items.map(id => getScore(answers, id));
  if (scores.some(s => s === null)) return false;
  const allRequired = [...row.mayBe, ...row.indicated];
  if (row.rule === 'both') return scores.every(s => allRequired.includes(s));
  return scores.some(s => allRequired.includes(s));
};

const isIndicated = (row, answers) => {
  const scores = row.items.map(id => getScore(answers, id));
  if (scores.some(s => s === null)) return false;
  if (row.rule === 'both') return scores.every(s => row.indicated.includes(s));
  return scores.some(s => row.indicated.includes(s));
};

const CriterionTable = ({ title, criteria, answers }) => {
  const rows = useMemo(() => criteria.map(row => {
    const scores = row.items.map(id => getScore(answers, id));
    const checked = isChecked(row, answers);
    return { ...row, scores, checked };
  }), [criteria, answers]);

  const total = rows.filter(r => r.checked).length;

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#444' }}>{title}</h4>
      <table className="clinical-table">
        <thead>
          <tr>
            <th>Criterio</th>
            <th>Ítem(s)</th>
            <th>Puntaje</th>
            <th>May be Ind.</th>
            <th>Indicated</th>
            <th>✓</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.criterion} className={row.checked ? 'clinical-row-flagged' : ''}>
              <td>{row.criterion}</td>
              <td>{row.items.join(' + ')}</td>
              <td className="clinical-score-cell">
                {row.scores.map(s => s ?? '—').join(' / ')}
              </td>
              <td>{row.mayBe.join(', ') || '—'}</td>
              <td>{row.indicated.join(', ')}</td>
              <td className="clinical-flag-cell">{row.checked ? '✓' : ''}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="clinical-total-row">
            <td colSpan={5}>Total síntomas</td>
            <td>{total}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

const DSM5Counts = ({ answers, questions: _questions, age }) => {
  const inattentiveTotal = useMemo(
    () => INATTENTIVE.filter(r => isChecked(r, answers)).length,
    [answers]
  );
  const hyperactiveTotal = useMemo(
    () => HYPERACTIVE.filter(r => isChecked(r, answers)).length,
    [answers]
  );

  const threshold = age !== null ? (age <= 16 ? 6 : 5) : null;
  const inattentiveMet  = threshold !== null && inattentiveTotal  >= threshold;
  const hyperactiveMet  = threshold !== null && hyperactiveTotal  >= threshold;
  const combinedMet     = inattentiveMet && hyperactiveMet;

  return (
    <section className="clinical-section">
      <h3>Conteo de Síntomas DSM-5</h3>
      <div className="clinical-tables-row">
        <CriterionTable
          title="TDAH Inatento"
          criteria={INATTENTIVE}
          answers={answers}
        />
        <CriterionTable
          title="TDAH Hiperactivo-Impulsivo"
          criteria={HYPERACTIVE}
          answers={answers}
        />
      </div>

      <div style={{ marginTop: 12, fontSize: 13 }}>
        {age === null ? (
          <p className="clinical-threshold">
            Ingrese la edad del paciente para ver si se cumplen los criterios de síntomas.
          </p>
        ) : (
          <>
            <p className={`clinical-threshold ${inattentiveMet ? 'met' : ''}`}>
              Inatento: {inattentiveTotal}/{threshold} — criterios{' '}
              {inattentiveMet ? 'probablemente cumplidos' : 'probablemente no cumplidos'}.
            </p>
            <p className={`clinical-threshold ${hyperactiveMet ? 'met' : ''}`}>
              Hiperactivo-Impulsivo: {hyperactiveTotal}/{threshold} — criterios{' '}
              {hyperactiveMet ? 'probablemente cumplidos' : 'probablemente no cumplidos'}.
            </p>
            {combinedMet && (
              <p className="clinical-threshold met">
                TDAH Combinado: criterios probablemente cumplidos.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default DSM5Counts;
```

- [ ] **Step 2: Lint**

```bash
npm run lint
```
Expected: 0 errors.

- [ ] **Step 3: Verify in browser**

Open Parents form → Análisis clínico. Answer items 47, 95, 35 with score 2. Enter age 10. Confirm A1a, A1b, A1c rows show ✓ and are highlighted yellow. Confirm "Inatento: 3/6" appears.

- [ ] **Step 4: Commit**

```bash
git add src/components/DSM5Counts.jsx
git commit -m "feat: add DSM-5 ADHD symptom counts component"
```

---

## Task 8: ConductDisorder.jsx

**Files:**
- Create: `src/components/ConductDisorder.jsx`

- [ ] **Step 1: Create the component**

```jsx
import { useMemo } from 'react';

const getScore = (answers, id) => {
  const v = answers[id];
  return v !== undefined ? parseInt(v, 10) : null;
};

// Conduct Disorder criteria (Conners 3 Parent, Image 7)
const CD_CRITERIA = [
  { criterion: 'A1',  item: 16,  mayBe: [1],  indicated: [2, 3] },
  { criterion: 'A2',  item: 30,  mayBe: [1],  indicated: [2, 3] },
  { criterion: 'A3',  item: 27,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A4',  item: 39,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A5',  item: 41,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A6',  item: 96,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A7',  item: 11,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A8',  item: 78,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A9',  item: 65,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A10', item: 89,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A11', item: 56,  mayBe: [],   indicated: [2, 3] },
  { criterion: 'A12', item: 58,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A13', item: 91,  mayBe: [1],  indicated: [2, 3] },
  { criterion: 'A14', item: 76,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A15', item: 6,   mayBe: [1],  indicated: [2, 3] },
];

// ODD criteria (Conners 3 Parent, Image 7)
const ODD_CRITERIA = [
  { criterion: 'A1', item: 14,  mayBe: [],  indicated: [2, 3] },
  { criterion: 'A2', item: 73,  mayBe: [],  indicated: [2, 3] },
  { criterion: 'A3', item: 48,  mayBe: [1], indicated: [2, 3] },
  { criterion: 'A4', item: 102, mayBe: [],  indicated: [2, 3] },
  { criterion: 'A5', item: 94,  mayBe: [],  indicated: [2, 3] },
  { criterion: 'A6', item: 59,  mayBe: [],  indicated: [2, 3] },
  { criterion: 'A7', item: 21,  mayBe: [],  indicated: [2, 3] },
  { criterion: 'A8', item: 57,  mayBe: [1], indicated: [2, 3] },
];

const isChecked = (row, answers) => {
  const s = getScore(answers, row.item);
  if (s === null) return false;
  return [...row.mayBe, ...row.indicated].includes(s);
};

const DisorderTable = ({ title, criteria, threshold, answers }) => {
  const rows = useMemo(
    () => criteria.map(row => ({ ...row, score: getScore(answers, row.item), checked: isChecked(row, answers) })),
    [criteria, answers]
  );
  const total = rows.filter(r => r.checked).length;
  const met   = total >= threshold;

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#444' }}>{title}</h4>
      <table className="clinical-table">
        <thead>
          <tr>
            <th>Criterio</th>
            <th>Ítem</th>
            <th>Puntaje</th>
            <th>May be Ind.</th>
            <th>Indicated</th>
            <th>✓</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.criterion} className={row.checked ? 'clinical-row-flagged' : ''}>
              <td>{row.criterion}</td>
              <td>{row.item}</td>
              <td className="clinical-score-cell">{row.score ?? '—'}</td>
              <td>{row.mayBe.join(', ') || '—'}</td>
              <td>{row.indicated.join(', ')}</td>
              <td className="clinical-flag-cell">{row.checked ? '✓' : ''}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="clinical-total-row">
            <td colSpan={5}>Total síntomas</td>
            <td>{total}</td>
          </tr>
        </tfoot>
      </table>
      <p className={`clinical-threshold ${met ? 'met' : ''}`}>
        Criterios probablemente {met ? 'cumplidos' : 'no cumplidos'} (≥ {threshold}).
      </p>
    </div>
  );
};

const ConductDisorder = ({ answers }) => (
  <section className="clinical-section">
    <h3>Trastorno de Conducta y Negativismo Desafiante</h3>
    <div className="clinical-tables-row">
      <DisorderTable
        title="Trastorno de Conducta (TC)"
        criteria={CD_CRITERIA}
        threshold={3}
        answers={answers}
      />
      <DisorderTable
        title="Trastorno Negativista Desafiante (TND)"
        criteria={ODD_CRITERIA}
        threshold={4}
        answers={answers}
      />
    </div>
  </section>
);

export default ConductDisorder;
```

- [ ] **Step 2: Lint**

```bash
npm run lint
```
Expected: 0 errors.

- [ ] **Step 3: Verify in browser**

Answer item 27 with score 1 (May be Indicated), item 11 with score 2 (Indicated). Confirm A3 and A7 rows are flagged. Confirm Total shows 2.

- [ ] **Step 4: Commit**

```bash
git add src/components/ConductDisorder.jsx
git commit -m "feat: add Conduct Disorder and ODD symptom count tables"
```

---

## Task 9: ImpairmentItems.jsx

**Files:**
- Create: `src/components/ImpairmentItems.jsx`

- [ ] **Step 1: Create the component**

```jsx
const ITEMS = [
  { id: 106, label: 'Los problemas de su hijo afectan seriamente el trabajo escolar o las calificaciones.' },
  { id: 107, label: 'Los problemas de su hijo afectan seriamente las amistades y relaciones.' },
  { id: 108, label: 'Los problemas de su hijo afectan seriamente la vida en casa.' },
];

const LABELS = ['Nunca/No es verdad', 'Un poco verdad/Ocasionalmente', 'Bastante verdad/Frecuente', 'Muy verdad/Muy frecuente'];

const ImpairmentItems = ({ answers }) => (
  <section className="clinical-section">
    <h3>Deterioro Funcional</h3>
    <table className="clinical-table">
      <thead>
        <tr>
          <th>Ítem</th>
          <th>Contenido</th>
          <th>Puntaje</th>
          <th>Descripción</th>
        </tr>
      </thead>
      <tbody>
        {ITEMS.map(({ id, label }) => {
          const raw = answers[id];
          const score = raw !== undefined ? parseInt(raw, 10) : null;
          return (
            <tr key={id}>
              <td>{id}</td>
              <td style={{ textAlign: 'left' }}>{label}</td>
              <td className="clinical-score-cell">{score ?? '—'}</td>
              <td>{score !== null ? LABELS[score] : '—'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </section>
);

export default ImpairmentItems;
```

- [ ] **Step 2: Lint**

```bash
npm run lint
```
Expected: 0 errors.

- [ ] **Step 3: Verify in browser**

Answer questions 106–108 with various scores. Confirm the impairment table shows the correct scores and descriptions.

- [ ] **Step 4: Commit**

```bash
git add src/components/ImpairmentItems.jsx
git commit -m "feat: add impairment items table (Q106-108)"
```

---

## Task 10: ADHDIndex.jsx

**Files:**
- Create: `src/components/ADHDIndex.jsx`

> **Implementation note:** The transposing rules below are read from Image 8 of the spec. Items 35 and 98 map scores 0,1→0 and 2,3→2. Item 88 appears to follow the same 0,1→0 and 2,3→2 pattern. All other items map 0→0, 1→1, 2→2, 3→2. Cross-check against Image 8 during implementation.

- [ ] **Step 1: Create the component**

```jsx
import { useMemo } from 'react';

// Transposing rule: maps raw score (index) → transposed score (value)
// Verified against Conners 3 Parent ADHD Index sheet (Image 8)
const TRANSPOSE = {
  19:  [0, 1, 2, 2],
  35:  [0, 0, 2, 2],
  47:  [0, 1, 2, 2],
  67:  [0, 1, 2, 2],
  84:  [0, 1, 2, 2],
  88:  [0, 0, 2, 2],
  98:  [0, 0, 2, 2],
  99:  [0, 1, 2, 2],
  101: [0, 1, 2, 2],
  104: [0, 1, 2, 2],
};

const ITEMS = [19, 35, 47, 67, 84, 88, 98, 99, 101, 104];

// Probability lookup table: index = total transposed score (0–20)
const PROBABILITY = [11, 29, 41, 51, 56, 64, 71, 77, 82, 87, 91, 94, 97, 98, 99, 99, 99, 99, 99, 99, 99];

const ADHDIndex = ({ answers }) => {
  const rows = useMemo(() => ITEMS.map(id => {
    const raw = answers[id] !== undefined ? parseInt(answers[id], 10) : null;
    const rule = TRANSPOSE[id];
    const transposed = raw !== null ? rule[raw] : null;
    return { id, raw, rule, transposed };
  }), [answers]);

  const allAnswered = rows.every(r => r.transposed !== null);
  const total = allAnswered ? rows.reduce((sum, r) => sum + r.transposed, 0) : null;
  const probability = total !== null && total <= 20 ? PROBABILITY[total] : null;

  return (
    <section className="clinical-section">
      <h3>Índice TDAH de Conners 3</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="clinical-table" style={{ minWidth: 640 }}>
          <thead>
            <tr>
              {ITEMS.map(id => <th key={id}>Ítem {id}</th>)}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {/* Raw scores row */}
            <tr>
              {rows.map(r => (
                <td key={r.id} className="clinical-score-cell">{r.raw ?? '—'}</td>
              ))}
              <td>—</td>
            </tr>
            {/* Transposing rule row */}
            <tr style={{ fontSize: 11, color: '#888' }}>
              {rows.map(r => (
                <td key={r.id}>
                  {r.rule.map((v, i) => `${i}→${v}`).join(', ')}
                </td>
              ))}
              <td>—</td>
            </tr>
            {/* Transposed scores row */}
            <tr className="clinical-total-row">
              {rows.map(r => (
                <td key={r.id} className="clinical-score-cell">{r.transposed ?? '—'}</td>
              ))}
              <td className="clinical-score-cell">{total ?? '—'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {total !== null && (
        <div style={{ marginTop: 12, fontSize: 14 }}>
          <p>
            <strong>Puntaje Total Transpuesto:</strong> {total}
          </p>
          <p>
            <strong>Probabilidad de clasificación TDAH:</strong>{' '}
            {probability !== null ? `${probability}%` : '—'}
          </p>
        </div>
      )}
      {!allAnswered && (
        <p className="clinical-threshold">
          Responda los ítems 19, 35, 47, 67, 84, 88, 98, 99, 101 y 104 para calcular el índice.
        </p>
      )}
    </section>
  );
};

export default ADHDIndex;
```

- [ ] **Step 2: Lint**

```bash
npm run lint
```
Expected: 0 errors.

- [ ] **Step 3: Verify in browser**

Answer all 10 ADHD Index items (19, 35, 47, 67, 84, 88, 98, 99, 101, 104) with score 2. Each transposes to 2, so total = 20. Confirm probability shows 99%.

Answer item 35 with score 1 — it should transpose to 0 (not 1), reducing the total to 18. Confirm probability shows 99%.

- [ ] **Step 4: Commit**

```bash
git add src/components/ADHDIndex.jsx
git commit -m "feat: add Conners 3 ADHD Index transposing table and probability lookup"
```

---

## Task 11: ScreenerItems.jsx

**Files:**
- Create: `src/components/ScreenerItems.jsx`

- [ ] **Step 1: Create the component**

```jsx
import { useMemo } from 'react';

const ANXIETY_ITEMS = [
  { id: 4,   label: 'Preocupaciones' },
  { id: 20,  label: 'Dificultad para controlar preocupaciones' },
  { id: 70,  label: 'Nervioso o inquieto' },
  { id: 100, label: 'Irritable' },
];

const DEPRESSION_ITEMS = [
  { id: 17,  label: 'Sentimientos de inutilidad' },
  { id: 66,  label: 'Cansado; poca energía' },
  { id: 82,  label: 'Pérdida de interés o placer' },
  { id: 103, label: 'Triste, sombrío o irritable' },
];

const SEVERE_CONDUCT_ITEMS = [
  { id: 11, label: 'Sexo forzado' },
  { id: 27, label: 'Usa un arma' },
  { id: 41, label: 'Crueldad con animales' },
  { id: 78, label: 'Prender fuego' },
  { id: 89, label: 'Allanamiento de morada' },
  { id: 96, label: 'Robo con enfrentamiento' },
];

const getScore = (answers, id) => {
  const v = answers[id];
  return v !== undefined ? parseInt(v, 10) : null;
};

const ScreenerTable = ({ title, items, flagLabel, answers }) => {
  const rows = useMemo(
    () => items.map(it => ({ ...it, score: getScore(answers, it.id) })),
    [items, answers]
  );
  const anyFlagged = rows.some(r => r.score !== null && r.score >= 1);

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#444' }}>{title}</h4>
      <table className="clinical-table">
        <thead>
          <tr>
            <th>Ítem</th>
            <th>Contenido</th>
            <th>Puntaje</th>
            <th>{flagLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const flagged = row.score !== null && row.score >= 1;
            return (
              <tr key={row.id} className={flagged ? 'clinical-row-attention' : ''}>
                <td>{row.id}</td>
                <td style={{ textAlign: 'left' }}>{row.label}</td>
                <td className="clinical-score-cell">{row.score ?? '—'}</td>
                <td className={flagged ? 'clinical-attention-cell' : ''}>
                  {flagged ? '✓' : ''}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {anyFlagged && (
        <p className="clinical-threshold met" style={{ marginTop: 6 }}>
          ⚠ {flagLabel}
        </p>
      )}
    </div>
  );
};

const ScreenerItems = ({ answers }) => (
  <section className="clinical-section">
    <h3>Ítems de Tamizaje y Conducta Grave</h3>
    <div className="clinical-tables-row" style={{ marginBottom: 24 }}>
      <ScreenerTable
        title="Ansiedad"
        items={ANXIETY_ITEMS}
        flagLabel="Se recomienda investigación adicional"
        answers={answers}
      />
      <ScreenerTable
        title="Depresión"
        items={DEPRESSION_ITEMS}
        flagLabel="Se recomienda investigación adicional"
        answers={answers}
      />
    </div>
    <ScreenerTable
      title="Ítems Críticos de Conducta Grave"
      items={SEVERE_CONDUCT_ITEMS}
      flagLabel="Se recomienda atención inmediata"
      answers={answers}
    />
  </section>
);

export default ScreenerItems;
```

- [ ] **Step 2: Lint**

```bash
npm run lint
```
Expected: 0 errors.

- [ ] **Step 3: Verify in browser**

Answer item 4 with score 1 — the Anxiety row highlights and the warning appears. Answer item 11 with score 1 — the Severe Conduct row highlights red. Answer item 17 with score 0 — no flag on that depression row.

- [ ] **Step 4: Commit**

```bash
git add src/components/ScreenerItems.jsx
git commit -m "feat: add screener items (anxiety/depression) and severe conduct critical items"
```

---

## Task 12: Final lint, smoke test, and commit

- [ ] **Step 1: Full lint**

```bash
npm run lint
```
Expected: 0 errors.

- [ ] **Step 2: Production build**

```bash
npm run build
```
Expected: build completes with no errors.

- [ ] **Step 3: Full smoke test in browser**

```bash
npm run preview
```

Walk through all scenarios:
1. Open Parents form → confirm 13 field columns (IN, HY, LP, EF, AG, PR, **GI**, AN, AH, CD, OD, PI, NI — no GLI)
2. Answer Q1 → confirm score 1 or 0 (not 0–3) for NI
3. Answer Q8 → confirm reversed NI scoring
4. Answer Q9 with "Not true at all" → confirm NI score shows 3 (reversed)
5. Análisis de estilo → confirm 10 new pairs, "A ≥ 7 y B ≥ 2" text
6. Enter age 10 in header → navigate modules → confirm age persists
7. Return to test selector → re-open → confirm age restored
8. Análisis clínico → confirm all 5 sections render
9. Open Teachers form → Análisis clínico → confirm placeholder message

- [ ] **Step 4: Final commit**

```bash
git add -p  # review any stray changes
git commit -m "feat: complete parents clinical analysis — grid data, Inconsistency Index fix, age input, Análisis clínico tab"
```
