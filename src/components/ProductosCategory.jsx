import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './ProductosCategory.css';

const CATEGORY_CONFIG = {
  bano: {
    label: 'Baño',
    description: 'Grifería, sanitarios, muebles de baño y accesorios para crear el espacio perfecto',
    image: '/productos_bano.jpg',
  },
  sanitarios: {
    label: 'Sanitarios',
    description: 'Inodoros, bidés, lavabos y piezas sanitarias para un baño funcional',
    image: '/productos_bano.jpg',
  },
  griferia: {
    label: 'Griferías',
    description: 'Grifos, monomandos y termostáticas de las mejores marcas',
    image: '/productos_bano.jpg',
  },
  'muebles-bano': {
    label: 'Muebles de baño y espejos',
    description: 'Muebles, espejos y complementos para organizar y decorar el baño',
    image: '/productos_bano.jpg',
  },
  climatizacion: {
    label: 'Climatización y energías renovables',
    description: 'Aire acondicionado, aerotermia y soluciones de energías renovables',
    image: '/productos_fontaneria.png',
  },
  fontaneria: {
    label: 'Fontanería y calefacción',
    description: 'Sistemas de calefacción, radiadores, tuberías y soluciones de fontanería profesional',
    image: '/productos_fontaneria.png',
  },
  ceramica: {
    label: 'Cerámicas',
    description: 'Azulejos y pavimentos cerámicos para baños y cocinas',
    image: '/productos_bano.jpg',
  },
  materiales: {
    label: 'Materiales de construcción',
    description: 'Materiales y soluciones constructivas para todo tipo de proyectos',
    image: '/productos_construccion.jpg',
  },
  mamparas: {
    label: 'Mamparas',
    description: 'Mamparas de ducha y bañera adaptadas a tu espacio',
    image: '/productos_bano.jpg',
  },
  herramientas: {
    label: 'Herramientas',
    description: 'Herramienta profesional y de bricolaje para cualquier proyecto',
    image: '/productos_construccion.jpg',
  },
  electricidad: {
    label: 'Electricidad',
    description: 'Material eléctrico, iluminación y soluciones para la instalación',
    image: '/productos_construccion.jpg',
  },
};

export default function ProductosCategory({ category, setCurrentView, setProductCategory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.bano;

  useEffect(() => {
    fetchProducts();
  }, [category]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_type', category)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleBack = () => {
    setProductCategory(null);
    setCurrentView('colecciones');
  };

  return (
    <section className="productos-cat">
      <div className="productos-cat-banner">
        <img src={config.image} alt={config.label} className="productos-cat-banner-img" />
        <div className="productos-cat-banner-overlay" />
        <div className="productos-cat-banner-content">
          <button className="productos-cat-back" onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Todos los productos
          </button>
          <h1 className="productos-cat-title">{config.label}</h1>
          <p className="productos-cat-desc">{config.description}</p>
        </div>
      </div>

      <div className="productos-cat-container">
        {loading && <p className="productos-cat-loading">Cargando...</p>}

        {!loading && products.length === 0 && (
          <p className="productos-cat-empty">Productos próximamente disponibles en esta categoría.</p>
        )}

        {!loading && products.length > 0 && (
          <div className="productos-cat-grid">
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
        )}
      </div>
    </section>
  );
}
