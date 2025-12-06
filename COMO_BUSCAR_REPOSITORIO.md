# 🔍 Cómo Buscar el Repositorio Git - Guía Rápida

## ✅ Información que Ya Tenemos

- **Nombre del Repositorio**: `mpiafinlay-art-firebase-framework-tools`
- **Usuario**: mpiafinlay@gmail.com
- **Commit que buscamos**: `73c3be` (22 Nov 2025)

## 🎯 Método Más Fácil: Firebase Console

### Paso 1: Abre Firebase Console
Ve directamente a:
```
https://console.firebase.google.com/project/canvasmind-app/apphosting
```

### Paso 2: Haz clic en el Backend
Haz clic en: **`canvasmind-backend`**

### Paso 3: Busca la Sección "Repository"
En la página del backend, busca una sección que diga:
- **"Repository"** o **"Repositorio"**
- **"Source"** o **"Fuente"**
- **"Git Repository"**

Ahí verás la URL completa del repositorio Git.

## 🔍 Método Alternativo: Buscar en GitHub

### Opción 1: Buscar por Usuario
1. Ve a: https://github.com/mpiafinlay-art-firebase-framework-tools
2. Busca repositorios con nombres como:
   - `canvasmind-app`
   - `firebase-framework-tools`
   - `canvasmind-backend`

### Opción 2: Buscar el Commit Directamente
1. Ve a: https://github.com/search
2. Busca: `73c3be`
3. Filtra por fecha: 22 de noviembre 2025
4. Esto te mostrará el repositorio donde está el commit

### Opción 3: Revisar tus Repositorios
1. Ve a: https://github.com/settings/repositories
2. Busca repositorios relacionados con "canvasmind" o "firebase-framework-tools"

## 📋 URLs Probables (para probar)

Basándome en el nombre del repositorio, prueba estas URLs:

```bash
# Opción 1: Repositorio principal
https://github.com/mpiafinlay-art-firebase-framework-tools.git

# Opción 2: Con subdirectorio
https://github.com/mpiafinlay-art-firebase-framework-tools/canvasmind-app.git

# Opción 3: Organización
https://github.com/mpiafinlay-art-firebase-framework-tools/firebase-framework-tools.git
```

## ✅ Verificar si la URL es Correcta

Una vez que tengas una URL candidata, verifica:

```bash
# Verificar que el repositorio existe y tiene el commit
git ls-remote <URL> | grep 73c3be

# Si encuentras el commit, la URL es correcta
```

## 🚀 Una Vez que Tengas la URL

Ejecuta el script de restauración:

```bash
cd "/Users/imacm3-pia/Downloads/canvasmind_backup (1)"

# Opción 1: El script pedirá la URL
./restore_commit_73c3be.sh

# Opción 2: Pasar la URL como variable de entorno
export REPO_URL="https://github.com/usuario/repositorio.git"
./restore_commit_73c3be.sh
```

## 🆘 Si No Encuentras el Repositorio

1. **Revisa tu email** del 22 de noviembre - podría haber notificaciones de GitHub/GitLab
2. **Revisa Firebase Console** - la URL completa debería estar ahí
3. **Contacta a Firebase Support** si el repositorio está privado y no tienes acceso

## 💡 Consejo Rápido

La forma más rápida es:
1. Abre: https://console.firebase.google.com/project/canvasmind-app/apphosting
2. Haz clic en `canvasmind-backend`
3. Busca "Repository" o "Repositorio"
4. Copia la URL completa
5. Úsala en el script de restauración

