import './Inspirate.css';

export default function Inspirate() {
  return (
    <section id="inspirate" className="inspirate">
      <div className="container">
        <h2>Inspírate</h2>
        <div className="inspirate-content">
          <div className="inspirate-text">
            <p>Descubre cómo las piezas de Flueu pueden transformar tus espacios y complementar tu estilo personal.</p>

            <p>Cada creación está diseñada para ser única, capturando la esencia de la naturaleza y la fluidez del material reciclado. Desde joyas que cuentan historias hasta accesorios que añaden carácter a cualquier look.</p>

            <p>Explora diferentes formas de llevar y combinar estas piezas únicas, creadas con consciencia y pasión por el arte sostenible.</p>
          </div>
          <div className="inspirate-gallery">
            <div className="inspirate-grid">
              <div className="inspirate-item">
                <img src="/acc_aros.jpg" alt="Inspiración aros" />
              </div>
              <div className="inspirate-item">
                <img src="/acc_collar.jpg" alt="Inspiración collar" />
              </div>
              <div className="inspirate-item">
                <img src="/acc_pinza.jpg" alt="Inspiración pinza" />
              </div>
              <div className="inspirate-item">
                <img src="/acc_boton.jpg" alt="Inspiración botón" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
