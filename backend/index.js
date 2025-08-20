import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import pg from 'pg'

const { Pool } = pg

// Configuración de la base de datos Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://usuario:password@servidor/db',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

const app = new Hono()

// Middleware CORS mejorado
app.use('/*', cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173',
    'https://mapaclientes.uy',
    'https://www.mapaclientes.uy',
    'https://logistic-app-alpha.vercel.app'
  ],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// ==================== HEALTH CHECK ENDPOINTS ====================

// Ping endpoint básico
app.get('/api/ping', (c) => {
  return c.json({ 
    message: 'pong', 
    timestamp: new Date().toISOString() 
  })
})

// Health check completo con verificación de BD
app.get('/api/health', async (c) => {
  const startTime = Date.now()
  
  try {
    // Verificar conexión a base de datos
    let dbStatus = 'connected'
    let dbError = null
    let dbResponseTime = null
    let serverTime = null
    
    try {
      const dbStart = Date.now()
      const result = await pool.query('SELECT NOW() as server_time, version() as postgres_version')
      dbResponseTime = Date.now() - dbStart
      serverTime = result.rows[0]?.server_time
      
      // Verificar que tenemos tablas principales
      const tablesResult = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('clientes', 'camiones', 'rutas', 'repartos')
      `)
      
      const tables = tablesResult.rows.map(row => row.table_name)
      const expectedTables = ['clientes', 'camiones', 'rutas', 'repartos']
      const missingTables = expectedTables.filter(table => !tables.includes(table))
      
      if (missingTables.length > 0) {
        dbStatus = 'warning'
        dbError = `Tablas faltantes: ${missingTables.join(', ')}`
      }
      
    } catch (error) {
      dbStatus = 'disconnected'
      dbError = error.message
    }

    const totalResponseTime = Date.now() - startTime

    return c.json({
      status: dbStatus === 'disconnected' ? 'error' : 'ok',
      timestamp: new Date().toISOString(),
      responseTime: `${totalResponseTime}ms`,
      services: {
        api: 'connected',
        database: dbStatus,
        ...(dbError && { database_error: dbError })
      },
      database: {
        status: dbStatus,
        responseTime: dbResponseTime ? `${dbResponseTime}ms` : null,
        serverTime: serverTime,
        ...(dbError && { error: dbError })
      },
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
    const totalResponseTime = Date.now() - startTime
    
    return c.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      responseTime: `${totalResponseTime}ms`,
      services: {
        api: 'connected',
        database: 'disconnected',
        error: error.message
      },
      server: {
        uptime: `${Math.floor(process.uptime())}s`,
        env: process.env.NODE_ENV || 'development'
      }
    }, 500)
  }
})

// Status endpoint con estadísticas del sistema
app.get('/api/status', async (c) => {
  try {
    // Obtener estadísticas básicas de la BD
    const stats = await Promise.allSettled([
      pool.query('SELECT COUNT(*) as total FROM clientes'),
      pool.query('SELECT COUNT(*) as total FROM camiones'),
      pool.query('SELECT COUNT(*) as total FROM rutas'),
      pool.query('SELECT COUNT(*) as total FROM repartos')
    ])

    const clientesCount = stats[0].status === 'fulfilled' ? stats[0].value.rows[0]?.total || 0 : 0
    const camionesCount = stats[1].status === 'fulfilled' ? stats[1].value.rows[0]?.total || 0 : 0
    const rutasCount = stats[2].status === 'fulfilled' ? stats[2].value.rows[0]?.total || 0 : 0
    const repartosCount = stats[3].status === 'fulfilled' ? stats[3].value.rows[0]?.total || 0 : 0

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
    return c.json({
      status: 'degraded',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
      error: 'No se pudieron obtener estadísticas de la base de datos'
    }, 200) // 200 porque el servicio sigue funcionando
  }
})

// ==================== CLIENTES ====================
app.get('/api/clientes', async (c) => {
  try {
    const result = await pool.query('SELECT * FROM clientes ORDER BY nombre')
    return c.json(result.rows)
  } catch (error) {
    console.error('Error obteniendo clientes:', error)
    return c.json({ message: 'Error interno del servidor' }, 500)
  }
})

app.post('/api/clientes', async (c) => {
  try {
    const data = await c.req.json()
    const { nombre, email, telefono, direccion, ciudad, codigoPostal, estado } = data

    const result = await pool.query(
      'INSERT INTO clientes (nombre, email, telefono, direccion, ciudad, codigo_postal, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [nombre, email, telefono, direccion, ciudad, codigoPostal, estado || 'activo']
    )

    return c.json(result.rows[0], 201)
  } catch (error) {
    console.error('Error creando cliente:', error)
    return c.json({ message: 'Error creando cliente' }, 500)
  }
})

app.put('/api/clientes/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const data = await c.req.json()
    const { nombre, email, telefono, direccion, ciudad, codigoPostal, estado } = data

    const result = await pool.query(
      'UPDATE clientes SET nombre = $1, email = $2, telefono = $3, direccion = $4, ciudad = $5, codigo_postal = $6, estado = $7, fecha_actualizacion = NOW() WHERE id = $8 RETURNING *',
      [nombre, email, telefono, direccion, ciudad, codigoPostal, estado, id]
    )

    if (result.rows.length === 0) {
      return c.json({ message: 'Cliente no encontrado' }, 404)
    }

    return c.json(result.rows[0])
  } catch (error) {
    console.error('Error actualizando cliente:', error)
    return c.json({ message: 'Error actualizando cliente' }, 500)
  }
})

app.delete('/api/clientes/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const result = await pool.query('DELETE FROM clientes WHERE id = $1 RETURNING id', [id])

    if (result.rows.length === 0) {
      return c.json({ message: 'Cliente no encontrado' }, 404)
    }

    return c.json({ message: 'Cliente eliminado correctamente' })
  } catch (error) {
    console.error('Error eliminando cliente:', error)
    return c.json({ message: 'Error eliminando cliente' }, 500)
  }
})

// ==================== CAMIONES ====================
app.get('/api/camiones', async (c) => {
  try {
    const result = await pool.query('SELECT * FROM camiones ORDER BY id')
    return c.json(result.rows)
  } catch (error) {
    console.error('Error obteniendo camiones:', error)
    return c.json({ message: 'Error interno del servidor' }, 500)
  }
})

app.post('/api/camiones', async (c) => {
  try {
    const data = await c.req.json()
    const { id, marca, modelo, año, conductor, estado, capacidad } = data

    const result = await pool.query(
      'INSERT INTO camiones (id, marca, modelo, año, conductor, estado, capacidad) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id, marca, modelo, año, conductor, estado || 'activo', capacidad]
    )

    return c.json(result.rows[0], 201)
  } catch (error) {
    console.error('Error creando camión:', error)
    return c.json({ message: 'Error creando camión' }, 500)
  }
})

app.patch('/api/camiones/:id/status', async (c) => {
  try {
    const id = c.req.param('id')
    const { estado } = await c.req.json()

    const result = await pool.query(
      'UPDATE camiones SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    )

    if (result.rows.length === 0) {
      return c.json({ message: 'Camión no encontrado' }, 404)
    }

    return c.json(result.rows[0])
  } catch (error) {
    console.error('Error actualizando estado del camión:', error)
    return c.json({ message: 'Error actualizando estado' }, 500)
  }
})

// ==================== RUTAS ====================
app.get('/api/rutas', async (c) => {
  try {
    const result = await pool.query('SELECT * FROM rutas ORDER BY nombre')
    return c.json(result.rows)
  } catch (error) {
    console.error('Error obteniendo rutas:', error)
    return c.json({ message: 'Error interno del servidor' }, 500)
  }
})

app.post('/api/rutas', async (c) => {
  try {
    const data = await c.req.json()
    const { nombre, descripcion, puntos, distancia, duracion, estado } = data

    const result = await pool.query(
      'INSERT INTO rutas (nombre, descripcion, puntos, distancia, duracion, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombre, descripcion, JSON.stringify(puntos), distancia, duracion, estado || 'activa']
    )

    return c.json(result.rows[0], 201)
  } catch (error) {
    console.error('Error creando ruta:', error)
    return c.json({ message: 'Error creando ruta' }, 500)
  }
})


// ==================== REPARTOS ====================
app.get('/api/repartos', async (c) => {
  try {
    console.log('🔍 Debug: Iniciando /api/repartos')
    
    // Test 1: Conexión a BD
    const testConnection = await pool.query('SELECT NOW() as tiempo')
    console.log('✅ Conexión BD OK:', testConnection.rows[0]?.tiempo)
    
    // Test 2: Verificar si tabla existe
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'repartos'
      ) as exists
    `)
    console.log('✅ Tabla repartos existe:', tableExists.rows[0]?.exists)
    
    // Test 3: Query simple
    const count = await pool.query('SELECT COUNT(*) as total FROM repartos')
    console.log('✅ Total registros:', count.rows[0]?.total)
    
    // Test 4: Primeros 3 registros sin transformaciones
    const simple = await pool.query('SELECT * FROM repartos LIMIT 3')
    console.log('✅ Datos raw:', simple.rows)
    
    // Test 5: Solo campos básicos mapeados
    const mapped = await pool.query(`
      SELECT 
        id,
        cliente_id as cliente,
        camion_id as camion,
        fechaentrega as fecha,
        fechaentrega as "fechaCreacion",
        estado,
        'Dirección temporal' as direccion
      FROM repartos 
      LIMIT 5
    `)
    
    console.log('✅ Query exitosa, devolviendo', mapped.rows.length, 'registros')
    return c.json(mapped.rows)
    
  } catch (error) {
    console.error('❌ ERROR DETALLADO:')
    console.error('- Message:', error.message)
    console.error('- Code:', error.code)
    console.error('- Detail:', error.detail)
    console.error('- Stack:', error.stack)
    
    return c.json({ 
      message: 'Error interno del servidor',
      debug: {
        error: error.message,
        code: error.code,
        detail: error.detail,
        timestamp: new Date().toISOString()
      }
    }, 500)
  }
})


// Middleware de error 404
app.notFound((c) => {
  return c.json({ message: 'Endpoint no encontrado' }, 404)
})

// Middleware de manejo de errores
app.onError((err, c) => {
  console.error('Error no manejado:', err)
  return c.json({ message: 'Error interno del servidor' }, 500)
})

const port = process.env.PORT || 3001
console.log(`🚀 Servidor corriendo en puerto ${port}`)
console.log(`📡 API disponible en http://localhost:${port}/api`)
console.log(`❤️ Health check: http://localhost:${port}/api/health`)

serve({
  fetch: app.fetch,
  port
})
