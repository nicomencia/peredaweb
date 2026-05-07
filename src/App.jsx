import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import AboutIntro from './components/AboutIntro';
import QuienesSomos from './components/QuienesSomos';
import Productos from './components/Productos';
import CollectionDetail from './components/CollectionDetail';
import Inspirate from './components/Inspirate';
import AmbienteDetail from './components/AmbienteDetail';
import Instalaciones from './components/Instalaciones';
import AreaProfesional from './components/AreaProfesional';
import Footer from './components/Footer';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
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

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currentView]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'colecciones':
        return <Productos setCurrentView={setCurrentView} setSelectedCollection={setSelectedCollection} onCategorySelect={(cat) => { setProductCategory(cat); setCurrentView('productos-categoria'); }} />;
      case 'productos-categoria':
        return <ProductosCategory category={productCategory} setCurrentView={setCurrentView} setProductCategory={setProductCategory} />;
      case 'collection-detail':
        return <CollectionDetail collectionId={selectedCollection} setCurrentView={setCurrentView} />;
      case 'sobre-mi':
        return <QuienesSomos />;
      case 'inspirate':
        return <Inspirate onSelectAmbiente={(id) => { setSelectedAmbiente(id); setCurrentView('ambiente-detail'); }} />;
      case 'ambiente-detail':
        return <AmbienteDetail ambienteId={selectedAmbiente} setCurrentView={setCurrentView} />;
      case 'instalaciones':
        return <Instalaciones setCurrentView={setCurrentView} />;
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
        if (isAuthenticated) {
          return <AdminDashboard />;
        } else {
          return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
        }
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
      <FloatingShopButton currentView={currentView} />
    </>
  );
}
