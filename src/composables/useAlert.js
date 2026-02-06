import { ref } from 'vue'

let alertInstance = null
let confirmInstance = null

export function useAlert() {
  const setAlertInstance = (instance) => {
    alertInstance = instance
  }

  const setConfirmInstance = (instance) => {
    confirmInstance = instance
  }

  const showAlert = ({ title, message, type = 'info' }) => {
    if (alertInstance) {
      return alertInstance.addAlert({ title, message, type })
    } else {
      console.error('❌ No hay alertInstance disponible!')
    }
  }

  const success = (title, message = '') => {
    return showAlert({ title, message, type: 'success' })
  }

  const error = (title, message = '') => {
    return showAlert({ title, message, type: 'error' })
  }

  const warning = (title, message = '') => {
    return showAlert({ title, message, type: 'warning' })
  }

  const info = (title, message = '') => {
    return showAlert({ title, message, type: 'info' })
  }

  const confirm = async (title, message = '') => {
    if (confirmInstance) {
      return await confirmInstance.show({ title, message })
    } else {
      console.error('❌ No hay confirmInstance disponible!')
      // Fallback a window.confirm si no hay instancia
      return window.confirm(message || title)
    }
  }

  return {
    setAlertInstance,
    setConfirmInstance,
    showAlert,
    success,
    error,
    warning,
    info,
    confirm
  }
}
