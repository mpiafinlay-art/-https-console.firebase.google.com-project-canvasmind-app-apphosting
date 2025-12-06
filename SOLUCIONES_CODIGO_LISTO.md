# 💻 SOLUCIONES CON CÓDIGO LISTO - 6 Dic 2024

## 🔴 SOLUCIÓN 1: Cursor NO vuelve al inicio

### Para TODOS los campos contentEditable:

```typescript
useEffect(() => {
  if (editorRef.current && value !== editorRef.current.innerHTML) {
    const isFocused = document.activeElement === editorRef.current;
    
    if (isFocused) {
      // NO actualizar si está enfocado - preservar cursor
      return;
    }
    
    // Guardar posición del cursor
    const selection = window.getSelection();
    let savedRange: Range | null = null;
    
    if (selection && selection.rangeCount > 0) {
      try {
        savedRange = selection.getRangeAt(0).cloneRange();
      } catch (e) {
        // Ignorar errores
      }
    }
    
    // Actualizar contenido
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
      } catch (e) {
        // Ignorar errores de restauración
      }
    }
  }
}, [value]);
```

**Aplicar en**:
- `tabbed-notepad-element.tsx`
- `super-notebook-element.tsx`
- `comment-element.tsx`
- Mejorar en `accordion-element.tsx`

---

## 🔴 SOLUCIÓN 2: Acordeón - Arrastrar

### Agregar drag-handle:

```typescript
<Card className={cn(
  "w-full h-full p-3 bg-white shadow-sm drag-handle",
  isSelected && "ring-2 ring-primary"
)}>
  <div className="flex items-center justify-between mb-2 drag-handle">
    <div className="flex items-center gap-2 drag-handle">
      <GripVertical className="h-4 w-4 text-slate-400 cursor-move drag-handle" />
      <h3 className="font-semibold text-slate-800 text-sm drag-handle">Acordeón</h3>
    </div>
    {/* ... */}
  </div>
</Card>
```

---

## 🔴 SOLUCIÓN 3: Acordeón - Dictado

### Verificar que funcione:

```typescript
useEffect(() => {
  if (isListening && editorRef.current && document.activeElement === editorRef.current && liveTranscript) {
    insertDictationTextToContentEditable(
      editorRef.current,
      liveTranscript,
      finalTranscript || '',
      dictationStateRef.current
    );
  }
}, [isListening, liveTranscript, finalTranscript]);
```

**Verificar**:
- `isListening` se pasa correctamente
- `liveTranscript` se pasa correctamente
- `finalTranscript` se pasa correctamente
- Elemento está enfocado

---

## 🔴 SOLUCIÓN 4: Acordeón - Guardado automático

### Reducir debounce y verificar:

```typescript
const { handleBlur, handleChange } = useAutoSave({
  getContent: () => editorRef.current?.innerHTML || '',
  onSave: async (newContent) => {
    if (newContent !== value) {
      onChange(newContent); // Esto debe actualizar en Firestore
    }
  },
  debounceMs: 500, // Reducido de 1000 a 500
  compareContent: (oldContent, newContent) => oldContent === newContent,
});
```

---

## 🔴 SOLUCIÓN 5: Exportar PNG - Área visible

### Código completo:

```typescript
const handleExportBoardToPng = useCallback(async () => {
  try {
    if (!canvasRef.current) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo acceder al lienzo.' });
      return;
    }

    const canvasContainer = canvasRef.current.getCanvasContainer();
    if (!canvasContainer) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo encontrar el contenedor.' });
      return;
    }

    toast({ title: 'Exportando...', description: 'Generando imagen PNG del área visible...' });

    document.body.classList.add('exporting-to-png');

    // Obtener área visible del viewport
    const scrollLeft = canvasContainer.scrollLeft;
    const scrollTop = canvasContainer.scrollTop;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const canvas = await html2canvas(canvasContainer, {
      backgroundColor: '#b7ddda',
      scale: 2.1, // 30% menos que 3x
      useCORS: true,
      logging: false,
      allowTaint: false,
      x: scrollLeft,
      y: scrollTop,
      width: viewportWidth,
      height: viewportHeight,
      windowWidth: viewportWidth,
      windowHeight: viewportHeight,
    });

    document.body.classList.remove('exporting-to-png');

    canvas.toBlob((blob: Blob | null) => {
      if (!blob) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo generar la imagen.' });
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${board?.name || 'tablero'}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({ title: 'Exportado', description: 'El área visible se ha exportado como PNG.' });
    }, 'image/png', 1.0);
  } catch (error: any) {
    document.body.classList.remove('exporting-to-png');
    console.error('Error al exportar:', error);
    toast({ variant: 'destructive', title: 'Error', description: error.message || 'No se pudo exportar.' });
  }
}, [canvasRef, board, toast]);
```

---

## 🔴 SOLUCIÓN 6: Botón Pincel - Color persiste

### Código mejorado (ya aplicado parcialmente):

```typescript
const applyTextColor = (e: React.MouseEvent, color: string) => {
  e.preventDefault();
  e.stopPropagation();
  
  const selection = window.getSelection();
  const activeElement = document.activeElement as HTMLElement;
  
  // Si hay selección, aplicar a selección
  if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.color = color;
    try {
      span.appendChild(range.extractContents());
      range.insertNode(span);
      range.setStartAfter(span);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (err) {
      console.error('Error aplicando color:', err);
    }
  } else if (activeElement && activeElement.isContentEditable) {
    // Si no hay selección, aplicar al elemento completo
    activeElement.style.color = color;
  }
  
  // Disparar evento para guardar
  if (activeElement) {
    activeElement.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  setPopoverOpen(null);
};
```

---

## 🔴 SOLUCIÓN 7: Botón Texto - Paleta de color

### Código (ya aplicado):

```typescript
<Popover>
  <PopoverTrigger asChild>
    <SidebarButton icon={FileText} label="Texto" />
  </PopoverTrigger>
  <PopoverContent className="w-auto p-2">
    <div className="text-xs text-gray-600 mb-2">Color de fondo</div>
    <div className="grid grid-cols-4 gap-2">
      {COLOR_PALETTE.map((color) => (
        <button
          key={color.name}
          className="w-8 h-8 rounded border border-gray-300 hover:scale-110"
          style={{ backgroundColor: color.value }}
          onClick={() => handleAddElement('text', {
            properties: { backgroundColor: color.value }
          })}
          title={color.label}
        />
      ))}
    </div>
  </PopoverContent>
</Popover>
```

**Verificar**: Que `handleAddElement` acepte `properties.backgroundColor`

---

## 🔴 SOLUCIÓN 8: Contenedor - Guardar elementos

### Verificar en `container-element.tsx`:

```typescript
const handleAddElementToContainer = useCallback(async (elementId: string) => {
  const newElementIds = [...containerContent.elementIds, elementId];
  // CRÍTICO: Actualizar inmediatamente
  onUpdate(id, { 
    content: { 
      ...containerContent, 
      elementIds: newElementIds 
    } 
  });
}, [id, containerContent, onUpdate]);
```

**Verificar**: Que `onUpdate` se ejecute y guarde en Firestore

---

## 📝 NOTAS IMPORTANTES:

1. **Siempre verificar `isFocused`** antes de actualizar `innerHTML`
2. **Usar `null` en lugar de `undefined`** para Firestore
3. **Disparar evento `input`** después de cambios para autoguardado
4. **Usar helpers de dictado** en lugar de `document.execCommand`
5. **Reducir `debounceMs`** a 500ms para guardado más rápido

---

**Fecha**: 6 de Diciembre 2024
