import axios from 'axios'
import { toast } from 'react-hot-toast'

// Configuración base de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación si existe
    const authData = localStorage.getItem('auth-storage')
    if (authData) {
      try {
        const parsed = JSON.parse(authData)
        if (parsed.state?.user?.token) {
          config.headers.Authorization = `Bearer ${parsed.state.user.token}`
        }
      } catch (error) {
        console.error('Error parsing auth data:', error)
      }
    }

    // Log de requests en desarrollo
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    // Log de responses exitosas en desarrollo
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    }

    return response
  },
  (error) => {
    // Manejo de errores global
    const message = error.response?.data?.message || error.message || 'Error de conexión'

    // Log de errores
    console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, message)

    // Manejo específico por código de estado
    switch (error.response?.status) {
      case 401:
        // Token expirado o no válido
        localStorage.removeItem('auth-storage')
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.')
        window.location.href = '/login'
        break

      case 403:
        toast.error('No tienes permisos para realizar esta acción')
        break

      case 404:
        toast.error('Recurso no encontrado')
        break

      case 422:
        // Errores de validación
        if (error.response.data?.errors) {
          const errors = Object.values(error.response.data.errors).flat()
          errors.forEach(err => toast.error(err))
        } else {
          toast.error(message)
        }
        break

      case 500:
        toast.error('Error interno del servidor. Intenta más tarde.')
        break

      default:
        if (!error.config?.hideErrorToast) {
          toast.error(message)
        }
    }

    return Promise.reject(error)
  }
)

// Funciones de utilidad para diferentes tipos de requests

// GET con manejo de caché
export const apiGet = async (url, options = {}) => {
  try {
    const response = await api.get(url, {
      ...options,
      // Agregar timestamp para evitar caché en desarrollo
      params: {
        ...options.params,
        ...(import.meta.env.DEV && { _t: Date.now() })
      }
    })
    return response
  } catch (error) {
    throw error
  }
}

// POST con manejo de FormData
export const apiPost = async (url, data, options = {}) => {
  try {
    let config = { ...options }

    // Si es FormData, cambiar headers
    if (data instanceof FormData) {
      config.headers = {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      }
    }

    const response = await api.post(url, data, config)
    return response
  } catch (error) {
    throw error
  }
}

// PUT con soporte para PATCH
export const apiPut = async (url, data, options = {}) => {
  try {
    const response = await api.put(url, data, options)
    return response
  } catch (error) {
    throw error
  }
}

// PATCH
export const apiPatch = async (url, data, options = {}) => {
  try {
    const response = await api.patch(url, data, options)
    return response
  } catch (error) {
    throw error
  }
}

// DELETE con confirmación opcional
export const apiDelete = async (url, options = {}) => {
  try {
    const response = await api.delete(url, options)
    return response
  } catch (error) {
    throw error
  }
}

// Función para subir archivos con progress
export const uploadFile = async (url, file, onProgress) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress(percentCompleted)
        }
      }
    })

    return response
  } catch (error) {
    throw error
  }
}

// Función para cancelar requests
export const cancelToken = axios.CancelToken
export const isCancel = axios.isCancel

// Health check para verificar conexión con el backend
export const healthCheck = async () => {
  try {
    const response = await api.get('/health', {
      hideErrorToast: true,
      timeout: 5000
    })
    return response.data
  } catch (error) {
    console.warn('Backend health check failed:', error.message)
    return { status: 'error', message: error.message }
  }
}

// Configurar la URL base dinámicamente
export const setBaseURL = (baseURL) => {
  api.defaults.baseURL = baseURL
}

// Exportar instancia principal
export default api

// Re-exportar métodos principales para conveniencia
export const { get, post, put, patch, delete: deleteMethod } = api
