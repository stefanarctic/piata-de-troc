import { useEffect, useCallback } from 'react'

export default function ImageLightbox({
  images,
  activeIndex,
  onClose,
  onNavigate,
  alt = '',
}) {
  const hasMultiple = images.length > 1
  const currentSrc = images[activeIndex]

  const goPrev = useCallback(() => {
    onNavigate((activeIndex - 1 + images.length) % images.length)
  }, [activeIndex, images.length, onNavigate])

  const goNext = useCallback(() => {
    onNavigate((activeIndex + 1) % images.length)
  }, [activeIndex, images.length, onNavigate])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasMultiple) goPrev()
      if (e.key === 'ArrowRight' && hasMultiple) goNext()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, goPrev, goNext, hasMultiple])

  if (!currentSrc) return null

  return (
    <div
      className="image-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Imagine marita"
      onClick={onClose}
    >
      <button
        type="button"
        className="image-lightbox-close"
        aria-label="Inchide"
        onClick={onClose}
      >
        ×
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            className="image-lightbox-nav image-lightbox-prev"
            aria-label="Imaginea anterioara"
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
          >
            ‹
          </button>
          <button
            type="button"
            className="image-lightbox-nav image-lightbox-next"
            aria-label="Imaginea urmatoare"
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
          >
            ›
          </button>
        </>
      )}

      <div className="image-lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img src={currentSrc} alt={alt} />
        {hasMultiple && (
          <span className="image-lightbox-counter">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>
    </div>
  )
}
