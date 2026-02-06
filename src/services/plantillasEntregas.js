import api from './api'

export const plantillasEntregasService = {
  // Listar todas las plantillas
  getAll(params = {}) {
    return api.get('/plantillas-entregas', { params })
  },

  // Obtener una plantilla específica
  getById(id) {
    return api.get(`/plantillas-entregas/${id}`)
  },

  // Crear nueva plantilla
  create(data) {
    return api.post('/plantillas-entregas', data)
  },

  // Actualizar plantilla existente
  update(id, data) {
    return api.put(`/plantillas-entregas/${id}`, data)
  },

  // Eliminar plantilla
  delete(id) {
    return api.delete(`/plantillas-entregas/${id}`)
  },

  // Ejecutar plantilla (acción principal)
  ejecutar(id, data) {
    return api.post(`/plantillas-entregas/${id}/ejecutar`, data)
  }
}
