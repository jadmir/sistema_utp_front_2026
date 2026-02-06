<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Encabezado -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">Administra los usuarios del sistema</p>
      </div>
      <button
        v-if="isAdmin"
        @click="openCreateModal"
        class="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition shadow-lg w-full sm:w-auto"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Nuevo Usuario</span>
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
      <div class="flex-1 relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre o email..."
          class="w-full px-3 sm:px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          title="Limpiar búsqueda"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <button
        v-if="isAdmin"
        @click="toggleDeletedView"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition text-sm sm:text-base whitespace-nowrap',
          showDeleted ? 'bg-gray-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        ]"
      >
        {{ showDeleted ? 'Ver Activos' : 'Ver Eliminados' }}
      </button>
    </div>

    <!-- Tabla de usuarios -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Usuario
              </th>
              <th class="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rol
              </th>
              <th class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Estado
              </th>
              <th v-if="isAdmin" class="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="loading">
              <td colspan="5" class="px-3 sm:px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                <div class="flex justify-center items-center">
                  <svg class="animate-spin h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredUsuarios.length === 0">
              <td colspan="5" class="px-3 sm:px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                No se encontraron usuarios
              </td>
            </tr>
            <tr v-else v-for="usuario in filteredUsuarios" :key="usuario.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-3 sm:px-6 py-3 sm:py-4">
                <div class="flex items-center">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-white font-bold text-sm sm:text-base">{{ usuario.nombre.charAt(0).toUpperCase() }}</span>
                  </div>
                  <div class="ml-2 sm:ml-4 min-w-0">
                    <div class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">{{ usuario.nombre }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 truncate sm:hidden">{{ usuario.email }}</div>
                  </div>
                </div>
              </td>
              <td class="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ usuario.email }}</div>
              </td>
              <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                <span class="px-1.5 sm:px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ usuario.role?.nombre }}
                </span>
              </td>
              <td class="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    usuario.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ usuario.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td v-if="isAdmin" class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-1 sm:space-x-2">
                  <button
                    v-if="!showDeleted"
                    @click="openPermisosModal(usuario)"
                    class="text-purple-600 hover:text-purple-900 p-1"
                    title="Asignar permisos"
                  >
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </button>
                  <button
                    v-if="!showDeleted"
                    @click="openEditModal(usuario)"
                    class="text-blue-600 hover:text-blue-900 p-1"
                    title="Editar"
                  >
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    v-if="!showDeleted"
                    @click="deleteUsuario(usuario)"
                    class="text-red-600 hover:text-red-900 p-1"
                    title="Eliminar"
                  >
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button
                    v-if="showDeleted"
                    @click="restoreUsuario(usuario)"
                    class="text-green-600 hover:text-green-900 p-1"
                    title="Restaurar"
                  >
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button
                    v-if="showDeleted"
                    @click="forceDeleteUsuario(usuario)"
                    class="text-red-600 hover:text-red-900 p-1"
                    title="Eliminar permanentemente"
                  >
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Crear/Editar -->
    <UsuarioModal
      v-if="showModal"
      :usuario="selectedUsuario"
      :roles="roles"
      @close="closeModal"
      @save="handleSave"
    />

    <!-- Modal Asignar Permisos -->
    <AsignarPermisosUsuarioModal
      :show="showPermisosModal"
      :usuario="selectedUsuarioPermisos"
      @close="closePermisosModal"
      @success="handlePermisosSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { usuariosService, rolesService } from '../services/usuarios'
import { useAlert } from '../composables/useAlert'
import UsuarioModal from '../components/UsuarioModal.vue'
import AsignarPermisosUsuarioModal from '../components/AsignarPermisosUsuarioModal.vue'

const authStore = useAuthStore()
const { success, error, confirm } = useAlert()

const usuarios = ref([])
const roles = ref([])
const loading = ref(false)
const searchQuery = ref('')
const showDeleted = ref(false)
const showModal = ref(false)
const selectedUsuario = ref(null)
const showPermisosModal = ref(false)
const selectedUsuarioPermisos = ref(null)

const isAdmin = computed(() => authStore.user?.rol === 'Admin')

const filteredUsuarios = computed(() => {
  if (!searchQuery.value) return usuarios.value
  
  const query = searchQuery.value.toLowerCase()
  return usuarios.value.filter(u => 
    u.nombre.toLowerCase().includes(query) || 
    u.email.toLowerCase().includes(query)
  )
})

const loadUsuarios = async () => {
  loading.value = true
  try {
    const response = showDeleted.value 
      ? await usuariosService.getTrashed()
      : await usuariosService.getAll()
    usuarios.value = response.data.data
  } catch (err) {
    console.error('Error cargando usuarios:', err)
    
    // Si es 403, mostrar mensaje específico
    if (err.response?.status === 403) {
      error(
        'No tienes permisos para acceder a este recurso',
        'El backend requiere permisos de administrador para listar usuarios. Contacta al administrador del sistema.'
      )
    } else {
      error('Error al cargar usuarios', err.response?.data?.message || err.message)
    }
  } finally {
    loading.value = false
  }
}

const loadRoles = async () => {
  try {
    const response = await rolesService.getAll()
    roles.value = response.data.data
  } catch (err) {
    error('Error al cargar roles', err.response?.data?.message || err.message)
  }
}

const toggleDeletedView = () => {
  showDeleted.value = !showDeleted.value
  loadUsuarios()
}

const openCreateModal = () => {
  selectedUsuario.value = null
  showModal.value = true
}

const openEditModal = (usuario) => {
  selectedUsuario.value = { ...usuario }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedUsuario.value = null
}

const handleSave = async () => {
  closeModal()
  await loadUsuarios()
}

const deleteUsuario = async (usuario) => {
  if (!await confirm(`¿Estás seguro de eliminar al usuario ${usuario.nombre}?`)) return
  
  try {
    await usuariosService.delete(usuario.id)
    success('Usuario eliminado', 'El usuario ha sido eliminado correctamente')
    await loadUsuarios()
  } catch (err) {
    error('Error al eliminar', err.response?.data?.message || err.message)
  }
}

const restoreUsuario = async (usuario) => {
  try {
    await usuariosService.restore(usuario.id)
    success('Usuario restaurado', 'El usuario ha sido restaurado correctamente')
    await loadUsuarios()
  } catch (err) {
    error('Error al restaurar', err.response?.data?.message || err.message)
  }
}

const forceDeleteUsuario = async (usuario) => {
  if (!await confirm(`¿Estás seguro de eliminar permanentemente a ${usuario.nombre}? Esta acción no se puede deshacer.`)) return
  
  try {
    await usuariosService.forceDelete(usuario.id)
    success('Usuario eliminado permanentemente', 'El usuario ha sido eliminado de forma permanente')
    await loadUsuarios()
  } catch (err) {
    error('Error al eliminar', err.response?.data?.message || err.message)
  }
}

const openPermisosModal = (usuario) => {
  selectedUsuarioPermisos.value = usuario
  showPermisosModal.value = true
}

const closePermisosModal = () => {
  showPermisosModal.value = false
  selectedUsuarioPermisos.value = null
}

const handlePermisosSuccess = () => {
  // Solo recargar usuarios, la alerta ya se muestra en el componente hijo
  loadUsuarios()
}

onMounted(() => {
  loadUsuarios()
  if (isAdmin.value) {
    loadRoles()
  }
})
</script>
