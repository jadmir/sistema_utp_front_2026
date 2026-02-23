/**
 * Wrapper seguro para localStorage con manejo de errores
 * Previene crashes en modo privado o cuando el storage está lleno
 * 
 * NOTA DE SEGURIDAD:
 * - Los datos en localStorage se almacenan en texto plano (sin cifrado)
 * - Son accesibles mediante JavaScript, lo que los hace vulnerables a ataques XSS
 * - Para ambientes con requisitos de seguridad altos, considerar:
 *   1. Usar httpOnly cookies para tokens sensibles (requiere cambios en backend)
 *   2. Implementar cifrado con Web Crypto API (crypto.subtle)
 *   3. Evitar almacenar datos críticos en localStorage
 * 
 * BUENAS PRÁCTICAS:
 * - No almacenar contraseñas en texto plano
 * - Tokens JWT deben tener expiración corta
 * - Limpiar storage al cerrar sesión
 * - Implementar CSP (Content Security Policy) para mitigar XSS
 */

const storage = {
  /**
   * Obtener un item del localStorage
   * @param {string} key - Clave del item
   * @param {*} defaultValue - Valor por defecto si falla
   * @returns {*} - Valor parseado o defaultValue
   */
  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item !== null ? item : defaultValue
    } catch (error) {
      console.error(`Error al leer ${key} del localStorage:`, error)
      return defaultValue
    }
  },

  /**
   * Obtener un item JSON del localStorage
   * @param {string} key - Clave del item
   * @param {*} defaultValue - Valor por defecto si falla
   * @returns {*} - Objeto parseado o defaultValue
   */
  getItemJSON(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error al parsear ${key} del localStorage:`, error)
      return defaultValue
    }
  },

  /**
   * Guardar un item en localStorage
   * @param {string} key - Clave del item
   * @param {*} value - Valor a guardar
   * @returns {boolean} - true si se guardó correctamente
   */
  setItem(key, value) {
    try {
      localStorage.setItem(key, value)
      return true
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('Storage lleno. Intenta limpiar datos antiguos.')
      } else {
        console.error(`Error al guardar ${key} en localStorage:`, error)
      }
      return false
    }
  },

  /**
   * Guardar un objeto JSON en localStorage
   * @param {string} key - Clave del item
   * @param {*} value - Objeto a guardar
   * @returns {boolean} - true si se guardó correctamente
   */
  setItemJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('Storage lleno. Intenta limpiar datos antiguos.')
      } else {
        console.error(`Error al guardar ${key} en localStorage:`, error)
      }
      return false
    }
  },

  /**
   * Eliminar un item del localStorage
   * @param {string} key - Clave del item
   * @returns {boolean} - true si se eliminó correctamente
   */
  removeItem(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error al eliminar ${key} del localStorage:`, error)
      return false
    }
  },

  /**
   * Limpiar todo el localStorage
   * @returns {boolean} - true si se limpió correctamente
   */
  clear() {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error al limpiar localStorage:', error)
      return false
    }
  },

  /**
   * Verificar si localStorage está disponible
   * @returns {boolean}
   */
  isAvailable() {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (error) {
      return false
    }
  },

  /**
   * Obtener tamaño aproximado del localStorage en bytes
   * Útil para monitorear uso y prevenir QuotaExceededError
   * @returns {number} - Tamaño en bytes
   */
  getStorageSize() {
    try {
      let size = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          size += localStorage[key].length + key.length
        }
      }
      return size
    } catch (error) {
      console.error('Error al calcular tamaño de storage:', error)
      return 0
    }
  },

  /**
   * Verificar si hay datos sensibles almacenados
   * Retorna lista de claves que contienen tokens o datos de usuario
   * @returns {string[]} - Array de claves sensibles
   */
  getSensitiveKeys() {
    const sensitivePatterns = ['token', 'password', 'user', 'auth', 'session']
    const sensitiveKeys = []
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && sensitivePatterns.some(pattern => key.toLowerCase().includes(pattern))) {
          sensitiveKeys.push(key)
        }
      }
    } catch (error) {
      console.error('Error al buscar claves sensibles:', error)
    }
    
    return sensitiveKeys
  }
}

export default storage
