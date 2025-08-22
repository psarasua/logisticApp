import { db } from '../config/database.js'
import { logger } from '../utils/logger.js'

export class HealthController {
  static async getHealth(c) {
    try {
      logger.debug('Iniciando health check...')
      
      const dbHealth = await db.healthCheck()
      logger.debug('Health check completado:', dbHealth)
      
      return c.json({
        status: dbHealth.status === 'connected' ? 'ok' : 'error',
        timestamp: new Date().toISOString(),
        database: dbHealth
      })
    } catch (error) {
      logger.error('Error en health check:', error)
      
      // Asegurar que siempre tengamos un mensaje de error
      const errorMessage = error.message || 'Error desconocido en la base de datos'
      
      return c.json({
        status: 'error',
        timestamp: new Date().toISOString(),
        database: {
          status: 'disconnected',
          error: errorMessage,
          code: error.code || 'UNKNOWN_ERROR'
        }
      }, 500)
    }
  }

  static async getDetailedHealth(c) {
    const startTime = Date.now()
    
    try {
      logger.debug('Iniciando detailed health check...')
      
      const dbHealth = await db.healthCheck()
      const totalResponseTime = Date.now() - startTime

      logger.debug('Detailed health check completado:', { dbHealth, responseTime: totalResponseTime })

      return c.json({
        status: dbHealth.status === 'connected' ? 'ok' : 'error',
        timestamp: new Date().toISOString(),
        responseTime: `${totalResponseTime}ms`,
        services: {
          api: 'connected',
          database: dbHealth.status
        },
        database: dbHealth,
        server: {
          uptime: `${Math.floor(process.uptime())}s`,
          memory: {
            used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
            total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
          },
          env: process.env.NODE_ENV || 'development',
          node_version: process.version
        }
      })
    } catch (error) {
      logger.error('Error en detailed health check:', error)
      const totalResponseTime = Date.now() - startTime
      
      const errorMessage = error.message || 'Error desconocido en la base de datos'
      
      return c.json({
        status: 'error',
        timestamp: new Date().toISOString(),
        responseTime: `${totalResponseTime}ms`,
        services: {
          api: 'connected',
          database: 'disconnected',
          error: errorMessage
        },
        server: {
          uptime: `${Math.floor(process.uptime())}s`,
          env: process.env.NODE_ENV || 'development'
        }
      }, 500)
    }
  }

  static async getStatus(c) {
    try {
      logger.debug('Obteniendo estadísticas del sistema...')
      
      const stats = await Promise.allSettled([
        db.query('SELECT COUNT(*) as total FROM clientes'),
        db.query('SELECT COUNT(*) as total FROM camiones'),
        db.query('SELECT COUNT(*) as total FROM rutas'),
        db.query('SELECT COUNT(*) as total FROM repartos')
      ])

      const clientesCount = stats[0].status === 'fulfilled' ? stats[0].value.rows[0]?.total || 0 : 0
      const camionesCount = stats[1].status === 'fulfilled' ? stats[1].value.rows[0]?.total || 0 : 0
      const rutasCount = stats[2].status === 'fulfilled' ? stats[2].value.rows[0]?.total || 0 : 0
      const repartosCount = stats[3].status === 'fulfilled' ? stats[3].value.rows[0]?.total || 0 : 0

      logger.debug('Estadísticas obtenidas:', { clientesCount, camionesCount, rutasCount, repartosCount })

      return c.json({
        status: 'healthy',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(process.uptime())}s`,
        domain: 'mapaclientes.uy',
        statistics: {
          clientes: parseInt(clientesCount),
          camiones: parseInt(camionesCount),
          rutas: parseInt(rutasCount),
          repartos: parseInt(repartosCount),
          total_records: parseInt(clientesCount) + parseInt(camionesCount) + parseInt(rutasCount) + parseInt(repartosCount)
        }
      })
    } catch (error) {
      logger.error('Error obteniendo estadísticas:', error)
      return c.json({
        status: 'degraded',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(process.uptime())}s`,
        error: 'No se pudieron obtener estadísticas de la base de datos'
      }, 200)
    }
  }
}
