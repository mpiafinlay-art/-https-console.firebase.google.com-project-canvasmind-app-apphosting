# Análisis Comparativo: Localhost vs Web

**Fecha**: $(date)  
**Objetivo**: Comparar el comportamiento del login y carga de tablero entre localhost y producción

---

## 🔍 Observaciones en la Web (Producción)

### ✅ Lo que Funciona:
1. **Firebase inicializado**: `✅ Firebase inicializado correctamente en el cliente`
2. **Login como invitado**: Usuario anónimo creado correctamente
3. **Redirección**: URL cambia a `/board/[boardId]`
4. **Peticiones de Auth**: Todas exitosas (200)

### ⚠️ Lo que NO Funciona:
1. **Tablero no se renderiza**: La página sigue mostrando login
2. **No hay peticiones a Firestore**: No se ven requests a Firestore en Network
3. **Logs faltantes**: No aparecen logs de `processUser` ni `boardStore`

---

## 📊 Comparación de Flujos

### Flujo Esperado (según código):

#### 1. Login como Invitado
```
Usuario hace clic en "Invitado"
  ↓
signInAsGuest(auth)
  ↓
onAuthStateChanged detecta usuario
  ↓
client-provider.tsx: 👤 Usuario anónimo detectado
  ↓
home-page-content.tsx: processUser(user)
  ↓
ensureUserDocument() → Firestore
  ↓
Buscar tableros existentes o crear nuevo
  ↓
Redirigir a /board/[boardId]
```

#### 2. Carga del Tablero
```
BoardPage se monta
  ↓
useEffect detecta usuario
  ↓
loadBoard(boardId, userId)
  ↓
boardStore.ts: getDoc(boardRef) → Firestore
  ↓
onSnapshot(elementsCollection) → Firestore
  ↓
Tablero renderizado
```

---

## 🔍 Análisis del Código

### `src/app/board/[boardId]/page.tsx` (Líneas 242-294)

```typescript
useEffect(() => {
  if (authLoading) return;

  // Verificar login reciente
  const hasRecentLogin = sessionStorage.getItem('hasRecentLogin') === 'true';
  const loginTimestamp = sessionStorage.getItem('loginTimestamp');
  const isLoginRecent = hasRecentLogin && loginTimestamp && (Date.now() - parseInt(loginTimestamp)) < 20000;
  
  // Si hay login reciente pero no usuario, esperar
  if (isLoginRecent && !user) {
    console.log('⏳ [BoardPage] Esperando usuario después de login...');
    // ...
  }

  // Si no hay usuario y no hay login reciente, redirigir
  if (!user && !isLoginRecent) {
    window.location.replace('/');
    return;
  }

  // Si hay usuario, cargar/crear tablero
  if (user?.uid) {
    loadBoard(boardId, userId).then((loadedBoardId) => {
      // ...
    }).catch(console.error);
  }
}, [boardId, user, authLoading, loadBoard, createBoard, cleanup, toast]);
```

**Problema potencial**: Si `user` no está disponible cuando se ejecuta este `useEffect`, se redirige a `/` antes de que el usuario se establezca.

### `src/lib/store/boardStore.ts` (Líneas 55-158)

```typescript
loadBoard: async (boardId: string, userId: string) => {
  set({ isLoading: true, error: null });
  try {
    const db = getDb();
    const boardRef = doc(db, 'users', userId, 'canvasBoards', boardId);
    const boardSnap = await getDoc(boardRef);  // ← Petición a Firestore
    
    if (!boardSnap.exists()) {
      throw new Error("El tablero no existe o no tienes permiso para verlo.");
    }
    
    // ...
    console.log('✅ [boardStore] Tablero cargado exitosamente:', { boardId, userId, boardName: boardData.name });
  } catch (error) {
    console.error("❌ [boardStore] Error al cargar el tablero:", error);
  }
}
```

**Observación**: Este código debería hacer peticiones a Firestore, pero no se ven en Network.

---

## 🐛 Posibles Causas del Problema

### 1. **Usuario no disponible cuando BoardPage se monta**
- **Síntoma**: `user` es `null` cuando se ejecuta el `useEffect`
- **Causa**: El usuario aún no se ha establecido después del redirect
- **Solución**: Esperar más tiempo o verificar `sessionStorage` antes de redirigir

### 2. **Firestore no inicializado**
- **Síntoma**: No hay peticiones a Firestore
- **Causa**: `getDb()` puede fallar o Firestore no está disponible
- **Solución**: Verificar que Firestore se inicializa correctamente

### 3. **Reglas de Firestore bloquean acceso**
- **Síntoma**: Peticiones a Firestore fallan silenciosamente
- **Causa**: Las reglas no permiten acceso a usuarios anónimos
- **Solución**: Verificar `firestore.rules`

### 4. **Timing issue con sessionStorage**
- **Síntoma**: `hasRecentLogin` no está disponible cuando se necesita
- **Causa**: El redirect puede limpiar `sessionStorage` o no se establece correctamente
- **Solución**: Verificar que `sessionStorage` se establece antes del redirect

---

## 🔧 Verificaciones Necesarias

### 1. Verificar en Consola del Navegador (Manual)
```javascript
// Abrir DevTools (F12) → Console
// Verificar:
- ¿Hay errores en rojo?
- ¿Aparece "⏳ [BoardPage] Esperando usuario después de login..."?
- ¿Aparece "✅ [boardStore] Tablero cargado exitosamente"?
- ¿Hay errores de Firestore?
```

### 2. Verificar Network Requests
```javascript
// Abrir DevTools (F12) → Network
// Filtrar por "firestore" o "firebase"
// Verificar:
- ¿Hay peticiones a Firestore?
- ¿Qué código de estado tienen? (200, 403, 404, etc.)
- ¿Hay errores CORS?
```

### 3. Verificar sessionStorage
```javascript
// Abrir DevTools (F12) → Application → Storage → Session Storage
// Verificar:
- ¿Existe "hasRecentLogin"?
- ¿Existe "loginTimestamp"?
- ¿Cuáles son sus valores?
```

### 4. Verificar Firestore Rules
```javascript
// En Firebase Console → Firestore → Rules
// Verificar que usuarios anónimos pueden leer/escribir:
match /users/{userId}/canvasBoards/{boardId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

---

## 📝 Logs Esperados vs Observados

### Logs Esperados (según código):
```
✅ Firebase inicializado correctamente en el cliente
🔐 Auth state changed: Usuario: [uid]
👤 Usuario anónimo detectado
🔄 [processUser] Iniciando...
✅ [processUser] Documento de usuario asegurado
🔍 [processUser] Buscando tableros...
➡️ [processUser] Redirigiendo a tablero existente: { boardId: '...' }
🚀 Redirigiendo a tablero: [boardId]
⏳ [BoardPage] Esperando usuario después de login... (si es necesario)
✅ [boardStore] Tablero cargado exitosamente: { boardId, userId, boardName }
```

### Logs Observados en Web:
```
✅ Firebase inicializado correctamente en el cliente
🔐 Auth state changed: Usuario: nVEpQ7CVOMZZLHSNumSXlFKnDkh2
👤 Usuario anónimo detectado
```

**Faltan**:
- ❌ Logs de `processUser`
- ❌ Logs de `boardStore`
- ❌ Logs de `BoardPage`

---

## 🎯 Hipótesis Principal

**El problema más probable**: El `useEffect` en `BoardPage` se ejecuta antes de que el usuario esté disponible, y como no hay `hasRecentLogin` en `sessionStorage`, redirige a `/` antes de que el tablero se pueda cargar.

**Evidencia**:
1. La URL cambia a `/board/[boardId]` (redirección funciona)
2. Pero luego vuelve a mostrar login (redirección de vuelta a `/`)
3. No hay peticiones a Firestore (el tablero nunca se intenta cargar)

---

## ✅ Solución Propuesta

### Opción 1: Aumentar tiempo de espera en BoardPage
```typescript
const isLoginRecent = hasRecentLogin && loginTimestamp && (Date.now() - parseInt(loginTimestamp)) < 30000; // 30 segundos en lugar de 20
```

### Opción 2: Verificar sessionStorage antes de redirigir
```typescript
// En BoardPage, antes de redirigir:
const hasRecentLogin = sessionStorage.getItem('hasRecentLogin') === 'true';
if (!user && !hasRecentLogin) {
  // Solo redirigir si realmente no hay usuario ni login reciente
  window.location.replace('/');
}
```

### Opción 3: Usar `window.location.href` en lugar de `router.replace` en home-page-content
Ya se está usando `window.location.href`, así que esto está bien.

---

## 📋 Próximos Pasos

1. **Verificar sessionStorage** en la web después del login
2. **Agregar más logs** para debugging
3. **Verificar reglas de Firestore** para usuarios anónimos
4. **Comparar timing** entre localhost y web

