import { Hono } from 'hono'
import { HealthController } from '../controllers/healthController.js'

const health = new Hono()

health.get('/', HealthController.getHealth)
health.get('/detailed', HealthController.getDetailedHealth)
health.get('/status', HealthController.getStatus)

export default health
