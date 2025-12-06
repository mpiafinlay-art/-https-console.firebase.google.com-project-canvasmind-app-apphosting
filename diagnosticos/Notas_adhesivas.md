# Manual Completo: Notas Adhesivas (StickyNoteElement)

**Fecha de creación**: 4 de Diciembre 2024  
**Componente**: `sticky-note-element.tsx`  
**Versión**: Completa con rotación, colores, y autoguardado

---

## 📋 TABLA DE CONTENIDOS

1. [Descripción General](#descripción-general)
2. [Estructura Visual](#estructura-visual)
3. [Colores Disponibles](#colores-disponibles)
4. [Header con Botones](#header-con-botones)
5. [Contenido Editable](#contenido-editable)
6. [Rotación](#rotación)
7. [Autoguardado](#autoguardado)
8. [Implementación Paso a Paso](#implementación-paso-a-paso)

---

## 1. DESCRIPCIÓN GENERAL

El **StickyNoteElement** es un componente React que simula una nota adhesiva física con:

- **7 colores**: Amarillo, Rosa, Azul, Verde, Naranja, Morado, Blanco
- **Rotación**: Rotar 15° por cada clic
- **Contenido editable**: Texto rico con ContentEditable
- **Autoguardado**: Guardado automático con debounce
- **Dictado**: Soporte para dictado por voz
- **Tamaños mínimos/máximos**: Restricciones de tamaño

---

## 2. ESTRUCTURA VISUAL

```
┌─────────────────────────────┐
│ [Grip] [Plus] [Paint] [Rot] [X] │ ← Header (hover)
│                             │
│ Contenido Editable          │
│ (texto rico)                │
│                             │
│                             │
└─────────────────────────────┘
```

---

## 3. COLORES DISPONIBLES

### 3.1 Mapa de Colores

```typescript
const colorMap: { [key: string]: string } = {
  yellow: '#fffb8b',
  pink: '#ffc2d4',
  blue: '#bce8f1',
  green: '#d4edda',
  orange: '#ffeeba',
  purple: '#e9d5ff',
  white: '#ffffff',
};
```

### 3.2 Selección de Color

- Si `properties.color` es un nombre (ej: "yellow"), usar `colorMap`
- Si es un hex (ej: "#fffb8b"), usar directamente
- Por defecto: Amarillo (`#fffb8b`)

---

## 4. HEADER CON BOTONES

### 4.1 Posición y Visibilidad

```tsx
<div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
  {/* Botones */}
</div>
```

- **Posición**: Esquina superior derecha
- **Visibilidad**: Solo en hover (`group-hover:opacity-100`)
- **Z-index**: `z-10` para estar sobre el contenido

### 4.2 Botones del Header

#### 1. GripVertical (Drag Handle)
- **Icono**: `GripVertical`
- **Tamaño**: `h-4 w-4`
- **Clase**: `drag-handle`
- **Cursor**: `cursor-grab active:cursor-grabbing`

#### 2. Plus (Agregar Contenido)
- **Icono**: `Plus`
- **Función**: Inserta un `<br>` en la posición del cursor
- **Implementación**:
  ```typescript
  const handleAddContent = (e: React.MouseEvent) => {
    if (editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.collapse(false);
        const br = document.createElement('br');
        range.insertNode(br);
      }
    }
  };
  ```

#### 3. Paintbrush (Cambiar Color)
- **Icono**: `Paintbrush`
- **Popover**: `TwitterPicker` de react-color
- **Colores**: Array `COLORS` con 10 colores predefinidos
- **Función**: `handleColorChange(newColor.hex)`

#### 4. RotateCw (Rotar)
- **Icono**: `RotateCw`
- **Visibilidad**: Solo cuando `isSelected === true`
- **Función**: Incrementa rotación en 15°
- **Implementación**:
  ```typescript
  const handleRotate = (e: React.MouseEvent) => {
    const newRotation = ((rotation || 0) + 15) % 360;
    onUpdate(id, { properties: { ...safeProperties, rotation: newRotation } });
  };
  ```

#### 5. X (Cerrar/Eliminar)
- **Icono**: `X`
- **Función**: `deleteElement(id)`

---

## 5. CONTENIDO EDITABLE

### 5.1 Estructura

```tsx
<div
  ref={editorRef}
  contentEditable
  suppressContentEditableWarning
  onInput={handleContentChange}
  onBlur={handleBlurWithSave}
  className="text-base font-medium break-words outline-none cursor-text p-4 pt-6"
  style={{ color: '#333', minHeight: 'calc(100% - 1rem)' }}
/>
```

### 5.2 Estilos

- **Fuente**: `text-base` (16px)
- **Peso**: `font-medium` (500)
- **Padding**: `p-4 pt-6` (16px todos lados, 24px arriba)
- **Color**: `#333` (gris oscuro)
- **Altura mínima**: `calc(100% - 1rem)` para ocupar espacio disponible

### 5.3 Eventos

- **onInput**: Trigger de autoguardado (`handleContentChange`)
- **onBlur**: Guardado inmediato (`handleBlurWithSave`)

---

## 6. ROTACIÓN

### 6.1 Aplicación de Rotación

```tsx
<div
  className="relative flex-grow rounded-lg overflow-hidden drag-handle"
  style={{ transform: `rotate(${rotation || 0}deg)` }}
>
  {/* Contenido */}
</div>
```

### 6.2 Propiedad rotation

- **Tipo**: `number` (grados)
- **Rango**: 0-359 (se usa módulo 360)
- **Incremento**: 15° por clic
- **Almacenamiento**: `properties.rotation`

### 6.3 Transform CSS

- Usa `transform: rotate()` en lugar de cambiar posición
- No afecta el layout (el elemento mantiene su espacio original)
- El cursor y la interacción se rotan con el elemento

---

## 7. AUTOGUARDADO

### 7.1 Hook useAutoSave

```typescript
const { saveStatus, handleBlur: handleAutoSaveBlur, handleChange } = useAutoSave({
  getContent: () => editorRef.current?.innerHTML || '',
  onSave: async (newContent) => {
    if (newContent !== textContent) {
      onUpdate(id, { content: newContent });
    }
  },
  debounceMs: 2000,
  compareContent: (oldContent, newContent) => oldContent === newContent,
});
```

### 7.2 Indicador Visual

```tsx
<div className="absolute top-2 right-2 z-10">
  <SaveStatusIndicator status={saveStatus} size="sm" />
</div>
```

---

## 8. DICTADO POR VOZ

### 8.1 Soporte

```typescript
useEffect(() => {
  if (isListening && isSelected && editorRef.current && document.activeElement === editorRef.current) {
    document.execCommand('insertText', false, liveTranscript || '');
  }
}, [isListening, liveTranscript, isSelected]);
```

### 8.2 Condiciones

- `isListening === true`: El dictado está activo
- `isSelected === true`: La nota está seleccionada
- `document.activeElement === editorRef.current`: El editor está enfocado

---

## 9. TAMAÑOS MÍNIMOS Y MÁXIMOS

### 9.1 Restricciones CSS

```tsx
<Card
  className={cn(
    'min-w-[200px] min-h-[150px] max-w-[400px] max-h-[500px]',
    'rounded-lg shadow-md border-none'
  )}
>
```

- **Ancho mínimo**: 200px
- **Alto mínimo**: 150px
- **Ancho máximo**: 400px
- **Alto máximo**: 500px

---

## 10. IMPLEMENTACIÓN PASO A PASO

### Paso 1: Estructura Base

```tsx
import { Card } from '@/components/ui/card';
import { TwitterPicker } from 'react-color';

export default function StickyNoteElement(props: CommonElementProps) {
  const { id, content, properties, onUpdate } = props;
  const colorHex = colorMap[colorValue] || colorValue;
  
  return (
    <Card style={{ backgroundColor: colorHex }}>
      {/* Contenido */}
    </Card>
  );
}
```

### Paso 2: Header con Botones

```tsx
<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
  <GripVertical />
  <Plus onClick={handleAddContent} />
  <Paintbrush /> {/* Con Popover */}
  {isSelected && <RotateCw onClick={handleRotate} />}
  <X onClick={handleClose} />
</div>
```

### Paso 3: Contenido Editable

```tsx
<div
  ref={editorRef}
  contentEditable
  onInput={handleContentChange}
  onBlur={handleBlurWithSave}
/>
```

### Paso 4: Aplicar Rotación

```tsx
<div style={{ transform: `rotate(${rotation || 0}deg)` }}>
  {/* Contenido */}
</div>
```

### Paso 5: Integrar Autoguardado

```tsx
const { saveStatus, handleBlur, handleChange } = useAutoSave({
  getContent: () => editorRef.current?.innerHTML || '',
  onSave: async (newContent) => onUpdate(id, { content: newContent }),
  debounceMs: 2000,
});
```

---

## 11. DEPENDENCIAS

- `react-color`: Selector de color (TwitterPicker)
- `lucide-react`: Iconos
- `@/components/ui/card`: Componente Card
- `@/hooks/use-auto-save`: Hook de autoguardado
- `@/components/canvas/save-status-indicator`: Indicador visual

---

**FIN DEL MANUAL**

