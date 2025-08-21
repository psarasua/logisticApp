import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SystemHealthCheck from './components/SystemHealthCheck';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './components/Dashboard/Dashboard';
import Clientes from './pages/Clientes';
import Camiones from './pages/Camiones';
import Rutas from './pages/Rutas';
import Repartos from './pages/Repartos';
import MapView from './components/Maps/MapView';

function App() {
  const [systemReady, setSystemReady] = useState(false);
  const [showHealthCheck, setShowHealthCheck] = useState(true);

  const handleHealthCheckComplete = (isHealthy) => {
    setSystemReady(isHealthy);
    if (isHealthy) {
      setTimeout(() => setShowHealthCheck(false), 600);
    }
  };

  if (showHealthCheck) {
    return <SystemHealthCheck onHealthCheckComplete={handleHealthCheckComplete} />;
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/camiones" element={<Camiones />} />
        <Route path="/rutas" element={<Rutas />} />
        <Route path="/repartos" element={<Repartos />} />
        <Route path="/mapas" element={<MapView />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
