<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 py-8">
        <div class="fixed inset-0 transition-opacity bg-black bg-opacity-50 dark:bg-opacity-70" @click="closeModal"></div>

        <div class="relative inline-block w-full max-w-lg my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl max-h-[90vh] flex flex-col">
          <!-- Header -->
          <div class="flex justify-between items-center p-6 pb-4 border-b dark:border-gray-700 flex-shrink-0">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ isEditMode ? 'Editar Permiso' : 'Nuevo Permiso' }}
            </h3>
            <button @click="closeModal" aria-label="Cerrar modal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto">
          <!-- Form -->
          <form @submit.prevent="handleSubmit" id="permiso-form" class="p-6 space-y-4">
            <!-- Módulo -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Módulo</label>
              <select
                v-model="form.modulo"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Seleccionar módulo</option>
                <option v-for="modulo in modulos" :key="modulo" :value="modulo">{{ modulo }}</option>
              </select>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Selecciona el módulo del sistema</p>
            </div>

            <!-- Nombre -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
              <input
                v-model="form.nombre"
                type="text"
                required
                placeholder="Ej: Ver Dashboard"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <!-- Slug -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slug</label>
              <input
                v-model="form.slug"
                type="text"
                required
                placeholder="Ej: dashboard.ver"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Formato recomendado: modulo.accion</p>
            </div>

            <!-- Descripción -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
              <textarea
                v-model="form.descripcion"
                rows="3"
                placeholder="Descripción del permiso"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>
          </form>
          </div>

          <!-- Footer -->
          <div class="flex-shrink-0 flex justify-end space-x-3 p-6 pt-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="permiso-form"
                :disabled="loading"
                class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition disabled:opacity-50 flex items-center space-x-2"
              >
                <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ loading ? 'Guardando...' : 'Guardar' }}</span>
              </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getNombresModulos } from '../config/modulos'

const props = defineProps({
  show: Boolean,
  permiso: Object,
  isEditMode: Boolean
})

const emit = defineEmits(['close', 'submit'])

const modulos = getNombresModulos()

const form = ref({
  nombre: '',
  slug: '',
  descripcion: '',
  modulo: ''
})

const loading = ref(false)

watch(() => props.show, (newVal) => {
  if (newVal && props.permiso && props.isEditMode) {
    form.value = { ...props.permiso }
  } else if (newVal && !props.isEditMode) {
    resetForm()
  }
})

const resetForm = () => {
  form.value = {
    nombre: '',
    slug: '',
    descripcion: '',
    modulo: ''
  }
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const handleSubmit = async () => {
  loading.value = true
  try {
    await emit('submit', form.value)
    closeModal()
  } finally {
    loading.value = false
  }
}
</script>
