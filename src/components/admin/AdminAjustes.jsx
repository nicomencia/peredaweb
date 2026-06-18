import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { uploadImage } from '../../lib/upload';
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
  'footer_logo',
  'contact_phone',
  'shop_url',
  'ecommerce_url',
];

// Confidential keys: hidden from the public API, read via the authenticated endpoint.
const MAIL_KEYS = [
  'mail_to_candidatura',
  'mail_to_denuncia',
  'mail_to_presupuesto',
  'mail_to_cliente',
];
const API_BASE = import.meta.env.VITE_API_BASE || '';

export default function AdminAjustes() {
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      const loaded = {};
      const { data } = await api
        .from('site_settings')
        .select('key, value')
        .in('key', SETTINGS_KEYS);
      if (data) data.forEach((row) => { loaded[row.key] = row.value; });
      // Confidential recipients aren't in the public API — read them authenticated.
      try {
        const res = await fetch(`${API_BASE}/api/admin.php`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get_settings', resource: 'site_settings', keys: MAIL_KEYS }),
        });
        const rows = await res.json();
        if (Array.isArray(rows)) rows.forEach((row) => { loaded[row.key] = row.value; });
      } catch { /* ignore */ }
      setValues(loaded);
    }
    load();
  }, []);

  function handleChange(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleLogoUpload(e, key) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(key);
    setMessage('');
    try {
      const url = await uploadImage(file, 'logo');
      handleChange(key, url);
      setMessage('Logo subido. Pulsa "Guardar cambios" para aplicar.');
    } catch (err) {
      setMessage('Error subiendo logo: ' + err.message);
    } finally {
      setUploading('');
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      for (const key of [...SETTINGS_KEYS, ...MAIL_KEYS]) {
        if (values[key] === undefined) continue;
        const { error } = await api
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
        <h3>Logo superior (barra de navegación y del navegador)</h3>
        <p className="admin-homepage-desc">Se usa en la barra superior y como icono de la pestaña del navegador (favicon).</p>
        <div className="admin-ajustes-logo">
          <div className="admin-ajustes-logo-preview">
            {values.navbar_logo && <img src={values.navbar_logo} alt="Logo superior actual" />}
          </div>
          <label className="admin-homepage-upload-btn">
            {uploading === 'navbar_logo' ? 'Subiendo...' : 'Cambiar logo superior'}
            <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 'navbar_logo')} disabled={uploading === 'navbar_logo'} />
          </label>
        </div>
      </div>

      <div className="admin-ajustes-section">
        <h3>Logo del pie de página</h3>
        <div className="admin-ajustes-logo">
          <div className="admin-ajustes-logo-preview">
            {values.footer_logo && <img src={values.footer_logo} alt="Logo del pie actual" />}
          </div>
          <label className="admin-homepage-upload-btn">
            {uploading === 'footer_logo' ? 'Subiendo...' : 'Cambiar logo del pie'}
            <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 'footer_logo')} disabled={uploading === 'footer_logo'} />
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
        <h3>Contacto y tienda</h3>
        <div className="admin-ajustes-fields">
          <label>
            Teléfono postventa (página de Financiación)
            <input
              type="text"
              value={values.contact_phone || ''}
              onChange={(e) => handleChange('contact_phone', e.target.value)}
            />
          </label>
          <label>
            Enlace de la tienda (botón «Tienda», para todos los clientes)
            <input
              type="text"
              value={values.shop_url || ''}
              onChange={(e) => handleChange('shop_url', e.target.value)}
            />
          </label>
          <label>
            Enlace del ecommerce (botón «Acceso ecommerce», profesionales)
            <input
              type="text"
              value={values.ecommerce_url || ''}
              onChange={(e) => handleChange('ecommerce_url', e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="admin-ajustes-section">
        <h3>Destinatarios de los formularios</h3>
        <p className="admin-homepage-desc">
          Correo que recibe el aviso de cada formulario. Puedes poner varios separados por comas. Si lo dejas vacío, se usa el destinatario por defecto.
        </p>
        <div className="admin-ajustes-fields">
          <label>
            Candidaturas (empleo)
            <input type="text" value={values.mail_to_candidatura || ''} onChange={(e) => handleChange('mail_to_candidatura', e.target.value)} />
          </label>
          <label>
            Canal de denuncias
            <input type="text" value={values.mail_to_denuncia || ''} onChange={(e) => handleChange('mail_to_denuncia', e.target.value)} />
          </label>
          <label>
            Solicitudes de presupuesto
            <input type="text" value={values.mail_to_presupuesto || ''} onChange={(e) => handleChange('mail_to_presupuesto', e.target.value)} />
          </label>
          <label>
            Hazte cliente
            <input type="text" value={values.mail_to_cliente || ''} onChange={(e) => handleChange('mail_to_cliente', e.target.value)} />
          </label>
        </div>
      </div>

      <button className="admin-homepage-save" onClick={handleSave} disabled={saving}>
        {saving ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </div>
  );
}