import React, { useEffect } from 'react'
import StatsCards from './StatsCards'
import { useClientesStore } from '../../stores/clientesStore'
import { useCamionesStore } from '../../stores/camionesStore'
import { useRepartosStore } from '../../stores/repartosStore'

const Dashboard = () => {
  const { clientes, fetchClientes } = useClientesStore()
  const { camiones, fetchCamiones } = useCamionesStore()
  const { repartos, fetchRepartos } = useRepartosStore()

  useEffect(() => {
    fetchClientes()
    fetchCamiones()
    fetchRepartos()
  }, [fetchClientes, fetchCamiones, fetchRepartos])

  const stats = {
    totalClientes: clientes.length,
    totalCamiones: camiones.length,
    repartosHoy: repartos.filter(r => {
      const today = new Date().toISOString().split('T')[0]
      return r.fecha === today
    }).length,
    repartosCompletados: repartos.filter(r => r.estado === 'completado').length
  }

  const repartosRecientes = repartos
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
    .slice(0, 5)

  const camioneActivos = camiones.filter(c => c.estado === 'activo').slice(0, 3)

  const getEstadoBadge = (estado) => {
    const styles = {
      'completado': 'bg-green-100 text-green-800',
      'en_transito': 'bg-yellow-100 text-yellow-800',
      'pendiente': 'bg-blue-100 text-blue-800',
      'activo': 'bg-green-100 text-green-800',
      'mantenimiento': 'bg-yellow-100 text-yellow-800'
    }
    return styles[estado] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Moderno */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Panel de control general del sistema logístico</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Exportar
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Actualizar
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          
          {/* Repartos Recientes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">Repartos Recientes</h3>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Ver todos</button>
              </div>
              
              <div className="p-6">
                {repartosRecientes.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">ID</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Cliente</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Fecha</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Estado</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Camión</th>
                        </tr>
                      </thead>
                      <tbody>
                        {repartosRecientes.map((reparto, index) => (
                          <tr key={reparto.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-2">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
                                {reparto.id}
                              </span>
                            </td>
                            <td className="py-4 px-2">
                              <div>
                                <div className="font-medium text-gray-900">{reparto.cliente}</div>
                                <div className="text-sm text-gray-500">{reparto.direccion}</div>
                              </div>
                            </td>
                            <td className="py-4 px-2 text-sm text-gray-600">
                              {new Date(reparto.fecha).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoBadge(reparto.estado)}`}>
                                {reparto.estado.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-4 px-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
                                {reparto.camion}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                    </svg>
                    <p className="text-gray-500">No hay repartos recientes</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Camiones Activos */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
                  </svg>
                  Camiones Activos
                </h3>
              </div>
              
              <div className="p-6">
                {camioneActivos.length > 0 ? (
                  <div className="space-y-4">
                    {camioneActivos.map((camion) => (
                      <div key={camion.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{camion.id}</h4>
                          <p className="text-sm text-gray-600">{camion.conductor}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getEstadoBadge(camion.estado)}`}>
                            {camion.estado}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
                    </svg>
                    <p className="text-gray-500">No hay camiones activos</p>
                  </div>
                )}
              </div>
            </div>

            {/* Alertas del Sistema */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  Alertas del Sistema
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
                    <div>
                      <p className="font-medium text-yellow-800">Retraso detectado</p>
                      <p className="text-sm text-yellow-700 mt-1">El reparto R045 lleva 30 min de retraso.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                    <div>
                      <p className="font-medium text-blue-800">Mantenimiento programado</p>
                      <p className="text-sm text-blue-700 mt-1">Camión C003 requiere revisión en 2 días.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
