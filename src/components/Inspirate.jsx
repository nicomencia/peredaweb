import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Inspirate.css';

export default function Inspirate({ onSelectAmbiente }) {
  const [ambientes, setAmbientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAmbientes() {
      const { data } = await supabase
        .from('ambientes')
        .select('*')
        .order('display_order', { ascending: true });
      if (data) setAmbientes(data);
      setLoading(false);
    }
    fetchAmbientes();
  }, []);

  return (
    <section id="inspirate" className="inspirate">
      <div className="container">
        <h2>Inspírate</h2>
        <div className="inspirate-content">
          <div className="inspirate-cards">
            <div className="inspirate-card">
              <div className="inspirate-card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <h3>Visítanos</h3>
              <p>En nuestras tiendas encontrarás diferentes ambientes de baño, cerámicas y productos de decoración con una cuidada selección de marcas donde escoger el producto que mejor se adapte a tus necesidades.</p>
            </div>
            <div className="inspirate-card">
              <div className="inspirate-card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <h3>Hacemos realidad tus proyectos</h3>
              <p>Te ayudamos en tus proyectos de reformas. Ven a vernos, dinos lo que necesitas y lo planificamos juntos. No esperes más y pide cita en cualquiera de nuestras tiendas.</p>
            </div>
            <div className="inspirate-card">
              <div className="inspirate-card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>Confía en nuestra experiencia</h3>
              <p>Ofrecemos las mejores soluciones para tu hogar. Contamos con una larga trayectoria profesional, un equipo experimentado y somos líderes en el mercado asturiano.</p>
            </div>
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
