# ISIS CALCULATOR — Resumen del Sistema

## ¿Qué es?

Calculadora de precios de servicios de uñas para el negocio **Isis Styles**. Permite a clientes o al equipo estimar el costo de servicios según técnica, largo, decoraciones y servicios complementarios. Exporta el resumen como imagen JPG para compartir.

## Stack

- **React 19** + **Vite** (bundler)
- **Tailwind CSS v4** (estilos)
- **html2canvas** (exportar resumen a JPG)
- **Jest** (tests unitarios)
- Moneda: **PEN (Soles peruanos)**

---

## Estructura del Proyecto

```
src/
  App.jsx                    ← Orquestador principal, todo el estado vive aquí
  components/
    TechnicalMasterySection.jsx    ← Selección de técnica + largo
    ArtistryDesignSection.jsx      ← Carruseles de decoraciones + lightbox
    ComplementaryCareSection.jsx   ← Servicios adicionales (forma, retiro, reposición)
    SummarySelectionSection.jsx    ← Panel resumen + botón exportar JPG + limpiar
  config/
    pricing.js               ← TODA la data de catálogo y precios
  domain/
    calculateEstimate.js     ← Motor de cálculo puro (sin side effects)
    estimateHandlers.js      ← Wrappers de UI, formateo de moneda, localStorage
public/
  [24 imágenes JPEG]         ← Fotos de diseños de uñas para los carruseles
tests/
  calculateEstimate.test.js  ← 6 tests unitarios del motor de cálculo
```

---

## Flujo de la App

```
Usuario llega → App carga draft de localStorage (si existe)
    ↓
1. Elige Técnica → TechnicalMasterySection
2. Elige Largo (si aplica) → precios cambian dinámicamente
3. Elige Decoraciones → ArtistryDesignSection (carruseles con fotos)
4. Elige Servicios Adicionales → ComplementaryCareSection
    ↓
calculateEstimate() corre vía useMemo en cada cambio
    ↓
SummarySelectionSection muestra:
  - Items seleccionados con precios individuales
  - Total estimado
  - Botón "Exportar JPG" (html2canvas → descarga imagen)
  - Botón "Limpiar" (reset total)
    ↓
Cada cambio se guarda automáticamente en localStorage
```

---

## Estado del App (App.jsx)

```javascript
{
  techniqueKind: 'with-length' | 'no-length' | 'maintenance',
  techniqueName: string,       // técnica seleccionada
  lengthLevel: number,         // 1-6
  decorationCounts: {},        // { nombreDecoración: cantidad }
  selectionOrder: [],          // orden de selección (para calcular las 2 gratis)
  changeShape: boolean,        // cambio de forma
  retiroType: 'none' | 'acrilico' | 'gel' | 'gel-semipermanente',
  reposicionType: 'none' | 'acrilico' | 'polygel' | 'builder-gel',
  reposicionQty: number
}
```

---

## Reglas de Negocio Clave

1. **Las primeras 2 decoraciones simples seleccionadas son GRATIS** (se rastrea con `selectionOrder`)
2. Las decoraciones "incluidas" (Francesas, Color entero) siempre son gratis
3. Los diseños completos (Full Designs) no son gratis y solo pueden elegirse 1
4. Los diseños completos no se pueden combinar con decoraciones simples
5. El precio de las técnicas "con largo" cambia según el nivel (L1–L6)
6. El motor (`calculateEstimate.js`) opera en centavos internamente para evitar errores de punto flotante

---

## Catálogo (src/config/pricing.js)

### Técnicas sin largo (NO_LENGTH_TECHNIQUES) — 8 opciones
Manicure, Gel semipermanente, Rubber Gel, Kappings, Híbrido, etc.  
Precios: $20–$60

### Técnicas con largo (WITH_LENGTH_TECHNIQUES) — 6 opciones
Acrílico, Builder Gel, Polygel, Sculptured, Baby Boomer, etc.  
Precios: L1–L6 por técnica (ej: Acrílico L1=$60, L6=$100)

### Mantenimientos — 4 opciones
Mantenimiento Acrílico, Rubber Gel, Builder Gel, Polygel

### Decoraciones incluidas (2)
Francesas, Color entero

### Decoraciones simples (16)
Mirror Effect, Aurora, Sugar, Mármol, 3D, Chrome, etc.  
Precio: $3–$20 por par

### Diseños completos (Full Designs) — 7 opciones
Diseños elaborados de nail art  
Precio fijo

### Servicios adicionales
- Cambio de forma: $10
- Retiro Acrílico: $20, Gel: $15, Gel Semipermanente: $10
- Reposición Acrílico: $6/uña, Polygel: $7/uña, Builder Gel: $7/uña

---

## Motor de Cálculo (calculateEstimate.js)

Función pura que recibe todo el estado y devuelve:

```javascript
{
  subtotal: number,
  total: number,
  items: [{ name, unitPrice, qty, freeQty, chargedQty, lineTotal, badge, isDisabled }],
  freeAllocation: {},           // cuántas gratis por decoración
  messages: [{ type, code, message }],
  ui: {
    decorationState: {},        // { nombre: { isDisabled, badge } }
    effectiveLength: number
  }
}
```

---

## Persistencia

- `localStorage` key: `isis-estimate-draft` (versión 1)
- Se guarda automáticamente en cada cambio del estado
- Se carga al iniciar la app

---

## Exportar JPG

- Botón en `SummarySelectionSection`
- Usa `html2canvas` con escala 2x y fondo `#f5f4f1`
- Nombre del archivo: `resumen-precios-{timestamp}.jpg`

---

## Tests (tests/calculateEstimate.test.js)

6 tests unitarios cubriendo:
1. Free allocation (primeras 2 gratis)
2. Capping de largo y servicios adicionales
3. Precios faltantes (fallback a 0, sin mutaciones)
4. Técnicas de mantenimiento
5. Full designs (cap a qty=1)
6. Cálculo de reposición por uña

---

## Pendiente / Por Acomodar

> Esta sección debe actualizarse cuando se trabajen mejoras visuales o funcionales.

- [ ] Revisar layout / diseño visual general
- [ ] Verificar responsividad en móvil
- [ ] Revisar UX de los carruseles
- [ ] (Agregar aquí los ajustes específicos pendientes)
