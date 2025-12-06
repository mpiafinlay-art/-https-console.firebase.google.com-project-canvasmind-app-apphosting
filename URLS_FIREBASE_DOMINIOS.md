# URLs para Agregar a Dominios en Firebase

## 📋 LISTADO DE URLs PARA FIREBASE HOSTING

### URLs Actuales Configuradas en Firebase:

1. **app-micerebro.web.app**
   - Site ID: `app-micerebro`
   - Target en este proyecto: `app-micerebro`
   - Estado: ✅ Funcionando correctamente
   - **Este es el sitio que estamos deployando**

2. **canvasmind-app.web.app**
   - Site ID: `canvasmind-app`
   - App ID: `1:917199598510:web:1bf94fce9eeae938804e3f`
   - Estado: ⚠️ Sitio existente con permisos propios
   - **PROHIBIDO TOCAR** - Tiene su propia configuración y permisos
   - **NO está configurado en este proyecto** - Es un sitio independiente

3. **tablero-app-canvasmind.web.app**
   - Site ID: `tablero-app-canvasmind`
   - Estado: Sitio adicional
   - **NO está configurado en este proyecto**

### URLs Adicionales Automáticas:

4. **app-micerebro.firebaseapp.com**
   - URL alternativa de Firebase
   - Se crea automáticamente con el mismo contenido que `app-micerebro.web.app`
   - No requiere configuración adicional

5. **www.app-micerebro.web.app** (si se configura dominio personalizado)
   - Requiere configuración de DNS adicional
   - Opcional

---

## 🔒 CONFIGURACIÓN ACTUAL DE FIREBASE

### Archivo `.firebaserc`:
```json
{
  "projects": {
    "default": "canvasmind-app"
  },
  "targets": {
    "canvasmind-app": {
      "hosting": {
        "app-micerebro": [
          "app-micerebro"
        ]
      }
    }
  }
}
```

### Archivo `firebase.json`:
```json
{
  "hosting": [
    {
      "target": "app-micerebro",
      "public": "out",
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  ]
}
```

---

## ⚠️ IMPORTANTE

- **NO modificar** la configuración de `canvasmind-app.web.app`
- **Solo deployar** a `app-micerebro.web.app`
- El deploy actual **NO afecta** a `canvasmind-app.web.app` porque están en targets diferentes

---

## 📝 CÓMO ENCONTRAR `app-micerebro` EN FIREBASE CONSOLE

### ⚠️ IMPORTANTE: `app-micerebro` NO es un proyecto, es un **SITIO DE HOSTING**

**Proyecto actual:** `canvasmind-app` (Project ID: canvasmind-app)

### Pasos para encontrar `app-micerebro`:

1. **Ir al proyecto `canvasmind-app`:**
   - Ve a: https://console.firebase.google.com/project/canvasmind-app
   - O busca el proyecto "canvasmind-app" en tu lista de proyectos

2. **Ir a la sección Hosting:**
   - En el menú lateral izquierdo, haz clic en **"Hosting"** (o ve directamente a: https://console.firebase.google.com/project/canvasmind-app/hosting)

3. **Verás 3 sitios de hosting:**
   - ✅ **app-micerebro** ← Este es el que estamos usando
   - ⚠️ canvasmind-app (NO TOCAR)
   - ⚠️ tablero-app-canvasmind

4. **Seleccionar el sitio `app-micerebro`:**
   - Haz clic en el sitio `app-micerebro`
   - O ve directamente a: https://console.firebase.google.com/project/canvasmind-app/hosting/sites/app-micerebro

5. **Para agregar dominios personalizados:**
   - Ve a la pestaña **"Dominios"** dentro del sitio `app-micerebro`
   - Haz clic en **"Agregar dominio personalizado"**
   - Sigue las instrucciones de verificación DNS

---

## ✅ VERIFICACIÓN

- ✅ `app-micerebro.web.app` - Funcionando correctamente
- ✅ `app-micerebro.firebaseapp.com` - Disponible automáticamente
- ⚠️ `canvasmind-app.web.app` - NO TOCAR (sitio independiente)
