import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';
import { securityConfig } from '../config/security.js';

export class AuthService {
  static async hashPassword(password) {
    return await bcrypt.hash(password, securityConfig.bcrypt.saltRounds);
  }

  static async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  static generateToken(user) {
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email
    };

    return jwt.sign(payload, securityConfig.jwt.secret, {
      expiresIn: securityConfig.jwt.expiresIn
    });
  }

  static generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id, type: 'refresh' },
      securityConfig.jwt.secret,
      { expiresIn: securityConfig.jwt.refreshExpiresIn }
    );
  }

  static async validateUser(username, password) {
    try {
      const result = await db.query(
        'SELECT * FROM usuarios WHERE username = $1 AND is_active = true',
        [username]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];
      const isValidPassword = await this.verifyPassword(password, user.password_hash);

      if (!isValidPassword) {
        return null;
      }

      // Actualizar último login
      await db.query(
        'UPDATE usuarios SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      };
    } catch (error) {
      throw new Error('Error validando usuario');
    }
  }

  static async createUser(userData) {
    try {
      const { username, email, password, role = 'user' } = userData;
      
      // Verificar si el usuario ya existe
      const existingUser = await db.query(
        'SELECT id FROM usuarios WHERE username = $1 OR email = $2',
        [username, email]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('Usuario o email ya existe');
      }

      // Hash de la contraseña
      const passwordHash = await this.hashPassword(password);

      // Crear usuario
      const result = await db.query(
        `INSERT INTO usuarios (username, email, password_hash, role) 
         VALUES ($1, $2, $3, $4) RETURNING id, username, email, role`,
        [username, email, passwordHash, role]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(id) {
    try {
      const result = await db.query(
        'SELECT id, username, email, role, is_active FROM usuarios WHERE id = $1',
        [id]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
}
