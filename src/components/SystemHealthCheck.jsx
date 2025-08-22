import React, { useState, useEffect } from 'react';
import { healthCheck } from '../services/api';

const SystemHealthCheck = ({ onHealthCheckComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentCheck, setCurrentCheck] = useState('');
  const [checks, setChecks] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isChecking, setIsChecking] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [systemStatus, setSystemStatus] = useState('checking');

  const healthChecks = [
    {
      name: 'Verificando conexión con la API...',
      key: 'api',
      critical: true,
      description: 'Comprobando si el servidor backend está respondiendo'
    },
    {
      name: 'Verificando conexión con la base de datos...',
      key: 'database',
      critical: true,
      description: 'Comprobando conectividad y estado de la base de datos'
    },
    {
      name: 'Verificando tablas del sistema...',
      key: 'tables',
      critical: true,
      description: 'Comprobando que las tablas necesarias existan'
    },
    {
      name: 'Verificando servicios de autenticación...',
      key: 'auth',
      critical: false,
      description: 'Verificando sistema de login y sesiones'
    },
    {
      name: 'Validando configuración del sistema...',
      key: 'config',
      critical: false,
      description: 'Verificando configuraciones y permisos'
    }
  ];

  const performSingleHealthCheck = async (check) => {
    try {
      const result = await healthCheck();
      
      if (result.status === 'ok') {
        // Verificar específicamente la base de datos si es el check de BD
        if (check.key === 'database') {
          if (result.database?.status === 'connected') {
            return {
              status: 'success',
              message: check.name,
              details: result,
              description: check.description
            };
          } else {
            return {
              status: 'error',
              message: check.name,
              details: result,
              description: check.description,
              error: result.database?.error || 'Base de datos no disponible'
            };
          }
        }
        
        // Verificar tablas si es el check de tablas
        if (check.key === 'tables') {
          if (result.database?.status === 'connected') {
            return {
              status: 'success',
              message: check.name,
              details: result,
              description: check.description
            };
          } else {
            return {
              status: 'error',
              message: check.name,
              details: result,
              description: check.description,
              error: 'No se pueden verificar las tablas - BD no disponible'
            };
          }
        }
        
        return {
          status: 'success',
          message: check.name,
          details: result,
          description: check.description
        };
      } else {
        return {
          status: 'error',
          message: check.name,
          details: result,
          description: check.description,
          error: result.message || 'Error en el servicio'
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: check.name,
        details: { error: error.message },
        description: check.description,
        error: error.message
      };
    }
  };

  const performHealthChecks = async () => {
    setIsChecking(true);
    setErrors([]);
    setChecks([]);
    setSystemStatus('checking');
    let currentStep = 0;
    const newErrors = [];

    for (const check of healthChecks) {
      setCurrentCheck(check.name);
      setProgress(((currentStep + 1) / healthChecks.length) * 100);
      
      // Agregar el check actual como "checking"
      setChecks(prev => [...prev, {
        message: check.name,
        status: 'checking',
        description: check.description
      }]);
      
      // Realizar el health check
      const result = await performSingleHealthCheck(check);
      
      // Actualizar el check con el resultado
      setChecks(prev => prev.map((c, index) => 
        index === currentStep ? result : c
      ));
      
      // Si es un error crítico, agregarlo a la lista de errores
      if (result.status === 'error' && check.critical) {
        newErrors.push({
          message: check.name,
          error: result.error,
          description: check.description,
          key: check.key
        });
      }
      
      currentStep++;
      
      // Pausa entre checks para mejor UX
      if (currentStep < healthChecks.length) {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }

    // Determinar el estado final del sistema
    if (newErrors.length === 0) {
      setSystemStatus('healthy');
      setCurrentCheck('Sistema verificado correctamente');
    } else {
      const criticalErrors = newErrors.filter(error => 
        ['api', 'database', 'tables'].includes(error.key)
      );
      
      if (criticalErrors.length > 0) {
        setSystemStatus('critical');
        setCurrentCheck('Sistema no operativo - Errores críticos detectados');
      } else {
        setSystemStatus('degraded');
        setCurrentCheck('Sistema operativo con advertencias');
      }
    }

    setProgress(100);
    
    // Agregar resumen final
    setChecks(prev => [...prev, {
      message: getSystemStatusMessage(),
      status: newErrors.length === 0 ? 'success' : 'error',
      description: getSystemStatusDescription()
    }]);

    // Si hay errores críticos, mostrarlos
    if (newErrors.length > 0) {
      setErrors(newErrors);
    }

    setIsChecking(false);

    // Completar después de un delay
    setTimeout(() => {
      onHealthCheckComplete(newErrors.length === 0);
    }, 2000);
  };

  const getSystemStatusMessage = () => {
    switch (systemStatus) {
      case 'healthy':
        return '✓ Sistema verificado y operativo';
      case 'degraded':
        return '⚠️ Sistema operativo con advertencias';
      case 'critical':
        return '✗ Sistema no operativo';
      default:
        return 'Sistema en verificación';
    }
  };

  const getSystemStatusDescription = () => {
    switch (systemStatus) {
      case 'healthy':
        return 'Todas las verificaciones críticas exitosas';
      case 'degraded':
        return 'Algunos servicios no críticos tienen problemas';
      case 'critical':
        return 'Servicios críticos no disponibles - sistema no operativo';
      default:
        return 'Verificando estado del sistema';
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    performHealthChecks();
  };

  useEffect(() => {
    performHealthChecks();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <span className="text-green-500 text-lg">✓</span>;
      case 'error':
        return <span className="text-red-500 text-lg">✗</span>;
      case 'checking':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'checking':
        return 'text-blue-700';
      default:
        return 'text-gray-600';
    }
  };

  const getSystemStatusColor = () => {
    switch (systemStatus) {
      case 'healthy':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'degraded':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">MapaClientes.uy</h1>
          <p className="text-gray-600 mb-8">Verificación del Sistema</p>
        </div>

        {/* Barra de progreso */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Verificando sistema</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Estado actual */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex-shrink-0">
              {isChecking ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              )}
            </div>
            <div className="flex-1">
              <span className="text-sm text-blue-800 font-medium">{currentCheck}</span>
              {!isChecking && (
                <div className="text-xs text-blue-600 mt-1">
                  {systemStatus === 'healthy' ? 'Sistema operativo' : 
                   systemStatus === 'degraded' ? 'Sistema con advertencias' : 
                   'Sistema no operativo'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lista de verificaciones */}
        <div className="space-y-3 max-h-64 overflow-y-auto mb-6">
          {checks.map((check, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border">
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(check.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${getStatusColor(check.status)}`}>
                  {check.message}
                </div>
                {check.description && (
                  <div className="text-xs text-gray-500 mt-1">
                    {check.description}
                  </div>
                )}
                {check.error && (
                  <div className="text-xs text-red-600 mt-1 font-medium">
                    Error: {check.error}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mostrar errores críticos si existen */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-red-500 text-lg">⚠️</span>
              <span className="text-red-800 font-medium">Problemas detectados:</span>
            </div>
            <div className="space-y-2">
              {errors.map((error, index) => (
                <div key={index} className="text-sm">
                  <div className="text-red-700 font-medium">• {error.message}</div>
                  <div className="text-red-600 text-xs ml-4">{error.description}</div>
                  <div className="text-red-500 text-xs ml-4">Error: {error.error}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-red-200">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                Reintentar verificación ({retryCount})
              </button>
            </div>
          </div>
        )}

        {/* Estado final del sistema */}
        {progress === 100 && (
          <div className={`p-4 border rounded-lg ${getSystemStatusColor()}`}>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">
                {systemStatus === 'healthy' ? '✓' : 
                 systemStatus === 'degraded' ? '⚠️' : '✗'}
              </span>
              <span className="font-medium">
                {getSystemStatusMessage()}
              </span>
            </div>
            <div className="text-center mt-2 text-sm opacity-80">
              {getSystemStatusDescription()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemHealthCheck;
