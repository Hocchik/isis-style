import { calculateEstimate } from './calculateEstimate'

export const ESTIMATE_STORAGE_KEY = 'isis-estimate-draft'
export const ESTIMATE_STORAGE_VERSION = 1

export function formatCurrency(amount, currency = 'PEN', locale = 'es-PE') {
  const numeric = Number(amount)
  const safeAmount = Number.isFinite(numeric) ? numeric : 0

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeAmount)
}

export function calculateEstimateWithHandlers(inputs, priceTables, options = {}) {
  const estimate = calculateEstimate(inputs, priceTables)
  const logger = options.logger

  if (typeof logger === 'function') {
    estimate.messages
      .filter((message) => message.type === 'warning')
      .forEach((message) => logger(message.message))
  }

  return {
    ...estimate,
    items: estimate.items.map((item) => ({
      ...item,
      formattedUnitPrice: formatCurrency(item.unitPrice),
      formattedLineTotal: formatCurrency(item.lineTotal),
    })),
    formattedSubtotal: formatCurrency(estimate.subtotal),
    formattedTotal: formatCurrency(estimate.total),
  }
}

export function saveEstimateDraft(payload, storage = window.localStorage) {
  if (!storage) return

  const envelope = {
    version: ESTIMATE_STORAGE_VERSION,
    savedAt: new Date().toISOString(),
    payload,
  }

  storage.setItem(ESTIMATE_STORAGE_KEY, JSON.stringify(envelope))
}

export function loadEstimateDraft(storage = window.localStorage) {
  if (!storage) return null

  const raw = storage.getItem(ESTIMATE_STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    if (!parsed || parsed.version !== ESTIMATE_STORAGE_VERSION) return null
    return parsed.payload || null
  } catch {
    return null
  }
}
