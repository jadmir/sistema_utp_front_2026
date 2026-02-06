<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Encabezado -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Sistema de Inventario</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">Gestiona productos, stock y movimientos</p>
      </div>
      
      <!-- Alertas de stock bajo -->
      <button 
        v-if="stockAlerts > 0" 
        @click="verStockBajo"
        class="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-red-200 dark:hover:bg-red-900/50 transition cursor-pointer shadow-sm hover:shadow-md"
        title="Click para ver productos con stock bajo"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <span class="font-semibold">{{ stockAlerts }} productos con stock bajo</span>
          <span class="text-xs font-normal hidden sm:inline">Click para filtrar</span>
        </div>
        <svg class="w-4 h-4 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Tabs -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="flex -mb-px overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition',
              activeTab === tab.id
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            ]"
          >
            <span class="flex items-center gap-2">
              <component :is="tab.icon" class="w-5 h-5" />
              {{ tab.name }}
              <span v-if="tab.count !== undefined" class="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                {{ tab.count }}
              </span>
            </span>
          </button>
        </nav>
      </div>

      <!-- Contenido de los tabs -->
      <div class="p-4 sm:p-6">
        <!-- Tab Productos -->
        <div v-show="activeTab === 'productos'">
          <ProductosTab ref="productosTabRef" @alerts-updated="loadStockAlerts" />
        </div>

        <!-- Tab Categorías -->
        <div v-show="activeTab === 'tipos'">
          <TiposStockTab />
        </div>

        <!-- Tab Secciones -->
        <div v-show="activeTab === 'secciones'">
          <SeccionesTab />
        </div>

        <!-- Tab Áreas -->
        <div v-show="activeTab === 'areas'">
          <AreasTab />
        </div>

        <!-- Tab Movimientos -->
        <div v-show="activeTab === 'movimientos'">
          <MovimientosTab />
        </div>

        <!-- Tab Reportes -->
        <div v-show="activeTab === 'reportes'">
          <ReportesTab />
        </div>

        <!-- Tab Plantillas de Entrega -->
        <div v-show="activeTab === 'plantillas'">
          <PlantillasTab />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, h } from 'vue'
import { productsService } from '../services/products'
import ProductosTab from '../components/inventory/ProductosTab.vue'
import TiposStockTab from '../components/inventory/TiposStockTab.vue'
import SeccionesTab from '../components/inventory/SeccionesTab.vue'
import AreasTab from '../components/inventory/AreasTab.vue'
import MovimientosTab from '../components/inventory/MovimientosTab.vue'
import ReportesTab from '../components/inventory/ReportesTab.vue'
import PlantillasTab from '../components/inventory/PlantillasTab.vue'
import { usePermissions } from '../composables/usePermissions'
import { logger } from '../utils/logger'

const activeTab = ref('productos')
const stockAlerts = ref(0)
const productosTabRef = ref(null)
const { hasPermission, isAdmin } = usePermissions()

const tabs = computed(() => {
  const allTabs = [
    { 
      id: 'productos', 
      name: 'Productos',
      permission: 'inventario.ver',
      icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' })
      ])
    },
    { 
      id: 'tipos', 
      name: 'Categorías',
      permission: 'inventario.ver',
      icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' })
      ])
    },
    { 
      id: 'secciones', 
      name: 'Tipos de Artículos',
      permission: 'inventario.ver',
      icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' })
      ])
    },
    { 
      id: 'areas', 
      name: 'Áreas',
      permission: 'inventario.ver',
      icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' }),
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z' })
      ])
    },
    { 
      id: 'movimientos', 
      name: 'Movimientos',
      permission: 'inventario.ver',
      icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' })
      ])
    },
    { 
      id: 'reportes', 
      name: 'Reportes',
      permission: 'reportes.generar',
      icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
      ])
    },
    { 
      id: 'plantillas', 
      name: 'Plantillas de Entrega',
      permission: 'inventario.ver',
      icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' })
      ])
    }
  ]

  // Filtrar tabs según permisos
  return allTabs.filter(tab => {
    // Admin ve todo
    if (isAdmin.value) return true
    // Verificar permiso específico
    return hasPermission(tab.permission)
  })
})

// Verificar que el tab activo esté disponible cuando cambian los permisos
watch(tabs, (newTabs) => {
  const tabActivo = newTabs.find(tab => tab.id === activeTab.value)
  if (!tabActivo && newTabs.length > 0) {
    // Si el tab activo ya no está disponible, cambiar al primero disponible
    logger.log('🔄 Tab no disponible, cambiando a:', newTabs[0].id)
    activeTab.value = newTabs[0].id
  }
}, { immediate: true })

const loadStockAlerts = async () => {
  try {
    const response = await productsService.getStockAlerts()
    stockAlerts.value = response.data.total || 0
  } catch (error) {
    console.error('Error cargando alertas:', error)
  }
}

const verStockBajo = () => {
  // Cambiar al tab de productos
  activeTab.value = 'productos'
  
  // Activar el filtro de stock bajo en ProductosTab
  if (productosTabRef.value) {
    productosTabRef.value.activarFiltroStockBajo()
  }
}

onMounted(() => {
  loadStockAlerts()
  
  // Restaurar tab guardado si existe
  const savedTab = localStorage.getItem('inventario_activeTab')
  if (savedTab && tabs.value.find(t => t.id === savedTab)) {
    activeTab.value = savedTab
  }
})

// Guardar tab activo cuando cambia
watch(activeTab, (newTab) => {
  localStorage.setItem('inventario_activeTab', newTab)
})
</script>
