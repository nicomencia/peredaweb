import { useState, useEffect, useLayoutEffect, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { api } from './lib/api';
import { cachedSetting, cachedByPrefix, primeCache } from './lib/settings';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import AboutIntro from './components/AboutIntro';
import QuienesSomos from './components/QuienesSomos';
import Productos from './components/Productos';
import Inspirate from './components/Inspirate';
import AmbienteDetail from './components/AmbienteDetail';
const Instalaciones = lazy(() => import('./components/Instalaciones'));
import AreaProfesional from './components/AreaProfesional';
import Footer from './components/Footer';
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
import FloatingShopButton from './components/FloatingShopButton';
import CanalDenuncias from './components/CanalDenuncias';
import ProductosCategory from './components/ProductosCategory';
import PideCita from './components/PideCita';
import Financiacion from './components/Financiacion';
import Presupuesto from './components/Presupuesto';
import HazteCliente from './components/HazteCliente';
import { AvisoLegal, PoliticaPrivacidad, PoliticaCookies, CondicionesVenta } from './components/LegalPages';

// view name (legacy, still used by child components) -> URL path
const VIEW_TO_PATH = {
  home: '/',
  colecciones: '/productos',
  'sobre-mi': '/quienes-somos',
  inspirate: '/inspirate',
  instalaciones: '/instalaciones',
  'area-profesional': '/area-profesional',
  'pide-cita': '/pide-cita',
  financiacion: '/financiacion',
  presupuesto: '/presupuesto',
  'hazte-cliente': '/hazte-cliente',
  'canal-denuncias': '/canal-denuncias',
  'aviso-legal': '/aviso-legal',
  'politica-privacidad': '/politica-privacidad',
  'politica-cookies': '/politica-cookies',
  'condiciones-venta': '/condiciones-venta',
  admin: '/admin',
};

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
  if (pathname.startsWith('/condiciones-venta')) return 'condiciones-venta';
  if (pathname.startsWith('/admin')) return 'admin';
  return 'home';
}

const DEFAULT_DESCRIPTION = 'Saneamientos Pereda: especialistas en baño, fontanería y materiales de construcción en Oviedo. Productos, ambientes, tiendas y presupuesto sin compromiso.';
const DESCRIPTIONS = {
  colecciones: 'Catálogo de Saneamientos Pereda: sanitarios, grifería, muebles de baño, cerámica, fontanería, climatización y materiales de construcción.',
  'productos-categoria': 'Productos de Saneamientos Pereda por categoría: las mejores marcas en baño, fontanería y construcción.',
  'sobre-mi': 'Empresa familiar de Oviedo fundada en 1959. Más de 50 años equipando baños y proyectos con calidad y asesoramiento profesional.',
  inspirate: 'Inspírate con nuestros ambientes de baño: cerámica, mobiliario y decoración seleccionados por Saneamientos Pereda.',
  'ambiente-detail': 'Descubre este ambiente de baño de Saneamientos Pereda.',
  instalaciones: 'Nuestras tiendas en Oviedo, Pruvia y Gijón: direcciones, horarios y contacto de Saneamientos Pereda.',
  'area-profesional': 'Área profesional de Saneamientos Pereda: ventajas, stock y ecommerce para instaladores y profesionales.',
  'canal-denuncias': 'Canal de denuncias de Saneamientos Pereda. Comunica de forma confidencial y consulta el estado con tu PIN.',
  'pide-cita': 'Pide cita previa en Saneamientos Pereda y recibe atención personalizada para tu proyecto de reforma.',
  financiacion: 'Financiación al 0% de interés en Saneamientos Pereda: fracciona tu compra hasta en 24 meses.',
  presupuesto: 'Solicita presupuesto sin compromiso a Saneamientos Pereda para tu proyecto de baño o reforma.',
  'hazte-cliente': 'Hazte cliente profesional de Saneamientos Pereda y accede a condiciones y ventajas exclusivas.',
};

const TITLES = {
  colecciones: 'Productos',
  'productos-categoria': 'Productos',
  'sobre-mi': 'Quiénes somos',
  inspirate: 'Inspírate',
  'ambiente-detail': 'Inspírate',
  instalaciones: 'Instalaciones',
  'area-profesional': 'Área profesional',
  'canal-denuncias': 'Canal de denuncias',
  'pide-cita': 'Pide cita',
  financiacion: 'Financiación',
  presupuesto: 'Presupuesto',
  'hazte-cliente': 'Hazte cliente',
  'aviso-legal': 'Aviso legal',
  'politica-privacidad': 'Política de privacidad',
  'politica-cookies': 'Política de cookies',
  'condiciones-venta': 'Condiciones de venta',
  admin: 'Administración',
};

// Param routes read the URL param and forward it as the prop the component expects.
function CategoryRoute({ setCurrentView, categoryBanners }) {
  const { categoria } = useParams();
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
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    const title = TITLES[currentView];
    const fullTitle = title && currentView !== 'home' ? `${title} | Saneamientos Pereda` : 'Saneamientos Pereda';
    const description = DESCRIPTIONS[currentView] || DEFAULT_DESCRIPTION;
    document.title = fullTitle;
    const upsertMeta = (attr, key, content) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', window.location.href);
  }, [currentView]);

  useEffect(() => {
    async function loadSettings() {
      const { data } = await api
        .from('site_settings')
        .select('key, value')
        .or('key.in.(color_primary,color_secondary,color_dark),key.like.category_banner_%');
      if (data) {
        primeCache(data);
        const banners = {};
        data.forEach((row) => {
          if (row.key === 'color_primary') document.documentElement.style.setProperty('--color-blue', row.value);
          else if (row.key === 'color_secondary') document.documentElement.style.setProperty('--color-cream', row.value);
          else if (row.key === 'color_dark') document.documentElement.style.setProperty('--color-black', row.value);
          else if (row.key.startsWith('category_banner_')) {
            banners[row.key.replace('category_banner_', '')] = row.value;
          }
        });
        setCategoryBanners(banners);
      }
    }
    loadSettings();
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
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero setCurrentView={setCurrentView} />
              <AboutIntro setCurrentView={setCurrentView} />
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
        <Route path="/condiciones-venta" element={<CondicionesVenta />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={null}>
              {isAuthenticated ? <AdminDashboard /> : <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />}
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer setCurrentView={setCurrentView} />
      {currentView !== 'admin' && <FloatingShopButton currentView={currentView} />}
    </>
  );
}
