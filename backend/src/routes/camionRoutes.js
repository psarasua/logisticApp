import { Hono } from 'hono'
import { CamionController } from '../controllers/camionController.js'
import { validate, schemas } from '../middleware/validation.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const camiones = new Hono()

// Aplicar autenticación a todas las rutas
camiones.use('*', authenticateToken)

// Rutas protegidas
camiones.get('/', CamionController.getAll)
camiones.get('/:id', CamionController.getById)
camiones.post('/', requireRole(['admin', 'manager']), validate(schemas.camion), CamionController.create)
camiones.put('/:id', requireRole(['admin', 'manager']), validate(schemas.camion), CamionController.update)
camiones.delete('/:id', requireRole(['admin']), CamionController.delete)

export default camiones