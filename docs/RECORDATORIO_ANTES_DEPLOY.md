# ⚠️ RECORDATORIO CRÍTICO: Antes de Hacer Deploy

**Fecha**: 2025-12-04  
**URL de Deploy**: `https://app-micerebro.web.app`

---

## 🚨 IMPORTANTE: NO HACER DEPLOY SIN COMPLETAR ESTOS PASOS

Antes de ejecutar `firebase deploy --only hosting:app-micerebro`, **DEBES** configurar los dominios autorizados.

---

## ✅ Checklist Obligatorio

### Paso 1: Firebase Console - Dominios Autorizados
- [ ] Ir a: https://console.firebase.google.com/project/canvasmind-app/authentication/settings
- [ ] Agregar dominio: `app-micerebro.web.app`
- [ ] Verificar que aparece en la lista

### Paso 2: Google Cloud Console - OAuth 2.0
- [ ] Ir a: https://console.cloud.google.com/apis/credentials?project=canvasmind-app
- [ ] Editar el cliente OAuth 2.0 (buscar por Client ID: `917199598510-14h0c930cobfvnig8kdfj5i42untd7rg`)
- [ ] Agregar en "Authorized JavaScript origins": `https://app-micerebro.web.app`
- [ ] Agregar en "Authorized redirect URIs": `https://app-micerebro.firebaseapp.com/__/auth/handler`
- [ ] **GUARDAR CAMBIOS** (botón "SAVE" al final de la página)

### Paso 3: Esperar Propagación
- [ ] Esperar 1-2 minutos después de guardar cambios
- [ ] Verificar que los cambios se guardaron correctamente

---

## 📋 URLs a Agregar (Resumen Rápido)

| Ubicación | URL |
|-----------|-----|
| **Firebase Console** | `app-micerebro.web.app` |
| **Google Cloud (JavaScript)** | `https://app-micerebro.web.app` |
| **Google Cloud (Redirect)** | `https://app-micerebro.firebaseapp.com/__/auth/handler` |

---

## 🚀 Comando de Deploy (Solo después de completar el checklist)

```bash
npm run build
firebase deploy --only hosting:app-micerebro
```

---

## 📖 Guía Completa

Ver guía detallada en: `docs/CONFIGURAR_DOMINIOS_APP_MICEREBRO.md`

---

**⚠️ NO OMITIR ESTOS PASOS - La autenticación no funcionará sin ellos**

