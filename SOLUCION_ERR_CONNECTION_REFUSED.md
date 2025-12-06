# SOLUCIÓN: ERR_CONNECTION_REFUSED

## 🔴 PROBLEMA
El servidor de desarrollo de Next.js NO está corriendo.

## ✅ SOLUCIÓN INMEDIATA

### 1. Abre Terminal en Cursor
- Presiona: `` Ctrl+` `` o `Cmd+` `
- O: View → Terminal

### 2. Ejecuta este comando:
```bash
npm run dev
```

### 3. ESPERA a ver este mensaje:
```
✓ Ready in Xs
○ Local:        http://localhost:3000
```

### 4. Luego en Browser de Cursor:
- Click "Enter URL"
- Escribe: `http://localhost:3000`
- Enter

## ⚠️ IMPORTANTE

**El servidor DEBE estar corriendo** para que funcione el preview.

Si cierras la terminal o detienes el proceso (Ctrl+C), el servidor se detiene y verás ERR_CONNECTION_REFUSED de nuevo.

## 🔄 PARA MANTENER EL SERVIDOR CORRIENDO

- **NO cierres la terminal** mientras uses el preview
- **NO presiones Ctrl+C** en la terminal donde corre el servidor
- Si necesitas usar la terminal para otra cosa, abre una **nueva pestaña de terminal**

## ✅ VERIFICACIÓN

Cuando el servidor esté corriendo correctamente:
- Verás mensajes en la terminal
- Podrás acceder a `http://localhost:3000`
- NO verás ERR_CONNECTION_REFUSED

