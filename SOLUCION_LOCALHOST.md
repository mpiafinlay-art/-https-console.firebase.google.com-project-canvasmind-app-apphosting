# Solución para Problemas de Localhost

## 🔧 Comandos para Reparar Localhost

Si localhost no funciona (`ERR_CONNECTION_REFUSED`), ejecuta estos comandos:

### 1. Detener todos los procesos de Next.js
```bash
pkill -f "next dev"
pkill -f "node.*next"
```

### 2. Liberar el puerto 3001
```bash
lsof -ti:3001 | xargs kill -9
```

### 3. Limpiar cache
```bash
rm -rf .next node_modules/.cache .turbo .swc .next/cache
```

### 4. Reiniciar servidor
```bash
npm run dev
```

---

## ✅ Verificación

Después de ejecutar los comandos, espera 8-10 segundos y verifica:
- Abre: `http://localhost:3001/`
- Deberías ver la página de login

---

## 📝 Nota

Si el problema persiste:
1. Cierra todas las pestañas del navegador con localhost
2. Espera 30 segundos
3. Vuelve a ejecutar `npm run dev`
4. Abre una nueva pestaña en modo incógnito

---

**Fecha:** 5 de Diciembre 2024
