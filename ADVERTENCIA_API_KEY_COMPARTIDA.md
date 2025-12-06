# ⚠️ ADVERTENCIA: API Key Compartida

## 🔑 IMPORTANTE

La API Key `AIzaSyAzWkK3FYogArhFdFOszAefmgb2smCmoSI` es **COMPARTIDA** entre:
- ✅ `canvasmind-app.web.app` (sitio original)
- ✅ `app-micerebro.web.app` (nuevo sitio)

---

## ✅ LO QUE DEBES HACER

### AGREGAR dominios, NO reemplazarlos

Cuando configures las restricciones en Google Cloud Console:

1. **API Key - Application Restrictions:**
   - ✅ **AGREGAR** `https://app-micerebro.web.app/*`
   - ✅ **MANTENER** `https://canvasmind-app.web.app/*` (si existe)
   - ✅ **MANTENER** `http://localhost:*` (si existe)

2. **OAuth 2.0 - JavaScript Origins:**
   - ✅ **AGREGAR** `https://app-micerebro.web.app`
   - ✅ **MANTENER** `https://canvasmind-app.web.app` (si existe)

3. **OAuth 2.0 - Redirect URIs:**
   - ✅ **AGREGAR** `https://app-micerebro.firebaseapp.com/__/auth/handler`
   - ✅ **MANTENER** los URIs existentes de `canvasmind-app`

---

## ❌ LO QUE NO DEBES HACER

- ❌ **NO ELIMINAR** dominios existentes
- ❌ **NO REEMPLAZAR** la lista completa
- ❌ **NO CAMBIAR** las restricciones de API (solo verificar que estén habilitadas)

---

## 📋 VERIFICACIÓN FINAL

Después de agregar los nuevos dominios, deberías tener:

### API Key - HTTP Referrers:
- `https://canvasmind-app.web.app/*` (existente)
- `https://app-micerebro.web.app/*` (nuevo)
- `https://app-micerebro.firebaseapp.com/*` (nuevo)
- `http://localhost:*` (si aplica)

### OAuth 2.0 - JavaScript Origins:
- `https://canvasmind-app.web.app` (existente)
- `https://app-micerebro.web.app` (nuevo)

### OAuth 2.0 - Redirect URIs:
- URIs existentes de `canvasmind-app` (mantener)
- `https://app-micerebro.firebaseapp.com/__/auth/handler` (nuevo)

---

**⚠️ Si eliminas los dominios existentes, `canvasmind-app.web.app` dejará de funcionar**
