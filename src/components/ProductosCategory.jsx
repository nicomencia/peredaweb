import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import BrandsCarousel from './BrandsCarousel';
import ImageCarousel from './ImageCarousel';
import './ProductosCategory.css';

const CATEGORY_CONFIG = {
  bano: {
    label: 'Baño',
    description: 'Grifería, sanitarios, muebles de baño y accesorios para crear el espacio perfecto',
  },
  sanitarios: {
    label: 'Sanitarios',
    description: 'Inodoros, bidés, lavabos y piezas sanitarias para un baño funcional',
  },
  griferia: {
    label: 'Griferías',
    description: 'Grifos, monomandos y termostáticas de las mejores marcas',
  },
  'muebles-bano': {
    label: 'Muebles de baño y espejos',
    description: 'Muebles, espejos y complementos para organizar y decorar el baño',
  },
  climatizacion: {
    label: 'Climatización y energías renovables',
    description: 'Aire acondicionado, aerotermia y soluciones de energías renovables',
  },
  fontaneria: {
    label: 'Fontanería y calefacción',
    description: 'Sistemas de calefacción, radiadores, tuberías y soluciones de fontanería profesional',
  },
  ceramica: {
    label: 'Cerámicas',
    description: 'Azulejos y pavimentos cerámicos para baños y cocinas',
  },
  materiales: {
    label: 'Materiales de construcción',
    description: 'Materiales y soluciones constructivas para todo tipo de proyectos',
  },
  mamparas: {
    label: 'Mamparas',
    description: 'Mamparas de ducha y bañera adaptadas a tu espacio',
  },
  herramientas: {
    label: 'Herramientas',
    description: 'Herramienta profesional y de bricolaje para cualquier proyecto',
  },
  electricidad: {
    label: 'Electricidad',
    description: 'Material eléctrico, iluminación y soluciones para la instalación',
  },
};

export default function ProductosCategory({ category, setCurrentView, categoryBanners }) {
  const [customDesc, setCustomDesc] = useState('');
  const [photos, setPhotos] = useState([]);
  const [hasPhotosKey, setHasPhotosKey] = useState(false);

  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.bano;
  const bannerSrc = categoryBanners[category] || '';

  useEffect(() => {
    let active = true;
    async function load() {
      const { data } = await api
        .from('site_settings')
        .select('key, value')
        .in('key', [`category_desc_${category}`, `category_photos_${category}`]);
      if (!active) return;
      let desc = '';
      let pics = [];
      let photosKey = false;
      (data || []).forEach((row) => {
        if (row.key === `category_desc_${category}`) desc = row.value || '';
        if (row.key === `category_photos_${category}`) {
          photosKey = true;
          try {
            const parsed = JSON.parse(row.value || '[]');
            if (Array.isArray(parsed)) pics = parsed.filter(Boolean);
          } catch {
            pics = [];
          }
        }
      });
      setCustomDesc(desc);
      setPhotos(pics);
      setHasPhotosKey(photosKey);
    }
    load();
    return () => {
      active = false;
    };
  }, [category]);

  // Once a category has its own photos list, use it (even if empty). Otherwise
  // fall back to the legacy single banner image so nothing disappears.
  const images = hasPhotosKey ? photos : bannerSrc ? [bannerSrc] : [];

  const handleBack = () => setCurrentView('colecciones');

  return (
    <section className="productos-cat">
      <div className="productos-cat-container">
        <button className="productos-cat-back" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Todos los productos
        </button>

        <div className="productos-cat-main">
          <div className="productos-cat-text">
            <h1 className="productos-cat-title">{config.label}</h1>
            <p className="productos-cat-desc">{customDesc || config.description}</p>
          </div>

          <div className="productos-cat-media">
            {images.length > 0 ? (
              <ImageCarousel images={images} altPrefix={config.label} />
            ) : (
              <div className="productos-cat-media-empty">Imágenes próximamente</div>
            )}
          </div>
        </div>

        <BrandsCarousel category={category} />
      </div>
    </section>
  );
}
