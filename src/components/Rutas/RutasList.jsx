import React, { useState, useEffect } from 'react'
import { useRutasStore } from '../../stores/rutasStore'
import { useClientesStore } from '../../stores/clientesStore'
import { useCamionesStore } from '../../stores/camionesStore'
import RutaCard from './RutaCard'
import RutaForm from './RutaForm'

const RutasList = () => {
  const { rutas, loading, fetchRutas, deleteRuta } = useRutasStore()
  const { clientes, fetchClientes } = useClientesStore()
  const { camiones, fetchCamiones } = useCamionesStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedRuta, setSelectedRuta] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [statusFilter, setStatusFilter] = useState('all')
  const [camionFilter, setCamionFilter] = useState('all')

  useEffect(() => {
    fetchRutas()
    fetchClientes()
    fetchCamiones()
  }, [fetchRutas, fetchClientes, fetchCamiones])

  const filteredRutas = rutas.filter(ruta => {
    const matchesSearch = 
      ruta.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ruta.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ruta.ciudad_origen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ruta.ciudad_destino?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || ruta.estado === statusFilter
    const matchesCamion = camionFilter === 'all' || ruta.camion_id?.toString() === camionFilter

    return matchesSearch && matchesStatus && matchesCamion
  })

  const handleEdit = (ruta) => {
    setSelectedRuta(ruta)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta ruta?')) {
      await deleteRuta(id)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedRuta(null)
  }

  const getStatusBadge = (estado) => {
    const badges = {
      activa: 'bg-green-100 text-green-800',
      inactiva: 'bg-red-100 text-red-800',
      mantenimiento: 'bg-yellow-100 text-yellow-800'
    }
    return badges[estado] || 'bg-gray-100 text-gray-800'
  }

  const getStatusCount = (estado) => {
    return rutas.filter(r => r.estado === estado).length
  }

  const getCamionInfo = (camionId) => {
    const camion = camiones.find(c => c.id === camionId)
    return camion ? `${camion.patente} (${camion.marca} ${camion.modelo})` : 'Sin asignar'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rutas</h1>
          <p className="text-gray-600">Gestiona las rutas de distribución</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Ruta
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Rutas</p>
              <p className="text-2xl font-bold text-gray-900">{rutas.length}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Activas</p>
              <p className="text-2xl font-bold text-green-600">{getStatusCount('activa')}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Mantenimiento</p>
              <p className="text-2xl font-bold text-yellow-600">{getStatusCount('mantenimiento')}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactivas</p>
              <p className="text-2xl font-bold text-red-600">{getStatusCount('inactiva')}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm border space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre, descripción, origen o destino..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos los estados</option>
            <option value="activa">Activas</option>
            <option value="mantenimiento">En Mantenimiento</option>
            <option value="inactiva">Inactivas</option>
          </select>

          {/* Camion Filter */}
          <select
            value={camionFilter}
            onChange={(e) => setCamionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos los camiones</option>
            {camiones.map(camion => (
              <option key={camion.id} value={camion.id.toString()}>
                {camion.patente} - {camion.marca} {camion.modelo}
              </option>
            ))}
          </select>

          {/* View Mode */}
          <div className="flex rounded-lg border border-gray-300">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-r-lg ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Mostrando {filteredRutas.length} de {rutas.length} rutas
        </div>
      </div>

      {/* Rutas List/Grid */}
      {filteredRutas.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay rutas</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza creando una nueva ruta.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva Ruta
            </button>
          </div>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredRutas.map(ruta => (
            <RutaCard
              key={ruta.id}
              ruta={ruta}
              onEdit={handleEdit}
              onDelete={handleDelete}
              viewMode={viewMode}
              getStatusBadge={getStatusBadge}
              getCamionInfo={getCamionInfo}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <RutaForm
          ruta={selectedRuta}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}

export default RutasList