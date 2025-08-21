import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SystemHealthCheck from './components/SystemHealthCheck';
import MainLayout from './components/Layout/MainLayout';
import { useAuthStore } from './stores/authStore';
import Login from './components/Login';
import { toast } from 'react-hot-toast';

// Lazy loading para componentes grandes (optimización)
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const Clientes = lazy(() => import('./pages/Clientes'));
const Camiones = lazy(() => import('./pages/Camiones'));
const Rutas = lazy(() => import('./pages/Rutas'));
const Repartos = lazy(() => import('./pages/Repartos'));
const MapView = lazy(() => import('./components/Maps/MapView'));

// Componente de carga
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

// Componente de error
const ErrorBoundary = ({ error }) => (
  <div className="flex items-center justify-center min-h-screen bg-red-50">
    <div className="text-center">
      <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <h2 className="text-2xl font-bold text-red-800 mb-2">Error en la Aplicación</h2>
      <p className="text-red-600 mb-4">Ha ocurrido un error inesperado</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Recargar Página
      </button>
    </div>
  </div>
);

function App() {
  const [systemReady, setSystemReady] = useState(false);
  const [showHealthCheck, setShowHealthCheck] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { login } = useAuthStore();

  const handleHealthCheckComplete = (isHealthy) => {
    setSystemReady(isHealthy);
    if (isHealthy) {
      setLoading(true);
      setTimeout(() => {
        setShowHealthCheck(false);
        setLoading(false);
      }, 600);
    }
  };

  // Manejo de errores global
  React.useEffect(() => {
    const handleError = (error) => {
      console.error('Error global:', error);
      setError(error);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', (event) => handleError(event.reason));

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', (event) => handleError(event.reason));
    };
  }, []);

  // Mostrar error si existe
  if (error) {
    return <ErrorBoundary error={error} />;
  }

  // Mostrar health check
  if (showHealthCheck) {
    return <SystemHealthCheck onHealthCheckComplete={handleHealthCheckComplete} />;
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // Mostrar loading durante la transición
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <MainLayout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/camiones" element={<Camiones />} />
          <Route path="/rutas" element={<Rutas />} />
          <Route path="/repartos" element={<Repartos />} />
          <Route path="/mapas" element={<MapView />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}

export default App;
