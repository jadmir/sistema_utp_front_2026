# ⚡ Guía Rápida - Sistema de Correos

## 🎯 Cambio Principal

**ANTES:** Siempre se mostraba un modal verde con la contraseña temporal  
**AHORA:** El correo se envía automáticamente. El modal solo aparece si FALLA el envío

---

## 📋 Respuestas de la API

### ✅ **Correo enviado exitosamente**
```json
{
  "message": "Usuario creado exitosamente. Se ha enviado un correo con las credenciales de acceso.",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "dni": "12345678",
    "email": "juan@example.com",
    "rol_id": 2
  }
  // ❌ NO viene "password_temporal"
}
```

### ⚠️ **Correo NO enviado (Fallback)**
```json
{
  "message": "Usuario creado exitosamente, pero no se pudo enviar el correo.",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "dni": "12345678",
    "email": "juan@example.com",
    "rol_id": 2
  },
  "password_temporal": "12345678JU",  // ✅ Solo viene si falló el correo
  "error_correo": "Por favor, proporcione las credenciales manualmente al usuario."
}
```

---

## 🔀 Flujo de Decisión

```
┌─────────────────────────┐
│ Usuario crea un usuario │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Backend intenta enviar correo   │
└────────────┬────────────────────┘
             │
     ┌───────┴───────┐
     │               │
     ▼               ▼
  ✅ ÉXITO       ⚠️ FALLO
     │               │
     │               │
     ▼               ▼
┌─────────────┐ ┌──────────────────┐
│ NO viene    │ │ SÍ viene         │
│ password_   │ │ password_        │
│ temporal    │ │ temporal         │
└──────┬──────┘ └────────┬─────────┘
       │                 │
       ▼                 ▼
┌──────────────┐ ┌──────────────────┐
│ Notificación │ │ Modal de         │
│ verde        │ │ credenciales     │
│ "Correo      │ │ (amarillo/       │
│ enviado"     │ │ naranja)         │
└──────┬───────┘ └────────┬─────────┘
       │                  │
       ▼                  ▼
┌──────────────┐ ┌──────────────────┐
│ Cerrar modal │ │ Usuario copia    │
│ formulario   │ │ y envía manual   │
└──────────────┘ └──────────────────┘
```

---

## 🎨 UI Diferencias

### Modal de Credenciales (Solo cuando FALLA el correo)

| Elemento | Color | Descripción |
|----------|-------|-------------|
| **Ícono** | 🟡 Amarillo | Triángulo de advertencia |
| **Título** | Negro | "⚠️ Usuario Creado - Correo No Enviado" |
| **Info Usuario** | Gris | Nombre y DNI en tarjeta |
| **Contraseña** | Azul | Texto grande en fuente mono |
| **Advertencias** | 🔴 Rojo | Mensajes de precaución |
| **Botón** | 🟠 Naranja | "Entendido" |

---

## 🧪 Prueba Rápida

### **Test 1: Correo Exitoso**
```javascript
// Crear usuario con correo VÁLIDO
Resultado esperado:
✅ NO aparece modal
✅ Notificación verde: "Se ha enviado un correo a..."
✅ Revisar bandeja → debe llegar el correo
```

### **Test 2: Correo Fallido**
```javascript
// Crear usuario con correo INVÁLIDO
Resultado esperado:
⚠️ SÍ aparece modal amarillo/naranja
⚠️ Notificación roja: "Correo no enviado..."
⚠️ Se puede copiar la contraseña
```

---

## 💡 Tips Importantes

1. **El modal de credenciales NO desaparece**, solo cambia su propósito:
   - ❌ Antes: Siempre se mostraba
   - ✅ Ahora: Solo es un fallback

2. **No eliminar el modal**, es necesario para cuando falle el SMTP

3. **Verificar que `password_temporal` venga en la respuesta**:
   ```javascript
   if (response.data.password_temporal) {
     // Falló el correo → mostrar modal
   } else {
     // Éxito → solo notificación
   }
   ```

4. **El usuario SIEMPRE recibirá sus credenciales**:
   - 🎯 Por correo (caso normal)
   - 📋 Por modal para copiar/enviar manual (fallback)

---

## 📧 Contenido del Correo

El usuario recibe:
- 👤 Nombre personalizado
- 🔑 Usuario (DNI)
- 🔒 Contraseña temporal
- 📝 Instrucciones de acceso
- 🔗 Link al sistema
- ⚠️ Recordatorio de cambio obligatorio

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| Siempre aparece el modal | Backend no envía correos → revisar SMTP |
| Modal no muestra nombre/DNI | Verificar `response.data.data.nombre` existe |
| No se copia al portapapeles | Usar navegador moderno con Clipboard API |
| No llega el correo | Revisar spam o configuración de Gmail |

---

## ✅ Checklist Rápido

- [ ] Crear usuario → NO aparece modal
- [ ] Correo llega a bandeja de entrada
- [ ] Crear con email inválido → SÍ aparece modal amarillo
- [ ] Modal muestra nombre y DNI
- [ ] Botón "Copiar" funciona
- [ ] Notificación correcta según caso

---

**Archivo modificado:** `src/components/UsuarioModal.vue`  
**Líneas clave:** 109-156 (template), 258-297 (script)  
**Fecha:** 19/02/2026
