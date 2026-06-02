import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadImage } from '../../lib/upload';
import './AdminHomepage.css';
import './AdminAmbientes.css';

export default function AdminTiendas() {
  const [tiendas, setTiendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTiendas();
  }, []);

  async function fetchTiendas() {
    setLoading(true);
    const { data } = await supabase
      .from('tiendas')
      .select('*, tienda_photos(id, image_url, display_order)')
      .order('display_order', { ascending: true });
    if (data) setTiendas(data);
    setLoading(false);
  }

  async function handleAdd() {
    const maxOrder = tiendas.reduce((max, t) => Math.max(max, t.display_order), 0);
    const { data, error } = await supabase
      .from('tiendas')
      .insert({ name: 'Nueva tienda', display_order: maxOrder + 1 })
      .select()
      .maybeSingle();
    if (error) {
      setMessage('Error creando tienda: ' + error.message);
      return;
    }
    if (data) {
      setTiendas([...tiendas, { ...data, tienda_photos: [] }]);
      setEditing(data.id);
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar esta tienda y todas sus fotos?')) return;
    const { error } = await supabase.from('tiendas').delete().eq('id', id);
    if (error) {
      setMessage('Error eliminando: ' + error.message);
      return;
    }
    setTiendas(tiendas.filter((t) => t.id !== id));
    if (editing === id) setEditing(null);
    setMessage('Tienda eliminada.');
  }

  return (
    <div className="admin-homepage">
      <h2>Nuestras Tiendas</h2>
      <p className="admin-homepage-desc">Gestiona las tiendas, sus datos e imágenes.</p>

      {message && <div className="admin-homepage-msg">{message}</div>}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="admin-ambientes-list">
          {tiendas.map((tienda) => (
            <div key={tienda.id} className="admin-ambiente-row">
              <div className="admin-ambiente-row-header">
                <div className="admin-ambiente-row-preview">
                  {tienda.cover_image_url && <img src={tienda.cover_image_url} alt="" />}
                </div>
                <div className="admin-ambiente-row-info">
                  <strong>{tienda.name} - {tienda.address}</strong>
                  <span className="admin-ambiente-row-count">
                    {(tienda.tienda_photos?.length || 0)} fotos
                  </span>
                </div>
                <div className="admin-ambiente-row-actions">
                  <button
                    className="admin-amb-btn admin-amb-btn--edit"
                    onClick={() => setEditing(editing === tienda.id ? null : tienda.id)}
                  >
                    {editing === tienda.id ? 'Cerrar' : 'Editar'}
                  </button>
                  <button
                    className="admin-amb-btn admin-amb-btn--delete"
                    onClick={() => handleDelete(tienda.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {editing === tienda.id && (
                <TiendaEditor
                  tienda={tienda}
                  onUpdate={fetchTiendas}
                  setMessage={setMessage}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <button className="admin-homepage-save" onClick={handleAdd} style={{ marginTop: '1.5rem' }}>
        + Añadir tienda
      </button>
    </div>
  );
}

function TiendaEditor({ tienda, onUpdate, setMessage }) {
  const [name, setName] = useState(tienda.name);
  const [address, setAddress] = useState(tienda.address);
  const [postalCode, setPostalCode] = useState(tienda.postal_code);
  const [phone, setPhone] = useState(tienda.phone);
  const [hoursTienda, setHoursTienda] = useState(tienda.hours_tienda);
  const [hoursFontaneria, setHoursFontaneria] = useState(tienda.hours_fontaneria);
  const [hoursSabados, setHoursSabados] = useState(tienda.hours_sabados);
  const [hoursVerano, setHoursVerano] = useState(tienda.hours_verano);
  const [emails, setEmails] = useState((tienda.emails || []).join('\n'));
  const [lat, setLat] = useState(tienda.lat?.toString() || '');
  const [lon, setLon] = useState(tienda.lon?.toString() || '');
  const [coverUrl, setCoverUrl] = useState(tienda.cover_image_url || '');
  const [photos, setPhotos] = useState(
    (tienda.tienda_photos || []).sort((a, b) => a.display_order - b.display_order)
  );
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  async function handleCoverUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const url = await uploadImage(file, `tiendas/${tienda.id}`);
      setCoverUrl(url);
      setMessage('Imagen subida. Guarda para aplicar.');
    } catch (err) {
      setMessage('Error subiendo imagen: ' + err.message);
    } finally {
      setUploadingCover(false);
    }
  }

  async function handlePhotoUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingPhoto(true);
    try {
      const maxOrder = photos.reduce((max, p) => Math.max(max, p.display_order), 0);
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImage(files[i], `tiendas/${tienda.id}`);
        const { data, error } = await supabase
          .from('tienda_photos')
          .insert({
            tienda_id: tienda.id,
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
    const { error } = await supabase.from('tienda_photos').delete().eq('id', photoId);
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
      const emailsArray = emails
        .split('\n')
        .map((e) => e.trim())
        .filter(Boolean);

      const { error } = await supabase
        .from('tiendas')
        .update({
          name,
          address,
          postal_code: postalCode,
          phone,
          hours_tienda: hoursTienda,
          hours_fontaneria: hoursFontaneria,
          hours_sabados: hoursSabados,
          hours_verano: hoursVerano,
          emails: emailsArray,
          lat: parseFloat(lat) || 0,
          lon: parseFloat(lon) || 0,
          cover_image_url: coverUrl || null,
        })
        .eq('id', tienda.id);
      if (error) throw error;
      setMessage('Tienda guardada correctamente.');
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
        <div className="admin-tienda-fields-grid">
          <label>
            Nombre / Ciudad
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Dirección
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>
          <label>
            Código Postal y Ciudad
            <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
          </label>
          <label>
            Teléfono
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
        </div>

        <div className="admin-tienda-fields-grid">
          <label>
            Horario Tienda Exposición
            <input type="text" value={hoursTienda} onChange={(e) => setHoursTienda(e.target.value)} />
          </label>
          <label>
            Horario Fontanería y Construcción
            <input type="text" value={hoursFontaneria} onChange={(e) => setHoursFontaneria(e.target.value)} />
          </label>
          <label>
            Horario Sábados
            <input type="text" value={hoursSabados} onChange={(e) => setHoursSabados(e.target.value)} />
          </label>
          <label>
            Nota Verano
            <input type="text" value={hoursVerano} onChange={(e) => setHoursVerano(e.target.value)} />
          </label>
        </div>

        <label>
          Emails (uno por línea)
          <textarea rows={4} value={emails} onChange={(e) => setEmails(e.target.value)} />
        </label>

        <div className="admin-tienda-fields-grid">
          <label>
            Latitud
            <input type="text" value={lat} onChange={(e) => setLat(e.target.value)} />
          </label>
          <label>
            Longitud
            <input type="text" value={lon} onChange={(e) => setLon(e.target.value)} />
          </label>
        </div>
      </div>

      <div className="admin-ambiente-editor-cover">
        <h4>Imagen principal</h4>
        <div className="admin-ambiente-cover-preview">
          {coverUrl && <img src={coverUrl} alt="" />}
        </div>
        <label className="admin-homepage-upload-btn">
          {uploadingCover ? 'Subiendo...' : 'Cambiar imagen principal'}
          <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploadingCover} />
        </label>
      </div>

      <div className="admin-ambiente-editor-gallery">
        <h4>Galería de fotos ({photos.length})</h4>
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
        {saving ? 'Guardando...' : 'Guardar tienda'}
      </button>
    </div>
  );
}
