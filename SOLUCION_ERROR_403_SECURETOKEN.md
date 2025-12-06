# SOLUCIÓN: Error 403 en securetoken.googleapis.com
**Fecha:** 5 de Diciembre 2024  
**Estado:** ⚠️ **REQUIERE CONFIGURACIÓN MANUAL EN CONSOLAS**

---

## 🐛 PROBLEMA

```
POST https://securetoken.googleapis.com/v1/token?key=AIzaSyAzWkK3FYogArhFdFOszAefmgb2smCmoSI 403 (Forbidden)
```

Este error indica que la **API Key de Firebase no tiene permisos** para acceder a la API de Secure Token, o que el dominio `app-micerebro.web.app` **NO está autorizado**.

---

## ✅ SOLUCIÓN PASO A PASO

### Paso 1: Firebase Console - Agregar Dominio Autorizado

1. **Ir a Firebase Console:**
   - URL: https://console.firebase.google.com/project/canvasmind-app/authentication/settings
   - O navega: Firebase Console → Proyecto `canvasmind-app` → Authentication → Settings (⚙️)

2. **Agregar Dominio:**
   - Desplázate a la sección **"Authorized domains"** (Dominios autorizados)
   - Haz clic en **"Add domain"** (Agregar dominio)
   - Ingresa: **`app-micerebro.web.app`**
   - Haz clic en **"Add"**

3. **Verificar:**
   Deberías ver en la lista:
   - ✅ `localhost`
   - ✅ `canvasmind-app.web.app`
   - ✅ `canvasmind-app.firebaseapp.com`
   - ✅ **`app-micerebro.web.app`** ← **NUEVO**

---

### Paso 2: Google Cloud Console - Verificar API Key

1. **Ir a Google Cloud Console:**
   - URL: https://console.cloud.google.com/apis/credentials?project=canvasmind-app
   - O navega: Google Cloud Console → Proyecto `canvasmind-app` → APIs & Services → Credentials

2. **Encontrar la API Key:**
   - Busca la API Key: **`AIzaSyAzWkK3FYogArhFdFOszAefmgb2smCmoSI`**
   - Haz clic en el nombre de la API Key para editarla

3. **Verificar Restricciones de API:**
   - En la sección **"API restrictions"**, verifica que estas APIs estén habilitadas:
     - ✅ **Identity Toolkit API**
     - ✅ **Token Service API**
     - ✅ **Firebase Installations API**
   - Si alguna falta, selecciona **"Restrict key"** y agrega las APIs faltantes

4. **Verificar Restricciones de Aplicación:**
   - En la sección **"Application restrictions"**, verifica:
     - ⚠️ **IMPORTANTE:** Si ya hay restricciones configuradas (como `canvasmind-app.web.app`), **NO LAS ELIMINES**
     - Si está en **"None"** → Cambiar a **"HTTP referrers (web sites)"**
     - **AGREGAR** (sin eliminar los existentes) estos referrers:
       - `https://app-micerebro.web.app/*`
       - `https://app-micerebro.firebaseapp.com/*`
       - `http://localhost:*` (para desarrollo, si no está ya)
       - ⚠️ **MANTENER** `https://canvasmind-app.web.app/*` si ya existe (NO ELIMINAR)

5. **Guardar:**
   - Haz clic en **"SAVE"** (Guardar) al final de la página
   - Espera 1-2 minutos para que los cambios se propaguen

---

### Paso 3: Google Cloud Console - OAuth 2.0 Client

1. **Ir a Credenciales OAuth:**
   - En la misma página de Credentials, busca la sección **"OAuth 2.0 Client IDs"**
   - Busca el cliente que corresponde a tu aplicación web (generalmente tiene el nombre del proyecto)

2. **Editar Cliente OAuth:**
   - Haz clic en el nombre del cliente para editarlo

3. **Agregar Orígenes de JavaScript:**
   - En **"Authorized JavaScript origins"**, verifica que existan los dominios actuales (como `canvasmind-app.web.app`)
   - ⚠️ **NO ELIMINES los existentes**
   - Haz clic en **"+ ADD URI"** para **AGREGAR** (no reemplazar):
     - **`https://app-micerebro.web.app`**
   - Haz clic en **"ADD"**

4. **Agregar URIs de Redireccionamiento:**
   - En **"Authorized redirect URIs"**, verifica que existan los URIs actuales
   - ⚠️ **NO ELIMINES los existentes**
   - Haz clic en **"+ ADD URI"** para **AGREGAR** (no reemplazar):
     - **`https://app-micerebro.firebaseapp.com/__/auth/handler`**
   - Haz clic en **"ADD"**

5. **Guardar:**
   - Haz clic en **"SAVE"** (Guardar)
   - Espera 1-2 minutos

---

## 📋 CHECKLIST DE VERIFICACIÓN

Después de completar los pasos, verifica:

### Firebase Console:
- [ ] `app-micerebro.web.app` aparece en "Authorized domains"
- [ ] `localhost` está en la lista (para desarrollo)

### Google Cloud Console - API Key:
- [ ] API Key tiene "Identity Toolkit API" habilitada
- [ ] API Key tiene "Token Service API" habilitada
- [ ] API Key tiene restricciones de HTTP referrers con `app-micerebro.web.app`

### Google Cloud Console - OAuth 2.0:
- [ ] `https://app-micerebro.web.app` en "Authorized JavaScript origins"
- [ ] `https://app-micerebro.firebaseapp.com/__/auth/handler` en "Authorized redirect URIs"

---

## ⏱️ TIEMPO DE PROPAGACIÓN

- **Firebase Console:** 1-2 minutos
- **Google Cloud Console:** 1-5 minutos (puede tardar hasta 1 hora en casos raros)

---

## 🔍 VERIFICAR QUE FUNCIONA

1. **Esperar 2-5 minutos** después de hacer los cambios
2. **Limpiar caché del navegador** (Ctrl+Shift+R / Cmd+Shift+R)
3. **Probar en modo incógnito**
4. **Intentar hacer login** en `https://app-micerebro.web.app`
5. **Verificar consola** - NO debería aparecer el error 403

---

## 🚨 SI EL ERROR PERSISTE

1. **Verificar que los cambios se guardaron:**
   - Revisa nuevamente las consolas
   - Asegúrate de haber hecho clic en "SAVE" / "GUARDAR"

2. **Verificar que estás en el proyecto correcto:**
   - Firebase: Proyecto `canvasmind-app`
   - Google Cloud: Proyecto `canvasmind-app`

3. **Verificar formato de URLs:**
   - ✅ Correcto: `https://app-micerebro.web.app`
   - ❌ Incorrecto: `app-micerebro.web.app` (sin https)
   - ❌ Incorrecto: `http://app-micerebro.web.app` (http en lugar de https)

4. **Esperar más tiempo:**
   - A veces los cambios pueden tardar hasta 1 hora en propagarse completamente

---

**Última Actualización:** 5 de Diciembre 2024  
**Estado:** ⚠️ Requiere configuración manual en consolas
