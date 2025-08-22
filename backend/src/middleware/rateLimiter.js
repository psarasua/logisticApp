// Implementación simple de rate limiting para Hono
// En producción, usar Redis para mejor rendimiento

const rateLimitStore = new Map();

export const loginRateLimiter = async (c, next) => {
  const clientIP = c.req.header('x-forwarded-for') || c.req.ip || 'unknown';
  const key = `login:${clientIP}`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutos
  const maxAttempts = 5;
  
  // Obtener intentos actuales
  const attempts = rateLimitStore.get(key) || [];
  
  // Filtrar intentos dentro de la ventana de tiempo
  const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
  
  if (recentAttempts.length >= maxAttempts) {
    return c.json({
      error: 'rate_limit_exceeded',
      message: 'Demasiados intentos de login. Intenta más tarde.'
    }, 429);
  }

  // Agregar intento actual
  recentAttempts.push(now);
  rateLimitStore.set(key, recentAttempts);
  
  // Limpiar intentos antiguos
  setTimeout(() => {
    const currentAttempts = rateLimitStore.get(key) || [];
    const filtered = currentAttempts.filter(timestamp => now - timestamp < windowMs);
    if (filtered.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, filtered);
    }
  }, windowMs);

  await next();
};

export const generalRateLimiter = async (c, next) => {
  const clientIP = c.req.header('x-forwarded-for') || c.req.ip || 'unknown';
  const key = `general:${clientIP}`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutos
  const maxRequests = 100;
  
  const requests = rateLimitStore.get(key) || [];
  const recentRequests = requests.filter(timestamp => now - timestamp < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return c.json({
      error: 'rate_limit_exceeded',
      message: 'Demasiadas solicitudes. Intenta más tarde.'
    }, 429);
  }

  recentRequests.push(now);
  rateLimitStore.set(key, recentRequests);
  
  await next();
};
