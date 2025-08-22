import { db } from './database.js';
import bcrypt from 'bcryptjs';

export async function runMigrations() {
  try {
    console.log('🔄 Ejecutando migraciones...');
    
    // Crear tabla usuarios con la estructura correcta
    await db.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);
    console.log('✅ Tabla usuarios creada/verificada');

    // Crear índices
    await db.query('CREATE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios(username);');
    console.log('✅ Índices creados/verificados');
    
    // Verificar si ya existe usuario admin
    const adminCheck = await db.query('SELECT id FROM usuarios WHERE username = $1', ['admin']);
    
    if (adminCheck.rows.length === 0) {
      // Crear usuario admin por defecto
      const adminPassword = 'Admin123!'; // CAMBIAR EN PRODUCCIÓN
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      
      await db.query(`
        INSERT INTO usuarios (username, password) 
        VALUES ($1, $2)
      `, ['admin', passwordHash]);
      
      console.log('✅ Usuario admin creado con contraseña: Admin123!');
    } else {
      console.log('✅ Usuario admin ya existe');
    }
    
    console.log('✅ Todas las migraciones ejecutadas correctamente');
  } catch (error) {
    console.error('❌ Error en migraciones:', error);
    throw error;
  }
}
