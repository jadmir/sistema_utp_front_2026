/**
 * Sistema de logging condicional
 * Solo muestra logs en modo desarrollo
 */

const isDevelopment = import.meta.env.DEV

class Logger {
  log(...args) {
    if (isDevelopment) {
      console.log(...args)
    }
  }

  warn(...args) {
    if (isDevelopment) {
      console.warn(...args)
    }
  }

  error(...args) {
    // Los errores siempre se muestran pero sin información sensible en producción
    if (isDevelopment) {
      console.error(...args)
    } else {
      // En producción solo mostrar mensaje genérico
      console.error('Error en la aplicación. Contacte al administrador.')
    }
  }

  info(...args) {
    if (isDevelopment) {
      console.info(...args)
    }
  }

  debug(...args) {
    if (isDevelopment) {
      console.debug(...args)
    }
  }

  group(label) {
    if (isDevelopment) {
      console.group(label)
    }
  }

  groupEnd() {
    if (isDevelopment) {
      console.groupEnd()
    }
  }
}

export const logger = new Logger()
