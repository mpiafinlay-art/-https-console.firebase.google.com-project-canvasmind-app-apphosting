# Configuración Completa: micerebro.cl

**Fecha**: 2025-12-06  
**Dominio**: micerebro.cl  
**Problema identificado**: `app-micerebro.web.app` muestra 403 Forbidden porque Firebase Hosting estático no soporta rutas dinámicas

---

## 🎯 Solución: Configurar micerebro.cl en App Hosting

**App Hosting SÍ soporta rutas dinámicas**, por eso es la solución correcta.

---

## 📋 Paso 1: Agregar Dominio en Firebase App Hosting

### Desde Firebase Console:

1. **Ve a App Hosting:**
   - URL: https://console.firebase.google.com/project/canvasmind-app/apphosting
   - O: Firebase Console → App Hosting → `canvasmind-backend`

2. **Agregar dominio personalizado:**
   - Busca la sección "Custom Domains" o "Dominios personalizados"
   - Haz clic en "Add domain" o "Agregar dominio"
   - Ingresa: `micerebro.cl`
   - Haz clic en "Continue" o "Continuar"

3. **Firebase te proporcionará:**
   - Un registro TXT para verificación
   - Registros A o CNAME para configurar

---

## 📋 Paso 2: Configurar DNS en tu Proveedor

**IMPORTANTE:** Firebase te dará los valores exactos. Estos son ejemplos típicos:

### Registro TXT (para verificación):
```
Tipo: TXT
Nombre/Host: @
Valor: [Valor que Firebase te proporciona]
TTL: 3600 (o el predeterminado)
```

### Registros A (para el dominio raíz):
```
Tipo: A
Nombre/Host: @
Valor: 199.36.158.100
TTL: 3600
```

### Registro CNAME (para www):
```
Tipo: CNAME
Nombre/Host: www
Valor: micerebro.cl (o el valor que Firebase te dé)
TTL: 3600
```

**¿Qué proveedor de dominio usaste?** (GoDaddy, Namecheap, Google Domains, etc.)
Te puedo dar instrucciones específicas según tu proveedor.

---

## 📋 Paso 3: Configurar en Firebase Authentication

1. Ve a: https://console.firebase.google.com/project/canvasmind-app/authentication/settings
2. En "Authorized domains", haz clic en "Add domain"
3. Agrega:
   - `micerebro.cl`
   - `www.micerebro.cl`
4. Haz clic en "Add"

---

## 📋 Paso 4: Configurar en Google Cloud OAuth

1. Ve a: https://console.cloud.google.com/apis/credentials?project=canvasmind-app
2. Busca el cliente OAuth 2.0 (Client ID: `917199598510-14h0c930cobfvnig8kdfj5i42untd7rg`)
3. Haz clic para editarlo

### Authorized JavaScript origins:
Agrega:
- `https://micerebro.cl`
- `https://www.micerebro.cl`

### Authorized redirect URIs:
Agrega:
- `https://micerebro.cl/__/auth/handler`
- `https://www.micerebro.cl/__/auth/handler`

4. **GUARDAR** (botón al final de la página)

---

## ⏳ Paso 5: Esperar Propagación

- Propagación DNS: 5 minutos - 48 horas (generalmente 15-30 minutos)
- Verificación Firebase: 5-30 minutos después de agregar registros DNS

---

## ✅ Paso 6: Verificación Final

Una vez configurado:
- `https://micerebro.cl` → Debe cargar la aplicación
- `https://www.micerebro.cl` → Debe funcionar también
- Login como invitado → Debe redirigir a tablero sin error 403
- Los tableros → Deben cargar correctamente

---

## 🔧 Problema Actual con app-micerebro.web.app

**Error 403 Forbidden:**
- `app-micerebro.web.app` usa Firebase Hosting estático
- Firebase Hosting estático NO puede servir rutas dinámicas `/board/[boardId]`
- Por eso muestra "403 Forbidden" cuando intenta acceder a un tablero

**Solución:**
- `micerebro.cl` configurado en App Hosting SÍ funcionará
- App Hosting soporta rutas dinámicas y SSR

---

## 📝 Próximos Pasos

1. **Dime qué proveedor de dominio usaste** → Te doy instrucciones específicas para DNS
2. **Agrega el dominio en Firebase App Hosting** → Te guío paso a paso
3. **Configuro todo lo demás** → Authentication y OAuth

