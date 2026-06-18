import { useState } from 'react';
import './ProductCard.css';

export default function ProductCard({ product, photos }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const images = photos && photos.length > 0
    ? photos.map((p) => p.image_url)
    : [product.image_url].filter(Boolean);

  const hasMultiple = images.length > 1;

  function prev(e) {
    e.stopPropagation();
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }

  function next(e) {
    e.stopPropagation();
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  function openLightbox() {
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  }

  function lightboxPrev(e) {
    e.stopPropagation();
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }

  function lightboxNext(e) {
    e.stopPropagation();
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  return (
    <>
      <div className="product-card">
        <div className="product-image-wrapper" onClick={openLightbox}>
          <img
            src={images[currentIndex]}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
          {hasMultiple && (
            <>
              <button className="product-arrow product-arrow--left" onClick={prev} aria-label="Anterior">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="product-arrow product-arrow--right" onClick={next} aria-label="Siguiente">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div className="product-dots">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`product-dot${i === currentIndex ? ' product-dot--active' : ''}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="product-details">
          <p className="product-category">{product.category}</p>
          <h3 className="product-name">{product.name}</h3>
        </div>
      </div>

      {lightboxOpen && (
        <div className="product-lightbox" onClick={closeLightbox}>
          <button className="product-lightbox-close" onClick={closeLightbox} aria-label="Cerrar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <div className="product-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[currentIndex]}
              alt={product.name}
              className="product-lightbox-image"
            />
            {hasMultiple && (
              <>
                <button className="product-lightbox-arrow product-lightbox-arrow--left" onClick={lightboxPrev} aria-label="Anterior">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 4L7 12l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button className="product-lightbox-arrow product-lightbox-arrow--right" onClick={lightboxNext} aria-label="Siguiente">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 4l8 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </>
            )}
            <div className="product-lightbox-counter">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
