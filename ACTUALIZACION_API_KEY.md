# ✅ Actualización de API Key Completada

## 🔑 Nueva API Key Configurada

**API Key anterior:** `AIzaSyAzWkK3FYogArhFdFOszAefmgb2smCmoSI`  
**API Key nueva:** `AIzaSyDnDsbb2jVLZmgpfkrpdzA6yTFRpPo2f9c`

---

## 📋 Archivos Actualizados

### ✅ `src/firebase/config.ts`
- API Key actualizada en la configuración de Firebase
- Este es el archivo principal que usa toda la aplicación

---

## 🔄 Próximos Pasos

### 1. Limpiar y Recompilar

```bash
# Limpiar caché
npm run fix-localhost

# O manualmente:
rm -rf .next node_modules/.cache
npm run dev
```

### 2. Verificar en Desarrollo

1. Inicia el servidor: `npm run fix-localhost`
2. Abre: http://localhost:3001
3. Prueba el login con Google
4. Verifica que todo funcione correctamente

### 3. Hacer Build y Deploy

```bash
# Build
npm run build

# Deploy
firebase deploy --only hosting:app-micerebro
```

---

## ⚠️ IMPORTANTE: Configuración en Google Cloud Console

Asegúrate de que la nueva API Key esté configurada correctamente:

### 1. Verificar Restricciones de la API Key

1. Ve a: https://console.cloud.google.com/apis/credentials?project=canvasmind-app
2. Busca la API Key: `AIzaSyDnDsbb2jVLZmgpfkrpdzA6yTFRpPo2f9c`
3. Verifica que tenga:
   - ✅ **Restricciones de aplicación:** Aplicaciones web
   - ✅ **Dominios autorizados:**
     - `localhost`
     - `app-micerebro.web.app`
     - `canvasmind-app.firebaseapp.com`
   - ✅ **Restricciones de API:**
     - Identity Toolkit API
     - Firebase Installations API
     - Firebase Cloud Messaging API (si aplica)

### 2. Verificar en Firebase Console

1. Ve a: https://console.firebase.google.com/project/canvasmind-app/settings/general
2. Verifica que la configuración del proyecto esté correcta
3. Los dominios autorizados deben incluir:
   - `app-micerebro.web.app`
   - `localhost` (para desarrollo)

---

## ✅ Verificación

Después del deploy, verifica:

- [ ] El sitio carga correctamente: https://app-micerebro.web.app
- [ ] El login con Google funciona
- [ ] No hay errores 403 en la consola
- [ ] La autenticación funciona correctamente

---

## 📝 Notas

- La API Key anterior seguirá funcionando hasta que la desactives en Google Cloud Console
- Es recomendable desactivar la API Key anterior una vez que verifiques que la nueva funciona
- Los archivos de build (`.next/`) se regenerarán automáticamente con la nueva API Key

---

**Fecha de actualización:** 5 de Diciembre 2024  
**Estado:** ✅ API Key actualizada en código  
**Pendiente:** Verificación en producción después del deploy
