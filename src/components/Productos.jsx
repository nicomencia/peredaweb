import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Productos.css';

const CATEGORIES = [
  {
    key: 'sanitarios',
    label: 'Sanitarios',
    image: '/productos_bano.jpg',
    description: 'Inodoros, bidés, lavabos y piezas sanitarias',
    icon: 'M4 12h16M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6M8 12V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6',
  },
  {
    key: 'griferia',
    label: 'Griferías',
    image: '/productos_bano.jpg',
    description: 'Grifos, monomandos y termostáticas',
    icon: 'M12 3v4M8 7h8M10 7v3a2 2 0 0 0 2 2 2 2 0 0 0 2-2V7M12 12v9M9 21h6',
  },
  {
    key: 'muebles-bano',
    label: 'Muebles de baño y espejos',
    image: '/productos_bano.jpg',
    description: 'Muebles, espejos y complementos para el baño',
    icon: 'M3 7h18v10H3zM3 12h18M7 7v10M17 7v10',
  },
  {
    key: 'climatizacion',
    label: 'Climatización y energías renovables',
    image: '/productos_fontaneria.png',
    description: 'Aire acondicionado, aerotermia y renovables',
    icon: 'M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4',
  },
  {
    key: 'fontaneria',
    label: 'Fontanería y calefacción',
    image: '/productos_fontaneria.png',
    description: 'Sistemas de calefacción, radiadores y fontanería',
    icon: 'M4 8h10a4 4 0 0 1 0 8H8M4 12h4M14 4v4M14 16v4',
  },
  {
    key: 'ceramica',
    label: 'Cerámicas',
    image: '/productos_bano.jpg',
    description: 'Azulejos y pavimentos cerámicos',
    icon: 'M3 5h18v14H3zM3 12h18M9 5v14M15 5v14',
  },
  {
    key: 'materiales',
    label: 'Materiales de construcción',
    image: '/productos_construccion.jpg',
    description: 'Materiales y soluciones constructivas',
    icon: 'M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6',
  },
  {
    key: 'mamparas',
    label: 'Mamparas',
    image: '/productos_bano.jpg',
    description: 'Mamparas de ducha y bañera a medida',
    icon: 'M4 3h16v18H4zM12 3v18M4 7h16M4 17h16',
  },
  {
    key: 'herramientas',
    label: 'Herramientas',
    image: '/productos_construccion.jpg',
    description: 'Herramienta profesional y de bricolaje',
    icon: 'M14 6l4 4-8 8-4-4zM16 4l4 4M3 21l3-3M10 14l-3 3',
  },
  {
    key: 'electricidad',
    label: 'Electricidad',
    image: '/productos_construccion.jpg',
    description: 'Material eléctrico e iluminación',
    icon: 'M13 2L4 14h7l-1 8 9-12h-7z',
  },
];

export default function Productos({ setCurrentView, setSelectedCollection, onCategorySelect }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="productos">
      <div className="productos-container">
        <div className="productos-hero">
          <h1 className="productos-hero-title">Productos</h1>
          <p className="productos-hero-subtitle">
            Descubre nuestra amplia gama de productos para tu hogar y proyectos profesionales
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

        {!loading && products.length > 0 && (
          <>
            <h2 className="productos-section-title">Todos los productos</h2>
            <div className="productos-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image-wrapper">
                    <img src={product.image_url} alt={product.name} className="product-image" />
                  </div>
                  <div className="product-details">
                    <p className="product-category">{product.category}</p>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-options">Varias opciones</p>
                    <p className="product-price">
                      PVPR Desde: <span className="price-value">{product.price} &euro;</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && products.length === 0 && (
          <p className="productos-empty">Catálogo próximamente disponible.</p>
        )}

        {loading && <p className="productos-loading">Cargando...</p>}
      </div>
    </section>
  );
}
