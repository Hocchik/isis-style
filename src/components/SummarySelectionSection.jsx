import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'

const WHATSAPP_URL = `https://wa.me/51942782899?text=${encodeURIComponent('Hola! 💅 Te comparto mi resumen de selección de Isis Styles.')}`

function getItemCategory(item) {
  const name = item.name
  if (item.category) return item.category
  if (name.startsWith('Técnica Pies:')) return 'pies'
  if (name.startsWith('Técnica') || name.startsWith('Mantenimiento:')) return 'technique'
  if (name === 'Cambio de forma') return 'change-shape'
  if (name.startsWith('Retiro')) return 'retiro'
  if (name.startsWith('Reposición')) return 'reposicion'
  if (item.freeQty > 0) return 'decoration-included'
  if (name.startsWith('Diseño')) return 'decoration-full'
  return 'decoration-simple'
}

export function SummarySelectionSection({
  estimate,
  onReset,
  onUpdateDecorationQty,
  onSetFullDesignSelected,
  onSetIncludedSelected,
  onToggleChangeShape,
  onRetiroTypeChange,
  onReposicionQtyChange,
  onPiesTechniquePick,
}) {
  const exportRef = useRef(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState('')
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  async function handleExport() {
    if (!exportRef.current || isExporting) return

    setIsExporting(true)
    setExportError('')

    try {
      const canvas = await Promise.race([
        html2canvas(exportRef.current, {
          scale: 2,
          backgroundColor: '#f5f4f1',
          useCORS: true,
          logging: false,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 8000),
        ),
      ])

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
      const file = new File([blob], 'resumen-isis-styles.png', { type: 'image/png' })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Resumen Isis Styles' })
      } else {
        const objUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = objUrl
        link.download = 'resumen-isis-styles.png'
        link.click()
        setTimeout(() => URL.revokeObjectURL(objUrl), 1000)
      }
    } catch (err) {
      if (err?.name === 'AbortError') return
      const msg = err?.message === 'timeout'
        ? 'Tardó demasiado. Inténtalo nuevamente.'
        : 'No se pudo generar la imagen. Inténtalo nuevamente.'
      setExportError(msg)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <aside className={isMobileOpen ? 'summary-column mobile-open' : 'summary-column'}>
      <button
        type="button"
        className="summary-mobile-trigger"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Ver resumen y opciones"
      >
        <span className="fab-label">Ver resumen</span>
        <span className="fab-total">{estimate.formattedTotal}</span>
      </button>

      <button
        type="button"
        className="summary-mobile-overlay"
        onClick={() => setIsMobileOpen(false)}
        aria-label="Cerrar panel de resumen"
      />

      <div className="summary-sticky">
        <div className="summary-head-row">
          <div>
            <h2>Tu selección</h2>
            <p className="summary-subtitle">Isis Styles</p>
          </div>
          <button
            type="button"
            className="summary-mobile-close"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <ul>
          {estimate.items.map((item, index) => {
            const category = getItemCategory(item)
            const isTechnique = category === 'technique'

            let controls = null
            if (category === 'pies') {
              controls = (
                <button
                  type="button"
                  className="summary-item-remove"
                  onClick={() => onPiesTechniquePick('')}
                  aria-label="Quitar servicio de pies"
                >×</button>
              )
            } else if (category === 'change-shape') {
              controls = (
                <button
                  type="button"
                  className="summary-item-remove"
                  onClick={onToggleChangeShape}
                  aria-label="Quitar cambio de forma"
                >×</button>
              )
            } else if (category === 'retiro') {
              controls = (
                <button
                  type="button"
                  className="summary-item-remove"
                  onClick={() => onRetiroTypeChange('none')}
                  aria-label="Quitar retiro"
                >×</button>
              )
            } else if (category === 'reposicion') {
              controls = (
                <div className="summary-item-qty-control">
                  <button
                    type="button"
                    onClick={() => onReposicionQtyChange(Math.max(0, item.qty - 1))}
                    disabled={item.qty <= 1}
                  >−</button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => onReposicionQtyChange(item.qty + 1)}>+</button>
                </div>
              )
            } else if (category === 'decoration-included') {
              controls = (
                <button
                  type="button"
                  className="summary-item-remove"
                  onClick={() => onSetIncludedSelected(item.name, false)}
                  aria-label={`Quitar ${item.name}`}
                >×</button>
              )
            } else if (category === 'decoration-full') {
              controls = (
                <button
                  type="button"
                  className="summary-item-remove"
                  onClick={() => onSetFullDesignSelected(item.name, false)}
                  aria-label={`Quitar ${item.name}`}
                >×</button>
              )
            } else if (category === 'decoration-simple') {
              controls = (
                <div className="summary-item-qty-control">
                  <button
                    type="button"
                    onClick={() => onUpdateDecorationQty(item.name, -1)}
                    disabled={item.qty <= 0}
                  >−</button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => onUpdateDecorationQty(item.name, 1)}>+</button>
                </div>
              )
            }

            return (
              <li key={`${item.name}-${index}`}>
                <span>
                  {item.name} {item.badge ? `(${item.badge})` : ''}
                </span>
                <div className="summary-item-actions">
                  {!isTechnique && controls}
                  <strong>{item.formattedLineTotal}</strong>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="summary-total">
          <p>Total estimado</p>
          <strong>{estimate.formattedTotal}</strong>
        </div>

        <div className="summary-actions">
          <a
            className="cta cta-whatsapp"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 Enviar por WhatsApp
          </a>
          <button className="cta cta-secondary" onClick={handleExport} disabled={isExporting}>
            {isExporting ? 'Generando...' : '📤 Compartir imagen'}
          </button>
          <button className="cta cta-tertiary" onClick={onReset}>
            Limpiar
          </button>
        </div>

        <small>Precio final sujeto a evaluación presencial.</small>

        {exportError ? <small className="validation-text">{exportError}</small> : null}

        {estimate.messages.length > 0 ? (
          <small className="validation-text">
            {estimate.messages.map((item) => item.message).join(' ')}
          </small>
        ) : null}
      </div>

      <div className="export-jpg-template" ref={exportRef} aria-hidden="true">
        <p className="export-brand">Isis Styles - Asistente de Precios</p>
        <h3>Resumen de selección</h3>

        <ul>
          {estimate.items.map((item, index) => (
            <li key={`export-${item.name}-${index}`}>
              <span>{item.name}</span>
              <strong>{item.formattedLineTotal}</strong>
            </li>
          ))}
        </ul>

        <div className="export-total">
          <span>Total estimado</span>
          <strong>{estimate.formattedTotal}</strong>
        </div>

        <small>Precio final sujeto a evaluación presencial.</small>
      </div>
    </aside>
  )
}
