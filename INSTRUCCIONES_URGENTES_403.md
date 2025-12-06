# 🚨 INSTRUCCIONES URGENTES: Error 403 en Autenticación

## PROBLEMA ACTUAL
```
POST https://securetoken.googleapis.com/v1/token?key=AIzaSyAzWkK3FYogArhFdFOszAefmgb2smCmoSI 403 (Forbidden)
```

**Esto impide que los usuarios se autentiquen.**

---

## ✅ SOLUCIÓN INMEDIATA (5 minutos)

### 1. Firebase Console - Agregar Dominio (2 minutos)

**URL Directa:**
https://console.firebase.google.com/project/canvasmind-app/authentication/settings

**Pasos:**
1. Desplázate a **"Authorized domains"**
2. Click en **"Add domain"**
3. Ingresa: **`app-micerebro.web.app`**
4. Click en **"Add"**

---

### 2. Google Cloud Console - API Key (2 minutos)

**URL Directa:**
https://console.cloud.google.com/apis/credentials?project=canvasmind-app

**Pasos:**
1. Busca la API Key: **`AIzaSyAzWkK3FYogArhFdFOszAefmgb2smCmoSI`**
2. Click en el nombre para editarla
3. En **"API restrictions"**, verifica que estén habilitadas:
   - ✅ Identity Toolkit API
   - ✅ Token Service API
   - ✅ Firebase Installations API
4. En **"Application restrictions"**:
   - ⚠️ **CRÍTICO:** Si ya hay restricciones (como `canvasmind-app.web.app/*`), **NO LAS ELIMINES**
   - Si está en "None", cambia a **"HTTP referrers"**
   - **AGREGAR** (sin eliminar existentes):
     - `https://app-micerebro.web.app/*`
     - `https://app-micerebro.firebaseapp.com/*`
     - `http://localhost:*` (si no está ya)
   - ⚠️ **MANTENER** `https://canvasmind-app.web.app/*` si existe
5. Click en **"SAVE"**

---

### 3. Google Cloud Console - OAuth 2.0 (1 minuto)

**En la misma página de Credentials:**

1. Busca **"OAuth 2.0 Client IDs"**
2. Click en el cliente web para editarlo
3. En **"Authorized JavaScript origins"**:
   - ⚠️ **NO ELIMINES** los orígenes existentes (como `canvasmind-app.web.app`)
   - Haz clic en **"+ ADD URI"** y **AGREGA**:
     - `https://app-micerebro.web.app`
4. En **"Authorized redirect URIs"**:
   - ⚠️ **NO ELIMINES** los URIs existentes
   - Haz clic en **"+ ADD URI"** y **AGREGA**:
     - `https://app-micerebro.firebaseapp.com/__/auth/handler`
5. Click en **"SAVE"**

---

## ⏱️ ESPERAR Y PROBAR

1. **Espera 2-5 minutos** después de guardar
2. **Limpia caché del navegador** (Ctrl+Shift+R)
3. **Prueba en modo incógnito**
4. **Intenta hacer login** en `https://app-micerebro.web.app`

---

## ✅ VERIFICACIÓN

Si todo está correcto, deberías poder:
- ✅ Ver la página de login
- ✅ Hacer clic en "Iniciar Sesión con Google"
- ✅ Completar el login sin errores 403
- ✅ Ser redirigido al tablero

---

**⚠️ ESTO ES CRÍTICO - Sin estos cambios, la autenticación NO funcionará**
