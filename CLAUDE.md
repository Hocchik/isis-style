# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
npm run dev        # Servidor de desarrollo (Vite)
npm run build      # Build de producción → /dist
npm run preview    # Preview del build de producción
npm run lint       # ESLint
npm run test       # Jest (requiere Node con --experimental-vm-modules)
```

Para correr un test individual:
```bash
node --experimental-vm-modules ./node_modules/jest/bin/jest.js tests/calculateEstimate.test.js
```

## Arquitectura

### Flujo de datos

```
pricing.js (catálogo + precios)
    ↓
App.jsx (estado central, useMemo)
    ↓
calculateEstimateWithHandlers() → calculateEstimate() (motor puro)
    ↓
SummarySelectionSection (muestra resultado, exporta JPG)
```

**Todo el estado vive en `App.jsx`** — los componentes hijos reciben props y callbacks, no manejan estado propio de negocio.

**`calculateEstimate`** (`src/domain/calculateEstimate.js`) es una función pura sin side effects. Opera en centavos internamente para evitar errores de punto flotante. Recibe `inputs` + `priceTables` y devuelve `{ items, total, freeAllocation, messages, ui }`.

**`calculateEstimateWithHandlers`** (`src/domain/estimateHandlers.js`) envuelve la función pura añadiendo formateo de moneda (PEN) a cada item. El resultado de `useMemo` en App.jsx es el que reciben los componentes.

### Catálogo (`src/config/pricing.js`)

Fuente de verdad única para todos los precios y opciones. Tres tipos de técnicas:
- `NO_LENGTH_TECHNIQUES` + `MANTENIMIENTOS_TECHNIQUES` → precio fijo en `PRICES_NO_LENGTH`
- `WITH_LENGTH_TECHNIQUES` → precio por nivel L1–L6 en `PRICES_WITH_LENGTH`

Tres categorías de decoraciones:
- `INCLUDED_DECORATION_OPTIONS` — siempre gratis (Francesas, Color entero)
- `SIMPLE_DECORATION_OPTIONS` — cobradas por par; las **2 primeras seleccionadas son gratis**
- `FULL_DESIGN_OPTIONS` — precio fijo por juego completo, qty cap=1, **no combinables con simples**

Los full designs se identifican en el motor por `name.startsWith('Diseño')` — mantener ese prefijo en todos los nombres de `FULL_DESIGN_OPTIONS`.

### Persistencia

`saveEstimateDraft` / `loadEstimateDraft` guardan el estado en `localStorage` bajo la clave `isis-estimate-draft` (versión 1). Al cargar un draft, los nombres pasan por `normalizeDisplayName()` en App.jsx para compatibilidad con entradas antiguas sin tildes.

### Exportar JPG

`SummarySelectionSection` usa `html2canvas` sobre un div oculto (`export-jpg-template`) con `aria-hidden="true"`. El div del resumen visible y el template de exportación son estructuras separadas.

### Estilos

Un solo archivo `src/App.css` con breakpoints en: `1200px`, `900px`, `768px`, `480px`. El panel de resumen (`summary-column`) es sticky en desktop y un drawer lateral fijo en móvil, controlado por el estado `isMobileOpen` en `SummarySelectionSection`.
