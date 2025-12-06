#!/bin/bash

# Script para buscar el repositorio en GitHub y el commit 73c3be

echo "🔍 Buscando repositorio en GitHub..."
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

USERNAME="mpiafinlay-art-firebase-framework-tools"
COMMIT_HASH="73c3be"

echo -e "${BLUE}📋 Buscando repositorios del usuario: ${USERNAME}${NC}"
echo ""

# URLs probables
REPOS=(
    "https://github.com/${USERNAME}/canvasmind-app"
    "https://github.com/${USERNAME}/firebase-framework-tools"
    "https://github.com/${USERNAME}/canvasmind-backend"
    "https://github.com/${USERNAME}/${USERNAME}"
)

echo -e "${YELLOW}🔍 Probando URLs comunes...${NC}"
echo ""

for repo in "${REPOS[@]}"; do
    echo -n "Probando: $repo ... "
    
    # Verificar si el repositorio existe
    if curl -s -o /dev/null -w "%{http_code}" "$repo" | grep -q "200"; then
        echo -e "${GREEN}✅ Encontrado!${NC}"
        echo ""
        echo -e "${GREEN}📦 Repositorio encontrado: $repo${NC}"
        echo ""
        
        # Intentar buscar el commit
        echo -e "${YELLOW}🔍 Buscando commit ${COMMIT_HASH}...${NC}"
        
        # Clonar temporalmente para buscar el commit
        TEMP_DIR=$(mktemp -d)
        cd "$TEMP_DIR"
        
        if git clone --depth 100 "$repo.git" temp-repo 2>/dev/null; then
            cd temp-repo
            if git log --oneline --all | grep -q "$COMMIT_HASH"; then
                echo -e "${GREEN}✅ Commit ${COMMIT_HASH} encontrado!${NC}"
                git log --oneline | grep "$COMMIT_HASH"
                echo ""
                echo -e "${GREEN}🎯 URL del repositorio: $repo.git${NC}"
                echo ""
                echo "Para restaurar el commit, ejecuta:"
                echo "  export REPO_URL=\"$repo.git\""
                echo "  cd \"/Users/imacm3-pia/Downloads/canvasmind_backup (1)\""
                echo "  ./restore_commit_73c3be.sh"
            else
                echo -e "${YELLOW}⚠️  Repositorio encontrado pero commit ${COMMIT_HASH} no encontrado en los últimos 100 commits${NC}"
            fi
            cd ..
            rm -rf temp-repo
        else
            echo -e "${RED}❌ No se pudo clonar (puede ser privado)${NC}"
            echo ""
            echo -e "${YELLOW}💡 El repositorio existe pero puede ser privado.${NC}"
            echo "   Ve a: $repo"
            echo "   Y verifica manualmente si tienes acceso."
        fi
        
        rm -rf "$TEMP_DIR"
        break
    else
        echo -e "${RED}❌ No encontrado${NC}"
    fi
done

echo ""
echo -e "${BLUE}📋 Método Manual:${NC}"
echo ""
echo "1. Ve a: https://github.com/${USERNAME}"
echo "2. Busca repositorios relacionados con 'canvasmind' o 'firebase-framework-tools'"
echo "3. Una vez que encuentres el repositorio, copia su URL"
echo "4. Ejecuta:"
echo "   export REPO_URL=\"<URL_DEL_REPOSITORIO>\""
echo "   ./restore_commit_73c3be.sh"
echo ""
echo -e "${BLUE}🔍 Buscar commit directamente:${NC}"
echo "Ve a: https://github.com/search?q=73c3be&type=commits"
echo ""

