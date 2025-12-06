# 🔍 Buscar Repositorio en GitHub - Guía Paso a Paso

## 🎯 Objetivo
Encontrar el repositorio `mpiafinlay-art-firebase-framework-tools` en GitHub y el commit `73c3be` del 22 de noviembre 2025.

## 📋 Información que Buscamos
- **Usuario/Organización**: `mpiafinlay-art-firebase-framework-tools`
- **Commit**: `73c3be`
- **Fecha**: 22/11/25, 10:59 p.m.

## 🚀 Método 1: Buscar por Usuario/Organización

### Paso 1: Ve al Perfil de GitHub
```
https://github.com/mpiafinlay-art-firebase-framework-tools
```

### Paso 2: Revisa los Repositorios
Busca repositorios con nombres como:
- `canvasmind-app`
- `firebase-framework-tools`
- `canvasmind-backend`
- O cualquier repositorio relacionado con CanvasMind

### Paso 3: Entra al Repositorio Correcto
Una vez que encuentres el repositorio, haz clic en él.

### Paso 4: Busca el Commit
1. Haz clic en "Commits" o "Commits" en el menú
2. Busca commits del 22 de noviembre 2025
3. O busca directamente: `73c3be`

## 🔍 Método 2: Buscar el Commit Directamente

### Opción A: Búsqueda Global de GitHub
1. Ve a: https://github.com/search
2. Busca: `73c3be`
3. Filtra por:
   - Tipo: Commits
   - Fecha: 22 de noviembre 2025
   - Usuario: mpiafinlay-art-firebase-framework-tools

### Opción B: Buscar en el Repositorio
Si ya sabes el repositorio:
```
https://github.com/mpiafinlay-art-firebase-framework-tools/<nombre-repo>/commit/73c3be
```

## 📋 URLs Probables para Probar

Prueba estas URLs directamente:

1. **Repositorio principal:**
   ```
   https://github.com/mpiafinlay-art-firebase-framework-tools/canvasmind-app
   ```

2. **Repositorio framework:**
   ```
   https://github.com/mpiafinlay-art-firebase-framework-tools/firebase-framework-tools
   ```

3. **Repositorio backend:**
   ```
   https://github.com/mpiafinlay-art-firebase-framework-tools/canvasmind-backend
   ```

4. **Repositorio con mismo nombre:**
   ```
   https://github.com/mpiafinlay-art-firebase-framework-tools/mpiafinlay-art-firebase-framework-tools
   ```

## ✅ Verificar que es el Repositorio Correcto

Una vez que encuentres el repositorio, verifica:

1. **Busca el commit `73c3be`:**
   - Ve a la página del commit: `https://github.com/usuario/repo/commit/73c3be`
   - Debe mostrar la fecha: 22 de noviembre 2025, 10:59 p.m.
   - Debe mostrar el autor: mpiafinlay@gmail.com

2. **Verifica los archivos:**
   - Debe tener una carpeta `src/`
   - Debe tener `package.json`
   - Debe tener `next.config.mjs`
   - Debe tener `firebase.json`

## 🚀 Una Vez que Tengas la URL

### Opción 1: Usar el Script Automático
```bash
cd "/Users/imacm3-pia/Downloads/canvasmind_backup (1)"

# El script pedirá la URL
./restore_commit_73c3be.sh
```

### Opción 2: Pasar la URL Directamente
```bash
export REPO_URL="https://github.com/usuario/repositorio.git"
cd "/Users/imacm3-pia/Downloads/canvasmind_backup (1)"
./restore_commit_73c3be.sh
```

### Opción 3: Restauración Manual
```bash
# Clonar el repositorio
git clone https://github.com/usuario/repositorio.git canvasmind-restored
cd canvasmind-restored

# Restaurar el commit
git checkout 73c3be

# Copiar archivos al directorio de trabajo
# (ver instrucciones en INSTRUCCIONES_RESTAURAR_22_NOV.md)
```

## 🆘 Si el Repositorio es Privado

Si el repositorio es privado y no tienes acceso:

1. **Verifica que estés autenticado en GitHub:**
   ```bash
   gh auth status
   ```

2. **Autentica con GitHub CLI:**
   ```bash
   gh auth login
   ```

3. **O clona con autenticación:**
   ```bash
   git clone https://github.com/usuario/repositorio.git
   # Te pedirá usuario y contraseña/token
   ```

## 💡 Consejos

- Si no encuentras el repositorio, puede estar en una organización diferente
- Busca también por "canvasmind" sin el guión
- Revisa tus repositorios privados en: https://github.com/settings/repositories
- El commit podría estar en una rama diferente (main, master, develop, etc.)

## 📞 Siguiente Paso

Una vez que encuentres el repositorio y el commit:
1. ✅ Copia la URL completa del repositorio
2. ✅ Ejecuta el script de restauración
3. ✅ Verifica que el build funcione
4. ✅ Prueba que la aplicación funcione correctamente

