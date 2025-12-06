# 🚀 Guía Paso a Paso: Configurar Cloud Build Connection desde Firebase

## 📋 Paso 1: Ir a App Hosting

1. Abre: https://console.firebase.google.com/project/canvasmind-app/apphosting
2. Deberías ver tu backend (el que acabas de crear con el error rojo)

---

## 📋 Paso 2: Eliminar el Backend con Error (Opcional pero Recomendado)

**Si quieres empezar limpio:**

1. Haz clic en el **nombre del backend** (el que tiene el error rojo)
2. Busca el botón **"Delete"** o **"Eliminar"** (generalmente arriba a la derecha)
3. Confirma la eliminación
4. **Espera** a que se elimine completamente

**O si prefieres editarlo:**
- Haz clic en el nombre del backend
- Busca el botón **"Edit"** o **"Configurar"**

---

## 📋 Paso 3: Crear Nuevo Backend (o Editar el Existente)

### Opción A: Crear Nuevo Backend

1. En la página de App Hosting, haz clic en **"Create Backend"** o **"Crear Backend"**
2. Se abrirá un formulario paso a paso

### Opción B: Editar Backend Existente

1. Haz clic en el nombre del backend
2. Haz clic en **"Edit"** o **"Configurar"** (arriba a la derecha)

---

## 📋 Paso 4: Configurar Región (Paso 1 del Formulario)

1. **"Elige una región principal"**
   - Selecciona: **`us-central1 (Iowa)`**
   - Haz clic en **"Siguiente"**

---

## 📋 Paso 5: Importar Repositorio de GitHub (Paso 2 - CRÍTICO)

Este es el paso más importante. Aquí es donde se crea la conexión de Cloud Build.

1. **"Importa un repositorio de GitHub"**
   - Haz clic en el botón **"Import a GitHub repository"** o **"Importar un repositorio de GitHub"**

2. **Si aparece un mensaje sobre "Cloud Build Connection":**
   - Haz clic en **"Create Connection"** o **"Crear Conexión"**
   - O busca un enlace que diga **"Set up connection"** o **"Configurar conexión"**

3. **Autorizar GitHub:**
   - Se abrirá una ventana para autorizar Google Cloud
   - Haz clic en **"Authorize"** o **"Autorizar"**
   - Inicia sesión con tu cuenta de GitHub si es necesario
   - Autoriza los permisos

4. **Instalar la App de GitHub:**
   - Selecciona tu cuenta/organización: **`mpiafinlay-art`**
   - Selecciona el repositorio: **`-https-console.firebase.google.com-project-canvasmind-app-apphosting`**
   - O selecciona **"All repositories"** si prefieres
   - Haz clic en **"Install"** o **"Instalar"**

5. **Completar la Conexión:**
   - Nombre de la conexión: `github-connection` (o déjalo por defecto)
   - Región: **`us-central1`** (debe coincidir con tu backend)
   - Haz clic en **"Create"** o **"Crear"**
   - **Espera** a que se cree (puede tardar 1-2 minutos)

6. **Seleccionar el Repositorio:**
   - Una vez creada la conexión, deberías ver una lista de repositorios
   - Selecciona: **`-https-console.firebase.google.com-project-canvasmind-app-apphosting`**
   - Haz clic en **"Siguiente"** o **"Next"**

---

## 📋 Paso 6: Configurar Implementación (Paso 3)

1. **"Rama activa (para implementaciones de producción)"**
   - Selecciona: **`main`**

2. **"Directorio raíz de la app"**
   - Debe ser: **`/`** (raíz)

3. **"Lanzamientos automáticos activados"**
   - Déjalo **activado** (azul)

4. Haz clic en **"Siguiente"**

---

## 📋 Paso 7: Configurar Backend (Paso 4)

1. **"Crea un ID para tu backend"**
   - Escribe: **`app-micerebro-backend`**
   - O el nombre que prefieras (solo letras minúsculas, números y guiones)

2. Haz clic en **"Siguiente"**

---

## 📋 Paso 8: Asociar App Web (Paso 5)

1. **"Asocia una app web de Firebase"**
   - Selecciona: **"Seleccionar una app web de Firebase existente"**
   - En el dropdown, selecciona: **`canvasmind-app`** (o la que aparezca)

2. Haz clic en **"Finalizar e implementar"** o **"Finish and deploy"**

---

## 📋 Paso 9: Esperar el Deploy

1. **Firebase comenzará a desplegar automáticamente**
2. Verás un mensaje como: **"Deploying..."** o **"Desplegando..."**
3. Esto puede tardar **5-10 minutos** la primera vez
4. **NO cierres la página**, déjala abierta

---

## ✅ Paso 10: Verificar que Funciona

1. **Espera a que el deploy termine**
2. Deberías ver un mensaje verde: **"Deployed successfully"** o **"Desplegado exitosamente"**
3. **El cartel rojo debería desaparecer**
4. Verás la URL del backend: `app-micerebro-backend--canvasmind-app.us-central1.hosted.app`

---

## 🆘 Si Algo Sale Mal

### Error: "Connection already exists"
- **Solución**: La conexión ya existe, solo selecciónala en el paso 5

### Error: "Repository not found"
- **Solución**: Verifica que el repositorio existe en GitHub y que lo seleccionaste correctamente

### Error: "Region mismatch"
- **Solución**: Asegúrate de que la conexión y el backend estén en `us-central1`

### El deploy sigue fallando
- **Solución**: 
  1. Ve a la pestaña **"Logs"** o **"Builds"** del backend
  2. Revisa los logs del error
  3. Comparte el error específico para ayudarte

---

## 📝 Notas Importantes

- ⏱️ **El primer deploy puede tardar 10-15 minutos**
- 🔄 **Los siguientes deploys serán más rápidos** (2-5 minutos)
- 📧 **Recibirás un email** cuando el deploy termine (si tienes notificaciones activadas)
- 🔗 **La URL del backend** aparecerá cuando el deploy termine

---

## 🎯 Siguiente Paso Después del Deploy

Una vez que el deploy termine exitosamente:

1. **Asociar el dominio**: `app-micerebro.web.app`
2. **Probar la app**: Visita la URL del backend
3. **Configurar dominio personalizado** (opcional): `micerebro.cl` o `todoenorden.cl`

