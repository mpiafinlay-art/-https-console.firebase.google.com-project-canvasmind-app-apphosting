#!/bin/bash
cd "/Users/imacm3-pia/Downloads/canvasmind_backup (1)"
echo "🧹 Limpiando..."
rm -rf out/* .next node_modules/.cache .turbo
echo "🔨 Building..."
npm run build
echo "🚀 Deploying..."
firebase deploy --only hosting:app-micerebro
echo "✅ COMPLETADO"
