import api from './api'

export const stockTypesService = {
  // Listar todos los tipos de stock
  getAll() {
    return api.get('/stock-types')
  },

  // Obtener tipo de stock específico
  getById(id) {
    return api.get(`/stock-types/${id}`)
  },

  // Crear tipo de stock
  create(data) {
    return api.post('/stock-types', data)
  },

  // Actualizar tipo de stock
  update(id, data) {
    return api.put(`/stock-types/${id}`, data)
  },

  // Eliminar tipo de stock
  delete(id) {
    return api.delete(`/stock-types/${id}`)
  }
}
