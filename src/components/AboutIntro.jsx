import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import './AboutIntro.css';

const defaultCtas = [
  { title: 'Pide cita para tus proyectos de reformas', label: 'PIDE CITA', view: 'pide-cita' },
  { title: 'Financiación sin intereses', label: 'CONSULTA NUESTRA FINANCIACIÓN', view: 'financiacion' },
  { title: 'Asesoramiento y servicio post venta', label: 'SOLICITA PRESUPUESTO', view: 'presupuesto' },
  { title: 'Conoce las ventajas para el profesional', label: 'HAZTE CLIENTE', view: 'hazte-cliente' },
];

// Icon per CTA, keyed by view so it stays correct even if the client edits titles.
const CTA_ICONS = {
  'pide-cita': (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4M8 13h3M8 16.5h6" />
    </>
  ),
  'financiacion': (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
      <path d="M2.5 10h19M6 15h4" />
    </>
  ),
  'presupuesto': (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 16.5h4" />
    </>
  ),
  'hazte-cliente': (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
};

export default function AboutIntro({ setCurrentView }) {
  const [ctas, setCtas] = useState(defaultCtas);

  useEffect(() => {
    async function loadCtas() {
      const { data } = await api
        .from('site_settings')
        .select('key, value')
        .in('key', [
          'cta_1_title', 'cta_1_label',
          'cta_2_title', 'cta_2_label',
          'cta_3_title', 'cta_3_label',
          'cta_4_title', 'cta_4_label',
        ]);

      if (data && data.length > 0) {
        const loaded = [...defaultCtas];
        data.forEach((row) => {
          const match = row.key.match(/^cta_(\d)_(title|label)$/);
          if (match) {
            const idx = parseInt(match[1]) - 1;
            loaded[idx] = { ...loaded[idx], [match[2]]: row.value };
          }
        });
        setCtas(loaded);
      }
    }
    loadCtas();
  }, []);

  return (
    <section className="cta-banner">
      <div className="cta-banner-grid">
        {ctas.map((item) => (
          <div className="cta-banner-item" key={item.view}>
            <span className="cta-banner-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {CTA_ICONS[item.view]}
              </svg>
            </span>
            <h3 className="cta-banner-title">{item.title}</h3>
            <button
              className="cta-banner-button"
              onClick={() => setCurrentView && setCurrentView(item.view)}
            >
              {item.label}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
