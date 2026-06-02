import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import AdminHomepage from './AdminHomepage';
import AdminPageEditor from './AdminPageEditor';
import AdminAmbientes from './AdminAmbientes';
import AdminAjustes from './AdminAjustes';
import AdminProductos from './AdminProductos';
import './AdminDashboard.css';

const quienesFields = [
  { key: 'quienes_subtitle', label: 'Subtítulo del hero', type: 'input' },
  { key: 'quienes_intro_1', label: 'Primer párrafo de introducción', type: 'textarea', rows: 5 },
  { key: 'quienes_intro_2', label: 'Segundo párrafo de introducción', type: 'textarea', rows: 5 },
];

const inspirateFields = [
  { key: 'inspirate_card_1_title', label: 'Tarjeta 1 - Título', type: 'input' },
  { key: 'inspirate_card_1_text', label: 'Tarjeta 1 - Texto', type: 'textarea', rows: 3 },
  { key: 'inspirate_card_2_title', label: 'Tarjeta 2 - Título', type: 'input' },
  { key: 'inspirate_card_2_text', label: 'Tarjeta 2 - Texto', type: 'textarea', rows: 3 },
  { key: 'inspirate_card_3_title', label: 'Tarjeta 3 - Título', type: 'input' },
  { key: 'inspirate_card_3_text', label: 'Tarjeta 3 - Texto', type: 'textarea', rows: 3 },
];

const tiendasFields = [
  { key: 'tiendas_banner_title', label: 'Título del banner', type: 'input' },
  { key: 'tiendas_banner_button', label: 'Texto del botón', type: 'input' },
];

const productosFields = [
  { key: 'productos_subtitle', label: 'Subtítulo de la página', type: 'textarea', rows: 3 },
];

const areaFields = [
  { key: 'area_hero_title', label: 'Título principal', type: 'input' },
  { key: 'area_hero_subtitle', label: 'Subtítulo principal', type: 'textarea', rows: 3 },
  { key: 'area_benefits_title', label: 'Título sección beneficios', type: 'input' },
  { key: 'area_benefits_subtitle', label: 'Subtítulo sección beneficios', type: 'textarea', rows: 4 },
];

const tabs = [
  { id: 'portada', label: 'Portada' },
  { id: 'quienes', label: 'Quiénes somos' },
  { id: 'inspirate', label: 'Inspírate' },
  { id: 'tiendas', label: 'Tiendas' },
  { id: 'productos', label: 'Productos' },
  { id: 'area', label: 'Área Profesional' },
  { id: 'ajustes', label: 'Ajustes generales' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('portada');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'portada':
        return <AdminHomepage />;
      case 'quienes':
        return (
          <AdminPageEditor
            title="Quiénes somos"
            description="Edita los textos de la página Quiénes somos."
            fields={quienesFields}
          />
        );
      case 'inspirate':
        return (
          <>
            <AdminPageEditor
              title="Inspírate - Textos"
              description="Edita los textos de las tarjetas de la sección Inspírate."
              fields={inspirateFields}
            />
            <div style={{ marginTop: '3rem' }}>
              <AdminAmbientes />
            </div>
          </>
        );
      case 'tiendas':
        return (
          <AdminPageEditor
            title="Nuestras Tiendas"
            description="Edita el banner y textos de la página de tiendas."
            fields={tiendasFields}
          />
        );
      case 'productos':
        return (
          <>
            <AdminPageEditor
              title="Productos - Textos"
              description="Edita los textos de la página de productos."
              fields={productosFields}
            />
            <div style={{ marginTop: '3rem' }}>
              <AdminProductos />
            </div>
          </>
        );
      case 'area':
        return (
          <AdminPageEditor
            title="Área Profesional"
            description="Edita los textos de la página de Área Profesional."
            fields={areaFields}
          />
        );
      case 'ajustes':
        return <AdminAjustes />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="admin-dashboard-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-dashboard-content">
        {renderTab()}
      </div>
    </div>
  );
}
