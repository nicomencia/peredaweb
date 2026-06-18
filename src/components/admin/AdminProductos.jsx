import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
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

async function upsertSetting(key, value) {
  const { data: existing } = await api
    .from('site_settings')
    .select('id')
    .eq('key', key)
    .maybeSingle();
  if (existing) {
    return api.from('site_settings').update({ value }).eq('key', key);
  }
  return api.from('site_settings').insert({ key, value });
}

export default function AdminProductos() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].key);
  const [message, setMessage] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [savingDesc, setSavingDesc] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  useEffect(() => {
    fetchCatDesc();
    fetchCatPhotos();
  }, [activeCategory]);

  async function fetchCatDesc() {
    const { data } = await api
      .from('site_settings')
      .select('value')
      .eq('key', `category_desc_${activeCategory}`)
      .maybeSingle();
    setCatDesc(data?.value || '');
  }

  async function saveCatDesc() {
    setSavingDesc(true);
    const { error } = await upsertSetting(`category_desc_${activeCategory}`, catDesc);
    setMessage(error ? 'Error guardando descripción: ' + error.message : 'Descripción guardada.');
    setSavingDesc(false);
  }

  async function fetchCatPhotos() {
    const { data } = await api
      .from('site_settings')
      .select('value')
      .eq('key', `category_photos_${activeCategory}`)
      .maybeSingle();
    let arr = [];
    if (data?.value) {
      try {
        const parsed = JSON.parse(data.value);
        if (Array.isArray(parsed)) arr = parsed.filter(Boolean);
      } catch {
        arr = [];
      }
    }
    setPhotos(arr);
  }

  async function savePhotos(next) {
    setPhotos(next);
    const { error } = await upsertSetting(`category_photos_${activeCategory}`, JSON.stringify(next));
    if (error) setMessage('Error guardando fotos: ' + error.message);
  }

  async function handlePhotosUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingPhotos(true);
    setMessage('');
    try {
      const urls = [];
      for (const file of files) {
        urls.push(await uploadImage(file, `categorias/${activeCategory}`));
      }
      await savePhotos([...photos, ...urls]);
      setMessage('Fotos añadidas correctamente.');
    } catch (err) {
      setMessage('Error subiendo fotos: ' + err.message);
    } finally {
      setUploadingPhotos(false);
      e.target.value = '';
    }
  }

  async function handleDeletePhoto(url) {
    await savePhotos(photos.filter((u) => u !== url));
    setMessage('Foto eliminada.');
  }

  function movePhoto(index, dir) {
    const target = index + dir;
    if (target < 0 || target >= photos.length) return;
    const next = photos.slice();
    [next[index], next[target]] = [next[target], next[index]];
    savePhotos(next);
  }

  return (
    <div className="admin-homepage">
      <h2>Productos</h2>
      <p className="admin-homepage-desc">
        Para cada categoría puedes editar su texto descriptivo, las fotos del carrusel y las marcas.
      </p>

      {message && <div className="admin-homepage-msg">{message}</div>}

      <div className="admin-productos-cats">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`admin-productos-cat-btn${activeCategory === cat.key ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="admin-productos-desc-section">
        <label className="admin-productos-desc-label">
          Texto descriptivo de la categoría
          <textarea
            rows={3}
            value={catDesc}
            onChange={(e) => setCatDesc(e.target.value)}
            placeholder="Escribe una descripción para esta categoría..."
          />
        </label>
        <button className="admin-productos-desc-save" onClick={saveCatDesc} disabled={savingDesc}>
          {savingDesc ? 'Guardando...' : 'Guardar descripción'}
        </button>
      </div>

      <div className="admin-productos-desc-section">
        <label className="admin-productos-desc-label">Fotos de la categoría (carrusel)</label>
        <p className="admin-homepage-desc">
          Estas fotos se muestran como carrusel al entrar en la categoría. Usa las flechas para ordenarlas
          (la primera es la que se ve al abrir).
        </p>
        {photos.length > 0 && (
          <div className="admin-cat-photos-grid">
            {photos.map((url, i) => (
              <div key={url} className="admin-cat-photo-item">
                <img src={url} alt="" />
                <div className="admin-cat-photo-order">
                  <button onClick={() => movePhoto(i, -1)} disabled={i === 0} title="Mover antes" type="button">
                    &#8592;
                  </button>
                  <button onClick={() => movePhoto(i, 1)} disabled={i === photos.length - 1} title="Mover después" type="button">
                    &#8594;
                  </button>
                </div>
                <button
                  className="admin-cat-photo-delete"
                  onClick={() => handleDeletePhoto(url)}
                  title="Eliminar foto"
                  type="button"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="admin-homepage-upload-btn" style={{ marginTop: '0.75rem', display: 'inline-block' }}>
          {uploadingPhotos ? 'Subiendo...' : '+ Añadir fotos'}
          <input type="file" accept="image/*" multiple onChange={handlePhotosUpload} disabled={uploadingPhotos} />
        </label>
      </div>

      <div style={{ marginTop: '3rem', borderTop: '1px solid #e0e0e0', paddingTop: '2rem' }}>
        <BrandsManager category={activeCategory} />
      </div>
    </div>
  );
}

function BrandsManager({ category }) {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBrands();
  }, [category]);

  async function fetchBrands() {
    setLoading(true);
    const { data } = await api
      .from('brands')
      .select('*')
      .eq('category', category)
      .order('display_order', { ascending: true });
    if (data) setBrands(data);
    setLoading(false);
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const maxOrder = brands.reduce((max, b) => Math.max(max, b.display_order), 0);
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImage(files[i], 'brands');
        const name = files[i].name.replace(/\.[^.]+$/, '');
        const { data, error } = await api
          .from('brands')
          .insert({ name, logo_url: url, display_order: maxOrder + i + 1, category })
          .select()
          .maybeSingle();
        if (error) throw error;
        if (data) setBrands((prev) => [...prev, data]);
      }
      setMessage('Marcas añadidas correctamente.');
    } catch (err) {
      setMessage('Error subiendo logos: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id) {
    const { error } = await api.from('brands').delete().eq('id', id);
    if (error) {
      setMessage('Error eliminando marca: ' + error.message);
      return;
    }
    setBrands(brands.filter((b) => b.id !== id));
  }

  async function handleNameChange(id, newName) {
    setBrands(brands.map((b) => (b.id === id ? { ...b, name: newName } : b)));
  }

  async function handleNameSave(id) {
    const brand = brands.find((b) => b.id === id);
    if (!brand) return;
    await api.from('brands').update({ name: brand.name }).eq('id', id);
  }

  return (
    <>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.25rem' }}>
        Marcas
      </h2>
      <p className="admin-homepage-desc">Logos de marcas que aparecen en el carrusel de esta categoría.</p>

      {message && <div className="admin-homepage-msg">{message}</div>}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="admin-brands-grid">
          {brands.map((brand) => (
            <div key={brand.id} className="admin-brand-item">
              <div className="admin-brand-logo">
                <img src={brand.logo_url} alt={brand.name} />
              </div>
              <input
                className="admin-brand-name"
                type="text"
                value={brand.name}
                onChange={(e) => handleNameChange(brand.id, e.target.value)}
                onBlur={() => handleNameSave(brand.id)}
              />
              <button
                className="admin-brand-delete"
                onClick={() => handleDelete(brand.id)}
                title="Eliminar marca"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="admin-homepage-upload-btn" style={{ marginTop: '1rem', display: 'inline-block' }}>
        {uploading ? 'Subiendo...' : '+ Añadir logos de marcas'}
        <input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading} />
      </label>
    </>
  );
}
