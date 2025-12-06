# INICIAR SERVIDOR - PASO A PASO

## ⚠️ PROBLEMA ACTUAL
**ERR_CONNECTION_REFUSED** = El servidor NO está corriendo

## ✅ SOLUCIÓN PASO A PASO

### PASO 1: Abre la Terminal en Cursor
1. Presiona: `` Ctrl+` `` (backtick) en Windows/Linux
   O: `Cmd+` ` en Mac
2. O ve a: **View → Terminal**

### PASO 2: Verifica que estás en la carpeta correcta
Deberías ver algo como:
```
/Users/imacm3-pia/Downloads/canvasmind_backup (1)
```

Si no estás ahí, ejecuta:
```bash
cd "/Users/imacm3-pia/Downloads/canvasmind_backup (1)"
```

### PASO 3: Ejecuta el servidor
```bash
npm run dev
```

### PASO 4: Espera este mensaje
Deberías ver:
```
✓ Ready in Xs
○ Local:        http://localhost:3000
```

### PASO 5: Abre en Browser de Cursor
1. En la pestaña **Browser** de Cursor
2. Click en **"Enter URL"**
3. Escribe: `http://localhost:3000`
4. Presiona **Enter**

## 🔧 SI NO FUNCIONA

### Verifica que el puerto 3000 no esté ocupado:
```bash
lsof -i :3000
```

### Si hay un proceso, ciérralo:
```bash
kill -9 [PID]
```

### Limpia la caché y vuelve a intentar:
```bash
rm -rf .next
npm run dev
```

## ✅ CUANDO FUNCIONE

Deberías ver:
- Página de inicio con botones de login
- Canvas con fondo teal después de login
- Menú principal flotante
- FormattingToolbar negro cuando está abierto

