import api from './api'

export const movementsService = {
  // Listar todos los movimientos
  getAll(params = {}) {
    return api.get('/movements', { params })
  },

  // Obtener movimiento específico
  getById(id) {
    return api.get(`/movements/${id}`)
  }
}
