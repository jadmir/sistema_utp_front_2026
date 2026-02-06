<template>
  <MainLayout v-if="!isLoginPage">
    <router-view />
  </MainLayout>
  
  <div v-else>
    <router-view />
  </div>

  <AlertContainer ref="alertContainer" />
  <ConfirmDialog ref="confirmDialog" />
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import AlertContainer from './components/AlertContainer.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import MainLayout from './components/MainLayout.vue'
import { useAlert } from './composables/useAlert'
import { useTheme } from './composables/useTheme'

const route = useRoute()
const authStore = useAuthStore()
const alertContainer = ref(null)
const confirmDialog = ref(null)
const { setAlertInstance, setConfirmInstance } = useAlert()
const { initTheme } = useTheme()

const isLoginPage = computed(() => {
  return route.path === '/login' || route.path === '/cambiar-password'
})

onMounted(() => {
  // Inicializar tema
  initTheme()
  
  if (alertContainer.value) {
    setAlertInstance(alertContainer.value)
  }
  
  if (confirmDialog.value) {
    setConfirmInstance(confirmDialog.value)
  }
})
</script>
