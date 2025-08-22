export const securityConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
    expiresIn: '24h',
    refreshExpiresIn: '7d'
  },
  bcrypt: {
    saltRounds: 12
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por ventana
    loginMax: 5 // máximo 5 intentos de login por ventana
  }
};
