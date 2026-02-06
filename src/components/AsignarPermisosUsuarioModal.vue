<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 transition-opacity bg-black bg-opacity-50 dark:bg-opacity-70" @click="closeModal"></div>

      <div class="relative w-full max-w-4xl text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl max-h-[90vh] flex flex-col">
        <!-- Header -->
          <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Asignar Permisos Personalizados</h3>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                {{ usuario?.nombre }} • {{ usuario?.role?.nombre }}
              </p>
            </div>
            <button @click="closeModal" aria-label="Cerrar modal" class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-4">
          <!-- Nota compacta -->
          <div class="mb-3 p-2.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p class="text-xs text-blue-800 dark:text-blue-300">
              <strong>💡 Tip:</strong> 
              <span class="text-blue-700 dark:text-blue-400">Azul</span> = Del rol • 
              <span class="text-orange-600 dark:text-orange-400">Naranja</span> = Personalizado • 
              <span class="text-gray-600 dark:text-gray-400">Gris</span> = Sin asignar
            </p>
          </div>

          <!-- Búsqueda -->
          <div class="mb-4">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar permisos por nombre, slug o descripción..."
                class="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
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
          </div>

          <!-- Estadísticas y acciones rápidas -->
          <div class="flex flex-col sm:flex-row gap-3 mb-3 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div class="flex-1 grid grid-cols-3 gap-3 text-center">
              <div>
                <div class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ permisosDelRol }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Del rol</div>
              </div>
              <div>
                <div class="text-xl font-bold text-orange-600 dark:text-orange-400">{{ selectedPermisos.length }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Personalizados</div>
              </div>
              <div>
                <div class="text-xl font-bold text-green-600 dark:text-green-400">{{ totalPermisosActivos }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Total activos</div>
              </div>
            </div>
            <div class="flex flex-col gap-2 min-w-fit">
              <button
                @click="marcarTodosEditables"
                type="button"
                class="px-3 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 font-medium transition whitespace-nowrap"
              >
                ✓ Marcar todos
              </button>
              <button
                @click="desmarcarTodosEditables"
                type="button"
                class="px-3 py-1.5 text-xs bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-500 font-medium transition whitespace-nowrap"
              >
                ✕ Limpiar personalizados
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="flex justify-center py-12">
            <svg class="animate-spin h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>

          <!-- Sin permisos disponibles -->
          <div v-else-if="Object.keys(permisosAgrupados).length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p class="text-lg font-medium">No hay permisos disponibles</p>
            <p class="text-sm mt-2">Primero debes crear permisos en la sección de Permisos</p>
          </div>

          <!-- Permisos agrupados por módulo -->
          <div v-else class="space-y-4">
            <div v-for="(permisos, modulo) in permisosAgrupados" :key="modulo" class="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <!-- Header del módulo -->
              <div class="bg-gray-100 dark:bg-gray-700 px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-600">
                <h4 class="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                  <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>{{ modulo }}</span>
                </h4>
                <button
                  @click="toggleModulo(modulo)"
                  type="button"
                  class="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition"
                >
                  {{ todosMarcados(modulo) ? '✕ Desmarcar' : '✓ Marcar' }}
                </button>
              </div>
              
              <!-- Lista de permisos del módulo -->
              <div class="p-3 space-y-2 bg-white dark:bg-gray-800">
                <label
                  v-for="permiso in permisos"
                  :key="permiso.id"
                  :class="[
                    'flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer border',
                    permiso.tiene_por_rol 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30' 
                      : !permiso.tiene_individual
                      ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                      : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                  ]"
                >
                  <div class="flex-shrink-0">
                    <input
                      type="checkbox"
                      :value="permiso.id"
                      v-model="selectedPermisos"
                      :title="permiso.tiene_por_rol ? 'Click para revocar este permiso del rol para este usuario' : 'Click para agregar/quitar este permiso'"
                      class="h-4 w-4 text-red-600 focus:ring-2 focus:ring-red-500 border-gray-300 dark:border-gray-500 rounded cursor-pointer"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                      <span class="font-semibold text-gray-900 dark:text-white text-sm">{{ permiso.nombre }}</span>
                      <span v-if="permiso.tiene_por_rol" class="px-2 py-0.5 text-xs font-semibold bg-blue-600 dark:bg-blue-700 text-white rounded-full">
                        Del Rol
                      </span>
                      <span v-else-if="permiso.tiene_individual" class="px-2 py-0.5 text-xs font-semibold bg-orange-600 dark:bg-orange-700 text-white rounded-full">
                        Personalizado
                      </span>
                    </div>
                    <div class="text-xs text-gray-600 dark:text-gray-400 font-mono mb-1">{{ permiso.slug }}</div>
                    <div v-if="permiso.descripcion" class="text-xs text-gray-600 dark:text-gray-400">{{ permiso.descripcion }}</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
          </div>

          <!-- Footer -->
          <div class="flex-shrink-0 flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div class="text-sm text-gray-600 dark:text-gray-300">
              <span v-if="hayCambios" class="flex items-center gap-2">
                <span class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span class="font-semibold">{{ cambiosPendientes }}</span>
              </span>
              <span v-else class="text-gray-500 dark:text-gray-500">Sin cambios pendientes</span>
            </div>
            <div class="flex space-x-3">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition"
              >
                Cancelar
              </button>
              <button
                @click="handleSubmit"
                :disabled="saving"
                class="px-6 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 font-medium transition disabled:opacity-50 flex items-center space-x-2"
              >
                <svg v-if="saving" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ saving ? 'Guardando...' : 'Guardar Permisos' }}</span>
              </button>
            </div>
          </div>
        </div>
    </div>
  </transition>

  <!-- Modal de Confirmación para Remover Todos -->
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="showConfirmModal" class="fixed inset-0 z-[60] overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-black bg-opacity-50 dark:bg-opacity-70" @click="showConfirmModal = false"></div>

        <div class="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          <!-- Icono de Advertencia -->
          <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <svg class="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <!-- Contenido -->
          <div class="text-center">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">¿Remover todos los permisos?</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Estás a punto de remover todos los permisos personalizados de <strong>{{ usuario?.nombre }}</strong>
            </p>
            <div class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mb-6">
              <p class="text-sm text-blue-800 dark:text-blue-300">
                <span class="font-semibold">Rol base:</span> {{ usuario?.role?.nombre || 'Sin rol' }}<br>
                El usuario solo tendrá los permisos de su rol base.
              </p>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex space-x-3">
            <button
              type="button"
              @click="showConfirmModal = false"
              class="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition"
            >
              Cancelar
            </button>
            <button
              @click="confirmRemoveAll"
              class="flex-1 px-4 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium transition"
            >
              Sí, remover todo
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
import { usuariosService } from '../services/usuarios'
import { useAlert } from '../composables/useAlert'
import { useAuthStore } from '../stores/auth'
import { logger } from '../utils/logger'

const props = defineProps({
  show: Boolean,
  usuario: Object
})

const emit = defineEmits(['close', 'success'])

const { success: showSuccess, error: showError } = useAlert()
const authStore = useAuthStore()
const loading = ref(false)
const saving = ref(false)
const permisos = ref([])
const selectedPermisos = ref([])
const showConfirmModal = ref(false)
const searchQuery = ref('')
const permisosOriginales = ref([])

// Agrupar permisos por módulo
const permisosAgrupados = computed(() => {
  if (!Array.isArray(permisos.value)) return {}
  
  // Filtrar por búsqueda
  let permisosFiltrados = permisos.value
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    permisosFiltrados = permisos.value.filter(p => 
      p.nombre?.toLowerCase().includes(query) ||
      p.slug?.toLowerCase().includes(query) ||
      p.descripcion?.toLowerCase().includes(query)
    )
  }
  
  return permisosFiltrados.reduce((grupos, permiso) => {
    // Usar el campo modulo si existe, sino inferir del slug
    let modulo = permiso.modulo || 'Otros'
    
    // Si no tiene módulo definido, intentar inferir del slug
    if (!permiso.modulo && permiso.slug) {
      const slugParts = permiso.slug.split('.')
      if (slugParts.length > 0) {
        // Capitalizar primera letra
        modulo = slugParts[0].charAt(0).toUpperCase() + slugParts[0].slice(1)
      }
    }
    
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
  const permisosEditables = permisosModulo.filter(p => !p.tiene_por_rol)
  if (permisosEditables.length === 0) return false
  return permisosEditables.every(p => selectedPermisos.value.includes(p.id))
}

// Contar permisos del rol
const permisosDelRol = computed(() => {
  return permisos.value.filter(p => p.tiene_por_rol).length
})

// Total de permisos activos (del rol + personalizados - revocados)
const totalPermisosActivos = computed(() => {
  const delRol = permisos.value.filter(p => p.tiene_por_rol && selectedPermisos.value.includes(p.id)).length
  const personalizados = selectedPermisos.value.length
  return delRol + personalizados
})

// Detectar cambios
const hayCambios = computed(() => {
  const originales = permisosOriginales.value
  const actuales = selectedPermisos.value
  
  if (originales.length !== actuales.length) return true
  
  const sorted1 = [...originales].sort()
  const sorted2 = [...actuales].sort()
  return JSON.stringify(sorted1) !== JSON.stringify(sorted2)
})

// Describir cambios pendientes
const cambiosPendientes = computed(() => {
  if (!hayCambios.value) return ''
  
  const originales = permisosOriginales.value
  const actuales = selectedPermisos.value
  
  const agregados = actuales.filter(id => !originales.includes(id)).length
  const removidos = originales.filter(id => !actuales.includes(id)).length
  
  const partes = []
  if (agregados > 0) partes.push(`${agregados} agregado${agregados > 1 ? 's' : ''}`)
  if (removidos > 0) partes.push(`${removidos} removido${removidos > 1 ? 's' : ''}`)
  
  return partes.join(', ')
})

// Desmarcar todos los permisos editables
const desmarcarTodosEditables = () => {
  selectedPermisos.value = []
}

// Marcar todos los permisos editables
const marcarTodosEditables = () => {
  const idsEditables = permisos.value
    .filter(p => !p.tiene_por_rol)
    .map(p => p.id)
  selectedPermisos.value = [...idsEditables]
}

// Toggle todos los permisos de un módulo
const toggleModulo = (modulo) => {
  const permisosModulo = permisosAgrupados.value[modulo] || []
  // Solo considerar permisos editables (no del rol)
  const permisosEditables = permisosModulo.filter(p => !p.tiene_por_rol)
  const todosMarcadosModulo = permisosEditables.every(p => selectedPermisos.value.includes(p.id))
  
  if (todosMarcadosModulo) {
    // Desmarcar todos los editables
    const idsEditables = permisosEditables.map(p => p.id)
    selectedPermisos.value = selectedPermisos.value.filter(id => !idsEditables.includes(id))
  } else {
    // Marcar todos los editables
    const idsEditables = permisosEditables.map(p => p.id)
    selectedPermisos.value = [...new Set([...selectedPermisos.value, ...idsEditables])]
  }
}

// Cargar permisos cuando se abre el modal
watch(() => props.show, async (newVal) => {
  if (newVal && props.usuario) {
    await loadData()
  }
})

const loadData = async () => {
  loading.value = true
  try {
    // Cargar permisos del usuario con la nueva estructura
    const response = await usuariosService.getPermisos(props.usuario.id)
    console.log('Datos recibidos:', response.data)
    
    // La estructura ahora es: { data: { permisos_disponibles: [...], permisos_del_rol: [...], permisos_individuales: [...] } }
    const data = response.data?.data || response.data
    
    // Usar permisos_disponibles que incluye TODOS los permisos con flags
    const permisosDisponibles = data.permisos_disponibles || []
    
    if (Array.isArray(permisosDisponibles)) {
      permisos.value = permisosDisponibles
      
      // Marcar TODOS los permisos que tiene el usuario (del rol + individuales)
      // Permitir desmarcar cualquiera para implementar revocación
      selectedPermisos.value = permisosDisponibles
        .filter(p => p.tiene_permiso)
        .map(p => p.id)
      
      // Guardar estado original para detectar cambios
      permisosOriginales.value = [...selectedPermisos.value]
      
      console.log('Permisos cargados:', {
        total: permisosDisponibles.length,
        del_rol: permisosDisponibles.filter(p => p.tiene_por_rol).map(p => p.nombre),
        individuales: permisosDisponibles.filter(p => p.tiene_individual).map(p => p.nombre),
        seleccionados: selectedPermisos.value
      })
    } else {
      permisos.value = []
      selectedPermisos.value = []
    }
  } catch (error) {
    logger.error('Error cargando permisos:', error)
    permisos.value = []
    selectedPermisos.value = []
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  // Si no hay permisos seleccionados, mostrar modal de confirmación
  if (selectedPermisos.value.length === 0) {
    showConfirmModal.value = true
    return
  }
  
  await savePermisos()
}

const confirmRemoveAll = async () => {
  showConfirmModal.value = false
  await savePermisos()
}

const savePermisos = async () => {
  saving.value = true
  try {
    logger.log('Guardando permisos:', selectedPermisos.value)
    logger.log('Usuario ID:', props.usuario.id)
    
    // Identificar permisos del rol que fueron desmarcados (para revocar)
    const permisosDelRol = permisos.value.filter(p => p.tiene_por_rol).map(p => p.id)
    const permisosRevocados = permisosDelRol.filter(id => !selectedPermisos.value.includes(id))
    
    // Identificar permisos adicionales (no del rol) que están marcados
    const permisosAdicionales = selectedPermisos.value.filter(id => {
      const permiso = permisos.value.find(p => p.id === id)
      return permiso && !permiso.tiene_por_rol
    })
    
    console.log('Permisos a enviar:', {
      adicionales: permisosAdicionales,
      revocados: permisosRevocados
    })
    
    const response = await usuariosService.assignPermisos(props.usuario.id, {
      permission_ids: permisosAdicionales,
      revoked_permission_ids: permisosRevocados
    })
    console.log('Respuesta del servidor:', response)
    
    // Si se modificaron permisos del usuario actual, se actualizarán automáticamente
    // por el sistema de polling (máximo 30 segundos)
    const esUsuarioActual = authStore.user && authStore.user.id === props.usuario.id
    
    // Mostrar mensaje apropiado
    if (permisosAdicionales.length === 0 && permisosRevocados.length === 0) {
      showSuccess(
        esUsuarioActual ? 'Tus permisos se resetean al rol base' : 'Permisos reseteados al rol base',
        'El usuario solo tendrá los permisos de su rol'
      )
    } else {
      const mensaje = []
      if (permisosAdicionales.length > 0) mensaje.push(`${permisosAdicionales.length} adicionales`)
      if (permisosRevocados.length > 0) mensaje.push(`${permisosRevocados.length} revocados`)
      
      showSuccess(
        esUsuarioActual ? 'Tus permisos han sido actualizados' : 'Permisos actualizados',
        mensaje.join(', ')
      )
    }
    
    emit('success')
    closeModal()
  } catch (error) {
    console.error('Error asignando permisos:', error)
    console.error('Detalles del error:', error.response?.data)
    showError(
      'Error al asignar permisos',
      error.response?.data?.message || 'No se pudo completar la operación'
    )
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
