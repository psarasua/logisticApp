import React from 'react'

const CamionCard = ({ camion, onEdit, onDelete, viewMode, getStatusBadge }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{camion.patente}</h3>
              <p className="text-sm text-gray-600">{camion.marca} {camion.modelo} ({camion.año})</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Conductor</p>
              <p className="font-medium">{camion.conductor || 'Sin asignar'}</p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">Capacidad</p>
              <p className="font-medium">{camion.capacidad_carga}kg</p>
            </div>

            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(camion.estado)}`}>
              {camion.estado?.charAt(0).toUpperCase() + camion.estado?.slice(1)}
            </span>

            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(camion)}
                className="text-blue-600 hover:text-blue-800 p-1"
                title="Editar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(camion.id)}
                className="text-red-600 hover:text-red-800 p-1"
                title="Eliminar"
              >
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

  // Grid view
  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(camion.estado)}`}>
            {camion.estado?.charAt(0).toUpperCase() + camion.estado?.slice(1)}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-1">{camion.patente}</h3>
        <p className="text-gray-600 mb-3">{camion.marca} {camion.modelo}</p>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Año:</span>
            <span className="font-medium">{camion.año}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Capacidad:</span>
            <span className="font-medium">{camion.capacidad_carga}kg</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Combustible:</span>
            <span className="font-medium">{camion.tipo_combustible}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Conductor:</span>
            <span className="font-medium">{camion.conductor || 'Sin asignar'}</span>
          </div>
        </div>

        {camion.observaciones && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
            <strong>Observaciones:</strong> {camion.observaciones}
          </div>
        )}
      </div>

      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Última actualización: {new Date(camion.fecha_actualizacion || camion.fecha_creacion).toLocaleDateString()}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(camion)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="Editar camión"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={() => onDelete(camion.id)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Eliminar camión"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CamionCard