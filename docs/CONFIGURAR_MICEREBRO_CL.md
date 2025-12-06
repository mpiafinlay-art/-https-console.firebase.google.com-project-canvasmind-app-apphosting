# Configuración de Dominio micerebro.cl

**Fecha**: 2025-12-06  
**Estado**: ⏳ **EN PROGRESO**

---

## 🎯 Objetivo

Configurar el dominio `micerebro.cl` para que apunte a la aplicación en Firebase App Hosting.

---

## 📋 Paso 1: Agregar Dominio en Firebase App Hosting

### Opción A: Desde Firebase Console (Recomendado)

1. Ve a: https://console.firebase.google.com/project/canvasmind-app/apphosting
2. Haz clic en el backend `canvasmind-backend`
3. Busca la sección "Custom Domains" o "Dominios personalizados"
4. Haz clic en "Add domain" o "Agregar dominio"
5. Ingresa: `micerebro.cl` y `www.micerebro.cl`
6. Firebase te proporcionará los registros DNS necesarios

### Opción B: Desde Firebase CLI

```bash
# Verificar backends disponibles
firebase apphosting:backends:list

# Agregar dominio (si el comando está disponible)
firebase apphosting:domains:add micerebro.cl --backend canvasmind-backend
```

---

## 📋 Paso 2: Configurar Registros DNS

Una vez que Firebase te proporcione los registros DNS, agrega estos en tu proveedor de dominio:

### Registros Necesarios (Ejemplo - Firebase te dará los valores exactos)

#### Para el dominio raíz (micerebro.cl):
```
Tipo: A
Nombre: @
Valor: 199.36.158.100
TTL: 3600
```

#### Para www (www.micerebro.cl):
```
Tipo: CNAME
Nombre: www
Valor: micerebro.cl (o el valor que Firebase te proporcione)
TTL: 3600
```

#### Para verificación (si Firebase lo requiere):
```
Tipo: TXT
Nombre: @
Valor: [Valor proporcionado por Firebase]
TTL: 3600
```

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
3. Haz clic en el nombre del cliente para editarlo

### A. Authorized JavaScript origins
Haz clic en "+ AGREGAR URI" y agrega:
- `https://micerebro.cl`
- `https://www.micerebro.cl`

### B. Authorized redirect URIs
Haz clic en "+ AGREGAR URI" y agrega:
- `https://micerebro.cl/__/auth/handler`
- `https://www.micerebro.cl/__/auth/handler`

4. Haz clic en "GUARDAR" (botón al final de la página)

---

## ⏳ Paso 5: Esperar Propagación DNS

- La propagación DNS puede tardar desde 5 minutos hasta 48 horas
- Generalmente es más rápida (15-30 minutos)
- Puedes verificar el estado en Firebase Console

---

## ✅ Paso 6: Verificación

Una vez que los DNS se propaguen:

1. Verifica que `https://micerebro.cl` carga correctamente
2. Verifica que `https://www.micerebro.cl` redirige o carga correctamente
3. Prueba login con Google
4. Prueba login como invitado
5. Verifica que los tableros cargan correctamente

---

## 🔧 Troubleshooting

### Si el dominio no carga:
- Verifica que los registros DNS están correctos
- Espera más tiempo para la propagación
- Verifica en Firebase Console el estado del dominio

### Si la autenticación no funciona:
- Verifica que los dominios están en Firebase Authentication
- Verifica que las URIs están en Google Cloud OAuth
- Espera 1-2 minutos después de guardar cambios

---

## 📝 Notas

- Firebase proporcionará automáticamente un certificado SSL
- El dominio funcionará con HTTPS automáticamente
- No necesitas configurar nada adicional para SSL

