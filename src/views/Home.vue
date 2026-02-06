<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">📊 Dashboard - Sistema de Inventario</h1>
        <div class="flex items-center gap-2 mt-1">
          <p class="text-gray-600 dark:text-gray-400">Panel de control y estadísticas generales</p>
          <span v-if="ultimaActualizacion" class="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
            • Actualizado: {{ ultimaActualizacion }}
          </span>
        </div>
      </div>
      <button
        @click="cargarDashboard(true)"
        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
        :disabled="loading"
      >
        <svg class="w-5 h-5" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Actualizar
      </button>
    </div>

    <!-- Loading Skeletons -->
    <div v-if="loading">
      <!-- Skeleton Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <SkeletonLoader v-for="i in 6" :key="i" type="dashboard-card" />
      </div>
      <!-- Skeleton Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonLoader type="card" />
        <SkeletonLoader type="card" />
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="data">
      <!-- Tarjetas de Estadísticas -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <!-- Total Productos -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-blue-500 transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Productos</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ data.estadisticas.total_productos }}</p>
            </div>
            <div class="text-4xl">📦</div>
          </div>
        </div>

        <!-- Stock Bajo -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-yellow-500 transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Stock Bajo</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ data.estadisticas.productos_stock_bajo }}</p>
            </div>
            <div class="text-4xl">⚠️</div>
          </div>
        </div>

        <!-- Por Vencer -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Por Vencer (30d)</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ data.estadisticas.productos_por_vencer }}</p>
            </div>
            <div class="text-4xl">⏰</div>
          </div>
        </div>

        <!-- Movimientos Hoy -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-indigo-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Movimientos Hoy</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ data.estadisticas.movimientos_hoy }}</p>
            </div>
            <div class="text-4xl">🔄</div>
          </div>
        </div>

        <!-- Entradas Hoy -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Entradas Hoy</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ data.estadisticas.entradas_hoy }}</p>
            </div>
            <div class="text-4xl">📥</div>
          </div>
        </div>

        <!-- Salidas Hoy -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-red-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Salidas Hoy</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ data.estadisticas.salidas_hoy }}</p>
            </div>
            <div class="text-4xl">📤</div>
          </div>
        </div>
      </div>

      <!-- Tablas Dinámicas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Productos Próximos a Vencer -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              📅 Productos Próximos a Vencer
            </h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Producto</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Stock</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Vencimiento</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Días</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="data.productos_proximos_vencer.length === 0">
                  <td colspan="4" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No hay productos próximos a vencer
                  </td>
                </tr>
                <tr 
                  v-else
                  v-for="prod in data.productos_proximos_vencer" 
                  :key="prod.id"
                  :class="{ 'bg-red-50 dark:bg-red-900/20': prod.urgente }"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td class="px-4 py-3">
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ prod.nombre }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ prod.codigo }}</p>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {{ prod.stock_actual }} {{ prod.unidad_medida }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {{ prod.fecha_vencimiento }}
                  </td>
                  <td class="px-4 py-3">
                    <span 
                      :class="[
                        'px-2 py-1 text-xs font-semibold rounded-full',
                        prod.urgente 
                          ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' 
                          : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
                      ]"
                    >
                      {{ prod.dias_restantes }} días
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Productos con Stock Bajo -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              📉 Productos con Stock Bajo
            </h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Producto</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actual</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Mínimo</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nivel</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="data.productos_stock_bajo.length === 0">
                  <td colspan="4" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No hay productos con stock bajo
                  </td>
                </tr>
                <tr 
                  v-else
                  v-for="prod in data.productos_stock_bajo" 
                  :key="prod.id"
                  :class="{ 'bg-red-50 dark:bg-red-900/20': prod.critico }"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td class="px-4 py-3">
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ prod.nombre }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ prod.codigo }}</p>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {{ prod.stock_actual }} {{ prod.unidad_medida }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {{ prod.stock_minimo }} {{ prod.unidad_medida }}
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          class="h-full"
                          :class="prod.critico ? 'bg-red-600' : 'bg-yellow-500'"
                          :style="{ width: `${Math.min(prod.porcentaje_stock, 100)}%` }"
                        ></div>
                      </div>
                      <span class="text-xs text-gray-600 dark:text-gray-400 min-w-[40px]">
                        {{ prod.porcentaje_stock.toFixed(0) }}%
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Últimas Entradas -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              📥 Últimas Entradas
            </h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Producto</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cantidad</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Usuario</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fecha</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="data.ultimas_entradas.length === 0">
                  <td colspan="4" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No hay entradas registradas
                  </td>
                </tr>
                <tr 
                  v-else
                  v-for="entrada in data.ultimas_entradas" 
                  :key="entrada.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td class="px-4 py-3">
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ entrada.producto_nombre }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ entrada.producto_codigo }}</p>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                      +{{ entrada.cantidad }} {{ entrada.unidad_medida }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {{ entrada.usuario }}
                  </td>
                  <td class="px-4 py-3">
                    <div class="text-sm text-gray-900 dark:text-white">{{ entrada.fecha }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ entrada.fecha_relativa }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Últimas Salidas -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              📤 Últimas Salidas
            </h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Producto</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cantidad</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Área</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fecha</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="data.ultimas_salidas.length === 0">
                  <td colspan="4" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No hay salidas registradas
                  </td>
                </tr>
                <tr 
                  v-else
                  v-for="salida in data.ultimas_salidas" 
                  :key="salida.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td class="px-4 py-3">
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ salida.producto_nombre }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ salida.producto_codigo }}</p>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300">
                      -{{ salida.cantidad }} {{ salida.unidad_medida }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div v-if="salida.area_destino">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">📍 {{ salida.area_destino }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">({{ salida.area_codigo }})</p>
                    </div>
                    <span v-else class="text-sm text-gray-400 dark:text-gray-500">-</span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="text-sm text-gray-900 dark:text-white">{{ salida.fecha }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ salida.fecha_relativa }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-20">
      <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Error al cargar el dashboard</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Intenta recargar la página</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { dashboardService } from '../services/dashboard'
import { useAlert } from '../composables/useAlert'
import { useCache } from '../composables/useCache'
import SkeletonLoader from '../components/SkeletonLoader.vue'

const { error } = useAlert()
const { getCachedData, invalidateCache } = useCache(30000) // TTL: 30 segundos

const loading = ref(false)
const data = ref(null)
const ultimaActualizacion = ref(null)
let intervalId = null

// Función handler para el evento de refresh
const handleDashboardRefresh = () => {
  console.log('🔄 Evento dashboard-refresh recibido, actualizando...')
  cargarDashboard(true) // Forzar refresh sin caché
}

const formatearTiempo = () => {
  const now = new Date()
  return now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const cargarDashboard = async (forceRefresh = false) => {
  loading.value = true
  try {
    const response = await getCachedData(
      'dashboard',
      async () => {
        const res = await dashboardService.getDashboard()
        return res.data.data
      },
      {},
      30000, // TTL: 30 segundos
      forceRefresh
    )
    data.value = response
    ultimaActualizacion.value = formatearTiempo()
  } catch (err) {
    error('Error al cargar dashboard', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarDashboard()
  
  // Actualizar cada 30 segundos automáticamente
  intervalId = setInterval(() => {
    cargarDashboard(false) // Usar caché si está disponible
  }, 30000) // 30000ms = 30 segundos
  
  // Escuchar evento personalizado de actualización de movimientos
  window.addEventListener('dashboard-refresh', handleDashboardRefresh)
  console.log('✅ Listener de dashboard-refresh registrado')
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
  // Remover listener de evento
  window.removeEventListener('dashboard-refresh', handleDashboardRefresh)
  console.log('🗑️ Listener de dashboard-refresh removido')
})
</script>
