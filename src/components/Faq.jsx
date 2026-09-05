import { useState, useEffect } from 'react';
import { cachedSetting, loadSettings } from '../lib/settings';
import './SimplePage.css';
import './Faq.css';

function parseFaq(value) {
  try {
    const arr = JSON.parse(value || '[]');
    return Array.isArray(arr) ? arr.filter((it) => it && it.q) : [];
  } catch {
    return [];
  }
}

// General FAQ, aimed at private customers. Deliberately a separate settings key
// from the Área Profesional FAQ (`area_faq`), which answers trade/installer
// questions — the client keeps the two audiences apart on purpose.
export default function Faq() {
  const [title, setTitle] = useState(() => cachedSetting('faq_title', 'Preguntas frecuentes'));
  const [subtitle, setSubtitle] = useState(() => cachedSetting('faq_subtitle', ''));
  const [items, setItems] = useState(() => parseFaq(cachedSetting('faq_general', '[]')));
  const [open, setOpen] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await loadSettings(['faq_title', 'faq_subtitle', 'faq_general']);
      if (data) {
        data.forEach((row) => {
          if (row.key === 'faq_title' && row.value) setTitle(row.value);
          if (row.key === 'faq_subtitle') setSubtitle(row.value || '');
          if (row.key === 'faq_general') setItems(parseFaq(row.value));
        });
      }
    }
    load();
  }, []);

  return (
    <div className="simple-page">
      <div className="simple-page-hero">
        <span className="eyebrow eyebrow--light">Ayuda</span>
        <h1 className="simple-page-hero-title">{title}</h1>
      </div>

      <section className="simple-page-content faq-section">
        <div className="faq-container">
          {subtitle && <p className="faq-subtitle">{subtitle}</p>}

          {items.length === 0 ? (
            <p className="faq-placeholder">
              Estamos preparando esta sección. Mientras tanto puedes escribirnos desde la página de
              presupuesto o llamarnos al 985 271 026.
            </p>
          ) : (
            <div className="faq-list">
              {items.map((item, i) => (
                <div className={`faq-item ${open === i ? 'open' : ''}`} key={i}>
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => setOpen(open === i ? null : i)}
                    aria-expanded={open === i}
                  >
                    <span>{item.q}</span>
                    <span className="faq-toggle" aria-hidden="true">{open === i ? '–' : '+'}</span>
                  </button>
                  {open === i && item.a && <div className="faq-answer">{item.a}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
