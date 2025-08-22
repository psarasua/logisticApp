import { AuthService } from './authService.js';
import jwt from 'jsonwebtoken';
import { securityConfig } from '../config/security.js';
import { db } from '../config/database.js';

export class AuthController {
  static async login(c) {
    try {
      const { username, password } = await c.req.json();

      // Validar datos de entrada
      if (!username || !password) {
        return c.json({
          error: 'validation_error',
          message: 'Usuario y contraseña son requeridos'
        }, 400);
      }

      // Validar usuario
      const user = await AuthService.validateUser(username, password);
      if (!user) {
        return c.json({
          error: 'auth_error',
          message: 'Credenciales inválidas'
        }, 401);
      }

      // Generar tokens
      const accessToken = AuthService.generateToken(user);
      const refreshToken = AuthService.generateRefreshToken(user);

      return c.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        tokens: {
          access: accessToken,
          refresh: refreshToken
        }
      });

    } catch (error) {
      console.error('Error en login:', error);
      return c.json({
        error: 'server_error',
        message: 'Error interno del servidor'
      }, 500);
    }
  }

  static async register(c) {
    try {
      const userData = await c.req.json();
      
      // Validar datos
      if (!userData.username || !userData.email || !userData.password) {
        return c.json({
          error: 'validation_error',
          message: 'Todos los campos son requeridos'
        }, 400);
      }

      if (userData.password.length < 8) {
        return c.json({
          error: 'validation_error',
          message: 'La contraseña debe tener al menos 8 caracteres'
        }, 400);
      }

      // Crear usuario
      const user = await AuthService.createUser(userData);

      return c.json({
        success: true,
        message: 'Usuario creado exitosamente',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }, 201);

    } catch (error) {
      if (error.message.includes('ya existe')) {
        return c.json({
          error: 'user_exists',
          message: error.message
        }, 409);
      }

      console.error('Error en registro:', error);
      return c.json({
        error: 'server_error',
        message: 'Error interno del servidor'
      }, 500);
    }
  }

  static async refreshToken(c) {
    try {
      const { refreshToken } = await c.req.json();

      if (!refreshToken) {
        return c.json({
          error: 'validation_error',
          message: 'Refresh token es requerido'
        }, 400);
      }

      // Verificar refresh token
      const decoded = jwt.verify(refreshToken, securityConfig.jwt.secret);
      
      if (decoded.type !== 'refresh') {
        return c.json({
          error: 'invalid_token',
          message: 'Token inválido'
        }, 401);
      }

      // Obtener usuario
      const user = await AuthService.getUserById(decoded.id);

      if (!user || !user.is_active) {
        return c.json({
          error: 'user_not_found',
          message: 'Usuario no encontrado o inactivo'
        }, 404);
      }

      const newAccessToken = AuthService.generateToken(user);

      return c.json({
        success: true,
        accessToken: newAccessToken
      });

    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return c.json({
          error: 'invalid_token',
          message: 'Token inválido'
        }, 401);
      }

      if (error.name === 'TokenExpiredError') {
        return c.json({
          error: 'token_expired',
          message: 'Token expirado'
        }, 401);
      }

      console.error('Error en refresh token:', error);
      return c.json({
        error: 'server_error',
        message: 'Error interno del servidor'
      }, 500);
    }
  }

  static async logout(c) {
    // En una implementación real, invalidaríamos el refresh token
    // Por ahora, solo retornamos éxito
    return c.json({
      success: true,
      message: 'Logout exitoso'
    });
  }
}
