import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Cargar variables de entorno ANTES de importar otros módulos
dotenv.config({ path: path.join(__dirname, '.env') })

// DEBUG: Verificar variables cargadas
console.log('🔍 Variables de entorno cargadas:')
console.log('Directorio actual:', __dirname)
console.log('Ruta del .env:', path.join(__dirname, '.env'))
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurada' : '❌ NO CONFIGURADA')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('PORT:', process.env.PORT)

// Solo después de cargar las variables, importar los otros módulos
import { logger } from './src/utils/logger.js'
import { AppError } from './src/utils/errors.js'
import { db } from './src/config/database.js'

// INICIALIZAR la base de datos DESPUÉS de cargar las variables
try {
  db.init()
  console.log('✅ Base de datos inicializada correctamente')
} catch (error) {
  console.error('❌ Error inicializando base de datos:', error.message)
  process.exit(1)
}

const app = new Hono()

// Middleware de logging
app.use('*', async (c, next) => {
  const start = Date.now()
  const method = c.req.method
  const url = c.req.url
  
  logger.info(`${method} ${url} - Iniciando`)
  
  await next()
  
  const duration = Date.now() - start
  logger.info(`${method} ${url} - Completado en ${duration}ms`)
})

// Importar rutas
import healthRoutes from './src/routes/healthRoutes.js'
import clienteRoutes from './src/routes/clienteRoutes.js'
import camionRoutes from './src/routes/camionRoutes.js'

// Registrar rutas
app.route('/api/health', healthRoutes)
app.route('/api/clientes', clienteRoutes)
app.route('/api/camiones', camionRoutes)

// Endpoint raíz de la API
app.get('/api', (c) => {
  return c.json({ 
    name: 'MapaClientes.uy API',
    version: '2.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      clientes: '/api/clientes',
      camiones: '/api/camiones',
      rutas: '/api/rutas',
      repartos: '/api/repartos'
    },
    documentation: 'https://mapaclientes.uy/docs'
  })
})

// Middleware de manejo de errores
app.onError((err, c) => {
  logger.error('Error no manejado:', err)
  
  if (err instanceof AppError) {
    return c.json({
      error: err.status,
      message: err.message,
      ...(err.details && { details: err.details })
    }, err.statusCode)
  }
  
  // Error interno del servidor
  return c.json({ 
    error: 'error',
    message: 'Error interno del servidor'
  }, 500)
})

// Middleware 404
app.notFound((c) => {
  return c.json({ 
    error: 'not_found',
    message: 'Endpoint no encontrado' 
  }, 404)
})

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3001
  logger.info(` Servidor corriendo en puerto ${port}`)
  logger.info(`📡 API disponible en http://localhost:${port}/api`)
  logger.info(`❤️ Health check: http://localhost:${port}/api/health`)
  
  serve({
    fetch: app.fetch,
    port
  })
}

// Para Vercel
export default app