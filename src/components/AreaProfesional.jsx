import './AreaProfesional.css';

export default function AreaProfesional({ setCurrentView }) {
  return (
    <div className="area-profesional">
      <section className="area-hero">
        <div className="area-hero-overlay" />
        <div className="area-hero-content">
          <span className="area-hero-tag">Area Profesional</span>
          <h1>El hogar del fontanero</h1>
          <p className="area-hero-subtitle">
            Tu aliado en cada instalación. Calidad, stock y asesoramiento para profesionales.
          </p>
          <div className="area-hero-buttons">
            <a
              href="https://ecommerce.saneamientos-pereda.com/ecom/login.php"
              target="_blank"
              rel="noopener noreferrer"
              className="area-hero-btn area-hero-btn--primary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <span>Ir a la tienda</span>
            </a>
            <button
              type="button"
              onClick={() => setCurrentView('hazte-cliente')}
              className="area-hero-btn area-hero-btn--secondary"
            >
              <span>Hazte cliente</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </button>
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
              </div>
              <h3>Calidad garantizada</h3>
              <p>Trabajamos solo con las mejores marcas del sector para garantizar resultados profesionales</p>
            </div>

            <div className="area-feature">
              <div className="area-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                </svg>
              </div>
              <h3>Stock permanente</h3>
              <p>Amplio inventario disponible para que nunca te falte material en tus proyectos</p>
            </div>

            <div className="area-feature">
              <div className="area-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                </svg>
              </div>
              <h3>Precios profesionales</h3>
              <p>Condiciones especiales y descuentos exclusivos para instaladores profesionales</p>
            </div>

            <div className="area-feature">
              <div className="area-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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

      <section className="area-quote">
        <div className="area-quote-container">
          <blockquote>
            <span className="area-quote-mark">"</span>
            <p>Si existe, está en Pereda</p>
          </blockquote>
        </div>
      </section>

    </div>
  );
}
