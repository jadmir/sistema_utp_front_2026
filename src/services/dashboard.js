import api from './api'

export const dashboardService = {
  // Obtener dashboard completo con todas las tablas
  getDashboard() {
    return api.get('/dashboard')
  },

  // Obtener solo estadísticas
  getEstadisticas() {
    return api.get('/dashboard/estadisticas')
  }
}
