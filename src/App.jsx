import React, { useState } from 'react';
import SystemHealthCheck from './components/SystemHealthCheck';
import MainLayout from './components/Layout/MainLayout';

// Dashboard temporal para mostrar el layout
const Dashboard = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Total Clientes</h3>
        <p className="text-3xl font-bold text-blue-600 mt-2">20</p>
        <p className="text-sm text-green-600 mt-1">+2 este mes</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Camiones Activos</h3>
        <p className="text-3xl font-bold text-green-600 mt-2">6/8</p>
        <p className="text-sm text-gray-600 mt-1">2 en mantenimiento</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Repartos Hoy</h3>
        <p className="text-3xl font-bold text-purple-600 mt-2">15</p>
        <p className="text-sm text-blue-600 mt-1">3 completados</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Eficiencia</h3>
        <p className="text-3xl font-bold text-orange-600 mt-2">87%</p>
        <p className="text-sm text-green-600 mt-1">+5% vs ayer</p>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div>
            <p className="font-medium text-gray-900">Nuevo reparto asignado</p>
            <p className="text-sm text-gray-600">Camión ABC-123 → Cliente: Empresa XYZ</p>
          </div>
          <span className="text-sm text-gray-500">Hace 10 min</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div>
            <p className="font-medium text-gray-900">Entrega completada</p>
            <p className="text-sm text-gray-600">Reparto #1234 entregado exitosamente</p>
          </div>
          <span className="text-sm text-gray-500">Hace 25 min</span>
        </div>
      </div>
    </div>
  </div>
);

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
      <Dashboard />
    </MainLayout>
  );
}

export default App;
