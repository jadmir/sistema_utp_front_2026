import api from './api'

export const usuariosService = {
  // Listar usuarios
  getAll() {
    return api.get('/usuarios')
  },

  // Obtener usuario por ID
  getById(id) {
    return api.get(`/usuarios/${id}`)
  },

  // Crear usuario
  create(data) {
    return api.post('/usuarios', data)
  },

  // Actualizar usuario
  update(id, data) {
    return api.put(`/usuarios/${id}`, data)
  },

  // Eliminar usuario (soft delete)
  delete(id) {
    return api.delete(`/usuarios/${id}`)
  },

  // Obtener usuarios eliminados
  getTrashed() {
    return api.get('/usuarios-eliminados')
  },

  // Restaurar usuario
  restore(id) {
    return api.post(`/usuarios/${id}/restaurar`)
  },

  // Forzar eliminación permanente
  forceDelete(id) {
    return api.delete(`/usuarios/${id}/forzar-eliminacion`)
  },

  // Obtener permisos de un usuario
  getPermisos(id) {
    return api.get(`/usuarios/${id}/permisos`)
  },

  // Asignar permisos a un usuario
  assignPermisos(id, data) {
    // Soportar ambos formatos: objeto con arrays o array directo (legacy)
    if (Array.isArray(data)) {
      // Formato legacy: solo array de IDs
      return api.post(`/usuarios/${id}/permisos`, {
        permission_ids: data,
        remove_all: data.length === 0
      })
    } else {
      // Formato nuevo: objeto con permisos adicionales y revocados
      return api.post(`/usuarios/${id}/permisos`, {
        permission_ids: data.permission_ids || [],
        revoked_permission_ids: data.revoked_permission_ids || [],
        remove_all: (data.permission_ids || []).length === 0 && (data.revoked_permission_ids || []).length === 0
      })
    }
  },

  // Quitar un permiso de un usuario
  removePermiso(id, permissionId) {
    return api.delete(`/usuarios/${id}/permisos/${permissionId}`)
  }
}

export const rolesService = {
  // Listar roles
  getAll() {
    return api.get('/roles')
  }
}
