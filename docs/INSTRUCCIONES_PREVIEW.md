# INSTRUCCIONES PARA VER PREVIEW

## 🌐 URLs de Preview

### URL de Producción (Firebase Hosting)
**URL Principal**: `https://canvasmind-app.web.app`

**Estado**: ✅ **FUNCIONANDO**

Abre directamente en tu navegador para ver la versión en producción.

### Desarrollo Local

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3000`

**Nota**: Ver `docs/URL_PREVIEW_ACTUALIZADA.md` para más información sobre URLs.

## Verificación de cambios aplicados:

1. **FormattingToolbar**: Debe tener fondo negro (#000000)
2. **Menú Principal**: Fondo teal (#b7ddda), iconos oscuros cuando inactivos
3. **Canvas**: Fondo teal (#b7ddda) con patrón de puntos
4. **Elementos**: 
   - StickyNote: rounded-lg, shadow-lg, iconos en header
   - TodoList: rounded-lg, shadow-lg
   - Column: rounded-lg, shadow-lg, header con título editable

## Funcionalidades a probar:

1. **Autenticación**:
   - Login con Google (debe redirigir)
   - Login como invitado
   - Login con email/password

2. **Creación de elementos**:
   - Crear nota adhesiva (todos los colores)
   - Crear lista de tareas
   - Crear columna
   - Crear texto
   - Crear imagen

3. **Interacciones**:
   - Click en canvas deselecciona elementos
   - Pan con mouse wheel o Alt+drag
   - Zoom con Ctrl/Cmd+wheel
   - Drag elementos
   - Resize elementos

4. **Menús**:
   - Menú principal: Todos los botones funcionan
   - FormatToolbar: Fondo negro, todos los botones funcionan
   - ZoomControls: Todas las funciones funcionan

## Nota:

Si el servidor no inicia automáticamente, ejecuta manualmente:
```bash
cd "/Users/imacm3-pia/Downloads/canvasmind_backup (1)"
npm run dev
```

