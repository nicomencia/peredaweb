import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Collections from './components/Collections';
import CollectionDetail from './components/CollectionDetail';
import Inspirate from './components/Inspirate';
import Instalaciones from './components/Instalaciones';
import Footer from './components/Footer';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
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
        return <Collections setCurrentView={setCurrentView} setSelectedCollection={setSelectedCollection} />;
      case 'collection-detail':
        return <CollectionDetail collectionId={selectedCollection} setCurrentView={setCurrentView} />;
      case 'sobre-mi':
        return <About />;
      case 'inspirate':
        return <Inspirate />;
      case 'instalaciones':
        return <Instalaciones />;
      case 'admin':
        if (isAuthenticated) {
          return <AdminDashboard />;
        } else {
          return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
        }
      default:
        return <Hero />;
    }
  };

  return (
    <>
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      {renderContent()}
      <Footer setCurrentView={setCurrentView} />
    </>
  );
}
