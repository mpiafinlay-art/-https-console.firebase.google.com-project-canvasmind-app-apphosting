# Flujo Completo: Login → Tablero

**Fecha**: 6 de Diciembre 2024

## 🎯 Objetivo
Documentar el flujo exacto que funciona en localhost para replicarlo en producción.

## 📋 Flujo en Localhost (FUNCIONA)

### 1. Usuario hace Login

#### Login con Google:
```
handleLogin('google') 
  → signInWithGoogle(auth)
  → userJustLoggedInRef.current = true
  → sessionStorage.setItem('hasRecentLogin', 'true')
  → sessionStorage.setItem('userJustLoggedIn', 'true')
  → ensureUserDocument(firestore, result.user)
  → onAuthStateChanged detecta cambio
  → useEffect detecta user && userJustLoggedInRef.current
  → processUser(user)
```

#### Login como Invitado:
```
handleLogin('guest')
  → signInAsGuest(auth)
  → userJustLoggedInRef.current = true
  → sessionStorage.setItem('hasRecentLogin', 'true')
  → ensureUserDocument(firestore, result.user)
  → processUserRef.current(result.user) [INMEDIATO]
```

#### Login con Email:
```
handleEmailAuth(email, password)
  → signInWithEmail(auth) o createUserWithEmail(auth)
  → userJustLoggedInRef.current = true
  → sessionStorage.setItem('hasRecentLogin', 'true')
  → sessionStorage.setItem('userJustLoggedIn', 'true')
  → ensureUserDocument(firestore, result.user)
  → processUserRef.current(result.user) [INMEDIATO]
```

### 2. processUser (Función Crítica)

```typescript
processUser(userToProcess: User) {
  // 1. Verificar si ya se procesó
  if (hasProcessedUserRef.current === userToProcess.uid) return;
  
  // 2. Marcar como procesando
  isProcessingRef.current = true;
  hasProcessedUserRef.current = userToProcess.uid;
  
  // 3. Asegurar documento de usuario
  await ensureUserDocument(firestore, userToProcess);
  
  // 4. Buscar tableros existentes
  const boardsCollection = collection(firestore, 'users', userToProcess.uid, 'canvasBoards');
  const q = query(boardsCollection, orderBy('updatedAt', 'desc'), limit(1));
  const querySnapshot = await getDocs(q);
  
  // 5. Si hay tablero existente:
  if (!querySnapshot.empty) {
    const boardId = querySnapshot.docs[0].id;
    // Establecer flags en sessionStorage
    sessionStorage.setItem('hasRecentLogin', 'true');
    sessionStorage.setItem('loginTimestamp', Date.now().toString());
    sessionStorage.setItem('redirectingToBoard', boardId);
    // Marcar como redirigido
    hasRedirectedRef.current = true;
    redirectingToRef.current = boardId;
    // Redirigir
    router.push(`/board/${boardId}`);
    return;
  }
  
  // 6. Si no hay tablero, crear uno nuevo
  const newBoardRef = await addDoc(boardsCollection, {
    name: 'Mi Primer Tablero',
    userId: userToProcess.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  // Establecer flags en sessionStorage
  sessionStorage.setItem('hasRecentLogin', 'true');
  sessionStorage.setItem('loginTimestamp', Date.now().toString());
  sessionStorage.setItem('redirectingToBoard', newBoardRef.id);
  // Marcar como redirigido
  hasRedirectedRef.current = true;
  redirectingToRef.current = newBoardRef.id;
  // Redirigir
  router.push(`/board/${newBoardRef.id}`);
}
```

### 3. BoardPage (Página del Tablero)

```typescript
useEffect(() => {
  // 1. Verificar login reciente
  const hasRecentLogin = sessionStorage.getItem('hasRecentLogin') === 'true';
  const loginTimestamp = sessionStorage.getItem('loginTimestamp');
  const redirectingToBoard = sessionStorage.getItem('redirectingToBoard');
  const isLoginRecent = hasRecentLogin && loginTimestamp && 
    (Date.now() - parseInt(loginTimestamp)) < 60000;
  
  // 2. Si hay login reciente pero no usuario, esperar
  if (isLoginRecent && !user) {
    // Esperar hasta 15 segundos
    return;
  }
  
  // 3. Si no hay usuario y no hay login reciente, redirigir
  if (!user && !isLoginRecent) {
    window.location.replace('/');
    return;
  }
  
  // 4. Si hay usuario, cargar tablero
  if (user?.uid) {
    if (boardId === 'new') {
      createBoardRef.current(userId).then((newBoardId) => {
        window.location.href = `/board/${newBoardId}`;
      });
    } else {
      loadBoardRef.current(boardId, userId).then((loadedBoardId) => {
        if (loadedBoardId) {
          // Tablero cargado exitosamente
          setTimeout(() => {
            sessionStorage.removeItem('hasRecentLogin');
            sessionStorage.removeItem('loginTimestamp');
            sessionStorage.removeItem('redirectingToBoard');
          }, 3000);
        }
      });
    }
  }
}, [boardId, user, authLoading]);
```

## 🔧 Correcciones Aplicadas

### 1. Eliminación de Bucle Infinito
- **Problema**: `processUser` estaba en dependencias de `useEffect`, causando re-creaciones infinitas
- **Solución**: Usar `processUserRef` en lugar de `processUser` directamente
- **Cambio**: Removido `processUser` de dependencias de `useEffect`

### 2. Permisos de Firestore
- **Problema**: Usuarios anónimos no tenían permisos
- **Solución**: Reglas de Firestore ya permiten usuarios anónimos (desplegadas)
- **Estado**: ✅ Corregido

### 3. Renderizado de BoardPage
- **Problema**: Si `board` es `null`, retornaba `null` y no se renderizaba nada
- **Solución**: Mostrar loading cuando `board` es `null` pero hay usuario
- **Estado**: ✅ Corregido

## 📝 Checklist de Verificación

- [x] `processUser` no está en dependencias de `useEffect`
- [x] Se usa `processUserRef.current` en lugar de `processUser` directamente
- [x] Reglas de Firestore desplegadas
- [x] BoardPage muestra loading cuando `board` es `null`
- [x] Flags en sessionStorage se establecen antes de redirigir
- [x] Verificación de login reciente en BoardPage

## 🎯 Próximos Pasos

1. Hacer build y deploy
2. Probar login en producción
3. Verificar que el flujo sea idéntico a localhost

