import React from 'react'

const RepartoCard = ({ reparto, onEdit, onDelete, viewMode, getStatusBadge, getClienteInfo, getRutaInfo }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">#{reparto.id}</h3>
              <p className="text-sm text-gray-600">{getClienteInfo(reparto.cliente_id)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-gray-600">Fecha</p>
              <p className="font-medium">{formatDate(reparto.fecha_entrega_programada)}</p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">Peso</p>
              <p className="font-medium">{reparto.peso_total}kg</p>
            </div>

            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(reparto.estado)}`}>
              {reparto.estado?.replace('_', ' ').charAt(0).toUpperCase() + reparto.estado?.replace('_', ' ').slice(1)}
            </span>

            <div className="flex space-x-2">
              <button onClick={() => onEdit(reparto)} className="text-blue-600 hover:text-blue-800 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button onClick={() => onDelete(reparto.id)} className="text-red-600 hover:text-red-800 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(reparto.estado)}`}>
            {reparto.estado?.replace('_', ' ').charAt(0).toUpperCase() + reparto.estado?.replace('_', ' ').slice(1)}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-1">Reparto #{reparto.id}</h3>
        <p className="text-gray-600 mb-3 text-sm">{getClienteInfo(reparto.cliente_id)}</p>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Fecha programada:</span>
            <span className="font-medium">{formatDate(reparto.fecha_entrega_programada)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Peso total:</span>
            <span className="font-medium">{reparto.peso_total}kg</span>
          </div>

          {reparto.productos && (
            <div className="flex justify-between">
              <span className="text-gray-500">Productos:</span>
              <span className="font-medium text-right max-w-[150px] truncate" title={reparto.productos}>
                {reparto.productos}
              </span>
            </div>
          )}
        </div>

        {reparto.observaciones && (
          <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-gray-600">
            <strong>Observaciones:</strong> {reparto.observaciones}
          </div>
        )}
      </div>

      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {getRutaInfo(reparto.ruta_id)}
        </div>

        <div className="flex space-x-2">
          <button onClick={() => onEdit(reparto)} className="text-blue-600 hover:text-blue-800 p-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button onClick={() => onDelete(reparto.id)} className="text-red-600 hover:text-red-800 p-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default RepartoCard