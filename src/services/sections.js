import api from './api'

export const sectionsService = {
  // Listar todas las secciones
  getAll(params = {}) {
    return api.get('/sections', { params })
  },

  // Obtener sección específica
  getById(id) {
    return api.get(`/sections/${id}`)
  },

  // Crear sección
  create(data) {
    return api.post('/sections', data)
  },

  // Actualizar sección
  update(id, data) {
    return api.put(`/sections/${id}`, data)
  },

  // Eliminar sección
  delete(id) {
    return api.delete(`/sections/${id}`)
  },

  // Obtener próximo código disponible
  getNextCode(sectionId) {
    return api.get(`/sections/${sectionId}/next-code`)
  }
}
