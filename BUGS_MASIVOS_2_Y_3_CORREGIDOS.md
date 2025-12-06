# 🔴 BUGS MASIVOS 2 Y 3 ENCONTRADOS Y CORREGIDOS

**Fecha**: 6 de Diciembre, 2024  
**Prioridad**: 🔴 **CRÍTICA** - Estos bugs causaban errores en cascada  
**Estado**: ✅ **CORREGIDOS**

---

## 🐛 BUG MASIVO #2: Re-creaciones Infinitas de `processUser`

### Problema Identificado

**Ubicación**: `src/app/home-page-content.tsx` línea 389

**Código Problemático**:
```typescript
const processUser = useCallback(async (userToProcess: User) => {
  // ... código ...
  router.push(`/board/${boardId}`);
  toast({ ... });
}, [firestore, toast, router]); // ❌ BUG MASIVO: toast y router cambian frecuentemente
```

**Y luego en línea 516**:
```typescript
useEffect(() => {
  // ...
  processUser(user).catch(...);
}, [isMounted, user, isUserLoading, userError, firestore, auth, processUser]); 
// ❌ processUser se re-crea cada vez que toast o router cambian
```

### ¿Por Qué Es Un Bug Masivo?

1. **`toast` y `router` cambian frecuentemente**:
   - `toast` puede cambiar cuando se actualiza el contexto
   - `router` puede cambiar en cada navegación
   - Cada cambio re-crea `processUser`

2. **Re-ejecuciones infinitas del `useEffect`**:
   - `processUser` está en las dependencias del `useEffect` principal
   - Cada vez que `processUser` se re-crea, el `useEffect` se re-ejecuta
   - Esto puede causar múltiples procesamientos del mismo usuario
   - Errores en cascada

3. **Impacto**:
   - 🔴 Múltiples procesamientos del mismo usuario
   - 🔴 Re-renders infinitos
   - 🔴 Errores en cascada
   - 🔴 Aplicación inestable

---

## 🐛 BUG MASIVO #3: Listeners Duplicados en `boardStore.ts`

### Problema Identificado

**Ubicación**: `src/lib/store/boardStore.ts` líneas 109-133

**Código Problemático**:
```typescript
unsubscribe = onSnapshot(
  elementsQuery,
  (snapshot) => { ... },
  (error) => {
    // ❌ BUG MASIVO: Crear nuevo listener sin limpiar el anterior
    const fallbackUnsubscribe = onSnapshot(
      elementsCollection,
      (snapshot) => { ... },
      (fallbackError) => { ... }
    );
    set({ unsubscribeElements: fallbackUnsubscribe });
    // ❌ El listener original (unsubscribe) NO se limpia
  }
);
```

### ¿Por Qué Es Un Bug Masivo?

1. **Listeners duplicados activos simultáneamente**:
   - Cuando falla `orderBy`, se crea un nuevo listener
   - El listener original NO se limpia
   - Resultado: **2 listeners activos simultáneamente** escuchando los mismos datos

2. **Efectos en cascada**:
   - Cada listener dispara actualizaciones de estado
   - Re-renders duplicados
   - Memory leaks
   - Saturación del servidor

3. **Impacto**:
   - 🔴 Múltiples listeners activos simultáneamente
   - 🔴 Re-renders duplicados
   - 🔴 Memory leaks
   - 🔴 Saturación del servidor

---

## ✅ SOLUCIONES IMPLEMENTADAS

### Solución #2: Usar Refs para `router` y `toast` en `processUser`

**Cambios**:
1. Agregados refs para `router` y `toast`
2. Uso de refs en lugar de valores directos dentro de `processUser`
3. Removidos `toast` y `router` de dependencias de `useCallback`

**Código**:
```typescript
// Agregar refs
const routerRef = useRef(router);
const toastRef = useRef(toast);

useEffect(() => {
  routerRef.current = router;
  toastRef.current = toast;
}, [router, toast]);

// Usar refs en processUser
const processUser = useCallback(async (userToProcess: User) => {
  // ...
  routerRef.current.push(`/board/${boardId}`);
  toastRef.current({ ... });
}, [firestore]); // ✅ Solo firestore en dependencias
```

### Solución #3: Limpiar Listener Anterior Antes de Crear Nuevo

**Cambios**:
1. Limpiar el listener anterior antes de crear el fallback
2. Asegurar que solo hay un listener activo a la vez

**Código**:
```typescript
(error) => {
  console.error("Error en listener de elementos:", error);
  // ✅ CRÍTICO: Limpiar el listener anterior antes de crear uno nuevo
  if (unsubscribe) {
    unsubscribe();
  }
  // Ahora crear el fallback
  const fallbackUnsubscribe = onSnapshot(...);
  set({ unsubscribeElements: fallbackUnsubscribe });
}
```

---

## 📋 Archivos Modificados

### `src/app/home-page-content.tsx`

**Cambios**:
1. ✅ Agregados `routerRef` y `toastRef`
2. ✅ Agregado `useEffect` para actualizar refs
3. ✅ Reemplazados todos los usos de `router` y `toast` por refs en `processUser`
4. ✅ Removidos `toast` y `router` de dependencias de `useCallback`

### `src/lib/store/boardStore.ts`

**Cambios**:
1. ✅ Agregada limpieza del listener anterior antes de crear fallback
2. ✅ Asegurar que solo hay un listener activo a la vez

---

## ✅ Resultado Esperado

### Antes:
- ❌ `processUser` se re-creaba constantemente
- ❌ Re-ejecuciones infinitas del `useEffect` principal
- ❌ Múltiples procesamientos del mismo usuario
- ❌ Listeners duplicados activos simultáneamente
- ❌ Re-renders duplicados
- ❌ Memory leaks

### Después:
- ✅ `processUser` solo se re-crea cuando `firestore` cambia
- ✅ `useEffect` se ejecuta solo cuando es necesario
- ✅ Un solo procesamiento por usuario
- ✅ Solo un listener activo a la vez
- ✅ Sin re-renders duplicados
- ✅ Sin memory leaks

---

## 🔍 Verificación

### Cómo Verificar que Están Corregidos:

1. **Abrir DevTools → Performance**:
   - No debería haber picos constantes de CPU
   - No debería haber memory leaks crecientes

2. **Abrir DevTools → Network → WS (WebSockets)**:
   - Debería haber solo las conexiones necesarias
   - No debería haber conexiones duplicadas

3. **Monitorear Firebase Console**:
   - No debería haber lecturas duplicadas
   - El uso debería ser normal

---

## 📝 Lecciones Aprendidas

### Reglas de Oro:

1. **NUNCA incluir `router` o `toast` en dependencias de `useCallback` o `useEffect`**:
   - Usar refs en su lugar
   - Actualizar refs cuando cambian

2. **SIEMPRE limpiar listeners anteriores antes de crear nuevos**:
   - Especialmente en callbacks de error
   - Asegurar que solo hay un listener activo a la vez

3. **Minimizar dependencias de `useCallback` y `useEffect`**:
   - Solo incluir dependencias esenciales
   - Usar refs para valores que cambian frecuentemente

---

**✅ BUGS MASIVOS 2 Y 3 CORREGIDOS!**

Estos bugs estaban causando errores en cascada. Ahora la aplicación debería ser mucho más estable.

