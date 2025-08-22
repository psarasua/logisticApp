import { db } from '../config/database.js'
import { logger } from '../utils/logger.js'
import { NotFoundError, DatabaseError } from '../utils/errors.js'

export class ClienteController {
  static async getAll(c) {
    try {
      const result = await db.query('SELECT * FROM clientes ORDER BY nombre')
      return c.json(result.rows)
    } catch (error) {
      logger.error('Error obteniendo clientes:', error)
      throw new DatabaseError('Error obteniendo clientes', error)
    }
  }

  static async getById(c) {
    try {
      const id = c.req.param('id')
      const result = await db.query('SELECT * FROM clientes WHERE id = $1', [id])
      
      if (result.rows.length === 0) {
        throw new NotFoundError('Cliente')
      }
      
      return c.json(result.rows[0])
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      logger.error('Error obteniendo cliente por ID:', error)
      throw new DatabaseError('Error obteniendo cliente', error)
    }
  }

  static async create(c) {
    try {
      const data = c.req.validatedData
      const { nombre, email, telefono, direccion, ciudad, codigoPostal, estado } = data

      const result = await db.query(
        'INSERT INTO clientes (nombre, email, telefono, direccion, ciudad, codigo_postal, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [nombre, email, telefono, direccion, ciudad, codigoPostal, estado || 'activo']
      )

      logger.info('Cliente creado exitosamente:', { id: result.rows[0].id, nombre })
      return c.json(result.rows[0], 201)
    } catch (error) {
      logger.error('Error creando cliente:', error)
      throw new DatabaseError('Error creando cliente', error)
    }
  }

  static async update(c) {
    try {
      const id = c.req.param('id')
      const data = c.req.validatedData
      const { nombre, email, telefono, direccion, ciudad, codigoPostal, estado } = data

      const result = await db.query(
        'UPDATE clientes SET nombre = $1, email = $2, telefono = $3, direccion = $4, ciudad = $5, codigo_postal = $6, estado = $7, fecha_actualizacion = NOW() WHERE id = $8 RETURNING *',
        [nombre, email, telefono, direccion, ciudad, codigoPostal, estado, id]
      )

      if (result.rows.length === 0) {
        throw new NotFoundError('Cliente')
      }

      logger.info('Cliente actualizado exitosamente:', { id, nombre })
      return c.json(result.rows[0])
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      logger.error('Error actualizando cliente:', error)
      throw new DatabaseError('Error actualizando cliente', error)
    }
  }

  static async delete(c) {
    try {
      const id = c.req.param('id')
      const result = await db.query('DELETE FROM clientes WHERE id = $1 RETURNING *', [id])
      
      if (result.rows.length === 0) {
        throw new NotFoundError('Cliente')
      }

      logger.info('Cliente eliminado exitosamente:', { id })
      return c.json({ message: 'Cliente eliminado exitosamente' })
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      logger.error('Error eliminando cliente:', error)
      throw new DatabaseError('Error eliminando cliente', error)
    }
  }
}
