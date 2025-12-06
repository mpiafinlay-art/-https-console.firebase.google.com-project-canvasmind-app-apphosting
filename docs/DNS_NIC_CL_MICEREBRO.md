# Registros DNS para micerebro.cl en nic.cl

**Fecha**: 2025-12-06  
**Dominio**: micerebro.cl  
**Registrador**: nic.cl (Chile)

---

## 📋 3 Registros DNS para nic.cl

En nic.cl, los registros DNS se configuran con el formato `nsn.dominio.cl` o directamente con el nombre del registro.

### Registro 1: TXT (Verificación)
```
Tipo: TXT
Nombre: @ (o micerebro.cl)
Valor: firebase-verification=canvasmind-app
TTL: 3600
```

### Registro 2: A (Dominio raíz)
```
Tipo: A
Nombre: @ (o micerebro.cl)
Valor: 199.36.158.100
TTL: 3600
```

### Registro 3: CNAME (www)
```
Tipo: CNAME
Nombre: www
Valor: micerebro.cl
TTL: 3600
```

---

## 🔧 Formato Específico para nic.cl

En nic.cl, cuando te piden los registros DNS, generalmente usan este formato:

### Opción 1: Si te piden "Nombre del servidor" o "Host"
- **Registro 1 (TXT)**: 
  - Nombre: `@` o `micerebro.cl`
  - Tipo: `TXT`
  - Valor: `firebase-verification=canvasmind-app`

- **Registro 2 (A)**:
  - Nombre: `@` o `micerebro.cl`
  - Tipo: `A`
  - Valor: `199.36.158.100`

- **Registro 3 (CNAME)**:
  - Nombre: `www`
  - Tipo: `CNAME`
  - Valor: `micerebro.cl`

### Opción 2: Si te piden formato "nsn.dominio.cl"
Si nic.cl requiere el formato `ns1.micerebro.cl`, `ns2.micerebro.cl`, etc., esos son para los **servidores de nombres (nameservers)**, no para los registros DNS del contenido.

Para Firebase App Hosting, necesitas los **registros de contenido** (A, CNAME, TXT), no los nameservers.

---

## ⚠️ IMPORTANTE

**Estos son valores temporales** para completar la compra. Después de comprar:

1. Agrega el dominio en Firebase App Hosting
2. Firebase te dará los valores exactos
3. Actualiza los registros DNS con los valores exactos de Firebase

---

## 📝 Notas sobre nic.cl

- En nic.cl, `@` representa el dominio raíz (micerebro.cl)
- Si no acepta `@`, usa `micerebro.cl` directamente
- El TTL puede ser 3600 o el predeterminado que te ofrezca

---

## 🔄 Después de Comprar

Una vez que tengas el dominio:
1. Te guío para agregarlo en Firebase App Hosting
2. Firebase te dará los valores exactos de los registros DNS
3. Actualizamos los registros en nic.cl con los valores exactos

