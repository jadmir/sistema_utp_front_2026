<template>
  <div class="fixed inset-0 z-[100] overflow-y-auto" @click.self="$emit('close')">
    <div class="flex items-center justify-center min-h-screen px-2 sm:px-4 py-4">
      <div class="fixed inset-0 transition-opacity bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75" @click="$emit('close')"></div>

      <div class="relative inline-block bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-2xl z-[101]">
        <!-- Header -->
        <div class="bg-gradient-to-r from-green-600 to-green-700 px-4 sm:px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ejecutar Plantilla
            </h3>
            <button @click="$emit('close')" aria-label="Cerrar modal" class="text-white hover:text-gray-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <form @submit.prevent="handleSubmit" class="p-4 sm:p-6 space-y-4">
          <!-- Información de la plantilla -->
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">{{ plantilla.nombre }}</h4>
            <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p v-if="plantilla.descripcion">{{ plantilla.descripcion }}</p>
              <p><span class="font-semibold">Área:</span> {{ plantilla.area?.nombre }}</p>
              <p><span class="font-semibold">Motivo:</span> {{ plantilla.motivo }}</p>
              <p><span class="font-semibold">Productos:</span> {{ plantilla.detalles?.length || 0 }}</p>
            </div>
          </div>

          <!-- Resumen de productos -->
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h5 class="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Productos a procesar:</h5>
            <div class="max-h-48 overflow-y-auto space-y-2">
              <div
                v-for="detalle in plantilla.detalles"
                :key="detalle.id"
                class="flex justify-between items-center text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div class="flex-1">
                  <p class="font-medium text-gray-900 dark:text-white">{{ detalle.producto?.nombre }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ detalle.producto?.codigo }}</p>
                  <p v-if="detalle.observaciones" class="text-xs text-gray-600 dark:text-gray-400 italic">
                    {{ detalle.observaciones }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-gray-900 dark:text-white">x{{ detalle.cantidad }}</p>
                  <p v-if="detalle.producto?.stock_actual !== undefined" class="text-xs text-gray-500 dark:text-gray-400">
                    Stock: {{ detalle.producto.stock_actual }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Fecha de movimiento -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha de movimiento *
            </label>
            <input
              v-model="form.fecha_movimiento"
              type="date"
              required
              :max="fechaMaxima"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              La fecha no puede ser futura
            </p>
          </div>

          <!-- Observaciones generales -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Observaciones generales
            </label>
            <textarea
              v-model="form.observaciones_generales"
              rows="3"
              placeholder="Observaciones adicionales (opcional)"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            ></textarea>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Estas observaciones se agregarán a cada movimiento generado
            </p>
          </div>

          <!-- Advertencia -->
          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-start gap-2">
            <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div class="text-xs text-yellow-800 dark:text-yellow-200">
              <p class="font-semibold">Importante:</p>
              <ul class="mt-1 list-disc list-inside space-y-0.5">
                <li>Se realizarán {{ plantilla.detalles?.length || 0 }} salidas de stock</li>
                <li>Se validará el stock disponible antes de procesar</li>
                <li>Esta acción quedará registrada en el historial</li>
              </ul>
            </div>
          </div>

          <!-- Footer con botones -->
          <div class="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Ejecutar Plantilla
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  plantilla: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'ejecutar'])

const form = ref({
  fecha_movimiento: '',
  observaciones_generales: ''
})

const fechaMaxima = computed(() => {
  const hoy = new Date()
  return hoy.toISOString().split('T')[0]
})

const handleSubmit = () => {
  emit('ejecutar', form.value)
}

onMounted(() => {
  // Por defecto, usar la fecha de hoy
  form.value.fecha_movimiento = fechaMaxima.value
})
</script>
