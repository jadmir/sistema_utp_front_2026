<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click="closeModal">
    <div class="flex items-center justify-center min-h-screen px-4 py-8">
      <div class="fixed inset-0 bg-black opacity-50 dark:opacity-70"></div>
      
      <div @click.stop class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col my-8">
        <!-- Header -->
        <div class="flex justify-between items-center p-6 pb-4 border-b dark:border-gray-700 flex-shrink-0">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEdit ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
        <!-- Form -->
        <form @submit.prevent="handleSubmit" v-if="!mostrandoPassword" id="usuario-form">
          <!-- Nombre -->
          <div class="mb-4">
            <label for="nombre" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre Completo
            </label>
            <input
              id="nombre"
              v-model="form.nombre"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Juan Pérez"
            />
          </div>

          <!-- Email -->
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Correo Electrónico
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="usuario@example.com"
            />
          </div>

          <!-- DNI (solo para usuarios nuevos) -->
          <div v-if="!isEdit" class="mb-4">
            <label for="dni" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              DNI *
            </label>
            <input
              id="dni"
              v-model="form.dni"
              type="text"
              required
              maxlength="8"
              pattern="[0-9]{8}"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="12345678"
              @input="form.dni = form.dni.replace(/\D/g, '')"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">8 dígitos numéricos</p>
          </div>

          <!-- Rol -->
          <div class="mb-4">
            <label for="rol_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rol
            </label>
            <select
              id="rol_id"
              v-model="form.rol_id"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Seleccione un rol</option>
              <option v-for="rol in roles" :key="rol.id" :value="rol.id">
                {{ rol.nombre }}
              </option>
            </select>
          </div>

          <!-- Estado -->
          <div class="mb-6">
            <label class="flex items-center">
              <input
                v-model="form.estado"
                type="checkbox"
                class="w-4 h-4 text-red-600 border-gray-300 dark:border-gray-600 rounded focus:ring-red-500 dark:bg-gray-700"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Usuario Activo</span>
            </label>
          </div>

          <!-- Error message -->
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {{ errorMessage }}
          </div>
        </form>

        <!-- Modal de Contraseña Temporal -->
        <div v-if="mostrandoPassword" class="text-center">
          <div class="mb-6">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">¡Usuario Creado Exitosamente!</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Comunique esta contraseña temporal al usuario:</p>
            
            <div class="bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
              <p class="text-xs text-blue-700 dark:text-blue-300 font-medium mb-2">CONTRASEÑA TEMPORAL</p>
              <p class="text-3xl font-mono font-bold text-blue-900 dark:text-blue-300 mb-2">{{ passwordTemporal }}</p>
              <button
                @click="copiarPassword"
                type="button"
                class="inline-flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 font-medium transition-all duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copiar
              </button>
            </div>

            <div class="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mb-6 text-left">
              <p class="text-xs font-medium text-yellow-800 dark:text-yellow-300 mb-2">⚠️ Importante:</p>
              <ul class="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• El usuario debe cambiar esta contraseña en el primer inicio de sesión</li>
                <li>• Comunique la contraseña por un canal seguro</li>
                <li>• Esta ventana se cerrará al hacer clic en "Entendido"</li>
              </ul>
            </div>
          </div>
        </div>
        </div>

        <!-- Footer (fuera del scroll) -->
        <div class="flex-shrink-0 p-6 pt-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div v-if="!mostrandoPassword" class="flex justify-end space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="usuario-form"
              :disabled="saving"
              class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ saving ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }}
            </button>
          </div>

          <button
            v-else
            @click="() => { mostrandoPassword = false; emit('save'); closeModal(); }"
            type="button"
            class="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { usuariosService } from '../services/usuarios'
import { useAlert } from '../composables/useAlert'

const props = defineProps({
  usuario: {
    type: Object,
    default: null
  },
  roles: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const { success, error } = useAlert()

const isOpen = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const passwordTemporal = ref('')
const mostrandoPassword = ref(false)

const form = ref({
  nombre: '',
  email: '',
  dni: '',
  rol_id: '',
  estado: true
})

const isEdit = computed(() => !!props.usuario)

watch(() => props.usuario, (newVal) => {
  if (newVal) {
    form.value = {
      nombre: newVal.nombre,
      email: newVal.email,
      dni: newVal.dni || '',
      rol_id: newVal.rol_id,
      estado: newVal.estado
    }
  }
}, { immediate: true })

const closeModal = () => {
  isOpen.value = false
  emit('close')
}

const copiarPassword = () => {
  navigator.clipboard.writeText(passwordTemporal.value)
  success('Copiado', 'Contraseña copiada al portapapeles')
}

const handleSubmit = async () => {
  errorMessage.value = ''
  
  // Validar DNI para nuevos usuarios
  if (!isEdit.value && form.value.dni.length !== 8) {
    errorMessage.value = 'El DNI debe tener exactamente 8 dígitos'
    return
  }

  saving.value = true
  
  try {
    const data = { ...form.value }

    if (isEdit.value) {
      await usuariosService.update(props.usuario.id, data)
      success('Usuario actualizado', 'El usuario ha sido actualizado correctamente')
      emit('save')
      closeModal()
    } else {
      const response = await usuariosService.create(data)
      
      // Mostrar contraseña temporal
      if (response.data.password_temporal) {
        passwordTemporal.value = response.data.password_temporal
        mostrandoPassword.value = true
      } else {
        success('Usuario creado', 'El usuario ha sido creado correctamente')
        emit('save')
        closeModal()
      }
    }
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Error al guardar el usuario'
    error('Error', errorMessage.value)
  } finally {
    saving.value = false
  }
}
</script>
