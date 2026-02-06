<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
    <div class="max-w-md w-full">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <!-- Header -->
        <div class="text-center mb-6">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
            <svg class="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Cambio de Contraseña Obligatorio
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            Por seguridad, debe cambiar su contraseña temporal
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Contraseña Actual -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contraseña Actual *
            </label>
            <input
              v-model="form.password_actual"
              type="password"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Contraseña temporal recibida"
            />
          </div>

          <!-- Nueva Contraseña -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nueva Contraseña *
            </label>
            <input
              v-model="form.password_nueva"
              type="password"
              required
              minlength="8"
              @input="validarPassword"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Mínimo 8 caracteres"
            />
            
            <!-- Requisitos de contraseña -->
            <div v-if="form.password_nueva" class="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
              <p class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Requisitos:</p>
              <ul class="space-y-1 text-xs">
                <li :class="requisitos.longitud ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
                  {{ requisitos.longitud ? '✓' : '○' }} Mínimo 8 caracteres
                </li>
                <li :class="requisitos.mayuscula ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
                  {{ requisitos.mayuscula ? '✓' : '○' }} Una letra mayúscula
                </li>
                <li :class="requisitos.minuscula ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
                  {{ requisitos.minuscula ? '✓' : '○' }} Una letra minúscula
                </li>
                <li :class="requisitos.numero ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
                  {{ requisitos.numero ? '✓' : '○' }} Un número
                </li>
              </ul>
            </div>
          </div>

          <!-- Confirmar Contraseña -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmar Nueva Contraseña *
            </label>
            <input
              v-model="form.password_confirmacion"
              type="password"
              required
              minlength="8"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Repita la nueva contraseña"
            />
            <p v-if="form.password_confirmacion && form.password_nueva !== form.password_confirmacion" class="text-xs text-red-600 dark:text-red-400 mt-1">
              Las contraseñas no coinciden
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading || !passwordValida"
            class="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {{ loading ? 'Cambiando...' : 'Cambiar Contraseña' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'
import { useAlert } from '../composables/useAlert'

const router = useRouter()
const authStore = useAuthStore()
const { success, error } = useAlert()

const loading = ref(false)
const errorMessage = ref('')

const form = ref({
  password_actual: '',
  password_nueva: '',
  password_confirmacion: ''
})

const requisitos = ref({
  longitud: false,
  mayuscula: false,
  minuscula: false,
  numero: false
})

const validarPassword = () => {
  const password = form.value.password_nueva
  requisitos.value = {
    longitud: password.length >= 8,
    mayuscula: /[A-Z]/.test(password),
    minuscula: /[a-z]/.test(password),
    numero: /\d/.test(password)
  }
}

const passwordValida = computed(() => {
  return requisitos.value.longitud && 
         requisitos.value.mayuscula && 
         requisitos.value.minuscula && 
         requisitos.value.numero &&
         form.value.password_nueva === form.value.password_confirmacion
})

const handleSubmit = async () => {
  errorMessage.value = ''
  
  if (form.value.password_nueva !== form.value.password_confirmacion) {
    errorMessage.value = 'Las contraseñas no coinciden'
    return
  }

  if (!passwordValida.value) {
    errorMessage.value = 'La contraseña no cumple con los requisitos mínimos'
    return
  }

  loading.value = true
  
  try {
    await api.post('/auth/cambiar-password', form.value)
    
    success('Contraseña cambiada', 'Su contraseña ha sido actualizada. Por favor, inicie sesión nuevamente.')
    
    // Cerrar sesión y redirigir al login
    setTimeout(() => {
      authStore.logout()
      router.push('/login')
    }, 2000)
  } catch (err) {
    if (err.response?.data?.message) {
      errorMessage.value = err.response.data.message
    } else if (err.response?.data?.errors) {
      const errors = Object.values(err.response.data.errors).flat()
      errorMessage.value = errors.join('\n')
    } else {
      errorMessage.value = 'Error al cambiar la contraseña'
    }
    error('Error', errorMessage.value)
  } finally {
    loading.value = false
  }
}
</script>
