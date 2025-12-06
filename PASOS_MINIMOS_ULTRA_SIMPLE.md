# 🚀 PASOS MÍNIMOS - Solo 3 Clics

## ✅ Ya eliminé el backend con error

## 📋 Ahora solo necesitas hacer ESTO (5 minutos):

### Paso 1: Crear Conexión (2 minutos)

1. **Abre esta URL:**
   ```
   https://console.cloud.google.com/cloud-build/connections?project=canvasmind-app
   ```

2. **Haz clic en "Create Connection"** (botón azul)

3. **Selecciona "GitHub"**

4. **Región: `us-central1`** (debe estar seleccionada)

5. **Haz clic en "Continue"**

6. **Haz clic en "Authorize"** (autoriza Google Cloud con GitHub)

7. **Selecciona tu repositorio:**
   - `-https-console.firebase.google.com-project-canvasmind-app-apphosting`
   - O "All repositories"

8. **Haz clic en "Install"**

9. **Nombre: `github-connection`** (o déjalo por defecto)

10. **Haz clic en "Create"**

11. **Espera 1 minuto** (aparecerá "Ready")

---

### Paso 2: Crear Backend (3 minutos)

1. **Abre esta URL:**
   ```
   https://console.firebase.google.com/project/canvasmind-app/apphosting
   ```

2. **Haz clic en "Create Backend"**

3. **Paso 1 - Región:**
   - Selecciona: **`us-central1 (Iowa)`**
   - Clic en "Siguiente"

4. **Paso 2 - Repositorio:**
   - Haz clic en **"Import a GitHub repository"**
   - **AHORA deberías ver tu conexión** (la que acabas de crear)
   - Selecciona la conexión
   - Selecciona tu repositorio
   - Clic en "Siguiente"

5. **Paso 3 - Configuración:**
   - Rama: **`main`**
   - Directorio: **`/`**
   - Lanzamientos: **Activado** (ya está)
   - Clic en "Siguiente"

6. **Paso 4 - Backend ID:**
   - Escribe: **`app-micerebro-backend`**
   - Clic en "Siguiente"

7. **Paso 5 - App Web:**
   - Selecciona: **`canvasmind-app`**
   - Clic en **"Finalizar e implementar"**

8. **¡LISTO!** Espera 10 minutos y estará desplegado.

---

## 🎯 Eso es TODO

Solo necesitas:
- ✅ Crear la conexión (Paso 1)
- ✅ Crear el backend (Paso 2)

**Total: 5 minutos, solo clics, sin código**

