import { Link } from 'react-router-dom';
import './SimplePage.css';

// Shown for any address the site doesn't have. The server already answered with a
// real 404 status (public/index.php); this is what the visitor sees. Many will
// arrive from old links to the previous website, so it points them onwards
// instead of dropping them on the home page without explanation.
export default function NotFound() {
  return (
    <div className="simple-page">
      <div className="simple-page-hero">
        <span className="eyebrow eyebrow--light">Error 404</span>
        <h1 className="simple-page-hero-title">Página no encontrada</h1>
      </div>

      <section className="simple-page-content">
        <div className="simple-page-container not-found">
          <p className="simple-page-text">
            La página que buscas no existe o ha cambiado de dirección. Si llegas desde un enlace
            de nuestra web anterior, puede que ese contenido esté ahora en otra sección.
          </p>
          <nav className="not-found-links" aria-label="Secciones principales">
            <Link to="/">Inicio</Link>
            <Link to="/productos">Productos</Link>
            <Link to="/inspirate">Inspírate</Link>
            <Link to="/instalaciones">Nuestras tiendas</Link>
            <Link to="/presupuesto">Pide presupuesto</Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
