<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      <div class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex justify-between items-center">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-1">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Historial de Movimientos</h2>
            <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-semibold">
              Stock actual: {{ producto.stock_actual || producto.stock || 0 }} {{ producto.unidad_medida }}
            </span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ producto.nombre }} - {{ producto.codigo }}</p>
        </div>
        <button @click="$emit('close')" aria-label="Cerrar modal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="loading" class="text-center py-8 text-gray-500 dark:text-gray-400">
          Cargando historial...
        </div>

        <div v-else-if="movimientos.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          No hay movimientos registrados para este producto
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="movimiento in movimientos"
            :key="movimiento.id"
            class="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition"
          >
            <div class="flex items-start gap-4">
              <!-- Icono -->
              <div
                :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
                  movimiento.tipo === 'ENTRADA' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                  movimiento.tipo === 'SALIDA' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                ]"
              >
                <svg v-if="movimiento.tipo === 'ENTRADA'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                <svg v-else-if="movimiento.tipo === 'SALIDA'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
                <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>

              <!-- Contenido -->
              <div class="flex-1">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <span
                      :class="[
                        'inline-block px-2 py-1 rounded-full text-xs font-semibold',
                        movimiento.tipo === 'ENTRADA' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                        movimiento.tipo === 'SALIDA' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      ]"
                    >
                      {{ movimiento.tipo }}
                    </span>
                    <div class="mt-2 space-y-1">
                      <div class="flex items-center gap-1">
                        <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {{ formatDate(movimiento.fecha_movimiento || movimiento.created_at) }}
                        </span>
                        <span v-if="!movimiento.fecha_movimiento" class="text-xs text-yellow-600 dark:text-yellow-400">*</span>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400 pl-5">
                        Registrado: {{ formatDateTime(movimiento.created_at) }}
                      </p>
                      <p v-if="!movimiento.fecha_movimiento" class="text-xs text-yellow-600 dark:text-yellow-400 pl-5">
                        * Movimiento anterior al sistema de fechas
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p
                      :class="[
                        'text-2xl font-bold',
                        movimiento.tipo === 'ENTRADA' ? 'text-green-600 dark:text-green-400' :
                        movimiento.tipo === 'SALIDA' ? 'text-orange-600 dark:text-orange-400' :
                        'text-blue-600 dark:text-blue-400'
                      ]"
                    >
                      {{ movimiento.tipo === 'SALIDA' ? '-' : '+' }}{{ movimiento.cantidad }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ producto.unidad_medida }}</p>
                  </div>
                </div>

                <div class="bg-gray-50 dark:bg-gray-600 rounded px-3 py-2 mb-2">
                  <div class="flex items-center gap-2 text-sm">
                    <span class="text-gray-600 dark:text-gray-300">Stock:</span>
                    <span class="font-mono text-gray-900 dark:text-white">{{ movimiento.stock_anterior }}</span>
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <span class="font-mono font-bold text-gray-900 dark:text-white">{{ movimiento.stock_posterior }}</span>
                  </div>
                </div>

                <p class="text-sm text-gray-900 dark:text-white mb-1">
                  <span class="font-medium">Motivo:</span> {{ movimiento.motivo }}
                </p>

                <!-- Área de destino (solo para SALIDAS) -->
                <div v-if="movimiento.tipo === 'SALIDA'" class="mb-2">
                  <div v-if="movimiento.area" class="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                    <svg class="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div class="flex-1">
                      <p class="text-xs text-red-600 dark:text-red-400 font-medium">Área de destino</p>
                      <p class="text-sm font-semibold text-red-900 dark:text-red-200">
                        {{ movimiento.area.nombre }}
                        <span class="text-xs font-normal text-red-700 dark:text-red-300">({{ movimiento.area.codigo }})</span>
                      </p>
                      <p v-if="movimiento.area.responsable" class="text-xs text-red-700 dark:text-red-300">
                        {{ movimiento.area.responsable }}
                      </p>
                    </div>
                  </div>
                  <p v-else class="text-xs text-gray-500 dark:text-gray-400 italic">
                    ℹ️ Área no registrada (movimiento anterior al sistema de áreas)
                  </p>
                </div>

                <p v-if="movimiento.observaciones" class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span class="font-medium">Observaciones:</span> {{ movimiento.observaciones }}
                </p>

                <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{{ movimiento.user?.nombre || 'Sistema' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t px-6 py-4 bg-gray-50">
        <button
          @click="$emit('close')"
          class="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg hover:bg-white transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { productsService } from '../../services/products'
import { useAlert } from '../../composables/useAlert'

const props = defineProps({
  producto: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])

const { error } = useAlert()
const movimientos = ref([])
const loading = ref(false)

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

const loadHistorial = async () => {
  loading.value = true
  try {
    const response = await productsService.getHistory(props.producto.id)
    movimientos.value = response.data.data.data
    
    // Debug: verificar fechas
    console.log('📅 Movimientos recibidos:', movimientos.value.map(m => ({
      id: m.id,
      tipo: m.tipo,
      fecha_movimiento: m.fecha_movimiento,
      created_at: m.created_at,
      area: m.area?.nombre
    })))
  } catch (err) {
    error('Error al cargar historial', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadHistorial()
})
</script>
