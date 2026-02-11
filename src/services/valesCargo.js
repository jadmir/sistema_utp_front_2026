import api from './api'
import { logger } from '../utils/logger'

export const valesCargoService = {
  /**
   * Listar y buscar vales de cargo
   * @param {Object} params - Parámetros de búsqueda
   * @param {string} params.fecha_desde - Filtrar desde fecha (YYYY-MM-DD)
   * @param {string} params.fecha_hasta - Filtrar hasta fecha (YYYY-MM-DD)
   * @param {string} params.numero_vale - Buscar por número de vale
   * @param {string} params.recibido_por - Buscar por nombre del receptor
   * @param {number} params.area_id - Filtrar por área
   * @param {number} params.per_page - Resultados por página (default: 15)
   * @param {number} params.page - Página actual
   */
  async listar(params = {}) {
    try {
      const response = await api.get('/vales-cargo', { params })
      return response
    } catch (error) {
      logger.error('Error al listar vales de cargo:', error)
      throw error
    }
  },

  /**
   * Descargar vale de cargo previamente generado
   * @param {number} movimientoId - ID del movimiento
   * @param {string} numeroVale - Número del vale (opcional, para el nombre del archivo)
   */
  async descargar(movimientoId, numeroVale = null) {
    try {
      const response = await api.get(`/vales-cargo/${movimientoId}/descargar`, {
        responseType: 'blob'
      })

      // Crear URL del blob
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      
      // Usar número de vale si está disponible, sino usar ID
      const nombreArchivo = numeroVale 
        ? `vale_cargo_${numeroVale}.pdf` 
        : `vale_cargo_${movimientoId}.pdf`
      
      link.setAttribute('download', nombreArchivo)
      
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      // Limpiar URL
      window.URL.revokeObjectURL(url)
      
      return { success: true }
    } catch (error) {
      logger.error('Error al descargar vale de cargo:', error)
      throw error
    }
  },

  /**
   * Generar PDF de vale de cargo (nuevo o regenerar)
   * @param {number} movimientoId - ID del movimiento
   */
  async generarPDF(movimientoId) {
    try {
      const response = await api.get(`/reportes/pdf/vale-cargo/${movimientoId}`, {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `vale_cargo_${movimientoId}.pdf`)
      
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      window.URL.revokeObjectURL(url)
      
      return { success: true }
    } catch (error) {
      logger.error('Error al generar PDF de vale de cargo:', error)
      throw error
    }
  }
}
