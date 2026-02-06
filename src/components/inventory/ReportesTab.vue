<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reportes del Inventario</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">Genera reportes en Excel para análisis y auditoría del inventario</p>

      <!-- Reportes Generales -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Reportes Generales
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Reporte General de Productos -->
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition h-full flex flex-col bg-white dark:bg-gray-800">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Inventario Completo</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Listado completo de todos los productos del inventario</p>
            <div class="space-y-2 mb-4 flex-grow">
              <select v-model="filtrosGenerales.section_id" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Todas las secciones</option>
                <option v-for="seccion in sections" :key="seccion.id" :value="seccion.id">{{ seccion.nombre }}</option>
              </select>
              <select v-model="filtrosGenerales.stock_type_id" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Todos los tipos</option>
                <option v-for="tipo in stockTypes" :key="tipo.id" :value="tipo.id">{{ tipo.nombre }}</option>
              </select>
            </div>
            <div class="flex gap-2">
              <button @click="generarReporteProductos" :disabled="loading" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm transition">
                <svg v-if="!loading" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <svg v-else class="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loading ? 'Generando...' : 'Excel' }}
              </button>
              <button @click="generarReporteProductosPDF" :disabled="loading" class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm transition">
                <svg v-if="!loading" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <svg v-else class="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loading ? 'Generando...' : 'PDF' }}
              </button>
            </div>
          </div>

          <!-- Por Tipo de Stock -->
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition h-full flex flex-col bg-white dark:bg-gray-800">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Por Tipo de Stock</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Productos agrupados por tipo de stock con subtotales</p>
            <div class="space-y-2 mb-4 flex-grow">
              <select v-model="filtrosTipoStock.stock_type_id" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Todos los tipos</option>
                <option v-for="tipo in stockTypes" :key="tipo.id" :value="tipo.id">{{ tipo.nombre }}</option>
              </select>
            </div>
            <div class="flex gap-2">
              <button @click="generarReporteTipoStock" :disabled="loading" class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded font-medium disabled:opacity-50 flex items-center justify-center text-sm">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel
              </button>
              <button @click="generarReporteTipoStockPDF" :disabled="loading" class="flex-1 bg-purple-700 hover:bg-purple-800 text-white py-2 px-3 rounded font-medium disabled:opacity-50 flex items-center justify-center text-sm">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF
              </button>
            </div>
          </div>

          <!-- Por Sección -->
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition h-full flex flex-col bg-white dark:bg-gray-800">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Por Sección</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Productos agrupados por sección con resumen</p>
            <div class="space-y-2 mb-4 flex-grow">
              <select v-model="filtrosSeccion.section_id" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Todas las secciones</option>
                <option v-for="seccion in sections" :key="seccion.id" :value="seccion.id">{{ seccion.nombre }}</option>
              </select>
            </div>
            <div class="flex gap-2">
              <button @click="generarReporteSeccion" :disabled="loading" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded font-medium disabled:opacity-50 flex items-center justify-center text-sm">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel
              </button>
              <button @click="generarReporteSeccionPDF" :disabled="loading" class="flex-1 bg-indigo-700 hover:bg-indigo-800 text-white py-2 px-3 rounded font-medium disabled:opacity-50 flex items-center justify-center text-sm">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reportes de Alertas -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Alertas y Control
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Stock Bajo -->
          <div class="border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 rounded-lg p-4 hover:shadow-md transition h-full flex flex-col">
            <h4 class="font-semibold text-red-900 dark:text-red-300 mb-2">Stock Bajo</h4>
            <p class="text-sm text-red-700 dark:text-red-400 mb-4">Productos con stock actual ≤ stock mínimo</p>
            <div class="space-y-2 mb-4 flex-grow">
              <select v-model="filtrosStockBajo.section_id" class="w-full px-3 py-2 border border-red-300 dark:border-red-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option value="">Todas las secciones</option>
                <option v-for="seccion in sections" :key="seccion.id" :value="seccion.id">{{ seccion.nombre }}</option>
              </select>
            </div>
            <div class="flex gap-2">
              <button @click="generarReporteStockBajo" :disabled="loading" class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded font-medium disabled:opacity-50 text-sm">
                Excel
              </button>
              <button @click="generarReporteStockBajoPDF" :disabled="loading" class="flex-1 bg-red-700 hover:bg-red-800 text-white py-2 px-3 rounded font-medium disabled:opacity-50 text-sm">
                PDF
              </button>
            </div>
          </div>

          <!-- Próximos a Vencer -->
          <div class="border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 hover:shadow-md transition h-full flex flex-col">
            <h4 class="font-semibold text-orange-900 dark:text-orange-300 mb-2">Próximos a Vencer</h4>
            <p class="text-sm text-orange-700 dark:text-orange-400 mb-4">Productos que vencen próximamente</p>
            <div class="space-y-2 mb-4 flex-grow">
              <input v-model.number="filtrosVencer.dias" type="number" min="1" max="365" placeholder="Días (default: 30)" class="w-full px-3 py-2 border border-orange-300 dark:border-orange-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              <select v-model="filtrosVencer.section_id" class="w-full px-3 py-2 border border-orange-300 dark:border-orange-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option value="">Todas las secciones</option>
                <option v-for="seccion in sections" :key="seccion.id" :value="seccion.id">{{ seccion.nombre }}</option>
              </select>
            </div>
            <div class="flex gap-2">
              <button @click="generarReporteProximosVencer" :disabled="loading" class="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded font-medium disabled:opacity-50 text-sm">
                Excel
              </button>
              <button @click="generarReporteProximosVencerPDF" :disabled="loading" class="flex-1 bg-orange-700 hover:bg-orange-800 text-white py-2 px-3 rounded font-medium disabled:opacity-50 text-sm">
                PDF
              </button>
            </div>
          </div>

          <!-- Vencidos -->
          <div class="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition h-full flex flex-col">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Productos Vencidos</h4>
            <p class="text-sm text-gray-700 dark:text-gray-400 mb-4">Productos con fecha de vencimiento pasada</p>
            <div class="space-y-2 mb-4 flex-grow">
              <select v-model="filtrosVencidos.section_id" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Todas las secciones</option>
                <option v-for="seccion in sections" :key="seccion.id" :value="seccion.id">{{ seccion.nombre }}</option>
              </select>
            </div>
            <div class="flex gap-2">
              <button @click="generarReporteVencidos" :disabled="loading" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded font-medium disabled:opacity-50 text-sm">
                Excel
              </button>
              <button @click="generarReporteVencidosPDF" :disabled="loading" class="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-2 px-3 rounded font-medium disabled:opacity-50 text-sm">
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reportes de Movimientos -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          Movimientos y Kardex
        </h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Movimientos -->
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 h-full flex flex-col bg-white dark:bg-gray-800">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Historial de Movimientos</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Entradas, salidas y ajustes del inventario</p>
            <div class="space-y-2 mb-4 flex-grow">
              <select v-model="filtrosMovimientos.tipo" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Todos los tipos</option>
                <option value="ENTRADA">ENTRADA</option>
                <option value="SALIDA">SALIDA</option>
                <option value="AJUSTE">AJUSTE</option>
              </select>
              <input v-model="filtrosMovimientos.fecha_desde" type="date" placeholder="Fecha desde" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              <input v-model="filtrosMovimientos.fecha_hasta" type="date" placeholder="Fecha hasta" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              <select v-model="filtrosMovimientos.section_id" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Todas las secciones</option>
                <option v-for="seccion in sections" :key="seccion.id" :value="seccion.id">{{ seccion.nombre }}</option>
              </select>
            </div>
            <div class="flex gap-2">
              <button @click="generarReporteMovimientos" :disabled="loading" class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded font-medium disabled:opacity-50 text-sm">
                Excel
              </button>
              <button @click="generarReporteMovimientosPDF" :disabled="loading" class="flex-1 bg-green-700 hover:bg-green-800 text-white py-2 px-3 rounded font-medium disabled:opacity-50 text-sm">
                PDF
              </button>
            </div>
          </div>

          <!-- Kardex -->
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 h-full flex flex-col bg-white dark:bg-gray-800">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Kardex de Producto</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Detalle completo de movimientos de un producto específico</p>
            <div class="space-y-2 mb-4 flex-grow">
              <select v-model="filtrosKardex.product_id" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required>
                <option value="">Seleccionar producto *</option>
                <option v-for="producto in productos" :key="producto.id" :value="producto.id">
                  {{ producto.codigo }} - {{ producto.nombre }}
                </option>
              </select>
              <input v-model="filtrosKardex.fecha_desde" type="date" placeholder="Fecha desde" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              <input v-model="filtrosKardex.fecha_hasta" type="date" placeholder="Fecha hasta" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div class="flex gap-2">
              <button @click="generarReporteKardex" :disabled="loading || !filtrosKardex.product_id" class="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-3 rounded font-medium disabled:opacity-50 text-sm">
                Excel
              </button>
              <button @click="generarReporteKardexPDF" :disabled="loading || !filtrosKardex.product_id" class="flex-1 bg-teal-700 hover:bg-teal-800 text-white py-2 px-3 rounded font-medium disabled:opacity-50 text-sm">
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { reportesService } from '../../services/reportes'
import { productsService } from '../../services/products'
import { sectionsService } from '../../services/sections'
import { stockTypesService } from '../../services/stockTypes'
import { useAlert } from '../../composables/useAlert'

const { success, error } = useAlert()

const loading = ref(false)
const productos = ref([])
const sections = ref([])
const stockTypes = ref([])

// Filtros para cada reporte
const filtrosGenerales = ref({ section_id: '', stock_type_id: '' })
const filtrosTipoStock = ref({ stock_type_id: '' })
const filtrosSeccion = ref({ section_id: '' })
const filtrosStockBajo = ref({ section_id: '' })
const filtrosVencer = ref({ dias: 30, section_id: '' })
const filtrosVencidos = ref({ section_id: '' })
const filtrosMovimientos = ref({ tipo: '', fecha_desde: '', fecha_hasta: '', section_id: '' })
const filtrosKardex = ref({ product_id: '', fecha_desde: '', fecha_hasta: '' })

// Funciones para generar reportes
const generarReporteProductos = async () => {
  loading.value = true
  try {
    await reportesService.reporteProductos(filtrosGenerales.value)
    success('Reporte generado', 'El reporte de productos ha sido descargado')
  } catch (err) {
    error('Error al generar reporte', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const generarReporteProductosPDF = async () => {
  loading.value = true
  try {
    await reportesService.reporteProductosPDF(filtrosGenerales.value)
    success('Reporte PDF generado', 'El reporte de productos en PDF ha sido descargado')
  } catch (err) {
    error('Error al generar reporte PDF', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const generarReporteTipoStock = async () => {
  loading.value = true
  try {
    await reportesService.reporteTipoStock(filtrosTipoStock.value)
    success('Reporte generado', 'El reporte por tipo de stock ha sido descargado')
  } catch (err) {
    error('Error al generar reporte', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const generarReporteTipoStockPDF = async () => {
  loading.value = true
  try {
    await reportesService.reporteTipoStockPDF(filtrosTipoStock.value)
    success('Reporte PDF generado', 'El reporte por tipo de stock en PDF ha sido descargado')
  } catch (err) {
    error('Error al generar reporte PDF', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const generarReporteSeccion = async () => {
  loading.value = true
  try {
    await reportesService.reporteSeccion(filtrosSeccion.value)
    success('Reporte generado', 'El reporte por sección ha sido descargado')
  } catch (err) {
    error('Error al generar reporte', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const generarReporteSeccionPDF = async () => {
  loading.value = true
  try {
    await reportesService.reporteSeccionPDF(filtrosSeccion.value)
    success('Reporte PDF generado', 'El reporte por sección en PDF ha sido descargado')
  } catch (err) {
    error('Error al generar reporte PDF', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const generarReporteStockBajo = async () => {
  loading.value = true
  try {
    await reportesService.reporteStockBajo(filtrosStockBajo.value)
    success('Reporte generado', 'El reporte de stock bajo ha sido descargado')
  } catch (err) {
    error('Error al generar reporte', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const generarReporteStockBajoPDF = async () => {
  loading.value = true
  try {
    await reportesService.reporteStockBajoPDF(filtrosStockBajo.value)
    success('Reporte PDF generado', 'El reporte de stock bajo en PDF ha sido descargado')
  } catch (err) {
    error('Error al generar reporte PDF', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const generarReporteProximosVencer = async () => {
  loading.value = true
  try {
    await reportesService.reporteProximosVencer(filtrosVencer.value)
    success('Reporte generado', 'El reporte de próximos a vencer ha sido descargado')
  } catch (err) {
    error('Error al generar reporte', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const generarReporteProximosVencerPDF = async () => {
  loading.value = true
  try {
    await reportesService.reporteProximosVencerPDF(filtrosVencer.value)
    success('Reporte PDF generado', 'El reporte de próximos a vencer en PDF ha sido descargado')
  } catch (err) {
    error('Error al generar reporte PDF', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const generarReporteVencidos = async () => {
  loading.value = true
  try {
    await reportesService.reporteVencidos(filtrosVencidos.value)
    success('Reporte generado', 'El reporte de vencidos ha sido descargado')
  } catch (err) {
    error('Error al generar reporte', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const generarReporteVencidosPDF = async () => {
  loading.value = true
  try {
    await reportesService.reporteVencidosPDF(filtrosVencidos.value)
    success('Reporte PDF generado', 'El reporte de vencidos en PDF ha sido descargado')
  } catch (err) {
    error('Error al generar reporte PDF', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const generarReporteMovimientos = async () => {
  loading.value = true
  try {
    await reportesService.reporteMovimientos(filtrosMovimientos.value)
    success('Reporte generado', 'El reporte de movimientos ha sido descargado')
  } catch (err) {
    error('Error al generar reporte', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const generarReporteMovimientosPDF = async () => {
  loading.value = true
  try {
    await reportesService.reporteMovimientosPDF(filtrosMovimientos.value)
    success('Reporte PDF generado', 'El reporte de movimientos en PDF ha sido descargado')
  } catch (err) {
    error('Error al generar reporte PDF', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const generarReporteKardex = async () => {
  if (!filtrosKardex.value.product_id) {
    error('Producto requerido', 'Debes seleccionar un producto para generar el Kardex')
    return
  }
  
  loading.value = true
  try {
    await reportesService.reporteKardex(filtrosKardex.value.product_id, {
      fecha_desde: filtrosKardex.value.fecha_desde,
      fecha_hasta: filtrosKardex.value.fecha_hasta
    })
    success('Kardex generado', 'El kardex del producto ha sido descargado')
  } catch (err) {
    error('Error al generar kardex', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const generarReporteKardexPDF = async () => {
  if (!filtrosKardex.value.product_id) {
    error('Producto requerido', 'Debes seleccionar un producto para generar el Kardex en PDF')
    return
  }
  
  loading.value = true
  try {
    await reportesService.reporteKardexPDF(filtrosKardex.value.product_id, {
      fecha_desde: filtrosKardex.value.fecha_desde,
      fecha_hasta: filtrosKardex.value.fecha_hasta
    })
    success('Kardex PDF generado', 'El kardex del producto en PDF ha sido descargado')
  } catch (err) {
    error('Error al generar kardex PDF', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

// Cargar datos iniciales
const loadProductos = async () => {
  try {
    const response = await productsService.getAll({ per_page: 1000 })
    productos.value = response.data.data.data || []
  } catch (err) {
    console.error('Error cargando productos:', err)
  }
}

const loadSections = async () => {
  try {
    const response = await sectionsService.getAll()
    sections.value = response.data.data
  } catch (err) {
    console.error('Error cargando secciones:', err)
  }
}

const loadStockTypes = async () => {
  try {
    const response = await stockTypesService.getAll()
    stockTypes.value = response.data.data
  } catch (err) {
    console.error('Error cargando tipos de stock:', err)
  }
}

onMounted(() => {
  loadProductos()
  loadSections()
  loadStockTypes()
})
</script>
