<template>
  <transition-group
    name="alert"
    tag="div"
    class="fixed top-4 right-4 z-50 space-y-3 max-w-sm"
  >
    <div
      v-for="alert in alerts"
      :key="alert.id"
      :class="[
        'w-full shadow-lg rounded-lg pointer-events-auto overflow-hidden',
        alertClasses[alert.type]
      ]"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <!-- Icono de éxito -->
            <svg v-if="alert.type === 'success'" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <!-- Icono de error -->
            <svg v-else-if="alert.type === 'error'" class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <!-- Icono de warning -->
            <svg v-else-if="alert.type === 'warning'" class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <!-- Icono de info -->
            <svg v-else class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <p :class="['text-sm font-medium', textClasses[alert.type]]">
              {{ alert.title }}
            </p>
            <p v-if="alert.message" :class="['mt-1 text-sm', textSecondaryClasses[alert.type]]">
              {{ alert.message }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="removeAlert(alert.id)"
              :class="['rounded-md inline-flex', buttonClasses[alert.type]]"
            >
              <span class="sr-only">Cerrar</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition-group>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'

const alerts = ref([])
const alertTimeouts = new Map() // Guardar referencias a timeouts

const alertClasses = {
  success: 'bg-green-50 border border-green-200',
  error: 'bg-red-50 border border-red-200',
  warning: 'bg-yellow-50 border border-yellow-200',
  info: 'bg-blue-50 border border-blue-200'
}

const textClasses = {
  success: 'text-green-800',
  error: 'text-red-800',
  warning: 'text-yellow-800',
  info: 'text-blue-800'
}

const textSecondaryClasses = {
  success: 'text-green-700',
  error: 'text-red-700',
  warning: 'text-yellow-700',
  info: 'text-blue-700'
}

const buttonClasses = {
  success: 'text-green-400 hover:text-green-500 focus:outline-none',
  error: 'text-red-400 hover:text-red-500 focus:outline-none',
  warning: 'text-yellow-400 hover:text-yellow-500 focus:outline-none',
  info: 'text-blue-400 hover:text-blue-500 focus:outline-none'
}

const addAlert = (alert) => {
  const id = Date.now()
  const timestamp = new Date().toLocaleTimeString()
  alerts.value.push({ ...alert, id, timestamp })
  
  // Configurar duración según el tipo de alerta
  let duration = 5000
  if (alert.type === 'success') {
    duration = 4000
  } else if (alert.type === 'error') {
    duration = 5000
  } else if (alert.type === 'warning' || alert.type === 'info') {
    duration = 6000
  }
  
  // Guardar referencia del timeout para limpiarlo si es necesario
  const timeoutId = setTimeout(() => {
    removeAlert(id)
    alertTimeouts.delete(id)
  }, duration)
  
  alertTimeouts.set(id, timeoutId)
  
  return id
}

const removeAlert = (id) => {
  const index = alerts.value.findIndex(a => a.id === id)
  if (index > -1) {
    alerts.value.splice(index, 1)
  }
  
  // Limpiar timeout si existe
  if (alertTimeouts.has(id)) {
    clearTimeout(alertTimeouts.get(id))
    alertTimeouts.delete(id)
  }
}

// Limpiar todos los timeouts al desmontar el componente
onBeforeUnmount(() => {
  alertTimeouts.forEach(timeoutId => clearTimeout(timeoutId))
  alertTimeouts.clear()
})

defineExpose({
  addAlert,
  removeAlert
})
</script>

<style scoped>
.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s ease;
}

.alert-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.alert-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
