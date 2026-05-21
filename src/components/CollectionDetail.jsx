import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './CollectionDetail.css';

export default function CollectionDetail({ collectionId, setCurrentView }) {
  const [collection, setCollection] = useState(null);
  const [details, setDetails] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    fetchCollectionData();
  }, [collectionId]);

  async function fetchCollectionData() {
    try {
      const [collectionResult, detailsResult, photosResult] = await Promise.all([
        supabase.from('collections').select('*').eq('id', collectionId).maybeSingle(),
        supabase.from('collection_details').select('*').eq('collection_id', collectionId).maybeSingle(),
        supabase.from('collection_photos').select('*').eq('collection_id', collectionId).order('display_order', { ascending: true })
      ]);

      if (collectionResult.error) throw collectionResult.error;
      if (detailsResult.error) throw detailsResult.error;
      if (photosResult.error) throw photosResult.error;

      setCollection(collectionResult.data);
      setDetails(detailsResult.data);
      setPhotos(photosResult.data || []);
    } catch (error) {
      console.error('Error fetching collection data:', error);
    } finally {
      setLoading(false);
    }
  }

  function openLightbox(imageSrc) {
    setLightboxImage(imageSrc);
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
    setLightboxImage(null);
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  if (loading) {
    return (
      <section className="collection-detail">
        <div className="container">
          <button onClick={() => setCurrentView('colecciones')} className="back-button">
            ← Volver a Colecciones
          </button>
          <p>Cargando...</p>
        </div>
      </section>
    );
  }

  if (!collection) {
    return (
      <section className="collection-detail">
        <div className="container">
          <button onClick={() => setCurrentView('colecciones')} className="back-button">
            ← Volver a Colecciones
          </button>
          <p>Colección no encontrada.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="collection-detail">
      <div className="container">
        <button onClick={() => setCurrentView('colecciones')} className="back-button">
          ← Volver a Colecciones
        </button>

        <h1 className="collection-detail-title">{collection.name}</h1>

        {details && details.description_text && (
          <div className="collection-detail-description">
            {details.description_text.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}

        {photos.length > 0 && (
          <div className="collection-photos-grid">
            {photos.map(photo => (
              <div
                key={photo.id}
                className="collection-photo-item"
                onClick={() => openLightbox(photo.image_url)}
              >
                <img src={photo.image_url} alt={`${collection.name} photo`} />
              </div>
            ))}
          </div>
        )}

        {lightboxOpen && lightboxImage && (
          <div className="lightbox" onClick={closeLightbox}>
            <button className="lightbox-close" onClick={closeLightbox}>&times;</button>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img src={lightboxImage} alt="Full view" className="lightbox-image" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
