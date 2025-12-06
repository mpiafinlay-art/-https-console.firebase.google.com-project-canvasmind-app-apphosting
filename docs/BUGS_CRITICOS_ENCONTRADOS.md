# Bugs Críticos Encontrados - 6 Diciembre 2024

## 🔴 PROBLEMAS CRÍTICOS QUE DESTRUYEN LA APP

### 1. **useEffect DUPLICADOS Y CONFLICTIVOS** (CRÍTICO)
**Archivo**: `src/app/board/[boardId]/page.tsx`

**Problema**:
- Líneas 279-315: useEffect que verifica login reciente
- Líneas 318-458: useEffect que carga/crea tablero
- **AMBOS se ejecutan cuando cambia `user` o `authLoading`**
- **CAUSAN LOOPS INFINITOS Y LLAMADOS DUPLICADOS**

**Impacto**: 🔴 CRÍTICO - La app se autodestruye con loops infinitos

### 2. **LLAMADOS DUPLICADOS A loadBoard/createBoard** (CRÍTICO)
**Archivo**: `src/app/board/[boardId]/page.tsx`

**Problema**:
- `loadBoard` se llama múltiples veces por los useEffect duplicados
- `createBoard` se llama múltiples veces
- Cada llamada crea listeners de Firebase
- **CAUSA SATURACIÓN DEL SERVIDOR Y MEMORY LEAKS**

**Impacto**: 🔴 CRÍTICO - Satura Firebase y causa crashes

### 3. **LISTENERS DUPLICADOS DE FIRESTORE** (CRÍTICO)
**Archivos**: 
- `src/lib/store/boardStore.ts` - Crea listener de elements
- `src/hooks/use-board-state.ts` - Crea listener de board
- **AMBOS pueden ejecutarse simultáneamente**

**Problema**:
- Múltiples `onSnapshot` activos para el mismo board
- Cada cambio en Firestore dispara múltiples actualizaciones
- **CAUSA RE-RENDERS INFINITOS Y SATURACIÓN**

**Impacto**: 🔴 CRÍTICO - Satura Firebase y causa crashes

### 4. **sessionStorage EXCESIVO Y CONFLICTIVO** (ALTO)
**Archivos**: 82 matches en 5 archivos

**Problema**:
- Múltiples archivos escriben/leen sessionStorage
- Flags conflictivos: `hasRecentLogin`, `loginTimestamp`, `redirectingToBoard`
- **CAUSA RACE CONDITIONS Y ESTADOS INCONSISTENTES**

**Impacto**: 🟡 ALTO - Causa redirecciones incorrectas

### 5. **window.location MÚLTIPLE** (ALTO)
**Archivos**: 20 matches en 8 archivos

**Problema**:
- Múltiples redirects simultáneos
- `window.location.href` y `window.location.replace` mezclados
- **CAUSA REDIRECTS MÚLTIPLES Y PÉRDIDA DE ESTADO**

**Impacto**: 🟡 ALTO - Causa pérdida de estado y loops de redirect

### 6. **setTimeout SIN CLEANUP** (MEDIO)
**Archivo**: `src/app/board/[boardId]/page.tsx`

**Problema**:
- Línea 361: `setTimeout` que puede no limpiarse si el componente se desmonta
- **CAUSA MEMORY LEAKS Y COMPORTAMIENTO IMPREDECIBLE**

**Impacto**: 🟡 MEDIO - Memory leaks

## ✅ SOLUCIONES REQUERIDAS

### 1. CONSOLIDAR useEffect EN page.tsx
- **UN SOLO useEffect** para manejar login y carga de tablero
- Usar refs para prevenir múltiples ejecuciones
- Cleanup adecuado de timeouts

### 2. PREVENIR LLAMADOS DUPLICADOS
- Usar refs para rastrear si ya se llamó `loadBoard`/`createBoard`
- Marcar como "en proceso" antes de llamar
- Cleanup de listeners anteriores

### 3. ELIMINAR LISTENERS DUPLICADOS
- `useBoardStore` debe ser la ÚNICA fuente de listeners de elements
- `use-board-state` solo debe escuchar cambios de board (nombre, etc.)
- Verificar que no haya listeners duplicados

### 4. SIMPLIFICAR sessionStorage
- **UN SOLO archivo** debe manejar sessionStorage
- Flags claros y únicos
- Cleanup adecuado

### 5. UNIFICAR REDIRECTS
- **UN SOLO método** de redirect
- Prevenir redirects múltiples con flags

