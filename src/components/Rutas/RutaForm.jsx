import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRutasStore } from '../../stores/rutasStore'
import { useCamionesStore } from '../../stores/camionesStore'

const RutaForm = ({ ruta, onClose }) => {
  const { createRuta, updateRuta, loading } = useRutasStore()
  const { camiones, fetchCamiones } = useCamionesStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm({
    defaultValues: ruta || {
      nombre: '',
      descripcion: '',
      ciudad_origen: '',
      ciudad_destino: '',
      distancia_km: '',
      tiempo_estimado_horas: '',
      costo_peaje: '',
      costo_combustible: '',
      camion_id: '',
      estado: 'activa'
    }
  })

  useEffect(() => {
    fetchCamiones()
    if (ruta) {
      reset(ruta)
    }
  }, [ruta, reset, fetchCamiones])

  const onSubmit = async (data) => {
    try {
      // Convert numeric fields
      const formData = {
        ...data,
        distancia_km: parseFloat(data.distancia_km),
        tiempo_estimado_horas: parseFloat(data.tiempo_estimado_horas),
        costo_peaje: data.costo_peaje ? parseFloat(data.costo_peaje) : 0,
        costo_combustible: data.costo_combustible ? parseFloat(data.costo_combustible) : 0,
        camion_id: data.camion_id || null
      }

      if (ruta?.id) {
        await updateRuta(ruta.id, formData)
      } else {
        await createRuta(formData)
      }
      onClose()
    } catch (error) {
      console.error('Error al guardar la ruta:', error)
    }
  }

  const camionesActivos = camiones.filter(c => c.estado === 'activo')

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {ruta ? 'Editar Ruta' : 'Nueva Ruta'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Ruta *
              </label>
              <input
                type="text"
                {...register('nombre', {
                  required: 'El nombre de la ruta es obligatorio',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.nombre ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Ruta Capital Norte"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado *
              </label>
              <select
                {...register('estado', { required: 'El estado es obligatorio' })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.estado ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="activa">Activa</option>
                <option value="inactiva">Inactiva</option>
                <option value="mantenimiento">En Mantenimiento</option>
              </select>
              {errors.estado && (
                <p className="mt-1 text-sm text-red-600">{errors.estado.message}</p>
              )}
            </div>

            {/* Ciudad Origen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad de Origen *
              </label>
              <input
                type="text"
                {...register('ciudad_origen', {
                  required: 'La ciudad de origen es obligatoria',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.ciudad_origen ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Buenos Aires"
              />
              {errors.ciudad_origen && (
                <p className="mt-1 text-sm text-red-600">{errors.ciudad_origen.message}</p>
              )}
            </div>

            {/* Ciudad Destino */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad de Destino *
              </label>
              <input
                type="text"
                {...register('ciudad_destino', {
                  required: 'La ciudad de destino es obligatoria',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.ciudad_destino ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Córdoba"
              />
              {errors.ciudad_destino && (
                <p className="mt-1 text-sm text-red-600">{errors.ciudad_destino.message}</p>
              )}
            </div>

            {/* Distancia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distancia (km) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                {...register('distancia_km', {
                  required: 'La distancia es obligatoria',
                  min: { value: 0.1, message: 'La distancia debe ser mayor a 0' },
                  max: { value: 10000, message: 'Distancia máxima: 10,000km' }
                })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.distancia_km ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="350"
              />
              {errors.distancia_km && (
                <p className="mt-1 text-sm text-red-600">{errors.distancia_km.message}</p>
              )}
            </div>

            {/* Tiempo Estimado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo Estimado (horas) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                {...register('tiempo_estimado_horas', {
                  required: 'El tiempo estimado es obligatorio',
                  min: { value: 0.1, message: 'El tiempo debe ser mayor a 0' },
                  max: { value: 72, message: 'Tiempo máximo: 72 horas' }
                })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.tiempo_estimado_horas ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="6.5"
              />
              {errors.tiempo_estimado_horas && (
                <p className="mt-1 text-sm text-red-600">{errors.tiempo_estimado_horas.message}</p>
              )}
            </div>

            {/* Costo Peaje */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Costo de Peaje ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('costo_peaje', {
                  min: { value: 0, message: 'El costo no puede ser negativo' },
                  max: { value: 100000, message: 'Costo máximo: $100,000' }
                })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.costo_peaje ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="1500"
              />
              {errors.costo_peaje && (
                <p className="mt-1 text-sm text-red-600">{errors.costo_peaje.message}</p>
              )}
            </div>

            {/* Costo Combustible */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Costo de Combustible ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('costo_combustible', {
                  min: { value: 0, message: 'El costo no puede ser negativo' },
                  max: { value: 100000, message: 'Costo máximo: $100,000' }
                })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.costo_combustible ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="8500"
              />
              {errors.costo_combustible && (
                <p className="mt-1 text-sm text-red-600">{errors.costo_combustible.message}</p>
              )}
            </div>

            {/* Camión Asignado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Camión Asignado
              </label>
              <select
                {...register('camion_id')}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.camion_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Sin asignar</option>
                {camionesActivos.map(camion => (
                  <option key={camion.id} value={camion.id}>
                    {camion.patente} - {camion.marca} {camion.modelo} ({camion.capacidad_carga}kg)
                  </option>
                ))}
              </select>
              {errors.camion_id && (
                <p className="mt-1 text-sm text-red-600">{errors.camion_id.message}</p>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              rows={3}
              {...register('descripcion', {
                maxLength: { value: 500, message: 'Máximo 500 caracteres' }
              })}
              className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.descripcion ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Información adicional sobre la ruta, paradas intermedias, condiciones especiales..."
            />
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>
            )}
            <div className="text-right text-xs text-gray-500 mt-1">
              {watch('descripcion')?.length || 0}/500
            </div>
          </div>

          {/* Resumen de Costos */}
          {(watch('costo_peaje') || watch('costo_combustible')) && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Resumen de Costos</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Peaje:</span>
                  <span className="font-medium">${watch('costo_peaje') || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Combustible:</span>
                  <span className="font-medium">${watch('costo_combustible') || 0}</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="text-gray-900 font-medium">Total:</span>
                  <span className="font-bold text-blue-600">
                    ${(parseFloat(watch('costo_peaje') || 0) + parseFloat(watch('costo_combustible') || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting || loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {(isSubmitting || loading) && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {ruta ? 'Actualizar' : 'Crear'} Ruta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RutaForm