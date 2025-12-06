# VERIFICACIÓN COMPLETA DE RUTA: https://app-micerebro.web.app/
**Fecha:** 5 de Diciembre 2024  
**Estado:** ✅ **DOCUMENTADO**

---

## 📍 FLUJO COMPLETO DESDE QUE EL USUARIO ACCEDE A LA URL

### Paso 1: Usuario Accede a `https://app-micerebro.web.app/`

**Archivo:** `src/app/page.tsx`
```typescript
export default function HomePage() {
  return <HomePageContent />;
}
```
**Acción:** Renderiza el componente `HomePageContent`

---

### Paso 2: Layout Principal se Carga

**Archivo:** `src/app/layout.tsx`
```typescript
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          {children}  // <HomePageContent />
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
```
**Acción:** 
- Envuelve la app con `Providers` (Firebase, Theme, etc.)
- Inicializa Firebase en el cliente

---

### Paso 3: Providers Inicializan Firebase

**Archivo:** `src/components/providers.tsx` → `src/firebase/client-provider.tsx`

**Acción:**
1. Inicializa Firebase App
2. Obtiene instancias de Auth, Firestore, Storage
3. Configura listener `onAuthStateChanged` para detectar cambios de autenticación
4. Actualiza estado global con `user`, `isUserLoading`, `userError`

**Logs Esperados:**
```
✅ Firebase inicializado correctamente en el cliente
🔐 Auth state changed: Usuario: {email} o Sin usuario
```

---

### Paso 4: HomePageContent se Monta

**Archivo:** `src/app/home-page-content.tsx`

**Estados Iniciales:**
```typescript
const [isMounted, setIsMounted] = useState(false);
const [showLogin, setShowLogin] = useState(true); // Por defecto: mostrar login
const userJustLoggedInRef = useRef<boolean>(false); // FALSE por defecto
```

**useEffect 1: Marcar como Montado**
```typescript
useEffect(() => {
  setIsMounted(true);
}, []);
```
**Acción:** Marca el componente como montado (después de hidratación)

**useEffect 2: Timeout de Seguridad**
```typescript
useEffect(() => {
  if (!isMounted) return;
  
  initTimeoutRef.current = setTimeout(() => {
    if (!hasRedirectedRef.current && !redirectingToRef.current) {
      console.warn('⏱️ TIMEOUT: Mostrando login después de 2 segundos');
      setShowLogin(true);
    }
  }, 2000);
}, [isMounted]);
```
**Acción:** Después de 2 segundos, SIEMPRE muestra login si no se ha redirigido

---

### Paso 5: useEffect Principal - Manejo de Autenticación

**Archivo:** `src/app/home-page-content.tsx` (líneas 238-302)

**Lógica Completa:**

```typescript
useEffect(() => {
  // 1. Si ya se redirigió, NO hacer nada
  if (hasRedirectedRef.current || redirectingToRef.current) {
    console.log('⏭️ Ya redirigido, ignorando cambios de auth...');
    return;
  }

  // 2. No hacer nada hasta que esté montado
  if (!isMounted) {
    return;
  }
  
  // 3. Si hay error, mostrar login
  if (userError) {
    setShowLogin(true);
    return;
  }

  // 4. Si aún está cargando, esperar
  if (isUserLoading) {
    return;
  }
  
  // 5. Si no hay Firebase disponible, esperar
  if (!firestore || !auth) {
    return;
  }

  // 6. DECISIÓN CRÍTICA: ¿Qué hacer con el usuario?
  if (user && user.uid && !hasRedirectedRef.current) {
    // Hay usuario autenticado
    
    if (userJustLoggedInRef.current && !isProcessingRef.current) {
      // ✅ Usuario ACABA DE HACER LOGIN EXPLÍCITO
      console.log('✅ Usuario acaba de hacer login explícito, iniciando búsqueda...');
      processUser(user); // Buscar tableros y redirigir
    } else {
      // ❌ Usuario tiene sesión activa pero NO acaba de hacer login
      if (!userJustLoggedInRef.current) {
        console.log('ℹ️ Usuario con sesión activa (sin login reciente), mostrando página de inicio...');
        setShowLogin(true); // Solo mostrar login, NO buscar tableros
      }
    }
  } else if (!user && !isUserLoading) {
    // No hay usuario - mostrar login
    setShowLogin(true);
  }
}, [isMounted, user, isUserLoading, userError, firestore, auth, processUser]);
```

---

### Paso 6: Escenarios Posibles

#### **Escenario A: Usuario SIN Sesión Activa**
1. `user === null`
2. `isUserLoading === false`
3. **Acción:** `setShowLogin(true)`
4. **Resultado:** Muestra página de login con botones:
   - "Iniciar Sesión con Google"
   - "Invitado"
   - "Log in / Crear Cuenta"

#### **Escenario B: Usuario CON Sesión Activa (SIN Login Reciente)**
1. `user !== null` (tiene sesión activa)
2. `userJustLoggedInRef.current === false` (NO acaba de hacer login)
3. **Acción:** `setShowLogin(true)`
4. **Resultado:** Muestra página de login (NO busca tableros, NO redirige)

#### **Escenario C: Usuario ACABA DE HACER LOGIN EXPLÍCITO**
1. Usuario hace clic en "Iniciar Sesión con Google" (o Invitado, o Email)
2. `handleLogin` o `handleEmailAuth` se ejecuta
3. **`userJustLoggedInRef.current = true`** ✅
4. Usuario se autentica
5. `useEffect` detecta `user !== null` Y `userJustLoggedInRef.current === true`
6. **Acción:** Ejecuta `processUser(user)`

---

### Paso 7: processUser - Búsqueda de Tableros

**Archivo:** `src/app/home-page-content.tsx` (líneas 96-235)

**Verificación Inicial:**
```typescript
const processUser = useCallback(async (userToProcess: User) => {
  // CRÍTICO: Solo procesar si el usuario ACABA DE HACER LOGIN
  if (!userJustLoggedInRef.current) {
    console.log('⏭️ Usuario NO acaba de hacer login, NO procesando...');
    return; // SALIR INMEDIATAMENTE
  }
  
  // ... resto del código
}, [dependencies]);
```

**Flujo Completo:**

1. **Verificar Flag de Login**
   - Si `userJustLoggedInRef.current === false` → SALIR (no procesar)

2. **Asegurar Documento de Usuario**
   ```typescript
   await ensureUserDocument(firestore, userToProcess);
   ```
   - Crea documento en `users/{uid}` si no existe

3. **Buscar Tableros Existentes**
   ```typescript
   const boardsCollection = collection(firestore, 'users', userToProcess.uid, 'canvasBoards');
   const q = query(boardsCollection, orderBy('updatedAt', 'desc'), limit(1));
   const querySnapshot = await getDocs(q);
   ```

4. **Decisión:**
   
   **Si encuentra tableros:**
   ```typescript
   if (boardsFound && !querySnapshot.empty && querySnapshot.docs[0]) {
     const boardId = querySnapshot.docs[0].id;
     // Verificar que el tablero es válido
     if (!boardId || !boardData) {
       throw new Error('Tablero encontrado pero con datos inválidos');
     }
     // Redirigir a tablero existente
     hasRedirectedRef.current = true;
     redirectingToRef.current = boardId;
     router.push(`/board/${boardId}`); // ✅ REDIRECCIÓN
   }
   ```
   
   **Si NO encuentra tableros:**
   ```typescript
   else {
     // NO crear tablero automáticamente
     console.log('ℹ️ No se encontraron tableros existentes. Mostrando página de inicio.');
     setShowLogin(true); // Mostrar página de inicio
     toast({
       title: "¡Bienvenido/a a Mi cerebro!",
       description: "No tienes tableros aún. Puedes crear uno desde el menú cuando entres.",
     });
   }
   ```

---

### Paso 8: Renderizado Final

**Archivo:** `src/app/home-page-content.tsx` (líneas 409-467)

**Lógica de Renderizado:**

```typescript
// Si hay usuario y está redirigiendo, mostrar loading
if (user && user.uid && !showLogin && (hasRedirectedRef.current || redirectingToRef.current)) {
  return (
    <div>
      <Loader2 className="animate-spin" />
      <p>Redirigiendo a tu tablero...</p>
    </div>
  );
}

// En todos los demás casos, mostrar login
return (
  <div style={{ backgroundColor: '#00667a' }}>
    <h1 style={{ color: '#ffffff' }}>Mi cerebro</h1>
    <Button onClick={() => handleLogin('google')}>Iniciar Sesión con Google</Button>
    <Button onClick={() => handleLogin('guest')}>Invitado</Button>
    <button onClick={() => setEmailAuthDialogOpen(true)}>Log in / Crear Cuenta</button>
  </div>
);
```

---

## 🎯 RESUMEN: ¿A DÓNDE DEBE IR?

### Ruta Correcta:

1. **Usuario accede a `https://app-micerebro.web.app/`**
   - ✅ Debe mostrar página de login (NO buscar tableros)

2. **Usuario hace clic en "Iniciar Sesión" (Google/Invitado/Email)**
   - ✅ `userJustLoggedInRef.current = true`
   - ✅ Ejecuta `processUser(user)`
   - ✅ Busca tableros en `users/{uid}/canvasBoards`
   - ✅ Si encuentra → Redirige a `/board/{boardId}`
   - ✅ Si NO encuentra → Muestra página de inicio (NO crea tablero)

3. **Usuario con sesión activa accede directamente**
   - ✅ Muestra página de inicio (NO busca tableros, NO redirige)

---

## ✅ INSTRUCCIONES INTERNAS

### Instrucciones del Código:

1. **NO buscar tableros antes de autenticación**
   - Verificar `userJustLoggedInRef.current === true` antes de `processUser`

2. **NO crear tableros automáticamente**
   - Si no hay tableros, mostrar página de inicio con mensaje

3. **Solo redirigir después de login explícito**
   - Verificar flag `userJustLoggedInRef.current` en `useEffect` y `processUser`

4. **Verificar que tablero existe antes de redirigir**
   - Validar `boardId` y `boardData` antes de `router.push`

5. **Prevenir múltiples redirecciones**
   - Usar `hasRedirectedRef` y `redirectingToRef` para prevenir loops

---

**Última Actualización:** 5 de Diciembre 2024  
**Estado:** ✅ Flujo completo documentado
