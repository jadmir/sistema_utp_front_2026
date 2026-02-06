import api from './api'
import { logger } from '../utils/logger'

export const reportesService = {
  // Función genérica para descargar reportes
  async descargarReporte(endpoint, params = {}, nombreArchivo = null) {
    try {
      // Limpiar parámetros vacíos o null
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== '')
      )
      
      const response = await api.get(`/reportes/${endpoint}`, {
        params: cleanParams,
        responseType: 'blob'
      })
      
      // Crear URL del blob
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      
      // Usar nombre proporcionado o generar uno
      const timestamp = new Date().getTime()
      link.setAttribute('download', nombreArchivo || `reporte_${endpoint}_${timestamp}.xlsx`)
      
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      // Limpiar URL
      window.URL.revokeObjectURL(url)
      
      return { success: true }
    } catch (error) {
      logger.error('Error descargando reporte:', error)
      throw error
    }
  },

  // 1. Reporte General de Productos
  async reporteProductos(params = {}) {
    return this.descargarReporte('productos', params, `inventario_productos_${Date.now()}.xlsx`)
  },

  // 2. Reporte de Stock Bajo
  async reporteStockBajo(params = {}) {
    return this.descargarReporte('stock-bajo', params, `stock_bajo_${Date.now()}.xlsx`)
  },

  // 3. Reporte Próximos a Vencer
  async reporteProximosVencer(params = {}) {
    return this.descargarReporte('proximos-vencer', params, `proximos_vencer_${Date.now()}.xlsx`)
  },

  // 4. Reporte Productos Vencidos
  async reporteVencidos(params = {}) {
    return this.descargarReporte('vencidos', params, `vencidos_${Date.now()}.xlsx`)
  },

  // 5. Reporte de Movimientos
  async reporteMovimientos(params = {}) {
    return this.descargarReporte('movimientos', params, `movimientos_${Date.now()}.xlsx`)
  },

  // 6. Kardex de Producto
  async reporteKardex(productId, params = {}) {
    if (!productId) {
      throw new Error('El ID del producto es requerido para generar el Kardex')
    }
    return this.descargarReporte('kardex', { ...params, product_id: productId }, `kardex_producto_${productId}_${Date.now()}.xlsx`)
  },

  // 7. Reporte por Tipo de Stock
  async reporteTipoStock(params = {}) {
    return this.descargarReporte('tipo-stock', params, `tipo_stock_${Date.now()}.xlsx`)
  },

  // 8. Reporte por Sección
  async reporteSeccion(params = {}) {
    return this.descargarReporte('seccion', params, `seccion_${Date.now()}.xlsx`)
  },

  // ==================== REPORTES PDF ====================
  
  /**
   * Función genérica para descargar reportes PDF
   * @param {string} endpoint - Ruta del endpoint (sin /reportes/pdf/)
   * @param {Object} params - Parámetros de consulta
   * @param {string} nombreArchivo - Nombre del archivo a descargar
   */
  async descargarReportePDF(endpoint, params = {}, nombreArchivo = null) {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== '')
      )
      
      const response = await api.get(`/reportes/pdf/${endpoint}`, {
        params: cleanParams,
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      
      // Usar nombre proporcionado o generar uno
      const timestamp = Date.now()
      link.setAttribute('download', nombreArchivo || `reporte_${endpoint}_${timestamp}.pdf`)
      
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      return { success: true }
    } catch (error) {
      logger.error('Error descargando reporte PDF:', error)
      throw error
    }
  },

  // PDF: Reporte General de Productos
  async reporteProductosPDF(params = {}) {
    return this.descargarReportePDF('productos', params, `inventario_productos_${Date.now()}.pdf`)
  },

  // PDF: Reporte de Stock Bajo
  async reporteStockBajoPDF(params = {}) {
    return this.descargarReportePDF('stock-bajo', params, `stock_bajo_${Date.now()}.pdf`)
  },

  // PDF: Reporte Próximos a Vencer
  async reporteProximosVencerPDF(params = {}) {
    return this.descargarReportePDF('proximos-vencer', params, `proximos_vencer_${Date.now()}.pdf`)
  },

  // PDF: Reporte de Movimientos
  async reporteMovimientosPDF(params = {}) {
    return this.descargarReportePDF('movimientos', params, `movimientos_${Date.now()}.pdf`)
  },

  // PDF: Kardex de Producto
  async reporteKardexPDF(productId, params = {}) {
    if (!productId) {
      throw new Error('El ID del producto es requerido para generar el Kardex')
    }
    return this.descargarReportePDF('kardex', { ...params, product_id: productId }, `kardex_producto_${productId}_${Date.now()}.pdf`)
  },

  // PDF: Reporte Productos Vencidos
  async reporteVencidosPDF(params = {}) {
    return this.descargarReportePDF('vencidos', params, `vencidos_${Date.now()}.pdf`)
  },

  // PDF: Reporte por Sección
  async reporteSeccionPDF(params = {}) {
    return this.descargarReportePDF('seccion', params, `seccion_${Date.now()}.pdf`)
  },

  // PDF: Reporte por Tipo de Stock
  async reporteTipoStockPDF(params = {}) {
    return this.descargarReportePDF('tipo-stock', params, `tipo_stock_${Date.now()}.pdf`)
  }
}
