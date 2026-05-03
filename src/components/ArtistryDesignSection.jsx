import { useEffect, useRef, useState } from 'react'

export function ArtistryDesignSection({
  includedDecorationOptions,
  simpleDecorationOptions,
  fullDesignOptions,
  decorationCounts,
  decorationState,
  decorationPrices,
  isIncludedDisabled,
  onSetIncludedSelected,
  onUpdateDecorationQty,
  onSetFullDesignSelected,
  formatCurrency,
}) {
  const trackRef = useRef(null)
  const includedTrackRef = useRef(null)
  const fullTrackRef = useRef(null)
  const [canScrollIncludedLeft, setCanScrollIncludedLeft] = useState(false)
  const [canScrollIncludedRight, setCanScrollIncludedRight] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [canScrollFullLeft, setCanScrollFullLeft] = useState(false)
  const [canScrollFullRight, setCanScrollFullRight] = useState(true)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    const track = includedTrackRef.current
    if (!track) return undefined

    function updateScrollState() {
      const maxScroll = track.scrollWidth - track.clientWidth
      const left = track.scrollLeft

      setCanScrollIncludedLeft(left > 4)
      setCanScrollIncludedRight(left < maxScroll - 4)
    }

    updateScrollState()
    track.addEventListener('scroll', updateScrollState)
    window.addEventListener('resize', updateScrollState)

    return () => {
      track.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [includedDecorationOptions.length])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    function updateScrollState() {
      const maxScroll = track.scrollWidth - track.clientWidth
      const left = track.scrollLeft

      setCanScrollLeft(left > 4)
      setCanScrollRight(left < maxScroll - 4)
    }

    updateScrollState()
    track.addEventListener('scroll', updateScrollState)
    window.addEventListener('resize', updateScrollState)

    return () => {
      track.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [simpleDecorationOptions.length])

  useEffect(() => {
    const track = fullTrackRef.current
    if (!track) return undefined

    function updateScrollState() {
      const maxScroll = track.scrollWidth - track.clientWidth
      const left = track.scrollLeft

      setCanScrollFullLeft(left > 4)
      setCanScrollFullRight(left < maxScroll - 4)
    }

    updateScrollState()
    track.addEventListener('scroll', updateScrollState)
    window.addEventListener('resize', updateScrollState)

    return () => {
      track.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [fullDesignOptions.length])

  function scrollTrack(direction) {
    const track = trackRef.current
    if (!track) return

    const firstCard = track.querySelector('.design-card')
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 320
    const step = cardWidth + 14

    track.scrollBy({
      left: direction * step,
      behavior: 'smooth',
    })
  }

  function scrollIncludedTrack(direction) {
    const track = includedTrackRef.current
    if (!track) return

    const firstCard = track.querySelector('.design-card')
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 320
    const step = cardWidth + 14

    track.scrollBy({
      left: direction * step,
      behavior: 'smooth',
    })
  }

  function scrollFullTrack(direction) {
    const track = fullTrackRef.current
    if (!track) return

    const firstCard = track.querySelector('.design-card')
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 320
    const step = cardWidth + 14

    track.scrollBy({
      left: direction * step,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setPreview(null)
    }

    if (preview) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [preview])

  return (
    <>
      <section className="section-block">
        <div className="section-head-with-actions">
          <h2>
            <span>02</span> Decoraciones y diseños
          </h2>
        </div>

        <div className="section-head-with-actions">
          <p className="group-title">Decoraciones incluidas</p>
          <div className="carousel-actions" aria-label="Controles del carrusel de decoraciones incluidas">
            <button
              type="button"
              className="carousel-arrow"
              onClick={() => scrollIncludedTrack(-1)}
              disabled={!canScrollIncludedLeft}
              aria-label="Ver decoraciones incluidas anteriores"
            >
              ←
            </button>
            <button
              type="button"
              className="carousel-arrow"
              onClick={() => scrollIncludedTrack(1)}
              disabled={!canScrollIncludedRight}
              aria-label="Ver decoraciones incluidas siguientes"
            >
              →
            </button>
          </div>
        </div>
        <div className="design-carousel">
          <div className="design-track" ref={includedTrackRef}>
            {includedDecorationOptions.map((item) => {
              const isSelected = (decorationCounts[item.name] || 0) > 0
              const qty = isSelected ? 1 : 0
              const decorationUi = decorationState[item.name] || {
                badge: null,
                isDisabled: false,
              }

              return (
                <article key={item.name} className="design-card">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onClick={() => setPreview({ src: item.image, name: item.name })}
                    style={{ cursor: 'pointer' }}
                  />
                  <div className="design-body">
                    <h3>{item.name}</h3>
                    <p>Incluidos</p>
                    {decorationUi.badge ? (
                      <span className="included-badge">{decorationUi.badge}</span>
                    ) : null}
                    <div className="qty-control">
                      <span>Selección</span>
                      <div>
                        <button
                          onClick={() => onSetIncludedSelected(item.name, false)}
                          disabled={!isSelected || isIncludedDisabled}
                        >
                          -
                        </button>
                        <strong>{qty}</strong>
                        <button
                          onClick={() => onSetIncludedSelected(item.name, true)}
                          disabled={isSelected || decorationUi.isDisabled || isIncludedDisabled}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <div className="section-head-with-actions">
          <p className="group-title">Decoraciones simples (por par)</p>
          <div className="carousel-actions" aria-label="Controles del carrusel de decoraciones simples">
            <button
              type="button"
              className="carousel-arrow"
              onClick={() => scrollTrack(-1)}
              disabled={!canScrollLeft}
              aria-label="Ver decoraciones simples anteriores"
            >
              ←
            </button>
            <button
              type="button"
              className="carousel-arrow"
              onClick={() => scrollTrack(1)}
              disabled={!canScrollRight}
              aria-label="Ver decoraciones simples siguientes"
            >
              →
            </button>
          </div>
        </div>
        <div className="design-carousel">
          <div className="design-track" ref={trackRef}>
            {simpleDecorationOptions.map((item) => {
              const qty = decorationCounts[item.name] || 0
              const decorationUi = decorationState[item.name] || {
                badge: null,
                isDisabled: false,
              }

              return (
                <article key={item.name} className="design-card">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onClick={() => setPreview({ src: item.image, name: item.name })}
                    style={{ cursor: 'pointer' }}
                  />
                  <div className="design-body">
                    <h3>{item.name}</h3>
                    <p>{formatCurrency(decorationPrices[item.name] || 0)} por par</p>
                    <div className="qty-control">
                      <span>Pares</span>
                      <div>
                        <button onClick={() => onUpdateDecorationQty(item.name, -1)} disabled={qty <= 0}>
                          -
                        </button>
                        <strong>{qty}</strong>
                        <button
                          onClick={() => onUpdateDecorationQty(item.name, 1)}
                          disabled={decorationUi.isDisabled}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <div className="section-head-with-actions design-full-head">
          <p className="group-title design-full-title">Diseños completos (precio único)</p>

          <div className="carousel-actions" aria-label="Controles de diseños completos">
            <button
              type="button"
              className="carousel-arrow"
              onClick={() => scrollFullTrack(-1)}
              disabled={!canScrollFullLeft}
              aria-label="Ver diseños completos anteriores"
            >
              ←
            </button>
            <button
              type="button"
              className="carousel-arrow"
              onClick={() => scrollFullTrack(1)}
              disabled={!canScrollFullRight}
              aria-label="Ver diseños completos siguientes"
            >
              →
            </button>
          </div>
        </div>

        <div className="design-carousel">
          <div className="design-track design-full-track" ref={fullTrackRef}>
            {fullDesignOptions.map((item) => {
              const isSelected = (decorationCounts[item.name] || 0) > 0
              const qty = isSelected ? 1 : 0
              const decorationUi = decorationState[item.name] || {
                badge: null,
                isDisabled: false,
              }

              return (
                <article key={item.name} className="design-card">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onClick={() => setPreview({ src: item.image, name: item.name })}
                    style={{ cursor: 'pointer' }}
                  />
                  <div className="design-body">
                    <h3>{item.name}</h3>
                    <p>{formatCurrency(decorationPrices[item.name] || 0)} precio fijo</p>
                    <div className="qty-control">
                      <span>Selección</span>
                      <div>
                        <button
                          onClick={() => onSetFullDesignSelected(item.name, false)}
                          disabled={!isSelected}
                        >
                          -
                        </button>
                        <strong>{qty}</strong>
                        <button
                          onClick={() => onSetFullDesignSelected(item.name, true)}
                          disabled={isSelected || decorationUi.isDisabled}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {preview ? (
        <div
          className="image-modal"
          role="dialog"
          aria-modal="true"
          aria-label={preview.name}
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreview(null)
          }}
        >
          <div className="image-modal-content" role="document">
            <button className="image-modal-close" onClick={() => setPreview(null)} aria-label="Cerrar">
              ×
            </button>
            <img src={preview.src} alt={preview.name} />
            <p className="image-modal-caption">{preview.name}</p>
          </div>
        </div>
      ) : null}
    </>
  )
}
