import pg from 'pg'
import { logger } from '../utils/logger.js'

const { Pool } = pg

class Database {
  constructor() {
    this.pool = null
    // NO inicializar aquí
  }

  init() {
    try {
      logger.debug('Inicializando pool de base de datos...')
      logger.debug('DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada' : 'NO CONFIGURADA')
      logger.debug('NODE_ENV:', process.env.NODE_ENV)
      
      if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL no está configurada')
      }

      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      })

      this.pool.on('error', (err) => {
        logger.error('Error inesperado en el pool de BD:', err)
      })

      this.pool.on('connect', () => {
        logger.debug('Nueva conexión establecida con la BD')
      })

      logger.info('Pool de base de datos inicializado correctamente')
    } catch (error) {
      logger.error('Error inicializando pool de BD:', error)
      throw error
    }
  }

  async query(text, params) {
    if (!this.pool) {
      throw new Error('Pool de base de datos no inicializado. Llama a init() primero.')
    }

    const start = Date.now()
    try {
      const result = await this.pool.query(text, params)
      const duration = Date.now() - start
      logger.debug('Query ejecutada', { text, duration, rows: result.rowCount })
      return result
    } catch (error) {
      const duration = Date.now() - start
      logger.error('Error en query', { text, params, duration, error: error.message })
      throw error
    }
  }

  async getClient() {
    if (!this.pool) {
      throw new Error('Pool de base de datos no inicializado')
    }
    return this.pool.connect()
  }

  async healthCheck() {
    try {
      if (!this.pool) {
        return {
          status: 'disconnected',
          error: 'Pool de base de datos no inicializado'
        }
      }

      logger.debug('Verificando conexión a la base de datos...')
      
      const result = await this.query('SELECT NOW() as server_time, version() as postgres_version')
      
      logger.debug('Health check exitoso:', result.rows[0])
      
      return {
        status: 'connected',
        serverTime: result.rows[0]?.server_time,
        version: result.rows[0]?.postgres_version
      }
    } catch (error) {
      logger.error('Health check falló:', error)
      
      return {
        status: 'disconnected',
        error: error.message || 'Error desconocido',
        code: error.code || 'UNKNOWN_ERROR',
        detail: error.detail || null
      }
    }
  }
}

// Crear instancia pero NO inicializar
export const db = new Database()
