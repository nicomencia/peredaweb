import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import BrandsCarousel from './BrandsCarousel';
import './Productos.css';

const CATEGORIES = [
  {
    key: 'sanitarios',
    label: 'Sanitarios',
    description: 'Inodoros, bidés, lavabos y piezas sanitarias',
    icon: 'M4 12h16M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6M8 12V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6',
  },
  {
    key: 'griferia',
    label: 'Griferías',
    description: 'Grifos, monomandos y termostáticas',
    icon: 'M12 3v4M8 7h8M10 7v3a2 2 0 0 0 2 2 2 2 0 0 0 2-2V7M12 12v9M9 21h6',
  },
  {
    key: 'muebles-bano',
    label: 'Muebles de baño y espejos',
    description: 'Muebles, espejos y complementos para el baño',
    icon: 'M3 7h18v10H3zM3 12h18M7 7v10M17 7v10',
  },
  {
    key: 'climatizacion',
    label: 'Climatización y energías renovables',
    description: 'Aire acondicionado, aerotermia y renovables',
    icon: 'M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4',
  },
  {
    key: 'fontaneria',
    label: 'Fontanería y calefacción',
    description: 'Sistemas de calefacción, radiadores y fontanería',
    icon: 'M4 8h10a4 4 0 0 1 0 8H8M4 12h4M14 4v4M14 16v4',
  },
  {
    key: 'ceramica',
    label: 'Cerámicas',
    description: 'Azulejos y pavimentos cerámicos',
    icon: 'M3 5h18v14H3zM3 12h18M9 5v14M15 5v14',
  },
  {
    key: 'materiales',
    label: 'Materiales de construcción',
    description: 'Materiales y soluciones constructivas',
    icon: 'M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6',
  },
  {
    key: 'mamparas',
    label: 'Mamparas',
    description: 'Mamparas de ducha y bañera a medida',
    icon: 'M4 3h16v18H4zM12 3v18M4 7h16M4 17h16',
  },
  {
    key: 'herramientas',
    label: 'Herramientas',
    description: 'Herramienta profesional y de bricolaje',
    icon: 'M14 6l4 4-8 8-4-4zM16 4l4 4M3 21l3-3M10 14l-3 3',
  },
  {
    key: 'electricidad',
    label: 'Electricidad',
    description: 'Material eléctrico e iluminación',
    icon: 'M13 2L4 14h7l-1 8 9-12h-7z',
  },
];

export default function Productos({ setCurrentView, setSelectedCollection, onCategorySelect }) {
  const [subtitle, setSubtitle] = useState('Descubre nuestra amplia gama de productos para tu hogar y proyectos profesionales');

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await api
      .from('site_settings')
      .select('value')
      .eq('key', 'productos_subtitle')
      .maybeSingle();
    if (data?.value) setSubtitle(data.value);
  }

  return (
    <section className="productos">
      <div className="productos-container">
        <div className="productos-hero">
          <h1 className="productos-hero-title">Productos</h1>
          <p className="productos-hero-subtitle">
            {subtitle}
          </p>
        </div>

        <div className="category-tiles">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className="category-tile"
              onClick={() => onCategorySelect(cat.key)}
            >
              <svg className="category-tile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d={cat.icon} />
              </svg>
              <div className="category-tile-body">
                <h3 className="category-tile-title">{cat.label}</h3>
                <p className="category-tile-desc">{cat.description}</p>
              </div>
              <span className="category-tile-arrow" aria-hidden="true">&#8594;</span>
            </button>
          ))}
        </div>

        <BrandsCarousel />
      </div>
    </section>
  );
}
