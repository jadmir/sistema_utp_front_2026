# 🧪 Guía de Pruebas - Sistema de Correos para Creación de Usuarios

**Fecha de implementación:** 19 de febrero de 2026  
**Componente modificado:** `UsuarioModal.vue`

---

## ✅ Cambios Implementados

### 1. **Lógica de Manejo de Respuesta API**
- ✅ Se detecta automáticamente si el correo se envió exitosamente
- ✅ El modal de credenciales solo aparece cuando **falla** el envío del correo
- ✅ Mensajes diferenciados según el caso (éxito/fallo)

### 2. **Modal de Credenciales (Fallback)**
- ✅ Cambio de diseño: De verde (éxito) a amarillo/naranja (advertencia)
- ✅ Título actualizado: "⚠️ Usuario Creado - Correo No Enviado"
- ✅ Se muestra información del usuario: Nombre y DNI
- ✅ Advertencias actualizadas para indicar que el correo falló
- ✅ Botón "Entendido" cambió de verde a naranja

### 3. **Notificaciones Mejoradas**
- ✅ **Caso éxito:** "Usuario creado exitosamente. Se ha enviado un correo a [email] con las credenciales de acceso."
- ✅ **Caso fallo:** "Correo no enviado. El usuario fue creado pero no se pudo enviar el correo..."

---

## 🧪 Escenarios de Prueba

### **Escenario 1: Correo Enviado Exitosamente** ✅

#### Precondiciones:
- Crear un usuario con un correo válido y real
- Backend configurado correctamente con SMTP

#### Pasos:
1. Abrir el módulo de Usuarios
2. Hacer clic en "Nuevo Usuario"
3. Completar el formulario:
   - Nombre: `Juan Pérez`
   - Email: `tu_correo_real@gmail.com`
   - DNI: `12345678`
   - Rol: Seleccionar cualquier rol
   - Estado: Activo
4. Hacer clic en "Crear"

#### Resultado Esperado:
- ✅ **NO debe aparecer** el modal con la contraseña temporal
- ✅ **Debe mostrarse** una notificación verde de éxito:
  ```
  Usuario creado exitosamente
  Se ha enviado un correo a tu_correo_real@gmail.com con las credenciales de acceso.
  ```
- ✅ El modal del formulario se cierra automáticamente
- ✅ La tabla de usuarios se actualiza
- ✅ **Revisar bandeja de entrada** del correo proporcionado
- ✅ **Debe llegar** un correo con:
  - Asunto: "Bienvenido al Sistema de Almacén UTP"
  - Usuario (DNI)
  - Contraseña temporal
  - Instrucciones de primer acceso

---

### **Escenario 2: Fallo en el Envío del Correo** ⚠️

#### Precondiciones:
- Crear un usuario con un correo inválido o no existente
- O bien, backend con SMTP mal configurado (para simular fallo)

#### Pasos:
1. Abrir el módulo de Usuarios
2. Hacer clic en "Nuevo Usuario"
3. Completar el formulario:
   - Nombre: `María López`
   - Email: `correo_invalido@dominio_inexistente.com`
   - DNI: `87654321`
   - Rol: Seleccionar cualquier rol
   - Estado: Activo
4. Hacer clic en "Crear"

#### Resultado Esperado:
- ✅ **Debe aparecer** un modal con las credenciales temporales
- ✅ El modal debe tener:
  - Icono de advertencia amarillo (⚠️)
  - Título: "⚠️ Usuario Creado - Correo No Enviado"
  - Información del usuario:
    - **NOMBRE:** María López
    - **USUARIO (DNI):** 87654321
  - **CONTRASEÑA TEMPORAL:** (mostrada en grande, en azul)
  - Botón "Copiar" funcional
  - Advertencias en rojo:
    - ✅ "El correo automático NO se envió correctamente"
    - ✅ "Comunique estas credenciales al usuario manualmente"
    - ✅ "Use un canal seguro para enviar la información"
    - ✅ "El usuario debe cambiar esta contraseña en el primer inicio de sesión"
  - Botón "Entendido" en color naranja
- ✅ **Debe mostrarse** una notificación roja de error:
  ```
  Correo no enviado
  El usuario fue creado pero no se pudo enviar el correo. Por favor, proporciona las credenciales manualmente.
  ```

---

### **Escenario 3: Copiar Contraseña al Portapapeles** 📋

#### Precondiciones:
- Estar en el modal de credenciales (Escenario 2)

#### Pasos:
1. Hacer clic en el botón "Copiar" debajo de la contraseña temporal

#### Resultado Esperado:
- ✅ **Debe mostrarse** una notificación verde:
  ```
  Copiado
  Contraseña copiada al portapapeles
  ```
- ✅ La contraseña debe estar en el portapapeles del sistema
- ✅ Puedes pegar (Ctrl+V / Cmd+V) en cualquier aplicación

---

### **Escenario 4: Cerrar Modal de Credenciales** ❌

#### Precondiciones:
- Estar en el modal de credenciales (Escenario 2)

#### Pasos:
1. Hacer clic en el botón "Entendido"

#### Resultado Esperado:
- ✅ El modal de credenciales se cierra
- ✅ La tabla de usuarios se actualiza
- ✅ El nuevo usuario aparece en la lista

---

### **Escenario 5: Editar Usuario Existente** ✏️

#### Precondiciones:
- Tener al menos un usuario en el sistema

#### Pasos:
1. Hacer clic en "Editar" en un usuario existente
2. Modificar el nombre o rol
3. Hacer clic en "Actualizar"

#### Resultado Esperado:
- ✅ **NO debe mostrarse** el modal de contraseña
- ✅ **Debe mostrarse** notificación:
  ```
  Usuario actualizado
  El usuario ha sido actualizado correctamente
  ```
- ✅ El modal se cierra
- ✅ La tabla se actualiza con los cambios

---

## 🔍 Validaciones de UI

### **Modal de Credenciales (Fallback)**
- ✅ Ícono de advertencia amarillo (no verde)
- ✅ Título con emoji ⚠️
- ✅ Sección de información del usuario (nombre y DNI) visible
- ✅ Contraseña en fuente monoespaciada grande
- ✅ Botón "Copiar" funcional
- ✅ Advertencias en rojo (no amarillo)
- ✅ Botón "Entendido" en naranja (no verde)

### **Notificaciones**
- ✅ **Éxito (verde):** Cuando el correo se envía correctamente
- ✅ **Error (rojo):** Cuando el correo falla
- ✅ **Info (azul):** Para copiar al portapapeles

---

## 📱 Pruebas de Correo Electrónico

### **Verificar el Correo Recibido**

Cuando el correo se envía exitosamente, el usuario debe recibir un email con:

#### Estructura del Correo:
- ✉️ **De:** almacenutp86@gmail.com
- 📧 **Asunto:** "Bienvenido al Sistema de Almacén UTP"
- 📝 **Contenido:**
  - Saludo personalizado con el nombre del usuario
  - Usuario (DNI) en texto claro
  - Contraseña temporal
  - Instrucciones claras de primer acceso
  - Botón/enlace para acceder al sistema
  - Advertencias de seguridad
  - Recordatorio de cambio obligatorio de contraseña

#### Validar:
- ✅ El correo llega a la bandeja de entrada
- ✅ No cae en spam
- ✅ El diseño es legible y profesional
- ✅ Las credenciales son correctas
- ✅ Los enlaces funcionan

---

## 🚨 Problemas Conocidos y Soluciones

### **Problema 1: El correo siempre falla**
**Síntomas:** Siempre aparece el modal de credenciales

**Posibles causas:**
- Backend con SMTP mal configurado
- Credenciales de Gmail incorrectas
- No se habilitó "Aplicaciones menos seguras" o "Contraseñas de aplicación"

**Solución:**
- Revisar configuración del `.env` en el backend
- Verificar que el servidor SMTP responde
- Probar con otro servicio de correo

---

### **Problema 2: El modal no muestra nombre/DNI**
**Síntomas:** Las secciones de información del usuario están vacías

**Posibles causas:**
- La respuesta del backend no tiene la estructura esperada

**Solución:**
- Revisar que `response.data.data` contenga `nombre`, `dni`, `email`
- Agregar console.log en `handleSubmit` para depurar

---

### **Problema 3: No se copia al portapapeles**
**Síntomas:** El botón "Copiar" no funciona

**Posibles causas:**
- Navegador no soporta Clipboard API
- Permisos de clipboard denegados

**Solución:**
- Usar navegadores modernos (Chrome, Firefox, Edge)
- Verificar permisos del navegador

---

## 📊 Checklist de Verificación Final

Antes de dar por completada la implementación, verificar:

### Funcionalidad
- [ ] Crear usuario con correo válido → No aparece modal
- [ ] Crear usuario con correo inválido → Aparece modal
- [ ] Modal muestra nombre y DNI correctos
- [ ] Botón "Copiar" funciona
- [ ] Notificaciones aparecen correctamente
- [ ] Tabla se actualiza después de crear usuario
- [ ] Editar usuario NO muestra modal

### Diseño
- [ ] Modal de fallback tiene diseño de advertencia (amarillo/naranja)
- [ ] Botón "Entendido" es naranja (no verde)
- [ ] Advertencias están en rojo
- [ ] Información del usuario es legible

### Correos
- [ ] Correo llega a bandeja de entrada
- [ ] Contenido del correo es correcto
- [ ] Credenciales en el correo son las mismas del sistema

---

## 🎯 Próximos Pasos

1. **Pruebas en desarrollo:** Ejecutar todos los escenarios en ambiente local
2. **Pruebas en staging:** Validar con correos reales
3. **Documentar:** Actualizar manual de usuario
4. **Capacitar:** Informar al equipo sobre el nuevo flujo
5. **Monitorear:** Revisar logs de envío de correos en producción

---

**Última actualización:** 19 de febrero de 2026  
**Estado:** ✅ Implementado y listo para pruebas
