# INSTRUCCIONES PARA LOCALHOST

## Para iniciar localhost correctamente:

1. **Limpiar caché y procesos:**
   ```bash
   npm run clean:all
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Abrir en navegador:**
   ```
   http://localhost:3001
   ```

## Si sigue sin funcionar:

1. **Verificar que el puerto 3001 esté libre:**
   ```bash
   lsof -ti:3001
   ```
   Si muestra un número, matar el proceso:
   ```bash
   lsof -ti:3001 | xargs kill -9
   ```

2. **Limpiar todo y reconstruir:**
   ```bash
   rm -rf .next node_modules/.cache .turbo
   npm run dev
   ```

## IMPORTANTE:

- Los errores 404 en localhost significan que el servidor de desarrollo NO está corriendo
- Debes ejecutar `npm run dev` ANTES de abrir localhost:3001
- El servidor debe estar corriendo en la terminal para que funcione
