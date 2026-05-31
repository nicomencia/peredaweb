import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './AdminHomepage.css';

export default function AdminHomepage() {
  const [logoUrl, setLogoUrl] = useState('');
  const [bgUrl, setBgUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['hero_logo', 'hero_background']);

    if (data) {
      data.forEach((row) => {
        if (row.key === 'hero_logo') setLogoUrl(row.value);
        if (row.key === 'hero_background') setBgUrl(row.value);
      });
    }
  }

  async function uploadFile(file, folder) {
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('site-assets')
      .upload(fileName, file, { cacheControl: '3600', upsert: true });

    if (error) throw error;

    const { data } = supabase.storage
      .from('site-assets')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    setMessage('');
    try {
      const url = await uploadFile(file, 'logo');
      setLogoUrl(url);
      setMessage('Logo subido. Pulsa "Guardar cambios" para aplicar.');
    } catch (err) {
      setMessage('Error subiendo el logo: ' + err.message);
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleBgUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBg(true);
    setMessage('');
    try {
      const url = await uploadFile(file, 'background');
      setBgUrl(url);
      setMessage('Imagen de fondo subida. Pulsa "Guardar cambios" para aplicar.');
    } catch (err) {
      setMessage('Error subiendo la imagen: ' + err.message);
    } finally {
      setUploadingBg(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      const { error: e1 } = await supabase
        .from('site_settings')
        .update({ value: logoUrl, updated_at: new Date().toISOString() })
        .eq('key', 'hero_logo');

      const { error: e2 } = await supabase
        .from('site_settings')
        .update({ value: bgUrl, updated_at: new Date().toISOString() })
        .eq('key', 'hero_background');

      if (e1 || e2) throw e1 || e2;
      setMessage('Cambios guardados correctamente.');
    } catch (err) {
      setMessage('Error guardando: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-homepage">
      <h2>Portada (Home)</h2>
      <p className="admin-homepage-desc">Edita el logo y la imagen de fondo de la portada.</p>

      {message && <div className="admin-homepage-msg">{message}</div>}

      <div className="admin-homepage-grid">
        <div className="admin-homepage-card">
          <h3>Logo</h3>
          <div className="admin-homepage-preview">
            {logoUrl && <img src={logoUrl} alt="Logo actual" />}
          </div>
          <label className="admin-homepage-upload-btn">
            {uploadingLogo ? 'Subiendo...' : 'Cambiar logo'}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={uploadingLogo}
            />
          </label>
        </div>

        <div className="admin-homepage-card">
          <h3>Imagen de fondo</h3>
          <div className="admin-homepage-preview admin-homepage-preview--bg">
            {bgUrl && <img src={bgUrl} alt="Fondo actual" />}
          </div>
          <label className="admin-homepage-upload-btn">
            {uploadingBg ? 'Subiendo...' : 'Cambiar imagen de fondo'}
            <input
              type="file"
              accept="image/*"
              onChange={handleBgUpload}
              disabled={uploadingBg}
            />
          </label>
        </div>
      </div>

      <button
        className="admin-homepage-save"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </div>
  );
}
