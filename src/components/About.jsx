import './About.css';

export default function About() {
  return (
    <section id="sobre-mi" className="about">
      <div className="container">
        <h2>Quiénes somos</h2>
        <div className="about-content">
          <div className="about-text">
            <p>Saneamientos Pereda es una empresa familiar fundada en 1985, con más de 35 años de experiencia en el sector del equipamiento de baño.</p>

            <p>Lo que comenzó como un pequeño negocio local se ha transformado en un referente regional en la distribución e instalación de productos sanitarios de alta calidad. Nuestra trayectoria está basada en la confianza de miles de clientes que han encontrado en nosotros el asesoramiento profesional y el servicio personalizado que necesitaban.</p>

            <p>Trabajamos con las mejores marcas nacionales e internacionales, ofreciendo una amplia gama de productos que incluyen grifería, sanitarios, duchas, bañeras, muebles de baño, accesorios y todo tipo de soluciones para el hogar y proyectos profesionales.</p>

            <p>Nuestro equipo de profesionales cualificados está comprometido con la excelencia en el servicio, desde el asesoramiento inicial hasta la instalación final. Entendemos que cada proyecto es único y nos adaptamos a las necesidades específicas de cada cliente.</p>

            <p>En Saneamientos Pereda, combinamos la tradición familiar con la innovación tecnológica, manteniéndonos siempre a la vanguardia de las últimas tendencias en diseño y funcionalidad para el baño.</p>
            <p className="artist-name">Familia Pereda</p>
          </div>
          <div className="about-image">
            <img src="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Saneamientos Pereda" />
          </div>
        </div>
      </div>
    </section>
  );
}
