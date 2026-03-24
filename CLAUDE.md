# CLAUDE.md

This file provides guidance for AI assistants working on the Conners assessment application.

## Project Overview

**Conners** ("La poderosísima Conners") is a client-side React questionnaire/scoring application. It presents a set of multiple-choice questions mapped to assessment fields, aggregates scores per field, and persists answers in `localStorage`. There is no backend, database, or authentication.

## Tech Stack

- **Framework**: React 18 with JSX
- **Build Tool**: Vite 5
- **Language**: JavaScript (ES modules, `.jsx` files)
- **Styling**: Plain CSS (no CSS framework)
- **Linting**: ESLint 9 (flat config format) with React, React Hooks, and React Refresh plugins
- **Package Manager**: npm

## Repository Structure

```
conners/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration (minimal, uses @vitejs/plugin-react)
├── eslint.config.js            # ESLint flat config
├── public/
│   └── vite.svg
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Root component: state, localStorage, layout
    ├── App.css                 # Table and field cell styles
    ├── index.css               # Global body/heading/button styles
    ├── components/
    │   ├── Board.jsx           # Question table rows
    │   ├── Header.jsx          # Table column headers
    │   ├── Question.jsx        # Radio button options per question
    │   └── Total.jsx           # Aggregated field totals + reset button
    └── resources/
        ├── questions.js        # Question data (id, fields[], options[])
        └── fields.js           # Assessment field keys (IN1, HY1, LE1, …)
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

### No Tests

There is no test framework configured. When adding tests, Vitest is the natural choice given the Vite setup.

### No CI/CD

There are no GitHub Actions workflows or other CI pipelines. Linting is the only automated quality check available.

## Architecture & Key Conventions

### State Management

All application state lives in `App.jsx` via `useState`. Answers are stored as a plain object keyed by question ID. On mount, answers are loaded from `localStorage`; on each update, they are persisted back.

```jsx
// Shape of answers state
{ [questionId]: selectedOptionValue }
```

### Data Flow

```
resources/questions.js  →  App.jsx (state)  →  Board.jsx  →  Question.jsx (radio inputs)
resources/fields.js     →  Header.jsx (column headers)
                        →  Board.jsx (field cell mapping)
                        →  Total.jsx (score aggregation)
```

### Question Data Shape

```js
// src/resources/questions.js
{
  id: 1,
  fields: ["HY1", "AH1"],   // which assessment fields this question contributes to
  options: [0, 1, 2, 3]     // selectable values (typically 0–3 or 0–1)
}
```

### Field Keys

14 fields defined in `src/resources/fields.js`: `IN1, HY1, LE1, LP1, EF1, AG1, PR1, GL1, AN1, AH1, CD1, OD1, PI1, NI1`

### Styling Conventions

- No CSS framework; all styles are in `App.css` and `index.css`
- Table cells have an "active" class when a question contributes to that field
- UI labels are in Spanish (`Respuestas`, `Reiniciar`, etc.)

### ESLint

Uses flat config (`eslint.config.js`). Key rules:
- `jsx-no-target-blank`: off
- `react-refresh/only-export-components`: warn

Run `npm run lint` before committing. Fix all errors; warnings are acceptable.

## Important Notes for AI Assistants

- **Frontend only** — do not add a backend unless explicitly requested.
- **No test files exist** — do not assume tests pass; there are none to run.
- **localStorage** is the only persistence layer; do not introduce a database or API calls without discussion.
- **Spanish UI** — keep user-facing strings in Spanish to match existing conventions.
- **Minimal dependencies** — the project intentionally has only React and React-DOM as runtime dependencies. Avoid adding heavy libraries.
- **Component files use `.jsx` extension** — maintain this convention for all React components.
- **No TypeScript** — the project uses plain JavaScript; do not convert to TypeScript unless asked.
- The default branch for development is `claude/add-claude-documentation-hyblL`; push changes there.
