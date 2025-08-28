import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { neon } from '@neondatabase/serverless'

const app = new Hono()

// Middleware CORS
app.use('*', async (c, next) => {
  if (c.req.method === 'OPTIONS') {
    c.header('Access-Control-Allow-Origin', 'https://www.mapaclientes.uy')
    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    c.header('Access-Control-Allow-Credentials', 'true')
    return c.json({}, 200)
  }
  await next()
})

// Middleware de headers de seguridad
app.use('*', async (c, next) => {
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('X-Frame-Options', 'DENY')
  c.header('X-XSS-Protection', '1; mode=block')
  c.header('Access-Control-Allow-Origin', 'https://www.mapaclientes.uy')
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  c.header('Access-Control-Allow-Credentials', 'true')
  await next()
})

// Middleware de logging
app.use('*', async (c, next) => {
  const start = Date.now()
  const method = c.req.method
  const url = c.req.url
  
  console.log(`${method} ${url} - Iniciando`)
  
  await next()
  
  const duration = Date.now() - start
  console.log(`${method} ${url} - Completado en ${duration}ms`)
})

// Health check
app.get('/api/health', async (c) => {
  console.log('🔍 Health check iniciado')
  
  try {
    console.log('📊 Verificando variables de entorno...')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('DATABASE_URL existe:', !!process.env.DATABASE_URL)
    
    if (!process.env.DATABASE_URL) {
      return c.json({
        status: 'ERROR',
        message: 'DATABASE_URL no configurada en Vercel',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      }, 500)
    }

    console.log('🔌 Inicializando conexión a Neon...')
    const sql = neon(process.env.DATABASE_URL)
    
    console.log('📡 Ejecutando query de prueba...')
    const startTime = Date.now()
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`
    const responseTime = Date.now() - startTime

    console.log('✅ Conexión exitosa:', result)
    
    return c.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        responseTime: `${responseTime}ms`,
        currentTime: result[0]?.current_time,
        version: result[0]?.pg_version?.split(' ').slice(0, 2).join(' ')
      },
      environment: process.env.NODE_ENV,
      region: process.env.VERCEL_REGION || 'unknown'
    })

  } catch (error) {
    console.error('❌ Health check falló:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    })
    
    return c.json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        type: error.constructor.name,
        details: 'Revisa los logs de Vercel para más información'
      }
    }, 500)
  }
})

// Clientes endpoint básico
app.get('/api/clientes', async (c) => {
  try {
    if (!process.env.DATABASE_URL) {
      return c.json({ error: 'Database not configured' }, 500)
    }

    const sql = neon(process.env.DATABASE_URL)
    const clientes = await sql`SELECT * FROM clientes LIMIT 10`
    
    return c.json({
      success: true,
      data: clientes,
      count: clientes.length
    })
  } catch (error) {
    console.error('Error obteniendo clientes:', error)
    return c.json({
      error: 'Error obteniendo clientes',
      message: error.message
    }, 500)
  }
})

// Camiones endpoint básico
app.get('/api/camiones', async (c) => {
  try {
    if (!process.env.DATABASE_URL) {
      return c.json({ error: 'Database not configured' }, 500)
    }

    const sql = neon(process.env.DATABASE_URL)
    const camiones = await sql`SELECT * FROM camiones LIMIT 10`
    
    return c.json({
      success: true,
      data: camiones,
      count: camiones.length
    })
  } catch (error) {
    console.error('Error obteniendo camiones:', error)
    return c.json({
      error: 'Error obteniendo camiones',
      message: error.message
    }, 500)
  }
})

// Auth endpoints básicos
app.post('/api/auth/login', async (c) => {
  return c.json({ 
    message: 'Auth endpoint - implement login logic',
    status: 'not_implemented' 
  })
})

app.post('/api/auth/register', async (c) => {
  return c.json({ 
    message: 'Auth endpoint - implement register logic',
    status: 'not_implemented' 
  })
})

// Endpoint raíz de la API
app.get('/api', (c) => {
  return c.json({ 
    name: 'MapaClientes.uy API',
    version: '2.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      health: '/api/health',
      clientes: '/api/clientes',
      camiones: '/api/camiones'
    },
    documentation: 'https://mapaclientes.uy/docs'
  })
})

// Root endpoint
app.get('/', (c) => {
  return c.json({
    message: 'MapaClientes.uy API',
    version: '2.0.0',
    endpoints: ['/api', '/api/health'],
    timestamp: new Date().toISOString()
  })
})

// Manejo de errores
app.onError((err, c) => {
  console.error('Error no manejado:', err)
  
  return c.json({ 
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  }, 500)
})

// 404
app.notFound((c) => {
  return c.json({ 
    error: 'Not Found',
    message: 'Endpoint no encontrado',
    path: c.req.url,
    available_endpoints: ['/api', '/api/health', '/api/clientes', '/api/camiones']
  }, 404)
})

// Al final de tu index.js, antes del export
if (process.env.NODE_ENV !== 'production') {
  const { serve } = require('@hono/node-server')
  const port = process.env.PORT || 3001
  
  console.log(`🚀 Servidor local iniciando en puerto ${port}...`)
  
  serve({
    fetch: app.fetch,
    port: port
  })
  
  console.log(`✅ Servidor local corriendo en http://localhost:${port}`)
}

export default handle(app)
