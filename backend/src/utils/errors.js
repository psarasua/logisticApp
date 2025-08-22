export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400)
    this.details = details
  }
}

export class DatabaseError extends AppError {
  constructor(message, originalError = null) {
    super(message, 500)
    this.originalError = originalError
  }
}

export class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} no encontrado`, 404)
  }
}



