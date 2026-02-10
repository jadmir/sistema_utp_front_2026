<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[95vh] flex flex-col my-2 sm:my-8">
      <div class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center rounded-t-lg flex-shrink-0">
        <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
          {{ deposito ? 'Editar Depósito' : 'Nuevo Depósito' }}
        </h2>
        <button @click="$emit('close')" aria-label="Cerrar modal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto">
        <div class="p-3 sm:p-6 space-y-3 sm:space-y-4">
        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Depósito *</label>
          <input
            v-model="form.nombre"
            type="text"
            required
            maxlength="100"
            class="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            placeholder="DEPOSITO 1 - VU - PRIMER PISO"
          />
        </div>

        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código</label>
          <input
            v-model="form.codigo"
            type="text"
            maxlength="20"
            class="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            placeholder="DEP-01"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Código opcional para identificación rápida</p>
        </div>

        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ubicación</label>
          <input
            v-model="form.ubicacion"
            type="text"
            maxlength="200"
            class="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            placeholder="Edificio A - Primer piso"
          />
        </div>

        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
          <textarea
            v-model="form.descripcion"
            rows="3"
            maxlength="500"
            class="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            placeholder="Descripción del depósito, tipo de productos que almacena, etc."
          ></textarea>
        </div>

        <div class="flex items-center gap-2">
          <input
            v-model="form.activo"
            type="checkbox"
            class="w-4 h-4 text-red-600 border-gray-300 dark:border-gray-600 rounded focus:ring-red-500 dark:bg-gray-700"
          />
          <label class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Depósito activo</label>
        </div>
        </div>

        <div class="flex justify-end gap-2 sm:gap-3 p-3 sm:p-6 pt-3 sm:pt-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
          <button
            type="button"
            @click="$emit('close')"
            class="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg font-semibold disabled:opacity-50 transition-all duration-200"
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
import { depositosService } from '../../services/depositos'
import { useAlert } from '../../composables/useAlert'

const props = defineProps({
  deposito: Object
})

const emit = defineEmits(['close', 'save'])

const { success, error } = useAlert()
const loading = ref(false)

const form = ref({
  nombre: '',
  codigo: '',
  ubicacion: '',
  descripcion: '',
  activo: true
})

const handleSubmit = async () => {
  loading.value = true
  try {
    // Convertir activo a booleano para enviar al backend
    const data = {
      ...form.value,
      activo: form.value.activo ? 1 : 0
    }

    if (props.deposito) {
      await depositosService.update(props.deposito.id, data)
      success('Depósito actualizado', 'El depósito ha sido actualizado correctamente')
    } else {
      await depositosService.create(data)
      success('Depósito creado', 'El depósito ha sido creado correctamente')
    }
    
    emit('save')
  } catch (err) {
    error('Error al guardar', err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.deposito) {
    form.value = {
      nombre: props.deposito.nombre || '',
      codigo: props.deposito.codigo || '',
      ubicacion: props.deposito.ubicacion || '',
      descripcion: props.deposito.descripcion || '',
      activo: props.deposito.activo === 1 || props.deposito.activo === true
    }
  }
})
</script>
