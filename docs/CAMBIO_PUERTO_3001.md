# Cambio de Puerto a 3001

## Fecha: 4 de Diciembre 2024

## Motivo
Se cambió el puerto del servidor de desarrollo de **3000** a **3001** para evitar conflictos y errores de conexión recurrentes (`ERR_CONNECTION_REFUSED`).

## Cambios Realizados

### 1. `package.json`
- **Script `dev`**: Cambiado de `next dev` a `next dev -p 3001`
- **Script `dev:clean`**: Actualizado para usar puerto 3001

### 2. `clean-dev.sh`
- Actualizado para liberar tanto el puerto 3000 como el 3001
- Mensaje actualizado para indicar el nuevo puerto

## Nueva URL de Desarrollo

**Antes:** `http://localhost:3000`  
**Ahora:** `http://localhost:3001`

## Comandos Actualizados

```bash
# Iniciar servidor de desarrollo
npm run dev
# Ahora corre en http://localhost:3001

# Limpiar y reiniciar
npm run dev:clean
# También usa puerto 3001

# Limpieza radical
npm run dev:radical
# Libera puertos 3000 y 3001
```

## Verificación

El servidor está funcionando correctamente en el nuevo puerto:
- ✅ Responde con código 200 OK
- ✅ Sin errores de conexión
- ✅ Sin conflictos de puerto

## Notas Importantes

- **Actualiza tus bookmarks/favoritos** a `http://localhost:3001`
- Si tienes scripts o configuraciones que apuntan a `localhost:3000`, actualízalos
- El puerto 3001 es más seguro y evita conflictos con otras aplicaciones que puedan usar el 3000

