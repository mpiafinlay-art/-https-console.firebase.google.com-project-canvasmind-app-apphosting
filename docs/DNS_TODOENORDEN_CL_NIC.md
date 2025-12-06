# Configuración DNS para todoenorden.cl en nic.cl

**Fecha**: 2025-12-06  
**Dominio**: todoenorden.cl  
**Backend**: canvasmind-backend  
**Proyecto**: canvasmind-app

---

## 🔧 Valores DNS para nic.cl

### Opción 1: Nameservers (Recomendado)

Si nic.cl te permite configurar **nameservers** (servidores de nombres), usa estos:

#### Servidor 1:
```
ns-cloud-d1.googledomains.com
```

#### Servidor 2:
```
ns-cloud-d2.googledomains.com
```

#### Servidor 3:
```
ns-cloud-d3.googledomains.com
```

#### Servidor 4:
```
ns-cloud-d4.googledomains.com
```

**Direcciones IP (si las pide):**
- ns-cloud-d1: `216.239.32.10`
- ns-cloud-d2: `216.239.34.10`
- ns-cloud-d3: `216.239.36.10`
- ns-cloud-d4: `216.239.38.10`

---

### Opción 2: Registros DNS Directos

Si nic.cl requiere registros DNS directos (A, CNAME, TXT), usa estos valores:

#### Registro 1: TXT (Verificación)
```
Tipo: TXT
Nombre: @ (o todoenorden.cl)
Valor: firebase-verification=canvasmind-app
TTL: 3600
```

#### Registro 2: A (Dominio raíz)
```
Tipo: A
Nombre: @ (o todoenorden.cl)
Valor: 199.36.158.100
TTL: 3600
```

#### Registro 3: CNAME (www)
```
Tipo: CNAME
Nombre: www
Valor: todoenorden.cl
TTL: 3600
```

---

## 📋 Pasos en nic.cl

1. **Accede a tu cuenta en nic.cl:**
   - Ve a: https://www.nic.cl
   - Ingresa con tu correo y contraseña

2. **Selecciona el dominio `todoenorden.cl`**

3. **Ve a "Configuración Técnica" → "Servidores DNS"**

4. **Configura los nameservers:**
   - Haz clic en "Agregar Servidor de Nombre"
   - Ingresa cada nameserver **SIN el punto final (.)**
   - Si te pide IP, usa los valores de arriba o déjalas en blanco

5. **Guarda los cambios:**
   - Haz clic en "Actualizar datos de dominio"

---

## ⚠️ IMPORTANTE

**Después de configurar los DNS en nic.cl:**

1. **Agrega el dominio en Firebase App Hosting** (consola web):
   - Ve a: https://console.firebase.google.com/project/canvasmind-app/apphosting
   - Selecciona `canvasmind-backend`
   - Busca "Custom domains" o "Dominios personalizados"
   - Agrega `todoenorden.cl`

2. **Configura en Firebase Authentication:**
   - Ve a: https://console.firebase.google.com/project/canvasmind-app/authentication/settings
   - Pestaña "Authorized domains"
   - Agrega: `todoenorden.cl`

3. **Configura en Google Cloud OAuth:**
   - Ve a: https://console.cloud.google.com/apis/credentials?project=canvasmind-app
   - Edita el "OAuth 2.0 Client ID"
   - Agrega en "Authorized JavaScript origins":
     - `https://todoenorden.cl`
     - `https://www.todoenorden.cl`
   - Agrega en "Authorized redirect URIs":
     - `https://todoenorden.cl/__/auth/handler`
     - `https://www.todoenorden.cl/__/auth/handler`

---

## ⏱️ Tiempo de Propagación

Los cambios DNS pueden tardar **24-48 horas** en propagarse completamente.

---

## ✅ Verificación

Después de 24-48 horas, verifica con:

```bash
dig todoenorden.cl NS
dig todoenorden.cl A
```

Deberías ver los nameservers de Google Cloud y la IP correcta.

---

## 🆘 Si hay problemas

1. Verifica que los nameservers estén correctos en nic.cl
2. Espera 24-48 horas para la propagación
3. Verifica que el dominio esté agregado en Firebase App Hosting
4. Verifica que el dominio esté en Firebase Authentication
5. Verifica que el dominio esté en Google Cloud OAuth

