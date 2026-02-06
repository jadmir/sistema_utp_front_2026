# 📦 Movimientos Masivos de Stock

Sistema implementado para registrar entradas y salidas masivas de stock para múltiples productos en una sola operación.

## 🎯 Características

### ✅ Entrada Masiva
- Registra entradas de stock para múltiples productos simultáneamente
- Configuración global de motivo y fecha aplicable a todos los productos
- Observaciones individuales por producto
- Validación automática de todos los campos antes de procesar
- Sistema transaccional: si falla uno, se revierten todos los cambios

### ✅ Salida Masiva
- Registra salidas de stock para múltiples productos simultáneamente
- Configuración global de área de destino, motivo y fecha
- Validación de stock disponible antes de procesar
- Alertas automáticas cuando un producto queda con stock bajo
- Observaciones individuales por producto
- Sistema transaccional: si falla uno, se revierten todos los cambios

## 📍 Ubicación en la Interfaz

Los botones de movimientos masivos se encuentran en la vista de **Inventario → Productos**, justo debajo de los filtros:

```
[Solo Stock Bajo] [Próximos a Vencer] | [📥 Entrada Masiva] [📤 Salida Masiva]
```

### Permisos Requeridos
- **Entrada Masiva**: Permiso `inventario.entrada`
- **Salida Masiva**: Permiso `inventario.salida`

## 🚀 Cómo Usar

### Entrada Masiva

1. **Abrir Modal**
   - Haz clic en el botón "📥 Entrada Masiva" (verde)

2. **Configurar Datos Globales**
   - **Motivo general**: Ej: "Compra a proveedor", "Donación", etc.
   - **Fecha del movimiento**: Fecha real de la entrada (puede ser pasada si olvidaste registrarla)

3. **Agregar Productos**
   - Haz clic en "Agregar Producto"
   - Selecciona el producto del dropdown
   - Ingresa la cantidad a ingresar
   - (Opcional) Agrega observaciones específicas

4. **Revisar y Confirmar**
   - Verifica el resumen en la parte inferior
   - Haz clic en "Registrar Entradas"

### Salida Masiva

1. **Abrir Modal**
   - Haz clic en el botón "📤 Salida Masiva" (naranja)

2. **Configurar Datos Globales**
   - **Área de destino**: Selecciona el área institucional
   - **Motivo general**: Ej: "Entrega mensual de material"
   - **Fecha del movimiento**: Fecha real de la salida

3. **Agregar Productos**
   - Haz clic en "Agregar Producto"
   - Selecciona el producto del dropdown
   - Ingresa la cantidad a retirar
   - El sistema mostrará el stock resultante
   - ⚠️ Si queda por debajo del mínimo, se mostrará una alerta
   - (Opcional) Agrega observaciones específicas

4. **Revisar y Confirmar**
   - Verifica el resumen en la parte inferior
   - Si hay productos con stock bajo, se mostrará una advertencia
   - Haz clic en "Registrar Salidas"

## 💡 Validaciones y Alertas

### Validaciones Automáticas

#### Entrada Masiva
- ✅ Todos los productos deben estar seleccionados
- ✅ Las cantidades deben ser mayores a 0
- ✅ El motivo es obligatorio
- ✅ La fecha no puede ser futura

#### Salida Masiva
- ✅ Todos los productos deben estar seleccionados
- ✅ Las cantidades deben ser mayores a 0
- ✅ Debe haber stock suficiente para todos los productos
- ✅ El área de destino es obligatoria
- ✅ El motivo es obligatorio
- ✅ La fecha no puede ser futura

### Alertas de Stock Bajo

Cuando realizas una salida masiva y algún producto queda con stock por debajo del mínimo:
- ⚠️ Se mostrará un indicador visual en la tabla
- 📊 Al confirmar, recibirás una notificación con los productos afectados
- 📈 Los productos aparecerán en el dashboard de "Alertas de Stock Bajo"

## 🔧 Ejemplos de Uso

### Ejemplo 1: Compra Mensual de Material de Oficina

**Escenario**: Llegó el pedido mensual de material de oficina con varios productos.

**Pasos**:
1. Clic en "📥 Entrada Masiva"
2. Configurar:
   - Motivo: "Compra mensual a proveedor XYZ"
   - Fecha: 2026-02-04 (fecha de llegada real)
3. Agregar productos:
   - Lapiceros azules: 50 unidades
   - Cuadernos A4: 30 unidades
   - Grapas: 20 cajas
4. Confirmar

**Resultado**: Los 3 productos quedan registrados con sus nuevos stocks y en el historial aparecerá un movimiento de entrada para cada uno.

### Ejemplo 2: Entrega Mensual al Área Administrativa

**Escenario**: Entregar material de oficina mensual al área administrativa.

**Pasos**:
1. Clic en "📤 Salida Masiva"
2. Configurar:
   - Área: "Área Administrativa"
   - Motivo: "Entrega mensual de material"
   - Fecha: 2026-02-04
3. Agregar productos:
   - Lapiceros azules: 20 unidades
   - Cuadernos A4: 15 unidades
   - Grapas: 5 cajas
4. Verificar que hay stock suficiente
5. Confirmar

**Resultado**: Los stocks se reducen automáticamente y queda registrado en el historial con el área de destino.

### Ejemplo 3: Donación de Material Médico

**Escenario**: Recibiste una donación de varios productos médicos.

**Pasos**:
1. Clic en "📥 Entrada Masiva"
2. Configurar:
   - Motivo: "Donación Universidad XYZ"
   - Fecha: 2026-02-04
3. Agregar productos:
   - Alcohol en gel: 100 unidades
     - Observaciones: "Lote 2026-A"
   - Mascarillas: 500 unidades
     - Observaciones: "Vencimiento: 2027-02-01"
   - Guantes: 200 pares
4. Confirmar

**Resultado**: Los productos se registran con sus observaciones específicas.

## 🔄 Flujo de Datos

```
1. Usuario completa formulario
   ↓
2. Frontend valida campos requeridos
   ↓
3. Se envía petición a la API
   ↓
4. Backend valida todos los productos
   ↓
5. Backend verifica stock (solo salidas)
   ↓
6. Backend procesa de forma transaccional
   ↓
7. Se registra en el historial
   ↓
8. Se actualiza el stock
   ↓
9. Se invalida el caché
   ↓
10. Se actualiza la interfaz
```

## 📊 Tracking y Auditoría

Cada movimiento masivo genera:
- ✅ Un registro individual en el historial por cada producto
- ✅ Timestamp de cuándo ocurrió el movimiento (fecha_movimiento)
- ✅ Timestamp de cuándo se registró en el sistema (created_at)
- ✅ Usuario que realizó la operación
- ✅ Stock anterior y stock actual
- ✅ Motivo y observaciones

## ⚠️ Consideraciones Importantes

1. **Transaccionalidad**: Si falla algún producto, NINGUNO se procesa. Esto garantiza la consistencia de los datos.

2. **Stock Insuficiente**: En salidas masivas, si algún producto no tiene stock suficiente, se mostrará un error detallado indicando:
   - Qué productos tienen problemas
   - Stock disponible vs. cantidad solicitada
   
3. **Fechas Pasadas**: Puedes registrar movimientos de fechas pasadas si olvidaste registrarlos a tiempo. El sistema mostrará una advertencia amarilla.

4. **Observaciones**: Son opcionales pero muy útiles para:
   - Números de lote
   - Fechas de vencimiento
   - Números de pedido/factura
   - Cualquier información adicional relevante

5. **Caché**: El sistema invalida automáticamente el caché de productos, movimientos y dashboard después de cada operación masiva.

## 🐛 Solución de Problemas

### Error: "Stock insuficiente en algunos productos"
**Causa**: Uno o más productos no tienen suficiente stock para la salida solicitada.
**Solución**: Verifica el stock disponible de cada producto y ajusta las cantidades.

### Error: "Error de validación"
**Causa**: Faltan campos obligatorios o los valores no son válidos.
**Solución**: 
- Verifica que todos los productos tengan cantidad > 0
- Verifica que el motivo no esté vacío
- Para salidas, verifica que el área esté seleccionada

### Modal no se cierra después de confirmar
**Causa**: Puede haber un error en el servidor.
**Solución**: Revisa la consola del navegador (F12) para ver el error específico.

### Los stocks no se actualizan en la tabla
**Causa**: El caché aún no se ha invalidado.
**Solución**: Refresca la página manualmente (F5).

## 🔗 API Endpoints Utilizados

- `POST /api/products/entrada-masiva` - Registrar entradas masivas
- `POST /api/products/salida-masiva` - Registrar salidas masivas

Para más detalles sobre la API, consulta la documentación del backend.

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias de mejora, contacta al equipo de desarrollo.
