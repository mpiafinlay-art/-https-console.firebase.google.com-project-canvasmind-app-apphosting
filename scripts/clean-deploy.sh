#!/bin/bash

# Script para limpiar y hacer deploy limpio a Firebase Hosting

set -e  # Salir si hay errores

echo "🧹 Limpiando archivos anteriores..."
rm -rf out/ .next/

echo "🔨 Haciendo build limpio..."
npm run build

echo "📋 Verificando que index.html existe y es correcto..."
if [ ! -f "out/index.html" ]; then
    echo "❌ ERROR: index.html no se generó en out/"
    exit 1
fi

# Verificar que el index.html tiene contenido válido
if grep -q "Mi cerebro\|__next\|CanvasMind" out/index.html; then
    echo "✅ index.html verificado: tiene estructura correcta"
else
    echo "⚠️  ADVERTENCIA: index.html puede no tener estructura correcta"
fi

echo "🚀 Desplegando a Firebase Hosting..."
firebase deploy --only hosting:app-micerebro

echo "✅ Deploy completado!"
echo "🌐 Visita: https://app-micerebro.web.app"

