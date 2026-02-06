import api from './api'

export const permisosService = {
  // Obtener todos los permisos
  async getAll() {
    const response = await api.get('/permissions')
    return response.data
  },

  // Obtener un permiso por ID
  async getById(id) {
    const response = await api.get(`/permissions/${id}`)
    return response.data
  },

  // Crear un nuevo permiso
  async create(permiso) {
    const response = await api.post('/permissions', permiso)
    return response.data
  },

  // Actualizar un permiso
  async update(id, permiso) {
    const response = await api.put(`/permissions/${id}`, permiso)
    return response.data
  },

  // Eliminar un permiso
  async delete(id) {
    const response = await api.delete(`/permissions/${id}`)
    return response.data
  },

  // Obtener permisos de un rol
  async getPermisosByRole(roleId) {
    const response = await api.get(`/roles/${roleId}/permisos`)
    return response.data
  },

  // Asignar permisos a un rol
  async assignPermisosToRole(roleId, permissionIds) {
    const response = await api.post(`/roles/${roleId}/permisos`, {
      permission_ids: permissionIds
    })
    return response.data
  },

  // Quitar un permiso de un rol
  async removePermisoFromRole(roleId, permissionId) {
    const response = await api.delete(`/roles/${roleId}/permisos/${permissionId}`)
    return response.data
  }
}
