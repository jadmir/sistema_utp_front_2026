import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { logger } from '../utils/logger'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPassword.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/ResetPassword.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/cambiar-password',
    name: 'CambiarPassword',
    component: () => import('../views/CambiarPassword.vue'),
    meta: { requiresAuth: true, requiresPasswordChange: true }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import('../views/Usuarios.vue'),
    meta: { requiresAuth: true, roles: ['Admin', 'Almacenero'], permission: 'usuarios.ver' }
  },
  {
    path: '/permisos',
    name: 'Permisos',
    component: () => import('../views/Permisos.vue'),
    meta: { requiresAuth: true, roles: ['Admin'], permission: 'permisos.ver' }
  },
  {
    path: '/inventario',
    name: 'Inventario',
    component: () => import('../views/Inventario.vue'),
    meta: { requiresAuth: true, permission: 'inventario.ver' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guard de navegación
router.beforeEach((to, from, next) => {
  try {
    const authStore = useAuthStore()
    
    // Verificar que authStore esté inicializado correctamente
    if (!authStore) {
      logger.error('❌ AuthStore no disponible, redirigiendo a login')
      next('/login')
      return
    }
    
    const requiresAuth = to.meta.requiresAuth
    const requiredRoles = to.meta.roles
    const requiredPermission = to.meta.permission

    if (requiresAuth && !authStore.isAuthenticated) {
      next('/login')
    } else if (to.path === '/login' && authStore.isAuthenticated) {
      next('/')
    } else if (requiredRoles || requiredPermission) {
      const user = authStore.user
      
      // Verificar que el usuario exista
      if (!user) {
        logger.warn('⚠️ Usuario no disponible, redirigiendo a login')
        next('/login')
        return
      }
      
      const userRole = user?.rol || user?.role?.nombre
      
      // Obtener permisos del rol
      const rolePermissions = user?.role?.permissions || []
      // Obtener permisos individuales del usuario
      const userPermissions = user?.permissions || []
      // Combinar permisos
      const allPermissions = [...rolePermissions, ...userPermissions]
      
      logger.log('🔐 Verificando acceso a:', to.path)
      logger.log('🔐 Rol del usuario:', userRole)
      logger.log('🔐 Permisos totales:', allPermissions.map(p => p.slug))
      logger.log('🔐 Permiso requerido:', requiredPermission)
      logger.log('🔐 Roles requeridos:', requiredRoles)
      
      // Verificar si tiene el permiso requerido (PRIORIDAD)
      let hasPermission = false
      if (requiredPermission) {
        hasPermission = allPermissions.some(p => p.slug === requiredPermission)
      }
      
      // Verificar si tiene el rol requerido
      const hasRole = requiredRoles ? requiredRoles.includes(userRole) : false
      
      logger.log('🔐 Tiene permiso?', hasPermission)
      logger.log('🔐 Tiene rol?', hasRole)
      
      // Permitir acceso si tiene el permiso O el rol
      if (hasPermission || hasRole) {
        next()
      } else {
        // No tiene acceso
        logger.log('❌ Acceso denegado')
        next('/')
      }
    } else {
      next()
    }
  } catch (error) {
    // Manejo de errores críticos en la navegación
    logger.error('❌ Error crítico en router guard:', error)
    console.error('Router guard error:', error)
    
    // Redirigir a login en caso de error
    next('/login')
  }
})

export default router
