# Configuración Completa: todoenorden.cl

**Fecha**: 2025-12-06  
**Dominio**: todoenorden.cl  
**Estado DNS**: ✅ Configurado en nic.cl

---

## ✅ Paso 1: DNS Configurado

Los nameservers ya están configurados en nic.cl:
- `ns-cloud-d1.googledomains.com`
- `ns-cloud-d2.googledomains.com`
- `ns-cloud-d3.googledomains.com`
- `ns-cloud-d4.googledomains.com`

---

## 📋 Paso 2: Firebase Authentication

### Agregar dominio autorizado:

1. **Ve a Firebase Authentication:**
   - https://console.firebase.google.com/project/canvasmind-app/authentication/settings

2. **Haz clic en la pestaña "Dominios autorizados"**

3. **Busca el botón "Agregar dominio" o "+"** (generalmente está arriba de la tabla)

4. **Ingresa el dominio:**
   ```
   todoenorden.cl
   ```

5. **Haz clic en "Agregar" o "Guardar"**

### Verificación:
Después de agregar, deberías ver `todoenorden.cl` en la lista junto con:
- `localhost`
- `app-micerebro.web.app`
- `canvasmind-backend--canvasmind-app.us-central1.hosted.app`

---

## 📋 Paso 3: Google Cloud OAuth

### Configurar OAuth 2.0 Client ID:

1. **Ve a Google Cloud Console:**
   - https://console.cloud.google.com/apis/credentials?project=canvasmind-app

2. **Busca "OAuth 2.0 Client IDs"** en la lista de credenciales

3. **Haz clic en el cliente OAuth** (probablemente se llama "Web client" o tiene un nombre similar)

4. **En "Authorized JavaScript origins" (Orígenes de JavaScript autorizados):**
   - Haz clic en "+ Agregar URI"
   - Agrega: `https://todoenorden.cl`
   - Haz clic en "+ Agregar URI" de nuevo
   - Agrega: `https://www.todoenorden.cl`

5. **En "Authorized redirect URIs" (URIs de redireccionamiento autorizados):**
   - Haz clic en "+ Agregar URI"
   - Agrega: `https://todoenorden.cl/__/auth/handler`
   - Haz clic en "+ Agregar URI" de nuevo
   - Agrega: `https://www.todoenorden.cl/__/auth/handler`

6. **Haz clic en "Guardar"**

---

## 📋 Paso 4: Firebase App Hosting

### Nota sobre App Hosting:

Firebase App Hosting puede requerir configuración adicional a través de:
- Google Cloud Console (Cloud Run)
- O puede que el dominio se configure automáticamente después de los pasos anteriores

### Verificar en Firebase App Hosting:

1. **Ve a Firebase App Hosting:**
   - https://console.firebase.google.com/project/canvasmind-app/apphosting/backends/canvasmind-backend/locations/us-central1/overview

2. **Busca la sección "Custom domains" o "Dominios personalizados"**

3. **Si hay un botón "Add custom domain" o "Agregar dominio personalizado":**
   - Haz clic en él
   - Ingresa: `todoenorden.cl`
   - Sigue las instrucciones de verificación

---

## ⏱️ Tiempo de Propagación

Los cambios DNS pueden tardar **24-48 horas** en propagarse completamente.

---

## ✅ Verificación Final

Después de 24-48 horas, verifica:

1. **DNS:**
   ```bash
   dig todoenorden.cl NS
   dig todoenorden.cl A
   ```

2. **Acceso:**
   - Intenta acceder a: `https://todoenorden.cl`
   - Debería cargar la aplicación

3. **Autenticación:**
   - Intenta hacer login con Google
   - Debería funcionar correctamente

---

## 🆘 Si hay problemas

1. Verifica que los DNS estén correctos en nic.cl
2. Verifica que el dominio esté en Firebase Authentication
3. Verifica que el dominio esté en Google Cloud OAuth
4. Espera 24-48 horas para la propagación DNS
5. Verifica que el dominio esté agregado en Firebase App Hosting (si aplica)

---

## 📝 Resumen de URLs

- **Firebase Authentication:** https://console.firebase.google.com/project/canvasmind-app/authentication/settings
- **Google Cloud OAuth:** https://console.cloud.google.com/apis/credentials?project=canvasmind-app
- **Firebase App Hosting:** https://console.firebase.google.com/project/canvasmind-app/apphosting/backends/canvasmind-backend/locations/us-central1/overview

