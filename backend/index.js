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

// Middleware CORS
app.use('/*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}))

// Health check
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    message: 'Logística API funcionando correctamente',
    timestamp: new Date().toISOString()
  })
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
    const result = await pool.query('SELECT * FROM repartos ORDER BY fecha DESC, id')
    return c.json(result.rows)
  } catch (error) {
    console.error('Error obteniendo repartos:', error)
    return c.json({ message: 'Error interno del servidor' }, 500)
  }
})

app.post('/api/repartos', async (c) => {
  try {
    const data = await c.req.json()
    const { cliente, direccion, fecha, camion, ruta, estado, descripcion } = data

    const result = await pool.query(
      'INSERT INTO repartos (cliente, direccion, fecha, camion, ruta, estado, descripcion) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [cliente, direccion, fecha, camion, ruta, estado || 'pendiente', descripcion]
    )

    return c.json(result.rows[0], 201)
  } catch (error) {
    console.error('Error creando reparto:', error)
    return c.json({ message: 'Error creando reparto' }, 500)
  }
})

app.patch('/api/repartos/:id/status', async (c) => {
  try {
    const id = c.req.param('id')
    const { estado } = await c.req.json()

    const result = await pool.query(
      'UPDATE repartos SET estado = $1, fecha_actualizacion = NOW() WHERE id = $2 RETURNING *',
      [estado, id]
    )

    if (result.rows.length === 0) {
      return c.json({ message: 'Reparto no encontrado' }, 404)
    }

    return c.json(result.rows[0])
  } catch (error) {
    console.error('Error actualizando estado del reparto:', error)
    return c.json({ message: 'Error actualizando estado' }, 500)
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

serve({
  fetch: app.fetch,
  port
})
