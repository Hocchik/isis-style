# Isis Calculator

Calculadora editorial para estimar servicios de unas con reglas de negocio desacopladas de la UI.

## Regla resumida

- Tecnica:
	- `techniqueKind = no-length` usa `PRICES_NO_LENGTH[techniqueName]`.
	- `techniqueKind = with-length` usa `PRICES_WITH_LENGTH[techniqueName][effectiveLength]`.
- Largo:
	- Se normaliza a entero.
	- Se capa al rango disponible por tecnica.
- Decoraciones:
	- Primeros 2 pares gratis por orden de `selectionOrder`.
	- Cada linea retorna `freeQty`, `chargedQty`, `lineTotal` y `badge`.
- Extras:
	- `extraTones * TONE_EXTRA_PRICE`.
	- `changeShape` agrega `CHANGE_SHAPE_PRICE`.
	- `retiroType` y `reposicionType` usan tablas fijas.
- Validacion:
	- Cantidades negativas se normalizan a 0.
	- Precios faltantes se calculan como 0 y quedan registrados en `messages`.

## API principal

- Funcion pura: `calculateEstimate(inputs, priceTables)` en `src/domain/calculateEstimate.js`.
- Handler de UI: `calculateEstimateWithHandlers(inputs, priceTables)` en `src/domain/estimateHandlers.js`.
	- Incluye formato monetario.
	- Puede loggear warnings inyectando `logger`.
- Persistencia opcional con version:
	- `saveEstimateDraft(payload)`
	- `loadEstimateDraft()`

## Ejecutar

1. Instalar dependencias:

```bash
npm install
```

2. Desarrollo:

```bash
npm run dev
```

3. Tests unitarios:

```bash
npm test
```

## Escenarios QA

Se incluyen escenarios de ejemplo en `examples/estimate-scenarios.json`.
