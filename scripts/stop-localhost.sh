#!/bin/bash

# Script para detener localhost de forma segura
# Uso: ./scripts/stop-localhost.sh

echo "🛑 Deteniendo servidor de desarrollo..."

# Matar procesos de Next.js
pkill -f "next dev" 2>/dev/null || true
pkill -f "next-server" 2>/dev/null || true
pkill -f "node.*next" 2>/dev/null || true

# Liberar puerto 3001
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

sleep 1

if lsof -ti:3001 > /dev/null 2>&1; then
    echo "⚠️  Algunos procesos aún están corriendo"
    echo "💡 Intenta: lsof -ti:3001 | xargs kill -9"
else
    echo "✅ Servidor detenido correctamente"
fi
