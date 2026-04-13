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
  const reposicionUnit = prices.REPOSICION_PRICES?.[reposicionType] || 0
  const reposicionTotal = reposicionUnit * reposicionQty

  return (
    <section className="section-block">
      <h2>
        <span>04</span> Servicios Complementarios
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
            <label className="retiro-option-simple">
              <input
                type="radio"
                name="retiro-type"
                checked={retiroType === 'acrilico'}
                onChange={() => onRetiroTypeChange('acrilico')}
                onClick={(event) => {
                  if (retiroType === 'acrilico') {
                    event.preventDefault()
                    onRetiroTypeChange('none')
                  }
                }}
              />
              <span>Acrilico</span>
              <strong>{formatCurrency(prices.RETIRO_PRICES?.acrilico || 0)}</strong>
            </label>

            <label className="retiro-option-simple">
              <input
                type="radio"
                name="retiro-type"
                checked={retiroType === 'gel'}
                onChange={() => onRetiroTypeChange('gel')}
                onClick={(event) => {
                  if (retiroType === 'gel') {
                    event.preventDefault()
                    onRetiroTypeChange('none')
                  }
                }}
              />
              <span>Gel semipermanente</span>
              <strong>{formatCurrency(prices.RETIRO_PRICES?.gel || 0)}</strong>
            </label>
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
                <button
                  type="button"
                  className={reposicionType === 'acrilico' ? 'reposicion-tab active' : 'reposicion-tab'}
                  onClick={() => onReposicionTypeChange('acrilico')}
                >
                  Acrilico ({formatCurrency(prices.REPOSICION_PRICES?.acrilico || 0)})
                </button>
                <button
                  type="button"
                  className={reposicionType === 'polygel' ? 'reposicion-tab active' : 'reposicion-tab'}
                  onClick={() => onReposicionTypeChange('polygel')}
                >
                  Polygel ({formatCurrency(prices.REPOSICION_PRICES?.polygel || 0)})
                </button>
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
