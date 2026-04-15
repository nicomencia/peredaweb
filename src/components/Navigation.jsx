import { useState } from 'react';
import './Navigation.css';

const PRODUCT_CATEGORIES = [
  { key: 'bano', label: 'Baño' },
  { key: 'fontaneria', label: 'Fontanería y calefacción' },
  { key: 'materiales', label: 'Materiales de construcción' },
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
            <img src="/logo.svg" alt="Saneamientos Pereda" className="nav-logo" />
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
            <button onClick={() => handleNavClick('inspirate')}>
              Inspírate
            </button>
          </li>
          <li>
            <button onClick={() => handleNavClick('instalaciones')}>
              Instalaciones
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
            <ul className={`nav-dropdown ${productosOpen ? 'nav-dropdown--open' : ''}`}>
              {PRODUCT_CATEGORIES.map((cat) => (
                <li key={cat.key}>
                  <button onClick={() => handleCategoryClick(cat.key)}>
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
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
          <li>
            <button onClick={() => handleNavClick('sobre-mi')}>
              Quiénes somos
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
