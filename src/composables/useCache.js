import { ref } from 'vue'
import { logger } from '../utils/logger'

/**
 * Sistema de caché en memoria con TTL (Time To Live) y límite de tamaño
 * Evita solicitudes redundantes al servidor
 */

// Store global de caché (compartido entre componentes)
const cache = new Map()
const MAX_CACHE_SIZE = 100 // Límite máximo de entradas en caché

/**
 * Composable para manejar caché de datos
 * @param {number} defaultTTL - Tiempo de vida por defecto en milisegundos (default: 2 minutos)
 */
export function useCache(defaultTTL = 120000) {
  const loading = ref(false)

  /**
   * Generar clave única para el caché basada en endpoint y parámetros
   */
  const generateCacheKey = (key, params = {}) => {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, k) => {
        if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
          acc[k] = params[k]
        }
        return acc
      }, {})
    
    return `${key}:${JSON.stringify(sortedParams)}`
  }

  /**
   * Verificar si un item en caché es válido
   */
  const isCacheValid = (cacheKey) => {
    const cached = cache.get(cacheKey)
    if (!cached) return false

    const now = Date.now()
    const isValid = now - cached.timestamp < cached.ttl

    if (!isValid) {
      cache.delete(cacheKey)
      logger.log(`🗑️ Caché expirado: ${cacheKey}`)
    }

    return isValid
  }

  /**
   * Obtener datos del caché o del servidor
   * @param {string} key - Clave base para el caché
   * @param {Function} fetchFunction - Función async que obtiene los datos del servidor
   * @param {Object} params - Parámetros para la consulta
   * @param {number} ttl - Tiempo de vida personalizado (opcional)
   * @param {boolean} forceRefresh - Forzar actualización ignorando caché
   */
  const getCachedData = async (key, fetchFunction, params = {}, ttl = defaultTTL, forceRefresh = false) => {
    const cacheKey = generateCacheKey(key, params)

    // Si no es forzado y hay caché válido, retornarlo
    if (!forceRefresh && isCacheValid(cacheKey)) {
      const cached = cache.get(cacheKey)
      logger.log(`✅ Usando caché: ${key}`, {
        age: `${Math.round((Date.now() - cached.timestamp) / 1000)}s`,
        ttl: `${Math.round(cached.ttl / 1000)}s`
      })
      return cached.data
    }

    // Obtener datos frescos del servidor
    loading.value = true
    try {
      logger.log(`🌐 Obteniendo del servidor: ${key}`)
      const data = await fetchFunction(params)

      // Verificar límite de caché antes de guardar
      if (cache.size >= MAX_CACHE_SIZE) {
        // Eliminar la entrada más antigua (LRU simple)
        const firstKey = cache.keys().next().value
        cache.delete(firstKey)
        logger.log(`🗑️ Caché lleno, eliminada entrada más antigua: ${firstKey}`)
      }

      // Guardar en caché
      cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl
      })

      logger.log(`💾 Guardado en caché: ${key} (${cache.size}/${MAX_CACHE_SIZE})`)
      return data
    } finally {
      loading.value = false
    }
  }

  /**
   * Invalidar caché específico o toda la caché
   * @param {string} key - Clave base (opcional, si no se proporciona limpia todo)
   * @param {Object} params - Parámetros específicos (opcional)
   */
  const invalidateCache = (key = null, params = null) => {
    if (!key) {
      // Limpiar toda la caché
      const count = cache.size
      cache.clear()
      logger.log(`🗑️ Caché completa limpiada (${count} items)`)
      return
    }

    if (params !== null) {
      // Invalidar caché específico
      const cacheKey = generateCacheKey(key, params)
      cache.delete(cacheKey)
      logger.log(`🗑️ Caché invalidado: ${cacheKey}`)
    } else {
      // Invalidar todos los items que comiencen con la clave
      let count = 0
      for (const cacheKey of cache.keys()) {
        if (cacheKey.startsWith(key + ':')) {
          cache.delete(cacheKey)
          count++
        }
      }
      logger.log(`🗑️ Caché invalidado: ${key} (${count} items)`)
    }
  }

  /**
   * Obtener estadísticas del caché
   */
  const getCacheStats = () => {
    const stats = {
      total: cache.size,
      valid: 0,
      expired: 0,
      items: []
    }

    const now = Date.now()
    for (const [key, value] of cache.entries()) {
      const age = now - value.timestamp
      const isValid = age < value.ttl

      if (isValid) {
        stats.valid++
      } else {
        stats.expired++
      }

      stats.items.push({
        key,
        age: Math.round(age / 1000),
        ttl: Math.round(value.ttl / 1000),
        valid: isValid
      })
    }

    return stats
  }

  /**
   * Limpiar caché expirado
   */
  const cleanExpiredCache = () => {
    const now = Date.now()
    let count = 0

    for (const [key, value] of cache.entries()) {
      if (now - value.timestamp >= value.ttl) {
        cache.delete(key)
        count++
      }
    }

    if (count > 0) {
      logger.log(`🧹 Limpieza de caché: ${count} items expirados eliminados`)
    }

    return count
  }

  return {
    loading,
    getCachedData,
    invalidateCache,
    getCacheStats,
    cleanExpiredCache,
    generateCacheKey,
    isCacheValid
  }
}
