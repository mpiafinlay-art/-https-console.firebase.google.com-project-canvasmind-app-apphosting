# Instrucciones para Deployar Correcciones

## Estado Actual

✅ **Correcciones aplicadas localmente**:
- Timeout de seguridad de 5 segundos agregado
- Caché de Next.js limpiada
- Build compilado correctamente

⚠️ **Este directorio NO es un repositorio Git**

## Opciones para Deployar

### Opción 1: Deploy Manual con Firebase CLI (Recomendado)

Si tienes acceso a Firebase CLI y el proyecto está configurado:

```bash
# 1. Verificar que estás en el proyecto correcto
firebase use canvasmind-app

# 2. Desplegar a App Hosting manualmente
firebase apphosting:backends:deploy canvasmind-backend
```

### Opción 2: Sincronizar con Repositorio Git

Según la configuración de Firebase App Hosting, el backend está conectado a:
- **Repositorio**: `mpiafinlay-art-firebase-framework-tools`
- **Backend ID**: `canvasmind-backend`

Para sincronizar los cambios:

1. **Si tienes acceso al repositorio Git**:
   ```bash
   # Inicializar git si no existe
   git init
   git remote add origin <URL_DEL_REPOSITORIO>
   
   # Agregar cambios
   git add .
   git commit -m "Agregar timeout de seguridad para evitar pantalla de carga infinita"
   
   # Push
   git push origin main
   ```

2. **Firebase App Hosting desplegará automáticamente** después del push

### Opción 3: Deploy desde Firebase Console

1. Ir a Firebase Console → App Hosting
2. Seleccionar el backend `canvasmind-backend`
3. Hacer clic en "Deploy" o "Redeploy"
4. Subir los archivos modificados o conectarse al repositorio

## Archivos Modificados que Necesitan Deploy

Los siguientes archivos fueron modificados y necesitan deployarse:

- ✅ `src/app/home-page-content.tsx` - Agregado timeout de seguridad
- ✅ `docs/CORRECCION_TIMEOUT_PRODUCCION.md` - Documentación
- ✅ `docs/VERIFICACION_PRODUCCION.md` - Documentación
- ✅ `docs/SOLUCION_ERROR_948.md` - Documentación

## Verificación Post-Deploy

Después del deploy, verificar:

1. ✅ El sitio carga correctamente (no se queda en "Cargando...")
2. ✅ La página de login aparece después de máximo 5 segundos
3. ✅ El login con Google funciona
4. ✅ El login como invitado funciona
5. ✅ La redirección a tableros funciona correctamente

## Notas Importantes

- El timeout de 5 segundos es suficiente para la mayoría de casos
- Si Firebase se inicializa después del timeout, el usuario aún podrá hacer login
- Los logs en consola ayudarán a diagnosticar problemas de inicialización

