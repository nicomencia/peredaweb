// Single source for the site's URLs. App.jsx's setCurrentView adapter and every
// <Link> build paths from here, so a navigational link and the programmatic
// navigation it replaced can never disagree.

// view name (legacy, still used by child components) -> URL path
export const VIEW_TO_PATH = {
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
  'politica-redes-sociales': '/politica-redes-sociales',
  'condiciones-venta': '/condiciones-venta',
  desistimiento: '/desistimiento',
  'preguntas-frecuentes': '/preguntas-frecuentes',
  admin: '/admin',
};

export const pathFor = (view) => VIEW_TO_PATH[view] || '/';
export const categoryPath = (key) => `/productos/${key}`;
export const ambientePath = (id) => `/inspirate/${id}`;
