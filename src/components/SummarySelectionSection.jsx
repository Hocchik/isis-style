import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

function isIOS() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

function openPdfOnIOS(canvas) {
  const imgData = canvas.toDataURL('image/png')
  const pdfWidthMm = 210
  const pdfHeightMm = Math.round((canvas.height * pdfWidthMm) / canvas.width)

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pdfWidthMm, pdfHeightMm] })
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidthMm, pdfHeightMm)

  const blob = pdf.output('blob')
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}

export function SummarySelectionSection({ estimate, onReset }) {
  const exportRef = useRef(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState('')
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  async function handleExport() {
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

      if (isIOS()) {
        // Intentar Web Share API con PNG (abre el sheet nativo: WhatsApp, Fotos, etc.)
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
        const file = new File([blob], 'resumen-isis-styles.png', { type: 'image/png' })

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: 'Resumen de precios — Isis Styles' })
          return
        }

        // Fallback: abrir PDF en Safari (el usuario puede compartir desde ahí)
        openPdfOnIOS(canvas)
        return
      }

      // Android / PC: descarga directa PNG
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `resumen-isis-styles-${Date.now()}.png`
      link.click()
    } catch (err) {
      if (err?.name !== 'AbortError') {
        setExportError('No se pudo exportar. Inténtalo nuevamente.')
      }
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
          <button className="cta" onClick={handleExport} disabled={isExporting}>
            {isExporting ? 'Generando...' : 'Compartir resumen'}
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
