# 🔴 SOLUCIÓN: Error 403 - API Key Bloqueada

**Fecha**: 2025-12-05  
**Error**: `API_KEY_HTTP_REFERRER_BLOCKED`  
**Dominio bloqueado**: `https://canvasmind-app.firebaseapp.com/`

---

## 🔍 PROBLEMA IDENTIFICADO

El error 403 indica que la **API Key de Firebase** tiene restricciones de HTTP referrer que están bloqueando las solicitudes desde `canvasmind-app.firebaseapp.com`.

**Error completo**:
```
Requests from referer https://canvasmind-app.firebaseapp.com/ are blocked.
Error code: API_KEY_HTTP_REFERRER_BLOCKED
```

---

## ✅ SOLUCIÓN: Agregar Dominio a Restricciones de API Key

### Paso 1: Ir a Google Cloud Console

1. Ve a: https://console.cloud.google.com/apis/credentials?project=canvasmind-app
2. Busca la API Key: **`AIzaSyDnDsbb2jVLZmgpfkrpdzA6yTFRpPo2f9c`**
3. Haz clic en el **nombre de la API Key** (NO en el ícono de copiar)

### Paso 2: Agregar Restricciones de HTTP Referrer

1. En la sección **"Application restrictions"** (Restricciones de aplicación):
   - Asegúrate de que esté seleccionado **"HTTP referrers (web sites)"**
   
2. En la sección **"Website restrictions"** (Restricciones de sitios web):
   - Haz clic en **"+ ADD AN ITEM"** (Agregar elemento)
   - Agrega estos dominios (uno por uno):

#### Dominios a Agregar:

1. **`https://app-micerebro.web.app/*`**
   - Dominio de producción principal

2. **`https://app-micerebro.firebaseapp.com/*`**
   - Dominio alternativo de Firebase

3. **`https://canvasmind-app.firebaseapp.com/*`** ⚠️ **ESTE ES EL QUE FALTA**
   - Dominio que está causando el error 403

4. **`http://localhost:*`** (para desarrollo)
   - Permite cualquier puerto en localhost

5. **`http://127.0.0.1:*`** (para desarrollo)
   - Permite cualquier puerto en 127.0.0.1

### Paso 3: Formato Correcto

**✅ CORRECTO:**
```
https://app-micerebro.web.app/*
https://app-micerebro.firebaseapp.com/*
https://canvasmind-app.firebaseapp.com/*
http://localhost:*
http://127.0.0.1:*
```

**❌ INCORRECTO:**
```
https://app-micerebro.web.app (sin /*)
http://localhost:3001 (puerto específico - mejor usar *)
canvasmind-app.firebaseapp.com (sin https://)
```

### Paso 4: Guardar Cambios

1. Desplázate hasta la parte inferior de la página
2. Haz clic en **"SAVE"** (Guardar)
3. Espera 1-2 minutos para que los cambios se propaguen

---

## 🔍 VERIFICACIÓN

### Verificar en Google Cloud Console:

1. Ve a: https://console.cloud.google.com/apis/credentials?project=canvasmind-app
2. Abre la API Key `AIzaSyDnDsbb2jVLZmgpfkrpdzA6yTFRpPo2f9c`
3. Verifica que en **"Website restrictions"** aparezcan:
   - ✅ `https://app-micerebro.web.app/*`
   - ✅ `https://app-micerebro.firebaseapp.com/*`
   - ✅ `https://canvasmind-app.firebaseapp.com/*` ← **ESTE ES EL CRÍTICO**
   - ✅ `http://localhost:*`
   - ✅ `http://127.0.0.1:*`

### Probar en Producción:

1. Abre: https://app-micerebro.web.app
2. Abre la consola del navegador (F12)
3. Intenta iniciar sesión con Google
4. Verifica que **NO aparezca el error 403**

---

## 📋 RESUMEN DE DOMINIOS NECESARIOS

| Tipo | Dominio | Propósito |
|------|---------|-----------|
| **Producción** | `https://app-micerebro.web.app/*` | URL principal de producción |
| **Firebase Alt** | `https://app-micerebro.firebaseapp.com/*` | URL alternativa de Firebase |
| **Firebase Auth** | `https://canvasmind-app.firebaseapp.com/*` | ⚠️ **CRÍTICO - Causa el error 403** |
| **Desarrollo** | `http://localhost:*` | Desarrollo local (cualquier puerto) |
| **Desarrollo** | `http://127.0.0.1:*` | Desarrollo local (IP) |

---

## ⚠️ IMPORTANTE

- **Los cambios pueden tardar 1-2 minutos** en propagarse
- **No elimines otros dominios** que ya estén configurados
- **Usa el formato con `/*` al final** para permitir todas las rutas
- **El dominio `canvasmind-app.firebaseapp.com` es necesario** porque Firebase Auth lo usa internamente

---

## 🔄 DESPUÉS DE CONFIGURAR

Una vez que agregues `canvasmind-app.firebaseapp.com/*` a las restricciones:

1. Espera 1-2 minutos
2. Recarga la página en producción
3. Intenta iniciar sesión con Google nuevamente
4. El error 403 debería desaparecer

---

## 📝 NOTA TÉCNICA

El dominio `canvasmind-app.firebaseapp.com` es usado por Firebase Authentication internamente cuando se hace el redirect de OAuth. Aunque tu aplicación esté en `app-micerebro.web.app`, Firebase Auth puede usar `canvasmind-app.firebaseapp.com` como parte del flujo de autenticación, por lo que **debe estar autorizado** en las restricciones de la API Key.
