# Test Selector Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a landing screen where users select which neuropsychological test to take, with Conners 3 fully functional and generic placeholder cards for future tests.

**Architecture:** Add `activeTest` state (default `null`) to `App.jsx`. When `null`, render a new `TestSelector` component; when `'conners'`, render the existing assessment UI. A back button in `ModuleNav` resets `activeTest` to `null`.

**Tech Stack:** React 18, JSX, plain CSS, Vite 5. No new dependencies.

---

### Task 1: Add CSS classes for the test selector

**Files:**
- Modify: `src/App.css`

- [ ] **Step 1: Append the new CSS to `src/App.css`**

Add the following block at the end of the file, before the closing `@media` block (insert it just before the `/* ── Mobile layout ──` comment):

```css
/* ── Test Selector ──────────────────────────────────────────── */
.test-selector {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
  text-align: center;
}

.test-selector-title {
  font-size: 22px;
  color: #333;
  margin: 0 0 8px;
}

.test-selector-subtitle {
  font-size: 14px;
  color: #888;
  margin: 0 0 32px;
}

.test-selector-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.test-card {
  background: white;
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.test-card.available {
  border: 2px solid #007bff;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.12);
  transition: box-shadow 0.2s, transform 0.2s;
}

.test-card.available:hover {
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.22);
  transform: translateY(-2px);
}

.test-card.unavailable {
  border: 2px dashed #ccc;
  opacity: 0.6;
  cursor: default;
}

.test-card-icon {
  font-size: 36px;
  line-height: 1;
}

.test-card-label {
  font-weight: 700;
  font-size: 15px;
  color: #333;
}

.test-card.available .test-card-label {
  color: #007bff;
}

.test-card-description {
  font-size: 12px;
  color: #888;
  margin: 0;
}

.test-card-action {
  margin-top: 8px;
  padding: 6px 14px;
  font-size: 13px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.test-card.available .test-card-action {
  background: #007bff;
  color: white;
}

.test-card.available .test-card-action:hover {
  background: #0056b3;
}

.test-card.unavailable .test-card-action {
  background: #e0e0e0;
  color: #aaa;
  cursor: default;
}

.module-nav-back {
  margin-top: 0;
  padding: 8px 12px;
  font-size: 13px;
  background: transparent;
  color: #888;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  flex-shrink: 0;
}

.module-nav-back:hover {
  background: #f0f0f0;
  color: #333;
}
```

- [ ] **Step 2: Verify the dev server still compiles without errors**

Run: `npm run dev`
Expected: No errors in terminal, app loads at `http://localhost:5173/conners/`

- [ ] **Step 3: Commit**

```bash
git add src/App.css
git commit -m "feat: add CSS classes for test selector landing page"
```

---

### Task 2: Create the TestSelector component

**Files:**
- Create: `src/components/TestSelector.jsx`

- [ ] **Step 1: Create `src/components/TestSelector.jsx`**

```jsx
const TESTS = [
  {
    id: 'conners',
    icon: '🧠',
    label: 'Conners 3',
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
          onClick={available ? () => onSelect(id) : undefined}
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

- [ ] **Step 2: Verify the dev server compiles without errors**

Run: `npm run dev`
Expected: No errors in terminal.

- [ ] **Step 3: Commit**

```bash
git add src/components/TestSelector.jsx
git commit -m "feat: add TestSelector component with Conners and placeholder cards"
```

---

### Task 3: Add back button to ModuleNav

**Files:**
- Modify: `src/components/ModuleNav.jsx`

- [ ] **Step 1: Update `ModuleNav` to accept and render an `onBack` prop**

Replace the entire file content with:

```jsx
const MODULES = [
  { id: 'cuestionario', label: 'Cuestionario' },
  { id: 'analisis',     label: 'Análisis de estilo' },
  { id: 'graficas',     label: 'Gráficas' },
  { id: 'acerca',       label: 'Acerca de' },
];

const ModuleNav = ({ activeModule, onModuleChange, onBack }) => (
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
  </nav>
);

export default ModuleNav;
```

- [ ] **Step 2: Verify the dev server compiles without errors**

Run: `npm run dev`
Expected: No errors. The existing app UI looks unchanged (no back button yet since `onBack` is not passed yet).

- [ ] **Step 3: Commit**

```bash
git add src/components/ModuleNav.jsx
git commit -m "feat: add optional back button to ModuleNav"
```

---

### Task 4: Wire activeTest state in App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Update `src/App.jsx`**

Replace the entire file content with:

```jsx
import './App.css'
import { useState, useEffect } from 'react';
import questions from './resources/questions'
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

const App = () => {
  const [activeTest, setActiveTest] = useState(null);

  const [answers, setAnswers] = useState(() => {
    const stored = localStorage.getItem('answers');
    return stored ? JSON.parse(stored) : {};
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const stored = localStorage.getItem('currentPage');
    return stored ? parseInt(stored, 10) : 0;
  });

  const [activeModule, setActiveModule] = useState('cuestionario');

  useEffect(() => {
    localStorage.setItem('answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('currentPage', String(currentPage));
  }, [currentPage]);

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const pageQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  const answeredInPage = pageQuestions.filter(q => answers[q.id] !== undefined).length;

  const resetAnswers = () => {
    localStorage.removeItem('answers');
    localStorage.removeItem('currentPage');
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

- [ ] **Step 2: Verify the full flow in the browser**

Run: `npm run dev` and open `http://localhost:5173/conners/`

Check:
1. App opens on the test selector landing page (3 cards visible)
2. "Prueba 2" and "Prueba 3" cards are greyed out with dashed border and "Próximamente" badge — clicking them does nothing
3. Clicking "Conners 3" / "Iniciar →" loads the questionnaire
4. "← Pruebas" button appears in the module nav
5. Clicking "← Pruebas" returns to the selector
6. Previously saved answers in localStorage are still intact after returning to the selector and re-entering

- [ ] **Step 3: Run the linter**

Run: `npm run lint`
Expected: No errors (warnings are acceptable).

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire test selector landing page into App"
```
