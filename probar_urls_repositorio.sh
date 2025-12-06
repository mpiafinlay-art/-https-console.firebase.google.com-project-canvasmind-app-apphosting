#!/bin/bash

# Script para probar URLs probables del repositorio y encontrar el commit 73c3be

echo "🔍 Probando URLs probables del repositorio..."
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

COMMIT_HASH="73c3be"
REPO_BASE="mpiafinlay-art-firebase-framework-tools"

# URLs probables para probar
REPOS=(
    # GitHub
    "https://github.com/${REPO_BASE}/canvasmind-app.git"
    "https://github.com/${REPO_BASE}/firebase-framework-tools.git"
    "https://github.com/${REPO_BASE}/canvasmind-backend.git"
    "https://github.com/${REPO_BASE}/${REPO_BASE}.git"
    "https://github.com/${REPO_BASE}.git"
    
    # GitLab
    "https://gitlab.com/${REPO_BASE}/canvasmind-app.git"
    "https://gitlab.com/${REPO_BASE}/firebase-framework-tools.git"
    "https://gitlab.com/${REPO_BASE}/canvasmind-backend.git"
    
    # Bitbucket
    "https://bitbucket.org/${REPO_BASE}/canvasmind-app.git"
    "https://bitbucket.org/${REPO_BASE}/firebase-framework-tools.git"
)

echo -e "${BLUE}📋 Probando ${#REPOS[@]} URLs probables...${NC}"
echo ""

FOUND_REPO=""

for repo in "${REPOS[@]}"; do
    echo -n "Probando: $repo ... "
    
    # Verificar si el repositorio existe y tiene el commit
    if git ls-remote "$repo" 2>/dev/null | grep -q "$repo" 2>/dev/null; then
        # Intentar buscar el commit
        TEMP_DIR=$(mktemp -d)
        cd "$TEMP_DIR"
        
        if git clone --depth 100 "$repo" temp-repo 2>/dev/null; then
            cd temp-repo
            if git log --oneline --all 2>/dev/null | grep -q "$COMMIT_HASH"; then
                echo -e "${GREEN}✅ ENCONTRADO!${NC}"
                echo ""
                echo -e "${GREEN}🎯 Repositorio encontrado: $repo${NC}"
                echo -e "${GREEN}✅ Commit ${COMMIT_HASH} encontrado${NC}"
                echo ""
                git log --oneline | grep "$COMMIT_HASH" | head -1
                echo ""
                FOUND_REPO="$repo"
                cd ..
                rm -rf temp-repo
                rm -rf "$TEMP_DIR"
                break
            else
                echo -e "${YELLOW}⚠️  Repositorio existe pero commit no encontrado${NC}"
            fi
            cd ..
            rm -rf temp-repo
        else
            # Repositorio puede ser privado o no existe
            HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${repo%.git}" 2>/dev/null)
            if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
                echo -e "${YELLOW}⚠️  Repositorio existe pero puede ser privado${NC}"
                echo "   URL: ${repo%.git}"
            else
                echo -e "${RED}❌ No encontrado${NC}"
            fi
        fi
        rm -rf "$TEMP_DIR"
    else
        echo -e "${RED}❌ No encontrado${NC}"
    fi
done

echo ""

if [ -n "$FOUND_REPO" ]; then
    echo -e "${GREEN}✅ Repositorio encontrado!${NC}"
    echo ""
    echo "Para restaurar el commit, ejecuta:"
    echo ""
    echo "  export REPO_URL=\"$FOUND_REPO\""
    echo "  cd \"/Users/imacm3-pia/Downloads/canvasmind_backup (1)\""
    echo "  ./restore_commit_73c3be.sh"
    echo ""
else
    echo -e "${YELLOW}⚠️  No se encontró el repositorio con las URLs probables${NC}"
    echo ""
    echo "El repositorio puede ser:"
    echo "1. Privado y requiere autenticación"
    echo "2. Estar en una URL diferente"
    echo "3. Estar en un servicio Git diferente"
    echo ""
    echo "Por favor, busca la URL en los detalles del build del 22 de noviembre"
    echo "o comparte la URL si la encuentras manualmente."
fi

