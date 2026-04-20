export function ComplementaryCareSection({
  changeShape,
  onToggleChangeShape,
  retiroType,
  onRetiroTypeChange,
  reposicionType,
  onReposicionTypeChange,
  reposicionQty,
  onReposicionQtyChange,
  prices,
  formatCurrency,
}) {
  const retiroLabelByType = {
    acrilico: 'Acrilico',
    gel: 'Gel',
    'gel-semipermanente': 'Gel semipermanente',
  }
  const retiroOrder = ['acrilico', 'gel', 'gel-semipermanente']
  const retiroOptions = Object.entries(prices.RETIRO_PRICES || {})
    .filter(([type]) => type !== 'none')
    .sort(([left], [right]) => {
      const leftIndex = retiroOrder.indexOf(left)
      const rightIndex = retiroOrder.indexOf(right)
      const safeLeft = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex
      const safeRight = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex
      return safeLeft - safeRight
    })

  const reposicionLabelByType = {
    acrilico: 'Acrilico',
    polygel: 'Polygel',
    'builder-gel': 'Builder Gel',
  }
  const reposicionOrder = ['acrilico', 'polygel', 'builder-gel']
  const reposicionOptions = Object.entries(prices.REPOSICION_PRICES || {})
    .filter(([type]) => type !== 'none')
    .sort(([left], [right]) => {
      const leftIndex = reposicionOrder.indexOf(left)
      const rightIndex = reposicionOrder.indexOf(right)
      const safeLeft = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex
      const safeRight = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex
      return safeLeft - safeRight
    })

  const reposicionUnit = prices.REPOSICION_PRICES?.[reposicionType] || 0
  const reposicionTotal = reposicionUnit * reposicionQty

  return (
    <section className="section-block">
      <h2>
        <span>03</span> Servicios Complementarios
      </h2>
      <div className="care-layout">
        <article className={changeShape ? 'care-panel active' : 'care-panel'}>
          <div className="care-panel-head">
            <h3>Cambio de forma</h3>
            <strong>{formatCurrency(prices.CHANGE_SHAPE_PRICE)}</strong>
          </div>
          <p>Transicion entre perfiles almendra, coffin o cuadrado.</p>

          <button
            type="button"
            className={changeShape ? 'shape-toggle active' : 'shape-toggle'}
            onClick={onToggleChangeShape}
          >
            {changeShape ? 'Seleccionado' : 'Seleccionar cambio'}
          </button>
        </article>

        <article className="care-panel">
          <div className="care-panel-head">
            <h3>Retiros</h3>
          </div>
          <p>Remocion profesional para mantener la placa natural.</p>

          <div className="retiro-options" role="radiogroup" aria-label="Tipo de retiro">
            {retiroOptions.map(([type, price]) => (
              <label key={type} className="retiro-option-simple">
                <input
                  type="radio"
                  name="retiro-type"
                  checked={retiroType === type}
                  onChange={() => onRetiroTypeChange(type)}
                  onClick={() => {
                    if (retiroType === type) {
                      onRetiroTypeChange('none')
                    }
                  }}
                />
                <span>{retiroLabelByType[type] || type}</span>
                <strong>{formatCurrency(price || 0)}</strong>
              </label>
            ))}
          </div>

          <small className="retiro-state">
            {retiroType === 'none' ? 'Sin retiro seleccionado.' : 'Retiro seleccionado.'}
          </small>
        </article>

        <article className="care-panel reposicion-panel">
          <div className="reposicion-grid">
            <div className="reposicion-info">
              <div className="care-panel-head reposicion-head">
                <h3>Reposiciones</h3>
              </div>
              <p>Reparacion por una para unidades que requieren reconstruccion.</p>
            </div>

            <div className="reposicion-controls">
              <div className="reposicion-tabs">
                {reposicionOptions.map(([type, price]) => (
                  <button
                    key={type}
                    type="button"
                    className={reposicionType === type ? 'reposicion-tab active' : 'reposicion-tab'}
                    onClick={() => onReposicionTypeChange(type)}
                  >
                    {reposicionLabelByType[type] || type} ({formatCurrency(price || 0)})
                  </button>
                ))}
              </div>

              <div className="reposicion-action-row">
                <div className="reposicion-qty-row">
                  <button
                    type="button"
                    onClick={() => onReposicionQtyChange(Math.max(0, reposicionQty - 1))}
                    disabled={reposicionQty <= 0}
                  >
                    -
                  </button>
                  <strong>{reposicionQty}</strong>
                  <button type="button" onClick={() => onReposicionQtyChange(reposicionQty + 1)}>
                    +
                  </button>
                </div>
                <strong className="reposicion-total">{formatCurrency(reposicionTotal)}</strong>
              </div>

              <small>Precio por una segun material seleccionado.</small>

            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
