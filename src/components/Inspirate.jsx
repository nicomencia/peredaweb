import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Inspirate.css';

const defaultCards = [
  { title: 'Visítanos', text: 'En nuestras tiendas encontrarás diferentes ambientes de baño, cerámicas y productos de decoración con una cuidada selección de marcas donde escoger el producto que mejor se adapte a tus necesidades.' },
  { title: 'Hacemos realidad tus proyectos', text: 'Te ayudamos en tus proyectos de reformas. Ven a vernos, dinos lo que necesitas y lo planificamos juntos. No esperes más y pide cita en cualquiera de nuestras tiendas.' },
  { title: 'Confía en nuestra experiencia', text: 'Ofrecemos las mejores soluciones para tu hogar. Contamos con una larga trayectoria profesional, un equipo experimentado y somos líderes en el mercado asturiano.' },
];

export default function Inspirate({ onSelectAmbiente }) {
  const [ambientes, setAmbientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState(defaultCards);
  const [heading, setHeading] = useState('Inspírate');

  useEffect(() => {
    async function fetchData() {
      const [ambientesRes, settingsRes] = await Promise.all([
        supabase.from('ambientes').select('*').order('display_order', { ascending: true }),
        supabase.from('site_settings').select('key, value').in('key', [
          'inspirate_heading',
          'inspirate_card_1_title', 'inspirate_card_1_text',
          'inspirate_card_2_title', 'inspirate_card_2_text',
          'inspirate_card_3_title', 'inspirate_card_3_text',
        ]),
      ]);

      if (ambientesRes.data) setAmbientes(ambientesRes.data);

      if (settingsRes.data) {
        const loaded = [...defaultCards];
        settingsRes.data.forEach((row) => {
          if (row.key === 'inspirate_heading') { if (row.value) setHeading(row.value); return; }
          const match = row.key.match(/^inspirate_card_(\d)_(title|text)$/);
          if (match) {
            const idx = parseInt(match[1]) - 1;
            loaded[idx] = { ...loaded[idx], [match[2]]: row.value };
          }
        });
        setCards(loaded);
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <section id="inspirate" className="inspirate">
      <div className="container">
        <h2>{heading}</h2>
        <div className="inspirate-content">
          <div className="inspirate-cards">
            {cards.map((card, i) => (
              <div className="inspirate-card" key={i}>
                <div className="inspirate-card-icon">
                  {i === 0 && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  )}
                  {i === 1 && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                  )}
                  {i === 2 && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  )}
                </div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            ))}
          </div>
          <div className="inspirate-gallery">
            {loading ? (
              <div className="inspirate-loading">Cargando ambientes...</div>
            ) : (
              <div className="inspirate-grid">
                {ambientes.map((ambiente) => (
                  <button
                    key={ambiente.id}
                    className="inspirate-item"
                    onClick={() => onSelectAmbiente(ambiente.id)}
                  >
                    <img src={ambiente.cover_image_url} alt={ambiente.title} />
                    <div className="inspirate-item-overlay">
                      <span className="inspirate-item-title">{ambiente.title}</span>
                      <span className="inspirate-item-cta">Ver ambiente</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
