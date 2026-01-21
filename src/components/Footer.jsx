import './Footer.css';

export default function Footer({ setCurrentView }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <img src="/logo.png" alt="Flueu Studio" className="footer-logo" />
            <p>Más de 50 años liderando el mercado asturiano con 40+ profesionales especializados al servicio de particulares y profesionales.</p>
          </div>

          <div className="footer-links">
            <h4>Navegar</h4>
            <ul>
              <li><button onClick={() => setCurrentView('colecciones')}>Colecciones</button></li>
              <li><button onClick={() => setCurrentView('creations')}>Creaciones</button></li>
              <li><button onClick={() => setCurrentView('custom')}>Custom</button></li>
              <li><button onClick={() => setCurrentView('tallas')}>Tallas</button></li>
              <li><button onClick={() => setCurrentView('sobre-mi')}>Sobre mí</button></li>
            </ul>
          </div>

          <div className="footer-social">
            <h4>Conectar</h4>
            <div className="footer-social-links">
              <a href="mailto:flueu.studio@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
              <a href="https://instagram.com/flueu.studio" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://www.vinted.es/member/307275109" target="_blank" rel="noopener noreferrer" aria-label="Vinted">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Flueu Studio. Todos los derechos reservados.</p>
          <div className="footer-admin">
            <button onClick={() => setCurrentView('admin')}>Admin</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
