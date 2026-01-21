import { useState } from 'react';
import './Navigation.css';

export default function Navigation({ currentView, setCurrentView }) {
  const [isOpen, setIsOpen] = useState(false);
  const isHome = currentView === 'home';

  const handleNavClick = (view) => {
    setCurrentView(view);
    setIsOpen(false);
  };

  return (
    <nav className={`navigation ${!isHome ? 'navigation--solid' : ''}`}>
      <div className="nav-container">
        {!isHome && (
          <button
            className="nav-logo-btn"
            onClick={() => handleNavClick('home')}
            aria-label="Ir a inicio"
          >
            <img src="/logo.svg" alt="Flueu Studio" className="nav-logo" />
          </button>
        )}

        <button
          className="nav-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Alternar menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-menu ${isOpen ? 'nav-menu--open' : ''}`}>
          <li>
            <button onClick={() => handleNavClick('colecciones')}>
              Colecciones
            </button>
          </li>
          <li>
            <button onClick={() => handleNavClick('creations')}>
              Creaciones
            </button>
          </li>
          <li>
            <button onClick={() => handleNavClick('custom')}>
              Custom
            </button>
          </li>
          <li>
            <button onClick={() => handleNavClick('sobre-mi')}>
              Sobre mí
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
