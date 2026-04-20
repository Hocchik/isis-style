import { useEffect, useRef, useState } from 'react'

export function ArtistryDesignSection({
  simpleDecorationOptions,
  fullDesignOptions,
  decorationCounts,
  decorationState,
  decorationPrices,
  onUpdateDecorationQty,
  onSetFullDesignSelected,
  formatCurrency,
}) {
  const trackRef = useRef(null)
  const fullTrackRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [canScrollFullLeft, setCanScrollFullLeft] = useState(false)
  const [canScrollFullRight, setCanScrollFullRight] = useState(true)

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

  return (
    <section className="section-block">
      <div className="section-head-with-actions">
        <h2>
          <span>02</span> Decoraciones y diseños
        </h2>

        <div className="carousel-actions" aria-label="Controles del carrusel de diseños">
          <button
            type="button"
            className="carousel-arrow"
            onClick={() => scrollTrack(-1)}
            disabled={!canScrollLeft}
            aria-label="Ver diseños anteriores"
          >
            ←
          </button>
          <button
            type="button"
            className="carousel-arrow"
            onClick={() => scrollTrack(1)}
            disabled={!canScrollRight}
            aria-label="Ver diseños siguientes"
          >
            →
          </button>
        </div>
      </div>

      <p className="group-title">Decoraciones simples (por par)</p>
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
              <img src={item.image} alt={item.name} loading="lazy" />
              <div className="design-body">
                <h3>{item.name}</h3>
                <p>{formatCurrency(decorationPrices[item.name] || 0)} por par</p>
                {decorationUi.badge ? (
                  <span className="included-badge">{decorationUi.badge}</span>
                ) : null}
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
              <img src={item.image} alt={item.name} loading="lazy" />
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
  )
}
