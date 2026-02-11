# 🆕 Sistema de Vale de Cargo - Actualización v2.0

## ✨ Nuevas Funcionalidades Implementadas

Se han agregado importantes mejoras al sistema de Vales de Cargo:

### 📌 Cambios Principales

1. **✅ PDFs guardados automáticamente en el servidor**
   - Cada vale se guarda en: `storage/app/vales_cargo/YYYY/MM/vale_cargo_VC-YYYY-NNNN.pdf`
   - Campo `pdf_path` en la base de datos

2. **✅ Nuevo endpoint de búsqueda de vales**
   - `GET /api/vales-cargo` - Buscar y listar vales con filtros avanzados

3. **✅ Nuevo endpoint de descarga desde servidor**
   - `GET /api/vales-cargo/{movementId}/descargar` - Descarga el PDF guardado

4. **✅ Componente de búsqueda de evidencias**
   - Nuevo tab `ValesCargoTab.vue` para buscar vales antiguos

---

## 📁 Archivos Nuevos Creados

### 1. `src/services/valesCargo.js`

**Service especializado para vales de cargo:**

```javascript
import api from './api'
import { logger } from '../utils/logger'

export const valesCargoService = {
  /**
   * Listar y buscar vales de cargo
   * @param {Object} params - Filtros de búsqueda
   */
  async listar(params = {}) {
    const response = await api.get('/vales-cargo', { params })
    return response
  },

  /**
   * Descargar vale guardado previamente en el servidor
   * @param {number} movimientoId - ID del movimiento
   * @param {string} numeroVale - Número del vale (para nombre archivo)
   */
  async descargar(movimientoId, numeroVale = null) {
    const response = await api.get(`/vales-cargo/${movimientoId}/descargar`, {
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `vale_cargo_${numeroVale || movimientoId}.pdf`)
    link.click()
    window.URL.revokeObjectURL(url)
    
    return { success: true }
  },

  /**
   * Generar PDF del vale (nuevo o regenerar)
   * @param {number} movimientoId - ID del movimiento
   */
  async generarPDF(movimientoId) {
    const response = await api.get(`/reportes/pdf/vale-cargo/${movimientoId}`, {
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `vale_cargo_${movimientoId}.pdf`)
    link.click()
    window.URL.revokeObjectURL(url)
    
    return { success: true }
  }
}
```

**Parámetros de búsqueda disponibles:**
```javascript
await valesCargoService.listar({
  numero_vale: 'VC-2026-0001',     // Número exacto de vale
  recibido_por: 'Juan',             // Buscar por nombre (parcial)
  area_id: 1,                       // Filtrar por área específica
  fecha_desde: '2026-02-01',        // Desde fecha
  fecha_hasta: '2026-02-11',        // Hasta fecha
  page: 1,                          // Página actual
  per_page: 15                      // Resultados por página
})
```

---

### 2. `src/components/inventory/ValesCargoTab.vue`

**Componente completo de búsqueda de vales:**

**Características:**
- ✅ Formulario de búsqueda con 5 filtros
- ✅ Tabla responsive con todos los datos del vale
- ✅ Botón de descarga individual por cada vale
- ✅ Botón "Ver detalles" con modal completo
- ✅ Paginación automática
- ✅ Compatible con modo oscuro
- ✅ Skeleton loaders durante carga

**Vista previa:**
```
┌────────────────────────────────────────────────────────┐
│ 🔍 Buscar Vales de Cargo                              │
├────────────────────────────────────────────────────────┤
│ [Número vale] [Receptor] [Área▼] [Desde] [Hasta]      │
│ [Buscar] [Limpiar]                                     │
├────────────────────────────────────────────────────────┤
│ N° Vale │ Fecha │ Producto │ Cant │ Receptor │ DNI │..│
├─────────┼───────┼──────────┼──────┼──────────┼─────┼──┤
│ VC-001  │11/02  │Papel A4  │ 50   │María G.  │1234 │..│
│         │       │          │      │          │     │📄│
└────────────────────────────────────────────────────────┘
```

**Uso en Inventario:**
```vue
<template>
  <div class="tabs">
    <button @click="activeTab = 'productos'">Productos</button>
    <button @click="activeTab = 'movimientos'">Movimientos</button>
    <button @click="activeTab = 'vales'">🔍 Vales de Cargo</button>
  </div>
  
  <ValesCargoTab v-if="activeTab === 'vales'" />
</template>

<script setup>
import ValesCargoTab from '@/components/inventory/ValesCargoTab.vue'
</script>
```

---

## 🔄 Archivos Actualizados

### 1. `src/components/inventory/MovimientoModal.vue`

**Cambio en auto-descarga:**
```javascript
// ANTES: usaba productsService
await productsService.descargarValeCargo(movimientoId)

// AHORA: usa valesCargoService (más específico)
await valesCargoService.generarPDF(movimientoId)
```

**Import actualizado:**
```javascript
import { valesCargoService } from '../../services/valesCargo'
```

---

### 2. `src/components/inventory/MovimientosTab.vue`

**Cambio en descarga de vales:**
```javascript
// ANTES: usaba reportesService
await reportesService.descargarValeCargo(movimientoId)

// AHORA: usa valesCargoService.descargar()
// Este método descarga el PDF guardado en el servidor
await valesCargoService.descargar(movimientoId, numeroVale)
```

**Import actualizado:**
```javascript
import { valesCargoService } from '../../services/valesCargo'
```

---

## 🎯 Flujo Completo Actualizado

### 1️⃣ Registro de Salida

```
Usuario registra SALIDA con datos del receptor
         ↓
Frontend envía POST /api/products/{id}/salida
         ↓
Backend valida y crea movimiento
         ↓
Backend genera número de vale único
         ↓
Backend genera PDF y LO GUARDA EN SERVIDOR ✨
         ↓
Backend guarda ruta en campo pdf_path
         ↓
Backend retorna movimiento_id + numero_vale
         ↓
Frontend auto-descarga el PDF
         ↓
✅ Vale guardado permanentemente
```

### 2️⃣ Búsqueda de Vale Antiguo

```
Usuario accede a "Vales de Cargo"
         ↓
Completa filtros de búsqueda
         ↓
Frontend llama GET /api/vales-cargo?filtros...
         ↓
Backend busca en movements con numero_vale
         ↓
Retorna lista paginada con pdf_path
         ↓
Usuario ve tabla con todos los vales
         ↓
Click en "📄 Vale"
         ↓
Frontend llama GET /api/vales-cargo/{id}/descargar
         ↓
Backend retorna el PDF guardado ✨
         ↓
✅ PDF descargado sin regenerar
```

### 3️⃣ Ver Detalles de Vale

```
Usuario click en "👁️ Ver" en un vale
         ↓
Se abre modal con información completa:
  - Número de vale
  - Fecha de movimiento
  - Producto (código, nombre, cantidad)
  - Receptor (nombre, DNI, cargo)
  - Área de destino
  - Usuario que entregó
  - Observaciones
         ↓
Botón "Descargar Vale" en el modal
         ↓
✅ Descarga inmediata
```

---

## 📊 Endpoints Disponibles

### Backend Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/products/{id}/salida` | Registra salida y genera vale |
| GET | `/api/reportes/pdf/vale-cargo/{id}` | Genera PDF (guarda en servidor) |
| GET | `/api/vales-cargo` | Lista vales con filtros |
| GET | `/api/vales-cargo/{id}/descargar` | Descarga PDF guardado |

### Filtros de Búsqueda

```javascript
// Todos los filtros son opcionales
{
  numero_vale: 'VC-2026-0001',      // Búsqueda exacta
  recibido_por: 'Juan',              // Búsqueda parcial (LIKE)
  area_id: 1,                        // Filtro por área
  fecha_desde: '2026-02-01',         // Desde fecha (>=)
  fecha_hasta: '2026-02-11',         // Hasta fecha (<=)
  page: 1,                           // Paginación
  per_page: 15                       // Resultados por página
}
```

### Respuesta de Búsqueda

```json
{
  "status": "success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 123,
        "numero_vale": "VC-2026-0089",
        "cantidad": 50,
        "fecha_movimiento": "2026-02-11T00:00:00.000000Z",
        "recibido_por": "María García López",
        "dni_receptor": "12345678",
        "cargo_receptor": "Coordinadora",
        "observaciones_receptor": "Material en buen estado",
        "pdf_path": "vales_cargo/2026/02/vale_cargo_VC-2026-0089.pdf",
        "product": {
          "id": 15,
          "codigo": "ASSOF-0001",
          "nombre": "Papel Bond A4",
          "unidad_medida": "unidades"
        },
        "user": {
          "id": 1,
          "nombre": "Admin Usuario"
        },
        "area": {
          "id": 2,
          "nombre": "Administración",
          "codigo": "ADM"
        }
      }
    ],
    "total": 25,
    "per_page": 15,
    "last_page": 2
  }
}
```

---

## 🎨 Cómo Integrar el Nuevo Tab

### En `Inventario.vue` o similar:

```vue
<template>
  <div class="inventario-container">
    <!-- Tabs de navegación -->
    <div class="tabs">
      <button 
        @click="activeTab = 'productos'" 
        :class="{ active: activeTab === 'productos' }"
      >
        📦 Productos
      </button>
      
      <button 
        @click="activeTab = 'movimientos'" 
        :class="{ active: activeTab === 'movimientos' }"
      >
        📊 Movimientos
      </button>
      
      <button 
        @click="activeTab = 'vales'" 
        :class="{ active: activeTab === 'vales' }"
      >
        🔍 Vales de Cargo
      </button>
    </div>

    <!-- Contenido de tabs -->
    <div class="tab-content">
      <ProductosTab v-if="activeTab === 'productos'" />
      <MovimientosTab v-if="activeTab === 'movimientos'" />
      <ValesCargoTab v-if="activeTab === 'vales'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProductosTab from '@/components/inventory/ProductosTab.vue'
import MovimientosTab from '@/components/inventory/MovimientosTab.vue'
import ValesCargoTab from '@/components/inventory/ValesCargoTab.vue'

const activeTab = ref('productos')
</script>
```

---

## ✅ Beneficios de la Nueva Versión

| Beneficio | Descripción |
|-----------|-------------|
| **🗄️ Evidencia Digital** | PDFs guardados permanentemente en servidor |
| **🔍 Búsqueda Avanzada** | Encuentra vales por fecha, número, receptor o área |
| **⚡ Descarga Rápida** | Descarga PDFs guardados sin regenerar |
| **📊 Auditoría Completa** | Histórico completo de todos los vales |
| **💾 Sin Pérdida** | Aunque se olvide imprimir, siempre está en el servidor |
| **🎯 Recuperación Fácil** | Re-descarga cualquier vale en segundos |
| **📱 Responsive** | Funciona en móvil, tablet y desktop |
| **🌙 Modo Oscuro** | Compatible con tema claro y oscuro |

---

## 🧪 Casos de Uso

### Caso 1: Olvidé Imprimir un Vale

```
Problema: Registré una salida hace 2 semanas pero olvidé imprimir el vale

Solución:
1. Ir a "Vales de Cargo"
2. Filtrar por fecha (hace 2 semanas)
3. Buscar el producto o receptor
4. Click en "📄 Vale"
5. ✅ PDF descargado inmediatamente
```

### Caso 2: Auditoría de Entregas a un Área

```
Problema: Necesito revisar todas las entregas a "Administración" en enero

Solución:
1. Ir a "Vales de Cargo"
2. Filtrar:
   - Área: Administración
   - Desde: 2026-01-01
   - Hasta: 2026-01-31
3. Click en "Buscar"
4. ✅ Ver tabla con todas las entregas
5. Descargar vales individuales si necesario
```

### Caso 3: Verificar Recepción de Material

```
Problema: ¿María García recibió el material que le envié?

Solución:
1. Ir a "Vales de Cargo"
2. Buscar por receptor: "María García"
3. ✅ Ver todos los vales firmados por ella
4. Click en "👁️ Ver" para detalles completos
```

### Caso 4: Buscar Vale por Número

```
Problema: Tengo el número VC-2026-0089 y necesito el PDF

Solución:
1. Ir a "Vales de Cargo"
2. Escribir: VC-2026-0089
3. Click en "Buscar"
4. ✅ Aparece el vale exacto
5. Click en "📄 Vale" para descargar
```

---

## 📌 Checklist de Implementación

- [x] Service `valesCargo.js` creado
- [x] Componente `ValesCargoTab.vue` creado
- [x] `MovimientoModal.vue` actualizado
- [x] `MovimientosTab.vue` actualizado
- [x] Sin errores de compilación
- [x] Funcionalidad de búsqueda operativa
- [x] Descarga desde servidor funcionando
- [x] Modal de detalles implementado
- [x] Paginación funcional
- [x] Compatible con modo oscuro
- [x] Responsive design
- [x] Documentación actualizada

---

## 🚀 Estado Final

**✅ SISTEMA COMPLETO V2.0 - LISTO PARA PRODUCCIÓN**

**Nuevas funcionalidades:**
- ✅ Búsqueda avanzada de vales
- ✅ Descarga de PDFs guardados en servidor
- ✅ Modal de detalles completos
- ✅ Nuevo componente ValesCargoTab
- ✅ Service especializado valesCargoService

**Fecha de actualización:** 11 de Febrero de 2026  
**Versión:** 2.0.0

---

**🎉 El sistema ahora es completamente funcional con búsqueda y recuperación de evidencias!**
