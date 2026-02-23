<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-red-700 dark:from-gray-800 dark:to-gray-900 px-4 py-8 sm:py-12">
    <div class="max-w-md w-full">
      <!-- Tarjeta Principal -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8">
        <!-- Logo/Icono -->
        <div class="flex justify-center mb-4 sm:mb-6">
          <div class="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg class="w-7 h-7 sm:w-8 sm:h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
        </div>

        <!-- Título -->
        <h2 class="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
          ¿Olvidaste tu contraseña?
        </h2>
        
        <p class="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <!-- Mensaje de éxito -->
        <div v-if="successMessage" class="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <p class="text-sm text-green-800 dark:text-green-300">{{ successMessage }}</p>
          </div>
        </div>

        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <p class="text-sm text-red-800 dark:text-red-300">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleSubmit">
          <div class="mb-5 sm:mb-6">
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="tucorreo@example.com"
              required
              class="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-400 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              :disabled="loading"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-red-600 dark:bg-red-700 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold hover:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
          >
            <span v-if="!loading">Enviar enlace de recuperación</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
            </span>
          </button>
        </form>

        <!-- Link de regreso -->
        <div class="mt-5 sm:mt-6 text-center">
          <router-link
            to="/login"
            class="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium hover:underline"
          >
            ← Volver al inicio de sesión
          </router-link>
        </div>
      </div>

      <!-- Información adicional -->
      <div class="mt-4 sm:mt-6 text-center">
        <p class="text-xs sm:text-sm text-white/90 dark:text-gray-400">
          ¿No tienes acceso a tu correo? Contacta al administrador del sistema.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const email = ref('')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Validación de formato de email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleSubmit = async () => {
  // Limpiar mensajes previos
  successMessage.value = ''
  errorMessage.value = ''

  // Validar email antes de enviar
  if (!email.value.trim()) {
    errorMessage.value = 'El correo electrónico es obligatorio'
    return
  }

  if (!isValidEmail(email.value)) {
    errorMessage.value = 'Por favor, ingresa un correo electrónico válido'
    return
  }

  loading.value = true

  try {
    const response = await api.post('/password/solicitar-recuperacion', {
      email: email.value
    })

    if (response.data.message) {
      successMessage.value = response.data.message
      email.value = '' // Limpiar el campo
    }
  } catch (error) {
    console.error('Error al solicitar recuperación:', error)
    
    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else if (error.response?.data?.errors?.email) {
      errorMessage.value = error.response.data.errors.email[0]
    } else {
      errorMessage.value = 'Error de conexión. Por favor, intenta nuevamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>
