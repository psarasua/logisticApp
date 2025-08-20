import React, { useState } from 'react';
import SystemHealthCheck from './components/SystemHealthCheck';

// Importa tus otros componentes existentes
// import LoginPage from './pages/LoginPage';
// import Dashboard from './components/Dashboard';
// etc...

function App() {
  const [systemReady, setSystemReady] = useState(false);
  const [showHealthCheck, setShowHealthCheck] = useState(true);

  const handleHealthCheckComplete = (isHealthy) => {
    setSystemReady(isHealthy);
    if (isHealthy) {
      // Transición suave al login después de verificar el sistema
      setTimeout(() => setShowHealthCheck(false), 600);
    }
  };

  // Mostrar health check primero
  if (showHealthCheck) {
    return <SystemHealthCheck onHealthCheckComplete={handleHealthCheckComplete} />;
  }

  // Tu aplicación actual - aquí va tu código existente
  return (
    <div>
      {/* 
        Aquí va todo tu código actual de la aplicación
        Por ejemplo:
        - Tu sistema de routing
        - Componente de login
        - Dashboard
        - etc.
      */}
      
      {/* Página de Login con tu diseño actual */}
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md mx-4">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">MapaClientes.uy</h1>
            <p className="text-gray-600 mb-8">Sistema de Gestión Logística</p>
          </div>

          {/* Formulario de Login */}
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin"
                defaultValue="admin"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin"
                defaultValue="admin"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
            >
              🚪 Ingresar
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Demo: admin/admin
          </p>
          
          {/* Indicador de sistema verificado */}
          {systemReady && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-green-800 text-sm font-medium">
                  Sistema verificado y operativo
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

        
      
    
  );
}

export default App;
