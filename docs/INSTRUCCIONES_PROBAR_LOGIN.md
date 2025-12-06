# INSTRUCCIONES PARA PROBAR EL LOGIN CON GOOGLE

## ✅ PASOS PARA PROBAR

### 1. Verificar que el servidor esté corriendo
```bash
# El servidor debería estar corriendo en http://localhost:3000
# Si no está corriendo, ejecuta:
npm run dev
```

### 2. Abrir el navegador
- Abre tu navegador y ve a: `http://localhost:3000`

### 3. Probar Login con Google

#### **Paso 1: Ver la página de inicio**
- Deberías ver la página de inicio con:
  - Título "CanvasMind"
  - Tagline "Tu lienzo de ideas infinitas"
  - Botón "Iniciar Sesión con Google" (azul con logo de Google)
  - Botón "Log in" (blanco, para invitado)

#### **Paso 2: Hacer clic en "Iniciar Sesión con Google"**
- Haz clic en el botón azul "Iniciar Sesión con Google"
- **Comportamiento esperado:**
  - Se abre un popup de Google
  - El popup muestra las cuentas de Google disponibles
  - Puedes seleccionar una cuenta

#### **Paso 3: Seleccionar cuenta y autorizar**
- Selecciona tu cuenta de Google
- Autoriza el acceso si es necesario
- **Comportamiento esperado:**
  - El popup se cierra automáticamente
  - La página muestra "Cargando..." brevemente
  - Redirige automáticamente al tablero más reciente
  - O crea "Mi Primer Tablero" si no tienes tableros

#### **Paso 4: Verificar que funcionó**
- Deberías ver:
  - El tablero cargado con el canvas infinito
  - El menú lateral izquierdo (Tools sidebar)
  - El fondo teal (#b7ddda) con puntos
  - Capacidad de crear elementos

## 🔍 VERIFICACIÓN EN CONSOLA DEL NAVEGADOR

Abre las herramientas de desarrollador (F12) y revisa la consola. Deberías ver:

```
🔄 Iniciando sesión con Google (popup)...
✅ Sesión con Google iniciada: [tu-email@gmail.com]
✅ Documento de usuario verificado
✅ Usuario autenticado, procesando...
📋 Boards encontrados: X
➡️ Redirigiendo a tablero existente: [board-id]
```

O si es tu primer tablero:

```
➕ Creando nuevo tablero...
✅ Nuevo tablero creado: [board-id]
```

## ⚠️ PROBLEMAS COMUNES

### 1. El popup se bloquea
- **Solución**: Permite popups para localhost:3000 en tu navegador

### 2. Error "auth/unauthorized-domain"
- **Solución**: Verifica que `localhost:3000` esté en los dominios autorizados de Firebase Console

### 3. El popup se abre pero no pasa nada
- **Solución**: Revisa la consola del navegador para ver errores específicos

### 4. Redirige pero muestra error 404
- **Solución**: Verifica que la ruta `/board/[boardId]` esté correctamente configurada

## 📝 LOGS ESPERADOS

### En la terminal del servidor:
```
✓ Ready in Xs
○ Local:        http://localhost:3000
```

### En la consola del navegador (después del login):
- Logs de autenticación exitosa
- Logs de creación/verificación de documento de usuario
- Logs de redirección al tablero

## ✅ RESULTADO ESPERADO

Después de hacer login con Google exitosamente:
1. ✅ Popup se abre y cierra correctamente
2. ✅ Usuario autenticado
3. ✅ Documento de usuario creado/verificado en Firestore
4. ✅ Redirección automática al tablero
5. ✅ Tablero cargado y funcional

