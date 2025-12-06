# APRENDIZAJES: CÓMO HACER BIEN LOS ELEMENTOS DE LA APP

## 📚 RESUMEN EJECUTIVO

Después de revisar exhaustivamente todos los archivos de `src/components/canvas/` y `src/components/canvas/elements/`, he identificado los patrones, mejores prácticas y estructura común que todos los elementos deben seguir.

---

## 🏗️ ARQUITECTURA GENERAL

### 1. **TransformableElement: El Wrapper Universal**

**Ubicación**: `src/components/canvas/transformable-element.tsx`

**Función**: Envuelve TODOS los elementos del canvas y proporciona:
- Drag & Drop con `react-rnd`
- Resize con handles
- Selección visual (border cuando `isSelected`)
- Migración de datos antiguos (`migrateElement`)
- Lazy loading con `Suspense`

**Patrón Clave**:
```typescript
// TransformableElement extrae propiedades de element.properties
const elementProps = typeof element.properties === 'object' && properties !== null ? element.properties : {};
const position = elementProps.position || { x: element.x || 0, y: element.y || 0 };
const size = elementProps.size || { width: element.width || 200, height: element.height || 150 };

// Luego pasa estas props al ElementComponent real
<ElementComponent
  x={position.x}
  y={position.y}
  width={size.width}
  height={size.height}
  // ... resto de props
/>
```

**Lección**: Los elementos NO manejan su propia posición/tamaño directamente. `TransformableElement` lo hace.

---

## 📋 ESTRUCTURA COMÚN DE ELEMENTOS

### 2. **CommonElementProps: La Interfaz Universal**

**Ubicación**: `src/lib/types.ts`

**Props Obligatorias**:
```typescript
{
  id: string;
  type: ElementType;
  x: number;           // Pasado por TransformableElement
  y: number;           // Pasado por TransformableElement
  width: number;       // Pasado por TransformableElement
  height: number;      // Pasado por TransformableElement
  content: any;        // Contenido específico del elemento
  properties: any;     // Propiedades visuales/estado
  isSelected: boolean; // Si está seleccionado
  scale: number;       // Escala del canvas (zoom)
  
  // Callbacks obligatorios
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  onSelectElement: (id: string | null, isMultiSelect: boolean) => void;
  onEditElement: (id: string) => void;
}
```

**Lección**: TODOS los elementos deben aceptar `CommonElementProps` como props.

---

## 🎨 PATRONES VISUALES COMUNES

### 3. **Estilos Base Consistentes**

**Patrón Encontrado en Todos los Elementos**:
```typescript
// Clases base comunes
className={cn(
  'w-full h-full',           // Ocupa todo el espacio del Rnd
  'rounded-lg',              // Bordes redondeados
  'shadow-lg',               // Sombra pronunciada
  'relative',                // Para posicionamiento absoluto de controles
  'group',                   // Para hover states en hijos
  'drag-handle',             // Para react-rnd
  'cursor-grab active:cursor-grabbing' // Cursor de arrastre
)}

// Estilos inline consistentes
style={{
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
}
```

**Lección**: Todos los elementos deben tener estos estilos base para consistencia visual.

---

## 🔧 PATRONES DE INTERACCIÓN

### 4. **Drag Handle con GripVertical**

**Patrón Encontrado**:
```typescript
import { GripVertical } from 'lucide-react';

// En la esquina superior izquierda o header
<div className="drag-handle cursor-grab active:cursor-grabbing">
  <GripVertical className="h-4 w-4 text-gray-400" />
</div>
```

**Lección**: Usar `GripVertical` como indicador visual de que el elemento es arrastrable.

### 5. **Controles en Hover (opacity-0 group-hover:opacity-100)**

**Patrón Encontrado**:
```typescript
// Controles que aparecen solo en hover
<div className="opacity-0 group-hover:opacity-100 transition-opacity">
  <Button onClick={handleAction}>...</Button>
</div>
```

**Lección**: Los controles secundarios (eliminar, editar, etc.) deben aparecer solo en hover para mantener la UI limpia.

### 6. **Prevención de Propagación de Eventos**

**Patrón Crítico**:
```typescript
// En botones dentro del elemento
<Button
  onClick={(e) => {
    e.stopPropagation();  // CRÍTICO: Previene selección del elemento
    e.preventDefault();
    handleAction();
  }}
  onMouseDown={(e) => e.stopPropagation()} // También en mousedown
>
```

**Lección**: SIEMPRE usar `stopPropagation()` en botones dentro de elementos para evitar conflictos con drag/select.

---

## 📝 PATRONES DE EDICIÓN

### 7. **ContentEditable para Texto Rico**

**Patrón Encontrado en TextElement, StickyNoteElement, NotepadElement**:
```typescript
const editorRef = useRef<HTMLDivElement>(null);

// Sincronización bidireccional
useEffect(() => {
  if (editorRef.current && content !== editorRef.current.innerHTML) {
    editorRef.current.innerHTML = content || '';
  }
}, [content]);

// Guardar en blur
const handleContentChange = () => {
  if (editorRef.current && content !== editorRef.current.innerHTML) {
    onUpdate(id, { content: editorRef.current.innerHTML });
  }
};

<div
  ref={editorRef}
  contentEditable
  suppressContentEditableWarning
  onBlur={handleContentChange}
  className="outline-none cursor-text"
/>
```

**Lección**: 
- Usar `contentEditable` para texto rico (HTML)
- Sincronizar con `useEffect` cuando `content` cambia externamente
- Guardar en `onBlur` para evitar guardados innecesarios

### 8. **Input para Texto Simple**

**Patrón Encontrado en TodoListElement, ColumnElement**:
```typescript
<Input
  value={title}
  onChange={(e) => onUpdate(id, { content: { ...content, title: e.target.value } })}
  className="bg-transparent border-none focus-visible:ring-0"
  onClick={(e) => e.stopPropagation()} // CRÍTICO
/>
```

**Lección**: Usar `Input` de ShadCN para texto simple, siempre con `stopPropagation` en `onClick`.

---

## 🎯 PATRONES ESPECÍFICOS POR TIPO DE ELEMENTO

### 9. **StickyNoteElement: Color Picker**

**Patrón**:
```typescript
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TwitterPicker } from 'react-color';

const colorMap: { [key: string]: string } = {
  yellow: '#fffb8b',
  pink: '#ffc2d4',
  // ... más colores
};

const colorHex = colorMap[colorValue] || (colorValue.startsWith('#') ? colorValue : '#fffb8b');

<Popover>
  <PopoverTrigger asChild>
    <Button><Paintbrush /></Button>
  </PopoverTrigger>
  <PopoverContent onClick={(e) => e.stopPropagation()}>
    <TwitterPicker 
      colors={COLORS} 
      color={colorHex} 
      onChangeComplete={(newColor) => {
        onUpdate(id, { properties: { ...safeProperties, color: newColor.hex } });
      }} 
    />
  </PopoverContent>
</Popover>
```

**Lección**: Usar `TwitterPicker` de `react-color` para selección de color, siempre con `stopPropagation` en el PopoverContent.

### 10. **TodoListElement: Drag and Drop Interno**

**Patrón**:
```typescript
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const onDragEnd = (result: DropResult) => {
  if (!result.destination) return;
  const newItems = Array.from(items);
  const [reorderedItem] = newItems.splice(result.source.index, 1);
  newItems.splice(result.destination.index, 0, reorderedItem);
  onUpdate(id, { content: { ...content, items: newItems } });
};

<DragDropContext onDragEnd={onDragEnd}>
  <Droppable droppableId={`droppable-${id}`}>
    {(provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef}>
        {items.map((item, index) => (
          <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.draggableProps}>
                <div {...provided.dragHandleProps}>
                  <GripVertical />
                </div>
                {/* Contenido del item */}
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>
```

**Lección**: Usar `@hello-pangea/dnd` para drag and drop interno de listas.

### 11. **NotepadElement: Paginación Compleja**

**Patrón**:
```typescript
// Guardar contenido antes de cambiar página
const saveContent = useCallback(() => {
  if (!contentRef.current) return;
  const newHtml = contentRef.current.innerHTML;
  const currentPages = typedContent.pages || [''];
  if (newHtml !== currentPages[currentPageIndex]) {
    const newPages = [...currentPages];
    newPages[currentPageIndex] = newHtml;
    onUpdate(id, { content: { ...typedContent, pages: newPages } });
  }
}, [typedContent, currentPageIndex, onUpdate, id]);

// Cambiar página
const handlePageChange = useCallback((newPage: number) => {
  saveContent(); // Guardar página actual primero
  onUpdate(id, { content: { ...typedContent, currentPage: newPage } });
}, [saveContent, typedContent, onUpdate, id]);
```

**Lección**: 
- Guardar contenido antes de cambiar de página
- Usar array de strings HTML para páginas
- Sincronizar `contentRef.current.innerHTML` con `pages[currentPageIndex]`

### 12. **ImageElement: Rotación y Etiquetas Flotantes**

**Patrón**:
```typescript
const rotation = safeProperties?.rotation || 0;

<div
  style={{ transform: `rotate(${rotation}deg)` }}
  className="drag-handle"
>
  <Image src={imageUrl} fill className="object-cover" />
</div>

// Etiqueta flotante con FloatingTagInput
{isSelected && (
  <FloatingTagInput
    tag={floatingTag || ''}
    isEditing={!!showFloatingTag}
    onSave={(newTag) => {
      onUpdate(id, { properties: { ...safeProperties, floatingTag: newTag, showFloatingTag: false } });
    }}
    onCancel={() => {
      onUpdate(id, { properties: { ...safeProperties, showFloatingTag: false } });
    }}
  />
)}
```

**Lección**: 
- Usar `transform: rotate()` para rotación
- Crear componentes reutilizables como `FloatingTagInput` para funcionalidades comunes

---

## 🔄 PATRONES DE ACTUALIZACIÓN

### 13. **Safe Properties Pattern**

**Patrón Encontrado en TODOS los Elementos**:
```typescript
const safeProperties = typeof properties === 'object' && properties !== null ? properties : {};

// Luego usar safeProperties en lugar de properties directamente
const color = safeProperties.color || 'default';
const rotation = safeProperties.rotation || 0;
```

**Lección**: SIEMPRE validar que `properties` es un objeto antes de usarlo.

### 14. **Actualización Inmutable**

**Patrón**:
```typescript
// ❌ MAL: Mutación directa
properties.color = newColor;
onUpdate(id, { properties });

// ✅ BIEN: Spread operator
onUpdate(id, { 
  properties: { 
    ...safeProperties, 
    color: newColor 
  } 
});
```

**Lección**: SIEMPRE usar spread operator para actualizaciones inmutables.

---

## 🎭 PATRONES DE ESTADO

### 15. **Estado Local vs Estado Global**

**Patrón**:
```typescript
// Estado local para UI temporal (edición, hover, etc.)
const [isEditing, setIsEditing] = useState(false);
const [isHovering, setIsHovering] = useState(false);

// Estado persistente va en content/properties
onUpdate(id, { content: { ...content, title: newTitle } });
```

**Lección**: 
- Estado local: UI temporal (edición, hover, modales)
- Estado persistente: `content` y `properties` (se guarda en Firestore)

### 16. **Prevención de Drag Durante Edición**

**Patrón del Código Ejemplo Aplicado**:
```typescript
// En TransformableElement, podría agregarse:
const handleMouseDown = (e: MouseEvent) => {
  // Prevenir drag si está editando
  if (activatedElementId === element.id) return;
  onSelectElement(element.id, e.altKey || e.shiftKey || e.metaKey || e.ctrlKey);
};
```

**Lección**: Verificar estado de edición antes de permitir drag.

---

## 🎨 PATRONES DE DISEÑO

### 17. **Iconos Consistentes**

**Patrón**:
```typescript
import { 
  GripVertical,    // Drag handle
  X,               // Cerrar/eliminar
  Plus,             // Agregar
  Paintbrush,       // Color picker
  Trash2,           // Eliminar
  Edit,             // Editar
  Save,             // Guardar
} from 'lucide-react';
```

**Lección**: Usar iconos de `lucide-react` consistentemente.

### 18. **Botones ShadCN Consistentes**

**Patrón**:
```typescript
import { Button } from '@/components/ui/button';

// Botones pequeños para controles
<Button variant="ghost" size="icon" className="h-6 w-6">
  <X className="h-4 w-4" />
</Button>

// Botones con texto
<Button variant="default" size="sm">
  Guardar
</Button>
```

**Lección**: Usar componentes de ShadCN para consistencia.

---

## 🔐 PATRONES DE SEGURIDAD

### 19. **Validación de Contenido**

**Patrón**:
```typescript
// Validar antes de actualizar
const handleAddItem = () => {
  if (newItemText.trim() !== '') {
    const newItems = [...items, { id: `item-${Date.now()}`, text: newItemText, completed: false }];
    onUpdate(id, { content: { ...content, items: newItems } });
    setNewItemText('');
  }
};
```

**Lección**: Validar entrada antes de actualizar estado.

### 20. **Manejo de Errores**

**Patrón**:
```typescript
try {
  await addElement(type, props);
  toast({ title: 'Elemento creado', variant: 'default' });
} catch (error) {
  console.error('Error al crear elemento:', error);
  toast({ title: 'Error', description: 'No se pudo crear el elemento', variant: 'destructive' });
}
```

**Lección**: Siempre manejar errores con try-catch y mostrar feedback al usuario.

---

## 📦 ESTRUCTURA DE ARCHIVO TÍPICA

### 21. **Template de Elemento Nuevo**

```typescript
'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { CommonElementProps } from '@/lib/types';
import { cn } from '@/lib/utils';
import { GripVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NuevoElemento(props: CommonElementProps) {
  const {
    id,
    content,
    properties,
    isSelected,
    onUpdate,
    onEditElement,
    deleteElement
  } = props;

  // Safe properties
  const safeProperties = typeof properties === 'object' && properties !== null ? properties : {};
  
  // Estado local (solo UI temporal)
  const [isEditing, setIsEditing] = useState(false);
  
  // Refs para elementos DOM
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Sincronización con content externo
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content || '';
    }
  }, [content]);
  
  // Handlers
  const handleContentChange = () => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      onUpdate(id, { content: editorRef.current.innerHTML });
    }
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (deleteElement) {
      deleteElement(id);
    }
  };
  
  return (
    <div
      className={cn(
        'w-full h-full p-4 flex flex-col rounded-lg shadow-lg relative group',
        'cursor-grab active:cursor-grabbing'
      )}
      style={{
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
      onClick={() => onEditElement(id)}
    >
      {/* Header con controles */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <div className="drag-handle cursor-grab active:cursor-grabbing p-1 hover:bg-black/10 rounded">
          <GripVertical className="h-4 w-4 text-gray-700" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-1 hover:bg-black/10 rounded"
          onClick={handleDelete}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <X className="h-4 w-4 text-gray-700" />
        </Button>
      </div>
      
      {/* Contenido del elemento */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleContentChange}
        className="flex-grow outline-none cursor-text"
      />
    </div>
  );
}
```

---

## ✅ CHECKLIST PARA CREAR UN ELEMENTO NUEVO

- [ ] Acepta `CommonElementProps` como props
- [ ] Usa `safeProperties` pattern para validar `properties`
- [ ] Tiene estilos base consistentes (`rounded-lg`, `shadow-lg`, etc.)
- [ ] Tiene `drag-handle` con `GripVertical` icon
- [ ] Controles aparecen solo en hover (`opacity-0 group-hover:opacity-100`)
- [ ] Usa `stopPropagation()` en todos los botones/interacciones
- [ ] Sincroniza `content` con `useEffect` si usa `contentEditable`
- [ ] Guarda cambios en `onBlur` o `onChange` según corresponda
- [ ] Usa componentes ShadCN (`Button`, `Input`, `Popover`, etc.)
- [ ] Usa iconos de `lucide-react`
- [ ] Maneja errores con try-catch y toast
- [ ] Valida entrada antes de actualizar estado
- [ ] Usa spread operator para actualizaciones inmutables
- [ ] Registrado en `ElementComponentMap` en `transformable-element.tsx`
- [ ] Lazy loaded con `lazy()` y `Suspense`

---

## 🎯 CONCLUSIÓN

Los elementos de la app siguen patrones muy consistentes:

1. **TransformableElement** maneja drag/resize/select
2. **CommonElementProps** proporciona interfaz universal
3. **Estilos base** consistentes en todos los elementos
4. **Patrones de interacción** (hover, stopPropagation, etc.)
5. **Safe properties** para validación
6. **Actualizaciones inmutables** con spread operator
7. **Componentes ShadCN** para UI consistente

Siguiendo estos patrones, cualquier elemento nuevo se integrará perfectamente con el resto de la aplicación.

