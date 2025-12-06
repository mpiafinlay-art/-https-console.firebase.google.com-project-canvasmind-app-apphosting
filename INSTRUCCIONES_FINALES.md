# INSTRUCCIONES FINALES - INICIAR SERVIDOR

## ✅ VERIFICACIÓN COMPLETA REALIZADA

### Código Verificado:
- ✅ Sin errores de linting
- ✅ Todos los imports correctos
- ✅ Firebase configurado correctamente
### Autenticación Verificada:
- ✅ Login con Google (signInWithRedirect)
- ✅ Login como invitado
- ✅ Login con email/password
- ✅ Redirección después de login

### Componentes Verificados:
- ✅ FormattingToolbar (fondo negro)
- ✅ Menú Principal (fondo teal)
- ✅ Canvas (fondo teal con puntos)
- ✅ Elementos (estilos mejorados)

## 🔴 PROBLEMA ACTUAL

**ERR_CONNECTION_REFUSED = El servidor NO está corriendo**

## ✅ SOLUCIÓN (EJECUTA ESTOS PASOS)

### PASO 1: Abre Terminal en Cursor
1. Presiona: `` Ctrl+` `` (backtick)
2. O ve a: **View → Terminal**

### PASO 2: Verifica que estás en la carpeta correcta
Deberías ver:
```
/Users/imacm3-pia/Downloads/canvasmind_backup (1)
```

Si no, ejecuta:
```bash
cd "/Users/imacm3-pia/Downloads/canvasmind_backup (1)"
```

### PASO 3: Limpia la caché (IMPORTANTE)
```bash
rm -rf .next
```

### PASO 4: Inicia el servidor
```bash
npm run dev
```

### PASO 5: ESPERA este mensaje
```
✓ Ready in Xs
○ Local:        http://localhost:3000
```

### PASO 6: Abre en Browser de Cursor
1. Pestaña **Browser**
2. Click **"Enter URL"**
3. Escribe: `http://localhost:3000`
4. Presiona **Enter**

## ✅ LO QUE DEBERÍAS VER

### Página de Inicio:
- Botón "Iniciar Sesión con Google"
- Botón "Log in" (invitado)
- Link "Entrar como invitado / Crear Cuenta"

### Después de Login:
- Canvas con fondo teal (#b7ddda)
- Menú principal flotante
- FormattingToolbar negro cuando está abierto
- Todos los elementos con estilos correctos

## ⚠️ IMPORTANTE

- **NO cierres la terminal** mientras uses el preview
- El servidor DEBE estar corriendo para que funcione
- Si cierras la terminal, verás ERR_CONNECTION_REFUSED de nuevo

## 🔧 SI SIGUE SIN FUNCIONAR

1. Verifica puerto 3000:
   ```bash
   lsof -i :3000
   ```

2. Si hay proceso, ciérralo:
   ```bash
   kill -9 [PID]
   ```

3. Reinstala dependencias:
   ```bash
   npm install
   ```

4. Vuelve a intentar:
   ```bash
   npm run dev
   ```

