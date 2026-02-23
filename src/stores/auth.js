import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'
import router from '../router'
import { useAlert } from '../composables/useAlert'
import { logger } from '../utils/logger'
import storage from '../utils/storage'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(storage.getItem('token') || null)
  const isAuthenticated = computed(() => !!token.value)
  const { success, info, error: showError } = useAlert()
  
  // Sistema de polling
  let pollingInterval = null
  const REFRESH_INTERVAL = 30000 // 30 segundos
  let failedAttempts = 0
  const MAX_FAILED_ATTEMPTS = 3

  async function login(credentials) {
    try {
      const response = await api.post('/login', credentials)
      
      token.value = response.data.token
      storage.setItem('token', response.data.token)
      
      // DETECTAR SI DEBE CAMBIAR CONTRASEÑA
      if (response.data.debe_cambiar_password === true) {
        // Guardar solo token temporal, no el usuario completo
        info('Cambio de contraseña requerido', 'Debe cambiar su contraseña temporal')
        router.push('/cambiar-password')
        return response.data
      }
      
      // Usar directamente los datos del backend que ya vienen completos
      user.value = response.data.user
      
      storage.setItemJSON('user', user.value)
      
      logger.log('👤 Usuario guardado:', user.value)
      logger.log('🔑 Permisos del rol:', user.value.role?.permissions)
      logger.log('🔑 Permisos individuales:', user.value.permissions)
      
      success('Sesión iniciada exitosamente', `Bienvenido ${user.value.nombre}`)
      
      // Iniciar polling de permisos
      startPermissionPolling()
      
      router.push('/')
      
      return response.data
    } catch (error) {
      storage.removeItem('token')
      storage.removeItem('user')
      throw error
    }
  }

  function logout() {
    const userName = user.value?.nombre || ''
    
    // Detener polling
    stopPermissionPolling()
    
    token.value = null
    user.value = null
    storage.removeItem('token')
    storage.removeItem('user')
    
    // Mostrar alerta de cierre de sesión
    const { error } = useAlert()
    error('Sesión cerrada exitosamente', userName ? `Hasta pronto ${userName}` : '')
    
    router.push('/login')
  }

  function initAuth() {
    const savedUser = storage.getItemJSON('user')
    const savedToken = storage.getItem('token')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = savedUser
      
      // Iniciar polling si hay sesión activa
      startPermissionPolling()
    }
  }

  // Sistema de Polling para Permisos
  function startPermissionPolling() {
    // Limpiar polling anterior si existe
    stopPermissionPolling()
    
    // Resetear contador de fallos al iniciar
    failedAttempts = 0
    
    // Ejecutar inmediatamente
    refreshPermissions()
    
    // Configurar intervalo
    pollingInterval = setInterval(() => {
      refreshPermissions()
    }, REFRESH_INTERVAL)
    
    logger.log('✅ Polling de permisos iniciado (cada 30s)')
  }

  function stopPermissionPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
      logger.log('🛑 Polling de permisos detenido')
    }
  }

  async function refreshPermissions() {
    if (!token.value) {
      stopPermissionPolling()
      return
    }

    try {
      logger.log('🔄 Refrescando permisos automáticamente...')
      const response = await api.get('/auth/refresh-permissions')
      
      if (response.data) {
        // ✅ Request exitoso, resetear contador de fallos
        failedAttempts = 0
        
        const oldPermissions = user.value?.permissions?.length || 0
        const newPermissions = response.data.user?.permissions?.length || 0
        
        // Actualizar usuario
        user.value = response.data.user
        storage.setItemJSON('user', user.value)
        
        logger.log('✅ Permisos actualizados:', {
          rol: user.value.role?.permissions?.map(p => p.slug) || [],
          individuales: user.value.permissions?.map(p => p.slug) || []
        })
        
        // Si los permisos cambiaron, emitir evento
        if (oldPermissions !== newPermissions) {
          logger.log('🔔 Permisos modificados, actualizando interfaz...')
          window.dispatchEvent(new CustomEvent('permissions-updated', {
            detail: user.value
          }))
        }
      }
    } catch (error) {
      // Incrementar contador de fallos
      failedAttempts++
      
      if (error.response?.status === 403 && error.response?.data?.logout_required) {
        // Usuario desactivado
        logger.warn('⚠️ Usuario desactivado, cerrando sesión...')
        forceLogout('Tu cuenta ha sido desactivada por un administrador')
      } else if (error.response?.status === 401) {
        // Token expirado
        logger.warn('⚠️ Token expirado, cerrando sesión...')
        forceLogout('Tu sesión ha expirado')
      } else {
        // Error de red u otro error
        logger.error(`❌ Error al refrescar permisos (intento ${failedAttempts}/${MAX_FAILED_ATTEMPTS}):`, error.message)
        
        // Si se alcanza el máximo de intentos fallidos, detener polling
        if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
          stopPermissionPolling()
          logger.warn('⚠️ Polling detenido por múltiples fallos consecutivos. Se reanudará al cambiar de pestaña.')
          
          // Opcional: mostrar notificación al usuario
          // showError('Conexión interrumpida', 'No se pueden actualizar permisos. Verifica tu conexión.')
        }
      }
    }
  }

  function forceLogout(message) {
    stopPermissionPolling()
    
    token.value = null
    user.value = null
    storage.removeItem('token')
    storage.removeItem('user')
    
    showError('Sesión cerrada', message)
    router.push('/login')
  }

  // Refrescar datos del usuario actual (mantener para compatibilidad)
  async function refreshUser() {
    return refreshPermissions()
  }

  // Escuchar cambios en localStorage de otras pestañas
  function setupStorageListener() {
    window.addEventListener('storage', (event) => {
      // Si el token fue removido en otra pestaña
      if (event.key === 'token' && event.newValue === null) {
        stopPermissionPolling()
        token.value = null
        user.value = null
        const { error } = useAlert()
        error('Sesión cerrada', 'Has cerrado sesión en otra pestaña')
        router.push('/login')
      }
      // Si se hizo login en otra pestaña
      else if (event.key === 'token' && event.newValue) {
        token.value = event.newValue
        const savedUser = storage.getItemJSON('user')
        if (savedUser) {
          user.value = savedUser
          startPermissionPolling()
        }
      }
    })
  }

  // Cleanup cuando se cierra la ventana/pestaña
  function setupCleanupListeners() {
    // Limpiar polling antes de cerrar ventana
    window.addEventListener('beforeunload', () => {
      stopPermissionPolling()
    })

    // Limpiar polling cuando la página se oculta (cambio de pestaña, minimizar, etc)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Pausar polling cuando la pestaña está oculta para ahorrar recursos
        stopPermissionPolling()
      } else if (token.value && user.value) {
        // Reanudar polling cuando la pestaña vuelve a ser visible
        startPermissionPolling()
      }
    })
  }

  // Verificar si el usuario tiene un permiso específico
  function hasPermission(permissionSlug) {
    if (!user.value) return false
    
    // Admin tiene todos los permisos
    if (user.value.rol === 'Admin' || user.value.role?.nombre === 'Admin') {
      return true
    }
    
    // Combinar permisos del rol y permisos individuales
    const rolePermissions = user.value.role?.permissions || []
    const userPermissions = user.value.permissions || []
    const allPermissions = [...rolePermissions, ...userPermissions]
    
    // Verificar si tiene el permiso
    return allPermissions.some(p => p.slug === permissionSlug)
  }

  // Inicializar al crear el store
  initAuth()
  setupStorageListener()
  setupCleanupListeners()

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    initAuth,
    refreshUser,
    hasPermission
  }
})
