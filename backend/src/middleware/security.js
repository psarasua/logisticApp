export const securityHeaders = async (c, next) => {
  // Headers de seguridad para Hono
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // CORS para Hono - más específico
  const allowedOrigin = process.env.ALLOWED_ORIGINS || 'https://www.mapaclientes.uy';
  c.header('Access-Control-Allow-Origin', allowedOrigin);
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  c.header('Access-Control-Allow-Credentials', 'true');
  
  // Manejar preflight CORS
  if (c.req.method === 'OPTIONS') {
    return c.json({}, 200);
  }
  
  await next();
};