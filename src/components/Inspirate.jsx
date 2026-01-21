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
                <img src="https://images.pexels.com/photos/1454804/pexels-photo-1454804.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Baño moderno minimalista" />
                <p className="inspirate-caption">Estilo Minimalista</p>
              </div>
              <div className="inspirate-item">
                <img src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Baño elegante contemporáneo" />
                <p className="inspirate-caption">Contemporáneo</p>
              </div>
              <div className="inspirate-item">
                <img src="https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Baño clásico" />
                <p className="inspirate-caption">Clásico Elegante</p>
              </div>
              <div className="inspirate-item">
                <img src="https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Baño spa relajante" />
                <p className="inspirate-caption">Spa Relax</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
