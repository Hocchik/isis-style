export function ChromaticLayersSection({ extraTones, onChangeExtraTones, tonePrice, formatCurrency }) {
  return (
    <section className="section-block compact">
      <h2>
        <span>03</span> Tonos Extras
      </h2>
      <div className="tone-counter">
        <p>Capas premium para gradientes y efectos complejos</p>
        <div>
          <button onClick={() => onChangeExtraTones(Math.max(0, extraTones - 1))}>-</button>
          <strong>{extraTones}</strong>
          <button onClick={() => onChangeExtraTones(extraTones + 1)}>+</button>
          <small>{formatCurrency(tonePrice)} c/u</small>
        </div>
      </div>
    </section>
  )
}
