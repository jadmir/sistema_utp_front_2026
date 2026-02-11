<template>
  <div class="space-y-4">
    <!-- Filtros de Búsqueda -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🔍 Buscar Vales de Cargo
      </h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          v-model="filters.numero_vale"
          type="text"
          placeholder="Número de vale (VC-2026-0001)"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />

        <input
          v-model="filters.recibido_por"
          type="text"
          placeholder="Nombre del receptor"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />

        <select
          v-model="filters.area_id"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Todas las áreas</option>
          <option v-for="area in areas" :key="area.id" :value="area.id">
            {{ area.nombre }} ({{ area.codigo }})
          </option>
        </select>

        <input
          v-model="filters.fecha_desde"
          type="date"
          placeholder="Desde"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />

        <input
          v-model="filters.fecha_hasta"
          type="date"
          placeholder="Hasta"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />

        <button
          @click="buscarVales"
          :disabled="loading"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
        >
          {{ loading ? 'Buscando...' : 'Buscar' }}
        </button>

        <button
          @click="limpiarFiltros"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          Limpiar
        </button>
      </div>
    </div>

    <!-- Resultados -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Número Vale</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fecha</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Producto</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cantidad</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Recibido por</th>
              <th class="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">DNI</th>
              <th class="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Área</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <!-- Skeleton Loading -->
            <template v-if="loading">
              <tr v-for="i in 5" :key="`skeleton-${i}`">
                <td colspan="8" class="px-4 py-4">
                  <SkeletonLoader type="table-row" />
                </td>
              </tr>
            </template>

            <!-- Sin resultados -->
            <tr v-else-if="vales.length === 0">
              <td colspan="8" class="px-4 py-12">
                <div class="flex flex-col items-center justify-center text-center">
                  <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="text-gray-500 dark:text-gray-400 font-medium">No se encontraron vales de cargo</p>
                  <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Intenta ajustar los filtros de búsqueda
                  </p>
                </div>
              </td>
            </tr>

            <!-- Listado de vales -->
            <tr v-else v-for="vale in vales" :key="vale.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-4 py-3 text-sm">
                <span class="font-mono font-semibold text-orange-600 dark:text-orange-400">
                  {{ vale.numero_vale }}
                </span>
              </td>
              
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                {{ formatDate(vale.fecha_movimiento) }}
              </td>
              
              <td class="px-4 py-3 text-sm">
                <div>
                  <p class="font-medium text-gray-900 dark:text-gray-100">{{ vale.product?.nombre }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ vale.product?.codigo }}</p>
                </div>
              </td>
              
              <td class="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {{ vale.cantidad }} {{ vale.product?.unidad_medida }}
              </td>
              
              <td class="px-4 py-3 text-sm">
                <div>
                  <p class="font-medium text-gray-900 dark:text-gray-100">{{ vale.recibido_por }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ vale.cargo_receptor }}</p>
                </div>
              </td>
              
              <td class="hidden md:table-cell px-4 py-3 text-sm text-gray-600 dark:text-gray-400 font-mono">
                {{ vale.dni_receptor }}
              </td>
              
              <td class="hidden lg:table-cell px-4 py-3 text-sm">
                <span v-if="vale.area" class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-medium">
                  📍 {{ vale.area.codigo }}
                </span>
              </td>
              
              <td class="px-4 py-3 text-sm">
                <div class="flex gap-2">
                  <!-- Botón de descarga -->
                  <button
                    @click="descargarVale(vale.id, vale.numero_vale)"
                    :disabled="descargandoVale === vale.id"
                    class="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded transition disabled:opacity-50"
                    title="Descargar Vale PDF"
                  >
                    <svg v-if="descargandoVale === vale.id" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span v-else>📄</span>
                    Vale
                  </button>
                  
                  <!-- Botón de detalles (opcional) -->
                  <button
                    @click="verDetalles(vale)"
                    class="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition"
                    title="Ver detalles"
                  >
                    👁️ Ver
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="pagination.total > pagination.per_page" class="flex justify-between items-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Mostrando {{ pagination.from }} a {{ pagination.to }} de {{ pagination.total }} vales
      </p>
      <div class="flex gap-2">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="loadPage(page)"
          :class="[
            'px-3 py-1 rounded',
            page === pagination.current_page
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
          ]"
        >
          {{ page }}
        </button>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <div v-if="valeSeleccionado" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="border-b dark:border-gray-700 px-6 py-4 flex justify-between items-center bg-orange-50 dark:bg-orange-900/20">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            📄 Detalles del Vale {{ valeSeleccionado.numero_vale }}
          </h3>
          <button @click="valeSeleccionado = null" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-6 space-y-4">
          <!-- Información General -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Información General</h4>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p class="text-gray-600 dark:text-gray-400">Número de Vale</p>
                <p class="font-mono font-semibold text-orange-600 dark:text-orange-400">{{ valeSeleccionado.numero_vale }}</p>
              </div>
              <div>
                <p class="text-gray-600 dark:text-gray-400">Fecha</p>
                <p class="font-semibold text-gray-900 dark:text-white">{{ formatDate(valeSeleccionado.fecha_movimiento) }}</p>
              </div>
              <div>
                <p class="text-gray-600 dark:text-gray-400">Entregado por</p>
                <p class="font-semibold text-gray-900 dark:text-white">{{ valeSeleccionado.user?.nombre }}</p>
              </div>
              <div>
                <p class="text-gray-600 dark:text-gray-400">Área</p>
                <p class="font-semibold text-gray-900 dark:text-white">{{ valeSeleccionado.area?.nombre }}</p>
              </div>
            </div>
          </div>

          <!-- Producto -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Producto Entregado</h4>
            <div class="text-sm space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Código:</span>
                <span class="font-mono font-semibold text-gray-900 dark:text-white">{{ valeSeleccionado.product?.codigo }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Descripción:</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ valeSeleccionado.product?.nombre }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Cantidad:</span>
                <span class="font-bold text-orange-600 dark:text-orange-400">{{ valeSeleccionado.cantidad }} {{ valeSeleccionado.product?.unidad_medida }}</span>
              </div>
            </div>
          </div>

          <!-- Receptor -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Datos del Receptor</h4>
            <div class="text-sm space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Nombre:</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ valeSeleccionado.recibido_por }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">DNI:</span>
                <span class="font-mono font-semibold text-gray-900 dark:text-white">{{ valeSeleccionado.dni_receptor }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Cargo:</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ valeSeleccionado.cargo_receptor }}</span>
              </div>
              <div v-if="valeSeleccionado.observaciones_receptor">
                <span class="text-gray-600 dark:text-gray-400">Observaciones:</span>
                <p class="text-gray-900 dark:text-white mt-1">{{ valeSeleccionado.observaciones_receptor }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
          <button
            @click="valeSeleccionado = null"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white transition"
          >
            Cerrar
          </button>
          <button
            @click="descargarVale(valeSeleccionado.id, valeSeleccionado.numero_vale)"
            class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
          >
            📄 Descargar Vale
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { valesCargoService } from '../../services/valesCargo'
import { areasService } from '../../services/areas'
import SkeletonLoader from '../SkeletonLoader.vue'
import { useAlert } from '../../composables/useAlert'

const { success, error } = useAlert()

const vales = ref([])
const loading = ref(false)
const areas = ref([])
const descargandoVale = ref(null)
const valeSeleccionado = ref(null)

const filters = ref({
  numero_vale: '',
  recibido_por: '',
  area_id: '',
  fecha_desde: '',
  fecha_hasta: '',
  page: 1,
  per_page: 15
})

const pagination = ref({
  current_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0,
  last_page: 1
})

const visiblePages = computed(() => {
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const pages = []
  
  for (let i = Math.max(1, current - 2); i <= Math.min(last, current + 2); i++) {
    pages.push(i)
  }
  
  return pages
})

const formatDate = (dateString) => {
  if (!dateString) return 'Sin fecha'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Sin fecha'
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const loadAreas = async () => {
  try {
    const response = await areasService.getActivas()
    areas.value = response.data
  } catch (err) {
    // Silencioso, no es crítico
  }
}

const buscarVales = async () => {
  loading.value = true
  try {
    const params = {
      page: filters.value.page,
      per_page: filters.value.per_page,
      numero_vale: filters.value.numero_vale || undefined,
      recibido_por: filters.value.recibido_por || undefined,
      area_id: filters.value.area_id || undefined,
      fecha_desde: filters.value.fecha_desde || undefined,
      fecha_hasta: filters.value.fecha_hasta || undefined
    }
    
    const response = await valesCargoService.listar(params)
    vales.value = response.data.data.data || response.data.data || []
    
    const paginationData = response.data.data || response.data
    pagination.value = {
      current_page: paginationData.current_page || 1,
      per_page: paginationData.per_page || 15,
      total: paginationData.total || 0,
      from: paginationData.from || 0,
      to: paginationData.to || 0,
      last_page: paginationData.last_page || 1
    }
  } catch (err) {
    error('Error al buscar vales', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const limpiarFiltros = () => {
  filters.value = {
    numero_vale: '',
    recibido_por: '',
    area_id: '',
    fecha_desde: '',
    fecha_hasta: '',
    page: 1,
    per_page: 15
  }
  buscarVales()
}

const descargarVale = async (movimientoId, numeroVale) => {
  if (descargandoVale.value === movimientoId) return
  
  descargandoVale.value = movimientoId
  try {
    await valesCargoService.descargar(movimientoId, numeroVale)
    success('Vale descargado', `Vale ${numeroVale} descargado exitosamente`)
  } catch (err) {
    console.error('Error al descargar vale:', err)
    error('Error al descargar vale', err.response?.data?.message || 'No se pudo descargar el vale de cargo')
  } finally {
    descargandoVale.value = null
  }
}

const verDetalles = (vale) => {
  valeSeleccionado.value = vale
}

const loadPage = (page) => {
  filters.value.page = page
  buscarVales()
}

onMounted(() => {
  loadAreas()
  buscarVales()
})

// Exponer método para refrescar desde el padre
defineExpose({
  refresh: buscarVales
})
</script>
