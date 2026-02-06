<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <p class="text-gray-600 dark:text-gray-400">Gestiona las categorías del almacén</p>
      <button
        v-if="canCreate"
        @click="openCreateModal"
        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nueva Categoría
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="tipo in tipos"
        :key="tipo.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-6"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ tipo.nombre }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 font-mono">{{ tipo.codigo_prefix }}</p>
          </div>
          <span
            :class="[
              'px-2 py-1 rounded-full text-xs font-semibold',
              tipo.estado ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            ]"
          >
            {{ tipo.estado ? 'Activo' : 'Inactivo' }}
          </span>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ tipo.descripcion }}</p>

        <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            {{ tipo.sections_count || 0 }} secciones
          </span>
        </div>

        <div class="flex gap-2 pt-4 border-t dark:border-gray-700">
          <button
            v-if="canEdit"
            @click="openEditModal(tipo)"
            class="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded font-medium transition text-sm"
            title="Editar categoría"
          >
            Editar
          </button>
          <button
            v-if="canDelete"
            @click="deleteTipo(tipo)"
            class="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded font-medium transition text-sm"
            title="Eliminar categoría"
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
        <p class="text-gray-500 dark:text-gray-400">Cargando categorías...</p>
      </div>

      <div v-if="!loading && tipos.length === 0" class="col-span-full flex flex-col items-center justify-center py-12">
        <svg class="w-16 h-16 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <p class="text-gray-500 dark:text-gray-400 font-medium">No hay categorías registradas</p>
        <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Crea una categoría para comenzar</p>
      </div>
    </div>

    <TipoStockModal
      v-if="showModal"
      :tipo="selectedTipo"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { stockTypesService } from '../../services/stockTypes'
import { useAlert } from '../../composables/useAlert'
import TipoStockModal from './TipoStockModal.vue'

const authStore = useAuthStore()
const { success, error, confirm } = useAlert()

const tipos = ref([])
const loading = ref(false)
const showModal = ref(false)
const selectedTipo = ref(null)

const canCreate = computed(() => authStore.hasPermission('inventario.crear'))
const canEdit = computed(() => authStore.hasPermission('inventario.editar'))
const canDelete = computed(() => authStore.hasPermission('inventario.eliminar'))

const loadTipos = async () => {
  loading.value = true
  try {
    const response = await stockTypesService.getAll()
    tipos.value = response.data.data.data || response.data.data || []
  } catch (err) {
    error('Error al cargar tipos', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  selectedTipo.value = null
  showModal.value = true
}

const openEditModal = (tipo) => {
  selectedTipo.value = { ...tipo }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedTipo.value = null
}

const handleSave = async () => {
  closeModal()
  await loadTipos()
}

const deleteTipo = async (tipo) => {
  if (!await confirm(`¿Estás seguro de eliminar la categoría ${tipo.nombre}?`)) return
  
  try {
    await stockTypesService.delete(tipo.id)
    success('Categoría eliminada', 'La categoría ha sido eliminada correctamente')
    await loadTipos()
  } catch (err) {
    error('Error al eliminar', err.response?.data?.message || err.message)
  }
}

onMounted(() => {
  loadTipos()
})
</script>
