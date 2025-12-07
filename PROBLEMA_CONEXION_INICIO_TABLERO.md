# 🔴 PROBLEMA: Página de inicio no conecta con tableros después de login

## PROBLEMA IDENTIFICADO

### Flujo actual:
1. Usuario hace login en `/` → `processUser` busca/crea tablero
2. `window.location.href = /board/${boardId}` → Redirige a tablero
3. **PROBLEMA**: La página del tablero verifica `user` pero puede no estar disponible inmediatamente después del redirect
4. Si `!user && !isLoginRecent` → Redirige de vuelta a `/` (línea 355-361)
5. **LOOP INFINITO**: Usuario nunca puede acceder al tablero

## 🔴 BUGS ESPECÍFICOS:

### 1. **Verificación de login reciente puede fallar**
**Archivo**: `src/app/board/[boardId]/page.tsx` línea 349-352
```typescript
const hasRecentLogin = typeof window !== 'undefined' ? sessionStorage.getItem('hasRecentLogin') === 'true' : false;
const loginTimestamp = typeof window !== 'undefined' ? sessionStorage.getItem('loginTimestamp') : null;
const redirectingToBoard = typeof window !== 'undefined' ? sessionStorage.getItem('redirectingToBoard') : null;
const isLoginRecent = hasRecentLogin && loginTimestamp && (Date.now() - parseInt(loginTimestamp)) < 60000;
```

**Problema**:
- Si `sessionStorage` se limpia o no se establece correctamente, `isLoginRecent` es `false`
- Si `user` no está disponible inmediatamente (especialmente usuarios anónimos), redirige a `/`
- El timeout de 10-30 segundos puede no ser suficiente si Firebase Auth tarda en inicializar

### 2. **Limpieza prematura de sessionStorage**
**Archivo**: `src/app/board/[boardId]/page.tsx` línea 416-420
```typescript
setTimeout(() => {
  sessionStorage.removeItem('hasRecentLogin');
  sessionStorage.removeItem('loginTimestamp');
  sessionStorage.removeItem('redirectingToBoard');
}, 2000);
```

**Problema**:
- Se limpia después de 2 segundos, pero si el usuario tarda más en cargar, se pierde la información
- Si hay un re-render o re-carga, el tablero no puede verificar el login reciente

### 3. **Usuario anónimo puede no persistir después de redirect**
**Archivo**: `src/app/home-page-content.tsx` línea 362-365
```typescript
if (userToProcess.isAnonymous) {
  safeSessionStorage.setItem('anonymousUserId', userToProcess.uid);
  console.log('💾 Guardando UID de usuario anónimo para restaurar después del redirect:', userToProcess.uid);
}
```

**Problema**:
- `window.location.href` hace un redirect completo que puede perder la sesión anónima
- Firebase Auth puede no restaurar la sesión anónima inmediatamente después del redirect
- No hay lógica para restaurar el usuario anónimo desde `sessionStorage`

### 4. **Verificación de ruta en home-page puede interferir**
**Archivo**: `src/app/home-page-content.tsx` línea 512-520
```typescript
const isOnBoardPage = typeof window !== 'undefined' && 
                      window.location?.pathname?.startsWith('/board/');

if (isOnBoardPage) {
  return; // No hacer nada si estamos en tablero
}
```

**Problema**:
- Si el usuario está en `/board/[boardId]` pero `user` aún no está disponible, el tablero redirige a `/`
- La página de inicio detecta que está en tablero y no hace nada
- El usuario queda atrapado sin poder acceder

## ✅ SOLUCIONES PROPUESTAS:

### 1. **Aumentar tiempo de espera y mejorar verificación**
```typescript
// En board/[boardId]/page.tsx
const isLoginRecent = hasRecentLogin && loginTimestamp && (Date.now() - parseInt(loginTimestamp)) < 120000; // 2 minutos
const waitTime = redirectingToBoard === boardId ? 60000 : 30000; // Aumentar a 60s/30s
```

### 2. **No limpiar sessionStorage hasta que el tablero esté completamente cargado**
```typescript
// Solo limpiar después de confirmar que el tablero se cargó exitosamente
if (loadedBoardId && elements.length > 0) {
  setTimeout(() => {
    sessionStorage.removeItem('hasRecentLogin');
    sessionStorage.removeItem('loginTimestamp');
    sessionStorage.removeItem('redirectingToBoard');
  }, 5000); // Aumentar a 5 segundos
}
```

### 3. **Restaurar usuario anónimo desde sessionStorage si no está disponible**
```typescript
// En board/[boardId]/page.tsx, después de verificar login reciente
if (isLoginRecent && !user) {
  const anonymousUserId = sessionStorage.getItem('anonymousUserId');
  if (anonymousUserId) {
    // Intentar restaurar sesión anónima
    // O esperar más tiempo antes de redirigir
  }
}
```

### 4. **Usar router.push en lugar de window.location.href para mantener estado**
```typescript
// En home-page-content.tsx
// router.push(`/board/${boardId}`); // Mantiene estado de React
// En lugar de window.location.href que hace reload completo
```

### 5. **Mejorar logging para debug**
```typescript
console.log('🔍 [BoardPage] Estado de autenticación:', {
  hasUser: !!user,
  userId: user?.uid,
  hasRecentLogin,
  loginTimestamp,
  redirectingToBoard,
  boardId,
  isLoginRecent,
  timeSinceLogin: loginTimestamp ? Date.now() - parseInt(loginTimestamp) : null
});
```

