<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] flex flex-col my-2 sm:my-8">
      <div class="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center z-10 flex-shrink-0">
        <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
          {{ producto ? 'Editar Producto' : 'Nuevo Producto' }}
        </h2>
        <button @click="$emit('close')" aria-label="Cerrar modal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto">
        <div class="p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Artículo *</label>
            <select
              v-model="form.section_id"
              @change="onSectionChange"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Seleccionar sección</option>
              <option v-for="seccion in sections" :key="seccion.id" :value="seccion.id">
                {{ seccion.nombre }} ({{ seccion.stock_type?.nombre }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código</label>
            <input
              v-model="form.codigo"
              type="text"
              readonly
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 cursor-not-allowed"
              :placeholder="loadingCode ? 'Cargando código...' : 'Selecciona una sección'"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ producto ? 'El código no se puede cambiar' : 'Se genera automáticamente' }}</p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Producto *</label>
          <input
            v-model="form.nombre"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            placeholder="Lapicero azul Faber Castell"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
          <textarea
            v-model="form.descripcion"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            placeholder="Descripción detallada del producto"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Actual *</label>
            <input
              v-model.number="form.stock_actual"
              type="number"
              min="0"
              required
              :readonly="!!producto"
              :class="[
                'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500',
                producto ? 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 cursor-not-allowed' : 'dark:bg-gray-700 dark:text-white'
              ]"
            />
            <p v-if="producto" class="text-xs text-gray-500 dark:text-gray-400 mt-1">Se modifica mediante movimientos</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Mínimo *</label>
            <input
              v-model.number="form.stock_minimo"
              type="number"
              min="0"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Máximo</label>
            <input
              v-model.number="form.stock_maximo"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <!-- Fecha del stock inicial (solo para productos nuevos con stock > 0) -->
        <div v-if="!producto && form.stock_actual > 0" class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <label class="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
            📅 Fecha del Stock Inicial *
            <span class="text-xs text-blue-700 dark:text-blue-400 font-normal" title="Fecha cuando ingresó este inventario inicial">
              ℹ️
            </span>
          </label>
          <input
            v-model="form.fecha_movimiento"
            type="date"
            :max="maxDate"
            required
            class="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <p class="text-xs text-blue-700 dark:text-blue-400 mt-1">
            ¿Cuándo ingresó este stock inicial al almacén?
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unidad de Medida *</label>
            <input
              v-model="form.unidad_medida"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="UNIDAD, CAJA, LITRO, etc."
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ubicación</label>
            <input
              v-model="form.ubicacion"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Estante A-3"
            />
          </div>
        </div>

        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="form.tiene_vencimiento"
              type="checkbox"
              class="w-4 h-4 text-red-600 border-gray-300 dark:border-gray-600 rounded focus:ring-red-500 dark:bg-gray-700"
            />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Tiene fecha de vencimiento</span>
          </label>

          <div v-if="form.tiene_vencimiento" class="flex-1">
            <input
              v-model="form.fecha_vencimiento"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
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
            class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 transition-all duration-200"
          >
            {{ loading ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { productsService } from '../../services/products'
import { sectionsService } from '../../services/sections'
import { useAlert } from '../../composables/useAlert'

const props = defineProps({
  producto: Object,
  stockTypes: Array,
  sections: Array
})

const emit = defineEmits(['close', 'save'])

const { success, error } = useAlert()
const loading = ref(false)
const loadingCode = ref(false)

// Fecha máxima permitida (hoy)
const maxDate = new Date().toISOString().split('T')[0]

const form = ref({
  section_id: '',
  codigo: '',
  nombre: '',
  descripcion: '',
  unidad_medida: 'UNIDAD',
  stock_actual: 0,
  stock_minimo: 0,
  stock_maximo: null,
  tiene_vencimiento: false,
  fecha_vencimiento: null,
  ubicacion: '',
  estado: true,
  fecha_movimiento: new Date().toISOString().split('T')[0] // Fecha de hoy por defecto
})

const onSectionChange = async () => {
  if (!form.value.section_id) return
  
  loadingCode.value = true
  try {
    const response = await sectionsService.getNextCode(form.value.section_id)
    form.value.codigo = response.data.data.next_code
  } catch (err) {
    error('Error al obtener código', err.response?.data?.message || err.message)
    form.value.codigo = ''
  } finally {
    loadingCode.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const data = { ...form.value }
    
    // NO enviar el código al crear (se genera en backend)
    if (!props.producto) {
      delete data.codigo
      
      // Solo enviar fecha_movimiento si es producto nuevo con stock > 0
      if (data.stock_actual > 0) {
        console.log('📤 Enviando producto con stock inicial y fecha:', {
          stock_actual: data.stock_actual,
          fecha_movimiento: data.fecha_movimiento
        })
      } else {
        delete data.fecha_movimiento
      }
    } else {
      // Al editar, no enviar fecha_movimiento
      delete data.fecha_movimiento
    }
    
    if (props.producto) {
      await productsService.update(props.producto.id, data)
      success('Producto actualizado', 'El producto ha sido actualizado correctamente')
    } else {
      await productsService.create(data)
      success('Producto creado', 'El producto ha sido creado correctamente')
    }
    
    emit('save')
  } catch (err) {
    error('Error al guardar', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.producto) {
    console.log('📝 Producto a editar:', props.producto)
    
    // Convertir fecha al formato YYYY-MM-DD si existe
    let fechaVencimiento = null
    if (props.producto.fecha_vencimiento) {
      // Extraer solo la parte de la fecha YYYY-MM-DD
      fechaVencimiento = props.producto.fecha_vencimiento.split(' ')[0]
    }
    
    form.value = {
      section_id: props.producto.section_id,
      codigo: props.producto.codigo,
      nombre: props.producto.nombre,
      descripcion: props.producto.descripcion || '',
      unidad_medida: props.producto.unidad_medida,
      stock_actual: props.producto.stock_actual,
      stock_minimo: props.producto.stock_minimo,
      stock_maximo: props.producto.stock_maximo,
      tiene_vencimiento: !!props.producto.tiene_vencimiento,
      fecha_vencimiento: fechaVencimiento,
      ubicacion: props.producto.ubicacion || '',
      estado: props.producto.estado
    }
    
    console.log('📝 Formulario inicializado:', form.value)
  }
})
</script>
