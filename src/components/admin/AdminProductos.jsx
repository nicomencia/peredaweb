import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadImage } from '../../lib/upload';
import './AdminHomepage.css';
import './AdminProductos.css';

const CATEGORIES = [
  { key: 'sanitarios', label: 'Sanitarios' },
  { key: 'griferia', label: 'Griferías' },
  { key: 'muebles-bano', label: 'Muebles de baño' },
  { key: 'climatizacion', label: 'Climatización' },
  { key: 'fontaneria', label: 'Fontanería' },
  { key: 'ceramica', label: 'Cerámicas' },
  { key: 'materiales', label: 'Materiales' },
  { key: 'mamparas', label: 'Mamparas' },
  { key: 'herramientas', label: 'Herramientas' },
  { key: 'electricidad', label: 'Electricidad' },
];

export default function AdminProductos() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].key);
  const [products, setProducts] = useState([]);
  const [photosMap, setPhotosMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  async function fetchProducts() {
    setLoading(true);
    setMessage('');
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('product_type', activeCategory)
      .order('display_order', { ascending: true });

    if (error) {
      setMessage('Error cargando productos: ' + error.message);
      setLoading(false);
      return;
    }

    setProducts(data || []);

    if (data && data.length > 0) {
      const ids = data.map((p) => p.id);
      const { data: photos } = await supabase
        .from('product_photos')
        .select('*')
        .in('product_id', ids)
        .order('display_order', { ascending: true });

      if (photos) {
        const map = {};
        photos.forEach((photo) => {
          if (!map[photo.product_id]) map[photo.product_id] = [];
          map[photo.product_id].push(photo);
        });
        setPhotosMap(map);
      } else {
        setPhotosMap({});
      }
    } else {
      setPhotosMap({});
    }

    setLoading(false);
  }

  async function handleAdd() {
    const maxOrder = products.reduce((max, p) => Math.max(max, p.display_order || 0), 0);
    const catLabel = CATEGORIES.find((c) => c.key === activeCategory)?.label || activeCategory;
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: 'Nuevo producto',
        category: catLabel,
        product_type: activeCategory,
        display_order: maxOrder + 1,
        price: 0,
      })
      .select()
      .maybeSingle();

    if (error) {
      setMessage('Error creando producto: ' + error.message);
      return;
    }
    if (data) {
      setProducts([...products, data]);
      setEditing(data.id);
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este producto y todas sus fotos?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      setMessage('Error eliminando: ' + error.message);
      return;
    }
    setProducts(products.filter((p) => p.id !== id));
    if (editing === id) setEditing(null);
    setMessage('Producto eliminado.');
  }

  return (
    <div className="admin-homepage">
      <h2>Productos</h2>
      <p className="admin-homepage-desc">Gestiona los productos por categoría.</p>

      {message && <div className="admin-homepage-msg">{message}</div>}

      <div className="admin-productos-cats">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`admin-productos-cat-btn${activeCategory === cat.key ? ' active' : ''}`}
            onClick={() => { setActiveCategory(cat.key); setEditing(null); }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="admin-ambientes-list">
          {products.map((product) => (
            <div key={product.id} className="admin-ambiente-row">
              <div className="admin-ambiente-row-header">
                <div className="admin-ambiente-row-preview">
                  {product.image_url && <img src={product.image_url} alt="" />}
                </div>
                <div className="admin-ambiente-row-info">
                  <strong>{product.name}</strong>
                  <span className="admin-ambiente-row-count">
                    {product.category} - {(photosMap[product.id]?.length || 0)} fotos
                  </span>
                </div>
                <div className="admin-ambiente-row-actions">
                  <button
                    className="admin-amb-btn admin-amb-btn--edit"
                    onClick={() => setEditing(editing === product.id ? null : product.id)}
                  >
                    {editing === product.id ? 'Cerrar' : 'Editar'}
                  </button>
                  <button
                    className="admin-amb-btn admin-amb-btn--delete"
                    onClick={() => handleDelete(product.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {editing === product.id && (
                <ProductEditor
                  product={product}
                  photos={photosMap[product.id] || []}
                  onUpdate={fetchProducts}
                  setMessage={setMessage}
                />
              )}
            </div>
          ))}

          {products.length === 0 && (
            <p style={{ color: '#888', textAlign: 'center', padding: '2rem 0' }}>
              No hay productos en esta categoría.
            </p>
          )}
        </div>
      )}

      <button className="admin-homepage-save" onClick={handleAdd} style={{ marginTop: '1.5rem' }}>
        + Añadir producto
      </button>
    </div>
  );
}

function ProductEditor({ product, photos: initialPhotos, onUpdate, setMessage }) {
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [imageUrl, setImageUrl] = useState(product.image_url || '');
  const [photos, setPhotos] = useState(initialPhotos);
  const [saving, setSaving] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  async function handleMainImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMain(true);
    try {
      const url = await uploadImage(file, `products/${product.id}`);
      setImageUrl(url);
      setMessage('Imagen principal subida. Guarda para aplicar.');
    } catch (err) {
      setMessage('Error subiendo imagen: ' + err.message);
    } finally {
      setUploadingMain(false);
    }
  }

  async function handlePhotoUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingPhoto(true);
    try {
      const maxOrder = photos.reduce((max, p) => Math.max(max, p.display_order), 0);
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImage(files[i], `products/${product.id}`);
        const { data, error } = await supabase
          .from('product_photos')
          .insert({
            product_id: product.id,
            image_url: url,
            display_order: maxOrder + i + 1,
          })
          .select()
          .maybeSingle();
        if (error) throw error;
        if (data) setPhotos((prev) => [...prev, data]);
      }
      setMessage('Fotos subidas correctamente.');
    } catch (err) {
      setMessage('Error subiendo fotos: ' + err.message);
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleDeletePhoto(photoId) {
    const { error } = await supabase.from('product_photos').delete().eq('id', photoId);
    if (error) {
      setMessage('Error eliminando foto: ' + error.message);
      return;
    }
    setPhotos(photos.filter((p) => p.id !== photoId));
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name,
          category,
          image_url: imageUrl,
        })
        .eq('id', product.id);
      if (error) throw error;
      setMessage('Producto guardado correctamente.');
      onUpdate();
    } catch (err) {
      setMessage('Error guardando: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-ambiente-editor">
      <div className="admin-ambiente-editor-fields">
        <label>
          Nombre del producto
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Categoría (texto visible)
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        </label>
      </div>

      <div className="admin-ambiente-editor-cover">
        <h4>Imagen principal</h4>
        <div className="admin-ambiente-cover-preview">
          {imageUrl && <img src={imageUrl} alt="" />}
        </div>
        <label className="admin-homepage-upload-btn">
          {uploadingMain ? 'Subiendo...' : 'Cambiar imagen principal'}
          <input type="file" accept="image/*" onChange={handleMainImageUpload} disabled={uploadingMain} />
        </label>
      </div>

      <div className="admin-ambiente-editor-gallery">
        <h4>Fotos adicionales ({photos.length})</h4>
        <div className="admin-ambiente-photos-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="admin-ambiente-photo-item">
              <img src={photo.image_url} alt="" />
              <button
                className="admin-ambiente-photo-delete"
                onClick={() => handleDeletePhoto(photo.id)}
                title="Eliminar foto"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <label className="admin-homepage-upload-btn" style={{ marginTop: '0.75rem' }}>
          {uploadingPhoto ? 'Subiendo...' : '+ Añadir fotos'}
          <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} disabled={uploadingPhoto} />
        </label>
      </div>

      <button className="admin-homepage-save" onClick={handleSave} disabled={saving}>
        {saving ? 'Guardando...' : 'Guardar producto'}
      </button>
    </div>
  );
}
