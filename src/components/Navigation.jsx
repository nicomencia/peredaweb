import { useState } from 'react';
import './Navigation.css';

const PRODUCT_CATEGORIES = [
  { key: 'sanitarios', label: 'Sanitarios', icon: 'M4 12h16M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6M8 12V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6' },
  { key: 'griferia', label: 'Griferías', icon: 'M12 3v4M8 7h8M10 7v3a2 2 0 0 0 2 2 2 2 0 0 0 2-2V7M12 12v9M9 21h6' },
  { key: 'muebles-bano', label: 'Muebles de baño y espejos', icon: 'M3 7h18v10H3zM3 12h18M7 7v10M17 7v10' },
  { key: 'climatizacion', label: 'Climatización y energías renovables', icon: 'M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4' },
  { key: 'fontaneria', label: 'Fontanería y calefacción', icon: 'M4 8h10a4 4 0 0 1 0 8H8M4 12h4M14 4v4M14 16v4' },
  { key: 'ceramica', label: 'Cerámicas', icon: 'M3 5h18v14H3zM3 12h18M9 5v14M15 5v14' },
  { key: 'materiales', label: 'Materiales de construcción', icon: 'M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6' },
  { key: 'mamparas', label: 'Mamparas', icon: 'M4 3h16v18H4zM12 3v18M4 7h16M4 17h16' },
  { key: 'herramientas', label: 'Herramientas', icon: 'M14 6l4 4-8 8-4-4zM16 4l4 4M3 21l3-3M10 14l-3 3' },
  { key: 'electricidad', label: 'Electricidad', icon: 'M13 2L4 14h7l-1 8 9-12h-7z' },
];

export default function Navigation({ currentView, setCurrentView, setProductCategory }) {
  const [isOpen, setIsOpen] = useState(false);
  const [productosOpen, setProductosOpen] = useState(false);
  const isHome = currentView === 'home';

  const handleNavClick = (view) => {
    setCurrentView(view);
    setIsOpen(false);
    setProductosOpen(false);
  };

  const handleProductosClick = () => {
    setProductCategory(null);
    handleNavClick('colecciones');
  };

  const handleCategoryClick = (categoryKey) => {
    setProductCategory(categoryKey);
    handleNavClick('productos-categoria');
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
            <img src="/logo.png" alt="Saneamientos Pereda" className="nav-logo" />
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
            <button onClick={() => handleNavClick('sobre-mi')}>
              Quiénes somos
            </button>
          </li>
          <li>
            <button onClick={() => handleNavClick('inspirate')}>
              Inspírate
            </button>
          </li>
          <li>
            <button onClick={() => handleNavClick('instalaciones')}>
              Nuestras tiendas
            </button>
          </li>
          <li
            className="nav-item-dropdown"
            onMouseEnter={() => setProductosOpen(true)}
            onMouseLeave={() => setProductosOpen(false)}
          >
            <button className="nav-dropdown-trigger" onClick={handleProductosClick}>
              Productos
            </button>
            <div
              className={`nav-mega ${productosOpen ? 'nav-mega--open' : ''}`}
              onMouseEnter={() => setProductosOpen(true)}
              onMouseLeave={() => setProductosOpen(false)}
            >
              <div className="nav-mega-inner">
                <div className="nav-mega-header">
                  <h3 className="nav-mega-title">Productos</h3>
                  <button className="nav-mega-all" onClick={handleProductosClick}>
                    Ir a Productos <span aria-hidden="true">&#8594;</span>
                  </button>
                </div>
                <div className="nav-mega-grid">
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.key}
                      className="nav-mega-item"
                      onClick={() => handleCategoryClick(cat.key)}
                    >
                      <svg className="nav-mega-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={cat.icon} />
                      </svg>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </li>
          <li className="nav-item-mobile-categories">
            <button onClick={handleProductosClick}>
              Productos
            </button>
            {productosOpen && (
              <ul className="nav-mobile-subcategories">
                {PRODUCT_CATEGORIES.map((cat) => (
                  <li key={cat.key}>
                    <button onClick={() => handleCategoryClick(cat.key)}>
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li className="nav-item-area-pro">
            <button className="nav-area-pro" onClick={() => handleNavClick('area-profesional')}>
              Área Profesional
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
