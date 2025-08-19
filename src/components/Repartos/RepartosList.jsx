import React, { useState, useEffect } from 'react'
import { useRepartosStore } from '../../stores/repartosStore'
import { useClientesStore } from '../../stores/clientesStore'
import { useRutasStore } from '../../stores/rutasStore'
import { useCamionesStore } from '../../stores/camionesStore'
import RepartoCard from './RepartoCard'
import RepartoForm from './RepartoForm'

const RepartosList = () => {
  const { repartos, loading, fetchRepartos, deleteReparto } = useRepartosStore()
  const { clientes, fetchClientes } = useClientesStore()
  const { rutas, fetchRutas } = useRutasStore()
  const { camiones, fetchCamiones } = useCamionesStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedReparto, setSelectedReparto] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [statusFilter, setStatusFilter] = useState('all')
  const [rutaFilter, setRutaFilter] = useState('all')

  useEffect(() => {
    fetchRepartos()
    fetchClientes()
    fetchRutas()
    fetchCamiones()
  }, [fetchRepartos, fetchClientes, fetchRutas, fetchCamiones])

  const filteredRepartos = repartos.filter(reparto => {
    const cliente = clientes.find(c => c.id === reparto.cliente_id)
    const ruta = rutas.find(r => r.id === reparto.ruta_id)

    const matchesSearch = 
      cliente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ruta?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reparto.productos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reparto.observaciones?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || reparto.estado === statusFilter
    const matchesRuta = rutaFilter === 'all' || reparto.ruta_id?.toString() === rutaFilter

    return matchesSearch && matchesStatus && matchesRuta
  })

  const handleEdit = (reparto) => {
    setSelectedReparto(reparto)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este reparto?')) {
      await deleteReparto(id)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedReparto(null)
  }

  const getStatusBadge = (estado) => {
    const badges = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      'en_transito': 'bg-blue-100 text-blue-800',
      entregado: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
      devuelto: 'bg-gray-100 text-gray-800'
    }
    return badges[estado] || 'bg-gray-100 text-gray-800'
  }

  const getStatusCount = (estado) => {
    return repartos.filter(r => r.estado === estado).length
  }

  const getClienteInfo = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId)
    return cliente ? `${cliente.nombre} (${cliente.direccion})` : 'Cliente no encontrado'
  }

  const getRutaInfo = (rutaId) => {
    const ruta = rutas.find(r => r.id === rutaId)
    return ruta ? `${ruta.nombre} (${ruta.ciudad_origen} → ${ruta.ciudad_destino})` : 'Ruta no encontrada'
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
          <h1 className="text-2xl font-bold text-gray-900">Repartos</h1>
          <p className="text-gray-600">Gestiona las entregas y repartos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Reparto
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{repartos.length}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{getStatusCount('pendiente')}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Tránsito</p>
              <p className="text-2xl font-bold text-blue-600">{getStatusCount('en_transito')}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Entregados</p>
              <p className="text-2xl font-bold text-green-600">{getStatusCount('entregado')}</p>
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
              <p className="text-sm text-gray-600">Cancelados</p>
              <p className="text-2xl font-bold text-red-600">{getStatusCount('cancelado')}</p>
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
                placeholder="Buscar por cliente, ruta, productos u observaciones..."
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
            <option value="pendiente">Pendientes</option>
            <option value="en_transito">En Tránsito</option>
            <option value="entregado">Entregados</option>
            <option value="cancelado">Cancelados</option>
            <option value="devuelto">Devueltos</option>
          </select>

          {/* Ruta Filter */}
          <select
            value={rutaFilter}
            onChange={(e) => setRutaFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todas las rutas</option>
            {rutas.map(ruta => (
              <option key={ruta.id} value={ruta.id.toString()}>
                {ruta.nombre} ({ruta.ciudad_origen} → {ruta.ciudad_destino})
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
          Mostrando {filteredRepartos.length} de {repartos.length} repartos
        </div>
      </div>

      {/* Repartos List/Grid */}
      {filteredRepartos.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay repartos</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo reparto.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Reparto
            </button>
          </div>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredRepartos.map(reparto => (
            <RepartoCard
              key={reparto.id}
              reparto={reparto}
              onEdit={handleEdit}
              onDelete={handleDelete}
              viewMode={viewMode}
              getStatusBadge={getStatusBadge}
              getClienteInfo={getClienteInfo}
              getRutaInfo={getRutaInfo}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <RepartoForm
          reparto={selectedReparto}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}

export default RepartosList