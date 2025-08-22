import { Hono } from 'hono';
import { AuthController } from './authController.js';
import { loginRateLimiter } from '../middleware/rateLimiter.js';
import { validate, schemas } from '../middleware/validation.js';

const authRoutes = new Hono();

// Login con rate limiting
authRoutes.post('/login', loginRateLimiter, validate(schemas.login), AuthController.login);

// Registro
authRoutes.post('/register', validate(schemas.register), AuthController.register);

// Refresh token
authRoutes.post('/refresh', AuthController.refreshToken);

// Logout
authRoutes.post('/logout', AuthController.logout);

export default authRoutes;
