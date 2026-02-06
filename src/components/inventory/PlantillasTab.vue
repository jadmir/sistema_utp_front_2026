<template>
  <div class="space-y-4">
    <!-- Filtros y acciones -->
    <div class="flex flex-col sm:flex-row gap-3">
      <select
        v-model="filters.area_id"
        @change="loadPlantillas"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="">Todas las áreas</option>
        <option v-for="area in areas" :key="area.id" :value="area.id">
          {{ area.nombre }}
        </option>
      </select>

      <select
        v-model="filters.activa"
        @change="loadPlantillas"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="">Todas</option>
        <option value="true">Activas</option>
        <option value="false">Inactivas</option>
      </select>

      <button
        v-if="canCreate"
        @click="openCreateModal"
        class="ml-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span class="hidden sm:inline">Nueva Plantilla</span>
        <span class="sm:hidden">Nueva</span>
      </button>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
    </div>

    <!-- Lista de plantillas -->
    <div v-else-if="plantillas.length > 0" class="grid grid-cols-1 gap-4">
      <div
        v-for="plantilla in plantillas"
        :key="plantilla.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-4 sm:p-5"
      >
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                {{ plantilla.nombre }}
              </h3>
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-semibold',
                  plantilla.activa 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                ]"
              >
                {{ plantilla.activa ? 'Activa' : 'Inactiva' }}
              </span>
            </div>
            <p v-if="plantilla.descripcion" class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {{ plantilla.descripcion }}
            </p>
            <div class="flex flex-wrap gap-2 text-xs sm:text-sm">
              <span class="text-gray-600 dark:text-gray-400">
                <span class="font-semibold">Área:</span> {{ plantilla.area?.nombre }}
              </span>
              <span class="text-gray-600 dark:text-gray-400">
                <span class="font-semibold">Productos:</span> {{ plantilla.detalles?.length || 0 }}
              </span>
            </div>
          </div>

          <!-- Botón ejecutar (destacado) -->
          <button
            v-if="canExecute && plantilla.activa"
            @click="openEjecutarModal(plantilla)"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 whitespace-nowrap"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ejecutar
          </button>
        </div>

        <!-- Productos -->
        <div class="mb-3">
          <details class="group">
            <summary class="cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1">
              <svg class="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              Ver productos ({{ plantilla.detalles?.length || 0 }})
            </summary>
            <div class="mt-2 pl-5 space-y-1">
              <div
                v-for="detalle in plantilla.detalles"
                :key="detalle.id"
                class="text-sm text-gray-600 dark:text-gray-400 flex justify-between"
              >
                <span>• {{ detalle.producto?.nombre }} ({{ detalle.producto?.codigo }})</span>
                <span class="font-semibold">x{{ detalle.cantidad }}</span>
              </div>
            </div>
          </details>
        </div>

        <!-- Acciones -->
        <div class="flex flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            v-if="canEdit"
            @click="openEditModal(plantilla)"
            class="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>

          <button
            v-if="canEdit"
            @click="toggleActiva(plantilla)"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1',
              plantilla.activa
                ? 'text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                : 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {{ plantilla.activa ? 'Desactivar' : 'Activar' }}
          </button>

          <button
            v-if="canDelete"
            @click="deletePlantilla(plantilla)"
            class="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Sin resultados -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay plantillas</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Crea una plantilla para comenzar.</p>
    </div>

    <!-- Modales -->
    <PlantillaModal
      v-if="showModal"
      :plantilla="selectedPlantilla"
      :areas="areas"
      @close="closeModal"
      @save="handleSave"
    />

    <EjecutarPlantillaModal
      v-if="showEjecutarModal"
      :plantilla="selectedPlantilla"
      @close="closeEjecutarModal"
      @ejecutar="handleEjecutar"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { plantillasEntregasService } from '../../services/plantillasEntregas'
import { areasService } from '../../services/areas'
import { useAlert } from '../../composables/useAlert'
import PlantillaModal from './PlantillaModal.vue'
import EjecutarPlantillaModal from './EjecutarPlantillaModal.vue'

const authStore = useAuthStore()
const { success, error, confirm } = useAlert()

const plantillas = ref([])
const areas = ref([])
const loading = ref(false)
const filters = ref({ area_id: '', activa: '' })
const showModal = ref(false)
const showEjecutarModal = ref(false)
const selectedPlantilla = ref(null)

const canCreate = computed(() => authStore.hasPermission('inventario.crear'))
const canEdit = computed(() => authStore.hasPermission('inventario.editar'))
const canDelete = computed(() => authStore.hasPermission('inventario.eliminar'))
const canExecute = computed(() => authStore.hasPermission('inventario.salida'))

const loadPlantillas = async () => {
  loading.value = true
  try {
    const params = {
      area_id: filters.value.area_id || undefined,
      activa: filters.value.activa || undefined
    }
    const response = await plantillasEntregasService.getAll(params)
    plantillas.value = response.data.data || []
  } catch (err) {
    error('Error al cargar plantillas', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const loadAreas = async () => {
  try {
    const response = await areasService.getAll()
    areas.value = response.data.data.data || response.data.data || []
  } catch (err) {
    error('Error al cargar áreas', err.response?.data?.message || err.message)
  }
}

const openCreateModal = () => {
  selectedPlantilla.value = null
  showModal.value = true
}

const openEditModal = (plantilla) => {
  selectedPlantilla.value = plantilla
  showModal.value = true
}

const openEjecutarModal = (plantilla) => {
  selectedPlantilla.value = plantilla
  showEjecutarModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedPlantilla.value = null
}

const closeEjecutarModal = () => {
  showEjecutarModal.value = false
  selectedPlantilla.value = null
}

const handleSave = async (plantillaData) => {
  try {
    if (selectedPlantilla.value) {
      await plantillasEntregasService.update(selectedPlantilla.value.id, plantillaData)
      success('Plantilla actualizada exitosamente')
    } else {
      await plantillasEntregasService.create(plantillaData)
      success('Plantilla creada exitosamente')
    }
    closeModal()
    await loadPlantillas()
  } catch (err) {
    error('Error al guardar plantilla', err.response?.data?.message || err.message)
  }
}

const handleEjecutar = async (data) => {
  try {
    const response = await plantillasEntregasService.ejecutar(selectedPlantilla.value.id, data)
    
    // Mostrar resultado
    const resultado = response.data
    success(`Plantilla ejecutada: ${resultado.total_procesados} productos procesados`)
    
    // Mostrar alertas de stock bajo si hay
    if (resultado.alertas_stock_bajo && resultado.alertas_stock_bajo.length > 0) {
      setTimeout(() => {
        resultado.alertas_stock_bajo.forEach(alerta => {
          error(
            `Stock bajo: ${alerta.nombre}`,
            `Stock actual: ${alerta.stock_actual}, Mínimo: ${alerta.stock_minimo}`
          )
        })
      }, 500)
    }
    
    closeEjecutarModal()
    await loadPlantillas()
  } catch (err) {
    if (err.response?.data?.errores) {
      // Errores de stock insuficiente
      error('Stock insuficiente en algunos productos')
      err.response.data.errores.forEach(errorItem => {
        setTimeout(() => {
          error(
            `${errorItem.nombre} (${errorItem.codigo})`,
            `Stock actual: ${errorItem.stock_actual}, Solicitado: ${errorItem.cantidad_solicitada}`
          )
        }, 200)
      })
    } else {
      error('Error al ejecutar plantilla', err.response?.data?.message || err.message)
    }
  }
}

const toggleActiva = async (plantilla) => {
  const accion = plantilla.activa ? 'desactivar' : 'activar'
  if (!await confirm(`¿Estás seguro de ${accion} esta plantilla?`)) return

  try {
    await plantillasEntregasService.update(plantilla.id, { activa: !plantilla.activa })
    success(`Plantilla ${plantilla.activa ? 'desactivada' : 'activada'} exitosamente`)
    await loadPlantillas()
  } catch (err) {
    error('Error al actualizar plantilla', err.response?.data?.message || err.message)
  }
}

const deletePlantilla = async (plantilla) => {
  if (!await confirm(
    `¿Estás seguro de eliminar la plantilla "${plantilla.nombre}"?`,
    'Esta acción no se puede deshacer'
  )) return

  try {
    await plantillasEntregasService.delete(plantilla.id)
    success('Plantilla eliminada exitosamente')
    await loadPlantillas()
  } catch (err) {
    error('Error al eliminar plantilla', err.response?.data?.message || err.message)
  }
}

onMounted(() => {
  loadPlantillas()
  loadAreas()
})
</script>
