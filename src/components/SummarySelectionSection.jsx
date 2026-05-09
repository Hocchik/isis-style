import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'

function isIOS() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

export function SummarySelectionSection({ estimate, onReset }) {
  const exportRef = useRef(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState('')
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [iosPreviewUrl, setIosPreviewUrl] = useState(null)

  async function handleExportJpg() {
    if (!exportRef.current || isExporting) return

    setIsExporting(true)
    setExportError('')

    try {
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        backgroundColor: '#f5f4f1',
        useCORS: true,
        logging: false,
      })

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95)

      if (isIOS()) {
        setIosPreviewUrl(dataUrl)
        return
      }

      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `resumen-precios-${Date.now()}.jpg`
      link.click()
    } catch {
      setExportError('No se pudo exportar la imagen. Inténtalo nuevamente.')
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
            x
          </button>
        </div>

        <ul>
          {estimate.items.map((item, index) => (
            <li key={`${item.name}-${index}`}>
              <span>
                {item.name} {item.badge ? `(${item.badge})` : ''}
              </span>
              <strong>{item.formattedLineTotal}</strong>
            </li>
          ))}
        </ul>

        <div className="summary-total">
          <p>Total estimado</p>
          <strong>{estimate.formattedTotal}</strong>
        </div>

        <div className="summary-actions">
          <button className="cta" onClick={handleExportJpg} disabled={isExporting}>
            {isExporting ? 'Exportando...' : 'Exportar JPG'}
          </button>
          <button className="cta cta-secondary" onClick={onReset}>
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

      {iosPreviewUrl ? (
        <div
          className="image-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Guardar imagen"
          onClick={(e) => { if (e.target === e.currentTarget) setIosPreviewUrl(null) }}
        >
          <div className="image-modal-content">
            <button className="image-modal-close" onClick={() => setIosPreviewUrl(null)} aria-label="Cerrar">×</button>
            <img src={iosPreviewUrl} alt="Resumen de precios" />
            <p className="image-modal-caption ios-save-hint">
              Mantén presionada la imagen y elige <strong>"Guardar imagen"</strong>
            </p>
          </div>
        </div>
      ) : null}

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

        <small>Plantilla editable para exportación JPG.</small>
      </div>
    </aside>
  )
}
