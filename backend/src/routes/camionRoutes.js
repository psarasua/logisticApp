import { Hono } from 'hono'
import { CamionController } from '../controllers/camionController.js'
import { validate, schemas } from '../middleware/validation.js'

const camiones = new Hono()

camiones.get('/', CamionController.getAll)
camiones.get('/:id', CamionController.getById)
camiones.post('/', validate(schemas.camion), CamionController.create)
camiones.put('/:id', validate(schemas.camion), CamionController.update)
camiones.delete('/:id', CamionController.delete)

export default camiones
