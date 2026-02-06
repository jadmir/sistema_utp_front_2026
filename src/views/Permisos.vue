<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Encabezado -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Gestión de Permisos</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">Administra los permisos del sistema</p>
      </div>
      <button
        v-if="isAdmin"
        @click="openCreateModal"
        class="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition shadow-lg w-full sm:w-auto"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Nuevo Permiso</span>
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
      <div class="flex-1 relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre, slug o módulo..."
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
      <select
        v-model="filtroModulo"
        class="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="">Todos los módulos</option>
        <option v-for="modulo in modulos" :key="modulo" :value="modulo">{{ modulo }}</option>
      </select>
    </div>

    <!-- Permisos agrupados por módulo -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
      <svg class="animate-spin h-12 w-12 text-red-600 mb-3" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-500 dark:text-gray-400">Cargando permisos...</p>
    </div>
    
    <div v-else class="space-y-4">
      <div v-for="(permisos, modulo) in permisosAgrupados" :key="modulo" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div class="bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{{ modulo }}</h3>
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ permisos.length }} permisos</span>
        </div>
        
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div
            v-for="permiso in permisos"
            :key="permiso.id"
            class="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div class="flex-1 min-w-0">
                <div class="flex items-start space-x-3">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">{{ permiso.nombre }}</h4>
                    <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-mono">{{ permiso.slug }}</p>
                    <p v-if="permiso.descripcion" class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{{ permiso.descripcion }}</p>
                  </div>
                </div>
              </div>
              
              <div v-if="isAdmin" class="flex justify-end space-x-1 sm:space-x-2">
                <button
                  @click="openEditModal(permiso)"
                  class="text-blue-600 hover:text-blue-900 p-1"
                  title="Editar"
                >
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="deletePermiso(permiso)"
                  class="text-red-600 hover:text-red-900 p-1"
                  title="Eliminar"
                >
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && Object.keys(permisosAgrupados).length === 0" class="bg-white rounded-lg shadow p-12 text-center text-gray-500">
        No se encontraron permisos
      </div>
    </div>

    <!-- Modal Crear/Editar -->
    <PermisoModal
      :show="showModal"
      :permiso="selectedPermiso"
      :is-edit-mode="isEditMode"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { permisosService } from '../services/permisos'
import { useAlert } from '../composables/useAlert'
import PermisoModal from '../components/PermisoModal.vue'

const authStore = useAuthStore()
const { showAlert, confirm } = useAlert()

const permisos = ref([])
const loading = ref(false)
const searchQuery = ref('')
const filtroModulo = ref('')
const showModal = ref(false)
const selectedPermiso = ref(null)
const isEditMode = ref(false)

const isAdmin = computed(() => authStore.user?.rol === 'Admin')

// Obtener lista única de módulos
const modulos = computed(() => {
  if (!Array.isArray(permisos.value)) return []
  const mods = permisos.value.map(p => p.modulo || 'Otros')
  return [...new Set(mods)].sort()
})

// Filtrar permisos
const permisosFiltrados = computed(() => {
  if (!Array.isArray(permisos.value)) return []
  
  let filtered = permisos.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.nombre.toLowerCase().includes(query) ||
      p.slug.toLowerCase().includes(query) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(query)) ||
      (p.modulo && p.modulo.toLowerCase().includes(query))
    )
  }

  if (filtroModulo.value) {
    filtered = filtered.filter(p => (p.modulo || 'Otros') === filtroModulo.value)
  }

  return filtered
})

// Agrupar permisos filtrados por módulo
const permisosAgrupados = computed(() => {
  if (!Array.isArray(permisosFiltrados.value)) return {}
  
  return permisosFiltrados.value.reduce((grupos, permiso) => {
    const modulo = permiso.modulo || 'Otros'
    if (!grupos[modulo]) {
      grupos[modulo] = []
    }
    grupos[modulo].push(permiso)
    return grupos
  }, {})
})

const loadPermisos = async () => {
  loading.value = true
  try {
    const response = await permisosService.getAll()
    const permisosData = response.data || response
    
    // El backend devuelve los permisos agrupados: { "Usuarios": [...], "Roles": [...] }
    // Convertir a array plano
    if (typeof permisosData === 'object' && !Array.isArray(permisosData)) {
      permisos.value = Object.values(permisosData).flat()
    } else if (Array.isArray(permisosData)) {
      permisos.value = permisosData
    } else {
      permisos.value = []
    }
  } catch (error) {
    showAlert('Error al cargar permisos', 'error')
    console.error('Error:', error)
    permisos.value = []
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  selectedPermiso.value = null
  isEditMode.value = false
  showModal.value = true
}

const openEditModal = (permiso) => {
  selectedPermiso.value = permiso
  isEditMode.value = true
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedPermiso.value = null
}

const handleSubmit = async (formData) => {
  try {
    if (isEditMode.value) {
      await permisosService.update(selectedPermiso.value.id, formData)
      showAlert('Permiso actualizado exitosamente', 'success')
    } else {
      await permisosService.create(formData)
      showAlert('Permiso creado exitosamente', 'success')
    }
    await loadPermisos()
  } catch (error) {
    showAlert(error.response?.data?.message || 'Error al guardar permiso', 'error')
    console.error('Error:', error)
  }
}

const deletePermiso = async (permiso) => {
  if (!await confirm(`¿Estás seguro de eliminar el permiso "${permiso.nombre}"?`)) {
    return
  }

  try {
    await permisosService.delete(permiso.id)
    showAlert('Permiso eliminado exitosamente', 'success')
    await loadPermisos()
  } catch (error) {
    showAlert(error.response?.data?.message || 'Error al eliminar permiso', 'error')
    console.error('Error:', error)
  }
}

onMounted(() => {
  loadPermisos()
})
</script>
