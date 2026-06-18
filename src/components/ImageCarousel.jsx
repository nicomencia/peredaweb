import { useState, useEffect } from 'react';
import './ImageCarousel.css';

// Generic image carousel: fills a positioned, sized parent (position:absolute; inset:0).
// Shows one image at a time with prev/next arrows and dot indicators.
export default function ImageCarousel({ images = [], altPrefix = '' }) {
  const valid = images.filter(Boolean);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [valid.length]);

  if (valid.length === 0) return null;

  const go = (dir) => setIndex((i) => (i + dir + valid.length) % valid.length);

  return (
    <div className="img-carousel">
      {valid.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={altPrefix ? `${altPrefix} — foto ${i + 1}` : `Foto ${i + 1}`}
          className={`img-carousel-slide${i === index ? ' active' : ''}`}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}

      {valid.length > 1 && (
        <>
          <button
            className="img-carousel-arrow img-carousel-arrow--prev"
            onClick={() => go(-1)}
            aria-label="Foto anterior"
            type="button"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="img-carousel-arrow img-carousel-arrow--next"
            onClick={() => go(1)}
            aria-label="Foto siguiente"
            type="button"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="img-carousel-dots">
            {valid.map((_, i) => (
              <button
                key={i}
                className={`img-carousel-dot${i === index ? ' active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Ir a la foto ${i + 1}`}
                type="button"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
