# Configuración: app-micerebro.web.app con App Hosting

**Fecha**: 2025-12-06  
**Estado**: ✅ **CONFIGURADO**

---

## 🎯 Objetivo

Conectar `app-micerebro.web.app` (Firebase Hosting) con App Hosting backend para que funcione con SSR de Next.js.

---

## ✅ Configuración Implementada

### `firebase.json`

```json
{
  "hosting": [
    {
      "target": "app-micerebro",
      "public": "out",
      "rewrites": [
        {
          "source": "**",
          "destination": "https://canvasmind-backend--canvasmind-app.us-central1.hosted.app"
        }
      ]
    }
  ],
  "apphosting": {
    "backendId": "canvasmind-backend"
  }
}
```

**Explicación:**
- `hosting` mantiene `app-micerebro.web.app` como dominio
- `rewrites` redirige todas las peticiones (`**`) al backend de App Hosting
- `apphosting` mantiene la configuración del backend

---

## 🚀 Cómo Funciona

1. **Usuario accede a**: `https://app-micerebro.web.app`
2. **Firebase Hosting recibe la petición** en el sitio `app-micerebro`
3. **Rewrite redirige** a: `https://canvasmind-backend--canvasmind-app.us-central1.hosted.app`
4. **App Hosting procesa** la petición con SSR de Next.js
5. **Usuario ve** la aplicación funcionando correctamente

---

## 📋 Próximos Pasos

### 1. Hacer Build
```bash
npm run build
```

### 2. Deploy a Firebase Hosting
```bash
firebase deploy --only hosting:app-micerebro
```

### 3. Deploy a App Hosting (si es necesario)
```bash
firebase apphosting:backends:deploy canvasmind-backend
```

---

## ⚠️ IMPORTANTE

- **NO tocar `canvasmind-app.web.app`** - Este sitio debe permanecer intacto
- **El rewrite funciona como proxy** - Firebase Hosting redirige al backend de App Hosting
- **SSL automático** - Firebase proporciona certificado SSL para `app-micerebro.web.app`

---

## ✅ Verificación

Después del deploy, verificar:
- [ ] `https://app-micerebro.web.app` carga correctamente
- [ ] No hay error "Connection closed"
- [ ] Login con Google funciona
- [ ] Login como invitado funciona
- [ ] Redirección a tableros funciona
- [ ] Rutas dinámicas `/board/[boardId]` funcionan

---

## 🔧 Troubleshooting

### Si el rewrite no funciona:
1. Verificar que el backend de App Hosting esté desplegado
2. Verificar que la URL del backend sea correcta
3. Verificar que `firebase.json` tenga la sintaxis correcta

### Si hay errores de CORS:
- App Hosting debe estar configurado para aceptar peticiones de `app-micerebro.web.app`
- Verificar configuración de CORS en el backend

