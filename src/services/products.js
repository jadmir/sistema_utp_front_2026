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
  },

  // Descargar Vale de Cargo (PDF)
  async descargarValeCargo(movimientoId) {
    try {
      const response = await api.get(`/reportes/pdf/vale-cargo/${movimientoId}`, {
        responseType: 'blob'
      })

      // Crear URL del blob
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `vale_cargo_${movimientoId}.pdf`)
      
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      // Limpiar URL
      window.URL.revokeObjectURL(url)
      
      return { success: true }
    } catch (error) {
      console.error('Error descargando vale de cargo:', error)
      throw error
    }
  }
}
