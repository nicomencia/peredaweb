import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { cachedSetting, loadSettings } from '../lib/settings';
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

export default function Navigation({ currentView, setCurrentView, onCategorySelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [productosOpen, setProductosOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(() => cachedSetting('navbar_logo', '/base/navbar-logo.webp'));
  const isHome = currentView === 'home';

  // Compact (hamburger) mode is decided by whether the full desktop bar actually
  // fits, not by a guessed breakpoint: on a 13" laptop, or any screen at 125-150%
  // OS scaling or browser zoom, the logo + five items need more room than a fixed
  // width can promise. Mobile widths are always compact.
  const navRef = useRef(null);
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const menuRef = useRef(null);
  const checkFitRef = useRef(null);
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 768
  );

  useLayoutEffect(() => {
    const nav = navRef.current;
    const container = containerRef.current;
    const menu = menuRef.current;
    if (!nav || !container || !menu) return undefined;

    // Measures the desktop layout even while compact: the compact class is lifted
    // for a synchronous read and restored before the browser paints, with
    // transitions suspended so the swap never animates.
    function checkFit() {
      const wasCompact = nav.classList.contains('navigation--compact');
      nav.classList.add('navigation--measuring');
      nav.classList.remove('navigation--compact');

      const cs = getComputedStyle(container);
      const logo = logoRef.current;
      const breathingRoom = 24;
      const needed =
        parseFloat(cs.paddingLeft) +
        parseFloat(cs.paddingRight) +
        menu.offsetWidth +
        (logo ? logo.offsetWidth + (parseFloat(cs.columnGap) || 0) : 0) +
        breathingRoom;
      const available = container.clientWidth;

      if (wasCompact) nav.classList.add('navigation--compact');
      void nav.offsetWidth; // settle the restored styles before transitions return
      nav.classList.remove('navigation--measuring');

      setCompact(window.innerWidth <= 768 || needed > available);
    }

    checkFitRef.current = checkFit;
    checkFit();

    const observer = new ResizeObserver(checkFit);
    observer.observe(container);
    // Web fonts change text width once they arrive.
    document.fonts?.ready.then(checkFit);
    return () => observer.disconnect();
  }, [isHome, logoUrl]);

  useEffect(() => {
    if (!compact) setIsOpen(false);
  }, [compact]);

  useEffect(() => {
    async function loadLogo() {
      const data = await loadSettings(['navbar_logo']);
      const row = data?.find((r) => r.key === 'navbar_logo');
      if (row?.value) setLogoUrl(row.value);
    }
    loadLogo();
  }, []);

  const handleNavClick = (view) => {
    setCurrentView(view);
    setIsOpen(false);
    setProductosOpen(false);
  };

  const handleProductosClick = () => {
    handleNavClick('colecciones');
  };

  const handleCategoryClick = (categoryKey) => {
    onCategorySelect(categoryKey);
    setIsOpen(false);
    setProductosOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className={`navigation${!isHome ? ' navigation--solid' : ''}${compact ? ' navigation--compact' : ''}`}
    >
      <div className="nav-container" ref={containerRef}>
        {!isHome && (
          <button
            ref={logoRef}
            className="nav-logo-btn"
            onClick={() => handleNavClick('home')}
            aria-label="Ir a inicio"
          >
            <img
              src={logoUrl || undefined}
              alt="Saneamientos Pereda"
              className="nav-logo"
              onLoad={() => checkFitRef.current?.()}
            />
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

        <ul ref={menuRef} className={`nav-menu ${isOpen ? 'nav-menu--open' : ''}`}>
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
