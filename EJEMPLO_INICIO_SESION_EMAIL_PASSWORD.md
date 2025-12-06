# Ejemplo de Inicio de Sesión Exitoso con Email y Contraseña

**Fecha de creación**: $(date)  
**Entorno**: Localhost (localhost:3000)  
**Objetivo**: Documentar el flujo completo de inicio de sesión con email y contraseña para recrearlo en producción

---

## 📋 Resumen del Flujo

El inicio de sesión con email y contraseña sigue estos pasos:

1. **Inicialización de Firebase** en el cliente
2. **Autenticación con email/contraseña** mediante `signInWithEmailAndPassword` o `createUserWithEmailAndPassword`
3. **Detección del usuario autenticado** en el listener de autenticación
4. **Establecimiento de flags** en sessionStorage
5. **Procesamiento del usuario** (crear documento de usuario si no existe)
6. **Búsqueda o creación de tablero** (buscar tablero más reciente o crear uno nuevo)
7. **Carga del tablero** en el store de Zustand
8. **Redirección** a la página del tablero

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
🔐 Auth state changed: Usuario: pia@mipeque.cl
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

**Nota**: El email del usuario se muestra en el log. En este ejemplo: `pia@mipeque.cl`

---

### Paso 3: Establecimiento de Flags

```
✅ Usuario autenticado después de login, estableciendo flags...
```

**Archivo**: `src/firebase/client-provider.tsx`  
**Línea**: 162

**Código relevante**:
```160:168:src/firebase/client-provider.tsx
          // Si hay usuario después de un redirect de Google, establecer flags inmediatamente
          if (hasGoogleRedirect || user.email) {
            console.log('✅ Usuario autenticado después de login, estableciendo flags...');
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('hasRecentLogin', 'true');
              sessionStorage.setItem('loginTimestamp', Date.now().toString());
              sessionStorage.setItem('googleRedirectCompleted', 'true');
            }
          }
```

**Acción**: Se establecen flags en `sessionStorage` para indicar que hay un login reciente. Esto es crítico para que el flujo continúe correctamente.

---

### Paso 4: Procesamiento del Usuario

**Archivo**: `src/app/home-page-content.tsx`

El componente `HomePageContent` detecta el usuario autenticado y ejecuta `processUser`:

**Logs esperados**:
```
✅ Autenticación con email exitosa, procesando usuario... { uid: 'SMSVBHClFfcmxntHMMFW7Kl4xNK2' }
🔄 [processUser] Iniciando... { uid: 'SMSVBHClFfcmxntHMMFW7Kl4xNK2' }
✅ [processUser] Documento de usuario asegurado
🔍 [processUser] Buscando tableros en: users/SMSVBHClFfcmxntHMMFW7Kl4xNK2/canvasBoards
📊 [processUser] Consulta con orderBy exitosa. Tableros encontrados: 1
```

**Código relevante**:
```477:527:src/app/home-page-content.tsx
  const handleEmailAuth = useCallback(async (email: string, password: string) => {
    if (!auth) {
      throw new Error('Servicio de autenticación no disponible.');
    }

    try {
      // CRÍTICO: Marcar que el usuario acaba de hacer login explícitamente
      userJustLoggedInRef.current = true;
      
      // CRÍTICO: Guardar en sessionStorage para mantener el estado entre navegaciones
      sessionStorage.setItem('hasRecentLogin', 'true');
      sessionStorage.setItem('loginTimestamp', Date.now().toString());
      
      // Resetear flags antes de autenticación
      hasProcessedUserRef.current = null;
      isProcessingRef.current = false;
      hasRedirectedRef.current = false;
      redirectingToRef.current = null;
      
      let result: UserCredential;
      
      if (emailAuthMode === 'login') {
        result = await signInWithEmail(auth, email, password);
      } else {
        result = await createUserWithEmail(auth, email, password);
        toast({
          title: '¡Cuenta creada!',
          description: 'Tu cuenta ha sido creada exitosamente.',
        });
      }
      
      if (firestore && result.user) {
        await ensureUserDocument(firestore, result.user);
      }
      
      console.log('✅ Autenticación con email exitosa, procesando usuario...', { uid: result.user.uid });
      // Procesar usuario inmediatamente después del login con email
      if (firestore && result.user) {
        // NO esperar al useEffect, procesar inmediatamente
        processUser(result.user);
      }
    } catch (error: any) {
      console.error('❌ Error en handleEmailAuth:', error);
      toast({
        variant: 'destructive',
        title: 'Error de autenticación',
        description: error.message || 'No se pudo completar la autenticación.',
      });
      throw error;
    }
  }, [auth, firestore, emailAuthMode, toast]);
```

---

### Paso 5: Búsqueda de Tablero Existente

Si el usuario ya tiene un tablero, se busca el más reciente:

**Logs esperados**:
```
➡️ [processUser] Redirigiendo a tablero existente: { boardId: '0TcyrxD8rk3sajM5808I' }
🚀 Redirigiendo a tablero: 0TcyrxD8rk3sajM5808I
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
✅ [boardStore] Tablero cargado exitosamente: {
  boardId: "0TcyrxD8rk3sajM5808I",
  boardName: "Mi Primer Tablero",
  userId: "SMSVBHClFfcmxntHMMFW7Kl4xNK2"
}
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

### 1. Usuario hace clic en "Entrar como invitado / Crear Cuenta"

**Archivo**: `src/app/home-page-content.tsx`

**Acción**: Se abre el diálogo `EmailAuthDialog` con modo 'login' o 'signup'

**Código relevante**:
```640:654:src/app/home-page-content.tsx
        <Button 
          size="lg" 
          onClick={() => {
            setEmailAuthMode('signup');
            setEmailAuthDialogOpen(true);
          }}
          variant="outline"
          className="bg-white text-[#00667a] hover:bg-slate-50"
        >
          Entrar como invitado / Crear Cuenta
        </Button>
      </div>
      
      <EmailAuthDialog
        isOpen={emailAuthDialogOpen}
        onOpenChange={setEmailAuthDialogOpen}
        mode={emailAuthMode}
        onAuth={handleEmailAuth}
      />
```

---

### 2. Usuario ingresa email y contraseña

**Archivo**: `src/components/auth/email-auth-dialog.tsx`

**Acción**: El usuario completa el formulario y hace clic en "Iniciar Sesión" o "Crear Cuenta"

**Código relevante**:
```36:99:src/components/auth/email-auth-dialog.tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Por favor completa todos los campos.',
      });
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Las contraseñas no coinciden.',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'La contraseña debe tener al menos 6 caracteres.',
      });
      return;
    }

    setIsLoading(true);
    try {
      await onAuth(email, password);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error en autenticación:', error);
      let errorMessage = 'No se pudo completar la operación.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo electrónico ya está en uso.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El correo electrónico no es válido.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No existe una cuenta con este correo electrónico.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'La contraseña es incorrecta.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
```

---

### 3. Firebase Auth autentica al usuario

**Archivo**: `src/firebase/auth.ts`

**Función de autenticación**:
```128:136:src/firebase/auth.ts
export const signInWithEmail = async (auth: Auth, email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    console.error('Error signing in with email:', error);
    throw error;
  }
};
```

**Función de creación de cuenta**:
```145:153:src/firebase/auth.ts
export const createUserWithEmail = async (auth: Auth, email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    console.error('Error creating user with email:', error);
    throw error;
  }
};
```

---

### 4. `client-provider.tsx` detecta el cambio

- Se ejecuta el listener de `onAuthStateChanged`
- Se detecta que el usuario tiene email (no es anónimo)
- Se establecen flags en `sessionStorage`

---

### 5. `home-page-content.tsx` procesa el usuario

- Se ejecuta `processUser(user)` inmediatamente después del login
- Se crea/verifica el documento del usuario en Firestore
- Se buscan tableros existentes del usuario
- Si hay tableros, se redirige al más reciente
- Si no hay tableros, se crea uno nuevo y se redirige

---

### 6. Navegación a `/board/[boardId]`

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
  "uid": "SMSVBHClFfcmxntHMMFW7Kl4xNK2",
  "email": "pia@mipeque.cl",
  "displayName": "pia@mipeque.cl",
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
  "userId": "SMSVBHClFfcmxntHMMFW7Kl4xNK2",
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

---

## ✅ Checklist para Verificar en Producción

Cuando hagas deploy, verifica que estos pasos ocurran en el mismo orden:

- [ ] ✅ Firebase inicializado correctamente en el cliente
- [ ] 🔐 Auth state changed: Usuario: [email]
- [ ] ✅ Usuario autenticado después de login, estableciendo flags...
- [ ] ✅ Autenticación con email exitosa, procesando usuario... { uid: '...' }
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
2. **`src/firebase/auth.ts`**: Funciones `signInWithEmail` y `createUserWithEmail`
3. **`src/components/auth/email-auth-dialog.tsx`**: Diálogo de autenticación con email/contraseña
4. **`src/app/home-page-content.tsx`**: Procesamiento del usuario y búsqueda/creación de tableros
5. **`src/lib/store/boardStore.ts`**: Carga del tablero y sus elementos

---

## 🚨 Posibles Problemas y Soluciones

### Problema: Error "auth/user-not-found"

**Solución**: El usuario no existe. Debe crear una cuenta primero usando el modo 'signup'.

### Problema: Error "auth/wrong-password"

**Solución**: La contraseña ingresada es incorrecta. El usuario debe verificar su contraseña.

### Problema: Error "auth/email-already-in-use"

**Solución**: El email ya está registrado. El usuario debe usar el modo 'login' en lugar de 'signup'.

### Problema: No se detecta el usuario autenticado

**Solución**: Verificar que `onAuthStateChanged` esté configurado correctamente y que `signInWithEmail` se haya ejecutado sin errores.

---

## 📝 Notas Adicionales

- El UID del usuario con email es permanente (no cambia entre sesiones)
- Los tableros de usuarios con email se mantienen asociados a ese UID específico
- Si el usuario olvida su contraseña, debe usar la función de recuperación de contraseña de Firebase (no implementada actualmente)
- La contraseña debe tener al menos 6 caracteres

---

## 🔗 Referencias

- [Firebase Auth - Autenticación con Email/Contraseña](https://firebase.google.com/docs/auth/web/password-auth)
- [Firestore - Estructura de Datos](https://firebase.google.com/docs/firestore/data-model)
- Documentación interna: `EJEMPLO_INICIO_SESION_INVITADO.md`

