import React from 'react'

const ClienteCard = ({ cliente, onEdit, onDelete }) => {
  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center">
            <div 
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{ width: '50px', height: '50px', fontSize: '20px' }}
            >
              {cliente.nombre?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h5 className="card-title mb-1">{cliente.nombre}</h5>
              <small className="text-muted">ID: {cliente.id}</small>
            </div>
          </div>
          <span className={`badge ${cliente.estado === 'activo' ? 'bg-success' : 'bg-secondary'}`}>
            {cliente.estado || 'activo'}
          </span>
        </div>

        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <i className="bi bi-telephone me-2 text-muted"></i>
            <small>{cliente.telefono}</small>
          </div>
          <div className="d-flex align-items-center mb-2">
            <i className="bi bi-envelope me-2 text-muted"></i>
            <small className="text-truncate">{cliente.email}</small>
          </div>
          <div className="d-flex align-items-start">
            <i className="bi bi-geo-alt me-2 text-muted mt-1"></i>
            <small className="text-muted">{cliente.direccion}</small>
          </div>
        </div>
      </div>

      <div className="card-footer bg-light">
        <div className="btn-group w-100">
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={onEdit}
          >
            <i className="bi bi-pencil me-1"></i>
            Editar
          </button>
          <button 
            className="btn btn-outline-danger btn-sm"
            onClick={onDelete}
          >
            <i className="bi bi-trash me-1"></i>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClienteCard
