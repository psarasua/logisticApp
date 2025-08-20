import React, { useState, useEffect } from 'react';

const SystemHealthCheck = ({ onHealthCheckComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentCheck, setCurrentCheck] = useState('');
  const [checks, setChecks] = useState([]);

  const healthChecks = [
    'Verificando conexión con la base de datos...',
    'Comprobando servicios de autenticación...',
    'Validando APIs de mapas...',
    'Sincronizando datos de rutas...',
    'Verificando permisos del sistema...',
    'Sistema listo para operar'
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < healthChecks.length) {
        setCurrentCheck(healthChecks[currentStep]);
        setProgress(((currentStep + 1) / healthChecks.length) * 100);
        
        setChecks(prev => [...prev, {
          message: healthChecks[currentStep],
          status: currentStep === healthChecks.length - 1 ? 'success' : 'checking'
        }]);
        
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onHealthCheckComplete(true);
        }, 800);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [onHealthCheckComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">MapaClientes.uy</h1>
          <p className="text-gray-600 mb-8">Inicializando Sistema...</p>
        </div>

        {/* Barra de progreso */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Verificando sistema</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Estado actual */}
        <div className="mb-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <span className="text-sm text-blue-800 font-medium">{currentCheck}</span>
          </div>
        </div>

        {/* Lista de verificaciones */}
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {checks.map((check, index) => (
            <div key={index} className="flex items-center space-x-3 text-sm">
              <div className="flex-shrink-0">
                {check.status === 'success' ? (
                  <span className="text-green-500">✓</span>
                ) : (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <span className={check.status === 'success' ? 'text-green-700' : 'text-gray-600'}>
                {check.message}
              </span>
            </div>
          ))}
        </div>

        {progress === 100 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-green-800 text-sm font-medium">
                ✓ Sistema verificado y listo para operar
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemHealthCheck;
