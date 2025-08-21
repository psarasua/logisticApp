import React from 'react';
import { Bell, Search, User, Settings, ChevronDown } from 'lucide-react';
import Badge from '../ui/Badge';

const Header = ({ title, breadcrumbs = [], user = { name: 'Admin', avatar: null } }) => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        
        {/* Left: Title and Breadcrumbs */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center space-x-2 mt-1">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {index > 0 && <span className="text-gray-400">/</span>}
                  <span className={`text-sm ${
                    index === breadcrumbs.length - 1 
                      ? 'text-blue-600 font-medium' 
                      : 'text-gray-500 hover:text-gray-700 cursor-pointer'
                  }`}>
                    {crumb.label}
                  </span>
                </div>
              ))}
            </nav>
          )}
        </div>

        {/* Right: Search, Notifications, User */}
        <div className="flex items-center space-x-4">
          
          {/* Global Search */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en todo el sistema..."
              className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {/* Notification items */}
                  <div className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Nuevo reparto asignado</p>
                        <p className="text-sm text-gray-600">Reparto #1234 ha sido asignado al camión ABC-123</p>
                        <p className="text-xs text-gray-400 mt-1">Hace 5 minutos</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Entrega completada</p>
                        <p className="text-sm text-gray-600">El reparto a Cliente XYZ fue completado exitosamente</p>
                        <p className="text-xs text-gray-400 mt-1">Hace 15 minutos</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-2">
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
                    <User className="w-4 h-4" />
                    <span>Mi Perfil</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
                    <Settings className="w-4 h-4" />
                    <span>Configuración</span>
                  </button>
                  <hr className="my-2" />
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50">
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
