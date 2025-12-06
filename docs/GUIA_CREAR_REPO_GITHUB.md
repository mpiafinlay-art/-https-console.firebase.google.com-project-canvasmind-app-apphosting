# Guía: Crear Repositorio GitHub y Conectar con App Hosting

## Paso 1: Crear Repositorio en GitHub

1. Ve a: https://github.com/new
2. **Nombre del repositorio:** `canvasmind-app-micerebro`
3. **Visibilidad:** Privado o Público (tu elección)
4. **NO marques** "Initialize with README"
5. Haz clic en **"Create repository"**

## Paso 2: Conectar Código Local

```bash
cd "/Users/imacm3-pia/Downloads/canvasmind_backup (1)"
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/canvasmind-app-micerebro.git
git push -u origin main
```

## Paso 3: Conectar en App Hosting

1. En Firebase App Hosting, al crear el backend:
2. Selecciona "Connect new repository"
3. Busca `canvasmind-app-micerebro`
4. Conecta el repositorio

## Listo ✅

