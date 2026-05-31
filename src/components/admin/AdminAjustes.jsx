import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './AdminHomepage.css';
import './AdminAjustes.css';

const SETTINGS_KEYS = [
  'footer_description',
  'footer_facebook_url',
  'footer_instagram_url',
  'color_primary',
  'color_secondary',
  'color_dark',
  'navbar_logo',
];

export default function AdminAjustes() {
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [cleaning, setCleaning] = useState(false);
  const [cleanupResult, setCleanupResult] = useState('');

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', SETTINGS_KEYS);
      if (data) {
        const loaded = {};
        data.forEach((row) => { loaded[row.key] = row.value; });
        setValues(loaded);
      }
    }
    load();
  }, []);

  function handleChange(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage('');
    try {
      const ext = file.name.split('.').pop();
      const fileName = `logo/${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('site-assets').getPublicUrl(fileName);
      handleChange('navbar_logo', data.publicUrl);
      setMessage('Logo subido. Pulsa "Guardar cambios" para aplicar.');
    } catch (err) {
      setMessage('Error subiendo logo: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      for (const key of SETTINGS_KEYS) {
        if (values[key] === undefined) continue;
        const { error } = await supabase
          .from('site_settings')
          .update({ value: values[key], updated_at: new Date().toISOString() })
          .eq('key', key);
        if (error) throw error;
      }
      setMessage('Cambios guardados correctamente. Recarga la web para ver los colores actualizados.');
    } catch (err) {
      setMessage('Error guardando: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleCleanup() {
    setCleaning(true);
    setCleanupResult('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cleanup-storage`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      if (result.error) {
        setCleanupResult('Error: ' + result.error);
      } else {
        setCleanupResult(result.message);
      }
    } catch (err) {
      setCleanupResult('Error: ' + err.message);
    } finally {
      setCleaning(false);
    }
  }

  return (
    <div className="admin-homepage">
      <h2>Ajustes generales</h2>
      <p className="admin-homepage-desc">Colores de marca, logo de la navbar y contenido del footer.</p>

      {message && <div className="admin-homepage-msg">{message}</div>}

      <div className="admin-ajustes-section">
        <h3>Colores</h3>
        <div className="admin-ajustes-colors">
          <div className="admin-ajustes-color-item">
            <label>Color principal</label>
            <div className="admin-ajustes-color-row">
              <input
                type="color"
                value={values.color_primary || '#002FA7'}
                onChange={(e) => handleChange('color_primary', e.target.value)}
              />
              <input
                type="text"
                value={values.color_primary || '#002FA7'}
                onChange={(e) => handleChange('color_primary', e.target.value)}
              />
            </div>
          </div>
          <div className="admin-ajustes-color-item">
            <label>Color de fondo secundario</label>
            <div className="admin-ajustes-color-row">
              <input
                type="color"
                value={values.color_secondary || '#F8F6F4'}
                onChange={(e) => handleChange('color_secondary', e.target.value)}
              />
              <input
                type="text"
                value={values.color_secondary || '#F8F6F4'}
                onChange={(e) => handleChange('color_secondary', e.target.value)}
              />
            </div>
          </div>
          <div className="admin-ajustes-color-item">
            <label>Color de texto oscuro</label>
            <div className="admin-ajustes-color-row">
              <input
                type="color"
                value={values.color_dark || '#1A1A1A'}
                onChange={(e) => handleChange('color_dark', e.target.value)}
              />
              <input
                type="text"
                value={values.color_dark || '#1A1A1A'}
                onChange={(e) => handleChange('color_dark', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="admin-ajustes-section">
        <h3>Logo (navbar y footer)</h3>
        <div className="admin-ajustes-logo">
          <div className="admin-ajustes-logo-preview">
            {values.navbar_logo && <img src={values.navbar_logo} alt="Logo actual" />}
          </div>
          <label className="admin-homepage-upload-btn">
            {uploading ? 'Subiendo...' : 'Cambiar logo'}
            <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="admin-ajustes-section">
        <h3>Footer</h3>
        <div className="admin-ajustes-fields">
          <label>
            Descripcion (texto de marca)
            <textarea
              rows="3"
              value={values.footer_description || ''}
              onChange={(e) => handleChange('footer_description', e.target.value)}
            />
          </label>
          <label>
            URL de Facebook
            <input
              type="text"
              value={values.footer_facebook_url || ''}
              onChange={(e) => handleChange('footer_facebook_url', e.target.value)}
            />
          </label>
          <label>
            URL de Instagram
            <input
              type="text"
              value={values.footer_instagram_url || ''}
              onChange={(e) => handleChange('footer_instagram_url', e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="admin-ajustes-section">
        <h3>Almacenamiento</h3>
        <p className="admin-ajustes-storage-desc">
          Elimina archivos de imagen que ya no estan en uso (logos antiguos, fondos reemplazados, fotos de ambientes borradas).
        </p>
        {cleanupResult && <div className="admin-homepage-msg">{cleanupResult}</div>}
        <button
          className="admin-ajustes-cleanup-btn"
          onClick={handleCleanup}
          disabled={cleaning}
        >
          {cleaning ? 'Limpiando...' : 'Limpiar archivos sin usar'}
        </button>
      </div>

      <button className="admin-homepage-save" onClick={handleSave} disabled={saving}>
        {saving ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </div>
  );
}


export default AdminAjustes