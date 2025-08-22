import Joi from 'joi'
import { ValidationError } from '../utils/errors.js'

export const validate = (schema) => {
  return async (c, next) => {
    try {
      let data
      
      if (c.req.method === 'GET') {
        data = c.req.query()
      } else {
        data = await c.req.json()
      }
      
      const { error, value } = schema.validate(data, { 
        abortEarly: false,
        stripUnknown: true 
      })
      
      if (error) {
        const details = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
        
        throw new ValidationError('Datos de entrada inválidos', details)
      }
      
      // Agregar datos validados al contexto
      c.req.validatedData = value
      await next()
      
    } catch (error) {
      if (error instanceof ValidationError) {
        return c.json({
          error: 'Error de validación',
          message: error.message,
          details: error.details
        }, error.statusCode)
      }
      throw error
    }
  }
}

// Esquemas de validación
export const schemas = {
  cliente: Joi.object({
    nombre: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    telefono: Joi.string().min(8).max(20).required(),
    direccion: Joi.string().min(5).max(200).required(),
    ciudad: Joi.string().min(2).max(100).required(),
    codigoPostal: Joi.string().min(4).max(10).required(),
    estado: Joi.string().valid('activo', 'inactivo').default('activo')
  }),

  camion: Joi.object({
    patente: Joi.string().min(5).max(10).required(),
    modelo: Joi.string().min(2).max(50).required(),
    capacidad: Joi.number().positive().required(),
    estado: Joi.string().valid('disponible', 'en_uso', 'mantenimiento').default('disponible')
  }),

  ruta: Joi.object({
    nombre: Joi.string().min(3).max(100).required(),
    origen: Joi.string().min(3).max(200).required(),
    destino: Joi.string().min(3).max(200).required(),
    distancia: Joi.number().positive().required(),
    tiempoEstimado: Joi.number().positive().required(),
    estado: Joi.string().valid('activa', 'inactiva').default('activa')
  }),

  reparto: Joi.object({
    clienteId: Joi.number().integer().positive().required(),
    camionId: Joi.number().integer().positive().required(),
    fechaEntrega: Joi.date().iso().required(),
    estado: Joi.string().valid('pendiente', 'en_camino', 'entregado', 'cancelado').default('pendiente')
  }),

  // Nuevos esquemas de autenticación
  login: Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(8).required()
  }),

  register: Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required()
      .messages({
        'string.pattern.base': 'La contraseña debe contener al menos una minúscula, una mayúscula y un número'
      }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({
        'any.only': 'Las contraseñas no coinciden'
      })
  })
}