#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Función para copiar directorios recursivamente
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Crear directorio public si no existe (antes era out)
const outDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// CRÍTICO: Copiar el index.html COMPLETO de Next.js
// Next.js genera un index.html con todos los datos de inicialización necesarios
// para que el router del lado del cliente funcione correctamente
const outIndexPath = path.join(outDir, 'index.html');
if (fs.existsSync(outIndexPath)) {
  fs.unlinkSync(outIndexPath);
  console.log('🗑️  index.html anterior eliminado de public/');
}

// CRÍTICO: Copiar el index.html COMPLETO de Next.js
const nextIndexPath = path.join(__dirname, '..', '.next', 'server', 'app', 'index.html');

if (fs.existsSync(nextIndexPath)) {
  // Copiar el index.html completo de Next.js (incluye datos de inicialización)
  const nextIndexContent = fs.readFileSync(nextIndexPath, 'utf8');
  fs.writeFileSync(outIndexPath, nextIndexContent);
  console.log('✅ index.html completo copiado desde .next/server/app/');
} else {
  console.warn('⚠️  index.html no encontrado en .next/server/app/, creando uno básico...');
  
  // Buscar los chunks de Next.js para incluirlos en el index.html
const staticChunksDir = path.join(__dirname, '..', '.next', 'static', 'chunks');
let webpackChunk = '';
let mainAppChunk = '';
let vendorChunk = '';
let firebaseChunk = '';
let layoutChunk = '';
let pageChunk = '';

if (fs.existsSync(staticChunksDir)) {
  const chunks = fs.readdirSync(staticChunksDir);
  chunks.forEach(chunk => {
    if (chunk.startsWith('webpack-') && chunk.endsWith('.js')) {
      webpackChunk = `/_next/static/chunks/${chunk}`;
    } else if (chunk.startsWith('main-app-') && chunk.endsWith('.js')) {
      mainAppChunk = `/_next/static/chunks/${chunk}`;
    } else if (chunk.startsWith('vendor-') && chunk.endsWith('.js')) {
      vendorChunk = `/_next/static/chunks/${chunk}`;
    } else if (chunk.startsWith('firebase-') && chunk.endsWith('.js')) {
      firebaseChunk = `/_next/static/chunks/${chunk}`;
    }
  });
}

// Buscar chunks de app
const appChunksDir = path.join(__dirname, '..', '.next', 'static', 'chunks', 'app');
if (fs.existsSync(appChunksDir)) {
  const appChunks = fs.readdirSync(appChunksDir);
  appChunks.forEach(chunk => {
    if (chunk.startsWith('layout-') && chunk.endsWith('.js')) {
      layoutChunk = `/_next/static/chunks/app/${chunk}`;
    } else if (chunk.startsWith('page-') && chunk.endsWith('.js')) {
      pageChunk = `/_next/static/chunks/app/${chunk}`;
    }
  });
}

// Buscar CSS
const cssDir = path.join(__dirname, '..', '.next', 'static', 'css');
let cssFile = '';
if (fs.existsSync(cssDir)) {
  const cssFiles = fs.readdirSync(cssDir);
  if (cssFiles.length > 0) {
    cssFile = `/_next/static/css/${cssFiles[0]}`;
  }
}

// Generar index.html universal (shell vacío para SPA)
const universalIndexHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Mi cerebro - Tu lienzo de ideas infinitas</title>
  <meta name="description" content="Mi cerebro - Tu lienzo de ideas infinitas. Crea, organiza y comparte tus ideas en un canvas infinito." />
  <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&family=The+Girl+Next+Door&display=swap" rel="stylesheet" />
  ${cssFile ? `<link rel="stylesheet" href="${cssFile}" data-precedence="next" />` : ''}
  ${webpackChunk ? `<link rel="preload" as="script" fetchPriority="low" href="${webpackChunk}" />` : ''}
</head>
<body class="font-body antialiased" style="margin:0;padding:0">
  <div id="__next"></div>
  ${vendorChunk ? `<script src="${vendorChunk}" async=""></script>` : ''}
  ${mainAppChunk ? `<script src="${mainAppChunk}" async=""></script>` : ''}
  ${firebaseChunk ? `<script src="${firebaseChunk}" async=""></script>` : ''}
  ${layoutChunk ? `<script src="${layoutChunk}" async=""></script>` : ''}
  ${pageChunk ? `<script src="${pageChunk}" async=""></script>` : ''}
  ${webpackChunk ? `<script src="${webpackChunk}" id="_R_" async=""></script>` : ''}
  <script>
    // CRÍTICO: Inicializar Next.js router para que maneje todas las rutas dinámicamente
    // Esto permite que las rutas dinámicas como /board/[boardId] funcionen correctamente
    (self.__next_f=self.__next_f||[]).push([0]);
    // Next.js cargará automáticamente los scripts y contenido de la ruta actual
    // El router del lado del cliente manejará la navegación
  </script>
</body>
</html>`;

  fs.writeFileSync(outIndexPath, universalIndexHtml);
  console.log('✅ index.html universal creado (shell vacío para SPA mode)');
  
  // Verificar que el archivo existe y tiene contenido
  if (fs.existsSync(outIndexPath)) {
    const content = fs.readFileSync(outIndexPath, 'utf8');
    if (content.includes('Mi cerebro') || content.includes('__next') || content.includes('CanvasMind')) {
      console.log('✅ Verificado: index.html tiene estructura correcta');
    } else {
      console.warn('⚠️  ADVERTENCIA: index.html puede no tener estructura correcta');
    }
  } else {
    throw new Error('❌ ERROR CRÍTICO: No se pudo crear index.html en public/');
  }
}

// Copiar archivos estáticos de .next/static a public/_next/static
const staticSrc = path.join(__dirname, '..', '.next', 'static');
const staticDest = path.join(outDir, '_next', 'static');

if (fs.existsSync(staticSrc)) {
  copyDir(staticSrc, staticDest);
  console.log('✅ Archivos estáticos copiados a public/_next/static/');
} else {
  console.warn('⚠️  Directorio .next/static no encontrado');
}

// Copiar archivos de _Public a public (EXCEPTO index.html y archivos backup)
const publicSrc = path.join(__dirname, '..', '_Public');
const publicDest = outDir;

if (fs.existsSync(publicSrc)) {
  const publicEntries = fs.readdirSync(publicSrc);
  for (const entry of publicEntries) {
    // NO copiar index.html de public/ porque es la página de bienvenida de Firebase
    // NO copiar archivos backup (.backup, .firebase-backup, etc.)
    if (entry === 'index.html' || entry.endsWith('.backup') || entry.endsWith('.firebase-backup')) {
      continue;
    }
    
    const srcPath = path.join(publicSrc, entry);
    const destPath = path.join(publicDest, entry);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  console.log('✅ Archivos de _Public/ copiados a public/ (excepto index.html y backups)');
}

console.log('✅ Post-build completado');
