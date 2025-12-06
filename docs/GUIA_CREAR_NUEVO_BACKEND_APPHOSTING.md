# Guía: Crear Nuevo Backend de App Hosting

## Objetivo
Crear un nuevo backend de App Hosting para reemplazar el backend actual que está mal configurado.

---

## Paso 1: Acceder a App Hosting

1. Ve a: https://console.firebase.google.com/project/canvasmind-app/apphosting
2. Deberías ver la lista de backends existentes

---

## Paso 2: Crear Nuevo Backend

1. Haz clic en el botón **"Crear backend"** (azul, en la parte superior derecha)

---

## Paso 3: Configurar el Backend

### 3.1 Nombre del Backend
- **Nombre sugerido:** `app-micerebro-backend`
- Ingresa el nombre en el campo correspondiente

### 3.2 Conectar Repositorio
- Selecciona el repositorio: `mpiafinlay-art-firebase-framework-tools`
- O conecta un nuevo repositorio si es necesario

### 3.3 Configurar Build
- **Framework:** Next.js
- **Build command:** `npm run build`
- **Output directory:** `.next` o `out` (según tu configuración)

### 3.4 Región
- Selecciona: **us-central1** (o la región más cercana)

---

## Paso 4: Configurar Dominio

1. Una vez creado el backend, ve a la sección **"Custom domains"** o **"Dominios personalizados"**
2. Haz clic en **"Add custom domain"** o **"Agregar dominio personalizado"**
3. Ingresa: `app-micerebro.web.app`
4. Sigue las instrucciones para verificar el dominio

---

## Paso 5: Desplegar

1. El backend se desplegará automáticamente desde el repositorio
2. O puedes desplegar manualmente desde la consola

---

## Paso 6: Actualizar firebase.json

Una vez creado el nuevo backend, actualiza `firebase.json`:

```json
{
  "apphosting": {
    "backends": [
      {
        "backend": "app-micerebro-backend",
        "region": "us-central1"
      }
    ]
  }
}
```

---

## Notas Importantes

- **Eliminar el backend antiguo:** Una vez que el nuevo backend funcione, puedes eliminar `canvasmind-backend` desde la consola
- **El dominio `app-micerebro.web.app`** se puede configurar en el nuevo backend
- **App Hosting soporta rutas dinámicas** - A diferencia de Hosting estático

---

## Si Tienes Problemas

1. **Verifica que el repositorio esté conectado correctamente**
2. **Revisa los logs del build** en la consola
3. **Asegúrate de que el build command sea correcto**

