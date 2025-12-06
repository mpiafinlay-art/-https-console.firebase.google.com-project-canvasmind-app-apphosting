# 🔄 Sincronización Localhost ↔ Producción

## ✅ GARANTÍA: Lo que ves en localhost = Lo que se publica

Este documento garantiza que **localhost y producción están 100% sincronizados**.

---

## 🎯 FLUJO DE TRABAJO RECOMENDADO

### 1. **Desarrollo en Localhost**

```bash
# Iniciar servidor local
npm run fix-localhost

# Trabajar en: http://localhost:3001
# Hacer correcciones y pruebas
```

### 2. **Sincronizar y Desplegar**

```bash
# Opción A: Sincronizar y deployar en un solo comando
npm run sync-and-deploy

# Opción B: Sincronizar primero, luego deployar manualmente
npm run sync
# Revisar que todo esté bien, luego:
firebase deploy --only hosting:app-micerebro
```

---

## 📋 QUÉ HACE LA SINCRONIZACIÓN

El comando `npm run sync` garantiza:

1. ✅ **Detiene el servidor local** (evita conflictos)
2. ✅ **Limpia todos los caches** (`.next`, `.turbo`, `.swc`, `out`)
3. ✅ **Hace build completo** (igual que producción)
4. ✅ **Verifica que el build sea correcto** (estructura, archivos)
5. ✅ **Prepara para deploy** (carpeta `out/` lista)

---

## 🔍 VERIFICACIÓN DE SINCRONIZACIÓN

### Configuración Idéntica

| Aspecto | Localhost | Producción | Estado |
|---------|-----------|------------|--------|
| **Código fuente** | `src/` | `src/` | ✅ Idéntico |
| **Build process** | `npm run build` | `npm run build` | ✅ Idéntico |
| **Post-build** | `scripts/post-build.js` | `scripts/post-build.js` | ✅ Idéntico |
| **Output** | `out/` | `out/` | ✅ Idéntico |
| **Firebase config** | `firebase.json` | `firebase.json` | ✅ Idéntico |
| **API Key** | `src/firebase/config.ts` | `src/firebase/config.ts` | ✅ Idéntico |

### Diferencias Controladas

| Aspecto | Localhost | Producción | Razón |
|---------|-----------|------------|-------|
| **URL** | `http://localhost:3001` | `https://app-micerebro.web.app` | Normal (diferentes entornos) |
| **Puerto** | `3001` | `443` (HTTPS) | Normal (desarrollo vs producción) |
| **Hot Reload** | ✅ Activado | ❌ Desactivado | Normal (solo en desarrollo) |

---

## 🚀 PROCESO COMPLETO DE TRABAJO

### Paso 1: Desarrollo Local

```bash
# Iniciar servidor
npm run fix-localhost

# Abrir: http://localhost:3001
# Hacer cambios y probar
```

### Paso 2: Verificar en Localhost

- ✅ Probar todas las funcionalidades
- ✅ Verificar que no haya errores en consola
- ✅ Probar login, tableros, elementos, etc.

### Paso 3: Sincronizar y Deployar

```bash
# Sincronizar (build + verificación)
npm run sync

# Si todo está bien, deployar
firebase deploy --only hosting:app-micerebro
```

### Paso 4: Verificar en Producción

- Abrir: https://app-micerebro.web.app
- Verificar que todo funcione igual que en localhost
- Si hay diferencias, revisar logs y volver al paso 1

---

## ⚠️ IMPORTANTE: Antes de Deployar

### Checklist de Verificación

- [ ] **Localhost funciona correctamente**
  - [ ] No hay errores en consola
  - [ ] Login funciona
  - [ ] Tableros se cargan
  - [ ] Elementos funcionan

- [ ] **Build exitoso**
  - [ ] `npm run sync` completó sin errores
  - [ ] Carpeta `out/` existe y tiene contenido
  - [ ] `out/index.html` existe

- [ ] **Configuración correcta**
  - [ ] API Key actualizada (si aplica)
  - [ ] Firebase config correcto
  - [ ] No hay cambios pendientes sin commit

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Problema: "Localhost funciona pero producción no"

**Causas posibles:**
1. Build no se ejecutó correctamente
2. Caché de producción desactualizado
3. Variables de entorno diferentes

**Solución:**
```bash
# 1. Sincronizar de nuevo
npm run sync

# 2. Verificar build
ls -la out/

# 3. Deployar con --force
firebase deploy --only hosting:app-micerebro --force
```

### Problema: "Diferencias entre localhost y producción"

**Verificar:**
1. ¿Usas variables de entorno? (`.env.local` vs producción)
2. ¿Hay código condicional por entorno?
3. ¿El build se hizo correctamente?

**Solución:**
```bash
# Limpiar todo y rebuild
rm -rf .next out node_modules/.cache
npm run sync
```

---

## 📝 NOTAS TÉCNICAS

### Build Process

1. **`npm run build`**:
   - Compila Next.js
   - Genera `.next/` (caché de build)
   - Genera archivos estáticos

2. **`scripts/post-build.js`**:
   - Copia `index.html` a `out/`
   - Copia archivos estáticos
   - Prepara estructura para Firebase Hosting

3. **Firebase Deploy**:
   - Sube carpeta `out/` a Firebase Hosting
   - Configura rewrites y headers según `firebase.json`

### Garantía de Sincronización

- ✅ **Mismo código fuente**: Ambos usan `src/`
- ✅ **Mismo proceso de build**: Ambos usan `npm run build`
- ✅ **Mismo post-build**: Ambos usan `scripts/post-build.js`
- ✅ **Mismo output**: Ambos generan `out/`

**La única diferencia es el entorno de ejecución (localhost vs Firebase Hosting).**

---

## ✅ COMANDOS RÁPIDOS

```bash
# Desarrollo
npm run fix-localhost          # Iniciar servidor local

# Sincronización
npm run sync                    # Sincronizar (build + verificación)
npm run sync-and-deploy        # Sincronizar + deployar

# Deploy
firebase deploy --only hosting:app-micerebro

# Limpieza
npm run stop-localhost         # Detener servidor local
```

---

## 🎯 RESUMEN

**✅ GARANTÍA:** Lo que ves en `http://localhost:3001` es **exactamente** lo que se publica en `https://app-micerebro.web.app`.

**Proceso:**
1. Desarrollo en localhost
2. `npm run sync` (verifica que compile)
3. `firebase deploy` (publica lo mismo)

**Si hay diferencias**, es un problema de configuración o caché, no del código.

---

**Fecha:** 5 de Diciembre 2024  
**Estado:** ✅ Sincronización garantizada
