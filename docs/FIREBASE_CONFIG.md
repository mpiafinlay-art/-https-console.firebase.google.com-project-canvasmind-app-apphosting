# Configuración de Firebase para CanvasMind

## Configuración Actual

La aplicación está configurada para usar **Firebase App Hosting** (no Firebase Hosting tradicional) porque:

1. **Next.js con SSR**: La aplicación usa Next.js con Server-Side Rendering
2. **Rutas dinámicas**: Tiene rutas dinámicas como `/board/[boardId]`
3. **API Routes**: Usa API routes de Next.js (`/api/*`)

## Estructura de `firebase.json`

```json
{
  "firestore": { ... },      // ✅ Base de datos
  "apphosting": { ... },     // ✅ Backend de Next.js (Cloud Run)
  "functions": { ... },      // ✅ Cloud Functions (opcional)
  "storage": { ... }          // ✅ Storage rules
  // ❌ NO hay sección "hosting" - eso es para archivos estáticos
}
```

## Por qué NO usar Firebase Hosting tradicional

Firebase Hosting tradicional (`"hosting"` en `firebase.json`) es para:
- Sitios estáticos (HTML, CSS, JS)
- Single Page Applications (SPA) sin SSR
- Archivos estáticos desde la carpeta `public/`

**CanvasMind NO puede usar esto** porque:
- Necesita SSR para las rutas dinámicas
- Tiene API routes que requieren un servidor Node.js
- Usa Firebase directamente desde el cliente y servidor

## App Hosting vs Hosting tradicional

| Característica | App Hosting | Hosting tradicional |
|----------------|-------------|---------------------|
| SSR | ✅ Sí | ❌ No |
| API Routes | ✅ Sí | ❌ No |
| Rutas dinámicas | ✅ Sí | ⚠️ Limitado |
| Archivos estáticos | ✅ Sí (desde Next.js) | ✅ Sí |
| Costo | Cloud Run | Hosting gratuito |

## Archivos en `public/`

Los archivos en `public/` (como `google-logo.svg`, `canvas_mind.svg`) son:
- ✅ Usados por Next.js directamente (Next.js sirve `public/` automáticamente)
- ✅ No necesitan Firebase Hosting tradicional
- ✅ Se incluyen en el build de Next.js

## Comandos de Deploy

### Para App Hosting (recomendado):
```bash
# El deploy se hace automáticamente cuando haces push al repositorio
# O manualmente con:
firebase apphosting:backends:deploy canvasmind-backend
```

### NO uses:
```bash
firebase deploy --only hosting  # ❌ Esto intentaría usar hosting tradicional
```

## Verificación

Para verificar que la configuración es correcta:

```bash
# Ver configuración actual
cat firebase.json

# Verificar que NO hay sección "hosting"
grep -A 10 '"hosting"' firebase.json  # No debería mostrar nada

# Verificar que SÍ hay sección "apphosting"
grep -A 10 '"apphosting"' firebase.json  # Debería mostrar la configuración
```

## Resumen

✅ **Configuración correcta**: Solo `apphosting` en `firebase.json`  
❌ **Configuración incorrecta**: Tener `hosting` y `apphosting` al mismo tiempo  
✅ **Archivos `public/`**: Se usan automáticamente por Next.js, no necesitan configuración especial

