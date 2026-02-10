<template>
  <div class="space-y-4">
    <!-- Filtros y búsqueda -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="flex-1 relative">
        <input
          v-model="searchQuery"
          @input="debouncedSearch"
          type="text"
          placeholder="Buscar por nombre o código..."
          class="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <button
          v-if="searchQuery"
          @click="limpiarBusqueda"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          title="Limpiar búsqueda"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <select
        v-model="filters.stock_type_id"
        @change="loadProductos"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="">Todos los tipos</option>
        <option v-for="tipo in stockTypes" :key="tipo.id" :value="tipo.id">
          {{ tipo.nombre }}
        </option>
      </select>
      <select
        v-model="filters.section_id"
        @change="loadProductos"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="">Todas las secciones</option>
        <option v-for="seccion in sections" :key="seccion.id" :value="seccion.id">
          {{ seccion.nombre }}
        </option>
      </select>
      <button
        v-if="canCreate"
        @click="openCreateModal"
        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 whitespace-nowrap"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nuevo Producto
      </button>
    </div>

    <!-- Filtros adicionales -->
    <div class="flex flex-wrap gap-2">
      <button
        @click="toggleStockBajo"
        :class="[
          'px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition',
          filters.stock_bajo ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        ]"
      >
        Solo Stock Bajo
      </button>
      <button
        @click="toggleProximosVencer"
        :class="[
          'px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1',
          filters.proximos_vencer ? 'bg-orange-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        ]"
      >
        <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="hidden sm:inline">Próximos a Vencer</span>
        <span class="sm:hidden">Prox. Vencer</span>
      </button>

      <!-- Separador -->
      <div class="hidden sm:block border-l border-gray-300 dark:border-gray-600 mx-2"></div>

      <!-- Movimientos Masivos -->
      <button
        v-if="canEntry"
        @click="openEntradaMasivaModal"
        class="px-2.5 sm:px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 sm:gap-2"
      >
        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
        <span class="hidden sm:inline">Entrada Masiva</span>
        <span class="inline sm:hidden">Entrada</span>
      </button>
      <button
        v-if="canExit"
        @click="openSalidaMasivaModal"
        class="px-2.5 sm:px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 sm:gap-2"
      >
        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
        <span class="hidden sm:inline">Salida Masiva</span>
        <span class="inline sm:hidden">Salida</span>
      </button>
    </div>

    <!-- Tabla de productos -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Código</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Producto</th>
              <th class="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sección</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Stock</th>
              <th class="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Stock Mínimo</th>
              <th class="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Depósito / Ubicación</th>
              <th class="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Vencimiento</th>
              <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Acciones</th>
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
            <tr v-else-if="allProductos.length === 0">
              <td colspan="8" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">No se encontraron productos</td>
            </tr>
            <tr v-else v-for="producto in paginatedProductos" :key="producto.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-3 py-3 text-xs font-mono text-gray-900 dark:text-gray-100">{{ producto.codigo }}</td>
              <td class="px-3 py-4">
                <div class="flex flex-col gap-2">
                  <!-- Nombre del producto -->
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ producto.nombre }}</span>
                  
                  <!-- Info adicional visible solo en móvil -->
                  <div class="md:hidden space-y-1.5">
                    <!-- Sección -->
                    <div v-if="producto.section?.nombre" class="flex items-center gap-1.5 text-xs">
                      <span class="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-md font-medium">
                        {{ producto.section.nombre }}
                      </span>
                    </div>
                    
                    <!-- Stock mínimo -->
                    <div class="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span>Mínimo: <span class="font-medium">{{ producto.stock_minimo }}</span></span>
                    </div>
                    
                    <!-- Depósito y Ubicación -->
                    <div v-if="producto.deposito?.nombre || producto.ubicacion" class="space-y-1">
                      <div v-if="producto.deposito?.nombre" class="flex items-start gap-1.5 text-xs">
                        <svg class="w-3.5 h-3.5 mt-0.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                        <span class="text-blue-600 dark:text-blue-400 font-medium leading-tight">{{ producto.deposito.nombre }}</span>
                      </div>
                      <div v-if="producto.ubicacion" class="flex items-center gap-1.5 text-xs ml-5">
                        <svg class="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span class="text-gray-600 dark:text-gray-400">{{ producto.ubicacion }}</span>
                      </div>
                    </div>
                    
                    <!-- Vencimiento -->
                    <div v-if="producto.tiene_vencimiento && producto.fecha_vencimiento" class="flex items-center gap-1.5">
                      <span 
                        :class="[
                          'px-2 py-1 rounded-md text-xs font-medium inline-flex items-center gap-1',
                          getVencimientoClass(producto.fecha_vencimiento)
                        ]"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ formatDate(producto.fecha_vencimiento) }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="hidden sm:table-cell px-4 py-3 text-sm">
                <span class="text-gray-600 dark:text-gray-400">{{ producto.section?.nombre }}</span>
              </td>
              <td class="px-3 py-4 text-sm">
                <div class="flex flex-col items-start gap-1">
                  <span 
                    :class="[
                      'font-bold text-base',
                      producto.stock_actual <= producto.stock_minimo ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                    ]"
                  >
                    {{ producto.stock_actual }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">
                    {{ producto.unidad_medida }}
                  </span>
                </div>
              </td>
              <td class="hidden md:table-cell px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ producto.stock_minimo }}</td>
              <td class="hidden md:table-cell px-4 py-3 text-sm">
                <div class="flex flex-col gap-0.5">
                  <!-- Depósito -->
                  <span v-if="producto.deposito?.nombre" class="text-gray-900 dark:text-gray-100 font-medium flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                    {{ producto.deposito.nombre }}
                  </span>
                  <!-- Ubicación específica -->
                  <span v-if="producto.ubicacion" class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 ml-4">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ producto.ubicacion }}
                  </span>
                  <!-- Solo ubicación sin depósito -->
                  <span v-else-if="!producto.deposito?.nombre && producto.ubicacion" class="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ producto.ubicacion }}
                  </span>
                  <!-- Sin información -->
                  <span v-if="!producto.deposito?.nombre && !producto.ubicacion" class="text-gray-400 dark:text-gray-500">
                    Sin ubicación
                  </span>
                </div>
              </td>
              <td class="hidden md:table-cell px-4 py-3 text-sm">
                <span v-if="producto.tiene_vencimiento && producto.fecha_vencimiento" 
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    getVencimientoClass(producto.fecha_vencimiento)
                  ]"
                >
                  {{ formatDate(producto.fecha_vencimiento) }}
                </span>
                <span v-else class="text-gray-400 dark:text-gray-500">-</span>
              </td>
              <td class="px-2 py-3 text-sm">
                <div class="flex gap-1 md:gap-2">
                  <button
                    v-if="canEntry"
                    @click="openEntryModal(producto)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                    title="Entrada"
                  >
                    <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  </button>
                  <button
                    v-if="canExit"
                    @click="openExitModal(producto)"
                    class="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 p-1"
                    title="Salida"
                  >
                    <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                    </svg>
                  </button>
                  <button
                    v-if="canEdit"
                    @click="openEditModal(producto)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                    title="Editar"
                  >
                    <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="viewHistory(producto)"
                    class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 p-1"
                    title="Historial"
                  >
                    <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    v-if="canDelete"
                    @click="deleteProducto(producto)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                    title="Eliminar"
                  >
                    <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="pagination.total > 0" class="flex justify-between items-center border-t dark:border-gray-700 pt-4">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ pagination.from || 0 }} to {{ pagination.to || 0 }} of {{ pagination.total }} results
      </p>
      <div v-if="pagination.last_page > 1" class="flex gap-1 items-center">
        <button
          @click="loadPage(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          :class="[
            'px-3 py-2 rounded border transition-colors',
            pagination.current_page === 1
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 cursor-not-allowed'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <template v-for="(page, index) in visiblePages" :key="`page-${page}-${index}`">
          <span
            v-if="page === '...'"
            class="px-3 py-2 text-gray-400 dark:text-gray-500"
          >
            ...
          </span>
          <button
            v-else
            @click="loadPage(page)"
            :class="[
              'px-4 py-2 rounded border transition-colors min-w-[40px]',
              page === pagination.current_page
                ? 'bg-blue-600 text-white border-blue-600 font-medium'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            ]"
          >
            {{ page }}
          </button>
        </template>
        
        <button
          @click="loadPage(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          :class="[
            'px-3 py-2 rounded border transition-colors',
            pagination.current_page === pagination.last_page
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 cursor-not-allowed'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Modales -->
    <ProductoModal
      v-if="showModal"
      :producto="selectedProducto"
      :stockTypes="stockTypes"
      :sections="sections"
      @close="closeModal"
      @save="handleSave"
    />

    <MovimientoModal
      v-if="showMovimientoModal"
      :producto="selectedProducto"
      :tipo="movimientoTipo"
      @close="closeMovimientoModal"
      @save="handleMovimiento"
    />

    <HistorialModal
      v-if="showHistorialModal"
      :producto="selectedProducto"
      @close="closeHistorialModal"
    />

    <MovimientosMasivosModal
      v-if="showMovimientosMasivosModal"
      :tipo="movimientosMasivosTipo"
      @close="closeMovimientosMasivosModal"
      @save="handleMovimientosMasivos"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { productsService } from '../../services/products'
import SkeletonLoader from '../SkeletonLoader.vue'
import { stockTypesService } from '../../services/stockTypes'
import { sectionsService } from '../../services/sections'
import { depositosService } from '../../services/depositos'
import { useAlert } from '../../composables/useAlert'
import { useCache } from '../../composables/useCache'
import ProductoModal from './ProductoModal.vue'
import MovimientoModal from './MovimientoModal.vue'
import HistorialModal from './HistorialModal.vue'
import MovimientosMasivosModal from './MovimientosMasivosModal.vue'

const emit = defineEmits(['alerts-updated', 'movimiento-created'])

const authStore = useAuthStore()
const { success, error, confirm } = useAlert()
const { getCachedData, invalidateCache } = useCache(60000) // TTL: 1 minuto

const productos = ref([])
const allProductos = ref([])
const stockTypes = ref([])
const sections = ref([])
const depositos = ref([])
const loading = ref(false)
const searchQuery = ref('')

// Intentar restaurar filtros guardados
const savedFilters = localStorage.getItem('productos_filters')
const filters = ref(savedFilters ? JSON.parse(savedFilters) : {
  stock_type_id: '',
  section_id: '',
  stock_bajo: false,
  proximos_vencer: false,
  page: 1
})
const pagination = ref({
  current_page: 1,
  per_page: 10,
  total: 0,
  from: 0,
  to: 0,
  last_page: 1
})

// Paginación del lado del cliente
const paginatedProductos = computed(() => {
  const start = (pagination.value.current_page - 1) * pagination.value.per_page
  const end = start + pagination.value.per_page
  return allProductos.value.slice(start, end)
})

const showModal = ref(false)
const selectedProducto = ref(null)
const showMovimientoModal = ref(false)
const movimientoTipo = ref('')
const showHistorialModal = ref(false)
const showMovimientosMasivosModal = ref(false)
const movimientosMasivosTipo = ref('')

// Permisos
const canCreate = computed(() => authStore.hasPermission('inventario.crear'))
const canEdit = computed(() => authStore.hasPermission('inventario.editar'))
const canDelete = computed(() => authStore.hasPermission('inventario.eliminar'))
const canEntry = computed(() => authStore.hasPermission('inventario.entrada'))
const canExit = computed(() => authStore.hasPermission('inventario.salida'))

const visiblePages = computed(() => {
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const pages = []
  
  if (last <= 7) {
    // Si hay 7 páginas o menos, mostrar todas
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    // Siempre mostrar la primera página
    pages.push(1)
    
    if (current > 3) {
      pages.push('...')
    }
    
    // Páginas alrededor de la actual
    const start = Math.max(2, current - 1)
    const end = Math.min(last - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }
    
    if (current < last - 2) {
      pages.push('...')
    }
    
    // Siempre mostrar la última página
    if (!pages.includes(last)) {
      pages.push(last)
    }
  }
  
  return pages
})

let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  // Al buscar, invalidar caché para obtener resultados frescos
  invalidateCache('productos')
  searchTimeout = setTimeout(() => {
    filters.value.page = 1
    loadProductos()
  }, 500)
}

const limpiarBusqueda = () => {
  searchQuery.value = ''
  filters.value.page = 1
  loadProductos()
}

const loadProductos = async (forceRefresh = false) => {
  loading.value = true
  try {
    // Si hay búsqueda activa, forzar refresh
    const shouldRefresh = forceRefresh || !!searchQuery.value
    
    // Construir parámetros
    const params = {
      page: 1,
      per_page: 100,
      stock_type_id: filters.value.stock_type_id || undefined,
      section_id: filters.value.section_id || undefined,
      stock_bajo: filters.value.stock_bajo || undefined,
      search: searchQuery.value || undefined,
      order_by: 'created_at',
      order_dir: 'desc'
      // No incluir 'with' porque el backend no lo procesa, haré el match en el frontend
    }
    
    console.log('🔍 PARÁMETROS ENVIADOS:', params)
    
    // Usar caché
    const allData = await getCachedData(
      'productos',
      async (p) => {
        const response = await productsService.getAll(p)
        console.log('📦 RESPUESTA COMPLETA PRODUCTOS:', response)
        
        const paginationInfo = response.data.data
        let data = [...(paginationInfo.data || [])]
        
        // Si hay más páginas, obtenerlas todas
        if (paginationInfo.last_page > 1) {
          const promises = []
          for (let page = 2; page <= paginationInfo.last_page; page++) {
            promises.push(productsService.getAll({ ...p, page }))
          }
          
          const responses = await Promise.all(promises)
          responses.forEach(resp => {
            data = [...data, ...(resp.data.data.data || [])]
          })
        }
        
        // Ordenar por ID descendente
        data.sort((a, b) => b.id - a.id)
        
        // Asignar depósitos manualmente desde el array cargado
        data = data.map(producto => {
          if (producto.deposito_id && depositos.value.length > 0) {
            const deposito = depositos.value.find(d => d.id === producto.deposito_id)
            return {
              ...producto,
              deposito: deposito || null
            }
          }
          return producto
        })
        
        return data
      },
      params,
      60000, // TTL: 1 minuto
      shouldRefresh
    )
    
    productos.value = allData
    
    // Debug: Verificar si los depósitos se están cargando
    if (allData.length > 0) {
      console.log('🏢 PRIMER PRODUCTO CON DEPOSITO:', {
        codigo: allData[0].codigo,
        nombre: allData[0].nombre,
        deposito_id: allData[0].deposito_id,
        deposito: allData[0].deposito,
        ubicacion: allData[0].ubicacion
      })
    }
    
    // Si hay filtro de próximos a vencer, aplicarlo
    if (filters.value.proximos_vencer) {
      allProductos.value = allData
      applyFilters()
    } else {
      allProductos.value = allData
      
      // Paginación del lado del cliente (10 por página)
      const total = allProductos.value.length
      const lastPage = Math.ceil(total / 10)
      const currentPage = filters.value.page > lastPage ? 1 : filters.value.page
      
      pagination.value = {
        current_page: currentPage,
        per_page: 10,
        total: total,
        from: total > 0 ? ((currentPage - 1) * 10) + 1 : 0,
        to: Math.min(currentPage * 10, total),
        last_page: lastPage
      }
    }
    
    console.log('📄 PAGINACIÓN:', pagination.value)
    
    emit('alerts-updated')
  } catch (err) {
    error('Error al cargar productos', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const loadStockTypes = async () => {
  try {
    const response = await stockTypesService.getAll()
    stockTypes.value = response.data.data
  } catch (err) {
    console.warn('⚠️ No se pudieron cargar tipos de stock:', err.message)
    stockTypes.value = [] // Continuar con array vacío
  }
}

const loadSections = async () => {
  try {
    const response = await sectionsService.getAll()
    sections.value = response.data.data
  } catch (err) {
    console.warn('⚠️ No se pudieron cargar secciones:', err.message)
    sections.value = [] // Continuar con array vacío
  }
}

const loadDepositos = async () => {
  try {
    const response = await depositosService.getAll()
    depositos.value = response.data.data || []
    console.log('🏢 DEPÓSITOS CARGADOS:', depositos.value.length)
  } catch (err) {
    console.warn('⚠️ No se pudieron cargar depósitos:', err.message)
    depositos.value = []
  }
}

const toggleStockBajo = () => {
  filters.value.stock_bajo = !filters.value.stock_bajo
  filters.value.page = 1
  loadProductos()
}

// Método para activar filtro desde componente padre
const activarFiltroStockBajo = () => {
  if (!filters.value.stock_bajo) {
    filters.value.stock_bajo = true
    filters.value.page = 1
    loadProductos()
  }
}

const toggleProximosVencer = () => {
  filters.value.proximos_vencer = !filters.value.proximos_vencer
  filters.value.page = 1
  pagination.value.current_page = 1
  applyFilters()
}

const applyFilters = () => {
  let filtered = [...productos.value]
  
  // Filtrar próximos a vencer (30 días)
  if (filters.value.proximos_vencer) {
    const today = new Date()
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(today.getDate() + 30)
    
    filtered = filtered.filter(p => {
      if (!p.tiene_vencimiento || !p.fecha_vencimiento) return false
      const vencimiento = new Date(p.fecha_vencimiento)
      return vencimiento >= today && vencimiento <= thirtyDaysFromNow
    })
  }
  
  allProductos.value = filtered
  
  // Actualizar paginación
  const total = filtered.length
  const lastPage = Math.ceil(total / pagination.value.per_page)
  pagination.value = {
    ...pagination.value,
    total,
    last_page: lastPage,
    from: (pagination.value.current_page - 1) * pagination.value.per_page + 1,
    to: Math.min(pagination.value.current_page * pagination.value.per_page, total)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  
  try {
    // Extraer solo la parte de la fecha YYYY-MM-DD
    const fechaSolo = dateString.split(' ')[0]
    const [year, month, day] = fechaSolo.split('-')
    
    // Validar que los valores sean números válidos
    if (!year || !month || !day) return '-'
    
    // Crear fecha usando componentes individuales (evita zona horaria)
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    
    // Verificar que la fecha sea válida
    if (isNaN(date.getTime())) return '-'
    
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch (error) {
    console.error('Error formateando fecha:', dateString, error)
    return '-'
  }
}

const getVencimientoClass = (fechaVencimiento) => {
  if (!fechaVencimiento) return ''
  
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Extraer solo la parte de la fecha YYYY-MM-DD
    const fechaSolo = fechaVencimiento.split(' ')[0]
    const [year, month, day] = fechaSolo.split('-')
    
    // Validar que los valores sean números válidos
    if (!year || !month || !day) return ''
    
    // Crear fecha usando componentes individuales (evita zona horaria)
    const vencimiento = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    vencimiento.setHours(0, 0, 0, 0)
    
    // Verificar que la fecha sea válida
    if (isNaN(vencimiento.getTime())) return ''
    
    const diffDays = Math.ceil((vencimiento - today) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return 'bg-red-100 text-red-800' // Vencido
    } else if (diffDays <= 7) {
      return 'bg-red-100 text-red-700' // Vence en 7 días o menos
    } else if (diffDays <= 30) {
      return 'bg-orange-100 text-orange-700' // Vence en 30 días o menos
    } else {
      return 'bg-green-100 text-green-700' // Más de 30 días
    }
  } catch (error) {
    console.error('Error calculando vencimiento:', fechaVencimiento, error)
    return ''
  }
}

const loadPage = (page) => {
  filters.value.page = page
  loadProductos()
}

const openCreateModal = () => {
  selectedProducto.value = null
  showModal.value = true
}

const openEditModal = (producto) => {
  selectedProducto.value = { ...producto }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedProducto.value = null
}

const handleSave = async () => {
  closeModal()
  // Invalidar caché y recargar para ver el nuevo/editado producto
  invalidateCache('productos')
  // Ir a la primera página para ver el nuevo producto
  filters.value.page = 1
  pagination.value.current_page = 1
  await loadProductos(true)
}

const openEntryModal = (producto) => {
  selectedProducto.value = producto
  movimientoTipo.value = 'entrada'
  showMovimientoModal.value = true
}

const openExitModal = (producto) => {
  selectedProducto.value = producto
  movimientoTipo.value = 'salida'
  showMovimientoModal.value = true
}

const closeMovimientoModal = () => {
  showMovimientoModal.value = false
  selectedProducto.value = null
  movimientoTipo.value = ''
}

const handleMovimiento = async () => {
  closeMovimientoModal()
  // Invalidar caché ya que el stock cambió
  invalidateCache('productos')
  await loadProductos(true)
  // Notificar al padre que hubo un movimiento
  emit('movimiento-created')
}

const viewHistory = (producto) => {
  selectedProducto.value = producto
  showHistorialModal.value = true
}

const closeHistorialModal = () => {
  showHistorialModal.value = false
  selectedProducto.value = null
}

const openEntradaMasivaModal = () => {
  movimientosMasivosTipo.value = 'entrada'
  showMovimientosMasivosModal.value = true
}

const openSalidaMasivaModal = () => {
  movimientosMasivosTipo.value = 'salida'
  showMovimientosMasivosModal.value = true
}

const closeMovimientosMasivosModal = () => {
  showMovimientosMasivosModal.value = false
  movimientosMasivosTipo.value = ''
}

const handleMovimientosMasivos = async (result) => {
  closeMovimientosMasivosModal()
  // Invalidar caché ya que el stock cambió
  invalidateCache('productos')
  invalidateCache('movements')
  invalidateCache('dashboard')
  await loadProductos(true)
  
  // Emitir evento para actualizar alertas si hay productos con stock bajo
  if (result.alertas_stock_bajo && result.alertas_stock_bajo.length > 0) {
    emit('alerts-updated')
  }
  
  // Notificar al padre que hubo movimientos
  emit('movimiento-created')
}

const deleteProducto = async (producto) => {
  if (!await confirm(`¿Estás seguro de eliminar el producto ${producto.nombre}?`)) return
  
  try {
    await productsService.delete(producto.id)
    success('Producto eliminado', 'El producto ha sido eliminado correctamente')
    // Invalidar caché y recargar
    invalidateCache('productos')
    await loadProductos(true)
  } catch (err) {
    error('Error al eliminar', err.response?.data?.message || err.message)
  }
}

onMounted(async () => {
  // Cargar depósitos primero, luego productos para poder hacer el match
  await loadDepositos()
  await loadStockTypes()
  await loadSections()
  // Forzar refresh para cargar productos con relación de depósito
  loadProductos(true)
})

// Guardar filtros cuando cambien
watch(filters, (newFilters) => {
  localStorage.setItem('productos_filters', JSON.stringify(newFilters))
}, { deep: true })

onBeforeUnmount(() => {
  // Limpiar timeout de búsqueda pendiente
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})

// Exponer métodos al componente padre
defineExpose({
  activarFiltroStockBajo
})
</script>
