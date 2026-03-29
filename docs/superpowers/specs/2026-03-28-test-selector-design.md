# Test Selector Landing Page

**Date:** 2026-03-28
**Status:** Approved

## Overview

Add a landing/home screen to the app so users can choose which neuropsychological assessment to take. Currently only Conners 3 is available; other tests appear as styled "Próximamente" placeholders. The grid layout is designed to transition to a carousel in the future with minimal changes.

## Architecture

Add `activeTest` state to `App.jsx` (default `null`).

- When `null` → render `TestSelector`
- When `'conners'` → render existing assessment UI

```jsx
const [activeTest, setActiveTest] = useState(null);
```

No localStorage persistence for `activeTest` — users always land on the selector.

## Components

### New: `TestSelector`

Located at `src/components/TestSelector.jsx`.

Renders a centered card grid using CSS Grid (`auto-fill`, fixed min-width columns). Each test is defined in a static array inside the component:

```js
const TESTS = [
  { id: 'conners', label: 'Conners 3',  description: 'Evaluación de TDAH', available: true  },
  { id: 'test2',   label: 'Prueba 2',   description: 'Próximamente',        available: false },
  { id: 'test3',   label: 'Prueba 3',   description: 'Próximamente',        available: false },
];
```

**Available card** (`available: true`): blue border, pointer cursor, "Iniciar →" button, calls `onSelect(id)`.
**Unavailable card** (`available: false`): dashed grey border, reduced opacity, non-clickable "Próximamente" badge, no `onClick`.

Adding a new test in the future = add one entry to `TESTS`. Enabling it = flip `available: true`.

**Carousel readiness:** The grid uses `display: grid` with `auto-fill` columns. Converting to a horizontal carousel later requires only changing the container to `display: flex; overflow-x: auto` — no structural changes to the cards.

### Modified: `ModuleNav`

Add a "← Pruebas" back button on the left of the nav bar. This button calls a new `onBack` prop which sets `activeTest` back to `null` in `App.jsx`.

### Modified: `App.jsx`

- Add `activeTest` / `setActiveTest` state
- Conditionally render `TestSelector` or the existing modules
- Pass `onBack={() => setActiveTest(null)}` to `ModuleNav`
- Pass `onSelect={setActiveTest}` to `TestSelector`

## Styling

New CSS classes added to `App.css`:

| Class | Purpose |
|---|---|
| `.test-selector` | Centered wrapper, max-width 900px |
| `.test-selector-title` | Page heading |
| `.test-selector-grid` | CSS Grid container for cards |
| `.test-card` | Base card styles (border-radius, padding, text-align) |
| `.test-card.available` | Blue border, pointer cursor, hover shadow |
| `.test-card.unavailable` | Dashed grey border, `opacity: 0.6`, `cursor: default` |
| `.test-card-icon` | Large emoji/icon area |
| `.test-card-label` | Test name, bold |
| `.test-card-description` | Short description, small grey text |
| `.test-card-action` | Button / badge at bottom of card |
| `.module-nav-back` | Back button on left side of ModuleNav |

No new dependencies. All UI labels in Spanish.

## Out of Scope

- Carousel implementation (future work)
- Per-test localStorage namespacing (future work, currently all tests would share the same `answers` key)
- Real content for placeholder tests
