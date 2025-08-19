import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useClientesStore } from '../../stores/clientesStore'

const ClienteForm = ({ cliente, onClose, onSuccess }) => {
  const { addCliente, updateCliente, loading } = useClientesStore()
  const [formLoading, setFormLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: cliente || {
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      codigoPostal: '',
      estado: 'activo'
    }
  })

  const onSubmit = async (data) => {
    setFormLoading(true)
    try {
      if (cliente) {
        await updateCliente(cliente.id, data)
      } else {
        await addCliente(data)
      }
      onSuccess()
    } catch (error) {
      console.error('Error al guardar cliente:', error)
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <p className="text-muted mb-0">
            {cliente ? 'Actualiza la información del cliente' : 'Agrega un nuevo cliente al sistema'}
          </p>
        </div>
        <button 
          type="button" 
          className="btn btn-outline-secondary"
          onClick={onClose}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Volver
        </button>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Información del Cliente</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre completo *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                      {...register('nombre', { 
                        required: 'El nombre es requerido',
                        minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                      })}
                    />
                    {errors.nombre && (
                      <div className="invalid-feedback">{errors.nombre.message}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      {...register('email', { 
                        required: 'El email es requerido',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email inválido'
                        }
                      })}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email.message}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Teléfono *</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                      {...register('telefono', { 
                        required: 'El teléfono es requerido',
                        minLength: { value: 8, message: 'Mínimo 8 dígitos' }
                      })}
                    />
                    {errors.telefono && (
                      <div className="invalid-feedback">{errors.telefono.message}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Estado</label>
                    <select className="form-select" {...register('estado')}>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Dirección *</label>
                    <textarea
                      className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
                      rows="2"
                      {...register('direccion', { 
                        required: 'La dirección es requerida' 
                      })}
                    />
                    {errors.direccion && (
                      <div className="invalid-feedback">{errors.direccion.message}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Ciudad</label>
                    <input
                      type="text"
                      className="form-control"
                      {...register('ciudad')}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Código Postal</label>
                    <input
                      type="text"
                      className="form-control"
                      {...register('codigoPostal')}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={onClose}
                    disabled={formLoading}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        {cliente ? 'Actualizar' : 'Guardar'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Información Adicional</h6>
            </div>
            <div className="card-body">
              <p className="text-muted small mb-3">
                Los campos marcados con * son obligatorios.
              </p>

              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                <small>
                  La información del cliente se utilizará para generar repartos y facturas.
                </small>
              </div>

              {cliente && (
                <div className="mt-3">
                  <h6>Historial</h6>
                  <ul className="list-unstyled small text-muted">
                    <li>• Creado: {cliente.fechaCreacion || 'No disponible'}</li>
                    <li>• Última actualización: {cliente.fechaActualizacion || 'No disponible'}</li>
                    <li>• Total repartos: {cliente.totalRepartos || 0}</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClienteForm
