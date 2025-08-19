import React, { useState, useEffect } from 'react'
import { useClientesStore } from '../../stores/clientesStore'
import ClienteCard from './ClienteCard'
import ClienteForm from './ClienteForm'

const ClientesList = () => {
  const { clientes, loading, fetchClientes, deleteCliente } = useClientesStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // grid, list

  useEffect(() => {
    fetchClientes()
  }, [fetchClientes])

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefono?.includes(searchTerm) ||
    cliente.direccion?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (cliente) => {
    setSelectedCliente(cliente)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        await deleteCliente(id)
      } catch (error) {
        console.error('Error al eliminar cliente:', error)
      }
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedCliente(null)
  }

  if (showForm) {
    return (
      <ClienteForm 
        cliente={selectedCliente}
        onClose={handleCloseForm}
        onSuccess={() => {
          handleCloseForm()
          fetchClientes()
        }}
      />
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Clientes</h2>
          <p className="text-muted mb-0">
            Gestión de clientes - {filteredClientes.length} cliente{filteredClientes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo Cliente
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre, email, teléfono o dirección..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select className="form-select">
                <option value="">Todos los estados</option>
                <option value="activo">Activos</option>
                <option value="inactivo">Inactivos</option>
              </select>
            </div>
            <div className="col-md-3">
              <div className="btn-group w-100" role="group">
                <input
                  type="radio"
                  className="btn-check"
                  name="viewMode"
                  id="gridView"
                  checked={viewMode === 'grid'}
                  onChange={() => setViewMode('grid')}
                />
                <label className="btn btn-outline-secondary" htmlFor="gridView">
                  <i className="bi bi-grid-3x3-gap"></i>
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="viewMode"
                  id="listView"
                  checked={viewMode === 'list'}
                  onChange={() => setViewMode('list')}
                />
                <label className="btn btn-outline-secondary" htmlFor="listView">
                  <i className="bi bi-list-ul"></i>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-muted">Cargando clientes...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredClientes.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-people fs-1 text-muted"></i>
          <h4 className="mt-3 text-muted">
            {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
          </h4>
          <p className="text-muted">
            {searchTerm 
              ? `No hay clientes que coincidan con "${searchTerm}"`
              : 'Comienza agregando tu primer cliente'
            }
          </p>
          {!searchTerm && (
            <button 
              className="btn btn-primary mt-2"
              onClick={() => setShowForm(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Agregar Primer Cliente
            </button>
          )}
        </div>
      )}

      {/* Grid View */}
      {!loading && viewMode === 'grid' && filteredClientes.length > 0 && (
        <div className="row g-4">
          {filteredClientes.map((cliente) => (
            <div key={cliente.id} className="col-sm-6 col-lg-4">
              <ClienteCard
                cliente={cliente}
                onEdit={() => handleEdit(cliente)}
                onDelete={() => handleDelete(cliente.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {!loading && viewMode === 'list' && filteredClientes.length > 0 && (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                  <th>Última actividad</th>
                  <th width="120">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div 
                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: '40px', height: '40px', fontSize: '16px' }}
                        >
                          {cliente.nombre?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-medium">{cliente.nombre}</div>
                          <small className="text-muted">ID: {cliente.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>{cliente.telefono}</div>
                        <small className="text-muted">{cliente.email}</small>
                      </div>
                    </td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '200px' }}>
                        {cliente.direccion}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        cliente.estado === 'activo' ? 'bg-success' : 'bg-secondary'
                      }`}>
                        {cliente.estado || 'activo'}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted">
                        {cliente.ultimaActividad || 'No registrada'}
                      </small>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleEdit(cliente)}
                          title="Editar cliente"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(cliente.id)}
                          title="Eliminar cliente"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientesList
