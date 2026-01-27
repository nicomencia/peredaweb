import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Productos.css';

export default function Productos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('display_order', { ascending: true });

      if (productsError) {
        console.error('Supabase error:', productsError);
        throw productsError;
      }

      console.log('Products fetched:', productsData);
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section id="productos" className="productos">
        <div className="productos-container">
          <p>Cargando...</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section id="productos" className="productos">
        <div className="productos-container">
          <p className="productos-empty">Catálogo próximamente disponible.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="productos" className="productos">
      <div className="productos-container">
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
                  PVPR Desde: <span className="price-value">{product.price} €</span>
                </p>
                <div className="product-variants">
                  <button className="variant-button selected"></button>
                  <button className="variant-button"></button>
                  <button className="variant-button dark"></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
