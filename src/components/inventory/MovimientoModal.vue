<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full my-2 sm:my-8 max-h-[95vh] flex flex-col">
      <div 
        :class="[
          'border-b dark:border-gray-700 px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center rounded-t-lg flex-shrink-0',
          tipo === 'entrada' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-orange-50 dark:bg-orange-900/20'
        ]"
      >
        <h2 class="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
          {{ tipo === 'entrada' ? '📥 Entrada de Stock' : '📤 Salida de Stock' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto">
        <div class="p-6 space-y-4">
        <!-- Info del producto -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">Producto</p>
          <p class="font-bold text-gray-900 dark:text-white">{{ producto.nombre }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 font-mono">{{ producto.codigo }}</p>
          <div class="mt-2 flex items-center gap-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">Stock actual:</span>
            <span class="font-bold text-gray-900 dark:text-white">{{ producto.stock_actual }} {{ producto.unidad_medida }}</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cantidad *
            <span v-if="tipo === 'salida'" class="text-xs text-gray-500 dark:text-gray-400">
              (Máx: {{ producto.stock_actual }})
            </span>
          </label>
          <input
            v-model.number="form.cantidad"
            type="number"
            min="1"
            :max="tipo === 'salida' ? producto.stock_actual : undefined"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            placeholder="0"
          />
        </div>

        <!-- Fecha del Movimiento -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
            📅 Fecha del Movimiento *
            <span 
              class="text-xs text-gray-500 dark:text-gray-400 cursor-help" 
              title="¿Cuándo ocurrió realmente este movimiento? Puede ser días atrás si olvidaste registrarlo."
            >
              ℹ️
            </span>
          </label>
          <input
            v-model="form.fecha_movimiento"
            type="date"
            :max="maxDate"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ tipo === 'entrada' ? '¿Cuándo llegó realmente el producto?' : '¿Cuándo se entregó realmente?' }}
          </p>
          <div v-if="form.fecha_movimiento && form.fecha_movimiento !== maxDate" class="mt-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-2">
            <p class="text-xs text-yellow-800 dark:text-yellow-300">
              ⚠️ Estás registrando un movimiento de una fecha pasada ({{ formatDate(form.fecha_movimiento) }}).
            </p>
          </div>
        </div>

        <!-- Selector de Área (solo para SALIDAS) -->
        <div v-if="tipo === 'salida'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Área de destino *
          </label>
          <select
            v-model="form.area_id"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Seleccione un área...</option>
            <option v-for="area in areas" :key="area.id" :value="area.id">
              {{ area.nombre }} - {{ area.codigo }}
              <span v-if="area.responsable">({{ area.responsable }})</span>
            </option>
          </select>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            📍 Área institucional donde se entregará el producto
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Motivo *</label>
          <textarea
            v-model="form.motivo"
            rows="3"
            required
            maxlength="255"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            :placeholder="tipo === 'entrada' ? 'Ej: Compra mensual' : 'Ej: Entrega mensual de material'"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observaciones</label>
          <textarea
            v-model="form.observaciones"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            placeholder="Información adicional (opcional)"
          ></textarea>
        </div>

        <!-- Previsualización -->
        <div v-if="form.cantidad > 0" class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <p class="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Resultado esperado:</p>
          <div class="flex items-center gap-2 text-sm">
            <span class="font-mono text-gray-700 dark:text-gray-300">{{ producto.stock_actual }}</span>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span 
              class="font-mono font-bold"
              :class="nuevoStock < producto.stock_minimo ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'"
            >
              {{ nuevoStock }}
            </span>
            <span class="text-gray-600 dark:text-gray-400">{{ producto.unidad_medida }}</span>
          </div>
          <p v-if="tipo === 'salida' && nuevoStock < producto.stock_minimo" class="text-xs text-red-600 dark:text-red-400 mt-2">
            ⚠️ El stock quedará por debajo del mínimo ({{ producto.stock_minimo }})
          </p>
        </div>
        </div>

        <div class="flex justify-end gap-3 p-6 pt-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading"
            :class="[
              'px-6 py-2 rounded-lg font-semibold disabled:opacity-50 text-white',
              tipo === 'entrada' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'
            ]"
          >
            {{ loading ? 'Guardando...' : 'Registrar ' + (tipo === 'entrada' ? 'Entrada' : 'Salida') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { productsService } from '../../services/products'
import { areasService } from '../../services/areas'
import { useAlert } from '../../composables/useAlert'
import { useCache } from '../../composables/useCache'

const props = defineProps({
  producto: {
    type: Object,
    required: true
  },
  tipo: {
    type: String,
    required: true,
    validator: (value) => ['entrada', 'salida'].includes(value)
  }
})

const emit = defineEmits(['close', 'save'])

const { success, error } = useAlert()
const { invalidateCache } = useCache()
const loading = ref(false)
const areas = ref([])

// Fecha máxima permitida (hoy)
const maxDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const form = ref({
  cantidad: 0,
  motivo: '',
  observaciones: '',
  area_id: '',
  fecha_movimiento: new Date().toISOString().split('T')[0] // Por defecto hoy
})

const formatDate = (dateString) => {
  if (!dateString) return 'Sin fecha'
  // Agregar tiempo para evitar problemas de zona horaria
  const [year, month, day] = dateString.split('-')
  const date = new Date(year, month - 1, day)
  if (isNaN(date.getTime())) return 'Sin fecha'
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const nuevoStock = computed(() => {
  const cantidad = form.value.cantidad || 0
  if (props.tipo === 'entrada') {
    return props.producto.stock_actual + cantidad
  } else {
    return props.producto.stock_actual - cantidad
  }
})

const loadAreas = async () => {
  if (props.tipo === 'salida') {
    try {
      const response = await areasService.getActivas()
      areas.value = response.data
    } catch (err) {
      error('Error al cargar áreas', err.response?.data?.message || err.message)
    }
  }
}

const handleSubmit = async () => {
  // Validar salida
  if (props.tipo === 'salida' && form.value.cantidad > props.producto.stock_actual) {
    error('Stock insuficiente', `Solo hay ${props.producto.stock_actual} ${props.producto.unidad_medida} disponibles`)
    return
  }

  // Validar área en salidas
  if (props.tipo === 'salida' && !form.value.area_id) {
    error('Área requerida', 'Debe seleccionar un área de destino para las salidas')
    return
  }

  loading.value = true
  try {
    const data = {
      cantidad: form.value.cantidad,
      motivo: form.value.motivo,
      observaciones: form.value.observaciones || undefined,
      fecha_movimiento: form.value.fecha_movimiento
    }

    // Agregar area_id solo si es salida
    if (props.tipo === 'salida') {
      data.area_id = parseInt(form.value.area_id)
    }

    console.log('📤 Enviando datos al backend:', data)

    if (props.tipo === 'entrada') {
      await productsService.registerEntry(props.producto.id, data)
      success('Entrada registrada', `Se agregaron ${data.cantidad} ${props.producto.unidad_medida}`)
    } else {
      await productsService.registerExit(props.producto.id, data)
      success('Salida registrada', `Se retiraron ${data.cantidad} ${props.producto.unidad_medida}`)
    }
    
    // Invalidar caché del dashboard y productos para forzar actualización
    invalidateCache('dashboard')
    invalidateCache('products')
    
    // Emitir evento global para que el dashboard se actualice inmediatamente
    console.log('📢 Disparando evento dashboard-refresh')
    window.dispatchEvent(new CustomEvent('dashboard-refresh'))
    
    emit('save')
  } catch (err) {
    error('Error al registrar movimiento', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAreas()
})
</script>
