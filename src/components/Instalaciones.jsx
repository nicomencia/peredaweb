import './Instalaciones.css';

export default function Instalaciones() {
  return (
    <section id="instalaciones" className="instalaciones">
      <div className="container">
        <h2>Instalaciones</h2>
        <div className="instalaciones-content">
          <div className="instalaciones-text">
            <p>Nuestras instalaciones cuentan con un moderno showroom donde podrás ver, tocar y experimentar con los productos antes de tomar una decisión.</p>

            <p>Disponemos de más de 500m² de exposición con las últimas novedades en grifería, sanitarios, duchas, muebles de baño y accesorios de las mejores marcas del mercado. Nuestro equipo técnico especializado te asesorará para encontrar la solución perfecta para tu proyecto.</p>

            <p>Además de la venta, ofrecemos un servicio completo de instalación profesional. Nuestros instaladores cualificados garantizan un trabajo impecable con todas las garantías, cumpliendo los más altos estándares de calidad y normativa vigente.</p>
          </div>
          <div className="instalaciones-images">
            <div className="instalaciones-main-image">
              <img src="https://images.pexels.com/photos/1910472/pexels-photo-1910472.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Showroom Saneamientos Pereda" />
            </div>
            <div className="instalaciones-description">
              <h3>Nuestro Showroom</h3>
              <p>Visítanos y descubre todas las posibilidades para crear el baño de tus sueños con el asesoramiento de nuestros expertos.</p>
              <div className="instalaciones-services">
                <div className="service-item">
                  <h4>Asesoramiento Personalizado</h4>
                  <p>Te ayudamos a elegir los productos ideales para tu proyecto</p>
                </div>
                <div className="service-item">
                  <h4>Instalación Profesional</h4>
                  <p>Equipo técnico cualificado con años de experiencia</p>
                </div>
                <div className="service-item">
                  <h4>Garantía Total</h4>
                  <p>Todos nuestros trabajos cuentan con garantía completa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
