<template>
  <div v-if="isVisible" class="fixed inset-0 z-[100] overflow-y-auto" @click.self="cancel">
    <div class="flex items-center justify-center min-h-screen px-4">
      <!-- Overlay -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75" @click="cancel"></div>

      <!-- Modal -->
      <div class="relative inline-block bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-lg z-[101]">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {{ title }}
              </h3>
              <div v-if="message" class="mt-2">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ message }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
          <button
            @click="confirm"
            type="button"
            class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Aceptar
          </button>
          <button
            @click="cancel"
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isVisible = ref(false)
const title = ref('')
const message = ref('')
let resolvePromise = null

const show = (options) => {
  return new Promise((resolve) => {
    title.value = options.title || '¿Confirmar acción?'
    message.value = options.message || ''
    isVisible.value = true
    resolvePromise = resolve
  })
}

const confirm = () => {
  isVisible.value = false
  if (resolvePromise) resolvePromise(true)
}

const cancel = () => {
  isVisible.value = false
  if (resolvePromise) resolvePromise(false)
}

defineExpose({
  show
})
</script>
