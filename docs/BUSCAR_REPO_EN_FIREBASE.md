# 🔍 Buscar Repositorio en Firebase Console

## 🎯 Objetivo
Encontrar la URL del repositorio Git del último deploy exitoso (commit 73c3be, 22 Nov 2025) desde Firebase Console.

## 🚀 Pasos Detallados

### Paso 1: Abre Firebase Console
Ve directamente a:
```
https://console.firebase.google.com/project/canvasmind-app/apphosting
```

O navega manualmente:
1. Ve a: https://console.firebase.google.com/
2. Selecciona el proyecto: **canvasmind-app**
3. En el menú lateral, busca y haz clic en: **"App Hosting"**

### Paso 2: Selecciona el Backend
1. En la lista de backends, busca: **`canvasmind-backend`**
2. Haz clic en **`canvasmind-backend`**

### Paso 3: Busca la Información del Repositorio
En la página del backend, busca una de estas secciones:

#### Opción A: Sección "Repository" o "Repositorio"
- Debería mostrar algo como:
  - **Repository**: `mpiafinlay-art-firebase-framework-tools`
  - **URL**: `https://github.com/usuario/repositorio.git` (o GitLab/Bitbucket)

#### Opción B: Sección "Source" o "Fuente"
- Puede mostrar la conexión del repositorio Git

#### Opción C: Sección "Connected Repository" o "Repositorio Conectado"
- Muestra el repositorio Git conectado

#### Opción D: Pestaña "Settings" o "Configuración"
- Ve a la pestaña de configuración
- Busca información del repositorio Git

### Paso 4: Busca el Commit 73c3be
1. En la misma página del backend, busca una sección de **"Builds"** o **"Deploys"**
2. Busca el deploy del **22 de noviembre 2025, 10:59 p.m.**
3. Haz clic en ese deploy
4. Debería mostrar información del commit `73c3be`

### Paso 5: Copia la URL Completa
Una vez que encuentres la información del repositorio:
1. Copia la **URL completa** del repositorio Git
2. Debería ser algo como:
   - `https://github.com/usuario/repositorio.git`
   - `https://gitlab.com/usuario/repositorio.git`
   - `https://bitbucket.org/usuario/repositorio.git`
   - O cualquier otra URL de Git

## 📋 Información que Deberías Encontrar

Según la información del backend:
- **Backend**: `canvasmind-backend`
- **Repository**: `mpiafinlay-art-firebase-framework-tools`
- **Commit**: `73c3be`
- **Fecha**: 22/11/25, 10:59 p.m.

## ✅ Una Vez que Tengas la URL

Ejecuta el script de restauración:

```bash
cd "/Users/imacm3-pia/Downloads/canvasmind_backup (1)"

# Opción 1: El script pedirá la URL
./restore_commit_73c3be.sh

# Opción 2: Pasar la URL directamente
export REPO_URL="<URL_COMPLETA_DEL_REPOSITORIO>"
./restore_commit_73c3be.sh
```

## 🆘 Si No Encuentras la URL en Firebase Console

### Alternativa 1: Ver Builds/Deploys
1. En la página del backend, busca la pestaña **"Builds"** o **"Deploys"**
2. Busca el build del 22 de noviembre
3. Haz clic en ese build
4. Debería mostrar el commit y el repositorio

### Alternativa 2: Ver Configuración
1. En la página del backend, busca **"Settings"** o **"Configuración"**
2. Busca la sección de **"Source"** o **"Repository"**
3. Ahí debería estar la URL

### Alternativa 3: Ver Logs
1. Busca la sección de **"Logs"** o **"Activity"**
2. Los logs del deploy deberían mostrar información del repositorio

## 💡 Consejos

- La URL del repositorio **DEBE estar** en Firebase Console porque Firebase App Hosting necesita conectarse a un repositorio Git para hacer deploys automáticos
- Si no la encuentras en la página principal del backend, busca en las diferentes pestañas/secciones
- Toma una captura de pantalla de donde encuentres la información para referencia

## 📞 Siguiente Paso

Una vez que tengas la URL completa del repositorio, ejecuta el script de restauración y el commit `73c3be` será restaurado automáticamente.

