import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import AdminHomepage from './AdminHomepage';
import AdminPageEditor from './AdminPageEditor';
import AdminAmbientes from './AdminAmbientes';
import AdminTiendas from './AdminTiendas';
import AdminAjustes from './AdminAjustes';
import AdminProductos from './AdminProductos';
import './AdminDashboard.css';

const quienesFields = [
  { key: 'quienes_subtitle', label: 'Subtítulo del hero', type: 'input' },
  { key: 'quienes_intro_1', label: 'Primer párrafo de introducción', type: 'textarea', rows: 5 },
  { key: 'quienes_intro_2', label: 'Segundo párrafo de introducción', type: 'textarea', rows: 5 },
  {
    key: 'quienes_stats',
    label: 'Estadísticas del equipo',
    type: 'list',
    addLabel: '+ Añadir estadística',
    fields: [
      { key: 'number', label: 'Cifra (p. ej. +50)' },
      { key: 'label', label: 'Etiqueta' },
      { key: 'description', label: 'Descripción', textarea: true },
    ],
  },
  { key: 'quienes_somos_bg', label: 'Imagen de cabecera', type: 'image', folder: 'quienes-somos' },
  { key: 'quienes_somos_1', label: 'Foto 1 (Nuestros orígenes)', type: 'image', folder: 'quienes-somos' },
  { key: 'quienes_somos_2', label: 'Foto 2 (Nuestras instalaciones)', type: 'image', folder: 'quienes-somos' },
  { key: 'quienes_somos_3', label: 'Foto 3 (Equipo)', type: 'image', folder: 'quienes-somos' },
  { key: 'quienes_somos_4', label: 'Foto 4 (Profesionales)', type: 'image', folder: 'quienes-somos' },
];

const inspirateFields = [
  { key: 'inspirate_heading', label: 'Título de la sección', type: 'input' },
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

const pidecitaFields = [
  {
    key: 'pidecita_locations',
    label: 'Puntos de contacto para cita previa',
    type: 'list',
    addLabel: '+ Añadir punto',
    fields: [
      { key: 'name', label: 'Nombre' },
      { key: 'phone', label: 'Teléfono' },
      { key: 'email', label: 'Correo' },
    ],
  },
];

const areaFields = [
  { key: 'area_hero_title', label: 'Título principal', type: 'input' },
  { key: 'area_hero_subtitle', label: 'Subtítulo principal', type: 'textarea', rows: 3 },
  { key: 'area_benefits_title', label: 'Título sección beneficios', type: 'input' },
  { key: 'area_benefits_subtitle', label: 'Subtítulo sección beneficios', type: 'textarea', rows: 4 },
  {
    key: 'area_features',
    label: 'Tarjetas de beneficios',
    type: 'list',
    addLabel: '+ Añadir tarjeta',
    fields: [
      { key: 'title', label: 'Título' },
      { key: 'text', label: 'Texto', textarea: true },
    ],
  },
  { key: 'area_profesional_bg', label: 'Imagen de cabecera', type: 'image', folder: 'area-profesional' },
  { key: 'area_faq', label: 'Preguntas frecuentes', type: 'faq' },
];

const tabs = [
  { id: 'portada', label: 'Portada' },
  { id: 'quienes', label: 'Quiénes somos' },
  { id: 'inspirate', label: 'Inspírate' },
  { id: 'tiendas', label: 'Tiendas' },
  { id: 'productos', label: 'Productos' },
  { id: 'area', label: 'Área Profesional' },
  { id: 'cita', label: 'Cita previa' },
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
          <>
            <AdminPageEditor
              title="Nuestras Tiendas - Banner"
              description="Edita el banner de la página de tiendas."
              fields={tiendasFields}
            />
            <div style={{ marginTop: '3rem' }}>
              <AdminTiendas />
            </div>
          </>
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
      case 'cita':
        return (
          <AdminPageEditor
            title="Cita previa"
            description="Edita los puntos de contacto (nombre, teléfono y correo) que se muestran en la página de cita previa."
            fields={pidecitaFields}
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
