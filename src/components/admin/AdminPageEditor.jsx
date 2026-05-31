import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './AdminHomepage.css';

export default function AdminPageEditor({ title, description, fields }) {
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      const keys = fields.map((f) => f.key);
      const { data } = await supabase
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

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      for (const field of fields) {
        const { error } = await supabase
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
