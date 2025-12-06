# 🔧 Solución: Error de Cloud Build Connection

## 🔴 Error Encontrado

```
error in CreateBuild: git repository link name must be in the format of 
'projects/*/locations/*/connections/*/gitRepositoryLinks/*'
```

## 🔍 Causa del Problema

Firebase App Hosting **NO acepta URLs directas de GitHub**. Necesita que el repositorio esté conectado a través de una **Cloud Build Connection**.

## ✅ Solución: Crear Cloud Build Connection

### Paso 1: Ir a Cloud Build Connections

1. Ve a: https://console.cloud.google.com/cloud-build/connections
2. O desde Firebase Console:
   - Firebase Console → App Hosting → Tu backend
   - Haz clic en "Edit" o "Configurar"
   - Busca "Repository Connection" o "Conexión de Repositorio"
   - Haz clic en "Create Connection" o "Crear Conexión"

### Paso 2: Crear la Conexión

1. **Selecciona el proveedor**: GitHub
2. **Autoriza Google Cloud**:
   - Haz clic en "Authorize" o "Autorizar"
   - Inicia sesión con tu cuenta de GitHub
   - Autoriza los permisos necesarios
3. **Instala la app de GitHub** (si es necesario):
   - Selecciona el repositorio: `-https-console.firebase.google.com-project-canvasmind-app-apphosting`
   - O selecciona "All repositories" si prefieres
4. **Crea la conexión**:
   - Nombre: `github-connection` (o el que prefieras)
   - Región: `us-central1` (debe coincidir con tu backend)
   - Haz clic en "Create"

### Paso 3: Conectar el Repositorio

Después de crear la conexión:

1. **Crea el Git Repository Link**:
   - En la misma página, haz clic en "Create Repository Link"
   - Nombre: `canvasmind-repo-link`
   - Repositorio: Selecciona tu repositorio de GitHub
   - Rama: `main`
   - Haz clic en "Create"

### Paso 4: Actualizar el Backend en Firebase

1. Ve a: Firebase Console → App Hosting
2. Selecciona tu backend (el que acabas de crear)
3. Haz clic en "Edit" o "Configurar"
4. En "Source Repository":
   - Selecciona la conexión que acabas de crear
   - Selecciona el repositorio link que creaste
   - Rama: `main`
5. Guarda los cambios

## 🔄 Alternativa: Reconfigurar desde Firebase Console

Si prefieres hacerlo todo desde Firebase:

1. **Elimina el backend actual** (si es necesario):
   - Firebase Console → App Hosting
   - Selecciona el backend
   - Haz clic en "Delete" o "Eliminar"

2. **Crea un nuevo backend**:
   - Haz clic en "Create Backend" o "Crear Backend"
   - En "Import a GitHub repository":
     - Si aparece la opción de crear conexión, haz clic ahí
     - Sigue los pasos para autorizar GitHub
     - Selecciona tu repositorio
   - Completa la configuración:
     - Región: `us-central1`
     - Rama: `main`
     - Directorio raíz: `/`
     - Backend ID: `app-micerebro-backend` (o el que prefieras)

## 📋 Verificación

Después de configurar la conexión:

1. **Verifica la conexión**:
   ```bash
   gcloud builds connections list --region=us-central1
   ```

2. **Verifica el repositorio link**:
   ```bash
   gcloud builds connections repositories list \
     --connection=github-connection \
     --region=us-central1
   ```

3. **Intenta un nuevo deploy**:
   - Firebase Console → App Hosting → Tu backend
   - Haz clic en "Deploy" o "Redeploy"
   - O haz un push al repositorio (debería desplegar automáticamente)

## ⚠️ Notas Importantes

1. **La conexión debe estar en la misma región** que tu backend (`us-central1`)
2. **El repositorio debe ser accesible** desde tu cuenta de GitHub
3. **La rama debe existir** en el repositorio (`main`)
4. **Puede tardar unos minutos** en crear la conexión

## 🆘 Si Tienes Problemas

### Error: "Connection already exists"
- La conexión ya existe, solo necesitas usarla
- Ve a Cloud Build Connections y selecciona la existente

### Error: "Repository not found"
- Verifica que el repositorio existe en GitHub
- Verifica que tienes acceso al repositorio
- Verifica que autorizaste correctamente GitHub

### Error: "Region mismatch"
- La conexión debe estar en `us-central1`
- El backend debe estar en `us-central1`
- Ambos deben coincidir

## 📚 Referencias

- [Firebase App Hosting - Connect Repository](https://firebase.google.com/docs/app-hosting/connect-repo)
- [Cloud Build Connections](https://cloud.google.com/build/docs/automate-builds/github/connect-repo-github)

