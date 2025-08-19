import React from 'react'

const RutaCard = ({ ruta, onEdit, onDelete, viewMode, getStatusBadge, getCamionInfo }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{ruta.nombre}</h3>
              <p className="text-sm text-gray-600">
                {ruta.ciudad_origen} → {ruta.ciudad_destino}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-gray-600">Distancia</p>
              <p className="font-medium">{ruta.distancia_km}km</p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">Tiempo Est.</p>
              <p className="font-medium">{ruta.tiempo_estimado_horas}h</p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">Camión</p>
              <p className="font-medium text-xs">{getCamionInfo(ruta.camion_id)}</p>
            </div>

            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(ruta.estado)}`}>
              {ruta.estado?.charAt(0).toUpperCase() + ruta.estado?.slice(1)}
            </span>

            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(ruta)}
                className="text-blue-600 hover:text-blue-800 p-1"
                title="Editar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(ruta.id)}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(ruta.estado)}`}>
            {ruta.estado?.charAt(0).toUpperCase() + ruta.estado?.slice(1)}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-1">{ruta.nombre}</h3>
        <p className="text-gray-600 mb-3">
          {ruta.ciudad_origen} → {ruta.ciudad_destino}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Distancia:</span>
            <span className="font-medium">{ruta.distancia_km}km</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Tiempo est.:</span>
            <span className="font-medium">{ruta.tiempo_estimado_horas}h</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Peaje:</span>
            <span className="font-medium">${ruta.costo_peaje || 0}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Combustible:</span>
            <span className="font-medium">${ruta.costo_combustible || 0}</span>
          </div>
        </div>

        {ruta.camion_id && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
            <strong>Camión asignado:</strong><br />
            {getCamionInfo(ruta.camion_id)}
          </div>
        )}

        {ruta.descripcion && (
          <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-gray-600">
            <strong>Descripción:</strong> {ruta.descripcion}
          </div>
        )}
      </div>

      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Última actualización: {new Date(ruta.fecha_actualizacion || ruta.fecha_creacion).toLocaleDateString()}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(ruta)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="Editar ruta"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={() => onDelete(ruta.id)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Eliminar ruta"
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

export default RutaCard