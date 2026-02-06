<template>
  <div class="space-y-4">
    <!-- Filtros -->
    <div class="flex gap-3">
      <select
        v-model="filters.stock_type_id"
        @change="loadSecciones"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="">Todos los tipos</option>
        <option v-for="tipo in stockTypes" :key="tipo.id" :value="tipo.id">
          {{ tipo.nombre }}
        </option>
      </select>
      <button
        v-if="canCreate"
        @click="openCreateModal"
        class="ml-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nuevo Tipo
      </button>
    </div>

    <!-- Lista de tipos de artículos -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="seccion in secciones"
        :key="seccion.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-5"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ seccion.nombre }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 font-mono">{{ seccion.codigo }}</p>
          </div>
          <span
            :class="[
              'px-2 py-1 rounded-full text-xs font-semibold',
              seccion.estado ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            ]"
          >
            {{ seccion.estado ? 'Activa' : 'Inactiva' }}
          </span>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ seccion.descripcion }}</p>

        <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>{{ seccion.products_count || 0 }} productos</span>
        </div>

        <div class="bg-gray-50 dark:bg-gray-700 rounded px-3 py-2 mb-3">
          <p class="text-xs text-gray-500 dark:text-gray-400">Categoría</p>
          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ seccion.stock_type?.nombre }}</p>
        </div>

        <div class="flex gap-2">
          <button
            v-if="canEdit"
            @click="openEditModal(seccion)"
            class="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded font-medium transition text-sm"
            title="Editar tipo de artículo"
          >
            Editar
          </button>
          <button
            v-if="canDelete"
            @click="deleteSeccion(seccion)"
            class="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded font-medium transition text-sm"
            title="Eliminar tipo de artículo"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div v-if="loading" class="col-span-full flex flex-col items-center justify-center py-12">
        <svg class="animate-spin h-12 w-12 text-red-600 mb-3" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-500 dark:text-gray-400">Cargando tipos de artículos...</p>
      </div>

      <div v-if="!loading && secciones.length === 0" class="col-span-full flex flex-col items-center justify-center py-12">
        <svg class="w-16 h-16 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p class="text-gray-500 dark:text-gray-400 font-medium">No hay tipos de artículos registrados</p>
        <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Crea un tipo de artículo para comenzar</p>
      </div>
    </div>

    <SeccionModal
      v-if="showModal"
      :seccion="selectedSeccion"
      :stockTypes="stockTypes"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { sectionsService } from '../../services/sections'
import { stockTypesService } from '../../services/stockTypes'
import { useAlert } from '../../composables/useAlert'
import SeccionModal from './SeccionModal.vue'

const authStore = useAuthStore()
const { success, error, confirm } = useAlert()

const secciones = ref([])
const stockTypes = ref([])
const loading = ref(false)
const filters = ref({ stock_type_id: '' })
const showModal = ref(false)
const selectedSeccion = ref(null)

const canCreate = computed(() => authStore.hasPermission('inventario.crear'))
const canEdit = computed(() => authStore.hasPermission('inventario.editar'))
const canDelete = computed(() => authStore.hasPermission('inventario.eliminar'))

const loadSecciones = async () => {
  loading.value = true
  try {
    const params = {
      stock_type_id: filters.value.stock_type_id || undefined
    }
    const response = await sectionsService.getAll(params)
    secciones.value = response.data.data.data || response.data.data || []
  } catch (err) {
    error('Error al cargar secciones', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const loadStockTypes = async () => {
  try {
    const response = await stockTypesService.getAll()
    stockTypes.value = response.data.data.data || response.data.data || []
  } catch (err) {
    console.error('Error cargando tipos de stock:', err)
  }
}

const openCreateModal = () => {
  selectedSeccion.value = null
  showModal.value = true
}

const openEditModal = (seccion) => {
  selectedSeccion.value = { ...seccion }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedSeccion.value = null
}

const handleSave = async () => {
  closeModal()
  await loadSecciones()
}

const deleteSeccion = async (seccion) => {
  if (!await confirm(`¿Estás seguro de eliminar el tipo de artículo ${seccion.nombre}?`)) return
  
  try {
    await sectionsService.delete(seccion.id)
    success('Tipo eliminado', 'El tipo de artículo ha sido eliminado correctamente')
    await loadSecciones()
  } catch (err) {
    error('Error al eliminar', err.response?.data?.message || err.message)
  }
}

onMounted(() => {
  loadSecciones()
  loadStockTypes()
})
</script>
