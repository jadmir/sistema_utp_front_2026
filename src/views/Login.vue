<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-red-700 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
    <!-- Patrón de fondo geométrico -->
    <div class="absolute inset-0 opacity-10 dark:opacity-5">
      <div class="absolute inset-0" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px);"></div>
    </div>
    
    <div class="w-full max-w-md px-6 relative z-10">
      <!-- Encabezado rojo con icono -->
      <div class="bg-red-600 dark:bg-gray-800 rounded-t-2xl pt-8 pb-6 px-8 text-center shadow-lg">
        <!-- Icono de caja -->
        <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white dark:text-gray-100 mb-2">Sistema de Almacén</h1>
        <p class="text-white/90 dark:text-gray-300">Bienvenido de vuelta</p>
      </div>

      <!-- Formulario de login -->
      <div class="bg-white dark:bg-gray-800 rounded-b-2xl shadow-2xl p-8">
        <form @submit.prevent="handleLogin">
          <!-- Email -->
          <div class="mb-5">
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Correo Electrónico
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="tu@correo.com"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contraseña
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="!showPassword" class="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Recordar sesión y Olvidaste contraseña -->
          <div class="flex items-center justify-between mb-6">
            <label class="flex items-center">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 text-red-600 border-gray-300 dark:border-gray-600 rounded focus:ring-red-500 dark:bg-gray-700"
              />
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Recordar sesión</span>
            </label>
            <button type="button" @click.prevent="() => {}" class="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium">
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <!-- Error message -->
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm flex items-start">
            <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Botón de login -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center"
          >
            <span v-if="!loading" class="flex items-center justify-center">
              Iniciar Sesión
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando...
            </span>
          </button>
        </form>

        <!-- Footer -->
        <div class="text-center mt-6">
          <p class="text-gray-500 dark:text-gray-400 text-xs">© 2026 Sistema de Almacén UTP. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useAlert } from '../composables/useAlert'

const authStore = useAuthStore()
const { error: showError } = useAlert()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

const handleLogin = async (event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  
  loading.value = true
  // NO limpiar errorMessage aquí para que persista hasta que haya un éxito
  
  try {
    await authStore.login(form.value)
    // Solo limpiar el error si el login fue exitoso
    errorMessage.value = ''
  } catch (error) {
    
    const errorMsg = error.response?.data?.message || 'Error al iniciar sesión'
    const errorDetails = error.response?.data?.errors

    
    // Mostrar error en el formulario
    errorMessage.value = errorMsg
    
    // Limpiar el mensaje después de 5 segundos
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
    
    // Si hay errores de validación específicos, mostrarlos
    if (errorDetails) {
      const allErrors = Object.values(errorDetails).flat().join(', ')
      showError(errorMsg, allErrors)
    } else {
      showError(errorMsg)
    }
  } finally {
    loading.value = false
  }

}

</script>
