# Configuración de Red - CanvasMind

**Fecha**: 4 de Diciembre 2024  
**Estado**: ✅ **VERIFICADO Y FUNCIONAL**

---

## 📊 Estado Actual de la Red

### Servidor Next.js
- **Puerto**: 3000
- **Hostname**: localhost (0.0.0.0 - escucha en todas las interfaces)
- **Protocolo**: HTTP/1.1
- **Estado**: ✅ **ACTIVO Y RESPONDIENDO**

### Configuración de Red
- **IPv4**: 127.0.0.1 (localhost)
- **IPv6**: ::1 (localhost IPv6)
- **Puerto 3000**: ✅ **ABIERTO Y ESCUCHANDO**

### Headers HTTP Configurados
- `Cross-Origin-Opener-Policy: same-origin-allow-popups`
- `Cross-Origin-Embedder-Policy: unsafe-none`
- `X-Powered-By: Next.js`

---

## 🔍 Verificación de Red

### 1. Verificar que el servidor está corriendo:
```bash
lsof -i :3000
# Debe mostrar: node ... LISTEN
```

### 2. Probar conexión HTTP:
```bash
curl http://localhost:3000
# Debe responder con código 200 OK
```

### 3. Verificar puerto:
```bash
netstat -an | grep 3000
# Debe mostrar: *.3000 LISTEN
```

---

## 🌐 URLs de Acceso

### Local (mismo dispositivo):
- **http://localhost:3000** ✅
- **http://127.0.0.1:3000** ✅
- **http://[::1]:3000** (IPv6) ✅

### Red Local (otros dispositivos):
Para acceder desde otros dispositivos en la misma red:

1. **Obtener IP local**:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   # Ejemplo: 192.168.1.100
   ```

2. **Iniciar servidor con hostname explícito**:
   ```bash
   npm run dev -- -H 0.0.0.0
   # O modificar package.json:
   # "dev": "next dev -H 0.0.0.0"
   ```

3. **Acceder desde otro dispositivo**:
   ```
   http://192.168.1.100:3000
   ```

---

## ⚙️ Configuración de Next.js

### Archivo: `next.config.mjs`
- ✅ No hay restricciones de hostname
- ✅ Headers CORS configurados correctamente
- ✅ Webpack configurado para desarrollo

### Archivo: `package.json`
- ✅ Script `dev` usa `next dev` (por defecto escucha en 0.0.0.0:3000)

---

## 🔧 Solución de Problemas

### Error: ERR_CONNECTION_REFUSED

**Causa**: El servidor no está corriendo

**Solución**:
```bash
# 1. Verificar procesos
ps aux | grep "next dev"

# 2. Si no hay procesos, iniciar servidor
npm run dev

# 3. Esperar mensaje:
# ✓ Ready in Xs
# ○ Local: http://localhost:3000
```

### Error: Puerto 3000 ocupado

**Causa**: Otro proceso está usando el puerto 3000

**Solución**:
```bash
# 1. Encontrar proceso
lsof -i :3000

# 2. Detener proceso
kill -9 [PID]

# 3. O usar otro puerto
PORT=3001 npm run dev
```

### Error: No se puede acceder desde otro dispositivo

**Causa**: Servidor solo escucha en localhost

**Solución**:
```bash
# Iniciar con hostname 0.0.0.0
npm run dev -- -H 0.0.0.0

# O modificar package.json:
# "dev": "next dev -H 0.0.0.0"
```

---

## 📋 Checklist de Verificación

- [x] Servidor corriendo en puerto 3000
- [x] Puerto 3000 abierto y escuchando
- [x] HTTP responde con 200 OK
- [x] Headers CORS configurados
- [x] IPv4 e IPv6 funcionando
- [x] Configuración de Next.js correcta

---

## 🚀 Comandos Útiles

### Iniciar servidor:
```bash
npm run dev
```

### Iniciar servidor con hostname explícito:
```bash
npm run dev -- -H 0.0.0.0
```

### Verificar estado:
```bash
curl http://localhost:3000
lsof -i :3000
```

### Limpiar y reiniciar:
```bash
npm run clean:all
npm run dev
```

---

## ✅ Estado Final

**Configuración de red**: ✅ **CORRECTA Y FUNCIONAL**

El servidor está configurado correctamente y respondiendo en:
- **http://localhost:3000** ✅
- **http://127.0.0.1:3000** ✅

Si aún tienes problemas de conexión, verifica:
1. Que el servidor esté corriendo (`npm run dev`)
2. Que no haya firewall bloqueando el puerto 3000
3. Que el navegador no tenga proxy configurado
4. Que no haya extensiones del navegador bloqueando conexiones locales

