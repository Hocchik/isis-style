import { useEffect, useRef, useState } from 'react'

export function ArtistryDesignSection({
  decorationOptions,
  decorationCounts,
  decorationState,
  decorationPrices,
  onUpdateDecorationQty,
  formatCurrency,
}) {
  const trackRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

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
  }, [decorationOptions.length])

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

  return (
    <section className="section-block">
      <div className="section-head-with-actions">
        <h2>
          <span>02</span> Decoraciones y Diseños
        </h2>

        <div className="carousel-actions" aria-label="Controles del carrusel de disenos">
          <button
            type="button"
            className="carousel-arrow"
            onClick={() => scrollTrack(-1)}
            disabled={!canScrollLeft}
            aria-label="Ver disenos anteriores"
          >
            ←
          </button>
          <button
            type="button"
            className="carousel-arrow"
            onClick={() => scrollTrack(1)}
            disabled={!canScrollRight}
            aria-label="Ver disenos siguientes"
          >
            →
          </button>
        </div>
      </div>

      <div className="design-carousel">
        <div className="design-track" ref={trackRef}>
        {decorationOptions.map((item) => {
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
                <p>{formatCurrency(decorationPrices[item.name] || 0)} c/u</p>
                {decorationUi.badge ? (
                  <span className="included-badge">{decorationUi.badge}</span>
                ) : null}
                <div className="qty-control">
                  <span>Cantidad</span>
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
    </section>
  )
}
