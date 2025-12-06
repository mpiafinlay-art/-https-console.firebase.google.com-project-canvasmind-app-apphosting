# Reporte de Archivos Faltantes y Dañados en CanvasMind

Este documento identifica archivos faltantes, duplicados o dañados en la estructura del proyecto, basado en la documentación y referencias en el código.

---

## 🔴 PROBLEMAS CRÍTICOS

### 1. Archivos Duplicados

#### a) `notepad-element.tsx` (DUPLICADO)
- **Ubicación 1:** `src/components/canvas/notepad-element.tsx`
  - Usa `NotepadElementProps` (tipo personalizado)
  - Más completo, con todas las funcionalidades mencionadas en la documentación
  - Tiene exportación a PDF/PNG, formato, etc.
  
- **Ubicación 2:** `src/components/canvas/elements/notepad-element.tsx`
  - Usa `CommonElementProps`
  - Versión simplificada, solo con paginación básica
  
**Problema:** Hay dos implementaciones diferentes del mismo componente. Esto puede causar confusión y errores de importación.

**Recomendación:** 
- ✅ **VERIFICADO:** Se está usando `src/components/canvas/elements/notepad-element.tsx` (versión simplificada)
  - `board-content.tsx` importa desde `@/components/canvas/elements/notepad-element`
  - `transformable-element.tsx` importa desde `./elements/notepad-element`
- ⚠️ **ACCIÓN REQUERIDA:** El archivo `src/components/canvas/notepad-element.tsx` parece ser una versión más completa pero NO se está usando. Debería:
  - Eliminarse si no se necesita, O
  - Reemplazar la versión en `elements/` si tiene funcionalidades importantes que faltan

#### b) `formatting-toolbar.tsx` (DUPLICADO)
- **Ubicación 1:** `src/components/canvas/formatting-toolbar.tsx`
  - Versión más completa con props específicas
  
- **Ubicación 2:** `src/components/canvas/elements/formatting-toolbar.tsx`
  - Versión similar pero posiblemente diferente
  
**Problema:** Dos archivos con el mismo nombre pueden causar conflictos de importación.

**Recomendación:** 
- ✅ **VERIFICADO:** Se están usando AMBOS archivos:
  - `board-content.tsx` usa `@/components/canvas/formatting-toolbar.tsx`
  - `tools-sidebar.tsx` usa `./elements/formatting-toolbar.tsx`
- ⚠️ **PROBLEMA:** Dos componentes diferentes con el mismo nombre pueden causar confusión
- **ACCIÓN REQUERIDA:** 
  - Verificar si ambas versiones son necesarias o si una puede consolidarse
  - Si ambas son necesarias, considerar renombrar uno (ej: `formatting-toolbar-mobile.tsx`)

---

## 🟡 ARCHIVOS FALTANTES (Mencionados en Documentación)

### 1. `TextCorrectionDialog.tsx`
- **Mencionado en:** `Readme_encabezadocuaderno18` (línea 52-56)
- **Función:** Diálogo para mostrar corrección de texto con IA
- **Referencia:** Botón "Mejorar Texto con IA" (`Wand`) en el encabezado del cuaderno
- **Estado:** ❌ NO EXISTE

**Ubicación esperada:** `src/components/canvas/elements/text-correction-dialog.tsx` o similar

### 2. `moodboard-element.tsx`
- **Mencionado en:** `src/lib/types.ts` (línea 164-165)
- **Estado actual:** Solo existe un placeholder en `board-content.tsx` (línea 62)
- **Código actual:**
  ```typescript
  moodboard: (props) => <div>Moodboard Element</div>, // Placeholder
  ```
- **Estado:** ⚠️ PLACEHOLDER (no implementado)

**Ubicación esperada:** `src/components/canvas/elements/moodboard-element.tsx`

### 3. Flujos de IA (`src/ai/flows/`)
- **Mencionados en:** `PLAN_1.md`, `PLAN_2.md`, `PLAN_4.md`
- **Estado:** La carpeta `src/ai/flows/` existe pero está **VACÍA**

**Archivos faltantes:**
- `organize-text-flow.ts` (Plan 1)
- `moodboard-flow.ts` (Plan 2)
- `organize-braindump-flow.ts` (Plan 4)
- `search-flow.ts` (Plan 3 - búsqueda semántica)

---

## 🟢 ARCHIVOS CON IMPLEMENTACIÓN INCOMPLETA

### 1. `add-moodboard-from-url-dialog.tsx`
- **Ubicación:** `src/components/canvas/elements/add-moodboard-from-url-dialog.tsx`
- **Estado:** ✅ EXISTE pero está **DESHABILITADO**
- **Código relevante:**
  ```typescript
  toast({
      title: "Función no disponible",
      description: "La creación de Moodboards desde URL se encuentra temporalmente deshabilitada.",
  });
  ```
- **Problema:** El diálogo existe pero la funcionalidad está deshabilitada

### 2. Carpeta `drawing/` vacía
- **Ubicación:** `src/components/canvas/elements/drawing/`
- **Estado:** Carpeta existe pero está **VACÍA**
- **Nota:** `drawing-element.tsx` existe en el directorio padre, pero la carpeta `drawing/` sugiere que podría haber más archivos relacionados

---

## 📋 VERIFICACIÓN DE IMPORTS

### Imports que podrían estar rotos:

1. **En `board-content.tsx`:**
   - `FormattingToolbar` - podría importar el archivo incorrecto si hay duplicados
   - `ResizeHandle` - verificar que existe

2. **En `notepad-element.tsx` (cualquiera de los dos):**
   - Funciones mencionadas en la documentación pero no encontradas:
     - `onExportNotepadToPdf`
     - `onExportNotepadToPng`
     - `onAiCorrect` (para el botón Wand)
     - `TextCorrectionDialog`

3. **En `tools-sidebar.tsx`:**
   - `onAddMoodboardFromUrl` - existe el diálogo pero está deshabilitado

---

## 🔧 RECOMENDACIONES DE ACCIÓN

### Prioridad Alta:
1. ✅ **Resolver duplicados:**
   - Decidir cuál versión de `notepad-element.tsx` usar
   - Decidir cuál versión de `formatting-toolbar.tsx` usar
   - Eliminar o consolidar los duplicados

2. ✅ **Verificar imports:**
   - Revisar todos los imports de `notepad-element` y `formatting-toolbar`
   - Asegurar que apuntan al archivo correcto

### Prioridad Media:
3. ⚠️ **Implementar componentes faltantes:**
   - Crear `moodboard-element.tsx` (o mantener placeholder si no es necesario)
   - Crear `TextCorrectionDialog.tsx` si se va a usar la funcionalidad de IA

4. ⚠️ **Implementar flujos de IA:**
   - Crear los flujos mencionados en los planes si se van a implementar
   - O documentar que están pendientes

### Prioridad Baja:
5. 📝 **Documentar estado:**
   - Documentar qué funcionalidades están deshabilitadas temporalmente
   - Documentar qué componentes son placeholders

---

## 📊 RESUMEN

| Tipo | Cantidad | Estado |
|------|----------|--------|
| Archivos duplicados | 2 | 🔴 Crítico |
| Archivos faltantes (docs) | 3 | 🟡 Importante |
| Archivos deshabilitados | 1 | 🟢 Funcional pero limitado |
| Carpetas vacías | 1 | 🟢 Menor prioridad |

---

**Fecha de verificación:** $(date)
**Última actualización:** $(date)

---

## ✅ ACCIONES COMPLETADAS

### Consolidación de Archivos Duplicados (Completado)

1. **`notepad-element.tsx`:**
   - ✅ Reemplazado `elements/notepad-element.tsx` con la versión completa de `canvas/notepad-element.tsx`
   - ✅ Adaptado para usar `CommonElementProps` en lugar de `NotepadElementProps`
   - ✅ Cambiado `onDelete` → `deleteElement` para compatibilidad
   - ✅ Eliminado `canvas/notepad-element.tsx` (duplicado no usado)

2. **`formatting-toolbar.tsx`:**
   - ✅ Actualizado `tools-sidebar.tsx` para usar `canvas/formatting-toolbar.tsx`
   - ✅ Eliminado `elements/formatting-toolbar.tsx` (duplicado)

### Documentación Creada

- ✅ Creado `docs/COMPONENTES_PENDIENTES.md` con lista completa de componentes faltantes y funcionalidades deshabilitadas

---

## 📊 ESTADO ACTUAL

| Tipo | Estado |
|------|--------|
| Archivos duplicados | ✅ Resueltos |
| Archivos faltantes (docs) | 📝 Documentados |
| Archivos deshabilitados | 📝 Documentados |
| Consolidación | ✅ Completada |

