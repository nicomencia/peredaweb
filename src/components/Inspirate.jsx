import './Inspirate.css';

export default function Inspirate() {
  return (
    <section id="inspirate" className="inspirate">
      <div className="container">
        <h2>Inspírate</h2>
        <div className="inspirate-content">
          <div className="inspirate-text">
            <p>Descubre las últimas tendencias en diseño de baños y encuentra la inspiración perfecta para tu proyecto.</p>

            <p>Desde espacios minimalistas y contemporáneos hasta baños clásicos y elegantes, en Saneamientos Pereda te ayudamos a materializar tus ideas con productos de alta calidad y diseño vanguardista.</p>

            <p>Explora diferentes estilos, acabados y configuraciones que transformarán tu baño en un espacio único y funcional. Nuestro equipo está listo para asesorarte en cada detalle.</p>
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
