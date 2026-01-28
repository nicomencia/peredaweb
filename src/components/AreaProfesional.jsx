import './AreaProfesional.css';

export default function AreaProfesional({ setCurrentView }) {
  return (
    <div className="area-profesional">
      <header className="area-header">
        <div className="area-header-container">
          <button
            className="area-back-button"
            onClick={() => setCurrentView('home')}
            aria-label="Volver a inicio"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Volver</span>
          </button>
        </div>
      </header>
      <section className="area-hero">
        <div className="area-hero-grid">
          <div className="area-hero-item area-hero-main">
            <img
              src="https://images.pexels.com/photos/8961186/pexels-photo-8961186.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Profesionales fontaneros"
            />
            <div className="area-hero-overlay">
              <h1>El hogar del fontanero</h1>
            </div>
          </div>
          <div className="area-hero-item">
            <img
              src="https://images.pexels.com/photos/7512040/pexels-photo-7512040.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Grifería profesional"
            />
          </div>
          <div className="area-hero-item">
            <img
              src="https://images.pexels.com/photos/5691591/pexels-photo-5691591.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Herramientas profesionales"
            />
          </div>
          <div className="area-hero-item area-hero-text">
            <div className="area-hero-text-content">
              <h2>Si existe,<br />está en Pereda</h2>
            </div>
          </div>
          <div className="area-hero-item">
            <img
              src="https://images.pexels.com/photos/5691630/pexels-photo-5691630.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Herramientas eléctricas"
            />
          </div>
          <div className="area-hero-item">
            <img
              src="https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Lavabos profesionales"
            />
          </div>
        </div>
      </section>

      <section className="area-benefits">
        <div className="area-benefits-container">
          <h2>¿Por qué Pereda es para ti, instalador?</h2>
          <p className="area-benefits-subtitle">
            Porque aquí encuentras calidad al mejor precio, un amplio stock con primeras marcas,
            el mejor asesoramiento personalizado y, además, todas las novedades y ofertas al alcance de tu mano.
          </p>

          <div className="area-features-grid">
            <div className="area-feature">
              <div className="area-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
              </div>
              <h3>Calidad garantizada</h3>
              <p>Trabajamos solo con las mejores marcas del sector para garantizar resultados profesionales</p>
            </div>

            <div className="area-feature">
              <div className="area-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                </svg>
              </div>
              <h3>Stock permanente</h3>
              <p>Amplio inventario disponible para que nunca te falte material en tus proyectos</p>
            </div>

            <div className="area-feature">
              <div className="area-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3>Precios profesionales</h3>
              <p>Condiciones especiales y descuentos exclusivos para instaladores profesionales</p>
            </div>

            <div className="area-feature">
              <div className="area-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                  <path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              <h3>Asesoramiento experto</h3>
              <p>Nuestro equipo te asesora personalmente en cada proyecto que emprendas</p>
            </div>
          </div>
        </div>
      </section>

      <section className="area-cta">
        <div className="area-cta-container">
          <h2>¿Listo para trabajar con nosotros?</h2>
          <p>Accede a tu área profesional y descubre todas las ventajas que tenemos preparadas para ti</p>
          <div className="area-cta-buttons">
            <a
              href="https://ecommerce.saneamientos-pereda.com/ecom/login.php"
              className="area-cta-button area-cta-button--primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Acceder al área profesional
            </a>
            <a
              href="tel:+34985271026"
              className="area-cta-button area-cta-button--secondary"
            >
              Llamar ahora
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
