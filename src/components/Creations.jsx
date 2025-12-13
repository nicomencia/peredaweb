import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Creations.css';

const categories = ['Todas', 'Anillos', 'Pendientes', 'Collares', 'Pinzas'];

export default function Creations({ setCurrentView }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Todas');
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxProduct, setLightboxProduct] = useState(null);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(12);
  const [preloadedImages, setPreloadedImages] = useState(new Set());
  const [loadedImages, setLoadedImages] = useState(new Set());


  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeFilter === 'Todas') {
      setFilteredProducts(products);
    } else {
      const categoryMap = {
        'Anillos': 'Anillo',
        'Pendientes': 'Pendiente',
        'Collares': 'Collar',
        'Pinzas': 'Pinza'
      };
      const dbCategory = categoryMap[activeFilter] || activeFilter;
      setFilteredProducts(products.filter(p => p.category === dbCategory));
    }
    setItemsToShow(12);
  }, [activeFilter, products]);

  useEffect(() => {
    const products = filteredProducts.slice(0, itemsToShow);
    setDisplayedProducts(products);

    // Preload images for better perceived performance
    products.forEach(product => {
      if (!preloadedImages.has(product.image_url)) {
        const img = new Image();
        img.src = product.image_url;
        setPreloadedImages(prev => new Set([...prev, product.image_url]));
      }
      if (product.secondary_image_url && !preloadedImages.has(product.secondary_image_url)) {
        const img = new Image();
        img.src = product.secondary_image_url;
        setPreloadedImages(prev => new Set([...prev, product.secondary_image_url]));
      }
    });
  }, [filteredProducts, itemsToShow]);

  function loadMore() {
    setItemsToShow(prev => prev + 12);
  }

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sold', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  function openLightbox(product) {
    setLightboxProduct(product);
    setLightboxImageIndex(0);
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
    setLightboxProduct(null);
    setLightboxImageIndex(0);
  }

  function nextImage() {
    if (lightboxProduct && lightboxProduct.secondary_image_url) {
      setLightboxImageIndex((prev) => (prev === 0 ? 1 : 0));
    }
  }
 
  function prevImage() {
    if (lightboxProduct && lightboxProduct.secondary_image_url) {
      setLightboxImageIndex((prev) => (prev === 0 ? 1 : 0));
    }
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxProduct]);

  if (loading) {
    return (
      <section id="creations" className="creations">
        <div className="container">
          <h2>Creaciones</h2>
          <p>Cargando...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="creations" className="creations">
      <div className="container">
        <h2>Creaciones</h2>

        <div className="creations-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${activeFilter === category ? 'filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* {activeFilter === 'Anillos' && ( add below div inside )} */}
        
        <div className="tallas-link-wrapper">
            <button onClick={() => setCurrentView('tallas')} className="tallas-link">GUíA DE TALLAS PARA ANILLOS</button>
        </div>
        
        {filteredProducts.length === 0 ? (
          <p className="creations-empty">No hay productos disponibles en esta categoría aún.</p>
        ) : (
          <>
            <div className="creations-grid">
              {displayedProducts.map((product, index) => (
                <div key={product.id} className="creation-card" onClick={() => openLightbox(product)}>
                  <div className="creation-image">
                    {!loadedImages.has(product.thumbnail_url || product.image_url) && (
                      <div className="image-skeleton"></div>
                    )}
                    <img
                      src={product.thumbnail_url || product.image_url}
                      alt={product.name}
                      className={`creation-image-primary ${loadedImages.has(product.thumbnail_url || product.image_url) ? 'loaded' : ''}`}
                      loading={index < 6 ? "eager" : "lazy"}
                      decoding="async"
                      onLoad={() => setLoadedImages(prev => new Set([...prev, product.thumbnail_url || product.image_url]))}
                    />
                    {product.secondary_image_url && (
                      <img
                        src={product.secondary_image_url}
                        alt={product.name}
                        className="creation-image-secondary"
                        loading={index < 6 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    )}
                  </div>
                  <div className="creation-info">
                    <h3>{product.name}</h3>
                    <p className="creation-category">{product.category}</p>
                    <p className="creation-description">{product.description}</p>
                    {product.category === 'Anillo' && product.size && <p className="creation-size">Talla {product.size}</p>}
                    <p className="creation-price">{product.sold ? <span className="sold-badge">VENDIDO</span> : `${product.price}€`}</p>
                  </div>
                </div>
              ))}
            </div>
            {itemsToShow < filteredProducts.length && (
              <div className="load-more-wrapper">
                <button onClick={loadMore} className="load-more-btn">
                  Más
                </button>
              </div>
            )}
          </>
        )}

        {lightboxOpen && lightboxProduct && (
          <div className="lightbox" onClick={closeLightbox}>
            <button className="lightbox-close" onClick={closeLightbox}>&times;</button>

            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={lightboxImageIndex === 0 ? lightboxProduct.image_url : lightboxProduct.secondary_image_url}
                alt={lightboxProduct.name}
                className="lightbox-image"
              />

              {lightboxProduct.secondary_image_url && (
                <>
                  <button className="lightbox-arrow lightbox-arrow-left" onClick={prevImage}>
                    &#8249;
                  </button>
                  <button className="lightbox-arrow lightbox-arrow-right" onClick={nextImage}>
                    &#8250;
                  </button>
                  <div className="lightbox-indicators">
                    <span className={lightboxImageIndex === 0 ? 'active' : ''} onClick={() => setLightboxImageIndex(0)}></span>
                    <span className={lightboxImageIndex === 1 ? 'active' : ''} onClick={() => setLightboxImageIndex(1)}></span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
