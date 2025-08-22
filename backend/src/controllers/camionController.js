import { db } from '../config/database.js'
import { logger } from '../utils/logger.js'
import { NotFoundError, DatabaseError } from '../utils/errors.js'

export class CamionController {
  static async getAll(c) {
    try {
      const result = await db.query('SELECT * FROM camiones ORDER BY patente')
      return c.json(result.rows)
    } catch (error) {
      logger.error('Error obteniendo camiones:', error)
      throw new DatabaseError('Error obteniendo camiones', error)
    }
  }

  static async getById(c) {
    try {
      const id = c.req.param('id')
      const result = await db.query('SELECT * FROM camiones WHERE id = $1', [id])
      
      if (result.rows.length === 0) {
        throw new NotFoundError('Camión')
      }
      
      return c.json(result.rows[0])
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      logger.error('Error obteniendo camión por ID:', error)
      throw new DatabaseError('Error obteniendo camión', error)
    }
  }

  static async create(c) {
    try {
      const data = c.req.validatedData
      const { patente, modelo, capacidad, estado } = data

      const result = await db.query(
        'INSERT INTO camiones (patente, modelo, capacidad, estado) VALUES ($1, $2, $3, $4) RETURNING *',
        [patente, modelo, capacidad, estado || 'disponible']
      )

      logger.info('Camión creado exitosamente:', { id: result.rows[0].id, patente })
      return c.json(result.rows[0], 201)
    } catch (error) {
      logger.error('Error creando camión:', error)
      throw new DatabaseError('Error creando camión', error)
    }
  }

  static async update(c) {
    try {
      const id = c.req.param('id')
      const data = c.req.validatedData
      const { patente, modelo, capacidad, estado } = data

      const result = await db.query(
        'UPDATE camiones SET patente = $1, modelo = $2, capacidad = $3, estado = $4 WHERE id = $5 RETURNING *',
        [patente, modelo, capacidad, estado, id]
      )

      if (result.rows.length === 0) {
        throw new NotFoundError('Camión')
      }

      logger.info('Camión actualizado exitosamente:', { id, patente })
      return c.json(result.rows[0])
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      logger.error('Error actualizando camión:', error)
      throw new DatabaseError('Error actualizando camión', error)
    }
  }

  static async delete(c) {
    try {
      const id = c.req.param('id')
      const result = await db.query('DELETE FROM camiones WHERE id = $1 RETURNING *', [id])
      
      if (result.rows.length === 0) {
        throw new NotFoundError('Camión')
      }

      logger.info('Camión eliminado exitosamente:', { id })
      return c.json({ message: 'Camión eliminado exitosamente' })
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      logger.error('Error eliminando camión:', error)
      throw new DatabaseError('Error eliminando camión', error)
    }
  }
}
