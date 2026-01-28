import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import TopBar from './components/TopBar';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import QuienesSomos from './components/QuienesSomos';
import Productos from './components/Productos';
import CollectionDetail from './components/CollectionDetail';
import Inspirate from './components/Inspirate';
import Instalaciones from './components/Instalaciones';
import AreaProfesional from './components/AreaProfesional';
import Footer from './components/Footer';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import FloatingShopButton from './components/FloatingShopButton';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        return <Productos setCurrentView={setCurrentView} setSelectedCollection={setSelectedCollection} />;
      case 'collection-detail':
        return <CollectionDetail collectionId={selectedCollection} setCurrentView={setCurrentView} />;
      case 'sobre-mi':
        return <QuienesSomos />;
      case 'inspirate':
        return <Inspirate />;
      case 'instalaciones':
        return <Instalaciones />;
      case 'area-profesional':
        return <AreaProfesional setCurrentView={setCurrentView} />;
      case 'admin':
        if (isAuthenticated) {
          return <AdminDashboard />;
        } else {
          return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
        }
      default:
        return <Hero setCurrentView={setCurrentView} />;
    }
  };

  const isAreaProfesional = currentView === 'area-profesional';

  return (
    <>
      {!isAreaProfesional && <TopBar setCurrentView={setCurrentView} />}
      {!isAreaProfesional && <Navigation currentView={currentView} setCurrentView={setCurrentView} />}
      {renderContent()}
      {!isAreaProfesional && <Footer setCurrentView={setCurrentView} />}
      <FloatingShopButton currentView={currentView} />
    </>
  );
}
