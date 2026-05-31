import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadImage } from '../../lib/upload';
import './AdminHomepage.css';

const defaultCtas = [
  { title: 'Pide cita para tus proyectos de reformas', label: 'PIDE CITA', description: '' },
  { title: 'Financiación sin intereses', label: 'CONSULTA NUESTRA FINANCIACIÓN', description: '' },
  { title: 'Asesoramiento y servicio post venta', label: 'SOLICITA PRESUPUESTO', description: '' },
  { title: 'Conoce las ventajas para el profesional', label: 'HAZTE CLIENTE', description: '' },
];

export default function AdminHomepage() {
  const [logoUrl, setLogoUrl] = useState('');
  const [bgUrl, setBgUrl] = useState('');
  const [ctas, setCtas] = useState(defaultCtas);
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
      .in('key', [
        'hero_logo', 'hero_background',
        'cta_1_title', 'cta_1_label', 'cta_1_description',
        'cta_2_title', 'cta_2_label', 'cta_2_description',
        'cta_3_title', 'cta_3_label', 'cta_3_description',
        'cta_4_title', 'cta_4_label', 'cta_4_description',
      ]);

    if (data) {
      const loadedCtas = [...defaultCtas];
      data.forEach((row) => {
        if (row.key === 'hero_logo') setLogoUrl(row.value);
        if (row.key === 'hero_background') setBgUrl(row.value);
        const ctaMatch = row.key.match(/^cta_(\d)_(title|label|description)$/);
        if (ctaMatch) {
          const idx = parseInt(ctaMatch[1]) - 1;
          const field = ctaMatch[2];
          loadedCtas[idx] = { ...loadedCtas[idx], [field]: row.value };
        }
      });
      setCtas(loadedCtas);
    }
  }

  function handleCtaChange(index, field, value) {
    setCtas((prev) => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    setMessage('');
    try {
      const url = await uploadImage(file, 'logo');
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
      const url = await uploadImage(file, 'background');
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
      const updates = [
        { key: 'hero_logo', value: logoUrl },
        { key: 'hero_background', value: bgUrl },
        ...ctas.flatMap((cta, i) => [
          { key: `cta_${i + 1}_title`, value: cta.title },
          { key: `cta_${i + 1}_label`, value: cta.label },
          { key: `cta_${i + 1}_description`, value: cta.description },
        ]),
      ];

      for (const item of updates) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: item.value, updated_at: new Date().toISOString() })
          .eq('key', item.key);
        if (error) throw error;
      }

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
      <p className="admin-homepage-desc">Edita el logo, la imagen de fondo y los botones de la portada.</p>

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

      <div className="admin-homepage-section">
        <h3>Botones de la portada</h3>
        <div className="admin-homepage-ctas">
          {ctas.map((cta, i) => (
            <div className="admin-homepage-cta-card" key={i}>
              <span className="admin-homepage-cta-number">{i + 1}</span>
              <div className="admin-homepage-cta-fields">
                <label>
                  Título
                  <input
                    type="text"
                    value={cta.title}
                    onChange={(e) => handleCtaChange(i, 'title', e.target.value)}
                  />
                </label>
                <label>
                  Texto del botón
                  <input
                    type="text"
                    value={cta.label}
                    onChange={(e) => handleCtaChange(i, 'label', e.target.value)}
                  />
                </label>
                <label>
                  Texto de la página
                  <textarea
                    rows="3"
                    value={cta.description}
                    onChange={(e) => handleCtaChange(i, 'description', e.target.value)}
                  />
                </label>
              </div>
            </div>
          ))}
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
