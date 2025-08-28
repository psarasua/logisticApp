// backend/dev-server.js
import { serve } from '@hono/node-server'
import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

// Crear app Hono simple para desarrollo
import { Hono } from 'hono'

const devApp = new Hono()

// Health check para desarrollo
devApp.get('/api/health', async (c) => {
  try {
    if (!process.env.DATABASE_URL) {
      return c.json({
        status: 'ERROR',
        message: 'DATABASE_URL no configurada',
        timestamp: new Date().toISOString()
      }, 500)
    }

    const sql = neon(process.env.DATABASE_URL)
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`
    
    return c.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        currentTime: result[0]?.current_time,
        version: result[0]?.pg_version?.split(' ').slice(0, 2).join(' ')
      }
    })
  } catch (error) {
    return c.json({
      status: 'ERROR',
      error: error.message
    }, 500)
  }
})

// Endpoint raíz
devApp.get('/', (c) => {
  return c.json({
    message: 'Servidor de desarrollo funcionando',
    timestamp: new Date().toISOString()
  })
})

// Iniciar servidor de desarrollo
const port = process.env.PORT || 3001
console.log(`🚀 Servidor de desarrollo iniciando en puerto ${port}...`)

serve({
  fetch: devApp.fetch,
  port: port
})

console.log(`✅ Servidor de desarrollo corriendo en http://localhost:${port}`)
