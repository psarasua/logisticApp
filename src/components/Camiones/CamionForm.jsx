import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCamionesStore } from '../../stores/camionesStore'

const CamionForm = ({ camion, onClose }) => {
  const { createCamion, updateCamion, loading } = useCamionesStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm({
    defaultValues: camion || {
      patente: '',
      marca: '',
      modelo: '',
      año: new Date().getFullYear(),
      capacidad_carga: '',
      tipo_combustible: 'diesel',
      estado: 'activo',
      conductor: '',
      observaciones: ''
    }
  })

  useEffect(() => {
    if (camion) {
      reset(camion)
    }
  }, [camion, reset])

  const onSubmit = async (data) => {
    try {
      if (camion?.id) {
        await updateCamion(camion.id, data)
      } else {
        await createCamion(data)
      }
      onClose()
    } catch (error) {
      console.error('Error al guardar el camión:', error)
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {camion ? 'Editar Camión' : 'Nuevo Camión'}
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
            {/* Patente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patente *
              </label>
              <input
                type="text"
                {...register('patente', {
                  required: 'La patente es obligatoria',
                  pattern: {
                    value: /^[A-Z0-9-]{6,8}$/,
                    message: 'Formato de patente inválido (ej: ABC123, AB123CD)'
                  },
                  transform: {
                    input: (value) => value?.toUpperCase(),
                    output: (e) => e.target.value.toUpperCase()
                  }
                })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 uppercase ${
                  errors.patente ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="ABC123"
              />
              {errors.patente && (
                <p className="mt-1 text-sm text-red-600">{errors.patente.message}</p>
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
                <option value="activo">Activo</option>
                <option value="mantenimiento">En Mantenimiento</option>
                <option value="inactivo">Inactivo</option>
              </select>
              {errors.estado && (
                <p className="mt-1 text-sm text-red-600">{errors.estado.message}</p>
              )}
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca *
              </label>
              <input
                type="text"
                {...register('marca', {
                  required: 'La marca es obligatoria',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.marca ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ford, Mercedes, Volvo..."
              />
              {errors.marca && (
                <p className="mt-1 text-sm text-red-600">{errors.marca.message}</p>
              )}
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo *
              </label>
              <input
                type="text"
                {...register('modelo', {
                  required: 'El modelo es obligatorio',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.modelo ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="F-100, Actros, FH..."
              />
              {errors.modelo && (
                <p className="mt-1 text-sm text-red-600">{errors.modelo.message}</p>
              )}
            </div>

            {/* Año */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Año *
              </label>
              <input
                type="number"
                {...register('año', {
                  required: 'El año es obligatorio',
                  min: { value: 1990, message: 'Año mínimo: 1990' },
                  max: { value: currentYear + 1, message: `Año máximo: ${currentYear + 1}` },
                  valueAsNumber: true
                })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.año ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={currentYear.toString()}
              />
              {errors.año && (
                <p className="mt-1 text-sm text-red-600">{errors.año.message}</p>
              )}
            </div>

            {/* Capacidad de Carga */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacidad de Carga (kg) *
              </label>
              <input
                type="number"
                {...register('capacidad_carga', {
                  required: 'La capacidad de carga es obligatoria',
                  min: { value: 100, message: 'Capacidad mínima: 100kg' },
                  max: { value: 50000, message: 'Capacidad máxima: 50,000kg' },
                  valueAsNumber: true
                })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.capacidad_carga ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="5000"
              />
              {errors.capacidad_carga && (
                <p className="mt-1 text-sm text-red-600">{errors.capacidad_carga.message}</p>
              )}
            </div>

            {/* Tipo de Combustible */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Combustible *
              </label>
              <select
                {...register('tipo_combustible', { required: 'El tipo de combustible es obligatorio' })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.tipo_combustible ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="diesel">Diesel</option>
                <option value="nafta">Nafta</option>
                <option value="gnc">GNC</option>
                <option value="electrico">Eléctrico</option>
                <option value="hibrido">Híbrido</option>
              </select>
              {errors.tipo_combustible && (
                <p className="mt-1 text-sm text-red-600">{errors.tipo_combustible.message}</p>
              )}
            </div>

            {/* Conductor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conductor Asignado
              </label>
              <input
                type="text"
                {...register('conductor', {
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.conductor ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nombre del conductor (opcional)"
              />
              {errors.conductor && (
                <p className="mt-1 text-sm text-red-600">{errors.conductor.message}</p>
              )}
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </label>
            <textarea
              rows={3}
              {...register('observaciones', {
                maxLength: { value: 500, message: 'Máximo 500 caracteres' }
              })}
              className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.observaciones ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Información adicional sobre el camión..."
            />
            {errors.observaciones && (
              <p className="mt-1 text-sm text-red-600">{errors.observaciones.message}</p>
            )}
            <div className="text-right text-xs text-gray-500 mt-1">
              {watch('observaciones')?.length || 0}/500
            </div>
          </div>

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
              {camion ? 'Actualizar' : 'Crear'} Camión
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CamionForm