#!/bin/bash

# Script para limpiar y reiniciar el servidor de Next.js
# Uso: ./scripts/clean-and-restart.sh

echo "🧹 Limpiando procesos de Next.js..."

# Detener todos los procesos de Next.js
pkill -f "next dev" 2>/dev/null
pkill -f "next-server" 2>/dev/null

# Liberar puerto 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null

echo "✅ Procesos detenidos"

echo "🗑️  Eliminando caché de Next.js..."

# Eliminar carpeta .next
rm -rf .next

echo "✅ Caché eliminada"

echo "🔨 Verificando build..."

# Hacer build para verificar que no hay errores
npm run build > /tmp/next-build.log 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Build exitoso"
    echo ""
    echo "🚀 Iniciando servidor de desarrollo..."
    npm run dev
else
    echo "❌ Error en el build. Revisa /tmp/next-build.log"
    cat /tmp/next-build.log | grep -E "(error|Error|ERROR)" | head -20
    exit 1
fi

