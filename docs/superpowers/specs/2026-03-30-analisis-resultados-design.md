# Análisis de Resultados — Design Spec

**Date:** 2026-03-30
**Status:** Approved

## Summary

Four changes to the Conners parents app:

1. Merge "Análisis de estilo" and "Análisis clínico" tabs into a single "Análisis de Resultados" tab
2. Add collapsible sections within the merged tab (collapsed by default)
3. Reorder tabs: Gráficas moves before Acerca de
4. Fix Edad number input on mobile (numeric keyboard not appearing)

---

## 1. Tab Order

**Before:** Cuestionario | Análisis de estilo | Gráficas | Análisis clínico | Acerca de

**After:** Cuestionario | Análisis de Resultados | Gráficas | Acerca de

The `MODULES` array in `ModuleNav.jsx` is updated to reflect this order. The `analisis` and `clinico` module IDs are replaced by a single `resultados` ID.

`App.jsx` routing: remove the `analisis` and `clinico` render blocks, add a single `resultados` block that renders the new `AnalisisResultados` component.

---

## 2. New Component: `AnalisisResultados`

A new component `src/components/AnalisisResultados.jsx` wraps both analyses in a single scrollable container.

It receives the same props that `InconsistencyIndex` and `ClinicalAnalysisParents` currently receive: `{ answers, questions, age, activeTest }`.

### Collapsible structure (Option C — approved)

All sections collapsed by default. Each section has its own `useState(false)` boolean inside `AnalisisResultados`.

| Section header | Collapsed contains |
|---|---|
| Análisis de Estilo de Respuesta | `<InconsistencyIndex>` (unchanged) |
| DSM-5 Síntomas ADHD | `<DSM5Counts>` |
| Trastorno de Conducta / TOD | `<ConductDisorder>` |
| Ítems de Deterioro | `<ImpairmentItems>` |
| Índice ADHD | `<ADHDIndex>` |
| Ítems Screener | `<ScreenerItems>` |

For the teachers version (`conners-teachers`), "Análisis de Estilo de Respuesta" renders normally (it works for both versions). The five clinical section collapsibles are hidden and a single placeholder message is shown in their place — same logic currently in `App.jsx` for `clinico`.

### Collapsible header design

Each section uses a button-style header row:
- Left: section title (bold, `#444`)
- Right: chevron `▶` (collapsed) / `▼` (expanded)
- Click toggles the `useState` boolean
- Content area hidden via `display: none` when closed

### CSS

Add `.collapsible-header` and `.collapsible-body` classes to `App.css`. No animation required (keeps it simple, consistent with existing style).

---

## 3. Edad Input Fix

In `ModuleNav.jsx`, change the age input attributes:

```jsx
// Before
type="number"

// After
type="text"
inputMode="numeric"
pattern="[0-9]*"
```

The `onChange` handler logic stays the same (`parseInt`, validate range). This triggers the numeric keyboard on iOS and Android while avoiding native number input quirks.

---

## 4. Files Changed

| File | Change |
|---|---|
| `src/components/ModuleNav.jsx` | Update `MODULES` array (4 tabs), fix age input attributes |
| `src/App.jsx` | Remove `analisis`/`clinico` render blocks, add `resultados` block |
| `src/components/AnalisisResultados.jsx` | New component — collapsible wrapper |
| `src/App.css` | Add collapsible header/body styles |

Existing components (`InconsistencyIndex`, `DSM5Counts`, `ConductDisorder`, `ImpairmentItems`, `ADHDIndex`, `ScreenerItems`) are **not modified** — they are composed inside `AnalisisResultados`.

`ClinicalAnalysisParents` is no longer used (its sub-components are composed directly by `AnalisisResultados` to support individual collapsibles). It can remain in the codebase untouched.

---

## Out of Scope

- No changes to the questionnaire tab
- No changes to Charts or About
- No animation on collapsible open/close
- No persistent open/closed state across tab switches
