<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="fixed inset-0 transition-opacity bg-black bg-opacity-50 dark:bg-opacity-70" @click="closeModal"></div>

      <div class="relative inline-block w-full max-w-2xl text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl max-h-[90vh] flex flex-col">
          <!-- Header -->
          <div class="flex justify-between items-center px-6 py-5 border-b dark:border-gray-700 flex-shrink-0 bg-gray-100 dark:bg-gray-700">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Asignar Permisos</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Rol: {{ rol?.nombre }}</p>
            </div>
            <button @click="closeModal" aria-label="Cerrar modal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6">
          <!-- Loading -->
          <div v-if="loading" class="flex justify-center py-12">
            <svg class="animate-spin h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>

          <!-- Permisos agrupados por módulo -->
          <div v-else class="space-y-4">
            <div v-for="(permisos, modulo) in permisosAgrupados" :key="modulo" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-semibold text-gray-900 dark:text-white">{{ modulo }}</h4>
                <button
                  @click="toggleModulo(modulo)"
                  class="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                >
                  {{ todosMarcados(modulo) ? 'Desmarcar todos' : 'Marcar todos' }}
                </button>
              </div>
              <div class="space-y-2">
                <label
                  v-for="permiso in permisos"
                  :key="permiso.id"
                  class="flex items-start space-x-3 cursor-pointer hover:bg-white dark:hover:bg-gray-600 p-2 rounded transition"
                >
                  <input
                    type="checkbox"
                    :value="permiso.id"
                    v-model="selectedPermisos"
                    class="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
                  />
                  <div class="flex-1">
                    <div class="font-medium text-gray-900 dark:text-white">{{ permiso.nombre }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ permiso.slug }}</div>
                    <div v-if="permiso.descripcion" class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ permiso.descripcion }}</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
          </div>

          <!-- Footer -->
          <div class="flex-shrink-0 flex justify-between items-center p-6 pt-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <span class="font-semibold">{{ selectedPermisos.length }}</span> permisos seleccionados
            </div>
            <div class="flex space-x-3">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition"
              >
                Cancelar
              </button>
              <button
                @click="handleSubmit"
                :disabled="saving"
                class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition disabled:opacity-50 flex items-center space-x-2"
              >
                <svg v-if="saving" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ saving ? 'Guardando...' : 'Guardar' }}</span>
              </button>
            </div>
          </div>
        </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { permisosService } from '../services/permisos'

const props = defineProps({
  show: Boolean,
  rol: Object
})

const emit = defineEmits(['close', 'success'])

const loading = ref(false)
const saving = ref(false)
const permisos = ref([])
const selectedPermisos = ref([])

// Agrupar permisos por módulo
const permisosAgrupados = computed(() => {
  return permisos.value.reduce((grupos, permiso) => {
    const modulo = permiso.modulo || 'Otros'
    if (!grupos[modulo]) {
      grupos[modulo] = []
    }
    grupos[modulo].push(permiso)
    return grupos
  }, {})
})

// Verificar si todos los permisos de un módulo están marcados
const todosMarcados = (modulo) => {
  const permisosModulo = permisosAgrupados.value[modulo] || []
  return permisosModulo.every(p => selectedPermisos.value.includes(p.id))
}

// Toggle todos los permisos de un módulo
const toggleModulo = (modulo) => {
  const permisosModulo = permisosAgrupados.value[modulo] || []
  const todosMarcadosModulo = todosMarcados(modulo)
  
  if (todosMarcadosModulo) {
    // Desmarcar todos
    const idsModulo = permisosModulo.map(p => p.id)
    selectedPermisos.value = selectedPermisos.value.filter(id => !idsModulo.includes(id))
  } else {
    // Marcar todos
    const idsModulo = permisosModulo.map(p => p.id)
    selectedPermisos.value = [...new Set([...selectedPermisos.value, ...idsModulo])]
  }
}

// Cargar permisos cuando se abre el modal
watch(() => props.show, async (newVal) => {
  if (newVal && props.rol) {
    await loadData()
  }
})

const loadData = async () => {
  loading.value = true
  try {
    // Cargar todos los permisos disponibles
    const allPermisos = await permisosService.getAll()
    const permisosData = allPermisos.data || allPermisos
    
    // El backend devuelve los permisos agrupados: { "Usuarios": [...], "Roles": [...] }
    // Convertir a array plano
    if (typeof permisosData === 'object' && !Array.isArray(permisosData)) {
      permisos.value = Object.values(permisosData).flat()
    } else if (Array.isArray(permisosData)) {
      permisos.value = permisosData
    } else {
      permisos.value = []
    }
    
    // Cargar permisos ya asignados al rol
    const rolePermisos = await permisosService.getPermisosByRole(props.rol.id)
    const rolePermisosData = rolePermisos.data?.permissions || rolePermisos.permissions || rolePermisos.data || rolePermisos
    selectedPermisos.value = Array.isArray(rolePermisosData) ? rolePermisosData.map(p => p.id) : []
  } catch (error) {
    console.error('Error cargando permisos:', error)
    permisos.value = []
    selectedPermisos.value = []
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  try {
    await permisosService.assignPermisosToRole(props.rol.id, selectedPermisos.value)
    emit('success')
    closeModal()
  } catch (error) {
    console.error('Error asignando permisos:', error)
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  selectedPermisos.value = []
  permisos.value = []
  emit('close')
}
</script>
