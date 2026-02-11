# 📄 Sistema de Vale de Cargo - Frontend

## ✅ Implementación Completada

El sistema de Vale de Cargo ha sido completamente integrado en el frontend Vue.js.

---

## 🎯 Funcionalidades Implementadas

### 1. Formulario de Salida con Datos del Receptor

Al registrar una **salida de productos**, ahora el formulario incluye:

**Campos del Vale de Cargo (obligatorios):**
- ✅ **Recibido por**: Nombre completo del receptor
- ✅ **DNI del receptor**: 8 dígitos numéricos
- ✅ **Cargo del receptor**: Puesto o función
- ✅ **Observaciones del receptor**: Información adicional (opcional)

**Archivo:** [MovimientoModal.vue](../src/components/inventory/MovimientoModal.vue)

### 2. Descarga Automática del Vale

Cuando se registra una salida exitosamente:
1. El sistema genera el movimiento en el backend
2. El backend retorna el `movimiento_id` y `numero_vale`
3. El frontend **automáticamente descarga el PDF** del vale de cargo
4. Se muestra una notificación con el número de vale generado

### 3. Descarga Manual desde Historial

En la tabla de movimientos ([MovimientosTab.vue](../src/components/inventory/MovimientosTab.vue)):
- ✅ Nueva columna "Acciones"
- ✅ Botón "📄 Vale" para movimientos de SALIDA
- ✅ Descarga directa del PDF con un click
- ✅ Solo visible para movimientos que tienen `numero_vale`

---

## 🔧 Archivos Modificados

### 1. `src/components/inventory/MovimientoModal.vue`

**Cambios realizados:**
```vue
<!-- Nuevos campos agregados al formulario (solo para SALIDAS) -->
<div v-if="tipo === 'salida'" class="border-t border-gray-300 dark:border-gray-600 pt-4">
  <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 mb-4">
    <p class="text-sm font-semibold text-orange-900 dark:text-orange-300 mb-1">📄 Vale de Cargo</p>
    <p class="text-xs text-orange-700 dark:text-orange-400">
      Se generará un vale de cargo que debe ser firmado por quien entrega y quien recibe.
    </p>
  </div>

  <!-- Campos del receptor -->
  <input v-model="form.recibido_por" required />
  <input v-model="form.dni_receptor" pattern="\d{8}" required />
  <input v-model="form.cargo_receptor" required />
  <textarea v-model="form.observaciones_receptor" />
</div>
```

**Datos enviados al backend:**
```javascript
const data = {
  cantidad: form.value.cantidad,
  motivo: form.value.motivo,
  observaciones: form.value.observaciones,
  fecha_movimiento: form.value.fecha_movimiento,
  area_id: parseInt(form.value.area_id),
  
  // Nuevos campos del Vale de Cargo
  recibido_por: form.value.recibido_por,
  dni_receptor: form.value.dni_receptor,
  cargo_receptor: form.value.cargo_receptor,
  observaciones_receptor: form.value.observaciones_receptor
}
```

**Auto-descarga del PDF:**
```javascript
const response = await productsService.registerExit(props.producto.id, data)
movimientoId = response.data?.data?.movimiento_id
numeroVale = response.data?.data?.numero_vale

if (numeroVale) {
  success('Salida registrada', `Vale: ${numeroVale}`)
  
  // Auto-descargar el PDF
  await productsService.descargarValeCargo(movimientoId)
}
```

---

### 2. `src/services/products.js`

**Nueva función agregada:**
```javascript
// Descargar Vale de Cargo (PDF)
async descargarValeCargo(movimientoId) {
  try {
    const response = await api.get(`/reportes/pdf/vale-cargo/${movimientoId}`, {
      responseType: 'blob'
    })

    // Crear URL del blob y descargar
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
    console.error('Error descargando vale de cargo:', error)
    throw error
  }
}
```

**Uso:**
```javascript
import { productsService } from '@/services/products'

// Descargar vale de cargo
await productsService.descargarValeCargo(123)
```

---

### 3. `src/services/reportes.js`

**Nueva función agregada:**
```javascript
// Vale de Cargo PDF
async descargarValeCargo(movimientoId) {
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
    logger.error('Error descargando vale de cargo:', error)
    throw error
  }
}
```

**Uso:**
```javascript
import { reportesService } from '@/services/reportes'

// Descargar vale
await reportesService.descargarValeCargo(123)
```

---

### 4. `src/components/inventory/ValesCargoTab.vue`

**Nuevo componente de búsqueda de vales:**

1. **Formulario de búsqueda avanzada:**
```vue
<div class="filtros-busqueda">
  <input v-model="filters.numero_vale" placeholder="Número de vale" />
  <input v-model="filters.recibido_por" placeholder="Receptor" />
  <select v-model="filters.area_id">Áreas</select>
  <input v-model="filters.fecha_desde" type="date" />
  <input v-model="filters.fecha_hasta" type="date" />
  <button @click="buscarVales">Buscar</button>
</div>
```

2. **Tabla de resultados:**
- Muestra todos los vales encontrados
- Columnas: Número, Fecha, Producto, Cantidad, Receptor, DNI, Área, Acciones
- Botón de descarga por cada vale
- Botón "Ver detalles" con modal

3. **Modal de detalles:**
- Información completa del vale
- Datos del producto
- Datos del receptor
- Opción de descarga

4. **Paginación:**
- 15 resultados por página (configurable)
- Navegación entre páginas

---

### 5. `src/services/valesCargo.js`

**Nuevo service especializado:**

```javascript
import { valesCargoService } from '@/services/valesCargo'

// Listar vales con filtros
await valesCargoService.listar({
  numero_vale: 'VC-2026-0001',
  recibido_por: 'Juan',
  area_id: 1,
  fecha_desde: '2026-02-01',
  fecha_hasta: '2026-02-11',
  page: 1,
  per_page: 15
})

// Descargar vale guardado
await valesCargoService.descargar(movimientoId, numeroVale)

// Generar/regenerar PDF
await valesCargoService.generarPDF(movimientoId)
```

---

**Nuevas funcionalidades:**

1. **Nueva columna en la tabla:**
```vue
<th class="px-4 py-3 text-left text-xs font-medium">Acciones</th>
```

2. **Botón de descarga por movimiento:**
```vue
<td class="px-4 py-3 text-sm">
  <button
    v-if="movimiento.tipo === 'SALIDA' && movimiento.numero_vale"
    @click="descargarVale(movimiento.id, movimiento.numero_vale)"
    class="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded transition"
    title="Descargar Vale de Cargo"
  >
    📄 Vale
  </button>
  <span v-else class="text-gray-400 text-xs">-</span>
</td>
```

3. **Función de descarga:**
```javascript
const descargarVale = async (movimientoId, numeroVale) => {
  if (descargandoVale.value === movimientoId) return
  
  descargandoVale.value = movimientoId
  try {
    await reportesService.descargarValeCargo(movimientoId)
    success('Vale descargado', `Vale ${numeroVale} descargado exitosamente`)
  } catch (err) {
    error('Error al descargar vale', err.response?.data?.message)
  } finally {
    descargandoVale.value = null
  }
}
```

---

## 📱 Flujo de Usuario Completo

### Registro de Salida

1. **Usuario accede al inventario**
   - Click en la pestaña "Productos"
   - Busca el producto deseado

2. **Inicia una salida**
   - Click en el botón "📤 Salida" del producto
   - Se abre el modal de salida

3. **Completa el formulario**
   ```
   Datos de la Salida:
   - Cantidad: 50
   - Fecha: 2026-02-11
   - Área destino: Administración
   - Motivo: Material de oficina mensual
   - Observaciones: (opcional)
   
   Datos del Receptor (Vale de Cargo):
   - Recibido por: María García López
   - DNI: 12345678
   - Cargo: Coordinadora de Área
   - Observaciones: Material en buen estado
   ```

4. **Envía el formulario**
   - Click en "Registrar Salida"
   - ⏳ Sistema procesa la solicitud

5. **Respuesta del sistema**
   - ✅ Notificación: "Salida registrada. Vale: VC-2026-0089"
   - 📥 Se descarga automáticamente: `vale_cargo_123.pdf`

6. **Acciones siguientes**
   - Imprimir el vale descargado
   - Entregar los productos físicamente
   - Firmar el vale (entregador y receptor)
   - Archivar el vale firmado

### Descarga Manual desde Historial

1. **Usuario accede a movimientos**
   - Click en la pestaña "Movimientos"

2. **Busca el movimiento**
   - Filtros disponibles: tipo, área, fechas
   - Identifica la salida por fecha o producto

3. **Descarga el vale**
   - Click en el botón "📄 Vale"
   - Se descarga el PDF inmediatamente
   - ✅ Notificación: "Vale VC-2026-0089 descargado"

---

## 🔍 Validaciones del Frontend

### Campos Obligatorios

```javascript
// Validación automática HTML5
<input required />
<input pattern="\d{8}" required /> // DNI: exactamente 8 dígitos
```

### Validaciones Personalizadas

1. **Cantidad vs Stock Disponible**
   ```javascript
   if (tipo === 'salida' && cantidad > stock_actual) {
     error('Stock insuficiente')
     return
   }
   ```

2. **Área Requerida en Salidas**
   ```javascript
   if (tipo === 'salida' && !area_id) {
     error('Área requerida')
     return
   }
   ```

3. **DNI Formato**
   - Pattern: `\d{8}` (8 dígitos numéricos)
   - Maxlength: 8

---

## 🎨 Estilos y UX

### Vista del Modal (Modo Oscuro Compatible)

```css
/* Sección del Vale de Cargo */
.bg-orange-50 dark:bg-orange-900/20
.text-orange-900 dark:text-orange-300

/* Botones */
.bg-orange-600 hover:bg-orange-700 text-white

/* Estados de carga */
loading ? 'Guardando...' : 'Registrar Salida'
```

### Notificaciones

- ✅ **Éxito**: Verde
- ❌ **Error**: Rojo
- ℹ️ **Info**: Azul

---

## 📊 Datos Almacenados

### En el Backend (tabla `movements`)

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| `numero_vale` | string(20) | VC-2026-0089 |
| `recibido_por` | string(255) | María García López |
| `dni_receptor` | string(20) | 12345678 |
| `cargo_receptor` | string(100) | Coordinadora de Área |
| `observaciones_receptor` | text | Material en buen estado |

### Respuesta del Backend

```json
{
  "status": "success",
  "message": "Salida de stock registrada exitosamente",
  "data": {
    "movimiento_id": 123,
    "numero_vale": "VC-2026-0089",
    "producto": {...},
    "stock_anterior": 100,
    "stock_actual": 50,
    "cantidad_retirada": 50
  }
}
```

---

## 🐛 Manejo de Errores

### Errores del Backend

```javascript
try {
  await productsService.registerExit(id, data)
} catch (err) {
  // Errores de validación
  if (err.response?.data?.errors) {
    // Mostrar errores específicos por campo
    Object.keys(err.response.data.errors).forEach(campo => {
      error(`${campo}: ${err.response.data.errors[campo][0]}`)
    })
  } else {
    // Error genérico
    error('Error al registrar', err.response?.data?.message)
  }
}
```

### Errores de Descarga de PDF

```javascript
try {
  await productsService.descargarValeCargo(movimientoId)
} catch (pdfError) {
  // No bloquear el flujo principal
  console.error('Error al descargar vale:', pdfError)
  error('Vale generado pero no se pudo descargar', 
        'Puede descargarlo desde el historial')
}
```

---

## 🧪 Pruebas Sugeridas

### 1. Registro de Salida con Vale

```bash
✅ Completar todos los campos y enviar
✅ Validar que el PDF se descarga automáticamente
✅ Validar que aparece el número de vale en la notificación
✅ Verificar que el DNI solo acepta 8 dígitos
✅ Intentar salida con stock insuficiente (debe fallar)
✅ Intentar salida sin área seleccionada (debe fallar)
```

### 2. Descarga Manual

```bash
✅ Ir a la pestaña Movimientos
✅ Buscar una salida reciente
✅ Click en botón "📄 Vale"
✅ Validar que se descarga el PDF
✅ Validar que el botón solo aparece en SALIDAS
✅ Validar que no aparece en ENTRADAS
```

### 3. Modo Oscuro

```bash
✅ Cambiar a modo oscuro
✅ Validar que todos los elementos se vean correctamente
✅ Validar legibilidad de textos
✅ Validar contraste de botones
```

---

## 📌 Notas Importantes

1. **Auto-descarga**
   - El PDF se descarga automáticamente tras registrar la salida
   - Si falla, no bloquea el proceso
   - El usuario puede descargarlo manualmente después

2. **Campos obligatorios**
   - Todos los campos del receptor son obligatorios
   - DNI debe tener exactamente 8 dígitos
   - Solo aplica para SALIDAS

3. **Numeración del Vale**
   - El número se genera automáticamente en el backend
   - Formato: `VC-YYYY-NNNN`
   - Es único e irrepetible

4. **Compatibilidad**
   - Compatible con modo claro/oscuro
   - Responsive (móvil, tablet, desktop)
   - Funciona con todos los navegadores modernos

---

## 🔗 Endpoints Utilizados

### Registrar Salida
```
POST /api/products/{id}/salida

Body: {
  cantidad, motivo, area_id, fecha_movimiento,
  observaciones, recibido_por, dni_receptor,
  cargo_receptor, observaciones_receptor
}
```

### Descargar Vale de Cargo
```
GET /api/reportes/pdf/vale-cargo/{movimientoId}

Response: application/pdf (blob)
```

---

## ✅ Checklist de Implementación

- [x] Agregar campos del receptor al formulario de salida
- [x] Validar campos en el frontend
- [x] Enviar datos al backend en el formato correcto
- [x] Recibir `movimiento_id` y `numero_vale` del backend
- [x] Auto-descargar PDF tras registro exitoso
- [x] Mostrar número de vale en notificación
- [x] Agregar columna de acciones en tabla de movimientos
- [x] Agregar botón de descarga manual
- [x] Implementar función de descarga en services
- [x] Manejar errores de validación
- [x] Manejar errores de descarga de PDF
- [x] Compatibilidad con modo oscuro
- [x] Responsive design
- [x] Documentación completa

---

**✨ Sistema completamente funcional y listo para usar!**

**Fecha de implementación:** 11 de Febrero de 2026
