# LISTA COMPLETA DE ERRORES - 6 Diciembre 2024

## 🔴 PROBLEMAS CRÍTICOS QUE DESTRUYEN LA APP

### 1. **useEffect DUPLICADOS Y CONFLICTIVOS** (CRÍTICO)
**Archivo**: `src/app/board/[boardId]/page.tsx`
- Líneas 279-315: useEffect que verifica login reciente
- Líneas 318-458: useEffect que carga/crea tablero
- **AMBOS se ejecutan cuando cambia `user` o `authLoading`**
- **CAUSAN LOOPS INFINITOS Y LLAMADOS DUPLICADOS**

### 2. **LLAMADOS DUPLICADOS A loadBoard/createBoard** (CRÍTICO)
**Archivo**: `src/app/board/[boardId]/page.tsx`
- `loadBoard` se llama múltiples veces por los useEffect duplicados
- `createBoard` se llama múltiples veces
- Cada llamada crea listeners de Firebase
- **CAUSA SATURACIÓN DEL SERVIDOR Y MEMORY LEAKS**

### 3. **LISTENERS DUPLICADOS DE FIRESTORE** (CRÍTICO)
**Archivos**: 
- `src/lib/store/boardStore.ts` - Crea listener de elements
- `src/hooks/use-board-state.ts` - Crea listener de board
- **AMBOS pueden ejecutarse simultáneamente**
- Múltiples `onSnapshot` activos para el mismo board
- **CAUSA RE-RENDERS INFINITOS Y SATURACIÓN**

### 4. **sessionStorage EXCESIVO Y CONFLICTIVO** (ALTO)
- 82 matches en 5 archivos
- Múltiples archivos escriben/leen sessionStorage
- Flags conflictivos: `hasRecentLogin`, `loginTimestamp`, `redirectingToBoard`
- **CAUSA RACE CONDITIONS Y ESTADOS INCONSISTENTES**

### 5. **window.location MÚLTIPLE** (ALTO)
- 20 matches en 8 archivos
- Múltiples redirects simultáneos
- `window.location.href` y `window.location.replace` mezclados
- **CAUSA REDIRECTS MÚLTIPLES Y PÉRDIDA DE ESTADO**

### 6. **setTimeout SIN CLEANUP** (MEDIO)
**Archivo**: `src/app/board/[boardId]/page.tsx`
- `setTimeout` que puede no limpiarse si el componente se desmonta
- **CAUSA MEMORY LEAKS Y COMPORTAMIENTO IMPREDECIBLE**

---



### 9. **No se puede dictar**
- **Causa**: `insertDictationTextToContentEditable` no se ejecuta correctamente
- **Archivo**: `src/components/canvas/elements/accordion-element.tsx` - `EditableContent`
- **Línea**: ~300-310

### 10. **No se guarda automáticamente**
- **Causa**: `debounceMs` muy alto o `onSave` no se ejecuta
- **Archivo**: `src/components/canvas/elements/accordion-element.tsx` - `EditableContent`
- **Línea**: ~269-278

---

## 🔴 EXPORTAR PNG TABLERO

### 11. **Debe exportar solo área visible**
- **Estado**: Parcialmente corregido
- **Archivo**: `src/app/board/[boardId]/page.tsx`
- **Línea**: ~442-457
- **Problema**: Usa `window.innerWidth/Height` pero debería usar viewport del canvas


---

## 🔴 MENÚ FORMATO

### 13. **Botón Pincel - Color desaparece**
- **Causa**: `applyTextColor` solo funciona con selección, no persiste en elemento
- **Archivo**: `src/components/canvas/formatting-toolbar.tsx`
- **Línea**: ~161-173
- **Problema**: Necesita aplicar color al elemento completo, no solo selección

### 14. **Botón Enlace - Campo de texto**
- **Estado**: Mejorado con Dialog
- **Archivo**: `src/components/canvas/formatting-toolbar.tsx`
- **Verificar**: Que funcione correctamente

---

## 🔴 CAMPOS EDITABLES - CURSOR VUELVE AL INICIO

### 15. **text-element.tsx** - Cursor vuelve al inicio
- **Causa**: `useEffect` que actualiza `innerHTML` se ejecuta incluso cuando está enfocado
- **Estado**: Parcialmente corregido (verificación `isFocused` agregada)

### 16. **sticky-note-element.tsx** - Cursor vuelve al inicio
- **Causa**: `useEffect` que actualiza `innerHTML` se ejecuta incluso cuando está enfocado
- **Estado**: Parcialmente corregido (verificación `isFocused` agregada)

### 17. **notepad-element.tsx** - Cursor vuelve al inicio
- **Causa**: `useEffect` que actualiza `innerHTML` se ejecuta incluso cuando está enfocado
- **Estado**: Parcialmente corregido (verificación `isFocused` agregada)

### 18. **tabbed-notepad-element.tsx** - Cursor vuelve al inicio
- **Causa**: `useEffect` que actualiza `innerHTML` se ejecuta incluso cuando está enfocado
- **Estado**: ❌ NO CORREGIDO


### 20. **comment-element.tsx** - no funciona

---

## 🔴 MENÚ PRINCIPAL - BOTÓN TEXTO

### 21. **Paleta de color para fondo**
- **Estado**: Parcialmente implementado
- **Archivo**: `src/components/canvas/tools-sidebar.tsx`
- **Línea**: ~472-480
- **Problema**: Popover agregado pero necesita verificar que funcione

### 22. **Cronometro y temporizador Debe poder arrastrarse**
- **Estado**: Pendiente verificar




---

## 🔴 ERRORES DE TIPOS Y CÓDIGO

### 27. **ABUSO MASIVO DE `any` (25 archivos afectados)**
- `src/lib/types.ts` - `properties?: any`, `content?: any`
- `src/hooks/use-element-manager.ts` - `const stickyElement: any`
- `src/lib/store/boardStore.ts` - `(boardData as any).userId`
- **Impacto**: Errores silenciosos en runtime, pérdida de autocompletado

### 28. **Props Faltantes o Mal Tipadas**
- `CommonElementProps` - Props faltantes
- **Archivo**: `src/lib/types.ts`

---

## 🔴 ERRORES DE BUILD Y DEPLOY

### 29. **Error de Build: `outputFileTracingRoot`**
- **Archivo**: `next.config.mjs`
- **Problema**: `outputFileTracingRoot` no es reconocido en Next.js 14.2.33
- **Estado**: ✅ Corregido (removido)

### 30. **Configuración Webpack Compleja**
- **Archivo**: `next.config.mjs`
- **Problema**: `splitChunks` personalizado causaba referencias a chunks antiguos
- **Estado**: ✅ Corregido (simplificado)

### 31. **Cache Corrupto**
- **Problema**: `.next` y `out` con referencias a chunks antiguos
- **Estado**: ✅ Corregido (limpieza completa)

---

## 🔴 ERRORES DE RUNTIME

### 32. **Error "Element not found" línea 412**
- **Archivo**: `src/app/board/[boardId]/page.tsx`
- **Descripción**: Error al cargar tablero después de login como invitado
- **Estado**: ⚠️ Investigando

### 33. **Chunk Antiguo en Navegador**
- **Problema**: Navegador intenta cargar `vendor-2fbb147726884f21.js` (no existe)
- **Causa**: Cache del navegador o Service Worker
- **Estado**: ⚠️ Pendiente

--

---

**Fecha**: 6 de Diciembre 2024
**Última actualización**: 6 Dic 2024

