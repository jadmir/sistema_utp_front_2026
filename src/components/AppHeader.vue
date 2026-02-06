<template>
  <nav class="bg-black shadow-lg fixed top-0 left-0 right-0 z-30">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16">
        <!-- Hamburguesa y Logo -->
        <div class="flex items-center space-x-4">
          <button
            @click="toggleSidebar"
            class="text-white hover:text-primary p-2 rounded-md transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <router-link to="/" class="flex items-center space-x-2">
            <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span class="text-white font-bold text-xl hidden sm:block">Sistema de Almacén</span>
          </router-link>
        </div>
        
        <!-- Usuario y logout -->
        <div class="flex items-center space-x-4">
          <!-- Toggle de tema -->
          <button
            @click="toggleTheme"
            class="text-white hover:text-primary p-2 rounded-md transition"
            :title="isDark ? 'Modo claro' : 'Modo oscuro'"
          >
            <!-- Icono de sol (modo claro) -->
            <svg v-if="!isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <!-- Icono de luna (modo oscuro) -->
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
          
          <div class="text-white hidden md:flex items-center space-x-2">
            <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span class="text-sm font-bold">{{ userInitial }}</span>
            </div>
            <span>{{ authStore.user?.nombre }}</span>
          </div>
          <button 
            @click="handleLogout"
            class="bg-red-600 hover:bg-red-700 text-white px-3 md:px-4 py-2 rounded-md font-medium transition flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="hidden md:block">Salir</span>
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Overlay invisible para cerrar al hacer click fuera -->
  <div
    v-if="sidebarOpen"
    @click="closeSidebar"
    class="fixed inset-0 z-40"
  ></div>

  <!-- Sidebar lateral -->
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform -translate-x-full"
    enter-to-class="transform translate-x-0"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="transform translate-x-0"
    leave-to-class="transform -translate-x-full"
  >
    <div
      v-if="sidebarOpen"
      class="fixed top-0 left-0 h-full w-full sm:w-80 md:w-64 bg-slate-800 shadow-2xl z-50 overflow-y-auto"
    >
      <div class="p-4">
        <!-- Header del sidebar -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-white font-bold text-lg">Menú</h2>
          <button
            @click="closeSidebar"
            class="text-white hover:text-primary p-1 rounded-md transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Usuario info -->
        <div class="flex items-center space-x-3 px-3 py-4 bg-slate-700 rounded-lg mb-4">
          <div class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-white font-bold text-lg">{{ userInitial }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-white font-medium truncate">{{ authStore.user?.nombre }}</div>
            <div class="text-gray-400 text-sm truncate">{{ authStore.user?.email }}</div>
            <span class="inline-block mt-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded">
              {{ authStore.user?.rol }}
            </span>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="space-y-1">
          <router-link 
            to="/" 
            @click="closeSidebar"
            class="flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition group text-white hover:bg-red-600"
            active-class="bg-red-600 text-white"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span class="text-white">Inicio</span>
          </router-link>

          <router-link 
            v-if="canAccessUsuarios"
            to="/usuarios" 
            @click="closeSidebar"
            class="flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition group text-white hover:bg-red-600"
            active-class="bg-red-600 text-white"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span class="text-white">Usuarios</span>
          </router-link>

          <router-link 
            v-if="isAdmin"
            to="/permisos" 
            @click="closeSidebar"
            class="flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition group text-white hover:bg-red-600"
            active-class="bg-red-600 text-white"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span class="text-white">Permisos</span>
          </router-link>

          <router-link 
            v-if="canAccessInventario"
            to="/inventario" 
            @click="closeSidebar"
            class="flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition group text-white hover:bg-red-600"
            active-class="bg-red-600 text-white"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span class="text-white">Inventario</span>
          </router-link>
        </nav>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useTheme } from '../composables/useTheme'

const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()
const sidebarOpen = ref(false)

const userInitial = computed(() => {
  return authStore.user?.nombre?.charAt(0)?.toUpperCase() || 'U'
})

const canAccessUsuarios = computed(() => {
  const user = authStore.user
  const userRole = user?.rol || user?.role?.nombre
  
  // Verificar por rol
  const hasRole = userRole === 'Admin' || userRole === 'Almacenero'
  
  // Verificar por permiso individual
  const rolePermissions = user?.role?.permissions || []
  const userPermissions = user?.permissions || []
  const allPermissions = [...rolePermissions, ...userPermissions]
  const hasPermission = allPermissions.some(p => p.slug === 'usuarios.ver')
  
  return hasRole || hasPermission
})

const canAccessInventario = computed(() => {
  const user = authStore.user
  const userRole = user?.rol || user?.role?.nombre
  
  // Admin siempre tiene acceso
  if (userRole === 'Admin') return true
  
  // Verificar por permiso
  const rolePermissions = user?.role?.permissions || []
  const userPermissions = user?.permissions || []
  const allPermissions = [...rolePermissions, ...userPermissions]
  
  return allPermissions.some(p => p.slug === 'inventario.ver')
})

const isAdmin = computed(() => {
  const user = authStore.user
  const userRole = user?.rol || user?.role?.nombre
  return userRole === 'Admin'
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const handleLogout = () => {
  closeSidebar()
  authStore.logout()
}
</script>
