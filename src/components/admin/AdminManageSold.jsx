import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './AdminManageSold.css';

export default function AdminManageSold() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      setMessage(`Error loading products: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleSoldStatus = async (productId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ sold: !currentStatus })
        .eq('id', productId);

      if (error) throw error;

      setMessage('Product status updated successfully!');

      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId
            ? { ...product, sold: !currentStatus }
            : product
        )
      );
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const getStorageUrl = (filename) => {
    if (!filename) return '';
    if (filename.startsWith('http')) return filename;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filename);

    return data.publicUrl;
  };

  const filteredProducts = products.filter(product => {
    const matchesFilter = filter === 'all' ||
                         (filter === 'sold' && product.sold) ||
                         (filter === 'available' && !product.sold);

    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <div className="admin-sold-loading">Loading products...</div>;
  }

  return (
    <div className="admin-sold">
      <div className="admin-sold-header">
        <h2>Manage Sold Products</h2>

        <div className="admin-sold-search">
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="admin-sold-filters">
          <button
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({products.length})
          </button>
          <button
            className={`filter-button ${filter === 'available' ? 'active' : ''}`}
            onClick={() => setFilter('available')}
          >
            Available ({products.filter(p => !p.sold).length})
          </button>
          <button
            className={`filter-button ${filter === 'sold' ? 'active' : ''}`}
            onClick={() => setFilter('sold')}
          >
            Sold ({products.filter(p => p.sold).length})
          </button>
        </div>
      </div>

      {message && (
        <div className={`admin-sold-message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="admin-sold-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className={`admin-sold-card ${product.sold ? 'sold' : ''}`}>
            <div className="admin-sold-image">
              <img
                src={getStorageUrl(product.thumbnail_url || product.image_url)}
                alt={product.name}
                loading="lazy"
              />
            </div>
            <div className="admin-sold-info">
              <h3>{product.name}</h3>
              <button
                className={`toggle-sold-button ${product.sold ? 'mark-available' : 'mark-sold'}`}
                onClick={() => toggleSoldStatus(product.id, product.sold)}
              >
                {product.sold ? 'Mark as Available' : 'Mark as Sold'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="admin-sold-empty">
          No products found in this category.
        </div>
      )}
    </div>
  );
}
