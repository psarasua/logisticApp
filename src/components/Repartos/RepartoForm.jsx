import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRepartosStore } from '../../stores/repartosStore'
import { useClientesStore } from '../../stores/clientesStore'
import { useRutasStore } from '../../stores/rutasStore'

const RepartoForm = ({ reparto, onClose }) => {
  const { createReparto, updateReparto, loading } = useRepartosStore()
  const { clientes, fetchClientes } = useClientesStore()
  const { rutas, fetchRutas } = useRutasStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm({
    defaultValues: reparto || {
      cliente_id: '',
      ruta_id: '',
      fecha_entrega_programada: '',
      hora_entrega_programada: '',
      productos: '',
      peso_total: '',
      observaciones: '',
      estado: 'pendiente'
    }
  })

  useEffect(() => {
    fetchClientes()
    fetchRutas()
    if (reparto) {
      // Format date for input
      const fechaFormatted = reparto.fecha_entrega_programada ? 
        new Date(reparto.fecha_entrega_programada).toISOString().split('T')[0] : ''
      const horaFormatted = reparto.hora_entrega_programada || ''

      reset({
        ...reparto,
        fecha_entrega_programada: fechaFormatted,
        hora_entrega_programada: horaFormatted
      })
    }
  }, [reparto, reset, fetchClientes, fetchRutas])

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        cliente_id: parseInt(data.cliente_id),
        ruta_id: parseInt(data.ruta_id),
        peso_total: parseFloat(data.peso_total),
        fecha_entrega_programada: data.fecha_entrega_programada,
        hora_entrega_programada: data.hora_entrega_programada
      }

      if (reparto?.id) {
        await updateReparto(reparto.id, formData)
      } else {
        await createReparto(formData)
      }
      onClose()
    } catch (error) {
      console.error('Error al guardar el reparto:', error)
    }
  }

  const rutasActivas = rutas.filter(r => r.estado === 'activa')

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {reparto ? 'Editar Reparto' : 'Nuevo Reparto'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
              <select
                {...register('cliente_id', { required: 'El cliente es obligatorio' })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.cliente_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} - {cliente.direccion}
                  </option>
                ))}
              </select>
              {errors.cliente_id && <p className="mt-1 text-sm text-red-600">{errors.cliente_id.message}</p>}
            </div>

            {/* Ruta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ruta *</label>
              <select
                {...register('ruta_id', { required: 'La ruta es obligatoria' })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.ruta_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar ruta</option>
                {rutasActivas.map(ruta => (
                  <option key={ruta.id} value={ruta.id}>
                    {ruta.nombre} ({ruta.ciudad_origen} → {ruta.ciudad_destino})
                  </option>
                ))}
              </select>
              {errors.ruta_id && <p className="mt-1 text-sm text-red-600">{errors.ruta_id.message}</p>}
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Entrega *</label>
              <input
                type="date"
                {...register('fecha_entrega_programada', { required: 'La fecha es obligatoria' })}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.fecha_entrega_programada ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.fecha_entrega_programada && <p className="mt-1 text-sm text-red-600">{errors.fecha_entrega_programada.message}</p>}
            </div>

            {/* Hora */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Entrega</label>
              <input
                type="time"
                {...register('hora_entrega_programada')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Peso Total */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peso Total (kg) *</label>
              <input
                type="number"
                step="0.1"
                min="0"
                {...register('peso_total', {
                  required: 'El peso es obligatorio',
                  min: { value: 0.1, message: 'El peso debe ser mayor a 0' }
                })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.peso_total ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="150.5"
              />
              {errors.peso_total && <p className="mt-1 text-sm text-red-600">{errors.peso_total.message}</p>}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
              <select
                {...register('estado', { required: 'El estado es obligatorio' })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.estado ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_transito">En Tránsito</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
                <option value="devuelto">Devuelto</option>
              </select>
              {errors.estado && <p className="mt-1 text-sm text-red-600">{errors.estado.message}</p>}
            </div>
          </div>

          {/* Productos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Productos *</label>
            <textarea
              rows={3}
              {...register('productos', {
                required: 'Los productos son obligatorios',
                maxLength: { value: 500, message: 'Máximo 500 caracteres' }
              })}
              className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.productos ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Descripción de los productos a entregar..."
            />
            {errors.productos && <p className="mt-1 text-sm text-red-600">{errors.productos.message}</p>}
            <div className="text-right text-xs text-gray-500 mt-1">
              {watch('productos')?.length || 0}/500
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
            <textarea
              rows={3}
              {...register('observaciones', { maxLength: { value: 500, message: 'Máximo 500 caracteres' } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Información adicional sobre el reparto..."
            />
            {errors.observaciones && <p className="mt-1 text-sm text-red-600">{errors.observaciones.message}</p>}
            <div className="text-right text-xs text-gray-500 mt-1">
              {watch('observaciones')?.length || 0}/500
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting || loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {(isSubmitting || loading) && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {reparto ? 'Actualizar' : 'Crear'} Reparto
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RepartoForm