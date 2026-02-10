import api from './api'

export const depositosService = {
  // Listar todos los depósitos
  getAll(params = {}) {
    return api.get('/depositos', { params })
  },

  // Obtener depósitos activos (para selects)
  async getActivos() {
    try {
      // Intentar endpoint específico primero
      return await api.get('/depositos/activos')
    } catch (error) {
      // Si falla, usar endpoint principal con filtro o devolver array vacío
      console.warn('⚠️ Endpoint /depositos/activos no disponible, usando fallback')
      try {
        return await api.get('/depositos', { params: { activo: 1 } })
      } catch (fallbackError) {
        console.warn('⚠️ Fallback de depósitos también falló, devolviendo array vacío')
        return { data: { data: [] } }
      }
    }
  },

  // Obtener un depósito por ID
  getById(id) {
    return api.get(`/depositos/${id}`)
  },

  // Crear nuevo depósito
  create(data) {
    return api.post('/depositos', data)
  },

  // Actualizar depósito
  update(id, data) {
    return api.put(`/depositos/${id}`, data)
  },

  // Eliminar depósito
  delete(id) {
    return api.delete(`/depositos/${id}`)
  }
}
