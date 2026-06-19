import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import './AboutIntro.css';

const defaultCtas = [
  { title: 'Pide cita para tus proyectos de reformas', label: 'PIDE CITA', view: 'pide-cita' },
  { title: 'Financiación sin intereses', label: 'CONSULTA NUESTRA FINANCIACIÓN', view: 'financiacion' },
  { title: 'Asesoramiento y servicio post venta', label: 'SOLICITA PRESUPUESTO', view: 'presupuesto' },
  { title: 'Conoce las ventajas para el profesional', label: 'HAZTE CLIENTE', view: 'hazte-cliente' },
];

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
            <div className="cta-banner-title-wrap">
              <h3 className="cta-banner-title">{item.title}</h3>
            </div>
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
