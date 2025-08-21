import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  MapPin,        // ✅ Cambiar Route por MapPin
  Package, 
  Map, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search
} from 'lucide-react';

const Sidebar = ({ collapsed, onToggle, activeItem, onItemClick }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'clientes', label: 'Clientes', icon: Users, badge: '20' },
    { id: 'camiones', label: 'Camiones', icon: Truck, badge: '8' },
    { id: 'rutas', label: 'Rutas', icon: MapPin, badge: null },
    { id: 'repartos', label: 'Repartos', icon: Package, badge: '15' },
    { id: 'mapas', label: 'Mapas', icon: Map, badge: null },
    { id: 'settings', label: 'Configuración', icon: Settings, badge: null }
  ];

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Truck className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">MapaClientes</h2>
                <p className="text-xs text-gray-500">Logística Pro</p>
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title={collapsed ? item.label : ''}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      isActive 
                        ? 'bg-white bg-opacity-20 text-white' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${
          collapsed ? 'justify-center' : ''
        }`}>
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
