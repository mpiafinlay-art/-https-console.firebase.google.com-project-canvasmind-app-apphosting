#!/bin/bash

# Script para buscar el repositorio Git conectado a Firebase App Hosting

echo "🔍 Buscando información del repositorio Git..."
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Método 1: Desde Firebase CLI${NC}"
echo "Ejecutando: firebase apphosting:backends:get canvasmind-backend"
echo ""
firebase apphosting:backends:get canvasmind-backend 2>&1 | grep -A 5 -B 5 -i "repository\|repo" || echo "No se encontró información del repositorio en la salida"
echo ""

echo -e "${BLUE}📋 Método 2: Información del Proyecto${NC}"
echo "Proyecto actual:"
cat .firebaserc 2>/dev/null || echo "No se encontró .firebaserc"
echo ""

echo -e "${YELLOW}💡 Próximos pasos manuales:${NC}"
echo ""
echo "1. Ve a Firebase Console:"
echo "   https://console.firebase.google.com/project/canvasmind-app/apphosting"
echo ""
echo "2. Haz clic en 'canvasmind-backend'"
echo ""
echo "3. Busca la sección 'Repository' o 'Repositorio'"
echo ""
echo "4. La URL debería ser algo como:"
echo "   https://github.com/mpiafinlay-art-firebase-framework-tools/..."
echo ""
echo -e "${GREEN}📝 URLs Probables basadas en la información disponible:${NC}"
echo ""
echo "Opción 1: https://github.com/mpiafinlay-art-firebase-framework-tools/canvasmind-app.git"
echo "Opción 2: https://github.com/mpiafinlay-art-firebase-framework-tools.git"
echo ""
echo "Para verificar si alguna de estas URLs es correcta:"
echo "  git ls-remote <URL> | grep 73c3be"
echo ""

