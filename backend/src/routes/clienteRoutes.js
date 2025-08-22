import { Hono } from 'hono'
import { ClienteController } from '../controllers/clienteController.js'
import { validate, schemas } from '../middleware/validation.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const clientes = new Hono()

// Aplicar autenticación a todas las rutas
clientes.use('*', authenticateToken)

// Rutas protegidas
clientes.get('/', ClienteController.getAll)
clientes.get('/:id', ClienteController.getById)
clientes.post('/', requireRole(['admin', 'manager']), validate(schemas.cliente), ClienteController.create)
clientes.put('/:id', requireRole(['admin', 'manager']), validate(schemas.cliente), ClienteController.update)
clientes.delete('/:id', requireRole(['admin']), ClienteController.delete)

export default clientes