<template>
  <div class="space-y-4">
    <!-- Filtros -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      <select
        v-model="filters.tipo"
        @change="loadMovimientos"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="">Todos los tipos</option>
        <option value="ENTRADA">Entradas</option>
        <option value="SALIDA">Salidas</option>
        <option value="AJUSTE">Ajustes</option>
      </select>

      <select
        v-model="filters.area_id"
        @change="loadMovimientos"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="">Todas las áreas</option>
        <option v-for="area in areas" :key="area.id" :value="area.id">
          {{ area.nombre }} ({{ area.codigo }})
        </option>
      </select>

      <input
        v-model="filters.fecha_desde"
        @change="loadMovimientos"
        type="date"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="Desde"
      />

      <input
        v-model="filters.fecha_hasta"
        @change="loadMovimientos"
        type="date"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="Hasta"
      />

      <button
        @click="clearFilters"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        Limpiar Filtros
      </button>
    </div>

    <!-- Tabla de movimientos -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fecha</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tipo</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Producto</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cantidad</th>
              <th class="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Área</th>
              <th class="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Stock</th>
              <th class="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Usuario</th>
              <th class="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Motivo</th>
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
            <tr v-else-if="movimientos.length === 0">
              <td colspan="8" class="px-4 py-12">
                <div class="flex flex-col items-center justify-center text-center">
                  <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="text-gray-500 dark:text-gray-400 font-medium">No se encontraron movimientos</p>
                  <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Los movimientos de entrada y salida aparecerán aquí
                  </p>
                </div>
              </td>
            </tr>
            <tr v-else v-for="movimiento in movimientos" :key="movimiento.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                <div>
                  <div class="flex items-center gap-1">
                    <p class="font-medium">{{ formatDate(movimiento.fecha_movimiento || movimiento.created_at) }}</p>
                    <span v-if="!movimiento.fecha_movimiento" class="text-xs text-yellow-600 dark:text-yellow-400" title="Movimiento anterior al sistema de fechas">*</span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400" :title="'Registrado: ' + formatDateTime(movimiento.created_at)">
                    Reg: {{ formatDate(movimiento.created_at) }}
                  </p>
                </div>
              </td>
              <td class="px-4 py-3 text-sm">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-semibold',
                    movimiento.tipo === 'ENTRADA' ? 'bg-green-100 text-green-800' :
                    movimiento.tipo === 'SALIDA' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  ]"
                >
                  {{ movimiento.tipo }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm">
                <div>
                  <p class="font-medium text-gray-900 dark:text-gray-100">{{ movimiento.product?.nombre }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ movimiento.product?.codigo }}</p>
                </div>
              </td>
              <td class="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {{ movimiento.cantidad }} {{ movimiento.product?.unidad_medida }}
              </td>
              <td class="hidden md:table-cell px-4 py-3 text-sm">
                <span v-if="movimiento.area" class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-medium">
                  📍 {{ movimiento.area.codigo }}
                </span>
                <span v-else class="text-gray-400 dark:text-gray-500 text-xs">-</span>
              </td>
              <td class="hidden lg:table-cell px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {{ movimiento.stock_anterior }} → {{ movimiento.stock_posterior }}
              </td>
              <td class="hidden md:table-cell hidden md:table-cell px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {{ movimiento.user?.nombre }}
              </td>
              <td class="hidden lg:table-cell px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {{ movimiento.motivo }}
              </td>
              <td class="px-4 py-3 text-sm">
                <!-- Botón de descarga de vale (solo para salidas con vale) -->
                <button
                  v-if="movimiento.tipo === 'SALIDA' && movimiento.numero_vale"
                  @click="descargarVale(movimiento.id, movimiento.numero_vale)"
                  class="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded transition"
                  title="Descargar Vale de Cargo"
                >
                  📄 Vale
                </button>
                <span v-else class="text-gray-400 dark:text-gray-500 text-xs">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="pagination.total > pagination.per_page" class="flex justify-between items-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Mostrando {{ pagination.from }} a {{ pagination.to }} de {{ pagination.total }} movimientos
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
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { movementsService } from '../../services/movements'
import { areasService } from '../../services/areas'
import { valesCargoService } from '../../services/valesCargo'
import SkeletonLoader from '../SkeletonLoader.vue'
import { useAlert } from '../../composables/useAlert'

const { success, error } = useAlert()
const descargandoVale = ref(null)

const movimientos = ref([])
const loading = ref(false)
const areas = ref([])

const filters = ref({
  tipo: '',
  area_id: '',
  fecha_desde: '',
  fecha_hasta: '',
  page: 1
})
const pagination = ref({
  current_page: 1,
  per_page: 50,
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

const formatDateTime = (dateString) => {
  if (!dateString) return 'Sin fecha'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Sin fecha'
  return date.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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

const loadMovimientos = async () => {
  loading.value = true
  try {
    const params = {
      page: filters.value.page,
      tipo: filters.value.tipo || undefined,
      area_id: filters.value.area_id || undefined,
      fecha_desde: filters.value.fecha_desde || undefined,
      fecha_hasta: filters.value.fecha_hasta || undefined
    }
    const response = await movementsService.getAll(params)
    movimientos.value = response.data.data.data || response.data.data || []
    
    const paginationData = response.data.data || response.data
    pagination.value = {
      current_page: paginationData.current_page || 1,
      per_page: paginationData.per_page || 20,
      total: paginationData.total || 0,
      from: paginationData.from || 0,
      to: paginationData.to || 0,
      last_page: paginationData.last_page || 1
    }
  } catch (err) {
    error('Error al cargar movimientos', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  filters.value = {
    tipo: '',
    area_id: '',
    fecha_desde: '',
    fecha_hasta: '',
    page: 1
  }
  loadMovimientos()
}

const descargarVale = async (movimientoId, numeroVale) => {
  if (descargandoVale.value === movimientoId) return
  
  descargandoVale.value = movimientoId
  try {
    // Usar el nuevo endpoint que descarga el PDF guardado
    await valesCargoService.descargar(movimientoId, numeroVale)
    success('Vale descargado', `Vale ${numeroVale} descargado exitosamente`)
  } catch (err) {
    console.error('Error al descargar vale:', err)
    error('Error al descargar vale', err.response?.data?.message || 'No se pudo descargar el vale de cargo')
  } finally {
    descargandoVale.value = null
  }
}

const loadPage = (page) => {
  filters.value.page = page
  loadMovimientos()
}

onMounted(() => {
  loadAreas()
  loadMovimientos()
})

// Exponer método para refrescar desde el padre
defineExpose({
  refresh: loadMovimientos
})
</script>
