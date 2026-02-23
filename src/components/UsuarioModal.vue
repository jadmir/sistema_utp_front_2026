<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 bg-black bg-opacity-50" @click="closeModal">
    <div class="fixed inset-0 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div @click.stop class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md my-8">
          <!-- Header -->
          <div class="flex justify-between items-center p-6 border-b dark:border-gray-700">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ isEdit ? 'Editar Usuario' : 'Nuevo Usuario' }}
            </h3>
            <button @click="closeModal" aria-label="Cerrar modal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="p-6 max-h-[65vh] overflow-y-auto">
            <!-- Form -->
          <form @submit.prevent="handleSubmit" v-if="!mostrandoPassword" id="usuario-form" class="space-y-4">
            <!-- Nombre -->
            <div>
              <label for="nombre" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre Completo
              </label>
              <input
                id="nombre"
                v-model="form.nombre"
                type="text"
                required
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="Juan Pérez"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="usuario@example.com"
              />
            </div>

            <!-- DNI (solo para usuarios nuevos) -->
            <div v-if="!isEdit">
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
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="12345678"
                @input="form.dni = form.dni.replace(/\D/g, '')"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">8 dígitos numéricos</p>
            </div>

            <!-- Rol -->
            <div>
              <label for="rol_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rol
              </label>
              <select
                id="rol_id"
                v-model="form.rol_id"
                required
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors appearance-none bg-white dark:bg-gray-700"
                style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 1.25rem; padding-right: 2.5rem;"
              >
                <option value="">Seleccione un rol</option>
                <option v-for="rol in rolesValidos" :key="rol.id" :value="rol.id">
                  {{ rol.nombre }}
                </option>
              </select>
            </div>

            <!-- Estado -->
            <div class="pt-2">
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="form.estado"
                  type="checkbox"
                  class="w-4 h-4 text-red-600 border-gray-300 dark:border-gray-600 rounded focus:ring-red-500 dark:bg-gray-700 transition-colors"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Usuario Activo</span>
              </label>
            </div>

            <!-- Error message -->
            <div v-if="errorMessage" class="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm">
              {{ errorMessage }}
            </div>
          </form>

            <!-- Modal de Contraseña Temporal (Fallback cuando falla el correo) -->
            <div v-if="mostrandoPassword" class="text-center">
          <div class="mb-6">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
              <svg class="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">⚠️ Usuario Creado - Correo No Enviado</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">El sistema no pudo enviar el correo automáticamente. Por favor, proporciona estas credenciales al usuario:</p>
            
            <div class="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-3">
              <div class="grid grid-cols-2 gap-3 text-left">
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">NOMBRE</p>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ datosUsuarioCreado.nombre }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">USUARIO (DNI)</p>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white font-mono">{{ datosUsuarioCreado.dni }}</p>
                </div>
              </div>
            </div>

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

            <div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3 mb-6 text-left">
              <p class="text-xs font-medium text-red-800 dark:text-red-300 mb-2">⚠️ Importante:</p>
              <ul class="text-xs text-red-700 dark:text-red-300 space-y-1">
                <li>• El correo automático NO se envió correctamente</li>
                <li>• Comunique estas credenciales al usuario manualmente</li>
                <li>• Use un canal seguro para enviar la información</li>
                <li>• El usuario debe cambiar esta contraseña en el primer inicio de sesión</li>
              </ul>
            </div>
            </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t dark:border-gray-700">
            <div v-if="!mostrandoPassword" class="flex gap-3 justify-end">
            <button
              type="button"
              @click="closeModal"
              class="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="usuario-form"
              :disabled="saving"
              class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ saving ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }}
            </button>
            </div>

            <button
              v-else
              @click="() => { mostrandoPassword = false; emit('save'); closeModal(); }"
              type="button"
              class="w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
            >
              Entendido
            </button>
          </div>
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
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

const { success, error } = useAlert()

const isOpen = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const passwordTemporal = ref('')
const mostrandoPassword = ref(false)
const datosUsuarioCreado = ref({
  nombre: '',
  dni: '',
  email: ''
})

const form = ref({
  nombre: '',
  email: '',
  dni: '',
  rol_id: '',
  estado: true
})

const isEdit = computed(() => !!props.usuario)

const rolesValidos = computed(() => {
  if (!props.roles || !Array.isArray(props.roles)) {
    return []
  }
  
  // Filtrar roles válidos
  const rolesConDatos = props.roles.filter(rol => rol && rol.id && rol.nombre)
  
  // Eliminar duplicados por NOMBRE (no por ID)
  const rolesUnicos = Array.from(
    new Map(rolesConDatos.map(rol => [rol.nombre.toLowerCase(), rol])).values()
  )
  
  return rolesUnicos
})

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
      
      // Verificar si falló el envío del correo (viene password_temporal)
      if (response.data.password_temporal) {
        // FALLBACK: El correo no se envió, mostrar modal con credenciales
        passwordTemporal.value = response.data.password_temporal
        datosUsuarioCreado.value = {
          nombre: response.data.data.nombre,
          dni: response.data.data.dni,
          email: response.data.data.email
        }
        mostrandoPassword.value = true
        
        // Notificar que el correo falló pero el usuario se creó
        error('Correo no enviado', response.data.error_correo || 'El usuario fue creado pero no se pudo enviar el correo. Por favor, proporciona las credenciales manualmente.')
      } else {
        // TODO OK: Correo enviado exitosamente
        const email = response.data.data?.email || data.email
        success(
          'Usuario creado exitosamente', 
          `Se ha enviado un correo a ${email} con las credenciales de acceso.`
        )
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
