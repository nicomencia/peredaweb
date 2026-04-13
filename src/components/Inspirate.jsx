import './Inspirate.css';

export default function Inspirate() {
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
            <div className="inspirate-grid">
              <div className="inspirate-item">
                <img src="/inspirate1.jpg" alt="Inspiración baño 1" />
              </div>
              <div className="inspirate-item">
                <img src="/inspirate2.jpg" alt="Inspiración baño 2" />
              </div>
              <div className="inspirate-item">
                <img src="/inspirate3.jpg" alt="Inspiración baño 3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
