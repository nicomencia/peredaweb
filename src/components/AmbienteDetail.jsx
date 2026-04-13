import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './AmbienteDetail.css';

export default function AmbienteDetail({ ambienteId, setCurrentView }) {
  const [ambiente, setAmbiente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const ambienteResult = await supabase
          .from('ambientes')
          .select('*')
          .eq('id', ambienteId)
          .maybeSingle();

        if (ambienteResult.data) setAmbiente(ambienteResult.data);
      } catch (error) {
        console.error('Error fetching ambiente:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [ambienteId]);

  function openLightbox(index) {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
  }

  function navigateLightbox(direction) {
    const total = allImages.length;
    if (total === 0) return;
    const newIndex = (lightboxIndex + direction + total) % total;
    setLightboxIndex(newIndex);
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxIndex]);

  const allImages = ambiente
    ? [
        { image_url: ambiente.cover_image_url, caption: ambiente.title },
        { image_url: ambiente.cover_image_url, caption: null },
        { image_url: ambiente.cover_image_url, caption: null },
        { image_url: ambiente.cover_image_url, caption: null },
      ]
    : [];

  if (loading) {
    return (
      <section className="ambiente-detail">
        <div className="container">
          <button onClick={() => setCurrentView('inspirate')} className="ambiente-back-button">
            &#8592; Volver a Inspírate
          </button>
          <p className="ambiente-loading-text">Cargando...</p>
        </div>
      </section>
    );
  }

  if (!ambiente) {
    return (
      <section className="ambiente-detail">
        <div className="container">
          <button onClick={() => setCurrentView('inspirate')} className="ambiente-back-button">
            &#8592; Volver a Inspírate
          </button>
          <p className="ambiente-loading-text">Ambiente no encontrado.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="ambiente-detail">
      <div className="container">
        <button onClick={() => setCurrentView('inspirate')} className="ambiente-back-button">
          &#8592; Volver a Inspírate
        </button>

        <div className="ambiente-hero-layout">
          <div className="ambiente-hero" onClick={() => openLightbox(0)}>
            <img src={ambiente.cover_image_url} alt={ambiente.title} />
            <div className="ambiente-hero-overlay">
              <h1 className="ambiente-detail-title">{ambiente.title}</h1>
            </div>
          </div>

          <div className="ambiente-specs-panel">
            {ambiente.specs && ambiente.specs.length > 0 ? (
              ambiente.specs.map((section, idx) => (
                <div key={idx} className="ambiente-specs-section">
                  <h3 className="ambiente-specs-category">{section.category}</h3>
                  <ul className="ambiente-specs-list">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <>
                {ambiente.summary && (
                  <div className="ambiente-specs-summary">
                    <p>{ambiente.summary}</p>
                  </div>
                )}
                {ambiente.description && (
                  <div className="ambiente-specs-description">
                    {ambiente.description.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="ambiente-photos-grid">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="ambiente-photo-item"
              onClick={() => openLightbox(index + 1)}
            >
              <img src={ambiente.cover_image_url} alt={`${ambiente.title} foto ${index + 1}`} />
            </div>
          ))}
        </div>

        {lightboxOpen && allImages[lightboxIndex] && (
          <div className="ambiente-lightbox" onClick={closeLightbox}>
            <button className="ambiente-lightbox-close" onClick={closeLightbox}>&times;</button>
            {allImages.length > 1 && (
              <>
                <button
                  className="ambiente-lightbox-nav ambiente-lightbox-prev"
                  onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
                >
                  &#8249;
                </button>
                <button
                  className="ambiente-lightbox-nav ambiente-lightbox-next"
                  onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
                >
                  &#8250;
                </button>
              </>
            )}
            <div className="ambiente-lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={allImages[lightboxIndex].image_url}
                alt={allImages[lightboxIndex].caption || 'Full view'}
                className="ambiente-lightbox-image"
              />
              {allImages[lightboxIndex].caption && (
                <p className="ambiente-lightbox-caption">{allImages[lightboxIndex].caption}</p>
              )}
            </div>
            <div className="ambiente-lightbox-counter">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
