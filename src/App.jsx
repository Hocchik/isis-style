import { useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  DECORATION_OPTIONS,
  FULL_DESIGN_OPTIONS,
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

const INITIAL_ESTIMATE_STATE = {
  techniqueKind: 'with-length',
  techniqueName: 'Acrilico',
  lengthLevel: 3,
  decorationCounts: {
    ...DEFAULT_DECORATION_COUNTS,
    Espejo: 0,
    Aurora: 0,
    Azucar: 0,
  },
  selectionOrder: ['Espejo', 'Azucar'],
  changeShape: false,
  retiroType: 'none',
  reposicionType: 'acrilico',
  reposicionQty: 0,
}

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

  useEffect(() => {
    const saved = loadEstimateDraft()
    if (!saved) return

    setTechniqueKind(saved.techniqueKind || 'with-length')
    setTechniqueName(saved.techniqueName || 'Acrilico')
    setLengthLevel(Number.isInteger(saved.length) ? saved.length : 3)
    setDecorationCounts({ ...DEFAULT_DECORATION_COUNTS, ...(saved.decorationCounts || {}) })
    setSelectionOrder(Array.isArray(saved.selectionOrder) ? saved.selectionOrder : [])
    setChangeShape(Boolean(saved.changeShape))
    setRetiroType(saved.retiroType || 'none')
    setReposicionType(saved.reposicionType || 'acrilico')
    setReposicionQty(Number.isInteger(saved.reposicionQty) ? saved.reposicionQty : 0)
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
    ],
  )

  useEffect(() => {
    saveEstimateDraft(estimateInputs)
  }, [estimateInputs])

  const estimate = useMemo(
    () => calculateEstimateWithHandlers(estimateInputs, PRICE_TABLES),
    [estimateInputs],
  )

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
  }

  return (
    <div className="pricing-page">
      <main className="content-column">
        <header className="hero">
          <p className="eyebrow">Experiencia Interactiva</p>
          <h1>
            Isis Styles
            <span>Asistente de Precios</span>
          </h1>
          <p className="lead">
            Elige tecnicas,
            disenos y cuidados complementarios para obtener una estimacion
            de tu servicio.
          </p>
        </header>

        <TechnicalMasterySection
          techniqueKind={techniqueKind}
          techniqueName={techniqueName}
          noLengthTechniques={NO_LENGTH_TECHNIQUES}
          withLengthTechniques={WITH_LENGTH_TECHNIQUES}
          maintenanceTechniques={MANTENIMIENTOS_TECHNIQUES}
          priceTables={PRICE_TABLES}
          lengthLevels={LENGTH_LEVELS}
          lengthLevel={lengthLevel}
          onTechniquePick={handleTechniquePick}
          onLengthPick={setLengthLevel}
          formatCurrency={formatCurrency}
        />

        <ArtistryDesignSection
          simpleDecorationOptions={SIMPLE_DECORATION_OPTIONS}
          fullDesignOptions={FULL_DESIGN_OPTIONS}
          decorationCounts={decorationCounts}
          decorationState={estimate.ui.decorationState}
          decorationPrices={PRICE_TABLES.DECORATION_PRICES}
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

      <SummarySelectionSection estimate={estimate} onReset={resetEstimateToInitial} />
    </div>
  )
}

export default App
