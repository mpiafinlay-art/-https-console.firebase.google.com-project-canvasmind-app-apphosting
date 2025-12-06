# Error: Invariant: missing bootstrap script

## 🔴 Error Encontrado
```
Error: Invariant: missing bootstrap script. This is a bug in Next.js
```

## ✅ Solución Aplicada

Este error es común en Next.js y generalmente se resuelve limpiando el cache:

```bash
# 1. Detener el servidor
pkill -f "next dev"

# 2. Eliminar cache de Next.js
rm -rf .next

# 3. Reiniciar el servidor
npm run dev
```

## 🔍 Causa del Error

Este error puede ocurrir por:
1. **Cache corrupto** de Next.js
2. **Problemas de compilación** incompleta
3. **Archivos faltantes** en `.next/`

## ✅ Verificación Post-Corrección

Después de limpiar el cache y reiniciar:
1. ✅ El servidor debería iniciar correctamente
2. ✅ La página debería cargar sin errores
3. ✅ Los componentes deberían renderizarse correctamente

## 📋 Si el Error Persiste

Si el error persiste después de limpiar el cache:

```bash
# Limpiar todo y reinstalar
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

