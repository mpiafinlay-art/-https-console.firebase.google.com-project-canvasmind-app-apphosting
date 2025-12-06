# SOLUCIÓN DE PROBLEMAS: NO SE PUEDE INICIAR SESIÓN

## 🔍 DIAGNÓSTICO PASO A PASO

### 1. Verificar que el servidor esté corriendo
```bash
# El servidor debe estar corriendo en http://localhost:3000
npm run dev
```

### 2. Abrir la consola del navegador
- Presiona `F12` o `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
- Ve a la pestaña "Console"
- Intenta iniciar sesión y observa los mensajes

### 3. Problemas Comunes y Soluciones

#### ❌ Problema: "El popup fue bloqueado"
**Síntomas**: No se abre ninguna ventana al hacer clic en "Iniciar Sesión con Google"

**Solución**:
1. Permite popups para `localhost:3000` en tu navegador
2. En Chrome: Configuración → Privacidad y seguridad → Configuración de sitios → Pop-ups y redirecciones → Agregar `localhost:3000`
3. En Firefox: Configuración → Privacidad y seguridad → Permisos → Ventanas emergentes → Excepciones → Agregar `localhost:3000`
4. Recarga la página e intenta de nuevo

#### ❌ Problema: "El popup fue cerrado antes de completar el login"
**Síntomas**: Se abre el popup pero se cierra inmediatamente o el usuario lo cierra

**Solución**:
1. Asegúrate de completar el proceso de selección de cuenta en el popup
2. No cierres el popup manualmente
3. Espera a que Google complete el proceso de autenticación

#### ❌ Problema: "El dominio no está autorizado"
**Síntomas**: Error `auth/unauthorized-domain` en la consola

**Solución**:
1. Ve a Firebase Console: https://console.firebase.google.com/
2. Selecciona tu proyecto `canvasmind-app`
3. Ve a Authentication → Settings → Authorized domains
4. Asegúrate de que `localhost` esté en la lista (sin el puerto)
5. Si no está, haz clic en "Add domain" y agrega `localhost`
6. Recarga la página e intenta de nuevo

#### ❌ Problema: "Servicio de autenticación no disponible"
**Síntomas**: El botón no hace nada o muestra este mensaje

**Solución**:
1. Verifica que Firebase se esté inicializando correctamente
2. Revisa la consola del navegador para ver errores de Firebase
3. Verifica que `src/firebase/config.ts` tenga la configuración correcta
4. Recarga la página completamente (Ctrl+Shift+R o Cmd+Shift+R)

#### ❌ Problema: "Error de red"
**Síntomas**: Error `auth/network-request-failed`

**Solución**:
1. Verifica tu conexión a internet
2. Verifica que Firebase esté accesible
3. Intenta desde otro navegador o red

### 4. Verificar Logs en la Consola

Cuando intentas iniciar sesión, deberías ver estos logs en orden:

```
🔐 handleLogin llamado: { provider: 'google', hasAuth: true, hasFirestore: true }
🔄 Iniciando sesión con Google (popup)...
📍 URL actual: http://localhost:3000/
📍 Dominio: localhost
🔐 signInWithGoogle iniciado
📍 Dominio actual: localhost
🔄 Llamando a signInWithPopup...
✅ signInWithPopup exitoso: [tu-email@gmail.com]
✅ Sesión con Google iniciada: [tu-email@gmail.com]
✅ Usuario: { uid: '...', email: '...' }
📝 Creando/verificando documento de usuario...
✅ Documento de usuario listo
🔐 Auth state changed: Usuario: [tu-email@gmail.com]
🔄 useEffect redirection - Estado: { hasUser: true, ... }
✅ Usuario autenticado, procesando redirección automática...
```

Si ves algún error antes de estos logs, ese es el problema.

### 5. Probar Login como Invitado

Si el login con Google no funciona, prueba con "Log in" (invitado):
- Este método no requiere popup
- Debería funcionar incluso si hay problemas con Google OAuth
- Si esto funciona, el problema está específicamente con Google OAuth

### 6. Verificar Configuración de Firebase

Abre `src/firebase/config.ts` y verifica que tenga:
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyBKmPI69ts5F_g2-7-kfaceW9jkPSVEymc",
  authDomain: "canvasmind-app.firebaseapp.com",
  projectId: "canvasmind-app",
  // ...
};
```

### 7. Limpiar Cache y Recargar

1. Cierra todas las pestañas de `localhost:3000`
2. Limpia el cache del navegador (Ctrl+Shift+Delete)
3. Reinicia el servidor: `npm run dev`
4. Abre una nueva pestaña en modo incógnito
5. Ve a `http://localhost:3000`
6. Intenta iniciar sesión de nuevo

## 📝 REPORTAR PROBLEMA

Si después de seguir estos pasos aún no puedes iniciar sesión:

1. Abre la consola del navegador (F12)
2. Copia TODOS los mensajes de error que aparezcan
3. Toma una captura de pantalla de la consola
4. Indica qué método de login estás usando (Google o Invitado)
5. Indica qué navegador y versión estás usando

## ✅ VERIFICACIÓN FINAL

Después de iniciar sesión exitosamente, deberías:
1. ✅ Ver el tablero cargado
2. ✅ Ver el menú principal flotante
3. ✅ Poder agregar elementos al tablero
4. ✅ Ver tu usuario autenticado en la consola

