import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './AdminUpdateProducts.css';

export default function AdminUpdateProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingUrls, setUpdatingUrls] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      setMessage(`Error loading products: ${error.message}`);
      console.error('Load error:', error);
    } finally {
      setLoading(false);
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

  const updateAllProductUrls = async () => {
    if (!confirm('This will update ALL products to use Supabase Storage URLs. Continue?')) {
      return;
    }

    try {
      setUpdatingUrls(true);
      setMessage('');

      const updatePromises = products.map(async (product) => {
        const updates = {};

        if (product.image_url) {
          if (!product.image_url.startsWith('http')) {
            updates.image_url = getStorageUrl(product.image_url);
          }

          if (!product.thumbnail_url) {
            let filename = product.image_url;
            if (filename.startsWith('http')) {
              filename = filename.split('/').pop();
            }
            const thumbnailFilename = filename.replace(/(\.[^.]+)$/, '_thumbnail$1');
            updates.thumbnail_url = getStorageUrl(thumbnailFilename);
          }
        }

        if (product.secondary_image_url && !product.secondary_image_url.startsWith('http')) {
          updates.secondary_image_url = getStorageUrl(product.secondary_image_url);
        }

        if (Object.keys(updates).length > 0) {
          const { error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', product.id);

          if (error) throw error;
        }
      });

      await Promise.all(updatePromises);

      setMessage(`Successfully updated URLs for ${products.length} products!`);
      await loadProducts();
    } catch (error) {
      setMessage(`Error updating URLs: ${error.message}`);
      console.error('URL update error:', error);
    } finally {
      setUpdatingUrls(false);
    }
  };

  const startEditing = (product) => {
    setEditingProduct(product.id);
    setEditValues({
      name: product.name,
      price: product.price,
      category: product.category,
      color: product.color,
      size: product.size || '',
      description: product.description || '',
      display_order: product.display_order,
      sold: product.sold
    });
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setEditValues({});
  };

  const saveProduct = async (productId) => {
    try {
      const updates = {
        ...editValues,
        price: parseFloat(editValues.price),
        size: editValues.size ? parseInt(editValues.size) : null,
        display_order: parseInt(editValues.display_order)
      };

      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId);

      if (error) throw error;

      setMessage('Product updated successfully!');
      setEditingProduct(null);
      setEditValues({});
      await loadProducts();
    } catch (error) {
      setMessage(`Error updating product: ${error.message}`);
      console.error('Update error:', error);
    }
  };

  const deleteProduct = async (productId, productName) => {
    if (!confirm(`Are you sure you want to delete ${productName}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setMessage('Product deleted successfully!');
      await loadProducts();
    } catch (error) {
      setMessage(`Error deleting product: ${error.message}`);
      console.error('Delete error:', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.color && product.color.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="admin-update-loading">Loading products...</div>;
  }

  return (
    <div className="admin-update">
      <div className="admin-update-card">
        <h2>Update Products</h2>

        {message && (
          <div className={`admin-update-message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="bulk-actions">
          <button
            onClick={updateAllProductUrls}
            disabled={updatingUrls}
            className="bulk-update-button"
          >
            {updatingUrls ? 'Updating URLs...' : 'Update All URLs'}
          </button>
          <p className="bulk-info">
            Convert all product image filenames to full Supabase Storage URLs
          </p>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="admin-update-products">
          <h3>Products ({filteredProducts.length})</h3>
          <div className="products-list">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-row">
                {editingProduct === product.id ? (
                  <div className="product-edit-form">
                    <div className="form-row">
                      <label>
                        Name:
                        <input
                          type="text"
                          value={editValues.name}
                          onChange={(e) => setEditValues({...editValues, name: e.target.value})}
                        />
                      </label>
                      <label>
                        Price:
                        <input
                          type="number"
                          step="0.01"
                          value={editValues.price}
                          onChange={(e) => setEditValues({...editValues, price: e.target.value})}
                        />
                      </label>
                    </div>
                    <div className="form-row">
                      <label>
                        Category:
                        <select
                          value={editValues.category}
                          onChange={(e) => setEditValues({...editValues, category: e.target.value})}
                        >
                          <option value="Anillo">Anillo</option>
                          <option value="Pendiente">Pendiente</option>
                          <option value="Collar">Collar</option>
                          <option value="Pinza">Pinza</option>
                        </select>
                      </label>
                      <label>
                        Color:
                        <input
                          type="text"
                          value={editValues.color}
                          onChange={(e) => setEditValues({...editValues, color: e.target.value})}
                        />
                      </label>
                    </div>
                    <div className="form-row">
                      <label>
                        Size (for rings):
                        <input
                          type="number"
                          value={editValues.size}
                          onChange={(e) => setEditValues({...editValues, size: e.target.value})}
                        />
                      </label>
                      <label>
                        Display Order:
                        <input
                          type="number"
                          value={editValues.display_order}
                          onChange={(e) => setEditValues({...editValues, display_order: e.target.value})}
                        />
                      </label>
                    </div>
                    <div className="form-row">
                      <label>
                        Description:
                        <textarea
                          value={editValues.description}
                          onChange={(e) => setEditValues({...editValues, description: e.target.value})}
                          rows="2"
                        />
                      </label>
                    </div>
                    <div className="form-row">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={editValues.sold}
                          onChange={(e) => setEditValues({...editValues, sold: e.target.checked})}
                        />
                        Sold
                      </label>
                    </div>
                    <div className="button-group">
                      <button onClick={() => saveProduct(product.id)} className="save-button">
                        Save
                      </button>
                      <button onClick={cancelEditing} className="cancel-button">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="product-display">
                    <div className="product-info">
                      <strong>{product.name}</strong>
                      <span className="product-price">€{product.price}</span>
                      <span className="product-category">{product.category}</span>
                      {product.color && <span className="product-color">{product.color}</span>}
                      {product.size && <span className="product-size">Talla: {product.size}</span>}
                      {product.sold && <span className="product-sold">VENDIDO</span>}
                    </div>
                    <div className="button-group">
                      <button onClick={() => startEditing(product)} className="edit-button">
                        Edit
                      </button>
                      <button onClick={() => deleteProduct(product.id, product.name)} className="delete-button">
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
