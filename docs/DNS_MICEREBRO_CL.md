# Registros DNS para micerebro.cl

**Fecha**: 2025-12-06  
**Dominio**: micerebro.cl

---

## 📋 Registros DNS Necesarios (3 registros)

**NOTA:** Estos son registros típicos. Firebase te dará los valores exactos cuando agregues el dominio en App Hosting.

### Registro 1: TXT (Verificación)
```
Tipo: TXT
Nombre/Host: @
Valor: [Firebase te dará este valor cuando agregues el dominio]
TTL: 3600 (o el predeterminado)
```

### Registro 2: A (Dominio raíz)
```
Tipo: A
Nombre/Host: @
Valor: 199.36.158.100
TTL: 3600
```

### Registro 3: CNAME (www)
```
Tipo: CNAME
Nombre/Host: www
Valor: micerebro.cl
TTL: 3600
```

---

## ⚠️ IMPORTANTE

**Para obtener los valores exactos:**

1. Primero agrega el dominio en Firebase App Hosting:
   - Ve a: https://console.firebase.google.com/project/canvasmind-app/apphosting
   - Haz clic en `canvasmind-backend`
   - Busca "Custom Domains" → "Add domain"
   - Ingresa `micerebro.cl`
   - Firebase te dará los valores exactos

2. Luego configura esos valores en tu proveedor de dominio

---

## 🔄 Alternativa: Valores Temporales

Si necesitas los registros AHORA para completar la compra, puedes usar estos valores temporales (luego los actualizarás cuando Firebase te dé los exactos):

### Registro 1: TXT
```
Tipo: TXT
Nombre: @
Valor: firebase-verification=canvasmind-app
TTL: 3600
```

### Registro 2: A
```
Tipo: A
Nombre: @
Valor: 199.36.158.100
TTL: 3600
```

### Registro 3: CNAME
```
Tipo: CNAME
Nombre: www
Valor: micerebro.cl
TTL: 3600
```

**Después de comprar el dominio, agrega el dominio en Firebase App Hosting y actualiza los valores con los que Firebase te proporcione.**

