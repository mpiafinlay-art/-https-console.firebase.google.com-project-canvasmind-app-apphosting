# ✅ SOLUCIÓN PERMANENTE PARA LOCALHOST

## 🚀 INICIO RÁPIDO

### Opción 1: Usar el script automático (RECOMENDADO)

```bash
npm run fix-localhost
```

Este comando:
- ✅ Mata todos los procesos de Node.js/Next.js
- ✅ Libera el puerto 3001
- ✅ Limpia todos los caches
- ✅ Verifica dependencias
- ✅ Inicia el servidor automáticamente

### Opción 2: Usar el script directamente

```bash
./scripts/fix-localhost.sh
```

---

## 🛑 DETENER EL SERVIDOR

```bash
npm run stop-localhost
```

O directamente:
```bash
./scripts/stop-localhost.sh
```

---

## 📋 QUÉ HACE EL SCRIPT

El script `fix-localhost.sh` realiza automáticamente:

1. **Mata procesos bloqueantes:**
   - Procesos de `next dev`
   - Procesos de `next-server`
   - Cualquier proceso Node.js relacionado con Next.js
   - Procesos usando el puerto 3001

2. **Libera el puerto 3001:**
   - Fuerza la liberación del puerto si está ocupado
   - Verifica que esté libre antes de continuar

3. **Limpia caches:**
   - `.next/` (carpeta de build de Next.js)
   - `node_modules/.cache/` (caché de Node.js)
   - `.turbo/` (caché de Turbopack si existe)
   - `.swc/` (caché del compilador SWC)
   - `out/` (carpeta de output)
   - `.vercel/` (caché de Vercel si existe)

4. **Verifica el entorno:**
   - Node.js instalado
   - npm instalado
   - package.json existe
   - Dependencias instaladas

5. **Inicia el servidor:**
   - Ejecuta `npm run dev`
   - Espera hasta 30 segundos a que responda
   - Confirma que está funcionando

---

## 🔧 SOLUCIÓN MANUAL (si el script no funciona)

Si el script automático no funciona, sigue estos pasos manualmente:

### Paso 1: Matar procesos

```bash
# Matar procesos de Next.js
pkill -f "next dev"
pkill -f "next-server"
pkill -f "node.*next"

# Liberar puerto 3001
lsof -ti:3001 | xargs kill -9
```

### Paso 2: Limpiar caches

```bash
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo
rm -rf .swc
rm -rf out
```

### Paso 3: Verificar puerto

```bash
# Verificar que el puerto esté libre
lsof -ti:3001

# Si muestra un PID, forzar liberación:
lsof -ti:3001 | xargs kill -9
```

### Paso 4: Iniciar servidor

```bash
npm run dev
```

---

## ⚠️ PROBLEMAS COMUNES Y SOLUCIONES

### Error: "Puerto 3001 ya en uso"

**Solución:**
```bash
# Ver qué proceso está usando el puerto
lsof -i:3001

# Matar el proceso
lsof -ti:3001 | xargs kill -9

# O usar el script
npm run stop-localhost
```

### Error: "Command failed to spawn: Aborted"

**Solución:**
```bash
# Limpiar procesos zombie
pkill -9 node
pkill -9 npm

# Esperar 2 segundos
sleep 2

# Intentar de nuevo
npm run fix-localhost
```

### Error: "Cannot find module"

**Solución:**
```bash
# Limpiar todo
rm -rf node_modules .next

# Reinstalar dependencias
npm install

# Iniciar de nuevo
npm run dev
```

### Error: "ERR_CONNECTION_REFUSED"

**Causas posibles:**
1. El servidor no está corriendo
2. El puerto está bloqueado
3. Hay un proceso zombie

**Solución:**
```bash
# Usar el script automático
npm run fix-localhost

# O manualmente:
npm run stop-localhost
sleep 2
npm run dev
```

---

## 🔍 VERIFICAR QUE FUNCIONA

Después de ejecutar el script, verifica:

1. **El servidor responde:**
   ```bash
   curl http://localhost:3001
   ```
   Debe devolver HTML (no error)

2. **El puerto está en uso:**
   ```bash
   lsof -i:3001
   ```
   Debe mostrar un proceso Node.js

3. **Abrir en el navegador:**
   - Ve a: http://localhost:3001
   - Debe cargar la aplicación

---

## 📝 NOTAS IMPORTANTES

### ✅ HACER SIEMPRE:

1. **Usar el script antes de iniciar:**
   ```bash
   npm run fix-localhost
   ```

2. **Detener correctamente:**
   ```bash
   npm run stop-localhost
   ```

3. **Si cambias código, reinicia:**
   - Detén el servidor
   - Ejecuta `npm run fix-localhost` de nuevo

### ❌ NO HACER:

1. ❌ No ejecutar `npm run dev` directamente sin limpiar primero
2. ❌ No dejar procesos corriendo en background
3. ❌ No ignorar errores de puerto ocupado

---

## 🎯 FLUJO RECOMENDADO DE TRABAJO

### Iniciar sesión de trabajo:

```bash
# 1. Limpiar y iniciar
npm run fix-localhost

# 2. Trabajar normalmente
# El servidor se recarga automáticamente con cambios
```

### Terminar sesión de trabajo:

```bash
# Detener el servidor
npm run stop-localhost
```

### Si algo falla:

```bash
# Solución rápida
npm run stop-localhost
sleep 2
npm run fix-localhost
```

---

## 🔄 ACTUALIZACIÓN DEL SCRIPT

Si necesitas actualizar el script, está en:
- `scripts/fix-localhost.sh`
- `scripts/stop-localhost.sh`

Los scripts están configurados en `package.json`:
- `npm run fix-localhost` → Ejecuta `scripts/fix-localhost.sh`
- `npm run stop-localhost` → Ejecuta `scripts/stop-localhost.sh`

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de reportar problemas, verifica:

- [ ] Ejecuté `npm run fix-localhost`
- [ ] El puerto 3001 está libre (verificado con `lsof -i:3001`)
- [ ] Los caches están limpiados (no existe `.next/`)
- [ ] Las dependencias están instaladas (`node_modules/` existe)
- [ ] Node.js está actualizado (`node --version`)
- [ ] No hay procesos zombie (`ps aux | grep node`)

---

## 🆘 SI NADA FUNCIONA

1. **Reinicia tu computadora** (a veces hay procesos bloqueados a nivel del sistema)

2. **Verifica permisos:**
   ```bash
   chmod +x scripts/fix-localhost.sh
   chmod +x scripts/stop-localhost.sh
   ```

3. **Reinstala dependencias:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run fix-localhost
   ```

4. **Verifica la configuración de Next.js:**
   - Revisa `next.config.mjs`
   - Verifica que no haya configuraciones conflictivas

---

**Fecha de creación:** 5 de Diciembre 2024  
**Última actualización:** 5 de Diciembre 2024  
**Estado:** ✅ Solución permanente implementada

**IMPORTANTE:** Usa siempre `npm run fix-localhost` antes de trabajar. Esto previene el 99% de los problemas.
