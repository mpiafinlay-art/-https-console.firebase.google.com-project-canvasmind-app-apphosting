# Guía: Configurar App Hosting con dominio app-micerebro.web.app

## Objetivo
Configurar Firebase App Hosting para que use el dominio `app-micerebro.web.app` sin cambiar la URL final.

---

## Paso 1: Acceder a Firebase App Hosting

1. Abre tu navegador y ve a:
   ```
   https://console.firebase.google.com/project/canvasmind-app/apphosting
   ```

2. Deberías ver el backend `canvasmind-backend` listado.

---

## Paso 2: Seleccionar el Backend

1. Haz clic en el backend `canvasmind-backend`
2. Esto te llevará a la página de detalles del backend

---

## Paso 3: Configurar Dominio Personalizado

1. En la página del backend, busca la sección **"Custom domains"** o **"Dominios personalizados"**
2. Haz clic en **"Add custom domain"** o **"Agregar dominio personalizado"**

---

## Paso 4: Agregar el Dominio

1. En el campo de dominio, ingresa:
   ```
   app-micerebro.web.app
   ```

2. Haz clic en **"Continue"** o **"Continuar"**

---

## Paso 5: Verificar el Dominio

Firebase te mostrará instrucciones para verificar el dominio. Generalmente incluye:

1. **Agregar un registro TXT en DNS** (si es necesario)
   - Firebase te dará un valor TXT específico
   - Debes agregarlo en tu proveedor de DNS

2. **Esperar la propagación DNS** (puede tardar unos minutos)

---

## Paso 6: Confirmar la Configuración

1. Una vez verificado, Firebase mostrará el dominio como **"Active"** o **"Activo"**
2. El dominio `app-micerebro.web.app` ahora apuntará directamente a App Hosting

---

## Paso 7: Verificar que Funciona

1. Espera unos minutos para que los cambios se propaguen
2. Visita: `https://app-micerebro.web.app`
3. Deberías ver tu aplicación funcionando con rutas dinámicas

---

## Notas Importantes

- **No necesitas cambiar `firebase.json`** - La configuración se hace desde la consola
- **El dominio `app-micerebro.web.app` es propiedad de Firebase** - No necesitas configurar DNS externo
- **App Hosting soporta rutas dinámicas** - A diferencia de Hosting estático, App Hosting puede manejar `/board/[boardId]`

---

## Si Tienes Problemas

1. **Verifica que el backend esté desplegado:**
   ```bash
   firebase apphosting:backends:list
   ```

2. **Verifica el estado del dominio:**
   - En la consola de App Hosting, revisa el estado del dominio
   - Debe estar en "Active" o "Activo"

3. **Revisa los logs del backend:**
   - En la consola, ve a "Logs" o "Registros" del backend
   - Verifica que no haya errores

---

## URL de Acceso Rápido

- **Consola de App Hosting:** https://console.firebase.google.com/project/canvasmind-app/apphosting
- **Backend específico:** https://console.firebase.google.com/project/canvasmind-app/apphosting/backends/canvasmind-backend/locations/us-central1/overview

