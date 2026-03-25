# CLAUDE.md

This file provides guidance for AI assistants working on this neuropsychological assessment application.

## Project Overview

**Sistema de Evaluación Neuropsicológica** is a client-side React application for administering, scoring, and interpreting standardized neuropsychological assessments. It presents 113 multiple-choice questions mapped to assessment fields, aggregates scores per field, and persists answers in `localStorage`. There is no backend, database, or authentication.

The app is organized into four modules accessible via a tab nav:
- **Cuestionario** — paginated questionnaire (10 questions/page)
- **Análisis de estilo** — Response Style Analysis (Inconsistency Index + PI/NI guidelines)
- **Gráficas** — SVG histogram of raw scores per field, downloadable
- **Acerca de** — Spanish help/about page

## Tech Stack

- **Framework**: React 18 with JSX
- **Build Tool**: Vite 5
- **Language**: JavaScript (ES modules, `.jsx` files)
- **Styling**: Plain CSS (no CSS framework)
- **Linting**: ESLint 9 (flat config format) with React, React Hooks, and React Refresh plugins
- **Package Manager**: npm

## Repository Structure

```
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── vite.config.js                # Vite config (base: '/conners/')
├── eslint.config.js              # ESLint flat config
├── .github/workflows/deploy.yml  # GitHub Pages deploy via Actions (Node 22)
├── public/
│   └── vite.svg
└── src/
    ├── main.jsx                  # React root mount
    ├── App.jsx                   # Root: state, localStorage, module routing
    ├── App.css                   # All component styles + mobile breakpoint
    ├── index.css                 # Global body/heading/button styles
    ├── components/
    │   ├── ModuleNav.jsx         # Tab navigation between modules
    │   ├── Board.jsx             # Question table rows
    │   ├── Header.jsx            # Table column headers
    │   ├── Question.jsx          # Radio button options per question
    │   ├── Total.jsx             # Aggregated field totals + reset button
    │   ├── Pagination.jsx        # Page controls, progress bar, dots
    │   ├── InconsistencyIndex.jsx# Response Style Analysis module
    │   ├── Charts.jsx            # SVG histogram module with download
    │   └── About.jsx             # Help / about page in Spanish
    └── resources/
        ├── questions.js          # 113 questions: { id, fields[], options[] }
        └── fields.js             # 14 assessment field keys
```

## Development Workflow

### Setup

```bash
npm install
```

### Common Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint across all source files |

### Deployment

GitHub Pages deployment runs automatically on every push to `main` via `.github/workflows/deploy.yml`. The workflow builds with `npm run build` and uploads `dist/` as the Pages artifact. GitHub Pages source must be set to **GitHub Actions** in repository settings.

### No Tests

There is no test framework configured. When adding tests, Vitest is the natural choice given the Vite setup.

## Architecture & Key Conventions

### State Management

All application state lives in `App.jsx` via `useState`. Answers and current page are stored in `localStorage`.

```jsx
// Shape of answers state
{ [questionId]: selectedOptionValue }
```

### Module Routing

`activeModule` state in `App.jsx` controls which module renders. Switching tabs does not reset answers.

### Data Flow

```
resources/questions.js  →  App.jsx (state)  →  Board.jsx  →  Question.jsx
resources/fields.js     →  Header.jsx, Board.jsx, Total.jsx, InconsistencyIndex.jsx, Charts.jsx
```

### Question Data Shape

```js
// src/resources/questions.js
{
  id: 1,
  fields: ["HY1", "AH1"],   // assessment fields this question contributes to
  options: [0, 1, 2, 3]     // selectable values (0–3 or 0–1)
}
```

**Note:** Field mappings for questions 11–113 are placeholders. Update `fields[]` arrays with the real instrument mapping before production use.

### Field Keys

14 fields defined in `src/resources/fields.js`:

| Key  | Description                          |
|------|--------------------------------------|
| IN1  | Inatención                           |
| HY1  | Hiperactividad                       |
| LE1  | Problemas de aprendizaje             |
| LP1  | Problemas de aprendizaje (escolar)   |
| EF1  | Función ejecutiva                    |
| AG1  | Agresión                             |
| PR1  | Relaciones con pares                 |
| GL1  | Índice global                        |
| AN1  | Ansiedad                             |
| AH1  | Índice ADHD                          |
| CD1  | Trastorno de conducta                |
| OD1  | Trastorno negativista desafiante     |
| PI1  | Impresión positiva                   |
| NI1  | Impresión negativa                   |

### Inconsistency Index

`InconsistencyIndex.jsx` uses 10 hardcoded item pairs from the instrument's Response Style Analysis sheet:
`(97,100), (42,63), (4,77), (7,13), (26,29), (35,105), (25,57), (23,44), (34,89), (47,71)`

- **Box A** = sum of absolute differences per pair
- **Box B** = count of differences equal to 2 or 3
- Flag: A ≥ 6 **and** B ≥ 2 → inconsistent response style

### Charts

`Charts.jsx` renders an inline SVG histogram. Download uses `XMLSerializer` + `URL.createObjectURL` — no extra dependencies.

### Styling Conventions

- No CSS framework; all styles in `App.css` and `index.css`
- Mobile breakpoint at `640px`: table → card layout, module nav stacks vertically
- UI labels are in Spanish

### ESLint

Uses flat config (`eslint.config.js`). Key rules:
- `jsx-no-target-blank`: off
- `react-refresh/only-export-components`: warn

Run `npm run lint` before committing. Fix all errors; warnings are acceptable.

## Important Notes for AI Assistants

- **Frontend only** — do not add a backend unless explicitly requested.
- **No test files exist** — do not assume tests pass; there are none to run.
- **localStorage** is the only persistence layer; do not introduce a database or API calls.
- **Spanish UI** — keep all user-facing strings in Spanish.
- **Minimal dependencies** — only React and React-DOM as runtime dependencies. Avoid adding libraries.
- **Component files use `.jsx` extension** — maintain this convention.
- **No TypeScript** — plain JavaScript only.
- **Development branch**: `claude/add-claude-documentation-hyblL`; push changes there.
