# Manual Completo: Lista de Tareas (TodoListElement)

**Fecha de creación**: 4 de Diciembre 2024  
**Componente**: `todo-list-element.tsx`  
**Versión**: Completa con drag & drop, autoguardado, y exportación

---

## 📋 TABLA DE CONTENIDOS

1. [Descripción General](#descripción-general)
2. [Estructura Visual](#estructura-visual)
3. [Header](#header)
4. [Lista de Items](#lista-de-items)
5. [Footer](#footer)
6. [Funcionalidades](#funcionalidades)
7. [Drag & Drop](#drag--drop)
8. [Autoguardado](#autoguardado)
9. [Implementación Paso a Paso](#implementación-paso-a-paso)

---

## 1. DESCRIPCIÓN GENERAL

El **TodoListElement** es un componente React que permite crear y gestionar listas de tareas con:

- **Items arrastrables**: Reordenar tareas con drag & drop
- **Checkboxes**: Marcar tareas como completadas
- **Edición inline**: Editar texto directamente
- **Paleta de colores**: Cambiar color de fondo
- **Exportación**: Copiar como texto o exportar a PNG
- **Autoguardado**: Guardado automático de cambios

---

## 2. ESTRUCTURA VISUAL

```
┌─────────────────────────────────────────┐
│ HEADER (Drag Handle + Título + Botones) │
├─────────────────────────────────────────┤
│                                         │
│ LISTA DE ITEMS                          │
│ [☐] Tarea 1                            │
│ [☑] Tarea 2                            │
│ [☐] Tarea 3                            │
│                                         │
├─────────────────────────────────────────┤
│ FOOTER (Input + Botón Agregar)          │
└─────────────────────────────────────────┘
```

---

## 3. HEADER

### 3.1 Estructura del Header

```tsx
<CardHeader className="p-2 pb-2 border-b border-gray-200/50">
  <div className="flex items-center justify-between gap-1">
    {/* Izquierda: Drag Handle + Título */}
    <div className="flex items-center gap-1 flex-1 min-w-0">
      <GripVertical className="h-3 w-3 text-gray-400" />
      <Input value={title} onChange={handleTitleChange} />
    </div>
    
    {/* Derecha: Botones */}
    <div className="flex items-center gap-0.5">
      <Palette /> {/* Cambiar color */}
      <MoreVertical /> {/* Menú más opciones */}
    </div>
  </div>
</CardHeader>
```

### 3.2 Drag Handle

- **Icono**: `GripVertical` de lucide-react
- **Tamaño**: `h-3 w-3`
- **Color**: `text-gray-400`
- **Clase**: `drag-handle` para permitir arrastre del elemento completo

### 3.3 Título Editable

- **Componente**: `Input` de ShadCN UI
- **Estilo**: `border-none shadow-none bg-transparent`
- **Placeholder**: "Título..."
- **Eventos**: `onChange={handleTitleChange}`
- **Autoguardado**: Se guarda automáticamente con debounce

### 3.4 Botón de Color

- **Icono**: `Palette`
- **Popover**: Muestra paleta de 7 colores
- **Colores disponibles**:
  - Blanco (`#ffffff`)
  - Amarillo (`#fffb8b`)
  - Rosa (`#ffc2d4`)
  - Azul (`#bce8f1`)
  - Verde (`#d4edda`)
  - Naranja (`#ffeeba`)
  - Morado (`#e9d5ff`)

### 3.5 Menú Más Opciones

**Opciones**:
1. **Copiar lista como texto**: Formato markdown con checkboxes
2. **Exportar a PNG**: Alta resolución (scale: 3)
3. **Eliminar Lista**: Confirma y elimina el elemento

---

## 4. LISTA DE ITEMS

### 4.1 Estructura de un Item

```tsx
<Draggable key={item.id} draggableId={item.id} index={index}>
  <div className="flex items-center gap-1 p-1 rounded">
    <GripVertical /> {/* Drag handle del item */}
    <Checkbox checked={item.completed} />
    <input type="text" value={item.text} />
    <X /> {/* Botón eliminar (solo cuando está seleccionado) */}
  </div>
</Draggable>
```

### 4.2 Drag Handle del Item

- **Icono**: `GripVertical`
- **Tamaño**: `h-3 w-3`
- **Opacidad**: `opacity-50 hover:opacity-100`
- **Props**: `{...provided.dragHandleProps}` de react-beautiful-dnd

### 4.3 Checkbox

- **Componente**: `Checkbox` de ShadCN UI
- **Tamaño**: `h-3 w-3`
- **Estado**: `checked={item.completed}`
- **Función**: `onCheckedChange={() => handleToggleItem(index)}`

### 4.4 Input de Texto

- **Tipo**: `input type="text"`
- **Estilo**: `border-none shadow-none bg-transparent`
- **Estado completado**: `line-through text-gray-500`
- **Placeholder**: "Tarea..."
- **Eventos**: `onChange={(e) => handleItemTextChange(index, e.target.value)}`
- **IMPORTANTE**: No usar `onMouseDown` para permitir dictado

### 4.5 Botón Eliminar

- **Icono**: `X`
- **Visibilidad**: Solo cuando `isSelected === true`
- **Opacidad**: `opacity-0 group-hover/item:opacity-100`
- **Función**: `onClick={() => handleDeleteItem(index)}`

---

## 5. FOOTER

### 5.1 Estructura del Footer

```tsx
<CardFooter className="p-2 pt-1.5 border-t border-gray-200/50">
  <div className="flex items-center gap-1 w-full">
    <input
      type="text"
      value={newItemText}
      onChange={(e) => setNewItemText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleAddItem();
      }}
      placeholder="Agregar tarea..."
    />
    <Button onClick={handleAddItem}>
      <Plus />
    </Button>
  </div>
</CardFooter>
```

### 5.2 Input de Nueva Tarea

- **Placeholder**: "Agregar tarea..."
- **Enter**: Agrega la tarea automáticamente
- **IMPORTANTE**: No usar `onMouseDown` para permitir dictado

### 5.3 Botón Agregar

- **Icono**: `Plus`
- **Tamaño**: `h-6 w-6`
- **Función**: `handleAddItem()`

---

## 6. FUNCIONALIDADES

### 6.1 Agregar Tarea

```typescript
const handleAddItem = () => {
  if (newItemText.trim() !== '') {
    const newItems = [...items, { 
      id: `item-${Date.now()}`, 
      text: newItemText, 
      completed: false 
    }];
    const updatedContent: TodoContent = { ...todoContent, items: newItems };
    onUpdate(id, { content: updatedContent });
    setNewItemText('');
    handleAutoSaveChange();
  }
};
```

### 6.2 Toggle Completado

```typescript
const handleToggleItem = (index: number) => {
  const newItems = [...items];
  newItems[index] = { ...newItems[index], completed: !newItems[index].completed };
  const updatedContent: TodoContent = { ...todoContent, items: newItems };
  onUpdate(id, { content: updatedContent });
  handleAutoSaveChange();
};
```

### 6.3 Editar Texto

```typescript
const handleItemTextChange = (index: number, text: string) => {
  const newItems = [...items];
  newItems[index] = { ...newItems[index], text };
  const updatedContent: TodoContent = { ...todoContent, items: newItems };
  onUpdate(id, { content: updatedContent });
  handleAutoSaveChange();
};
```

### 6.4 Eliminar Tarea

```typescript
const handleDeleteItem = (index: number) => {
  const newItems = items.filter((_, i) => i !== index);
  const updatedContent: TodoContent = { ...todoContent, items: newItems };
  onUpdate(id, { content: updatedContent });
  handleAutoSaveChange();
};
```

### 6.5 Copiar como Texto

```typescript
const handleCopyAsText = async () => {
  let text = `*${title || 'Lista de Tareas'}*\n\n`;
  items.forEach((item) => {
    if (item.completed) {
      text += `✅ ${item.text}\n`;
    } else {
      text += `⬜ ${item.text}\n`;
    }
  });
  await navigator.clipboard.writeText(text);
};
```

### 6.6 Exportar a PNG

```typescript
const handleExportPNG = async () => {
  const canvas = await html2canvas(cardRef.current, {
    backgroundColor: backgroundColor,
    scale: 3, // Alta resolución
    useCORS: true,
    logging: false,
  });
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title || 'lista'}.png`;
    link.click();
  }, 'image/png');
};
```

---

## 7. DRAG & DROP

### 7.1 Librería

**@hello-pangea/dnd**: Fork mantenido de react-beautiful-dnd

### 7.2 Implementación

```tsx
<DragDropContext onDragEnd={onDragEnd}>
  <Droppable droppableId={`droppable-${id}`}>
    {(provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef}>
        {items.map((item, index) => (
          <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                className={snapshot.isDragging ? 'bg-gray-100 shadow-md' : ''}
              >
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

### 7.3 Handler onDragEnd

```typescript
const onDragEnd = (result: DropResult) => {
  if (!result.destination) return;
  const newItems = Array.from(items);
  const [reorderedItem] = newItems.splice(result.source.index, 1);
  newItems.splice(result.destination.index, 0, reorderedItem);
  const updatedContent: TodoContent = { ...todoContent, items: newItems };
  onUpdate(id, { content: updatedContent });
  handleAutoSaveChange();
};
```

---

## 8. AUTOGUARDADO

### 8.1 Hook useAutoSave

```typescript
const { saveStatus, handleChange: handleAutoSaveChange } = useAutoSave({
  getContent: () => todoContent,
  onSave: async (newContent) => {
    const currentSerialized = JSON.stringify(todoContent);
    const newSerialized = JSON.stringify(newContent);
    if (currentSerialized !== newSerialized) {
      onUpdate(id, { content: newContent });
    }
  },
  debounceMs: 2000,
  compareContent: (oldContent, newContent) => {
    return JSON.stringify(oldContent) === JSON.stringify(newContent);
  },
});
```

### 8.2 Indicador Visual

```tsx
<div className="absolute top-2 right-2 z-10">
  <SaveStatusIndicator status={saveStatus} size="sm" />
</div>
```

---

## 9. IMPLEMENTACIÓN PASO A PASO

### Paso 1: Estructura Base

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function TodoListElement(props: CommonElementProps) {
  const { id, content, properties, onUpdate } = props;
  const todoContent = content as TodoContent;
  
  return (
    <Card className="w-full h-full flex flex-col">
      {/* Header */}
      {/* Content */}
      {/* Footer */}
    </Card>
  );
}
```

### Paso 2: Header con Título y Botones

Implementar drag-handle + título editable + botones de color y menú

### Paso 3: Lista con Drag & Drop

```tsx
<DragDropContext onDragEnd={onDragEnd}>
  <Droppable droppableId={`droppable-${id}`}>
    {/* Renderizar items */}
  </Droppable>
</DragDropContext>
```

### Paso 4: Footer con Input

```tsx
<input
  value={newItemText}
  onChange={(e) => setNewItemText(e.target.value)}
  onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
/>
```

### Paso 5: Integrar Autoguardado

```tsx
const { saveStatus, handleChange } = useAutoSave({
  getContent: () => todoContent,
  onSave: async (newContent) => onUpdate(id, { content: newContent }),
  debounceMs: 2000,
});
```

---

## 10. TIPOS DE DATOS

### 10.1 TodoItem

```typescript
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}
```

### 10.2 TodoContent

```typescript
interface TodoContent {
  title?: string;
  items: TodoItem[];
}
```

---

## 11. DEPENDENCIAS

- `@hello-pangea/dnd`: Drag & drop
- `html2canvas`: Exportación a PNG
- `lucide-react`: Iconos
- `@/components/ui/*`: Componentes ShadCN UI
- `@/hooks/use-auto-save`: Hook de autoguardado

---

**FIN DEL MANUAL**

