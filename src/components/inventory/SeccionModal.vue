<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[95vh] flex flex-col my-2 sm:my-8">
      <div class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center rounded-t-lg flex-shrink-0">
        <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
          {{ seccion ? 'Editar Tipo de Artículo' : 'Nuevo Tipo de Artículo' }}
        </h2>
        <button @click="$emit('close')" aria-label="Cerrar modal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto">
        <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría *</label>
          <select
            v-model="form.stock_type_id"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Seleccionar tipo</option>
            <option v-for="tipo in stockTypes" :key="tipo.id" :value="tipo.id">
              {{ tipo.nombre }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código *</label>
          <input
            v-model="form.codigo"
            type="text"
            required
            maxlength="50"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            placeholder="ASSOF"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Único dentro de la categoría</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre *</label>
          <input
            v-model="form.nombre"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            placeholder="Artículos de oficina"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
          <textarea
            v-model="form.descripcion"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            placeholder="Descripción del tipo de artículo"
          ></textarea>
        </div>

        <div class="flex items-center gap-2">
          <input
            v-model="form.estado"
            type="checkbox"
            class="w-4 h-4 text-red-600 border-gray-300 dark:border-gray-600 rounded focus:ring-red-500 dark:bg-gray-700"
          />
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Activa</label>
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
            class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
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
import { sectionsService } from '../../services/sections'
import { useAlert } from '../../composables/useAlert'

const props = defineProps({
  seccion: Object,
  stockTypes: Array
})

const emit = defineEmits(['close', 'save'])

const { success, error } = useAlert()
const loading = ref(false)

const form = ref({
  stock_type_id: '',
  codigo: '',
  nombre: '',
  descripcion: '',
  estado: true
})

const handleSubmit = async () => {
  loading.value = true
  try {
    if (props.seccion) {
      await sectionsService.update(props.seccion.id, form.value)
      success('Tipo actualizado', 'El tipo de artículo ha sido actualizado correctamente')
    } else {
      await sectionsService.create(form.value)
      success('Tipo creado', 'El tipo de artículo ha sido creado correctamente')
    }
    
    emit('save')
  } catch (err) {
    error('Error al guardar', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.seccion) {
    form.value = {
      stock_type_id: props.seccion.stock_type_id,
      codigo: props.seccion.codigo,
      nombre: props.seccion.nombre,
      descripcion: props.seccion.descripcion || '',
      estado: props.seccion.estado
    }
  }
})
</script>
