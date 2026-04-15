import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Productos.css';

const CATEGORIES = [
  {
    key: 'bano',
    label: 'Baño',
    image: '/productos_bano.jpg',
    description: 'Grifería, sanitarios, muebles de baño y accesorios',
  },
  {
    key: 'fontaneria',
    label: 'Fontanería y calefacción',
    image: '/productos_fontaneria.png',
    description: 'Sistemas de calefacción, radiadores y fontanería',
  },
  {
    key: 'materiales',
    label: 'Materiales de construcción',
    image: '/productos_construccion.jpg',
    description: 'Materiales, herramientas y soluciones constructivas',
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

        <div className="category-cards">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className="category-card"
              onClick={() => onCategorySelect(cat.key)}
            >
              <div className="category-card-image-wrapper">
                <img src={cat.image} alt={cat.label} className="category-card-image" />
                <div className="category-card-overlay" />
              </div>
              <div className="category-card-content">
                <h3 className="category-card-title">{cat.label}</h3>
                <p className="category-card-desc">{cat.description}</p>
                <span className="category-card-link">
                  Ver productos
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
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
