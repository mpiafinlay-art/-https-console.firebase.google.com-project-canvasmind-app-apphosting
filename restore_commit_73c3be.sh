#!/bin/bash

# Script para restaurar el commit 73c3be del 22 de noviembre 2025
# Último deploy exitoso: https://canvasmind-app.web.app/

set -e

echo "🔄 Restaurando commit 73c3be del 22 de noviembre 2025..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Directorio de trabajo
WORK_DIR="/Users/imacm3-pia/Downloads"
BACKUP_DIR="$WORK_DIR/canvasmind_backup (1)"
RESTORE_DIR="$WORK_DIR/canvasmind-restored-73c3be"

# Verificar si el repositorio Git está disponible
echo -e "${YELLOW}📋 Paso 1: Verificando acceso al repositorio Git...${NC}"

# Preguntar por la URL del repositorio si no está configurada
if [ -z "$REPO_URL" ]; then
    echo -e "${YELLOW}Por favor, proporciona la URL del repositorio Git:${NC}"
    echo "Ejemplo: https://github.com/usuario/repositorio.git"
    read -p "URL del repositorio: " REPO_URL
fi

# Clonar el repositorio si no existe
if [ ! -d "$RESTORE_DIR" ]; then
    echo -e "${YELLOW}📥 Clonando repositorio...${NC}"
    cd "$WORK_DIR"
    git clone "$REPO_URL" canvasmind-restored-73c3be
    cd "$RESTORE_DIR"
else
    echo -e "${GREEN}✅ Directorio del repositorio ya existe${NC}"
    cd "$RESTORE_DIR"
    git fetch origin
fi

# Verificar que el commit existe
echo -e "${YELLOW}🔍 Verificando commit 73c3be...${NC}"
if git cat-file -e 73c3be 2>/dev/null; then
    echo -e "${GREEN}✅ Commit 73c3be encontrado${NC}"
else
    echo -e "${RED}❌ Error: Commit 73c3be no encontrado${NC}"
    echo "Intentando buscar commits similares..."
    git log --oneline --all | grep -i "73c3be\|22.*nov\|nov.*22" | head -5
    exit 1
fi

# Mostrar información del commit
echo -e "${YELLOW}📝 Información del commit:${NC}"
git show 73c3be --stat --oneline | head -20

# Crear backup del estado actual
echo -e "${YELLOW}💾 Creando backup del estado actual...${NC}"
BACKUP_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_before_restore_${BACKUP_TIMESTAMP}"
cd "$BACKUP_DIR"
cd ..
tar -czf "${BACKUP_NAME}.tar.gz" "canvasmind_backup (1)" 2>/dev/null || echo "⚠️ No se pudo crear backup completo"
echo -e "${GREEN}✅ Backup creado: ${BACKUP_NAME}.tar.gz${NC}"

# Restaurar el commit
echo -e "${YELLOW}🔄 Restaurando commit 73c3be...${NC}"
cd "$RESTORE_DIR"
git checkout 73c3be

# Copiar archivos al directorio de trabajo
echo -e "${YELLOW}📋 Copiando archivos restaurados...${NC}"

# Lista de archivos/directorios críticos a copiar
CRITICAL_FILES=(
    "src"
    "package.json"
    "package-lock.json"
    "next.config.mjs"
    "tsconfig.json"
    "tailwind.config.ts"
    "postcss.config.mjs"
    "firebase.json"
    "apphosting.yaml"
    "firestore.rules"
    "storage.rules"
    "public"
)

cd "$RESTORE_DIR"

for item in "${CRITICAL_FILES[@]}"; do
    if [ -e "$item" ]; then
        echo "  📁 Copiando $item..."
        cp -r "$item" "$BACKUP_DIR/" 2>/dev/null || echo "  ⚠️ No se pudo copiar $item"
    else
        echo "  ⚠️ $item no existe en el commit restaurado"
    fi
done

# Instalar dependencias
echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
cd "$BACKUP_DIR"
npm install

# Verificar build
echo -e "${YELLOW}🔨 Verificando build...${NC}"
npm run build || {
    echo -e "${RED}❌ Error en el build${NC}"
    echo "Revisa los errores arriba"
    exit 1
}

echo ""
echo -e "${GREEN}✅ Restauración completada exitosamente!${NC}"
echo ""
echo "📋 Próximos pasos:"
echo "  1. Revisa los cambios: git diff (si es un repo Git)"
echo "  2. Inicia el servidor: npm run dev"
echo "  3. Verifica que todo funcione correctamente"
echo ""
echo "📁 Archivos restaurados en: $BACKUP_DIR"
echo "📁 Backup del estado anterior: ${BACKUP_NAME}.tar.gz"

