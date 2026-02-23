import axios from 'axios'
import { logger } from '../utils/logger'
import storage from '../utils/storage'

// Validar que VITE_API_URL esté configurado
const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  console.error('❌ VITE_API_URL no está configurado. Verifica tu archivo .env.local')
  throw new Error('Configuración de API faltante. Contacte al administrador.')
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 segundos (reducido de 30s para mejor UX)
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token si existe
api.interceptors.request.use(
  (config) => {
    const token = storage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo de errores de red
    if (!error.response) {
      // Sin respuesta del servidor (problema de red, CORS, timeout, etc.)
      if (error.code === 'ECONNABORTED') {
        console.error('⏱️ Timeout: El servidor tardó demasiado en responder')
        error.message = 'El servidor no responde. Intente nuevamente.'
      } else if (error.message === 'Network Error') {
        console.error('🚫 Error de red: No se puede conectar al servidor')
        error.message = 'No se puede conectar al servidor. Verifica tu conexión o el CORS.'
      } else {
        console.error('❌ Error desconocido:', error.message)
        error.message = 'Error de conexión. Verifica tu red.'
      }
      return Promise.reject(error)
    }
    
    // Manejo de respuestas con error
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/login')
      
      if (!isLoginRequest && storage.getItem('token')) {
        // Solo redirigir si NO es una petición de login y hay token (sesión expirada)
        logger.log('🔒 Sesión expirada, redirigiendo a login...')
        storage.removeItem('token')
        storage.removeItem('user')
        window.location.href = '/login'
      }
      // Si es una petición de login, dejar que el error se propague normalmente
    }
    
    // Manejo de otros códigos de error comunes
    if (error.response?.status === 403) {
      error.message = error.response?.data?.message || 'No tienes permisos para realizar esta acción'
    } else if (error.response?.status === 404) {
      error.message = error.response?.data?.message || 'Recurso no encontrado'
    } else if (error.response?.status === 500) {
      error.message = 'Error interno del servidor. Contacte al administrador.'
    }
    
    return Promise.reject(error)
  }
)

export default api
