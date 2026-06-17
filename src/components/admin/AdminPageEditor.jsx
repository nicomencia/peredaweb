import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { uploadImage } from '../../lib/upload';
import './AdminHomepage.css';

export default function AdminPageEditor({ title, description, fields }) {
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      const keys = fields.map((f) => f.key);
      const { data } = await api
        .from('site_settings')
        .select('key, value')
        .in('key', keys);

      if (data) {
        const loaded = {};
        data.forEach((row) => {
          loaded[row.key] = row.value;
        });
        setValues(loaded);
      }
    }
    load();
  }, [fields]);

  function handleChange(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  // FAQ fields are stored as a JSON array string: [{ q, a }, ...]
  function parseFaq(value) {
    try {
      const arr = JSON.parse(value || '[]');
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }
  function writeFaq(key, items) {
    handleChange(key, JSON.stringify(items));
  }
  function setFaqItem(key, index, prop, value) {
    const items = parseFaq(values[key]);
    items[index] = { ...items[index], [prop]: value };
    writeFaq(key, items);
  }
  function addFaqItem(key) {
    writeFaq(key, [...parseFaq(values[key]), { q: '', a: '' }]);
  }
  function removeFaqItem(key, index) {
    writeFaq(key, parseFaq(values[key]).filter((_, i) => i !== index));
  }

  // Generic repeatable list (type 'list'), stored as a JSON array of objects with
  // the sub-fields declared in field.fields.
  function parseList(value) {
    try {
      const arr = JSON.parse(value || '[]');
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }
  function setListItem(key, index, prop, value) {
    const items = parseList(values[key]);
    items[index] = { ...items[index], [prop]: value };
    handleChange(key, JSON.stringify(items));
  }
  function addListItem(key, subfields) {
    const blank = {};
    subfields.forEach((f) => { blank[f.key] = ''; });
    handleChange(key, JSON.stringify([...parseList(values[key]), blank]));
  }
  function removeListItem(key, index) {
    handleChange(key, JSON.stringify(parseList(values[key]).filter((_, i) => i !== index)));
  }

  async function handleImageUpload(key, file, folder) {
    if (!file) return;
    setUploading(key);
    setMessage('');
    try {
      const url = await uploadImage(file, folder || 'paginas');
      handleChange(key, url);
      setMessage('Imagen subida. Pulsa "Guardar cambios" para aplicar.');
    } catch (err) {
      setMessage('Error subiendo la imagen: ' + err.message);
    } finally {
      setUploading('');
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      for (const field of fields) {
        const { error } = await api
          .from('site_settings')
          .update({ value: values[field.key] || '', updated_at: new Date().toISOString() })
          .eq('key', field.key);
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
      <h2>{title}</h2>
      <p className="admin-homepage-desc">{description}</p>

      {message && <div className="admin-homepage-msg">{message}</div>}

      <div className="admin-homepage-ctas">
        {fields.map((field) => (
          <div className="admin-homepage-cta-card" key={field.key}>
            <div className="admin-homepage-cta-fields">
              {field.type === 'list' ? (
                <div className="admin-faq-editor">
                  <span className="admin-pageeditor-label">{field.label}</span>
                  {parseList(values[field.key]).map((item, i) => (
                    <div className="admin-faq-row" key={i}>
                      {field.fields.map((sf) => (
                        sf.textarea ? (
                          <textarea
                            key={sf.key}
                            rows="2"
                            placeholder={sf.label}
                            value={item[sf.key] || ''}
                            onChange={(e) => setListItem(field.key, i, sf.key, e.target.value)}
                          />
                        ) : (
                          <input
                            key={sf.key}
                            type="text"
                            placeholder={sf.label}
                            value={item[sf.key] || ''}
                            onChange={(e) => setListItem(field.key, i, sf.key, e.target.value)}
                          />
                        )
                      ))}
                      <button type="button" className="admin-faq-remove" onClick={() => removeListItem(field.key, i)}>
                        Eliminar
                      </button>
                    </div>
                  ))}
                  <button type="button" className="admin-faq-add" onClick={() => addListItem(field.key, field.fields)}>
                    {field.addLabel || '+ Añadir'}
                  </button>
                </div>
              ) : field.type === 'faq' ? (
                <div className="admin-faq-editor">
                  <span className="admin-pageeditor-label">{field.label}</span>
                  {parseFaq(values[field.key]).map((item, i) => (
                    <div className="admin-faq-row" key={i}>
                      <input
                        type="text"
                        placeholder="Pregunta"
                        value={item.q || ''}
                        onChange={(e) => setFaqItem(field.key, i, 'q', e.target.value)}
                      />
                      <textarea
                        rows="3"
                        placeholder="Respuesta"
                        value={item.a || ''}
                        onChange={(e) => setFaqItem(field.key, i, 'a', e.target.value)}
                      />
                      <button type="button" className="admin-faq-remove" onClick={() => removeFaqItem(field.key, i)}>
                        Eliminar
                      </button>
                    </div>
                  ))}
                  <button type="button" className="admin-faq-add" onClick={() => addFaqItem(field.key)}>
                    + Añadir pregunta
                  </button>
                </div>
              ) : field.type === 'image' ? (
                <div>
                  <span className="admin-pageeditor-label">{field.label}</span>
                  <div className="admin-homepage-preview">
                    {values[field.key] && <img src={values[field.key]} alt={field.label} />}
                  </div>
                  <label className="admin-homepage-upload-btn">
                    {uploading === field.key ? 'Subiendo...' : 'Cambiar imagen'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(field.key, e.target.files?.[0], field.folder)}
                      disabled={uploading === field.key}
                    />
                  </label>
                </div>
              ) : (
                <label>
                  {field.label}
                  {field.type === 'textarea' ? (
                    <textarea
                      rows={field.rows || 4}
                      value={values[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    />
                  )}
                </label>
              )}
            </div>
          </div>
        ))}
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
