// Módulos del sistema
export const MODULOS_SISTEMA = [
  {
    nombre: 'Dashboard',
    icono: 'home',
    descripcion: 'Panel principal del sistema'
  },
  {
    nombre: 'Usuarios',
    icono: 'users',
    descripcion: 'Gestión de usuarios del sistema'
  },
  {
    nombre: 'Permisos',
    icono: 'lock',
    descripcion: 'Gestión de permisos y roles'
  },
  {
    nombre: 'Inventario',
    icono: 'package',
    descripcion: 'Sistema de inventario completo'
  },
  {
    nombre: 'Almacén',
    icono: 'warehouse',
    descripcion: 'Gestión de productos del almacén'
  },
  {
    nombre: 'Reportes',
    icono: 'chart',
    descripcion: 'Reportes y estadísticas'
  },
  {
    nombre: 'Configuración',
    icono: 'settings',
    descripcion: 'Configuración general del sistema'
  }
]

// Acciones comunes por módulo
export const ACCIONES_COMUNES = [
  { nombre: 'Ver', slug: 'ver', descripcion: 'Visualizar' },
  { nombre: 'Crear', slug: 'crear', descripcion: 'Crear nuevos registros' },
  { nombre: 'Editar', slug: 'editar', descripcion: 'Modificar registros existentes' },
  { nombre: 'Eliminar', slug: 'eliminar', descripcion: 'Eliminar registros' },
  { nombre: 'Entrada', slug: 'entrada', descripcion: 'Registrar entradas de stock' },
  { nombre: 'Salida', slug: 'salida', descripcion: 'Registrar salidas de stock' },
  { nombre: 'Ajustar', slug: 'ajustar', descripcion: 'Ajustar stock' },
  { nombre: 'Exportar', slug: 'exportar', descripcion: 'Exportar datos' }
]

// Función para generar slug de permiso
export const generarSlugPermiso = (modulo, accion) => {
  return `${modulo.toLowerCase()}.${accion.toLowerCase()}`
}

// Función para obtener nombres de módulos
export const getNombresModulos = () => {
  return MODULOS_SISTEMA.map(m => m.nombre)
}
