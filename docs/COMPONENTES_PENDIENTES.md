# Componentes y Funcionalidades Pendientes

Este documento lista los componentes y funcionalidades mencionados en la documentación pero que aún no están implementados o están deshabilitados.

---

## 🔴 Componentes Faltantes

### 1. `TextCorrectionDialog.tsx`
- **Mencionado en:** `Readme_encabezadocuaderno18` (línea 52-56)
- **Función:** Diálogo para mostrar corrección de texto con IA
- **Referencia:** Botón "Mejorar Texto con IA" (`Wand`) en el encabezado del cuaderno
- **Estado:** ❌ NO IMPLEMENTADO
- **Ubicación esperada:** `src/components/canvas/elements/text-correction-dialog.tsx`
- **Prioridad:** Media (funcionalidad de IA avanzada)

### 2. `moodboard-element.tsx`
- **Mencionado en:** `src/lib/types.ts` (línea 164-165)
- **Estado actual:** Solo existe un placeholder en `board-content.tsx` (línea 62)
- **Código actual:**
  ```typescript
  moodboard: (props) => <div>Moodboard Element</div>, // Placeholder
  ```
- **Estado:** ⚠️ PLACEHOLDER (no implementado)
- **Ubicación esperada:** `src/components/canvas/elements/moodboard-element.tsx`
- **Prioridad:** Media (funcionalidad mencionada en Plan 2 pero deshabilitada)

---

## 🟡 Flujos de IA Faltantes

La carpeta `src/ai/flows/` existe pero está **VACÍA**. Los siguientes flujos están mencionados en los planes estratégicos pero no están implementados:

### 1. `organize-text-flow.ts`
- **Mencionado en:** `PLAN_1.md`
- **Función:** Analiza texto y genera resumen, lista de tareas y mapa mental
- **Estado:** ❌ NO IMPLEMENTADO
- **Prioridad:** Baja (Plan estratégico futuro)

### 2. `moodboard-flow.ts`
- **Mencionado en:** `PLAN_2.md`
- **Función:** Web scraping + análisis IA para generar moodboards desde URL
- **Estado:** ❌ NO IMPLEMENTADO
- **Nota:** El diálogo `add-moodboard-from-url-dialog.tsx` existe pero está deshabilitado
- **Prioridad:** Media (diálogo ya existe, solo falta el flujo)

### 3. `organize-braindump-flow.ts`
- **Mencionado en:** `PLAN_4.md`
- **Función:** Organiza y estructura contenido desordenado de cuadernos
- **Estado:** ❌ NO IMPLEMENTADO
- **Prioridad:** Baja (Plan estratégico futuro)

### 4. `search-flow.ts`
- **Mencionado en:** `PLAN_3.md`
- **Función:** Búsqueda semántica universal con embeddings
- **Estado:** ❌ NO IMPLEMENTADO
- **Prioridad:** Baja (requiere extensión de Firebase)

---

## 🟢 Funcionalidades Deshabilitadas

### 1. Exportación a PNG de Cuadernos
- **Ubicación:** `src/components/canvas/elements/notepad-element.tsx`
- **Estado:** ⚠️ DESHABILITADA (código comentado)
- **Razón:** Dependencia de `html-to-image` comentada
- **Código:** Líneas 225-253 en la versión completa
- **Prioridad:** Baja (funcionalidad opcional)

### 2. Moodboard desde URL
- **Ubicación:** `src/components/canvas/elements/add-moodboard-from-url-dialog.tsx`
- **Estado:** ⚠️ DESHABILITADA (toast de "Función no disponible")
- **Razón:** Falta implementar el flujo de IA correspondiente
- **Prioridad:** Media (diálogo ya existe)

---

## 📋 Recomendaciones

### Prioridad Alta:
- ✅ **Completado:** Consolidación de archivos duplicados
- ✅ **Completado:** Reemplazo de `notepad-element.tsx` con versión completa

### Prioridad Media:
1. **Implementar `moodboard-element.tsx`:**
   - Crear componente básico para reemplazar el placeholder
   - O documentar que está pendiente del Plan 2

2. **Habilitar Moodboard desde URL:**
   - Implementar `moodboard-flow.ts` básico
   - O documentar que requiere implementación completa del Plan 2

### Prioridad Baja:
3. **Implementar flujos de IA:**
   - Estos son planes estratégicos futuros
   - Documentar que están pendientes de implementación
   - Considerar crear placeholders o stubs si se necesita la estructura

4. **TextCorrectionDialog:**
   - Solo necesario si se implementa la funcionalidad de corrección con IA
   - Puede esperar hasta que se implemente el flujo correspondiente

---

## 📝 Notas de Implementación

### Para `moodboard-element.tsx`:
- Debe aceptar `CommonElementProps`
- Debe renderizar un collage de imágenes
- Debe mostrar paleta de colores y keywords si están disponibles
- Ver `PLAN_2.md` para detalles de implementación

### Para los flujos de IA:
- Requieren configuración de Genkit
- Requieren acceso a modelos de IA (Gemini)
- Ver los planes correspondientes para detalles técnicos

---

**Última actualización:** $(date)
**Estado:** Archivos duplicados consolidados ✅ | Componentes pendientes documentados ✅

