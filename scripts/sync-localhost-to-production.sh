#!/bin/bash

# Script para sincronizar localhost con producción
# Garantiza que lo que funciona en localhost se despliegue correctamente

set -e

echo "🔄 SINCRONIZANDO LOCALHOST CON PRODUCCIÓN..."
echo ""

# 1. Detener servidor local
echo "1️⃣ Deteniendo servidor local..."
npm run stop-localhost 2>/dev/null || true
sleep 2

# 2. Limpiar todo
echo "2️⃣ Limpiando caches y builds anteriores..."
rm -rf .next .turbo .swc node_modules/.cache out 2>/dev/null || true
echo "   ✅ Limpieza completa"

# 3. Verificar que el código compile correctamente
echo "3️⃣ Verificando que el código compile..."
if npm run build > /tmp/build-sync.log 2>&1; then
    echo "   ✅ Build exitoso"
else
    echo "   ❌ ERROR: El build falló"
    echo "   📝 Revisa los logs: tail -50 /tmp/build-sync.log"
    exit 1
fi

# 4. Verificar que el build sea correcto
echo "4️⃣ Verificando estructura del build..."
if [ ! -d "out" ]; then
    echo "   ❌ ERROR: No se generó la carpeta 'out'"
    exit 1
fi

if [ ! -f "out/index.html" ]; then
    echo "   ❌ ERROR: No se generó index.html"
    exit 1
fi

echo "   ✅ Estructura del build correcta"

# 5. Mostrar resumen
echo ""
echo "✅ ✅ ✅ SINCRONIZACIÓN COMPLETA ✅ ✅ ✅"
echo ""
echo "📋 Resumen:"
echo "   - Código compilado correctamente"
echo "   - Build generado en: out/"
echo "   - Listo para deploy"
echo ""
echo "🚀 Próximo paso:"
echo "   firebase deploy --only hosting:app-micerebro"
echo ""
