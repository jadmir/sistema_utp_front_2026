<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click="closeModal">
    <div class="flex items-center justify-center min-h-screen px-2 sm:px-4 py-4 sm:py-8">
      <div class="fixed inset-0 bg-black opacity-50 dark:opacity-70"></div>
      
      <div @click.stop class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[95vh] flex flex-col my-2 sm:my-8">
        <!-- Header -->
        <div class="flex justify-between items-center p-3 sm:p-6 pb-3 sm:pb-4 border-b dark:border-gray-700 flex-shrink-0">
          <h3 class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEdit ? 'Editar Área' : 'Nueva Área' }}
          </h3>
          <button @click="closeModal" aria-label="Cerrar modal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {{ errorMessage }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" id="area-form">
          <!-- Nombre -->
          <div class="mb-4">
            <label for="nombre" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre del Área *
            </label>
            <input
              id="nombre"
              v-model="form.nombre"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Administración"
            />
          </div>

          <!-- Código -->
          <div class="mb-4">
            <label for="codigo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Código *
            </label>
            <input
              id="codigo"
              v-model="form.codigo"
              type="text"
              required
              maxlength="20"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="ADM"
              style="text-transform: uppercase"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Máximo 20 caracteres, único en el sistema
            </p>
          </div>

          <!-- Responsable -->
          <div class="mb-4">
            <label for="responsable" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Responsable
            </label>
            <input
              id="responsable"
              v-model="form.responsable"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Director(a) Administrativo"
            />
          </div>

          <!-- Descripción -->
          <div class="mb-4">
            <label for="descripcion" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              id="descripcion"
              v-model="form.descripcion"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Descripción del área..."
            ></textarea>
          </div>

          <!-- Estado -->
          <div class="mb-6">
            <label class="flex items-center">
              <input
                v-model="form.estado"
                type="checkbox"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Área Activa</span>
            </label>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Las áreas inactivas no aparecerán en los selectores
            </p>
          </div>
        </form>
        </div>

        <!-- Footer -->
        <div class="flex-shrink-0 flex justify-end gap-3 p-6 pt-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="area-form"
            :disabled="saving"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { areasService } from '../../services/areas'
import { useAlert } from '../../composables/useAlert'

const props = defineProps({
  area: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const { success, error } = useAlert()

const isOpen = ref(true)
const saving = ref(false)
const errorMessage = ref('')

const form = ref({
  nombre: '',
  codigo: '',
  descripcion: '',
  responsable: '',
  estado: true
})

const isEdit = computed(() => !!props.area)

watch(() => props.area, (newVal) => {
  if (newVal) {
    form.value = {
      nombre: newVal.nombre,
      codigo: newVal.codigo,
      descripcion: newVal.descripcion || '',
      responsable: newVal.responsable || '',
      estado: newVal.estado
    }
  }
}, { immediate: true })

const closeModal = () => {
  isOpen.value = false
  emit('close')
}

const handleSubmit = async () => {
  errorMessage.value = ''
  saving.value = true
  
  try {
    // Convertir código a mayúsculas
    const data = {
      ...form.value,
      codigo: form.value.codigo.toUpperCase()
    }

    if (isEdit.value) {
      await areasService.update(props.area.id, data)
      success('Área actualizada', 'El área ha sido actualizada correctamente')
    } else {
      await areasService.create(data)
      success('Área creada', 'El área ha sido creada correctamente')
    }
    
    emit('save')
    closeModal()
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Error al guardar el área'
    
    // Mostrar errores de validación específicos
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors
      if (errors.codigo) {
        errorMessage.value = `Código: ${errors.codigo[0]}`
      } else if (errors.nombre) {
        errorMessage.value = `Nombre: ${errors.nombre[0]}`
      }
    }
    
    error('Error', errorMessage.value)
  } finally {
    saving.value = false
  }
}
</script>
