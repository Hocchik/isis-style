import { useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  DECORATION_OPTIONS,
  FULL_DESIGN_OPTIONS,
  INCLUDED_DECORATION_OPTIONS,
  MANTENIMIENTOS_TECHNIQUES,
  NO_LENGTH_TECHNIQUES,
  PRICE_TABLES,
  SIMPLE_DECORATION_OPTIONS,
  WITH_LENGTH_TECHNIQUES,
} from './config/pricing'
import {
  calculateEstimateWithHandlers,
  formatCurrency,
  loadEstimateDraft,
  saveEstimateDraft,
} from './domain/estimateHandlers'
import { TechnicalMasterySection } from './components/TechnicalMasterySection'
import { ArtistryDesignSection } from './components/ArtistryDesignSection'
import { ComplementaryCareSection } from './components/ComplementaryCareSection'
import { SummarySelectionSection } from './components/SummarySelectionSection'

const LENGTH_LEVELS = [1, 2, 3, 4, 5, 6]

const DEFAULT_DECORATION_COUNTS = Object.fromEntries(
  DECORATION_OPTIONS.map((item) => [item.name, 0]),
)

const DISPLAY_NAME_NORMALIZATION = {
  Acrilico: 'Acrílico',
  'Kapping de acrilico': 'Kapping de acrílico',
  'Tecnica Hibrida': 'Técnica híbrida',
  'Mantenimiento de Acrilico': 'Mantenimiento de Acrílico',
  'Mantenimiento de Rubber gel': 'Mantenimiento de Rubber Gel',
  'Mantenimiento de Builder gel': 'Mantenimiento de Builder Gel',
  'Esculpidas en acrilico': 'Esculpidas en acrílico',
  'Efecto Azucar': 'Efecto Azúcar',
  Marmol: 'Mármol',
  'Diseno de piedras': 'Diseño de piedras',
  'Diseno de piedras elaborado': 'Diseño de piedras elaborado',
  'Diseno completo Ojo de gato': 'Diseño completo Ojo de gato',
  'Diseno completo de francesas': 'Diseño completo de francesas',
  'Diseno completo de color entero': 'Diseño completo de color entero',
  'Retiro Acrilico': 'Retiro Acrílico',
  'Reposicion Acrilico': 'Reposición Acrílico',
  'Reposicion Polygel': 'Reposición Polygel',
  'Reposicion Builder Gel': 'Reposición Builder Gel',
}

function normalizeDisplayName(value) {
  if (typeof value !== 'string') return value
  return DISPLAY_NAME_NORMALIZATION[value] || value
}

function normalizeDecorationCounts(rawCounts) {
  if (rawCounts === null || typeof rawCounts !== 'object' || Array.isArray(rawCounts)) return {}

  return Object.entries(rawCounts).reduce((accumulator, [name, value]) => {
    const normalizedName = normalizeDisplayName(name)
    const numericValue = Number(value)
    accumulator[normalizedName] = (accumulator[normalizedName] || 0) + (Number.isFinite(numericValue) ? numericValue : 0)
    return accumulator
  }, {})
}

function normalizeSelectionOrder(rawOrder) {
  if (!Array.isArray(rawOrder)) return []

  const knownNames = new Set(Object.keys(DEFAULT_DECORATION_COUNTS))
  const dedup = new Set()

  return rawOrder
    .map(normalizeDisplayName)
    .filter((name) => knownNames.has(name))
    .filter((name) => {
      if (dedup.has(name)) return false
      dedup.add(name)
      return true
    })
}

const INITIAL_ESTIMATE_STATE = {
  techniqueKind: 'with-length',
  techniqueName: 'Acrílico',
  lengthLevel: 3,
  decorationCounts: {
    ...DEFAULT_DECORATION_COUNTS,
    Espejo: 0,
    Aurora: 0,
    'Azúcar': 0,
  },
  selectionOrder: ['Espejo', 'Azúcar'],
  changeShape: false,
  retiroType: 'none',
  reposicionType: 'acrilico',
  reposicionQty: 0,
}

const PIES_TECHNIQUES = NO_LENGTH_TECHNIQUES.filter((t) => t.name.includes('(Pies)'))
const MANOS_NO_LENGTH_TECHNIQUES = NO_LENGTH_TECHNIQUES.filter((t) => !t.name.includes('(Pies)'))

function App() {
  const [techniqueKind, setTechniqueKind] = useState(INITIAL_ESTIMATE_STATE.techniqueKind)
  const [techniqueName, setTechniqueName] = useState(INITIAL_ESTIMATE_STATE.techniqueName)
  const [lengthLevel, setLengthLevel] = useState(INITIAL_ESTIMATE_STATE.lengthLevel)
  const [decorationCounts, setDecorationCounts] = useState(INITIAL_ESTIMATE_STATE.decorationCounts)
  const [selectionOrder, setSelectionOrder] = useState(INITIAL_ESTIMATE_STATE.selectionOrder)
  const [changeShape, setChangeShape] = useState(INITIAL_ESTIMATE_STATE.changeShape)
  const [retiroType, setRetiroType] = useState(INITIAL_ESTIMATE_STATE.retiroType)
  const [reposicionType, setReposicionType] = useState(INITIAL_ESTIMATE_STATE.reposicionType)
  const [reposicionQty, setReposicionQty] = useState(INITIAL_ESTIMATE_STATE.reposicionQty)
  const [piesTechniqueName, setPiesTechniqueName] = useState('')

  useEffect(() => {
    const saved = loadEstimateDraft()
    if (!saved) return

    setTechniqueKind(saved.techniqueKind || 'with-length')
    setTechniqueName(normalizeDisplayName(saved.techniqueName || 'Acrílico'))
    setLengthLevel(Number.isInteger(saved.length) ? saved.length : 3)
    setDecorationCounts({ ...DEFAULT_DECORATION_COUNTS, ...normalizeDecorationCounts(saved.decorationCounts || {}) })
    setSelectionOrder(normalizeSelectionOrder(saved.selectionOrder))
    setChangeShape(Boolean(saved.changeShape))
    setRetiroType(saved.retiroType || 'none')
    setReposicionType(saved.reposicionType || 'acrilico')
    setReposicionQty(Number.isInteger(saved.reposicionQty) ? saved.reposicionQty : 0)
    setPiesTechniqueName(saved.piesTechniqueName || '')
  }, [])

  const estimateInputs = useMemo(
    () => ({
      techniqueKind,
      techniqueName,
      length: lengthLevel,
      decorationCounts,
      selectionOrder,
      changeShape,
      retiroType,
      reposicionType,
      reposicionQty,
      piesTechniqueName,
    }),
    [
      changeShape,
      decorationCounts,
      lengthLevel,
      reposicionType,
      reposicionQty,
      retiroType,
      selectionOrder,
      techniqueKind,
      techniqueName,
      piesTechniqueName,
    ],
  )

  useEffect(() => {
    saveEstimateDraft(estimateInputs)
  }, [estimateInputs])

  const estimate = useMemo(
    () => calculateEstimateWithHandlers(estimateInputs, PRICE_TABLES),
    [estimateInputs],
  )

  const piesPrice = piesTechniqueName ? (PRICE_TABLES.PRICES_NO_LENGTH[piesTechniqueName] || 0) : 0

  const estimateWithPies = useMemo(() => {
    if (!piesTechniqueName || piesPrice === 0) return estimate
    const piesItem = {
      name: `Técnica Pies: ${piesTechniqueName}`,
      unitPrice: piesPrice,
      qty: 1,
      freeQty: 0,
      chargedQty: 1,
      lineTotal: piesPrice,
      formattedLineTotal: formatCurrency(piesPrice),
      formattedUnitPrice: formatCurrency(piesPrice),
      badge: null,
      isDisabled: false,
    }
    const piesItemWithCategory = { ...piesItem, category: 'pies' }
    return {
      ...estimate,
      items: [piesItemWithCategory, ...estimate.items],
      total: estimate.total + piesPrice,
      subtotal: estimate.subtotal + piesPrice,
      formattedTotal: formatCurrency(estimate.total + piesPrice),
      formattedSubtotal: formatCurrency(estimate.subtotal + piesPrice),
    }
  }, [estimate, piesTechniqueName, piesPrice])

  function handleTechniquePick(kind, name) {
    setTechniqueKind(kind)
    setTechniqueName(name)
  }

  function updateDecorationQty(name, delta) {
    setDecorationCounts((prev) => {
      const currentQty = prev[name] || 0
      const nextQty = Math.max(0, currentQty + delta)
      return { ...prev, [name]: nextQty }
    })

    if (delta > 0) {
      setSelectionOrder((prev) => (prev.includes(name) ? prev : [...prev, name]))
    }
  }

  function setFullDesignSelected(name, isSelected) {
    setDecorationCounts((prev) => ({
      ...prev,
      [name]: isSelected ? 1 : 0,
    }))

    if (isSelected) {
      setSelectionOrder((prev) => (prev.includes(name) ? prev : [...prev, name]))
    }
  }

  function setIncludedSelected(name, isSelected) {
    setDecorationCounts((prev) => ({
      ...prev,
      [name]: isSelected ? 1 : 0,
    }))

    if (isSelected) {
      setSelectionOrder((prev) => (prev.includes(name) ? prev : [...prev, name]))
    }
  }

  function resetEstimateToInitial() {
    setTechniqueKind(INITIAL_ESTIMATE_STATE.techniqueKind)
    setTechniqueName(INITIAL_ESTIMATE_STATE.techniqueName)
    setLengthLevel(INITIAL_ESTIMATE_STATE.lengthLevel)
    setDecorationCounts({ ...INITIAL_ESTIMATE_STATE.decorationCounts })
    setSelectionOrder([...INITIAL_ESTIMATE_STATE.selectionOrder])
    setChangeShape(INITIAL_ESTIMATE_STATE.changeShape)
    setRetiroType(INITIAL_ESTIMATE_STATE.retiroType)
    setReposicionType(INITIAL_ESTIMATE_STATE.reposicionType)
    setReposicionQty(INITIAL_ESTIMATE_STATE.reposicionQty)
    setPiesTechniqueName('')
  }

  return (
    <div className="pricing-page">
      <main className="content-column">
        <header className="hero">
          <div className="hero-text">
            <p className="eyebrow">Experiencia Interactiva</p>
            <h1>
              Isis Styles
              <span>Asistente de Precios</span>
            </h1>
            <p className="lead">
              Elige técnicas,
              diseños y cuidados complementarios para obtener una estimación
              de tu servicio.
            </p>
          </div>
          <img className="hero-logo" src="/isis-logo-icon.png" alt="Isis Styles" />
        </header>

        <TechnicalMasterySection
          techniqueKind={techniqueKind}
          techniqueName={techniqueName}
          noLengthTechniques={MANOS_NO_LENGTH_TECHNIQUES}
          withLengthTechniques={WITH_LENGTH_TECHNIQUES}
          maintenanceTechniques={MANTENIMIENTOS_TECHNIQUES}
          priceTables={PRICE_TABLES}
          lengthLevels={LENGTH_LEVELS}
          lengthLevel={lengthLevel}
          onTechniquePick={handleTechniquePick}
          onLengthPick={setLengthLevel}
          formatCurrency={formatCurrency}
          piesTechniques={PIES_TECHNIQUES}
          piesTechniqueName={piesTechniqueName}
          onPiesTechniquePick={setPiesTechniqueName}
        />

        <ArtistryDesignSection
          includedDecorationOptions={INCLUDED_DECORATION_OPTIONS}
          simpleDecorationOptions={SIMPLE_DECORATION_OPTIONS}
          fullDesignOptions={FULL_DESIGN_OPTIONS}
          decorationCounts={decorationCounts}
          decorationState={estimate.ui.decorationState}
          decorationPrices={PRICE_TABLES.DECORATION_PRICES}
          isIncludedDisabled={techniqueKind === 'maintenance'}
          onSetIncludedSelected={setIncludedSelected}
          onUpdateDecorationQty={updateDecorationQty}
          onSetFullDesignSelected={setFullDesignSelected}
          formatCurrency={formatCurrency}
        />

        <ComplementaryCareSection
          changeShape={changeShape}
          onToggleChangeShape={() => setChangeShape((prev) => !prev)}
          retiroType={retiroType}
          onRetiroTypeChange={setRetiroType}
          reposicionType={reposicionType}
          onReposicionTypeChange={setReposicionType}
          reposicionQty={reposicionQty}
          onReposicionQtyChange={setReposicionQty}
          prices={PRICE_TABLES}
          formatCurrency={formatCurrency}
        />
      </main>

      <SummarySelectionSection
        estimate={estimateWithPies}
        onReset={resetEstimateToInitial}
        onUpdateDecorationQty={updateDecorationQty}
        onSetFullDesignSelected={setFullDesignSelected}
        onSetIncludedSelected={setIncludedSelected}
        onToggleChangeShape={() => setChangeShape(false)}
        onRetiroTypeChange={setRetiroType}
        onReposicionQtyChange={setReposicionQty}
        onPiesTechniquePick={setPiesTechniqueName}
      />
    </div>
  )
}

export default App
