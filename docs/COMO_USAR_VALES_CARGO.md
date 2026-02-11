# 🎯 Guía Rápida: Nuevo Tab de Vales de Cargo

## ✅ ¿Qué se agregó?

Se ha agregado un **nuevo tab "Vales de Cargo"** en la vista de Inventario, justo después de "Movimientos".

---

## 🚀 Cómo Acceder

1. **Ir a la vista Inventario**
   - Desde el menú lateral o navegación principal

2. **Buscar el tab "Vales de Cargo"**
   - Aparece entre "Movimientos" y "Reportes"
   - Ícono: 📄 (documento con checkmark)

3. **Click en el tab**
   - Se carga automáticamente el componente
   - Muestra el formulario de búsqueda y tabla de resultados

---

## 🔍 Funcionalidades Disponibles

### 1. Búsqueda de Vales

**Filtros disponibles:**
```
┌─────────────────────────────────────────────────┐
│ [Número de vale]  [Nombre receptor]             │
│ [Área ▼]  [Fecha desde]  [Fecha hasta]          │
│ [Buscar] [Limpiar]                              │
└─────────────────────────────────────────────────┘
```

**Ejemplos de búsqueda:**

**Por número exacto:**
```
Número de vale: VC-2026-0089
Click en "Buscar"
→ Muestra solo ese vale
```

**Por receptor:**
```
Nombre: María
Click en "Buscar"
→ Muestra todos los vales recibidos por personas llamadas María
```

**Por área y fecha:**
```
Área: Administración
Desde: 2026-02-01
Hasta: 2026-02-11
Click en "Buscar"
→ Muestra todos los vales de Administración en febrero
```

---

### 2. Tabla de Resultados

**Columnas mostradas:**
- **Número Vale**: VC-2026-NNNN (en naranja)
- **Fecha**: DD/MM/YYYY
- **Producto**: Nombre y código
- **Cantidad**: Número + unidad de medida
- **Recibido por**: Nombre completo + cargo
- **DNI**: Documento del receptor
- **Área**: Código del área (ej: ADM)
- **Acciones**: Botones de descarga y ver detalles

---

### 3. Acciones por Vale

**📄 Botón "Vale":**
- Descarga el PDF guardado en el servidor
- No regenera, descarga directamente
- Nombre del archivo: `vale_cargo_VC-2026-NNNN.pdf`

**👁️ Botón "Ver":**
- Abre modal con información completa:
  - Datos generales (número, fecha, entregador, área)
  - Datos del producto (código, nombre, cantidad)
  - Datos del receptor (nombre, DNI, cargo, observaciones)
- Incluye botón de descarga en el modal

---

## 📊 Vista Previa

```
┌─────────────────────────────────────────────────────────────┐
│ 🏢 Sistema de Inventario                                    │
│ Gestiona productos, stock y movimientos                     │
├─────────────────────────────────────────────────────────────┤
│ [Productos] [Categorías] [Tipos] [Áreas] [Depósitos]       │
│ [Movimientos] [🔍 Vales de Cargo] [Reportes] [Plantillas]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🔍 Buscar Vales de Cargo                                   │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ [VC-2026-0001] [Juan Pérez] [Admin▼] [01/02] [11/02] │ │
│ │ [Buscar] [Limpiar]                                     │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────┬──────┬─────────┬──────┬──────────┬──────┬────────┐│
│ │Vale │Fecha │Producto │Cant. │Recibido  │DNI   │Acciones││
│ ├─────┼──────┼─────────┼──────┼──────────┼──────┼────────┤│
│ │VC-89│11/02 │Papel A4 │50 und│María G.  │12345 │📄 👁️  ││
│ │VC-88│10/02 │Toner HP │2 und │Juan P.   │98765 │📄 👁️  ││
│ │VC-87│09/02 │Lapiceros│100und│Ana L.    │45678 │📄 👁️  ││
│ └─────┴──────┴─────────┴──────┴──────────┴──────┴────────┘│
│                                                             │
│ Mostrando 1 a 15 de 25 vales                    [◄ 1 2 ►] │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Casos de Uso Comunes

### Caso 1: ¿Qué entregué hoy?

```
1. Ir a "Vales de Cargo"
2. Filtrar:
   - Fecha desde: 2026-02-11
   - Fecha hasta: 2026-02-11
3. Click "Buscar"
→ Ver todas las salidas del día
```

### Caso 2: ¿Cuánto material recibió Juan?

```
1. Ir a "Vales de Cargo"
2. Escribir en "Nombre receptor": Juan
3. Click "Buscar"
→ Ver todos los vales de Juan con cantidades
```

### Caso 3: Necesito reimprimir un vale

```
1. Ir a "Vales de Cargo"
2. Buscar por número: VC-2026-0089
   O buscar por fecha/receptor
3. Click en "📄 Vale"
→ PDF descargado instantáneamente
```

### Caso 4: Auditoría de entregas a un área

```
1. Ir a "Vales de Cargo"
2. Seleccionar área: Administración
3. Seleccionar rango: 01/01/2026 - 31/01/2026
4. Click "Buscar"
→ Ver todas las entregas del mes
→ Descargar vales individuales si necesario
```

---

## ⚡ Características Técnicas

- ✅ **Lazy Loading**: Componente se carga solo cuando se activa el tab
- ✅ **Caché**: Tab activo se guarda en localStorage
- ✅ **Permisos**: Requiere permiso `inventario.ver`
- ✅ **Responsive**: Funciona en móvil, tablet y desktop
- ✅ **Modo Oscuro**: Compatible con tema claro/oscuro
- ✅ **Paginación**: 15 vales por página
- ✅ **Descarga Rápida**: PDFs desde servidor, no regenera

---

## 🔧 Permisos Necesarios

| Usuario | Puede Acceder |
|---------|---------------|
| Administrador | ✅ Sí |
| Con permiso `inventario.ver` | ✅ Sí |
| Sin permisos | ❌ No (tab no aparece) |

---

## 📝 Notas Importantes

1. **Los vales solo aparecen para salidas (SALIDA)**
   - Las entradas no generan vales
   - Solo movimientos con `numero_vale` se muestran

2. **PDFs guardados en servidor**
   - Ubicación: `storage/app/vales_cargo/YYYY/MM/`
   - No se regeneran al descargar
   - Siempre disponibles como evidencia

3. **Búsqueda parcial en receptor**
   - "Juan" encontrará "Juan Pérez", "María Juana", etc.
   - No distingue mayúsculas/minúsculas

4. **Filtros combinables**
   - Puedes usar varios filtros a la vez
   - Ejemplo: Área + Fecha + Receptor

---

## ✅ Verificar que Funciona

**Pasos de prueba:**

1. ✅ Ir a Inventario
2. ✅ Ver el tab "Vales de Cargo" entre Movimientos y Reportes
3. ✅ Click en el tab
4. ✅ Ver formulario de búsqueda
5. ✅ Click en "Buscar" (sin filtros)
6. ✅ Ver tabla con todos los vales registrados
7. ✅ Click en "📄 Vale" en cualquier fila
8. ✅ Verificar que se descarga el PDF
9. ✅ Click en "👁️ Ver" en cualquier fila
10. ✅ Ver modal con detalles completos

---

## 🎉 ¡Listo para Usar!

El tab "Vales de Cargo" ahora está completamente integrado y funcional en tu sistema.

**Ubicación:** Inventario → Tab "Vales de Cargo"

**Fecha de implementación:** 11 de Febrero de 2026
