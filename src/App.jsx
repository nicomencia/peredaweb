import { useState, useEffect, useLayoutEffect, lazy, Suspense } from 'react';
import { api } from './lib/api';
import { cachedSetting, cachedByPrefix, primeCache } from './lib/settings';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import AboutIntro from './components/AboutIntro';
import QuienesSomos from './components/QuienesSomos';
import Productos from './components/Productos';
import CollectionDetail from './components/CollectionDetail';
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

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedAmbiente, setSelectedAmbiente] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [productCategory, setProductCategory] = useState(null);
  const [categoryBanners, setCategoryBanners] = useState(() => {
    const banners = {};
    Object.entries(cachedByPrefix('category_banner_')).forEach(([k, v]) => {
      banners[k.replace('category_banner_', '')] = v;
    });
    return banners;
  });

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
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currentView]);

  useEffect(() => {
    const titles = {
      home: 'Saneamientos Pereda',
      colecciones: 'Productos',
      'productos-categoria': 'Productos',
      'collection-detail': 'Productos',
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
    const title = titles[currentView];
    document.title = title && currentView !== 'home' ? `${title} | Saneamientos Pereda` : 'Saneamientos Pereda';
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
            const cat = row.key.replace('category_banner_', '');
            banners[cat] = row.value;
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

  const renderContent = () => {
    switch (currentView) {
      case 'colecciones':
        return <Productos setCurrentView={setCurrentView} setSelectedCollection={setSelectedCollection} onCategorySelect={(cat) => { setProductCategory(cat); setCurrentView('productos-categoria'); }} />;
      case 'productos-categoria':
        return <ProductosCategory category={productCategory} setCurrentView={setCurrentView} setProductCategory={setProductCategory} categoryBanners={categoryBanners} />;
      case 'collection-detail':
        return <CollectionDetail collectionId={selectedCollection} setCurrentView={setCurrentView} />;
      case 'sobre-mi':
        return <QuienesSomos />;
      case 'inspirate':
        return <Inspirate onSelectAmbiente={(id) => { setSelectedAmbiente(id); setCurrentView('ambiente-detail'); }} />;
      case 'ambiente-detail':
        return <AmbienteDetail ambienteId={selectedAmbiente} setCurrentView={setCurrentView} />;
      case 'instalaciones':
        return (
          <Suspense fallback={null}>
            <Instalaciones setCurrentView={setCurrentView} />
          </Suspense>
        );
      case 'area-profesional':
        return <AreaProfesional setCurrentView={setCurrentView} />;
      case 'canal-denuncias':
        return <CanalDenuncias />;
      case 'pide-cita':
        return <PideCita />;
      case 'financiacion':
        return <Financiacion />;
      case 'presupuesto':
        return <Presupuesto />;
      case 'hazte-cliente':
        return <HazteCliente />;
      case 'aviso-legal':
        return <AvisoLegal />;
      case 'politica-privacidad':
        return <PoliticaPrivacidad />;
      case 'politica-cookies':
        return <PoliticaCookies />;
      case 'condiciones-venta':
        return <CondicionesVenta />;
      case 'admin':
        return (
          <Suspense fallback={null}>
            {isAuthenticated ? (
              <AdminDashboard />
            ) : (
              <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
            )}
          </Suspense>
        );
      default:
        return (
          <>
            <Hero setCurrentView={setCurrentView} />
            <AboutIntro setCurrentView={setCurrentView} />
          </>
        );
    }
  };

  return (
    <>
      <Navigation currentView={currentView} setCurrentView={setCurrentView} setProductCategory={setProductCategory} />
      {renderContent()}
      <Footer setCurrentView={setCurrentView} />
      {!currentView.startsWith('admin') && <FloatingShopButton currentView={currentView} />}
    </>
  );
}
