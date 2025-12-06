#!/bin/bash

# Script permanente para arreglar localhost
# Uso: ./scripts/fix-localhost.sh

set -e  # Salir si hay error

echo "🔧 INICIANDO REPARACIÓN PERMANENTE DE LOCALHOST..."
echo ""

# 1. Matar TODOS los procesos de Node.js y Next.js
echo "1️⃣ Matando procesos de Node.js y Next.js..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "next-server" 2>/dev/null || true
pkill -f "node.*next" 2>/dev/null || true
pkill -f "node.*3001" 2>/dev/null || true
sleep 2

# 2. Liberar puerto 3001
echo "2️⃣ Liberando puerto 3001..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || echo "   ✅ Puerto 3001 ya está libre"
sleep 1

# 3. Limpiar TODOS los caches
echo "3️⃣ Limpiando caches..."
rm -rf .next 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf .turbo 2>/dev/null || true
rm -rf .swc 2>/dev/null || true
rm -rf .next/cache 2>/dev/null || true
rm -rf out 2>/dev/null || true
rm -rf .vercel 2>/dev/null || true
echo "   ✅ Caches limpiados"

# 4. Verificar que el puerto esté libre
echo "4️⃣ Verificando puerto 3001..."
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "   ⚠️  Puerto 3001 aún en uso, forzando liberación..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

if lsof -ti:3001 > /dev/null 2>&1; then
    echo "   ❌ ERROR: No se pudo liberar el puerto 3001"
    echo "   💡 Intenta manualmente: lsof -ti:3001 | xargs kill -9"
    exit 1
else
    echo "   ✅ Puerto 3001 libre"
fi

# 5. Verificar Node.js y npm
echo "5️⃣ Verificando Node.js y npm..."
if ! command -v node &> /dev/null; then
    echo "   ❌ ERROR: Node.js no está instalado"
    exit 1
fi
if ! command -v npm &> /dev/null; then
    echo "   ❌ ERROR: npm no está instalado"
    exit 1
fi
echo "   ✅ Node.js: $(node --version)"
echo "   ✅ npm: $(npm --version)"

# 6. Verificar que package.json existe
echo "6️⃣ Verificando package.json..."
if [ ! -f "package.json" ]; then
    echo "   ❌ ERROR: package.json no encontrado"
    exit 1
fi
echo "   ✅ package.json encontrado"

# 7. Instalar dependencias si es necesario
echo "7️⃣ Verificando dependencias..."
if [ ! -d "node_modules" ]; then
    echo "   📦 Instalando dependencias..."
    npm install
else
    echo "   ✅ node_modules existe"
fi

# 8. Iniciar servidor
echo ""
echo "8️⃣ Iniciando servidor de desarrollo..."
echo "   🌐 El servidor estará disponible en: http://localhost:3001"
echo "   ⏳ Espera unos segundos mientras inicia..."
echo ""

# Iniciar en background y capturar PID
npm run dev > /tmp/next-dev.log 2>&1 &
DEV_PID=$!

# Esperar a que el servidor inicie
echo "   ⏳ Esperando que el servidor inicie..."
for i in {1..30}; do
    sleep 1
    if curl -s http://localhost:3001 > /dev/null 2>&1; then
        echo ""
        echo "✅ ✅ ✅ SERVIDOR INICIADO CORRECTAMENTE ✅ ✅ ✅"
        echo ""
        echo "🌐 URL: http://localhost:3001"
        echo "📝 Logs: tail -f /tmp/next-dev.log"
        echo "🛑 Para detener: kill $DEV_PID"
        echo ""
        exit 0
    fi
    echo -n "."
done

echo ""
echo "⚠️  El servidor está iniciando pero aún no responde"
echo "📝 Revisa los logs: tail -f /tmp/next-dev.log"
echo "🛑 PID del proceso: $DEV_PID"
echo ""
exit 0
