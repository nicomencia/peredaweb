// First, so every component stylesheet can override the link reset.
import './styles/links.css';
import { useState, useEffect, useLayoutEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { VIEW_TO_PATH } from './lib/routes';
import { metaFor, setPageMeta } from './lib/seo';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { api } from './lib/api';
import { cachedSetting, cachedByPrefix, primeCache, loadSettings } from './lib/settings';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import AboutIntro from './components/AboutIntro';
import BrandsCarousel from './components/BrandsCarousel';
import CookieConsent from './components/CookieConsent';
import { initAnalytics, trackPageview } from './lib/analytics';
import QuienesSomos from './components/QuienesSomos';
import Productos from './components/Productos';
import Inspirate from './components/Inspirate';
import AmbienteDetail from './components/AmbienteDetail';
const Instalaciones = lazy(() => import('./components/Instalaciones'));
import AreaProfesional from './components/AreaProfesional';
import Footer from './components/Footer';
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
import CanalDenuncias from './components/CanalDenuncias';
import ProductosCategory, { isKnownCategory } from './components/ProductosCategory';
import NotFound from './components/NotFound';
import PideCita from './components/PideCita';
import Financiacion from './components/Financiacion';
import Presupuesto from './components/Presupuesto';
import HazteCliente from './components/HazteCliente';
import { AvisoLegal, PoliticaPrivacidad, PoliticaCookies, CondicionesVenta, PoliticaRRSS } from './components/LegalPages';
import Desistimiento from './components/Desistimiento';
import Faq from './components/Faq';


// Coarse view name derived from the URL (for nav highlight, floating button, title).
function pathToView(pathname) {
  if (pathname.startsWith('/productos/')) return 'productos-categoria';
  if (pathname.startsWith('/productos')) return 'colecciones';
  if (pathname.startsWith('/inspirate/')) return 'ambiente-detail';
  if (pathname.startsWith('/inspirate')) return 'inspirate';
  if (pathname.startsWith('/quienes-somos')) return 'sobre-mi';
  if (pathname.startsWith('/instalaciones')) return 'instalaciones';
  if (pathname.startsWith('/area-profesional')) return 'area-profesional';
  if (pathname.startsWith('/pide-cita')) return 'pide-cita';
  if (pathname.startsWith('/financiacion')) return 'financiacion';
  if (pathname.startsWith('/presupuesto')) return 'presupuesto';
  if (pathname.startsWith('/hazte-cliente')) return 'hazte-cliente';
  if (pathname.startsWith('/canal-denuncias')) return 'canal-denuncias';
  if (pathname.startsWith('/aviso-legal')) return 'aviso-legal';
  if (pathname.startsWith('/politica-privacidad')) return 'politica-privacidad';
  if (pathname.startsWith('/politica-cookies')) return 'politica-cookies';
  if (pathname.startsWith('/politica-redes-sociales')) return 'politica-redes-sociales';
  if (pathname.startsWith('/condiciones-venta')) return 'condiciones-venta';
  if (pathname.startsWith('/desistimiento')) return 'desistimiento';
  if (pathname.startsWith('/preguntas-frecuentes')) return 'preguntas-frecuentes';
  if (pathname.startsWith('/admin')) return 'admin';
  // Only the root is home: unknown paths render the 404 page with the normal
  // solid navbar, not the transparent home one.
  return pathname === '/' ? 'home' : 'not-found';
}

// Param routes read the URL param and forward it as the prop the component expects.
function CategoryRoute({ setCurrentView, categoryBanners }) {
  const { categoria } = useParams();
  if (!isKnownCategory(categoria)) return <NotFound />;
  return <ProductosCategory category={categoria} setCurrentView={setCurrentView} categoryBanners={categoryBanners} />;
}
function AmbienteRoute({ setCurrentView }) {
  const { ambienteId } = useParams();
  return <AmbienteDetail ambienteId={ambienteId} setCurrentView={setCurrentView} />;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categoryBanners, setCategoryBanners] = useState(() => {
    const banners = {};
    Object.entries(cachedByPrefix('category_banner_')).forEach(([k, v]) => {
      banners[k.replace('category_banner_', '')] = v;
    });
    return banners;
  });

  // Backwards-compatible navigation for child components that still call setCurrentView('x').
  const setCurrentView = useCallback((view) => navigate(VIEW_TO_PATH[view] || '/'), [navigate]);
  const goToCategory = useCallback((cat) => navigate(`/productos/${cat}`), [navigate]);
  const goToAmbiente = useCallback((id) => navigate(`/inspirate/${id}`), [navigate]);

  const currentView = pathToView(location.pathname);

  // Apply cached theme colors before first paint to avoid a colour flash.
  useLayoutEffect(() => {
    const apply = (key, varName) => {
      const v = cachedSetting(key);
      if (v) document.documentElement.style.setProperty(varName, v);
    };
    apply('color_primary', '--color-blue');
    apply('color_secondary', '--color-cream');
    apply('color_dark', '--color-black');
    apply('color_accent', '--color-accent');
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Global scroll-reveal: any element with `.reveal` fades/slides in when it
  // enters the viewport. Re-scans on route change and as async content mounts;
  // a final safety pass force-reveals anything still hidden so content can
  // never stay invisible if the observer misses it.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    const scan = () =>
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => observer.observe(el));
    scan();
    const rescans = [300, 800, 1600].map((ms) => setTimeout(scan, ms));
    const safety = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => el.classList.add('is-visible'));
    }, 2600);

    return () => {
      rescans.forEach(clearTimeout);
      clearTimeout(safety);
      observer.disconnect();
    };
  }, [location.pathname]);

  // Prime the analytics id into cache once, then start GA if already consented.
  useEffect(() => {
    loadSettings(['analytics_id']).then(() => {
      initAnalytics();
      trackPageview(location.pathname);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Analytics (consent-gated): logs each subsequent SPA route change. initAnalytics
  // is idempotent and a no-op until the visitor accepts cookies and an id is set.
  useEffect(() => {
    initAnalytics();
    trackPageview(location.pathname);
  }, [location.pathname]);

  // Titles/descriptions come from public/index.php (window.__SEO__), so they match
  // what crawlers get. The first render keeps the head as the server sent it,
  // which is already correct for this exact URL (ambiente names included).
  const firstMetaRun = useRef(true);
  useEffect(() => {
    if (firstMetaRun.current) {
      firstMetaRun.current = false;
      return;
    }
    const meta = metaFor(location.pathname);
    if (meta) setPageMeta(meta[0], meta[1]);
  }, [location.pathname]);

  useEffect(() => {
    // Not the loadSettings imported from lib/settings: this one applies the theme.
    async function loadThemeSettings() {
      const { data } = await api
        .from('site_settings')
        .select('key, value')
        .or('key.in.(color_primary,color_secondary,color_dark,color_accent),key.like.category_banner_%');
      if (data) {
        primeCache(data);
        const banners = {};
        data.forEach((row) => {
          if (row.key === 'color_primary') document.documentElement.style.setProperty('--color-blue', row.value);
          else if (row.key === 'color_secondary') document.documentElement.style.setProperty('--color-cream', row.value);
          else if (row.key === 'color_dark') document.documentElement.style.setProperty('--color-black', row.value);
          else if (row.key === 'color_accent') document.documentElement.style.setProperty('--color-accent', row.value);
          else if (row.key.startsWith('category_banner_')) {
            banners[row.key.replace('category_banner_', '')] = row.value;
          }
        });
        setCategoryBanners(banners);
      }
    }
    loadThemeSettings();
  }, []);

  // The "browser logo" (favicon) is its own setting, independent of the navbar logo.
  useEffect(() => {
    async function applyFavicon() {
      const data = await loadSettings(['favicon']);
      const url = data?.find((r) => r.key === 'favicon')?.value || cachedSetting('favicon');
      if (!url) return;
      let link = document.querySelector("link[rel='icon']");
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'icon');
        document.head.appendChild(link);
      }
      link.setAttribute('href', url);
    }
    applyFavicon();
  }, []);

  useEffect(() => {
    api.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
    const {
      data: { subscription },
    } = api.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <Navigation currentView={currentView} setCurrentView={setCurrentView} onCategorySelect={goToCategory} />
      <main>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero setCurrentView={setCurrentView} />
              <AboutIntro setCurrentView={setCurrentView} />
              <BrandsCarousel
                category="home"
                eyebrow="Marcas"
                title="Trabajamos con las mejores marcas"
              />
            </>
          }
        />
        <Route path="/productos" element={<Productos setCurrentView={setCurrentView} onCategorySelect={goToCategory} />} />
        <Route path="/productos/:categoria" element={<CategoryRoute setCurrentView={setCurrentView} categoryBanners={categoryBanners} />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/inspirate" element={<Inspirate onSelectAmbiente={goToAmbiente} />} />
        <Route path="/inspirate/:ambienteId" element={<AmbienteRoute setCurrentView={setCurrentView} />} />
        <Route path="/instalaciones" element={<Suspense fallback={null}><Instalaciones setCurrentView={setCurrentView} /></Suspense>} />
        <Route path="/area-profesional" element={<AreaProfesional setCurrentView={setCurrentView} />} />
        <Route path="/pide-cita" element={<PideCita />} />
        <Route path="/financiacion" element={<Financiacion />} />
        <Route path="/presupuesto" element={<Presupuesto />} />
        <Route path="/hazte-cliente" element={<HazteCliente />} />
        <Route path="/canal-denuncias" element={<CanalDenuncias />} />
        <Route path="/aviso-legal" element={<AvisoLegal />} />
        <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
        <Route path="/politica-cookies" element={<PoliticaCookies />} />
        <Route path="/politica-redes-sociales" element={<PoliticaRRSS />} />
        <Route path="/condiciones-venta" element={<CondicionesVenta />} />
        <Route path="/desistimiento" element={<Desistimiento />} />
        <Route path="/preguntas-frecuentes" element={<Faq />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={null}>
              {isAuthenticated ? <AdminDashboard /> : <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />}
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </main>
      <Footer setCurrentView={setCurrentView} />
      <CookieConsent />
    </>
  );
}
