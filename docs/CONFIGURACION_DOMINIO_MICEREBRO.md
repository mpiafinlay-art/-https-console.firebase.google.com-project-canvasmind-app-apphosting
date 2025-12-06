# Configuración de Dominio Personalizado: www.micerebro.cl

**Fecha**: 2025-12-06  
**Estado**: ⏳ **PENDIENTE - Esperando compra del dominio**

---

## 📋 Proceso Completo

### Paso 1: Compra del Dominio (TÚ)
- [ ] Comprar dominio `micerebro.cl` en un registrador (GoDaddy, Namecheap, Google Domains, etc.)
- [ ] Tener acceso al panel de administración DNS del dominio

### Paso 2: Configuración en Firebase Hosting (YO)
- [ ] Agregar dominio en Firebase Console
- [ ] Obtener registros DNS necesarios
- [ ] Configurar dominio en `firebase.json` si es necesario

### Paso 3: Configuración DNS (TÚ - con mis instrucciones)
- [ ] Agregar registros A proporcionados por Firebase
- [ ] Agregar registro CNAME para www
- [ ] Agregar registro TXT para verificación
- [ ] Esperar propagación DNS (5 minutos - 48 horas)

### Paso 4: Configuración de Autenticación (YO)
- [ ] Agregar `www.micerebro.cl` a Firebase Authentication (dominios autorizados)
- [ ] Agregar `micerebro.cl` a Firebase Authentication (si se usa sin www)

### Paso 5: Configuración OAuth (YO)
- [ ] Agregar `https://www.micerebro.cl` a Google Cloud OAuth (Authorized JavaScript origins)
- [ ] Agregar `https://www.micerebro.cl/__/auth/handler` a Google Cloud OAuth (Authorized redirect URIs)

### Paso 6: Verificación Final (YO)
- [ ] Verificar que el dominio funciona
- [ ] Probar autenticación
- [ ] Probar login con Google
- [ ] Probar login como invitado

---

## 🔧 Comandos que Ejecutaré

### 1. Agregar dominio en Firebase Hosting
```bash
# Esto se hace desde Firebase Console, pero puedo guiarte
# O usar Firebase CLI si está disponible
```

### 2. Verificar configuración
```bash
firebase hosting:sites:list
```

### 3. Verificar dominio
```bash
# Verificar que el dominio está configurado
curl -I https://www.micerebro.cl
```

---

## 📝 URLs que Configuraré

### Firebase Authentication
- `www.micerebro.cl`
- `micerebro.cl` (si se usa sin www)

### Google Cloud OAuth
- **Authorized JavaScript origins**: `https://www.micerebro.cl`
- **Authorized redirect URIs**: `https://www.micerebro.cl/__/auth/handler`

---

## ⚠️ IMPORTANTE

1. **NO tocar `canvasmind-app.web.app`** - Este sitio debe permanecer intacto
2. **El dominio funcionará con App Hosting** - Ya tenemos `apphosting` configurado en `firebase.json`
3. **Propagación DNS** - Puede tardar hasta 48 horas, pero generalmente es más rápido
4. **SSL automático** - Firebase proporciona certificado SSL automáticamente

---

## 📞 Cuando Tengas el Dominio

**Dime:**
1. ¿Qué registrador usaste? (GoDaddy, Namecheap, etc.)
2. ¿Tienes acceso al panel DNS?
3. ¿Prefieres `www.micerebro.cl` o `micerebro.cl` (sin www)?

**Entonces yo:**
1. Te guiaré para agregar el dominio en Firebase Console
2. Te daré los registros DNS exactos que debes agregar
3. Configuraré todo lo demás automáticamente

---

## ✅ Checklist Final

Cuando todo esté configurado, verificaremos:
- [ ] `https://www.micerebro.cl` carga correctamente
- [ ] `https://micerebro.cl` redirige a www (si se configura)
- [ ] Login con Google funciona
- [ ] Login como invitado funciona
- [ ] Redirección a tableros funciona
- [ ] No hay errores en consola

