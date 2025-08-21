import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener el item activo basado en la ruta actual
  const getActiveMenuItem = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path === '/clientes') return 'clientes';
    if (path === '/camiones') return 'camiones';
    if (path === '/rutas') return 'rutas';
    if (path === '/repartos') return 'repartos';
    if (path === '/mapas') return 'mapas';
    return 'dashboard';
  };

  const activeMenuItem = getActiveMenuItem();

  const handleItemClick = (itemId) => {
    switch (itemId) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'clientes':
        navigate('/clientes');
        break;
      case 'camiones':
        navigate('/camiones');
        break;
      case 'rutas':
        navigate('/rutas');
        break;
      case 'repartos':
        navigate('/repartos');
        break;
      case 'mapas':
        navigate('/mapas');
        break;
      default:
        navigate('/dashboard');
    }
  };

  // Obtener el título y breadcrumbs basados en la ruta actual
  const getPageInfo = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return {
          title: 'Dashboard',
          breadcrumbs: [{ label: 'Inicio', href: '/' }, { label: 'Dashboard', href: '/dashboard' }]
        };
      case '/clientes':
        return {
          title: 'Gestión de Clientes',
          breadcrumbs: [{ label: 'Inicio', href: '/' }, { label: 'Clientes', href: '/clientes' }]
        };
      case '/camiones':
        return {
          title: 'Gestión de Camiones',
          breadcrumbs: [{ label: 'Inicio', href: '/' }, { label: 'Camiones', href: '/camiones' }]
        };
      case '/rutas':
        return {
          title: 'Gestión de Rutas',
          breadcrumbs: [{ label: 'Inicio', href: '/' }, { label: 'Rutas', href: '/rutas' }]
        };
      case '/repartos':
        return {
          title: 'Gestión de Repartos',
          breadcrumbs: [{ label: 'Inicio', href: '/' }, { label: 'Repartos', href: '/repartos' }]
        };
      case '/mapas':
        return {
          title: 'Visualización de Mapas',
          breadcrumbs: [{ label: 'Inicio', href: '/' }, { label: 'Mapas', href: '/mapas' }]
        };
      default:
        return {
          title: 'Dashboard',
          breadcrumbs: [{ label: 'Inicio', href: '/' }, { label: 'Dashboard', href: '/dashboard' }]
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeItem={activeMenuItem}
        onItemClick={handleItemClick}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={pageInfo.title}
          breadcrumbs={pageInfo.breadcrumbs}
          user={{ name: 'Pablo Sarasua', avatar: null }}
        />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
