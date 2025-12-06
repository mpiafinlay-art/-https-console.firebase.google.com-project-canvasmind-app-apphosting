#!/bin/bash

echo "🧹 LIMPIEZA RADICAL DEL SERVIDOR DE DESARROLLO"
echo "=============================================="

# 1. Detener todos los procesos
echo "1️⃣ Deteniendo todos los procesos de Next.js y Node..."
pkill -f "next dev" 2>/dev/null
pkill -f "next-server" 2>/dev/null
pkill -f "node.*next" 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 2
echo "✅ Procesos detenidos"

# 2. Limpiar caché completamente
echo "2️⃣ Limpiando caché..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo
rm -rf .swc
echo "✅ Caché limpiada"

# 3. Verificar que los puertos están libres
echo "3️⃣ Verificando puertos 3000 y 3001..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Puerto 3000 aún ocupado, forzando liberación..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 1
fi
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Puerto 3001 aún ocupado, forzando liberación..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null
    sleep 1
fi
echo "✅ Puertos 3000 y 3001 libres"

# 4. Verificar build
echo "4️⃣ Verificando que el build funciona..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Build exitoso"
else
    echo "❌ Build falló, revisa los errores"
    exit 1
fi

# 5. Limpiar build de producción (solo mantener desarrollo limpio)
rm -rf .next

echo ""
echo "🚀 Iniciando servidor de desarrollo limpio en puerto 3001..."
echo "=============================================="
npm run dev
