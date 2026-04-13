export function TechnicalMasterySection({
  techniqueKind,
  techniqueName,
  noLengthTechniques,
  withLengthTechniques,
  priceTables,
  lengthLevels,
  lengthLevel,
  onTechniquePick,
  onLengthPick,
  formatCurrency,
}) {
  const hasOverflowNoLength = noLengthTechniques.length > 5
  const hasOverflowWithLength = withLengthTechniques.length > 5
  const minLength = lengthLevels[0] || 1
  const maxLength = lengthLevels[lengthLevels.length - 1] || 6

  const mobileNoLengthValue =
    techniqueKind === 'no-length'
      ? techniqueName
      : (noLengthTechniques[0] && noLengthTechniques[0].name) || ''

  const mobileWithLengthValue =
    techniqueKind === 'with-length'
      ? techniqueName
      : (withLengthTechniques[0] && withLengthTechniques[0].name) || ''

  return (
    <section className="section-block">
      <h2>
        <span>01</span> Técnicas
      </h2>

      <div className="service-grid">
        <article className="service-column">
          <p className="group-title">Basico y especiales sin largo</p>
          <div className="mobile-technique-select-wrap">
            <select
              className="mobile-technique-select"
              value={mobileNoLengthValue}
              onChange={(event) => onTechniquePick('no-length', event.target.value)}
            >
              {noLengthTechniques.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name} - {formatCurrency(priceTables.PRICES_NO_LENGTH[item.name] || 0)}
                </option>
              ))}
            </select>
          </div>

          <div className="cards-grid cards-grid-limited desktop-technique-list">
            {noLengthTechniques.map((item) => (
              <button
                key={item.id}
                className={
                  techniqueKind === 'no-length' && techniqueName === item.name
                    ? 'service-card service-card-compact active'
                    : 'service-card service-card-compact'
                }
                onClick={() => onTechniquePick('no-length', item.name)}
              >
                <strong>{item.name}</strong>
                <small>{formatCurrency(priceTables.PRICES_NO_LENGTH[item.name] || 0)}</small>
              </button>
            ))}
          </div>
          {hasOverflowNoLength ? <p className="scroll-hint">Desliza para ver mas opciones</p> : null}
        </article>

        <article className="service-column">
          <p className="group-title">Especiales con largo y mantenimiento</p>
          <div className="mobile-technique-select-wrap">
            <select
              className="mobile-technique-select"
              value={mobileWithLengthValue}
              onChange={(event) => onTechniquePick('with-length', event.target.value)}
            >
              {withLengthTechniques.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name} - Desde {formatCurrency(priceTables.PRICES_WITH_LENGTH[item.name]?.[1] || 0)}
                </option>
              ))}
            </select>
          </div>

          <div className="cards-grid cards-grid-limited desktop-technique-list">
            {withLengthTechniques.map((item) => (
              <button
                key={item.id}
                className={
                  techniqueKind === 'with-length' && techniqueName === item.name
                    ? 'service-card service-card-compact active alt'
                    : 'service-card service-card-compact alt'
                }
                onClick={() => onTechniquePick('with-length', item.name)}
              >
                <strong>{item.name}</strong>
                <small>Desde {formatCurrency(priceTables.PRICES_WITH_LENGTH[item.name]?.[1] || 0)}</small>
              </button>
            ))}
          </div>
          {hasOverflowWithLength ? <p className="scroll-hint">Desliza para ver mas opciones</p> : null}
        </article>
      </div>

      <div className="length-picker">
        <div>
          <strong>Seleccionar Largo</strong>
          <p>Precision arquitectonica del nivel 1 al 6</p>
        </div>
        <div className="levels desktop-length-levels">
          {lengthLevels.map((item) => (
            <button
              key={item}
              onClick={() => onLengthPick(item)}
              className={lengthLevel === item ? 'level active' : 'level'}
              disabled={techniqueKind === 'no-length'}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mobile-length-range-wrap">
          <input
            type="range"
            min={minLength}
            max={maxLength}
            step="1"
            value={lengthLevel}
            className="mobile-length-range"
            onChange={(event) => onLengthPick(Number(event.target.value))}
            disabled={techniqueKind === 'no-length'}
            aria-label="Seleccionar nivel de largo"
          />
          <div className="mobile-length-scale" aria-hidden="true">
            {lengthLevels.map((item) => (
              <span key={item} className={item === lengthLevel ? 'active' : ''}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
