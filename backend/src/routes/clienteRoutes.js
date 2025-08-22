import { Hono } from 'hono'
import { ClienteController } from '../controllers/clienteController.js'
import { validate, schemas } from '../middleware/validation.js'

const clientes = new Hono()

clientes.get('/', ClienteController.getAll)
clientes.get('/:id', ClienteController.getById)
clientes.post('/', validate(schemas.cliente), ClienteController.create)
clientes.put('/:id', validate(schemas.cliente), ClienteController.update)
clientes.delete('/:id', ClienteController.delete)

export default clientes
