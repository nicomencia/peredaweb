import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadImage } from '../../lib/upload';
import './AdminHomepage.css';
import './AdminAmbientes.css';

export default function AdminAmbientes() {
  const [ambientes, setAmbientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAmbientes();
  }, []);

  async function fetchAmbientes() {
    setLoading(true);
    const { data } = await supabase
      .from('ambientes')
      .select('*, ambiente_photos(id, image_url, display_order)')
      .order('display_order', { ascending: true });
    if (data) setAmbientes(data);
    setLoading(false);
  }

  async function handleAdd() {
    const maxOrder = ambientes.reduce((max, a) => Math.max(max, a.display_order), 0);
    const { data, error } = await supabase
      .from('ambientes')
      .insert({ title: 'Nuevo ambiente', display_order: maxOrder + 1 })
      .select()
      .maybeSingle();
    if (error) {
      setMessage('Error creando ambiente: ' + error.message);
      return;
    }
    if (data) {
      setAmbientes([...ambientes, { ...data, ambiente_photos: [] }]);
      setEditing(data.id);
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este ambiente y todas sus fotos?')) return;
    const { error } = await supabase.from('ambientes').delete().eq('id', id);
    if (error) {
      setMessage('Error eliminando: ' + error.message);
      return;
    }
    setAmbientes(ambientes.filter((a) => a.id !== id));
    if (editing === id) setEditing(null);
    setMessage('Ambiente eliminado.');
  }

  return (
    <div className="admin-homepage">
      <h2>Inspírate - Ambientes</h2>
      <p className="admin-homepage-desc">Gestiona los ambientes y sus fotos.</p>

      {message && <div className="admin-homepage-msg">{message}</div>}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="admin-ambientes-list">
          {ambientes.map((amb) => (
            <div key={amb.id} className="admin-ambiente-row">
              <div className="admin-ambiente-row-header">
                <div className="admin-ambiente-row-preview">
                  {amb.cover_image_url && <img src={amb.cover_image_url} alt="" />}
                </div>
                <div className="admin-ambiente-row-info">
                  <strong>{amb.title}</strong>
                  <span className="admin-ambiente-row-count">
                    {(amb.ambiente_photos?.length || 0)} fotos
                  </span>
                </div>
                <div className="admin-ambiente-row-actions">
                  <button
                    className="admin-amb-btn admin-amb-btn--edit"
                    onClick={() => setEditing(editing === amb.id ? null : amb.id)}
                  >
                    {editing === amb.id ? 'Cerrar' : 'Editar'}
                  </button>
                  <button
                    className="admin-amb-btn admin-amb-btn--delete"
                    onClick={() => handleDelete(amb.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {editing === amb.id && (
                <AmbienteEditor
                  ambiente={amb}
                  onUpdate={fetchAmbientes}
                  setMessage={setMessage}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <button className="admin-homepage-save" onClick={handleAdd} style={{ marginTop: '1.5rem' }}>
        + Añadir ambiente
      </button>
    </div>
  );
}

function AmbienteEditor({ ambiente, onUpdate, setMessage }) {
  const [title, setTitle] = useState(ambiente.title);
  const [coverUrl, setCoverUrl] = useState(ambiente.cover_image_url || '');
  const [photos, setPhotos] = useState(
    (ambiente.ambiente_photos || []).sort((a, b) => a.display_order - b.display_order)
  );
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  async function handleCoverUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const url = await uploadImage(file, `ambientes/${ambiente.id}`);
      setCoverUrl(url);
      setMessage('Imagen de portada subida. Guarda para aplicar.');
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
        const url = await uploadImage(files[i], `ambientes/${ambiente.id}`);
        const { data, error } = await supabase
          .from('ambiente_photos')
          .insert({
            ambiente_id: ambiente.id,
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
    const { error } = await supabase.from('ambiente_photos').delete().eq('id', photoId);
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
        .from('ambientes')
        .update({
          title,
          cover_image_url: coverUrl,
        })
        .eq('id', ambiente.id);
      if (error) throw error;
      setMessage('Ambiente guardado correctamente.');
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
          Título
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
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
        {saving ? 'Guardando...' : 'Guardar ambiente'}
      </button>
    </div>
  );
}
