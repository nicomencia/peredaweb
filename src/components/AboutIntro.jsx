import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useInView } from '../hooks/useInView';
import './AboutIntro.css';

const defaultCtas = [
  { title: 'Pide cita para tus proyectos de reformas', label: 'PIDE CITA', view: 'pide-cita' },
  { title: 'Financiación sin intereses', label: 'CONSULTA NUESTRA FINANCIACIÓN', view: 'financiacion' },
  { title: 'Asesoramiento y servicio post venta', label: 'SOLICITA PRESUPUESTO', view: 'presupuesto' },
  { title: 'Conoce las ventajas para el profesional', label: 'HAZTE CLIENTE', view: 'hazte-cliente' },
];

const ARROW = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function AboutIntro({ setCurrentView }) {
  const [ctas, setCtas] = useState(defaultCtas);
  const [ref, inView] = useInView();

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
    <section className={`home-services${inView ? ' is-visible' : ''}`} ref={ref}>
      <div className="home-services-inner">
        <div className="home-services-head">
          <span className="eyebrow">Cómo te ayudamos</span>
          <h2 className="home-services-heading">Te acompañamos en cada paso de tu proyecto</h2>
        </div>

        <div className="home-services-grid">
          {ctas.map((item, i) => (
            <button
              className="service-item"
              key={item.view}
              style={{ '--i': i }}
              onClick={() => setCurrentView && setCurrentView(item.view)}
            >
              <span className="service-index">{String(i + 1).padStart(2, '0')}</span>
              <span className="service-title">{item.title}</span>
              <span className="service-cta">
                {item.label}
                {ARROW}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
