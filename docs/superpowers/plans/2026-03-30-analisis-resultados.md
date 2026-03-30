# Análisis de Resultados Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge the "Análisis de estilo" and "Análisis clínico" tabs into one collapsible "Análisis de Resultados" tab, reorder tabs, and fix the Edad input on mobile.

**Architecture:** A new `AnalisisResultados` component composes the existing analysis sub-components inside collapsible sections driven by per-section `useState`. `ModuleNav` is updated to a 4-tab layout. `App.jsx` routing replaces two module blocks with one. No existing analysis components are modified.

**Tech Stack:** React 18, JSX, plain CSS, Vite 5, ESLint 9

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Modify | `src/App.css` | Add collapsible + container styles |
| Create | `src/components/AnalisisResultados.jsx` | Collapsible wrapper for both analyses |
| Modify | `src/components/ModuleNav.jsx` | 4-tab MODULES array + age input fix |
| Modify | `src/App.jsx` | Remove old routing blocks, add `resultados` block |

---

## Task 1: Add collapsible styles to App.css

**Files:**
- Modify: `src/App.css`

- [ ] **Step 1: Append collapsible styles**

Open `src/App.css` and append the following block at the end (after the `@media` block):

```css
/* ── Análisis de Resultados ─────────────────────────────────── */
.analisis-resultados-container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px 24px;
}

.analisis-resultados-title {
  margin: 0 0 16px;
  font-size: 20px;
  color: #333;
}

.collapsible {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
}

.collapsible-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f9f9f9;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #444;
  text-align: left;
  margin-top: 0;
}

.collapsible-header:hover {
  background: #f0f0f0;
}

.collapsible-chevron {
  font-size: 11px;
  color: #aaa;
  flex-shrink: 0;
}

.collapsible-body {
  border-top: 1px solid #eee;
  padding: 16px;
}

/* Strip the standalone container border from InconsistencyIndex
   when it is rendered inside a collapsible body — avoids double border. */
.collapsible-body .inconsistency-container {
  max-width: 100%;
  margin: 0;
  border: none;
  border-radius: 0;
  padding: 0;
  background: transparent;
}

@media (max-width: 640px) {
  .analisis-resultados-container {
    padding: 14px 12px;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/App.css
git commit -m "style: add collapsible and Análisis de Resultados container styles"
```

---

## Task 2: Create AnalisisResultados component

**Files:**
- Create: `src/components/AnalisisResultados.jsx`

- [ ] **Step 1: Create the file**

Create `src/components/AnalisisResultados.jsx` with the following content:

```jsx
import { useState } from 'react';
import InconsistencyIndex from './InconsistencyIndex';
import DSM5Counts from './DSM5Counts';
import ConductDisorder from './ConductDisorder';
import ImpairmentItems from './ImpairmentItems';
import ADHDIndex from './ADHDIndex';
import ScreenerItems from './ScreenerItems';

const CollapsibleSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="collapsible">
      <button className="collapsible-header" onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        <span className="collapsible-chevron">{open ? '▼' : '▶'}</span>
      </button>
      {open && <div className="collapsible-body">{children}</div>}
    </div>
  );
};

const AnalisisResultados = ({ answers, questions, age, activeTest }) => (
  <div className="analisis-resultados-container">
    <h2 className="analisis-resultados-title">Análisis de Resultados</h2>

    <CollapsibleSection title="Análisis de Estilo de Respuesta">
      <InconsistencyIndex answers={answers} questions={questions} />
    </CollapsibleSection>

    {activeTest === 'conners-parents' ? (
      <>
        <CollapsibleSection title="DSM-5 Síntomas ADHD">
          <DSM5Counts answers={answers} questions={questions} age={age} />
        </CollapsibleSection>
        <CollapsibleSection title="Trastorno de Conducta / TOD">
          <ConductDisorder answers={answers} questions={questions} />
        </CollapsibleSection>
        <CollapsibleSection title="Ítems de Deterioro">
          <ImpairmentItems answers={answers} questions={questions} />
        </CollapsibleSection>
        <CollapsibleSection title="Índice ADHD">
          <ADHDIndex answers={answers} questions={questions} />
        </CollapsibleSection>
        <CollapsibleSection title="Ítems Screener">
          <ScreenerItems answers={answers} questions={questions} />
        </CollapsibleSection>
      </>
    ) : (
      <p className="clinical-placeholder">Análisis clínico no disponible para esta versión.</p>
    )}
  </div>
);

export default AnalisisResultados;
```

- [ ] **Step 2: Run lint to verify no errors**

```bash
npm run lint
```

Expected: no errors (warnings are acceptable).

- [ ] **Step 3: Commit**

```bash
git add src/components/AnalisisResultados.jsx
git commit -m "feat: add AnalisisResultados collapsible component"
```

---

## Task 3: Update ModuleNav — tabs and age input

**Files:**
- Modify: `src/components/ModuleNav.jsx`

- [ ] **Step 1: Replace MODULES array and fix age input**

Replace the entire content of `src/components/ModuleNav.jsx` with:

```jsx
const MODULES = [
  { id: 'cuestionario', label: 'Cuestionario' },
  { id: 'resultados',   label: 'Análisis de Resultados' },
  { id: 'graficas',     label: 'Gráficas' },
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
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
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

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ModuleNav.jsx
git commit -m "feat: update tab layout to 4 tabs and fix age input for mobile"
```

---

## Task 4: Update App.jsx routing

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace old imports with new one**

In `src/App.jsx`, find the import block at the top. Replace these three lines:

```jsx
import InconsistencyIndex from './components/InconsistencyIndex'
import ClinicalAnalysisParents from './components/ClinicalAnalysisParents'
import ClinicalAnalysisPlaceholder from './components/ClinicalAnalysisPlaceholder'
```

With:

```jsx
import AnalisisResultados from './components/AnalisisResultados'
```

- [ ] **Step 2: Replace routing blocks**

In the JSX return of `App`, find and remove these two render blocks:

```jsx
      {activeModule === 'analisis' && (
        <InconsistencyIndex answers={answers} questions={questions} />
      )}
```

```jsx
      {activeModule === 'clinico' && (
        activeTest === 'conners-parents'
          ? <ClinicalAnalysisParents answers={answers} questions={questions} age={age} />
          : <ClinicalAnalysisPlaceholder />
      )}
```

Replace them with a single block (place it where the `analisis` block was):

```jsx
      {activeModule === 'resultados' && (
        <AnalisisResultados
          answers={answers}
          questions={questions}
          age={age}
          activeTest={activeTest}
        />
      )}
```

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Start the dev server and verify manually**

```bash
npm run dev
```

Check the following in the browser at `http://localhost:5173/conners/`:

1. **Tab order**: Cuestionario → Análisis de Resultados → Gráficas → Acerca de (4 tabs only)
2. **Análisis de Resultados tab**: Shows 6 collapsed sections with `▶` chevron
3. **Expand each section**: Content loads correctly, chevron changes to `▼`
4. **Collapse again**: Hides content, chevron returns to `▶`
5. **Conners Padres**: All 6 sections (Estilo + 5 clinical) are present
6. **Conners Maestros**: Only "Análisis de Estilo de Respuesta" + placeholder text
7. **Edad input on mobile** (or browser DevTools mobile simulation): Tapping the field triggers a numeric keyboard

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx
git commit -m "feat: route resultados module to AnalisisResultados component"
```
