import jwt from 'jsonwebtoken';
import { securityConfig } from '../config/security.js';
import { AuthService } from '../auth/authService.js';

// Middleware de autenticación para Hono
export const authenticateToken = async (c, next) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        error: 'unauthorized',
        message: 'Token de acceso requerido'
      }, 401);
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    try {
      const decoded = jwt.verify(token, securityConfig.jwt.secret);
      
      // Verificar que el usuario existe y está activo
      const user = await AuthService.getUserById(decoded.id);

      if (!user || !user.is_active) {
        return c.json({
          error: 'unauthorized',
          message: 'Usuario no válido o inactivo'
        }, 401);
      }

      // Agregar usuario al contexto de Hono
      c.set('user', user);
      await next();

    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return c.json({
          error: 'token_expired',
          message: 'Token expirado'
        }, 401);
      }

      return c.json({
        error: 'invalid_token',
        message: 'Token inválido'
      }, 401);
    }

  } catch (error) {
    console.error('Error en autenticación:', error);
    return c.json({
      error: 'server_error',
      message: 'Error interno del servidor'
    }, 500);
  }
};

// Middleware de roles para Hono
export const requireRole = (roles) => {
  return async (c, next) => {
    try {
      const user = c.get('user');
      
      if (!user) {
        return c.json({
          error: 'unauthorized',
          message: 'Autenticación requerida'
        }, 401);
      }

      if (!roles.includes(user.role)) {
        return c.json({
          error: 'forbidden',
          message: 'No tienes permisos para realizar esta acción'
        }, 403);
      }

      await next();
    } catch (error) {
      console.error('Error en verificación de rol:', error);
      return c.json({
        error: 'server_error',
        message: 'Error interno del servidor'
      }, 500);
    }
  };
};
