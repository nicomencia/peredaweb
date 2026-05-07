import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './AmbienteDetail.css';

export default function AmbienteDetail({ ambienteId, setCurrentView }) {
  const [ambiente, setAmbiente] = useState(null);
  const [photos, setPhotos] = useState([]);
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

        const photosResult = await supabase
          .from('ambiente_photos')
          .select('*')
          .eq('ambiente_id', ambienteId)
          .order('display_order', { ascending: true });

        if (photosResult.data) setPhotos(photosResult.data);
      } catch (error) {
        console.error('Error fetching ambiente:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [ambienteId]);

  const allImages = ambiente
    ? [
        { image_url: ambiente.cover_image_url },
        { image_url: ambiente.cover_image_url },
        { image_url: ambiente.cover_image_url },
        { image_url: ambiente.cover_image_url },
        { image_url: ambiente.cover_image_url },
        { image_url: ambiente.cover_image_url },
        { image_url: ambiente.cover_image_url },
      ]
    : [];

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
  }, [lightboxOpen, lightboxIndex, allImages.length]);

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

        {ambiente.cover_image_url && (
          <div
            className="ambiente-main-photo"
            onClick={() => openLightbox(0)}
          >
            <img src={ambiente.cover_image_url} alt="" />
          </div>
        )}

        <div className="ambiente-gallery">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div
              key={index}
              className="ambiente-gallery-item"
              onClick={() => openLightbox(index)}
            >
              <img src={ambiente.cover_image_url} alt="" />
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
                alt=""
                className="ambiente-lightbox-image"
              />
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
