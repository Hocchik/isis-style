/**
 * Pure estimator for nail service pricing.
 * Deterministic, side-effect free and O(n) over selected items.
 */
const DEFAULT_INPUTS = {
  techniqueKind: 'no-length',
  techniqueName: '',
  length: 1,
  decorationCounts: {},
  selectionOrder: [],
  changeShape: false,
  retiroType: 'none',
  reposicionType: 'none',
}

const DEFAULT_PRICE_TABLES = {
  PRICES_NO_LENGTH: {},
  PRICES_WITH_LENGTH: {},
  DECORATION_PRICES: {},
  CHANGE_SHAPE_PRICE: 0,
  RETIRO_PRICES: { none: 0, acrilico: 0, gel: 0 },
  REPOSICION_PRICES: { none: 0, acrilico: 0, polygel: 0, 'builder-gel': 0 },
  INCLUDED_DECORATIONS: [],
  NON_COMBINABLE_DECORATIONS: {},
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function toInteger(value, fallback = 0) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return fallback
  return Math.trunc(numeric)
}

function clampNonNegativeInt(value, fallback = 0) {
  const normalized = toInteger(value, fallback)
  return normalized < 0 ? 0 : normalized
}

function toCents(value) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return 0
  return Math.round(numeric * 100)
}

function fromCents(value) {
  return Number((value / 100).toFixed(2))
}

function pushMessage(messages, type, code, message) {
  messages.push({ type, code, message })
}

function getSafePrice(price, messages, code, label) {
  const numeric = Number(price)
  if (!Number.isFinite(numeric)) {
    pushMessage(messages, 'warning', code, `${label} no tiene un precio configurado. Se usará 0.`)
    return 0
  }
  return numeric
}

function normalizeSelectionOrder(selectionOrder, knownNames) {
  if (!Array.isArray(selectionOrder)) return []
  const dedup = new Set()

  return selectionOrder
    .filter((name) => typeof name === 'string' && knownNames.has(name))
    .filter((name) => {
      if (dedup.has(name)) return false
      dedup.add(name)
      return true
    })
}

function buildDecorationState(names, counts, nonCombinable, freeAllocation, groupState) {
  const state = {}
  const includedSet = groupState.includedSet
  const hasSimpleSelected = groupState.hasSimpleSelected
  const hasFullSelected = groupState.hasFullSelected

  for (const name of names) {
    const isSelected = (counts[name] || 0) > 0
    const conflicts = Array.isArray(nonCombinable[name]) ? nonCombinable[name] : []
    const hasSelectedConflict = conflicts.some((conflictName) => (counts[conflictName] || 0) > 0)
    const isIncluded = includedSet.has(name)
    const isFullDesign = isFullDesignDecoration(name)
    const isSimple = !isIncluded && !isFullDesign
    const isGroupBlocked =
      (!isSelected && isFullDesign && hasSimpleSelected) ||
      (!isSelected && isSimple && hasFullSelected)

    state[name] = {
      isDisabled: !isSelected && (hasSelectedConflict || isGroupBlocked),
      badge: (freeAllocation[name] || 0) > 0 ? 'incluido' : null,
    }
  }

  return state
}

function isFullDesignDecoration(name) {
  return typeof name === 'string' && (name.startsWith('Diseno') || name.startsWith('Diseño'))
}

/**
 * @typedef {Object} EstimateInput
 * @property {'no-length'|'with-length'|'maintenance'} techniqueKind
 * @property {string} techniqueName
 * @property {number} length
 * @property {Record<string, number>} decorationCounts
 * @property {string[]} selectionOrder
 * @property {boolean} changeShape
 * @property {'none'|'acrilico'|'gel'} retiroType
 * @property {'none'|'acrilico'|'polygel'|'builder-gel'} reposicionType
 * @property {number} reposicionQty
 */

/**
 * @typedef {Object} EstimatePriceTables
 * @property {Record<string, number>} PRICES_NO_LENGTH
 * @property {Record<string, Record<number, number>>} PRICES_WITH_LENGTH
 * @property {Record<string, number>} DECORATION_PRICES
 * @property {number} CHANGE_SHAPE_PRICE
 * @property {Record<string, number>} RETIRO_PRICES
 * @property {Record<string, number>} REPOSICION_PRICES
 * @property {string[]} [INCLUDED_DECORATIONS]
 * @property {Record<string, string[]>} [NON_COMBINABLE_DECORATIONS]
 */

/**
 * Calculates a full estimate from selected options.
 *
 * @param {Partial<EstimateInput>} rawInputs
 * @param {Partial<EstimatePriceTables>} rawPriceTables
 * @returns {{
 *  subtotal: number,
 *  total: number,
 *  items: Array<{
 *    name: string,
 *    unitPrice: number,
 *    qty: number,
 *    freeQty: number,
 *    chargedQty: number,
 *    lineTotal: number,
 *    badge: 'incluido' | null,
 *    isDisabled: boolean,
 *  }>,
 *  freeAllocation: Record<string, number>,
 *  messages: Array<{type: 'warning'|'info', code: string, message: string}>,
 *  ui: {
 *    decorationState: Record<string, {isDisabled: boolean, badge: 'incluido' | null}>,
 *    effectiveLength: number,
 *  },
 * }}
 */
export function calculateEstimate(rawInputs = {}, rawPriceTables = {}) {
  const inputs = { ...DEFAULT_INPUTS, ...rawInputs }
  const tables = { ...DEFAULT_PRICE_TABLES, ...rawPriceTables }
  const messages = []
  const freeAllocation = {}
  const items = []

  const decorationCounts = isObject(inputs.decorationCounts) ? { ...inputs.decorationCounts } : {}
  const normalizedDecorationCounts = {}

  for (const [name, value] of Object.entries(decorationCounts)) {
    const qty = clampNonNegativeInt(value)
    if (qty !== value) {
      pushMessage(
        messages,
        'info',
        'NORMALIZED_QTY',
        `La cantidad de decoración para ${name} se normalizó a ${qty}.`,
      )
    }
    normalizedDecorationCounts[name] = qty
  }

  let subtotalCents = 0
  let effectiveLength = clampNonNegativeInt(inputs.length, 1)

  if (inputs.techniqueKind === 'no-length' || inputs.techniqueKind === 'maintenance') {
    const kindLabel = inputs.techniqueKind === 'maintenance' ? 'Mantenimiento' : 'Técnica'
    const techniquePrice = getSafePrice(
      tables.PRICES_NO_LENGTH?.[inputs.techniqueName],
      messages,
      'MISSING_TECHNIQUE_PRICE',
      `La técnica ${inputs.techniqueName}`,
    )
    const lineTotalCents = toCents(techniquePrice)
    subtotalCents += lineTotalCents

    items.push({
      name: `${kindLabel}: ${inputs.techniqueName || 'sin seleccionar'}`,
      unitPrice: techniquePrice,
      qty: 1,
      freeQty: 0,
      chargedQty: 1,
      lineTotal: fromCents(lineTotalCents),
      badge: null,
      isDisabled: false,
    })
  }

  if (inputs.techniqueKind === 'with-length') {
    const byLength = tables.PRICES_WITH_LENGTH?.[inputs.techniqueName]
    if (!isObject(byLength)) {
      pushMessage(
        messages,
        'warning',
        'MISSING_TECHNIQUE_PRICE',
        `La técnica ${inputs.techniqueName} no tiene una tabla con largo. Se usará 0.`,
      )

      items.push({
        name: `Técnica con largo: ${inputs.techniqueName || 'sin seleccionar'}`,
        unitPrice: 0,
        qty: 1,
        freeQty: 0,
        chargedQty: 1,
        lineTotal: 0,
        badge: null,
        isDisabled: false,
      })
    } else {
      const availableLengths = Object.keys(byLength)
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value))
        .sort((a, b) => a - b)

      if (availableLengths.length === 0) {
        pushMessage(
          messages,
          'warning',
          'MISSING_TECHNIQUE_PRICE',
          `La técnica ${inputs.techniqueName} tiene una tabla con largo vacía. Se usará 0.`,
        )

        items.push({
          name: `Técnica con largo: ${inputs.techniqueName || 'sin seleccionar'}`,
          unitPrice: 0,
          qty: 1,
          freeQty: 0,
          chargedQty: 1,
          lineTotal: 0,
          badge: null,
          isDisabled: false,
        })
      } else {
        const requestedLength = clampNonNegativeInt(inputs.length, 1)
        const maxLength = availableLengths[availableLengths.length - 1]
        const minLength = availableLengths[0]
        const cappedLength = Math.min(Math.max(requestedLength, minLength), maxLength)
        effectiveLength = cappedLength

        if (requestedLength !== cappedLength) {
          pushMessage(
            messages,
            'info',
            'CAPPED_LENGTH',
            `El largo ${requestedLength} se ajustó a ${cappedLength}.`,
          )
        }

        const techniquePrice = getSafePrice(
          byLength[cappedLength],
          messages,
          'MISSING_TECHNIQUE_PRICE',
          `Technique ${inputs.techniqueName} length ${cappedLength}`,
        )

        const lineTotalCents = toCents(techniquePrice)
        subtotalCents += lineTotalCents

        items.push({
          name: `Técnica con largo: ${inputs.techniqueName || 'sin seleccionar'} (L${cappedLength})`,
          unitPrice: techniquePrice,
          qty: 1,
          freeQty: 0,
          chargedQty: 1,
          lineTotal: fromCents(lineTotalCents),
          badge: null,
          isDisabled: false,
        })
      }
    }
  }

  if (
    inputs.techniqueKind !== 'no-length' &&
    inputs.techniqueKind !== 'with-length' &&
    inputs.techniqueKind !== 'maintenance' &&
    inputs.techniqueKind !== 'none'
  ) {
    pushMessage(messages, 'warning', 'INVALID_TECHNIQUE_KIND', 'El tipo de técnica no es válido. Se usará 0.')
  }

  const knownDecorationNames = new Set([
    ...Object.keys(tables.DECORATION_PRICES || {}),
    ...Object.keys(normalizedDecorationCounts),
  ])

  const orderedNames = normalizeSelectionOrder(inputs.selectionOrder, knownDecorationNames)
  for (const name of knownDecorationNames) {
    if (!orderedNames.includes(name)) {
      orderedNames.push(name)
    }
  }

  const includedSet = new Set(
    Array.isArray(tables.INCLUDED_DECORATIONS)
      ? tables.INCLUDED_DECORATIONS.filter((name) => typeof name === 'string')
      : [],
  )

  let hasSimpleSelected = false
  let hasFullSelected = false

  for (const name of orderedNames) {
    const rawQty = clampNonNegativeInt(normalizedDecorationCounts[name], 0)
    const isFullDesign = isFullDesignDecoration(name)
    const isIncluded = includedSet.has(name)
    const qty = isFullDesign || isIncluded ? Math.min(rawQty, 1) : rawQty

    if ((isFullDesign || isIncluded) && rawQty > 1) {
      pushMessage(
        messages,
        'info',
        'NORMALIZED_QTY',
        `Decoration quantity for ${name} was normalized to 1.`,
      )
    }

    if (qty <= 0) {
      freeAllocation[name] = 0
      continue
    }

    const freeHere = isIncluded ? qty : 0
    const chargedQty = qty - freeHere
    freeAllocation[name] = freeHere

    if (!isIncluded && !isFullDesign && qty > 0) {
      hasSimpleSelected = true
    }

    if (isFullDesign && qty > 0) {
      hasFullSelected = true
    }

    const unitPrice = getSafePrice(
      tables.DECORATION_PRICES?.[name],
      messages,
      'MISSING_DECORATION_PRICE',
      `Decoration ${name}`,
    )

    const lineTotalCents = toCents(unitPrice) * chargedQty
    subtotalCents += lineTotalCents

    items.push({
      name,
      unitPrice,
      qty,
      freeQty: freeHere,
      chargedQty,
      lineTotal: fromCents(lineTotalCents),
      badge: freeHere > 0 ? 'incluido' : null,
      isDisabled: false,
    })
  }

  if (Boolean(inputs.changeShape)) {
    const unitPrice = getSafePrice(
      tables.CHANGE_SHAPE_PRICE,
      messages,
      'MISSING_EXTRA_PRICE',
      'Cambio de forma',
    )
    const lineTotalCents = toCents(unitPrice)
    subtotalCents += lineTotalCents

    items.push({
      name: 'Cambio de forma',
      unitPrice,
      qty: 1,
      freeQty: 0,
      chargedQty: 1,
      lineTotal: fromCents(lineTotalCents),
      badge: null,
      isDisabled: false,
    })
  }

  const retiroType = typeof inputs.retiroType === 'string' ? inputs.retiroType : 'none'
  if (retiroType !== 'none') {
    const unitPrice = getSafePrice(
      tables.RETIRO_PRICES?.[retiroType],
      messages,
      'MISSING_EXTRA_PRICE',
      `El retiro ${retiroType}`,
    )
    const lineTotalCents = toCents(unitPrice)
    subtotalCents += lineTotalCents

    items.push({
      name: `Retiro (${retiroType})`,
      unitPrice,
      qty: 1,
      freeQty: 0,
      chargedQty: 1,
      lineTotal: fromCents(lineTotalCents),
      badge: null,
      isDisabled: false,
    })
  }

  const reposicionType = typeof inputs.reposicionType === 'string' ? inputs.reposicionType : 'none'
  const reposicionQty = clampNonNegativeInt(
    inputs.reposicionQty,
    reposicionType === 'none' ? 0 : 1,
  )

  if (reposicionType !== 'none' && reposicionQty > 0) {
    const unitPrice = getSafePrice(
      tables.REPOSICION_PRICES?.[reposicionType],
      messages,
      'MISSING_EXTRA_PRICE',
      `La reposición ${reposicionType}`,
    )
    const lineTotalCents = toCents(unitPrice) * reposicionQty
    subtotalCents += lineTotalCents

    items.push({
      name: `Reposición (${reposicionType})`,
      unitPrice,
      qty: reposicionQty,
      freeQty: 0,
      chargedQty: reposicionQty,
      lineTotal: fromCents(lineTotalCents),
      badge: null,
      isDisabled: false,
    })
  }

  const decorationState = buildDecorationState(
    knownDecorationNames,
    normalizedDecorationCounts,
    tables.NON_COMBINABLE_DECORATIONS || {},
    freeAllocation,
    {
      includedSet,
      hasSimpleSelected,
      hasFullSelected,
    },
  )

  const itemsWithDisableState = items.map((item) => {
    const uiState = decorationState[item.name]
    if (!uiState) return item
    return {
      ...item,
      isDisabled: uiState.isDisabled,
      badge: uiState.badge,
    }
  })

  return {
    subtotal: fromCents(subtotalCents),
    total: fromCents(subtotalCents),
    items: itemsWithDisableState,
    freeAllocation,
    messages,
    ui: {
      decorationState,
      effectiveLength,
    },
  }
}
