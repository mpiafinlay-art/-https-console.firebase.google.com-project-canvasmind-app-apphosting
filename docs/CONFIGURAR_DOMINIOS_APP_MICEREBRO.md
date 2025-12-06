# Configurar Dominios Autorizados para app-micerebro

**Fecha**: 2025-12-04  
**URL de la aplicación**: `https://app-micerebro.web.app`

---

## 📋 Checklist de Configuración

- [ ] **Paso 1**: Agregar dominio en Firebase Console (Authentication)
- [ ] **Paso 2**: Agregar orígenes de JavaScript en Google Cloud Console
- [ ] **Paso 3**: Agregar URIs de redireccionamiento en Google Cloud Console
- [ ] **Paso 4**: Verificar configuración

---

## 🔐 Paso 1: Firebase Console - Dominios Autorizados

### 1.1 Acceder a la configuración de Authentication

1. Ve a: **https://console.firebase.google.com/project/canvasmind-app/authentication/settings**
2. O navega manualmente:
   - Abre: https://console.firebase.google.com/
   - Selecciona el proyecto: **`canvasmind-app`**
   - En el menú lateral, haz clic en **"Authentication"** (Autenticación)
   - Haz clic en la pestaña **"Settings"** (Configuración) o en el ícono de engranaje ⚙️

### 1.2 Agregar el nuevo dominio

1. Desplázate hasta la sección **"Authorized domains"** (Dominios autorizados)
2. Haz clic en el botón **"Add domain"** (Agregar dominio)
3. Ingresa: **`app-micerebro.web.app`**
4. Haz clic en **"Add"** (Agregar)

### 1.3 Verificar

Deberías ver en la lista de dominios autorizados:
- ✅ `localhost` (para desarrollo)
- ✅ `canvasmind-app.web.app` (sitio original)
- ✅ `canvasmind-app.firebaseapp.com` (automático)
- ✅ **`app-micerebro.web.app`** ← **NUEVO**

---

## 🌐 Paso 2: Google Cloud Console - Orígenes de JavaScript

### 2.1 Acceder a Credenciales de OAuth

1. Ve a: **https://console.cloud.google.com/apis/credentials?project=canvasmind-app**
2. O navega manualmente:
   - Abre: https://console.cloud.google.com/
   - Asegúrate de que el proyecto seleccionado sea **`canvasmind-app`** (verifica en la parte superior)
   - En el menú lateral, ve a **"APIs & Services"** → **"Credentials"** (Credenciales)

### 2.2 Encontrar el Cliente OAuth 2.0

1. En la sección **"OAuth 2.0 Client IDs"**, busca el cliente que corresponde a tu aplicación web
2. **Cómo identificarlo**:
   - Busca un cliente con el nombre que incluya "Web client" o similar
   - O busca el cliente que tenga el **Client ID** que aparece en `src/firebase/auth.ts`:
     - `917199598510-14h0c930cobfvnig8kdfj5i42untd7rg.apps.googleusercontent.com`
3. Haz clic en el **nombre del cliente** (NO en el ícono de copiar) para editarlo

### 2.3 Agregar Origen de JavaScript

1. En la sección **"Authorized JavaScript origins"** (Orígenes de JavaScript autorizados):
2. Haz clic en **"+ ADD URI"** (Agregar URI)
3. Ingresa: **`https://app-micerebro.web.app`**
4. Haz clic en **"Add"** (Agregar)

**Nota**: No incluyas la barra final (`/`) al final de la URL.

---

## 🔄 Paso 3: Google Cloud Console - URIs de Redireccionamiento

### 3.1 Agregar URI de Redireccionamiento

1. En la misma página de edición del cliente OAuth (del Paso 2)
2. Desplázate hasta la sección **"Authorized redirect URIs"** (URIs de redireccionamiento autorizadas)
3. Haz clic en **"+ ADD URI"** (Agregar URI)
4. Ingresa: **`https://app-micerebro.firebaseapp.com/__/auth/handler`**
5. Haz clic en **"Add"** (Agregar)

**Nota**: Esta URI es específica de Firebase Authentication y debe tener exactamente este formato.

### 3.2 Guardar Cambios

1. Desplázate hasta la parte inferior de la página
2. Haz clic en el botón **"SAVE"** (Guardar)
3. Espera a que aparezca el mensaje de confirmación

**⚠️ IMPORTANTE**: Los cambios pueden tardar 1-2 minutos en propagarse.

---

## ✅ Paso 4: Verificación

### 4.1 Verificar en Firebase Console

1. Ve a: https://console.firebase.google.com/project/canvasmind-app/authentication/settings
2. Verifica que `app-micerebro.web.app` aparezca en la lista de dominios autorizados

### 4.2 Verificar en Google Cloud Console

1. Ve a: https://console.cloud.google.com/apis/credentials?project=canvasmind-app
2. Abre el cliente OAuth 2.0 que editaste
3. Verifica que en **"Authorized JavaScript origins"** aparezca:
   - ✅ `https://app-micerebro.web.app`
4. Verifica que en **"Authorized redirect URIs"** aparezca:
   - ✅ `https://app-micerebro.firebaseapp.com/__/auth/handler`

---

## 🧪 Prueba Rápida (Después del Deploy)

Una vez que hayas hecho el deploy, puedes probar:

1. Abre: `https://app-micerebro.web.app`
2. Intenta iniciar sesión con Google
3. Si funciona correctamente, verás el flujo de autenticación sin errores

---

## 📝 Resumen de URLs a Agregar

### Firebase Console (Authentication → Settings → Authorized domains):
- `app-micerebro.web.app`

### Google Cloud Console (OAuth 2.0 Client → Authorized JavaScript origins):
- `https://app-micerebro.web.app`

### Google Cloud Console (OAuth 2.0 Client → Authorized redirect URIs):
- `https://app-micerebro.firebaseapp.com/__/auth/handler`

---

## ⚠️ Notas Importantes

1. **No incluyas la barra final** (`/`) en las URLs
2. **Usa HTTPS** en todas las URLs (excepto `localhost` en desarrollo)
3. **Los cambios pueden tardar 1-2 minutos** en propagarse
4. **Verifica el proyecto correcto** antes de hacer cambios (debe ser `canvasmind-app`)

---

## 🆘 Solución de Problemas

### Error: "Domain already exists"
- El dominio ya está agregado. Verifica que esté en la lista.

### Error: "Invalid domain format"
- Asegúrate de no incluir `http://` o `https://` en Firebase Console (solo el dominio)
- Asegúrate de incluir `https://` en Google Cloud Console

### Error: "403 Forbidden" después del deploy
- Verifica que hayas guardado los cambios en Google Cloud Console
- Espera 2-3 minutos y vuelve a intentar
- Verifica que el proyecto seleccionado sea `canvasmind-app`

---

**Estado**: ⏳ **PENDIENTE** - Sigue estos pasos antes de hacer el deploy

