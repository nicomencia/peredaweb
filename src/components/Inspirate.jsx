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
          <div className="inspirate-text">
            <h3>Visítanos</h3>
            <p>En nuestras tiendas encontrarás diferentes ambientes de baño, cerámicas y productos de decoración con una cuidada selección de marcas donde escoger el producto que mejor se adapte a tus necesidades.</p>

            <h3>Hacemos realidad tus proyectos</h3>
            <p>Te ayudamos en tus proyectos de reformas. Ven a vernos, dinos lo que necesitas y lo planificamos juntos. No esperes más y pide cita en cualquiera de nuestras tiendas.</p>

            <h3>Confía en nuestra experiencia</h3>
            <p>Ofrecemos las mejores soluciones para tu hogar. Contamos con una larga trayectoria profesional, un equipo experimentado y somos líderes en el mercado asturiano.</p>
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
