import './QuienesSomos.css';

export default function QuienesSomos() {
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

        <div className="about-highlights">
          <div className="about-highlight-card">
            <div className="highlight-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <p>Asesoramiento y atención personalizada</p>
          </div>
          <div className="about-highlight-card">
            <div className="highlight-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <p>Gran stock de productos, con más de 100.000 referencias</p>
          </div>
        </div>

        <div className="about-ayudas">
          <p>
            ESTA EMPRESA HA SIDO BENEFICIARIA DE LAS AYUDAS URGENTES DESTINADAS A FOMENTAR LA CONTRATACION LABORAL DE PERSONAS DESEMPLEADAS DEL PRINCIPADO DE ASTURIAS COMO MEDIDA DE LA RECUPERACIÓN Y REPARACIÓN DE LA CRISIS EN EL CONTEXTO DE LA PADEMIA DE COVID-19, CONFINANCIADAS POR LA CONFEDERACION SECTORIAL DE EMPLEO Y ASUNTOS LABORALES, tramitadas al amparo de la Resolución de 16 de Julio de 2021 de la Consejería de Industria, empleo y Promoción Económica del Principado de Asturias.
          </p>
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

      <div className="about-stats">
        <div className="container">
          <div className="stats-grid">
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
        </div>
      </div>

      <div className="about-team-section">
        <div className="container">
          <h3>NUESTRO EQUIPO</h3>
          <p className="about-team-subtitle">Las personas que hacen posible Saneamientos Pereda</p>
        </div>
        <div className="about-photos-team">
          <div className="about-photo-half">
            <img src="/quienessomos3.jpg" alt="Equipo de trabajo de Saneamientos Pereda" />
          </div>
          <div className="about-photo-half">
            <img src="/quienessomos4.jpg" alt="Profesionales de Saneamientos Pereda" />
          </div>
        </div>
      </div>
    </section>
  );
}
