# 📋 PLAN DE ACCIÓN - 6 de Diciembre 2024

## 🎯 OBJETIVO: Arreglar todos los problemas críticos y pendientes

## ✅ COMPLETADOS HOY (6 Dic - 23:45):

### ✅ TAREA COMPLETADA: Dictado Español Latinoamericano
- **Estado**: ✅ Completado
- **Archivo**: `src/hooks/use-dictation.ts`
- **Cambio**: `recognition.lang = 'es-MX'`
- **Resultado**: Dictado funciona en español latinoamericano

### ✅ TAREA COMPLETADA: Guardado Infinito
- **Estado**: ✅ Completado
- **Archivos modificados**:
  - `src/hooks/use-auto-save.ts` - Normalización de contenido
  - `src/components/canvas/elements/text-element.tsx`
  - `src/components/canvas/elements/sticky-note-element.tsx`
  - `src/components/canvas/elements/accordion-element.tsx`
  - `src/components/canvas/elements/notepad-element.tsx`
  - `src/components/canvas/elements/super-notebook-element.tsx`
- **Resultado**: Guardado infinito solucionado, todos los elementos guardan correctamente

---

## FASE 1: PROBLEMAS CRÍTICOS (2 horas)

### ✅ TAREA 1.1: Cursor vuelve al inicio - TODOS los campos
**Tiempo**: 45 minutos
**Archivos**:
- [ ] `src/components/canvas/elements/tabbed-notepad-element.tsx`
- [ ] `src/components/canvas/elements/super-notebook-element.tsx`
- [ ] `src/components/canvas/elements/comment-element.tsx`
- [ ] Mejorar `src/components/canvas/elements/accordion-element.tsx`

**Código a aplicar**:
```typescript
useEffect(() => {
  if (editorRef.current && value !== editorRef.current.innerHTML) {
    const isFocused = document.activeElement === editorRef.current;
    if (!isFocused) {
      // Guardar cursor antes de actualizar
      const selection = window.getSelection();
      let savedRange = null;
      if (selection && selection.rangeCount > 0) {
        savedRange = selection.getRangeAt(0).cloneRange();
      }
      
      editorRef.current.innerHTML = value || '';
      
      // Restaurar cursor
      if (savedRange && editorRef.current.firstChild) {
        try {
          const textNode = editorRef.current.firstChild;
          if (textNode.nodeType === Node.TEXT_NODE) {
            const maxPos = textNode.textContent?.length || 0;
            const newPos = Math.min(savedRange.startOffset, maxPos);
            const newRange = document.createRange();
            newRange.setStart(textNode, newPos);
            newRange.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(newRange);
          }
        } catch (e) {}
      }
    }
  }
}, [value]);
```

---

### ✅ TAREA 1.2: Acordeón - Arreglar completamente
**Tiempo**: 30 minutos

#### 1.2.1 Arrastrar
- [ ] Agregar `drag-handle` a Card principal
- [ ] Verificar que Rnd funcione correctamente

#### 1.2.2 Dictado
- [ ] Verificar que `isListening` y `liveTranscript` se pasen
- [ ] Verificar que `insertDictationTextToContentEditable` se ejecute
- [ ] Probar dictado en título y contenido

#### 1.2.3 Guardado automático
- [ ] Reducir `debounceMs` a 500ms
- [ ] Verificar que `onUpdate` se ejecute
- [ ] Probar que se guarde en Firestore

---

### ✅ TAREA 1.3: Exportar PNG - Área visible + 30% menos
**Tiempo**: 20 minutos
**Archivo**: `src/app/board/[boardId]/page.tsx`

**Código**:
```typescript
// Obtener viewport del canvas
const canvasViewport = canvasContainer.getBoundingClientRect();
const scrollLeft = canvasContainer.scrollLeft;
const scrollTop = canvasContainer.scrollTop;

const canvas = await html2canvas(canvasContainer, {
  backgroundColor: '#b7ddda',
  scale: 2.1, // 30% menos que 3x
  useCORS: true,
  x: scrollLeft,
  y: scrollTop,
  width: window.innerWidth,
  height: window.innerHeight,
});
```

---

### ✅ TAREA 1.4: Botón Pincel - Color persiste
**Tiempo**: 15 minutos
**Archivo**: `src/components/canvas/formatting-toolbar.tsx`

**Código mejorado** (ya aplicado parcialmente):
- Aplicar color al elemento completo si no hay selección
- Guardar en `properties.color` del elemento
- Disparar evento input para guardar

---

## FASE 2: ALTA PRIORIDAD (1.5 horas)

### ✅ TAREA 2.1: Menú Formato - Verificar enlace
**Tiempo**: 10 minutos
- [ ] Probar que Dialog se abre
- [ ] Probar que URL se inserta correctamente
- [ ] Probar que enlace es clickeable

---

### ✅ TAREA 2.2: Botón Texto - Paleta de color
**Tiempo**: 15 minutos
- [ ] Verificar que Popover funciona
- [ ] Verificar que `handleAddElement` acepta `properties.backgroundColor`
- [ ] Probar que texto se crea con color de fondo

---

### ✅ TAREA 2.3: Autoguardado - Verificar todos
**Tiempo**: 30 minutos
- [ ] `todo-list-element.tsx` - Verificar useAutoSave
- [ ] `comment-element.tsx` - Verificar useAutoSave
- [ ] Todos los elementos - Verificar que guardan

---

### ✅ TAREA 2.4: Contenedor - Guardar elementos
**Tiempo**: 20 minutos
- [ ] Verificar que `onUpdate` se ejecuta al agregar elementos
- [ ] Verificar que `elementIds` se guarda en Firestore
- [ ] Probar agregar cuaderno a contenedor

---

## FASE 3: TESTING Y DEPLOY (1 hora)

### ✅ TAREA 3.1: Testing completo
**Tiempo**: 30 minutos
- [ ] Login Google funciona
- [ ] Login invitado funciona
- [ ] Redirección a tableros funciona
- [ ] Todos los elementos se arrastran
- [ ] Dictado funciona en todos los campos
- [ ] Cursor NO vuelve al inicio
- [ ] Autoguardado funciona
- [ ] Exportar PNG funciona

### ✅ TAREA 3.2: Build y Deploy
**Tiempo**: 30 minutos
```bash
npm run build
firebase deploy --only hosting:app-micerebro
```

---

## 📊 CHECKLIST FINAL:

### Críticos:
- [ ] Cursor NO vuelve al inicio (todos los campos)
- [ ] Acordeón se puede arrastrar
- [ ] Acordeón dictado funciona
- [ ] Acordeón guarda automáticamente
- [ ] Exportar PNG captura área visible
- [ ] Exportar PNG tamaño reducido 30%
- [ ] Botón pincel color persiste

### Alta Prioridad:
- [ ] Botón enlace funciona
- [ ] Botón texto tiene paleta
- [ ] Autoguardado verificado
- [ ] Contenedor guarda elementos

### Verificación:
- [ ] Build sin errores
- [ ] Deploy exitoso
- [ ] App funciona en producción

---

## 🚨 PROBLEMAS CONOCIDOS A EVITAR:

1. **NO usar `parentId: undefined`** - Usar `null` en su lugar
2. **NO actualizar `innerHTML` si campo está enfocado** - Verificar `isFocused`
3. **NO usar `document.execCommand` para dictado** - Usar helpers
4. **NO olvidar disparar evento `input`** - Para autoguardado

---

**Fecha**: 6 de Diciembre 2024
**Estado**: Pendiente de ejecución
