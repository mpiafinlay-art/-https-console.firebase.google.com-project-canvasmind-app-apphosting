# Ejemplo de Inicio de Sesión Exitoso como Invitado

**Fecha de creación**: $(date)  
**Entorno**: Localhost (localhost:3000)  
**Objetivo**: Documentar el flujo completo de inicio de sesión como invitado para recrearlo en producción

---

## 📋 Resumen del Flujo

El inicio de sesión como invitado sigue estos pasos:

1. **Inicialización de Firebase** en el cliente
2. **Autenticación anónima** mediante `signInAnonymously`
3. **Detección del usuario anónimo** en el listener de autenticación
4. **Procesamiento del usuario** (crear documento de usuario si no existe)
5. **Búsqueda o creación de tablero** (buscar tablero más reciente o crear uno nuevo)
6. **Carga del tablero** en el store de Zustand
7. **Redirección** a la página del tablero

---

## 🔍 Logs Esperados (Ejemplo Exitoso)

### Paso 1: Inicialización de Firebase

```
✅ Firebase inicializado correctamente en el cliente
```

**Archivo**: `src/firebase/client-provider.tsx`  
**Línea**: 59

**Código relevante**:
```59:59:src/firebase/client-provider.tsx
      console.log('✅ Firebase inicializado correctamente en el cliente');
```

---

### Paso 2: Cambio de Estado de Autenticación

```
🔐 Auth state changed: Usuario: XdE47oqhPCPiM2lq7vMhUcB76ll1
```

**Archivo**: `src/firebase/client-provider.tsx`  
**Línea**: 151

**Código relevante**:
```148:182:src/firebase/client-provider.tsx
    const unsubscribe = onAuthStateChanged(
      firebaseState.auth,
      async (user) => {
        console.log('🔐 Auth state changed:', user ? `Usuario: ${user.email || user.uid}` : 'Sin usuario');
        
        if (user) {
          // Verificar si venimos de un redirect de Google
          const hasGoogleRedirect = typeof window !== 'undefined' && 
            (document.referrer.includes('accounts.google.com') || 
             document.referrer.includes('firebaseapp.com') ||
             window.location.search.includes('code='));
          
          // Si hay usuario después de un redirect de Google, establecer flags inmediatamente
          if (hasGoogleRedirect || user.email) {
            console.log('✅ Usuario autenticado después de login, estableciendo flags...');
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('hasRecentLogin', 'true');
              sessionStorage.setItem('loginTimestamp', Date.now().toString());
              sessionStorage.setItem('googleRedirectCompleted', 'true');
            }
          }
          
          if (!user.email) {
            // Usuario anónimo
            console.log('👤 Usuario anónimo detectado');
            // También marcar login reciente para invitados
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('hasRecentLogin', 'true');
              sessionStorage.setItem('loginTimestamp', Date.now().toString());
            }
          }
        }
        
        setUserState({ user, isUserLoading: false, userError: null });
      },
```

**Nota**: El UID del usuario anónimo será diferente en cada sesión. En este ejemplo: `XdE47oqhPCPiM2lq7vMhUcB76ll1`

---

### Paso 3: Detección de Usuario Anónimo

```
👤 Usuario anónimo detectado
```

**Archivo**: `src/firebase/client-provider.tsx`  
**Línea**: 172

**Código relevante**:
```170:178:src/firebase/client-provider.tsx
          if (!user.email) {
            // Usuario anónimo
            console.log('👤 Usuario anónimo detectado');
            // También marcar login reciente para invitados
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('hasRecentLogin', 'true');
              sessionStorage.setItem('loginTimestamp', Date.now().toString());
            }
          }
```

**Acción**: Se establecen flags en `sessionStorage` para indicar que hay un login reciente.

---

### Paso 4: Procesamiento del Usuario

**Archivo**: `src/app/home-page-content.tsx`

El componente `HomePageContent` detecta el usuario autenticado y ejecuta `processUser`:

**Logs esperados**:
```
🔄 [processUser] Iniciando... { uid: 'XdE47oqhPCPiM2lq7vMhUcB76ll1' }
✅ [processUser] Documento de usuario asegurado
🔍 [processUser] Buscando tableros en: users/XdE47oqhPCPiM2lq7vMhUcB76ll1/canvasBoards
📊 [processUser] Consulta con orderBy exitosa. Tableros encontrados: 1
```

**Código relevante**:
```135:161:src/app/home-page-content.tsx
  const processUser = useCallback(async (userToProcess: User) => {
    // PREVENCIÓN: Si ya se está procesando o ya se procesó este usuario, salir
    if (isProcessingRef.current || hasProcessedUserRef.current === userToProcess.uid) {
      console.log('⏭️ Usuario ya procesado o en proceso, saltando...', { uid: userToProcess.uid });
      return;
    }

    // PREVENCIÓN: Si ya se está redirigiendo, NO hacer nada
    if (hasRedirectedRef.current || redirectingToRef.current) {
      console.log('⏭️ Ya se está redirigiendo, saltando procesamiento...');
      return;
    }

    // Marcar como procesando ANTES de cualquier operación asíncrona
    isProcessingRef.current = true;
    hasProcessedUserRef.current = userToProcess.uid;

    try {
      console.log('🔄 [processUser] Iniciando...', { uid: userToProcess.uid });
      
      if (!firestore) {
        throw new Error('Firestore no disponible');
      }

      // Asegurar documento de usuario
      await ensureUserDocument(firestore, userToProcess);
      console.log('✅ [processUser] Documento de usuario asegurado');
```

---

### Paso 5: Búsqueda de Tablero Existente

Si el usuario ya tiene un tablero, se busca el más reciente:

**Logs esperados**:
```
➡️ [processUser] Redirigiendo a tablero existente: { boardId: 'ylJyxQN0agEdhPe5HT07' }
🚀 Redirigiendo a tablero: ylJyxQN0agEdhPe5HT07
```

**Código relevante**:
```216:235:src/app/home-page-content.tsx
      if (!querySnapshot.empty && querySnapshot.docs[0]) {
        const boardId = querySnapshot.docs[0].id;
        console.log('➡️ [processUser] Redirigiendo a tablero existente:', { boardId });
        
        // CRÍTICO: Marcar ANTES de redirigir para prevenir re-ejecuciones
        hasRedirectedRef.current = true;
        redirectingToRef.current = boardId;
        isProcessingRef.current = false; // Permitir que se complete
        hasProcessedUserRef.current = userToProcess.uid; // Marcar como procesado
        
        // CRÍTICO: Mantener el flag de login reciente en sessionStorage para la navegación
        // NO limpiar hasta que la página del tablero se cargue completamente
        sessionStorage.setItem('hasRecentLogin', 'true');
        sessionStorage.setItem('loginTimestamp', Date.now().toString());
        
        // NO resetear userJustLoggedInRef aquí - mantenerlo hasta que la redirección se complete
        // Usar window.location para forzar redirección inmediata
        console.log('🚀 Redirigiendo a tablero:', boardId);
        window.location.href = `/board/${boardId}`;
        return;
```

**Si no hay tablero existente**, se crea uno nuevo:

**Logs esperados**:
```
➕ [processUser] No se encontraron tableros, creando nuevo tablero...
✅ [processUser] Nuevo tablero creado exitosamente: { boardId: '...', path: '...' }
🚀 Redirigiendo a nuevo tablero: ...
```

---

### Paso 6: Carga del Tablero en el Store

**Archivo**: `src/lib/store/boardStore.ts`

Cuando se navega a `/board/[boardId]`, el componente `BoardPage` llama a `loadBoard`:

**Log esperado**:
```
✅ [boardStore] Tablero cargado exitosamente: Object
  boardId: "ylJyxQN0agEdhPe5HT07"
  boardName: "Mi Primer Tablero"
  userId: "XdE47oqhPCPiM2lq7vMhUcB76ll1"
```

**Código relevante**:
```55:158:src/lib/store/boardStore.ts
  loadBoard: async (boardId: string, userId: string) => {
    // Limpiar listener anterior si existe
    const { unsubscribeElements } = get();
    if (unsubscribeElements) {
      unsubscribeElements();
    }

    set({ isLoading: true, error: null });
    try {
      const db = getDb();
      // Usar la nueva estructura: users/{userId}/canvasBoards/{boardId}
      const boardRef = doc(db, 'users', userId, 'canvasBoards', boardId);
      const boardSnap = await getDoc(boardRef);

      if (!boardSnap.exists()) {
          throw new Error("El tablero no existe o no tienes permiso para verlo.");
      }

      const boardDataRaw = boardSnap.data();
      const boardData: WithId<Board> = { 
        id: boardSnap.id, 
        ...boardDataRaw,
        // Asegurar que userId esté presente
        userId: (boardDataRaw.userId || (boardDataRaw as { ownerId?: string }).ownerId || userId) as string,
      } as WithId<Board>;

      // FIX: Usar onSnapshot en lugar de getDocs para tiempo real
      // Usar la nueva estructura para elementos: users/{userId}/canvasBoards/{boardId}/canvasElements
      const elementsCollection = collection(db, 'users', userId, 'canvasBoards', boardId, 'canvasElements');
      
      // Intentar con orderBy, si falla usar sin orden
      let unsubscribe: (() => void);
      try {
        const elementsQuery = query(elementsCollection, orderBy('zIndex', 'asc'));
        unsubscribe = onSnapshot(
          elementsQuery,
          (snapshot) => {
            const elements = snapshot.docs.map(doc => ({ 
              id: doc.id, 
              ...doc.data() 
            } as WithId<CanvasElement>));
            set({ elements, isLoading: false });
          },
          (error) => {
            console.error("Error en listener de elementos:", error);
            // Si falla con orderBy, intentar sin orden
            const fallbackUnsubscribe = onSnapshot(
              elementsCollection,
              (snapshot) => {
                const elements = snapshot.docs.map(doc => ({ 
                  id: doc.id, 
                  ...doc.data() 
                } as WithId<CanvasElement>));
                // Ordenar manualmente por zIndex
                elements.sort((a, b) => {
                  const aZ = a.zIndex || 0;
                  const bZ = b.zIndex || 0;
                  return aZ - bZ;
                });
                set({ elements, isLoading: false });
              },
              (fallbackError) => {
                console.error("Error en listener de elementos (fallback):", fallbackError);
                set({ isLoading: false, error: fallbackError.message });
              }
            );
            set({ unsubscribeElements: fallbackUnsubscribe });
          }
        );
      } catch (orderByError) {
        // Si orderBy falla inmediatamente, usar sin orden
        console.warn("orderBy falló, usando sin orden:", orderByError);
        unsubscribe = onSnapshot(
          elementsCollection,
          (snapshot) => {
            const elements = snapshot.docs.map(doc => ({ 
              id: doc.id, 
              ...doc.data() 
            } as WithId<CanvasElement>));
            // Ordenar manualmente por zIndex
            elements.sort((a, b) => {
              const aZ = a.zIndex || 0;
              const bZ = b.zIndex || 0;
              return aZ - bZ;
            });
            set({ elements, isLoading: false });
          },
          (error) => {
            console.error("Error en listener de elementos:", error);
            set({ isLoading: false, error: error.message });
          }
        );
      }
      
      set({ board: boardData, unsubscribeElements: unsubscribe, selectedElementIds: [] });
      console.log('✅ [boardStore] Tablero cargado exitosamente:', { boardId, userId, boardName: boardData.name });
      return boardId;
    } catch (error) {
      console.error("❌ [boardStore] Error al cargar el tablero:", error);
      const errorMessage = (error as Error).message;
      set({ isLoading: false, error: errorMessage, board: null, elements: [] });
      return null;
    }
  },
```

---

## 🔄 Flujo Completo Paso a Paso

### 1. Usuario hace clic en "Entrar como Invitado"

**Archivo**: `src/components/auth/landing-page.tsx` o `src/app/home-page-content.tsx`

**Acción**: Se ejecuta `handleGuestLogin()` o `handleLogin()` que llama a `signInAsGuest(auth)`

**Código relevante**:
```29:43:src/components/auth/landing-page.tsx
  const handleGuestLogin = async () => {
    if (!auth) {
      setError("Firebase no está disponible. Recarga la página.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await signInAsGuest(auth);
    } catch (err: unknown) {
      console.error("Error login Invitado:", err);
      setError("Error al entrar como invitado.");
      setIsLoading(false);
    }
  };
```

**Función de autenticación**:
```111:119:src/firebase/auth.ts
export const signInAsGuest = async (auth: Auth): Promise<UserCredential> => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential;
  } catch (error) {
    console.error('Error signing in as guest:', error);
    throw error;
  }
};
```

---

### 2. Firebase Auth crea usuario anónimo

- Firebase Auth genera un UID único para el usuario anónimo
- Se dispara `onAuthStateChanged` con el nuevo usuario

---

### 3. `client-provider.tsx` detecta el cambio

- Se ejecuta el listener de `onAuthStateChanged`
- Se detecta que el usuario no tiene email (es anónimo)
- Se establecen flags en `sessionStorage`

---

### 4. `home-page-content.tsx` procesa el usuario

- Se ejecuta `processUser(user)`
- Se crea/verifica el documento del usuario en Firestore
- Se buscan tableros existentes del usuario
- Si hay tableros, se redirige al más reciente
- Si no hay tableros, se crea uno nuevo y se redirige

---

### 5. Navegación a `/board/[boardId]`

- El componente `BoardPage` se monta
- Se llama a `loadBoard(boardId, userId)` del store
- Se carga el tablero desde Firestore
- Se suscribe a los elementos del tablero en tiempo real

---

## 📊 Estructura de Datos en Firestore

### Documento de Usuario

**Ruta**: `users/{userId}`

```json
{
  "uid": "XdE47oqhPCPiM2lq7vMhUcB76ll1",
  "email": null,
  "displayName": "Invitado",
  "photoURL": null,
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

### Tablero

**Ruta**: `users/{userId}/canvasBoards/{boardId}`

```json
{
  "name": "Mi Primer Tablero",
  "userId": "XdE47oqhPCPiM2lq7vMhUcB76ll1",
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

### Elementos del Tablero

**Ruta**: `users/{userId}/canvasBoards/{boardId}/canvasElements/{elementId}`

---

## ✅ Checklist para Verificar en Producción

Cuando hagas deploy, verifica que estos pasos ocurran en el mismo orden:

- [ ] ✅ Firebase inicializado correctamente en el cliente
- [ ] 🔐 Auth state changed: Usuario: [UID]
- [ ] 👤 Usuario anónimo detectado
- [ ] 🔄 [processUser] Iniciando...
- [ ] ✅ [processUser] Documento de usuario asegurado
- [ ] 🔍 [processUser] Buscando tableros en: users/[UID]/canvasBoards
- [ ] 📊 [processUser] Consulta con orderBy exitosa. Tableros encontrados: [N]
- [ ] ➡️ [processUser] Redirigiendo a tablero existente: { boardId: '...' }
- [ ] 🚀 Redirigiendo a tablero: [boardId]
- [ ] ✅ [boardStore] Tablero cargado exitosamente: { boardId, userId, boardName }

---

## 🔧 Archivos Clave Involucrados

1. **`src/firebase/client-provider.tsx`**: Inicialización de Firebase y detección de cambios de autenticación
2. **`src/firebase/auth.ts`**: Función `signInAsGuest` que ejecuta `signInAnonymously`
3. **`src/app/home-page-content.tsx`**: Procesamiento del usuario y búsqueda/creación de tableros
4. **`src/lib/store/boardStore.ts`**: Carga del tablero y sus elementos
5. **`src/app/board/[boardId]/page.tsx`**: Página del tablero que usa el store

---

## 🚨 Posibles Problemas y Soluciones

### Problema: No se detecta el usuario anónimo

**Solución**: Verificar que `onAuthStateChanged` esté configurado correctamente y que `signInAnonymously` se haya ejecutado sin errores.

### Problema: No se encuentra el tablero

**Solución**: Verificar que:
- El documento de usuario existe en `users/{userId}`
- La colección `canvasBoards` existe bajo `users/{userId}/canvasBoards`
- Las reglas de seguridad de Firestore permiten la lectura

### Problema: Error al cargar el tablero

**Solución**: Verificar que:
- El `boardId` es válido
- El tablero existe en la ruta correcta
- Las reglas de seguridad permiten la lectura del tablero y sus elementos

---

## 📝 Notas Adicionales

- El UID del usuario anónimo es único por sesión
- Si el usuario cierra la sesión y vuelve a entrar como invitado, se creará un nuevo UID
- Los tableros de usuarios anónimos se mantienen asociados a ese UID específico
- Para convertir un usuario anónimo en un usuario permanente, se debe usar `linkWithCredential` o `updateProfile`

---

## 🔗 Referencias

- [Firebase Auth - Autenticación Anónima](https://firebase.google.com/docs/auth/web/anonymous-auth)
- [Firestore - Estructura de Datos](https://firebase.google.com/docs/firestore/data-model)
- Documentación interna: `docs/VERIFICACION_REDIRECCION_LOGIN.md`

