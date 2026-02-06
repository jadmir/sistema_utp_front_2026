<template>
  <div class="fixed inset-0 z-[100] overflow-y-auto" @click.self="$emit('close')">
    <div class="flex items-center justify-center min-h-screen px-2 sm:px-4 py-4">
      <div class="fixed inset-0 transition-opacity bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75" @click="$emit('close')"></div>

      <div class="relative inline-block bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-4xl z-[101]">
        <!-- Header -->
        <div class="bg-gradient-to-r from-red-600 to-red-700 px-4 sm:px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ plantilla ? 'Editar Plantilla' : 'Nueva Plantilla de Entrega' }}
            </h3>
            <button @click="$emit('close')" class="text-white hover:text-gray-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <form @submit.prevent="handleSubmit" class="p-3 sm:p-6 space-y-3 sm:space-y-4 max-h-[85vh] sm:max-h-[80vh] overflow-y-auto">
          <!-- Información básica -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre de la plantilla *
              </label>
              <input
                v-model="form.nombre"
                type="text"
                required
                maxlength="255"
                placeholder="Ej: Entrega mensual área administrativa"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                v-model="form.descripcion"
                rows="2"
                placeholder="Descripción opcional de la plantilla"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Área de destino *
              </label>
              <select
                v-model="form.area_id"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Seleccionar área</option>
                <option v-for="area in areas" :key="area.id" :value="area.id">
                  {{ area.nombre }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Motivo *
              </label>
              <input
                v-model="form.motivo"
                type="text"
                required
                maxlength="255"
                placeholder="Ej: Entrega mensual programada"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div v-if="plantilla" class="md:col-span-2">
              <label class="flex items-center gap-2">
                <input
                  v-model="form.activa"
                  type="checkbox"
                  class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Plantilla activa
                </span>
              </label>
            </div>
          </div>

          <!-- Productos -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="flex justify-between items-center mb-3">
              <h4 class="text-base font-semibold text-gray-900 dark:text-white">
                Productos *
              </h4>
              <button
                type="button"
                @click="agregarProducto"
                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar
              </button>
            </div>

            <div v-if="form.productos.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
              No hay productos agregados. Haz clic en "Agregar" para incluir productos.
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="(producto, index) in form.productos"
                :key="index"
                class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 flex flex-col sm:flex-row gap-2 sm:items-start"
              >
                <div class="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <!-- Selector de producto -->
                  <div>
                    <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Producto
                    </label>
                    <select
                      v-model="producto.product_id"
                      required
                      @change="onProductoChange(index)"
                      class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Seleccionar</option>
                      <option
                        v-for="prod in productosDisponibles"
                        :key="prod.id"
                        :value="prod.id"
                        :disabled="esProductoSeleccionado(prod.id, index)"
                      >
                        {{ prod.codigo }} - {{ prod.nombre }}
                      </option>
                    </select>
                  </div>

                  <!-- Cantidad -->
                  <div>
                    <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Cantidad
                    </label>
                    <input
                      v-model.number="producto.cantidad"
                      type="number"
                      min="1"
                      required
                      placeholder="0"
                      class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <!-- Observaciones -->
                  <div>
                    <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Observaciones
                    </label>
                    <input
                      v-model="producto.observaciones"
                      type="text"
                      placeholder="Opcional"
                      class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <!-- Botón eliminar -->
                <button
                  type="button"
                  @click="eliminarProducto(index)"
                  class="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg self-center sm:self-start"
                  title="Eliminar producto"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
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
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
            >
              {{ plantilla ? 'Actualizar' : 'Crear' }} Plantilla
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { productsService } from '../../services/products'
import { useAlert } from '../../composables/useAlert'

const props = defineProps({
  plantilla: {
    type: Object,
    default: null
  },
  areas: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])
const { error } = useAlert()

const form = ref({
  nombre: '',
  descripcion: '',
  area_id: '',
  motivo: '',
  activa: true,
  productos: []
})

const productosDisponibles = ref([])

const loadProductos = async () => {
  try {
    const response = await productsService.getAll()
    productosDisponibles.value = response.data.data.data || response.data.data || []
  } catch (err) {
    error('Error al cargar productos', err.response?.data?.message || err.message)
  }
}

const agregarProducto = () => {
  form.value.productos.push({
    product_id: '',
    cantidad: 1,
    observaciones: ''
  })
}

const eliminarProducto = (index) => {
  form.value.productos.splice(index, 1)
}

const esProductoSeleccionado = (productId, currentIndex) => {
  return form.value.productos.some((p, idx) => idx !== currentIndex && p.product_id === productId)
}

const onProductoChange = (index) => {
  // Validar que no esté duplicado
  const producto = form.value.productos[index]
  if (esProductoSeleccionado(producto.product_id, index)) {
    error('Este producto ya está seleccionado')
    producto.product_id = ''
  }
}

const handleSubmit = () => {
  // Validaciones
  if (form.value.productos.length === 0) {
    error('Debes agregar al menos un producto')
    return
  }

  if (form.value.productos.some(p => !p.product_id || !p.cantidad || p.cantidad < 1)) {
    error('Todos los productos deben tener un producto seleccionado y cantidad válida')
    return
  }

  emit('save', form.value)
}

onMounted(() => {
  loadProductos()

  if (props.plantilla) {
    form.value = {
      nombre: props.plantilla.nombre || '',
      descripcion: props.plantilla.descripcion || '',
      area_id: props.plantilla.area_id || '',
      motivo: props.plantilla.motivo || '',
      activa: props.plantilla.activa ?? true,
      productos: (props.plantilla.detalles || []).map(detalle => ({
        product_id: detalle.product_id,
        cantidad: detalle.cantidad,
        observaciones: detalle.observaciones || ''
      }))
    }
  }
})
</script>
