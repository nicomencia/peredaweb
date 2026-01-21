import './Instalaciones.css';

export default function Instalaciones() {
  return (
    <section id="instalaciones" className="instalaciones">
      <div className="container">
        <h2>Instalaciones</h2>
        <div className="instalaciones-content">
          <div className="instalaciones-text">
            <p>El taller de Flueu es un espacio donde la creatividad y la sostenibilidad se encuentran.</p>

            <p>Aquí, cada pieza cobra vida a través del fuego y la paciencia, transformando plástico reciclado en obras de arte únicas. Un lugar donde el proceso es tan importante como el resultado final.</p>

            <p>Te invitamos a conocer el entorno donde nacen estas creaciones, un espacio dedicado al arte consciente y la experimentación con materiales reciclados.</p>
          </div>
          <div className="instalaciones-images">
            <div className="instalaciones-main-image">
              <img src="/paula.jpg" alt="Taller Flueu" />
            </div>
            <div className="instalaciones-description">
              <h3>Nuestro Espacio Creativo</h3>
              <p>Un lugar donde el arte y la sostenibilidad se unen para crear piezas únicas con alma.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
