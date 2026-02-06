import { computed, watch } from 'vue'
import { useAuthStore } from '../stores/auth'

export function usePermissions() {
  const authStore = useAuthStore()

  const user = computed(() => authStore.user)

  // Obtener todos los permisos del usuario (del rol + individuales)
  const allPermissions = computed(() => {
    if (!user.value) return []
    
    const rolePermissions = user.value.role?.permissions || []
    const userPermissions = user.value.permissions || []
    
    return [...rolePermissions, ...userPermissions]
  })

  // Verificar si el usuario tiene un permiso específico
  const hasPermission = (permissionSlug) => {
    if (!user.value) return false
    
    // Admin tiene todos los permisos
    const userRole = user.value.rol || user.value.role?.nombre
    if (userRole === 'Admin') return true
    
    return allPermissions.value.some(p => p.slug === permissionSlug)
  }

  // Verificar si tiene alguno de los permisos listados
  const hasAnyPermission = (permissionSlugs) => {
    return permissionSlugs.some(slug => hasPermission(slug))
  }

  // Verificar si tiene todos los permisos listados
  const hasAllPermissions = (permissionSlugs) => {
    return permissionSlugs.every(slug => hasPermission(slug))
  }

  // Obtener el rol del usuario
  const userRole = computed(() => {
    if (!user.value) return null
    return user.value.rol || user.value.role?.nombre
  })

  // Verificar si es admin
  const isAdmin = computed(() => {
    return userRole.value === 'Admin'
  })

  return {
    user,
    allPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userRole,
    isAdmin
  }
}
