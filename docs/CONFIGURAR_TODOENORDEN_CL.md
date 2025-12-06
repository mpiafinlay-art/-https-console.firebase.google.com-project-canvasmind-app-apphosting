# Configuración Completa: todoenorden.cl

**Fecha**: 2025-12-06  
**Dominio**: todoenorden.cl  
**Backend**: canvasmind-backend  
**Proyecto**: canvasmind-app

---

## 📋 Pasos para Configurar todoenorden.cl

### Paso 1: Agregar Dominio en Firebase App Hosting (Consola Web)

1. **Abre la consola de Firebase:**
   - Ve a: https://console.firebase.google.com/project/canvasmind-app/apphosting
   - O navega: Firebase Console → App Hosting → canvasmind-backend

2. **Agrega el dominio personalizado:**
   - Busca la sección "Custom domains" o "Dominios personalizados"
   - Haz clic en "Add custom domain" o "Agregar dominio personalizado"
   - Ingresa: `todoenorden.cl`
   - Firebase te dará los registros DNS exactos

3. **Anota los registros DNS que Firebase te proporcione:**
   - Registro TXT (verificación)
   - Registros A (direcciones IP)
   - O nameservers (si Firebase los proporciona)

---

### Paso 2: Configurar DNS en nic.cl

Una vez que tengas los registros DNS de Firebase, configúralos en nic.cl:

#### Opción A: Si Firebase te da nameservers
Configura estos nameservers en nic.cl (en la sección "Servidores DNS"):

```
ns-cloud-d1.googledomains.com
ns-cloud-d2.googledomains.com
ns-cloud-d3.googledomains.com
ns-cloud-d4.googledomains.com
```

#### Opción B: Si Firebase te da registros DNS directos
Configura estos registros en nic.cl (en la sección "Zona DNS" o "Registros DNS"):

**Registro 1: TXT (Verificación)**
```
Tipo: TXT
Nombre: @ (o todoenorden.cl)
Valor: [El valor que Firebase te dé]
TTL: 3600
```

**Registro 2: A (Dominio raíz)**
```
Tipo: A
Nombre: @ (o todoenorden.cl)
Valor: [La IP que Firebase te dé]
TTL: 3600
```

**Registro 3: CNAME (www)**
```
Tipo: CNAME
Nombre: www
Valor: todoenorden.cl
TTL: 3600
```

---

### Paso 3: Configurar en Firebase Authentication

1. **Abre Firebase Authentication:**
   - Ve a: https://console.firebase.google.com/project/canvasmind-app/authentication/settings

2. **Agrega el dominio autorizado:**
   - Ve a la pestaña "Authorized domains" o "Dominios autorizados"
   - Haz clic en "Add domain" o "Agregar dominio"
   - Ingresa: `todoenorden.cl`
   - Haz clic en "Add" o "Agregar"

---

### Paso 4: Configurar en Google Cloud OAuth

1. **Abre Google Cloud Console:**
   - Ve a: https://console.cloud.google.com/apis/credentials?project=canvasmind-app

2. **Edita las credenciales OAuth:**
   - Busca "OAuth 2.0 Client IDs"
   - Haz clic en el cliente OAuth (probablemente "Web client")
   - En "Authorized JavaScript origins", agrega:
     - `https://todoenorden.cl`
     - `https://www.todoenorden.cl`
   - En "Authorized redirect URIs", agrega:
     - `https://todoenorden.cl/__/auth/handler`
     - `https://www.todoenorden.cl/__/auth/handler`
   - Guarda los cambios

---

### Paso 5: Verificar Configuración

1. **Espera la propagación DNS (24-48 horas)**

2. **Verifica los DNS:**
   ```bash
   dig todoenorden.cl NS
   dig todoenorden.cl A
   dig todoenorden.cl TXT
   ```

3. **Verifica en Firebase:**
   - Ve a App Hosting → canvasmind-backend → Custom domains
   - El dominio debería mostrar estado "Active" o "Activo"

---

## 🔧 Comandos Útiles

### Verificar backend actual:
```bash
firebase apphosting:backends:get canvasmind-backend
```

### Verificar proyecto:
```bash
firebase projects:list
```

---

## ⚠️ IMPORTANTE

1. **Los cambios DNS pueden tardar 24-48 horas en propagarse**
2. **Firebase debe verificar el dominio antes de activarlo**
3. **Asegúrate de configurar tanto `todoenorden.cl` como `www.todoenorden.cl`**

---

## 📝 Notas

- El dominio `todoenorden.cl` apuntará a la misma aplicación que `app-micerebro.web.app`
- Los usuarios podrán acceder desde ambos dominios
- La autenticación funcionará en ambos dominios una vez configurados

---

## 🆘 Si hay problemas

1. **Verifica que el dominio esté agregado en Firebase App Hosting**
2. **Verifica que los DNS estén correctos en nic.cl**
3. **Verifica que el dominio esté en Firebase Authentication**
4. **Verifica que el dominio esté en Google Cloud OAuth**
5. **Espera 24-48 horas para la propagación DNS**

