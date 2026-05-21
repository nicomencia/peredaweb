import { useState } from 'react';
import CareersModal from './CareersModal';
import './QuienesSomos.css';

export default function QuienesSomos() {
  const [showCareersModal, setShowCareersModal] = useState(false);

  return (
    <section id="sobre-mi" className="about">
      <div className="about-hero">
        <div className="about-hero-overlay" />
        <div className="about-hero-content">
          <h2>¿QUIÉNES SOMOS?</h2>
          <p className="about-hero-subtitle">
            Siempre con dedicación<br />
            para mejorar nuestros servicios
          </p>
        </div>
      </div>

      <div className="about-photos-top">
        <div className="about-photo-full">
          <img src="/quienessomos1.jpg" alt="Foto histórica de Saneamientos Pereda" />
          <div className="about-photo-caption">Nuestros orígenes</div>
        </div>
        <div className="about-photo-full">
          <img src="/quienessomos2.jpg" alt="Edificio principal de Saneamientos Pereda" />
          <div className="about-photo-caption">Nuestras instalaciones</div>
        </div>
      </div>

      <div className="container">
        <div className="about-intro">
          <p>
            Saneamientos Pereda es una empresa familiar fundada en Oviedo en el año 1959. Nace como distribuidora de productos de fontanería y sanitarios, pero con el paso de los años, con esfuerzo y dedicación, y gracias a la confianza depositada por los clientes, ha sabido crecer y diversificar su oferta para adaptarse a las necesidades del mercado, convirtiéndose en un referente en su sector.
          </p>
          <p>
            La oferta de productos, dirigida tanto al profesional como al particular más exigente, abarca material de fontanería, calefacción, sanitarios, grifería, mobiliario y accesorios para baño, materiales de construcción, electricidad, pintura, jardinería y herramienta.
          </p>
        </div>

      </div>

      <div className="servicios-section">
        <div className="container">
          <h3 className="servicios-title">Servicios asociados</h3>
          <p className="servicios-subtitle">
            Nuestros especialistas en diseño de interiores te acompañarán en cada paso para ayudarte a crear el baño que siempre has imaginado.
          </p>

          <div className="servicios-grid">
            <div className="servicio-card">
              <div className="servicio-icon">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                  <path d="M17 4l1.5 1.5L22 2" />
                </svg>
              </div>
              <h4 className="servicio-name">Asesoramiento profesional</h4>
              <p className="servicio-text">
                Contamos con un equipo de expertos en interiorismo y decoración que te orientará para encontrar las mejores soluciones según tu espacio, estilo y necesidades.
              </p>
            </div>

            <div className="servicio-card">
              <div className="servicio-icon">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z" />
                  <path d="M14 8l4 4" />
                  <path d="M18 6l2 2" />
                </svg>
              </div>
              <h4 className="servicio-name">Diseño personalizado</h4>
              <p className="servicio-text">
                Te ayudamos a elegir la opción que mejor encaje contigo. Y si buscas algo único, elaboramos propuestas totalmente a medida adaptadas a tu proyecto.
              </p>
            </div>

            <div className="servicio-card">
              <div className="servicio-icon">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="6" width="13" height="11" rx="1" />
                  <path d="M14 9h4l3 4v4h-7z" />
                  <circle cx="6" cy="18" r="2" />
                  <circle cx="17" cy="18" r="2" />
                </svg>
              </div>
              <h4 className="servicio-name">Transporte a domicilio</h4>
              <p className="servicio-text">
                Olvídate de las preocupaciones logísticas. Nos encargamos de llevar tu compra directamente hasta tu hogar de forma cómoda y segura.
              </p>
            </div>

            <div className="servicio-card">
              <div className="servicio-icon">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="1" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M6 10v4M18 10v4" />
                </svg>
              </div>
              <h4 className="servicio-name">Financiación flexible</h4>
              <p className="servicio-text">
                Si lo necesitas, ponemos a tu disposición diferentes opciones de financiación para que puedas realizar tu proyecto con mayor comodidad.
              </p>
            </div>

            <div className="servicio-card">
              <div className="servicio-icon">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                  <path d="M14 2v6h6" />
                  <path d="M9 14l2 2 4-4" />
                </svg>
              </div>
              <h4 className="servicio-name">Recogida rápida</h4>
              <p className="servicio-text">
                Compra cómodamente y recoge tu pedido sin esperas y con total facilidad.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-porqué">
        <div className="container">
          <h3>¿POR QUÉ ELEGIR SANEAMIENTOS PEREDA?</h3>
          <div className="porqué-grid">
            <div className="porqué-item">
              <span className="porqué-check">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Todo para reformar el baño</span>
            </div>
            <div className="porqué-item">
              <span className="porqué-check">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Te ayudamos a diseñarlo</span>
            </div>
            <div className="porqué-item">
              <span className="porqué-check">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Trato humano y personalizado</span>
            </div>
            <div className="porqué-item">
              <span className="porqué-check">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Más de 50 años de experiencia en el sector</span>
            </div>
            <div className="porqué-item">
              <span className="porqué-check">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Los mejores precios del mercado</span>
            </div>
            <div className="porqué-item">
              <span className="porqué-check">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Garantía Postventa</span>
            </div>
          </div>
        </div>
      </div>

      <div className="about-team-section">
        <div className="container">
          <h3>NUESTRO EQUIPO</h3>
          <p className="about-team-subtitle">Las personas que hacen posible Saneamientos Pereda</p>
        </div>
        <div className="about-team-stats">
          <div className="stat-card">
            <span className="stat-number">+50</span>
            <span className="stat-label">Años de Experiencia</span>
            <p className="stat-description">
              Siempre con una constante dedicación para mejorar los servicios al cliente y una continua actualización de productos e instalaciones.
            </p>
          </div>
          <div className="stat-card">
            <span className="stat-number">+40</span>
            <span className="stat-label">Profesionales Especializados</span>
            <p className="stat-description">
              Nuestro personal está formado por profesionales cualificados que te asesorarán y atenderán personalmente.
            </p>
          </div>
        </div>
        <div className="about-team-photos">
          <div className="about-photo-half">
            <img src="/quienessomos3.jpg" alt="Equipo de trabajo de Saneamientos Pereda" />
          </div>
          <div className="about-photo-half">
            <img src="/quienessomos4.jpg" alt="Profesionales de Saneamientos Pereda" />
          </div>
        </div>
      </div>

      <div className="careers-banner">
        <div className="careers-banner-bg" />
        <div className="careers-banner-content">
          <div className="careers-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              <line x1="12" y1="12" x2="12" y2="16" />
              <line x1="10" y1="14" x2="14" y2="14" />
            </svg>
          </div>
          <h3>TRABAJA CON NOSOTROS</h3>
          <p className="careers-text">
            ¿Quieres formar parte de nuestro equipo? Envíanos tu CV.
          </p>
          <button className="careers-cta" onClick={() => setShowCareersModal(true)}>
            Enviar CV
          </button>
        </div>
      </div>

      <CareersModal isOpen={showCareersModal} onClose={() => setShowCareersModal(false)} />
    </section>
  );
}
