<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-red-700 dark:from-gray-800 dark:to-gray-900 px-4 py-8 sm:py-12">
    <div class="max-w-md w-full">
      <!-- Enlace inválido -->
      <div v-if="!isValidLink" class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-center">
        <div class="flex justify-center mb-4 sm:mb-6">
          <div class="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg class="w-7 h-7 sm:w-8 sm:h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Enlace Inválido</h2>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-5 sm:mb-6">
          El enlace de recuperación no es válido o ha expirado.
        </p>
        <router-link
          to="/login"
          class="inline-block w-full bg-red-600 dark:bg-red-700 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold hover:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all shadow-lg"
        >
          Ir al inicio de sesión
        </router-link>
      </div>

      <!-- Formulario de restablecimiento -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8">
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
          Restablecer Contraseña
        </h2>
        
        <p class="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
          Ingresa tu nueva contraseña
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

        <!-- Mensajes de error -->
        <div v-if="errorMessages.length > 0" class="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <div class="text-sm text-red-800 dark:text-red-300">
              <p v-for="(error, index) in errorMessages" :key="index">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleSubmit">
          <!-- Campo de contraseña -->
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nueva contraseña
            </label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                placeholder="••••••••"
                minlength="8"
                required
                class="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-400 transition-all pr-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                :disabled="loading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Campo de confirmación -->
          <div class="mb-5 sm:mb-6">
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmar contraseña
            </label>
            <div class="relative">
              <input
                :type="showPasswordConfirmation ? 'text' : 'password'"
                id="password_confirmation"
                v-model="passwordConfirmation"
                placeholder="••••••••"
                minlength="8"
                required
                class="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-400 transition-all pr-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                :disabled="loading"
              />
              <button
                type="button"
                @click="showPasswordConfirmation = !showPasswordConfirmation"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg v-if="!showPasswordConfirmation" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Requisitos de contraseña -->
          <div class="mb-5 sm:mb-6 bg-red-50 dark:bg-gray-700/50 border border-red-200 dark:border-gray-600 rounded-lg p-3 sm:p-4">
            <p class="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">La contraseña debe contener:</p>
            <ul class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li class="flex items-center">
                <span :class="password.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'" class="mr-2">✓</span>
                Mínimo 8 caracteres
              </li>
              <li class="flex items-center">
                <span :class="/[A-Z]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'" class="mr-2">✓</span>
                Al menos una letra mayúscula
              </li>
              <li class="flex items-center">
                <span :class="/[a-z]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'" class="mr-2">✓</span>
                Al menos una letra minúscula
              </li>
              <li class="flex items-center">
                <span :class="/[0-9]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'" class="mr-2">✓</span>
                Al menos un número
              </li>
            </ul>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-red-600 dark:bg-red-700 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold hover:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
          >
            <span v-if="!loading">Restablecer contraseña</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const route = useRoute()

const isValidLink = ref(true)
const token = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const loading = ref(false)
const successMessage = ref('')
const errorMessages = ref([])

// Validación de contraseña segura
const isValidPassword = (password) => {
  // Al menos 8 caracteres, una mayúscula, una minúscula y un número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return passwordRegex.test(password)
}

const validatePassword = () => {
  const errors = []
  
  if (!password.value) {
    errors.push('La contraseña es obligatoria')
    return errors
  }
  
  if (password.value.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres')
  }
  
  if (!/[A-Z]/.test(password.value)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula')
  }
  
  if (!/[a-z]/.test(password.value)) {
    errors.push('La contraseña debe contener al menos una letra minúscula')
  }
  
  if (!/\d/.test(password.value)) {
    errors.push('La contraseña debe contener al menos un número')
  }
  
  return errors
}

onMounted(() => {
  // Obtener parámetros de la URL
  token.value = route.query.token || ''
  email.value = route.query.email || ''

  // Validar que existan los parámetros
  if (!token.value || !email.value) {
    isValidLink.value = false
  }
})

const handleSubmit = async () => {
  // Limpiar mensajes previos
  successMessage.value = ''
  errorMessages.value = []

  // Validar contraseña
  const passwordErrors = validatePassword()
  if (passwordErrors.length > 0) {
    errorMessages.value = passwordErrors
    return
  }

  // Validar que las contraseñas coincidan
  if (password.value !== passwordConfirmation.value) {
    errorMessages.value = ['Las contraseñas no coinciden']
    return
  }

  // Validar contraseña con regex completo
  if (!isValidPassword(password.value)) {
    errorMessages.value = ['La contraseña no cumple con todos los requisitos de seguridad']
    return
  }

  loading.value = true

  try {
    const response = await api.post('/password/restablecer', {
      email: email.value,
      token: token.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })

    if (response.data.message) {
      successMessage.value = response.data.message
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  } catch (error) {
    console.error('Error al restablecer contraseña:', error)
    
    if (error.response?.data?.errors) {
      // Extraer todos los errores del objeto de validación
      const errors = error.response.data.errors
      errorMessages.value = Object.values(errors).flat()
    } else if (error.response?.data?.message) {
      errorMessages.value = [error.response.data.message]
    } else {
      errorMessages.value = ['Error de conexión. Por favor, intenta nuevamente.']
    }
  } finally {
    loading.value = false
  }
}
</script>
