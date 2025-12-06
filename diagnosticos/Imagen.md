# Manual Completo: Elemento Imagen (ImageElement)

**Fecha de creación**: 4 de Diciembre 2024  
**Componentes**: `image-element.tsx`, `floating-tag-input.tsx`  
**Versión**: Completa con etiquetado, arrastre, redimensionamiento, y rotación

---

## 📋 TABLA DE CONTENIDOS

1. [Descripción General](#descripción-general)
2. [Estructura del Contenedor](#estructura-del-contenedor)
3. [Sistema de Etiquetado](#sistema-de-etiquetado)
4. [Arrastre y Redimensionamiento](#arrastre-y-redimensionamiento)
5. [Rotación](#rotación)
6. [Label Inferior](#label-inferior)
7. [Subida de Imágenes](#subida-de-imágenes)
8. [Implementación Paso a Paso](#implementación-paso-a-paso)

---

## 1. DESCRIPCIÓN GENERAL

El **ImageElement** es un componente React que muestra imágenes en el canvas con:

- **Contenedor flexible**: Se adapta al tamaño de la imagen
- **Etiqueta flotante**: Sistema de etiquetado superior
- **Label inferior**: Etiqueta editable debajo de la imagen
- **Rotación**: Rotar imagen en cualquier ángulo
- **Arrastre**: Mover imagen por el canvas
- **Redimensionamiento**: Cambiar tamaño con handles
- **Proxy de imágenes**: Manejo de CORS mediante `/api/proxy`

---

## 2. ESTRUCTURA DEL CONTENEDOR

### 2.1 Contenedor Principal

```tsx
<div
  className="group/image flex flex-col w-full h-full"
  onDoubleClick={handleDoubleClick}
  onMouseDown={(e) => onSelectElement(id, e.shiftKey || e.ctrlKey || e.metaKey)}
>
  <div className="relative w-full flex-grow flex flex-col">
    {/* Etiqueta flotante */}
    {/* Botones de control */}
    {/* Imagen */}
  </div>
  {/* Label inferior */}
</div>
```

**Características**:
- **Layout**: Flex column (`flex flex-col`)
- **Tamaño**: `w-full h-full` (ocupa todo el espacio disponible)
- **Grupo**: `group/image` para efectos hover
- **Selección**: Shift/Ctrl/Cmd + click para selección múltiple

### 2.2 Contenedor de Imagen

```tsx
<div
  className={cn(
    "relative flex-grow rounded-lg overflow-hidden drag-handle",
    "cursor-grab active:cursor-grabbing"
  )}
  style={{ transform: `rotate(${rotation || 0}deg)` }}
>
  <div className="relative w-full h-full bg-card">
    <Image
      src={`/api/proxy?url=${encodeURIComponent(imageUrl)}`}
      alt={label || "Canvas Image"}
      fill
      className="object-cover pointer-events-none"
    />
  </div>
</div>
```

**Características**:
- **Rotación**: Aplicada con `transform: rotate()`
- **Drag handle**: Clase `drag-handle` para permitir arrastre
- **Cursor**: `cursor-grab` / `cursor-grabbing`
- **Imagen**: Next.js `Image` con `fill` y `object-cover`
- **Proxy**: Usa `/api/proxy` para evitar problemas de CORS

---

## 3. SISTEMA DE ETIQUETADO

### 3.1 Etiqueta Flotante (FloatingTagInput)

**Componente**: `floating-tag-input.tsx`

**Ubicación**: Arriba de la imagen (`absolute -top-10 left-0`)

**Estados**:

#### Estado de Edición (`isEditing === true`)
```tsx
<div className="absolute -top-10 left-0 z-30">
  <Input
    ref={inputRef}
    value={currentTag}
    onChange={(e) => setCurrentTag(e.target.value)}
    onKeyDown={handleKeyDown}
    onBlur={handleBlur}
    className="h-8 w-48 bg-black text-white border-primary"
    placeholder="Añadir etiqueta..."
  />
</div>
```

**Características**:
- **Fondo negro**: `bg-black`
- **Texto blanco**: `text-white`
- **Ancho**: `w-48` (192px)
- **Alto**: `h-8` (32px)
- **Z-index**: `z-30` (muy alto)
- **Eventos**:
  - `Enter`: Guarda etiqueta (`onSave`)
  - `Escape`: Cancela (`onCancel`)
  - `Blur`: Guarda automáticamente

#### Estado de Visualización (`isEditing === false` y `tag` existe)
```tsx
<div className="absolute -top-8 left-0 z-20 bg-black text-white text-xs rounded-md px-2 py-1">
  <p className="break-words leading-tight">{tag}</p>
</div>
```

**Características**:
- **Fondo negro**: `bg-black`
- **Texto blanco**: `text-white`
- **Tamaño**: `text-xs` (12px)
- **Padding**: `px-2 py-1`
- **Z-index**: `z-20`
- **Pointer events**: `pointer-events-none` (no interfiere con clicks)

### 3.2 Botón de Etiqueta (Tag)

**Ubicación**: Esquina superior izquierda (`absolute top-1 left-1`)

```tsx
<div className={cn(
  "absolute top-1 left-1 z-20 opacity-0 group-hover/image:opacity-100 transition-opacity",
  isSelected && "opacity-100"
)}>
  <Button
    variant="ghost"
    size="icon"
    className="h-7 w-7"
    onClick={handleToggleFloatingTag}
  >
    <Tag className="h-4 w-4" />
  </Button>
</div>
```

**Características**:
- **Visibilidad**: Solo en hover o cuando está seleccionado
- **Tamaño**: `h-7 w-7` (28px)
- **Función**: Toggle `showFloatingTag` en properties
- **Z-index**: `z-20`

### 3.3 Propiedades de Etiqueta

```typescript
const showFloatingTag = safeProperties?.showFloatingTag || false;
const floatingTag = safeProperties?.floatingTag || '';
```

**Almacenamiento**:
- `properties.showFloatingTag`: Boolean (modo edición)
- `properties.floatingTag`: String (texto de la etiqueta)

---

## 4. ARRASTRE Y REDIMENSIONAMIENTO

### 4.1 Arrastre

**Implementación**: Usa el sistema de drag & drop del canvas (`useCanvasDragAndDrop`)

**Clase drag-handle**:
```tsx
<div className="drag-handle cursor-grab active:cursor-grabbing">
  {/* Contenido arrastrable */}
</div>
```

**Comportamiento**:
- El elemento completo es arrastrable
- Se actualiza `x` y `y` en tiempo real
- Se guarda posición al soltar

### 4.2 Redimensionamiento

**Handles**: Proporcionados por el sistema de selección del canvas

**Tipos de handles**:
- `tl`: Top-left (esquina superior izquierda)
- `tr`: Top-right (esquina superior derecha)
- `bl`: Bottom-left (esquina inferior izquierda)
- `br`: Bottom-right (esquina inferior derecha)

**Actualización**:
```typescript
const handleResize = (elementId: string, delta: { x, y, width, height }) => {
  onElementUpdate(elementId, delta);
};
```

**Propiedades actualizadas**:
- `width`: Nuevo ancho en píxeles
- `height`: Nuevo alto en píxeles
- `x`, `y`: Posición ajustada si es necesario

---

## 5. ROTACIÓN

### 5.1 Propiedad rotation

```typescript
const rotation = safeProperties?.rotation || 0;
```

**Tipo**: `number` (grados, 0-360)

**Almacenamiento**: `properties.rotation`

### 5.2 Aplicación de Rotación

```tsx
<div style={{ transform: `rotate(${rotation || 0}deg)` }}>
  {/* Contenido */}
</div>
```

**Características**:
- Usa `transform: rotate()` CSS
- No afecta el layout (el elemento mantiene su espacio original)
- El cursor y la interacción se rotan con el elemento

### 5.3 Control de Rotación

**Nota**: La rotación se controla desde otros componentes (ej: FormattingToolbar o controles externos)

---

## 6. LABEL INFERIOR

### 6.1 Estructura

```tsx
{(isEditingLabel || (label && label.trim() !== '')) && (
  <div className="w-full pt-2 flex justify-center items-center">
    <div className="relative inline-flex items-center gap-2">
      <div
        ref={labelRef}
        contentEditable={isEditingLabel}
        suppressContentEditableWarning
        onBlur={handleLabelBlur}
        onInput={handleLabelChange}
        className={cn(
          "text-white text-xs rounded-md px-3 py-1 whitespace-nowrap outline-none max-w-full",
          isEditingLabel ? "ring-1 ring-primary cursor-text" : "cursor-pointer",
        )}
        style={{ backgroundColor: '#2eb1ca' }}
      />
      {isEditingLabel && (
        <SaveStatusIndicator status={labelSaveStatus} size="xs" />
      )}
    </div>
  </div>
)}
```

### 6.2 Características del Label

- **Color de fondo**: `#2eb1ca` (cyan)
- **Texto**: Blanco (`text-white`)
- **Tamaño**: `text-xs` (12px)
- **Padding**: `px-3 py-1`
- **Editable**: Doble clic para editar (`onDoubleClick`)
- **Autoguardado**: Usa `useAutoSave` con debounce de 2000ms

### 6.3 Edición del Label

**Activación**: Doble clic en la imagen cuando está seleccionada

```typescript
const handleDoubleClick = (e: React.MouseEvent) => {
  e.stopPropagation();
  if (isSelected) {
    onEditElement(id);
    setIsEditingLabel(true);
  }
};
```

**Autoguardado**:
```typescript
const { saveStatus: labelSaveStatus, handleBlur: handleLabelBlurAutoSave, handleChange: handleLabelChange } = useAutoSave({
  getContent: () => labelRef.current?.innerText || label,
  onSave: async (newLabel) => {
    if (newLabel !== label && labelRef.current) {
      onUpdate(id, { properties: { ...safeProperties, label: newLabel } });
    }
  },
  debounceMs: 2000,
});
```

---

## 7. SUBIDA DE IMÁGENES

### 7.1 Desde URL

**Handler**: `handleAddImageFromUrl`

**Implementación**:
```typescript
const handleAddImageFromUrl = useCallback(async () => {
  const url = prompt('Ingresa la URL de la imagen:');
  if (url) {
    await addElement('image', {
      content: { url },
      properties: { size: { width: 300, height: 200 } },
    });
  }
}, [addElement]);
```

**Características**:
- Prompt para ingresar URL
- Tamaño por defecto: 300x200px
- Usa proxy para evitar CORS

### 7.2 Subir Archivo

**Handler**: `handleUploadImage`

**Implementación**:
```typescript
const handleUploadImage = useCallback(async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    const uploadResult = await uploadFile(file, userId, storage);
    if (uploadResult.url) {
      await addElement('image', {
        content: { url: uploadResult.url },
        properties: { size: { width: 300, height: 200 } },
      });
    }
  };
  input.click();
}, [user, storage, addElement]);
```

**Características**:
- Input file oculto creado dinámicamente
- Acepta solo imágenes (`accept: 'image/*'`)
- Sube a Firebase Storage
- Obtiene URL pública
- Crea elemento con URL

### 7.3 Proxy de Imágenes

**Endpoint**: `/api/proxy`

**Uso**:
```tsx
<Image
  src={`/api/proxy?url=${encodeURIComponent(imageUrl)}`}
  alt={label || "Canvas Image"}
  fill
  className="object-cover"
/>
```

**Propósito**: Evitar problemas de CORS con imágenes externas

---

## 8. BOTÓN ABRIR IMAGEN ORIGINAL

### 8.1 Ubicación

Esquina inferior izquierda (`absolute bottom-1 left-1`)

### 8.2 Estructura

```tsx
<div className="absolute bottom-1 left-1 z-20 opacity-0 group-hover/image:opacity-100 transition-opacity">
  <Button
    variant="default"
    size="icon"
    className="h-6 w-6 rounded-full shadow-lg"
    onClick={handleOpenOriginalImage}
    title="Abrir imagen original"
  >
    <ArrowDownLeft className="h-3 w-3" />
  </Button>
</div>
```

### 8.3 Función

```typescript
const handleOpenOriginalImage = (e: React.MouseEvent) => {
  e.stopPropagation();
  window.open(imageUrl, '_blank', 'noopener,noreferrer');
};
```

**Características**:
- Abre imagen en nueva pestaña
- `noopener,noreferrer` para seguridad
- Solo visible en hover

---

## 9. IMPLEMENTACIÓN PASO A PASO

### Paso 1: Estructura Base

```tsx
import Image from 'next/image';
import FloatingTagInput from './floating-tag-input';

export default function ImageElement(props: CommonElementProps) {
  const { id, content, properties, isSelected, onUpdate } = props;
  const imageContent = content as ImageContent;
  const imageUrl = imageContent.url;
  
  return (
    <div className="group/image flex flex-col w-full h-full">
      {/* Contenido */}
    </div>
  );
}
```

### Paso 2: Contenedor de Imagen con Rotación

```tsx
<div
  className="relative flex-grow rounded-lg overflow-hidden drag-handle"
  style={{ transform: `rotate(${rotation || 0}deg)` }}
>
  <div className="relative w-full h-full bg-card">
    <Image
      src={`/api/proxy?url=${encodeURIComponent(imageUrl)}`}
      alt={label || "Canvas Image"}
      fill
      className="object-cover pointer-events-none"
    />
  </div>
</div>
```

### Paso 3: Etiqueta Flotante

```tsx
{(isSelected || showFloatingTag || floatingTag) && (
  <FloatingTagInput
    tag={floatingTag || ''}
    isEditing={!!showFloatingTag}
    onSave={handleUpdateFloatingTag}
    onCancel={handleCancelFloatingTag}
  />
)}
```

### Paso 4: Botón de Etiqueta

```tsx
<div className="absolute top-1 left-1 z-20 opacity-0 group-hover/image:opacity-100">
  <Button onClick={handleToggleFloatingTag}
  >
    <Tag />
  </Button>
</div>
```

### Paso 5: Label Inferior

```tsx
{(isEditingLabel || label) && (
  <div className="w-full pt-2 flex justify-center">
    <div
      ref={labelRef}
      contentEditable={isEditingLabel}
      onBlur={handleLabelBlur}
      onInput={handleLabelChange}
      style={{ backgroundColor: '#2eb1ca' }}
    />
  </div>
)}
```

### Paso 6: Integrar Autoguardado

```tsx
const { saveStatus, handleBlur, handleChange } = useAutoSave({
  getContent: () => labelRef.current?.innerText || label,
  onSave: async (newLabel) => onUpdate(id, { properties: { ...safeProperties, label: newLabel } }),
  debounceMs: 2000,
});
```

---

## 10. TIPOS DE DATOS

### 10.1 ImageContent

```typescript
interface ImageContent {
  url: string;
}
```

### 10.2 ImageElementProperties

```typescript
interface ImageElementProperties extends CanvasElementProperties {
  rotation?: number;
  showFloatingTag?: boolean;
  floatingTag?: string;
  label?: string;
}
```

---

## 11. DEPENDENCIAS

- `next/image`: Componente Image de Next.js
- `lucide-react`: Iconos (Tag, ArrowDownLeft)
- `@/components/ui/button`: Componente Button
- `@/components/ui/input`: Componente Input
- `@/components/canvas/elements/floating-tag-input`: Componente de etiqueta flotante
- `@/hooks/use-auto-save`: Hook de autoguardado
- `/api/proxy`: Endpoint para proxy de imágenes

---

## 12. CONSIDERACIONES TÉCNICAS

### 12.1 CORS y Proxy

- Todas las imágenes externas pasan por `/api/proxy`
- Evita problemas de CORS
- Mantiene seguridad

### 12.2 Rendimiento

- `object-cover` para mantener proporción
- `pointer-events-none` en imagen para mejor interacción
- Rotación con CSS `transform` (mejor rendimiento)

### 12.3 Accesibilidad

- `alt` text dinámico basado en label
- Tooltips en botones
- Navegación por teclado en inputs

---

**FIN DEL MANUAL**

