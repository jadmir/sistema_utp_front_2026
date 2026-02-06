import api from './api'

export const productsService = {
  // Listar todos los productos (con paginación y filtros)
  getAll(params = {}) {
    return api.get('/products', { params })
  },

  // Obtener producto específico
  getById(id) {
    return api.get(`/products/${id}`)
  },

  // Crear producto
  create(data) {
    return api.post('/products', data)
  },

  // Actualizar producto
  update(id, data) {
    return api.put(`/products/${id}`, data)
  },

  // Eliminar producto (soft delete)
  delete(id) {
    return api.delete(`/products/${id}`)
  },

  // Registrar entrada de stock
  registerEntry(id, data) {
    return api.post(`/products/${id}/entrada`, data)
  },

  // Registrar salida de stock
  registerExit(id, data) {
    return api.post(`/products/${id}/salida`, data)
  },

  // Registrar ajuste de stock
  registerAdjustment(id, data) {
    return api.post(`/products/${id}/ajuste`, data)
  },

  // Obtener productos con stock bajo
  getStockAlerts() {
    return api.get('/products/alertas/stock-bajo')
  },

  // Registrar entrada masiva de stock
  entradaMasiva(data) {
    return api.post('/products/entrada-masiva', data)
  },

  // Registrar salida masiva de stock
  salidaMasiva(data) {
    return api.post('/products/salida-masiva', data)
  },

  // Historial de movimientos de un producto
  getHistory(id) {
    return api.get(`/products/${id}/historial`)
  }
}
