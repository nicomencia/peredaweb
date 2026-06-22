import { useState, useEffect } from 'react';
import { cachedSetting, loadSettings } from '../lib/settings';
import './AreaProfesional.css';

// Decorative icons, by card position; text comes from the `area_features` setting.
const FEATURE_ICONS = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
];
const DEFAULT_FEATURES = [
  { title: 'Calidad garantizada', text: 'Trabajamos solo con las mejores marcas del sector para garantizar resultados profesionales' },
  { title: 'Stock permanente', text: 'Amplio inventario disponible para que nunca te falte material en tus proyectos' },
  { title: 'Precios profesionales', text: 'Condiciones especiales y descuentos exclusivos para instaladores profesionales' },
  { title: 'Asesoramiento experto', text: 'Nuestro equipo te asesora personalmente en cada proyecto que emprendas' },
];

export default function AreaProfesional({ setCurrentView }) {
  const [texts, setTexts] = useState({
    area_hero_title: 'Todo para el instalador',
    area_hero_subtitle: 'Tu aliado en cada instalación. Calidad, stock y asesoramiento para profesionales.',
    area_benefits_title: 'Beneficios diseñados para profesionales',
    area_benefits_subtitle: 'Porque aquí encuentras calidad al mejor precio, un amplio stock con primeras marcas, el mejor asesoramiento personalizado y, además, todas las novedades y ofertas al alcance de tu mano.',
  });
  const [bgUrl, setBgUrl] = useState(() => cachedSetting('area_profesional_bg', ''));
  const [ecommerceUrl, setEcommerceUrl] = useState(() => cachedSetting('ecommerce_url', 'https://ecommerce.saneamientos-pereda.com/ecom/login.php'));
  const [faq, setFaq] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [features, setFeatures] = useState(DEFAULT_FEATURES);

  useEffect(() => {
    async function load() {
      const data = await loadSettings(['area_hero_title', 'area_hero_subtitle', 'area_benefits_title', 'area_benefits_subtitle', 'area_profesional_bg', 'area_faq', 'ecommerce_url', 'area_features']);
      if (data) {
        const loaded = { ...texts };
        data.forEach((row) => {
          if (row.key === 'area_profesional_bg') { if (row.value) setBgUrl(row.value); }
          else if (row.key === 'ecommerce_url') { if (row.value) setEcommerceUrl(row.value); }
          else if (row.key === 'area_faq') {
            try {
              const items = JSON.parse(row.value || '[]');
              if (Array.isArray(items)) setFaq(items.filter((it) => it && it.q));
            } catch { /* ignore malformed */ }
          }
          else if (row.key === 'area_features') {
            try {
              const items = JSON.parse(row.value || '[]');
              if (Array.isArray(items) && items.length) setFeatures(items);
            } catch { /* ignore malformed */ }
          }
          else loaded[row.key] = row.value;
        });
        setTexts(loaded);
      }
    }
    load();
  }, []);
  return (
    <div className="area-profesional">
      <section className="area-hero" style={{ backgroundImage: bgUrl ? `url('${bgUrl}')` : undefined }}>
        <div className="area-hero-overlay" />
        <div className="area-hero-content">
          <span className="eyebrow eyebrow--light">Área Profesional</span>
          <h1>{texts.area_hero_title}</h1>
          <p className="area-hero-subtitle">
            {texts.area_hero_subtitle}
          </p>
          <div className="area-hero-buttons">
            <a
              href={ecommerceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="area-hero-btn area-hero-btn--primary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <span>Acceso ecommerce</span>
            </a>
            <button
              type="button"
              onClick={() => setCurrentView('hazte-cliente')}
              className="area-hero-btn area-hero-btn--secondary"
            >
              <span>Hazte cliente</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section className="area-benefits">
        <div className="area-benefits-container">
          <span className="eyebrow reveal">Ventajas</span>
          <h2 className="reveal">{texts.area_benefits_title}</h2>
          <p className="area-benefits-subtitle reveal">
            {texts.area_benefits_subtitle}
          </p>

          <div className="area-features-grid reveal">
            {features.map((f, i) => (
              <div className="area-feature" key={i}>
                <div className="area-feature-icon">{FEATURE_ICONS[i] || FEATURE_ICONS[0]}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="area-faq">
        <div className="area-faq-container">
          <span className="eyebrow reveal">Dudas</span>
          <h2 className="reveal">Preguntas frecuentes</h2>
          {faq.length === 0 ? (
            <p className="area-faq-placeholder">
              Próximamente publicaremos aquí las preguntas y respuestas más habituales de nuestros profesionales.
            </p>
          ) : (
            <div className="area-faq-list">
              {faq.map((item, i) => (
                <div className={`area-faq-item ${openFaq === i ? 'open' : ''}`} key={i}>
                  <button
                    type="button"
                    className="area-faq-question"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span>{item.q}</span>
                    <span className="area-faq-toggle" aria-hidden="true">{openFaq === i ? '–' : '+'}</span>
                  </button>
                  {openFaq === i && item.a && (
                    <div className="area-faq-answer">{item.a}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
