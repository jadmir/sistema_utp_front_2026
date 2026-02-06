import api from './api'

export const areasService = {
  // Obtener todas las áreas con filtros y paginación
  getAll(params = {}) {
    return api.get('/areas', { params })
  },

  // Obtener áreas activas (para selectores)
  getActivas() {
    return api.get('/areas/activas')
  },

  // Obtener una área específica
  show(id) {
    return api.get(`/areas/${id}`)
  },

  // Crear nueva área
  create(data) {
    return api.post('/areas', data)
  },

  // Actualizar área existente
  update(id, data) {
    return api.put(`/areas/${id}`, data)
  },

  // Eliminar área
  delete(id) {
    return api.delete(`/areas/${id}`)
  }
}
