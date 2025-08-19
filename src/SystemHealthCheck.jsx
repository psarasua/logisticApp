import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader2, Server, Database, Activity } from 'lucide-react';

const SystemHealthCheck = ({ onHealthCheckComplete }) => {
  const [checks, setChecks] = useState({
    api: { status: 'checking', message: 'Iniciando verificación...', details: '' },
    database: { status: 'checking', message: 'Preparando verificación...', details: '' },
    overall: { status: 'checking', message: 'Conectando al sistema...', details: '' },
    progress: 0,
    stats: null
  });

  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    performHealthChecks();
  }, []);

  const performHealthChecks = async () => {
    const updateProgress = (progress, message, details = '') => {
      setChecks(prev => ({ 
        ...prev, 
        progress, 
        overall: { ...prev.overall, message, details }
      }));
    };

    try {
      updateProgress(10, 'Verificando conectividad del servidor...');
      await delay(300);

      // Fase 1: Ping básico
      try {
        const pingResponse = await fetch('/api/ping', { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (pingResponse.ok) {
          const pingData = await pingResponse.json();
          setChecks(prev => ({
            ...prev,
            api: {
              status: 'success',
              message: 'Servidor conectado',
              details: `Respuesta recibida: ${pingData.message}`
            }
          }));
          updateProgress(40, 'Servidor conectado, verificando base de datos...');
        } else {
          throw new Error(`HTTP ${pingResponse.status}`);
        }
      } catch (error) {
        setChecks(prev => ({
          ...prev,
          api: {
            status: 'error',
            message: 'Error de conexión al servidor',
            details: error.message
          }
        }));
        updateProgress(100, 'Error en la conexión del servidor');
        completeCheck(false);
        return;
      }

      await delay(500);

      // Fase 2: Health check completo
      try {
        const healthResponse = await fetch('/api/health');
        
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          const dbConnected = healthData.services.database === 'connected';
          
          setChecks(prev => ({
            ...prev,
            database: {
              status: dbConnected ? 'success' : 'warning',
              message: dbConnected ? 'Base de datos operativa' : 'Base de datos con advertencias',
              details: `Tiempo de respuesta: ${healthData.responseTime}`
            }
          }));
          
          updateProgress(70, 'Base de datos verificada, obteniendo estadísticas...');
          
          // Fase 3: Estadísticas del sistema
          try {
            const statusResponse = await fetch('/api/status');
            if (statusResponse.ok) {
              const statusData = await statusResponse.json();
              setChecks(prev => ({
                ...prev,
                stats: statusData.statistics
              }));
            }
          } catch (error) {
            console.warn('No se pudieron obtener estadísticas:', error);
          }

          updateProgress(100, dbConnected ? 'Sistema completamente operativo' : 'Sistema operativo con advertencias');
          completeCheck(true);
          
        } else {
          throw new Error(`Health check falló: ${healthResponse.status}`);
        }
        
      } catch (error) {
        // Si el ping funcionó pero el health falló, modo degradado
        setChecks(prev => ({
          ...prev,
          database: {
            status: 'warning',
            message: 'Modo de funcionalidad limitada',
            details: 'El servidor responde pero hay problemas con servicios internos'
          }
        }));
        
        updateProgress(100, 'Sistema en modo degradado');
        completeCheck(true); // Permitir acceso en modo degradado
      }

    } catch (error) {
      updateProgress(100, 'Error crítico del sistema');
      setChecks(prev => ({
        ...prev,
        overall: {
          status: 'error',
          message: 'Error crítico del sistema',
          details: error.message
        }
      }));
      completeCheck(false);
    }
  };

  const completeCheck = (success) => {
    const totalTime = Date.now() - startTime;
    setChecks(prev => ({
      ...prev,
      overall: {
        status: success ? 'success' : 'error',
        message: success ? 'Sistema listo para usar' : 'Sistema no disponible',
        details: `Verificación completada en ${totalTime}ms`
      }
    }));
    
    setTimeout(() => {
      setIsComplete(true);
      onHealthCheckComplete(success);
    }, 800);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return ;
      case 'warning':
        return ;
      case 'error':
        return ;
      case 'checking':
      default:
        return ;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'checking': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    
{/* Header */} MapaClientes.uy Verificando conectividad del sistema {/* Verificaciones */} {/* API Check */} {getStatusIcon(checks.api.status)} Servidor API {checks.api.message} {checks.api.details && ( {checks.api.details} )} {/* Database Check */} {getStatusIcon(checks.database.status)} Base de Datos {checks.database.message} {checks.database.details && ( {checks.database.details} )} {/* Estadísticas si están disponibles */} {checks.stats && ( Sistema Operativo Clientes: {checks.stats.clientes} Camiones: {checks.stats.camiones} Rutas: {checks.stats.rutas} Repartos: {checks.stats.repartos} )} {/* Barra de progreso */} {checks.progress}% completado {checks.overall.details} {/* Estado final */} {isComplete && ( {checks.overall.status === 'success' ? '✓ Sistema verificado y listo para usar' : '⚠ Error en la verificación del sistema' } )} {/* Botón de reintento */} {isComplete && checks.overall.status === 'error' && ( { setIsComplete(false); setChecks({ api: { status: 'checking', message: 'Iniciando verificación...', details: '' }, database: { status: 'checking', message: 'Preparando verificación...', details: '' }, overall: { status: 'checking', message: 'Conectando al sistema...', details: '' }, progress: 0, stats: null }); performHealthChecks(); }} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200" > Reintentar Verificación )} {/* Info adicional */} Sistema de Gestión Logística v1.0 ); }; export default SystemHealthCheck;
    
