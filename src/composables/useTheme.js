import { ref } from 'vue'
import { logger } from '../utils/logger'
import storage from '../utils/storage'

const isDark = ref(false)

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
    logger.log('🌓 Tema cambiado a:', isDark.value ? 'oscuro' : 'claro')
  }

  const applyTheme = () => {
    const html = document.documentElement
    
    if (isDark.value) {
      html.classList.add('dark')
      storage.setItem('theme', 'dark')
      logger.log('🌙 Modo oscuro aplicado')
    } else {
      html.classList.remove('dark')
      storage.setItem('theme', 'light')
      logger.log('☀️ Modo claro aplicado')
    }
  }

  const initTheme = () => {
    // Leer preferencia guardada o usar preferencia del sistema
    const savedTheme = storage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    logger.log('🔍 Tema guardado:', savedTheme)
    logger.log('🔍 Preferencia del sistema:', prefersDark ? 'oscuro' : 'claro')

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      isDark.value = true
    } else {
      isDark.value = false
    }
    
    applyTheme()
  }

  return {
    isDark,
    toggleTheme,
    initTheme
  }
}
