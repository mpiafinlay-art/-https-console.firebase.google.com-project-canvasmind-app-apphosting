# CONFIGURAR DOMINIOS AUTORIZADOS EN FIREBASE

## 🔴 PROBLEMA

Firebase Console no acepta `localhost:3000` como dominio autorizado porque requiere un formato de dominio válido (como "miapp.com").

## ✅ SOLUCIÓN

Para desarrollo local, Firebase acepta `localhost` (sin el puerto). El puerto se maneja automáticamente.

## 📋 PASOS PARA CONFIGURAR

### 1. Ir a Firebase Console
1. Ve a: https://console.firebase.google.com/
2. Selecciona tu proyecto: `canvasmind-app`

### 2. Configurar Dominios Autorizados
1. Ve a **Authentication** (Autenticación)
2. Haz clic en **Settings** (Configuración) o el ícono de engranaje
3. Busca la sección **Authorized domains** (Dominios autorizados)
4. Haz clic en **Add domain** (Agregar dominio)

### 3. Agregar Dominios

Agrega estos dominios (uno por uno):

#### Para Desarrollo Local:
- **`localhost`** ← Este es el importante para desarrollo

#### Para Producción:
- **`canvasmind-app.web.app`** ← Debería estar ya agregado
- **`canvasmind-app.firebaseapp.com`** ← Debería estar ya agregado

### 4. Formato Correcto

**✅ CORRECTO:**
- `localhost`
- `canvasmind-app.web.app`
- `canvasmind-app.firebaseapp.com`

**❌ INCORRECTO:**
- `localhost:3000` (Firebase no acepta puertos aquí)
- `http://localhost:3000` (no incluir protocolo)
- `localhost:3000` (no incluir puerto)

## 🔍 VERIFICAR CONFIGURACIÓN ACTUAL

### En Firebase Console:
1. Authentication → Settings → Authorized domains
2. Deberías ver al menos:
   - `localhost` (para desarrollo)
   - `canvasmind-app.web.app` (para producción)
   - `canvasmind-app.firebaseapp.com` (automático)

### En el código:
El `authDomain` en `firebase/config.ts` debería ser:
- Para desarrollo: `canvasmind-app.firebaseapp.com` o `canvasmind-app.web.app`
- Firebase maneja automáticamente `localhost` cuando está en la lista de dominios autorizados

## ⚠️ IMPORTANTE

- **No necesitas agregar el puerto**: Firebase maneja `localhost` para cualquier puerto (3000, 3001, etc.)
- **Solo agrega `localhost` una vez**: No necesitas agregar `localhost:3000`, `localhost:3001`, etc.
- **Los cambios pueden tardar unos minutos**: Después de agregar un dominio, espera 1-2 minutos antes de probar

## 🧪 PROBAR DESPUÉS DE CONFIGURAR

1. Agrega `localhost` en Firebase Console
2. Espera 1-2 minutos
3. Recarga la página en `http://localhost:3000`
4. Intenta hacer login con Google
5. El popup debería funcionar correctamente

## 📝 NOTAS ADICIONALES

- Si ya tienes `localhost` agregado y aún no funciona, verifica:
  - Que el `authDomain` en `config.ts` sea correcto
  - Que no haya errores en la consola del navegador
  - Que el popup no esté bloqueado por el navegador

