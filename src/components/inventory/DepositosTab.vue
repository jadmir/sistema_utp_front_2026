<template>
  <div class="space-y-4">
    <!-- Filtros y botón crear -->
    <div class="flex justify-between items-center">
      <div class="flex gap-3">
        <select
          v-model="filters.activo"
          @change="loadDepositos"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Todos los estados</option>
          <option value="1">Activos</option>
          <option value="0">Inactivos</option>
        </select>
      </div>
      <button
        v-if="canCreate"
        @click="openCreateModal"
        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nuevo Depósito
      </button>
    </div>

    <!-- Lista de depósitos -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="deposito in depositos"
        :key="deposito.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-5"
      >
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ deposito.nombre }}</h3>
            <p v-if="deposito.codigo" class="text-sm text-gray-600 dark:text-gray-400 font-mono">{{ deposito.codigo }}</p>
          </div>
          <span
            :class="[
              'px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2',
              deposito.activo ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            ]"
          >
            {{ deposito.activo ? 'Activo' : 'Inactivo' }}
          </span>
        </div>

        <p v-if="deposito.descripcion" class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ deposito.descripcion }}</p>
        <p v-else class="text-sm text-gray-400 dark:text-gray-500 italic mb-3">Sin descripción</p>

        <div v-if="deposito.ubicacion" class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{{ deposito.ubicacion }}</span>
        </div>

        <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>{{ deposito.products_count || 0 }} productos</span>
        </div>

        <div class="flex gap-2 mt-4">
          <button
            v-if="canEdit"
            @click="openEditModal(deposito)"
            class="flex-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-2 rounded font-medium transition text-sm"
            title="Editar depósito"
          >
            Editar
          </button>
          <button
            v-if="canDelete && deposito.products_count === 0"
            @click="deleteDeposito(deposito)"
            class="flex-1 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-2 rounded font-medium transition text-sm"
            title="Eliminar depósito"
          >
            Eliminar
          </button>
          <button
            v-else-if="canDelete && deposito.products_count > 0"
            disabled
            class="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 px-3 py-2 rounded font-medium cursor-not-allowed text-sm"
            title="No se puede eliminar: tiene productos asignados"
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
        <p class="text-gray-500 dark:text-gray-400">Cargando depósitos...</p>
      </div>

      <div v-if="!loading && depositos.length === 0" class="col-span-full flex flex-col items-center justify-center py-12">
        <svg class="w-16 h-16 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
        <p class="text-gray-500 dark:text-gray-400 font-medium">No hay depósitos registrados</p>
        <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Crea un depósito para organizar tu inventario</p>
      </div>
    </div>

    <DepositoModal
      v-if="showModal"
      :deposito="selectedDeposito"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { depositosService } from '../../services/depositos'
import { useAlert } from '../../composables/useAlert'
import DepositoModal from './DepositoModal.vue'

const authStore = useAuthStore()
const { success, error, confirm } = useAlert()

const depositos = ref([])
const loading = ref(false)
const filters = ref({ activo: '' })
const showModal = ref(false)
const selectedDeposito = ref(null)

const canCreate = computed(() => authStore.hasPermission('inventario.crear'))
const canEdit = computed(() => authStore.hasPermission('inventario.editar'))
const canDelete = computed(() => authStore.hasPermission('inventario.eliminar'))

const loadDepositos = async () => {
  loading.value = true
  try {
    const params = {}
    if (filters.value.activo !== '') {
      params.activo = filters.value.activo
    }
    const response = await depositosService.getAll(params)
    depositos.value = response.data.data || []
  } catch (err) {
    console.warn('⚠️ Error al cargar depósitos:', err.message)
    depositos.value = []
    // No mostrar error si el backend no tiene el endpoint implementado
    if (!err.response || err.response.status !== 404) {
      error('Error al cargar depósitos', err.response?.data?.message || err.message)
    }
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  selectedDeposito.value = null
  showModal.value = true
}

const openEditModal = (deposito) => {
  selectedDeposito.value = { ...deposito }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedDeposito.value = null
}

const handleSave = async () => {
  closeModal()
  await loadDepositos()
}

const deleteDeposito = async (deposito) => {
  if (!await confirm(`¿Estás seguro de eliminar el depósito "${deposito.nombre}"?`)) return
  
  try {
    await depositosService.delete(deposito.id)
    success('Depósito eliminado', 'El depósito ha sido eliminado correctamente')
    await loadDepositos()
  } catch (err) {
    error('Error al eliminar', err.response?.data?.message || err.message)
  }
}

onMounted(() => {
  loadDepositos()
})
</script>
