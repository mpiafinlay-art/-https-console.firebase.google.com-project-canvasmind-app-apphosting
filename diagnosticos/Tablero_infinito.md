# Manual Completo: Tablero Infinito

**Fecha de creación**: 4 de Diciembre 2024  
**Componentes**: `board-content.tsx`, `useZoomPan.ts`, `useCanvasDragAndDrop.ts`  
**Versión**: Completa con zoom, pan, drag & drop, y selección múltiple

---

## 📋 TABLA DE CONTENIDOS

1. [Descripción General](#descripción-general)
2. [Estructura del Tablero](#estructura-del-tablero)
3. [Sistema de Zoom](#sistema-de-zoom)
4. [Sistema de Pan (Desplazamiento)](#sistema-de-pan-desplazamiento)
5. [Drag & Drop de Elementos](#drag--drop-de-elementos)
6. [Redimensionamiento](#redimensionamiento)
7. [Selección Múltiple](#selección-múltiple)
8. [Fondo con Patrón de Puntos](#fondo-con-patrón-de-puntos)
9. [Implementación Paso a Paso](#implementación-paso-a-paso)

---

## 1. DESCRIPCIÓN GENERAL

El **Tablero Infinito** es el contenedor principal donde se colocan y manipulan todos los elementos del canvas. Características:

- **Zoom infinito**: Acercar/alejar con rueda del mouse o controles
- **Pan infinito**: Desplazarse en cualquier dirección
- **Drag & Drop**: Arrastrar elementos por el canvas
- **Redimensionamiento**: Cambiar tamaño de elementos con handles
- **Selección múltiple**: Seleccionar varios elementos simultáneamente
- **Fondo con patrón**: Grid de puntos para referencia visual

---

## 2. ESTRUCTURA DEL TABLERO

### 2.1 Componente Principal

El tablero está implementado en `board-content.tsx`:

```tsx
<div
  ref={canvasRef}
  className="relative w-full h-full overflow-hidden bg-dot-grid"
  style={{
    transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`,
    transformOrigin: '0 0',
  }}
>
  {/* Elementos del canvas */}
</div>
```

### 2.2 Capas del Tablero

1. **Capa de Transformación** (externa):
   - Aplica `scale` y `translate` para zoom y pan
   - `transformOrigin: '0 0'` para que el zoom ocurra desde la esquina superior izquierda

2. **Capa de Elementos** (interna):
   - Contiene todos los elementos renderizados
   - Tiene transformación inversa para mantener posiciones correctas

3. **Capa de Selección** (overlay):
   - Muestra bordes de selección y handles de redimensionamiento
   - Usa `AnimatePresence` de framer-motion para animaciones

---

## 3. SISTEMA DE ZOOM

### 3.1 Hook useZoomPan

**Ubicación**: `src/lib/hooks/useZoomPan.ts`

**Estado**:
- `scale`: Número que representa el nivel de zoom (1.0 = 100%)
- `offset`: Punto `{ x, y }` que representa el desplazamiento del canvas

**Constantes**:
- `INITIAL_SCALE = 1` (100%)
- `ZOOM_FACTOR = 1.1` (incremento del 10% por paso)

### 3.2 Funciones de Zoom

#### zoomIn(focusPoint?: Point)
- Multiplica `scale` por `ZOOM_FACTOR`
- Si hay `focusPoint`, ajusta `offset` para mantener el punto enfocado
- **Fórmula de ajuste**:
  ```typescript
  newOffset.x -focusPoint + (focusPoint - oldOffset) * (newScale / oldScale)
  ```

#### zoomOut(focusPoint?: Point)
- Divide `scale` por `ZOOM_FACTOR`
- Mismo ajuste de `offset` que `zoomIn`

#### resetZoomPan()
- Restaura `scale = 1` y `offset = { x: 0, y: 0 }`

### 3.3 Controles de Zoom

**Desde la Rueda del Mouse**:
```tsx
onWheel={(e) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();
    const point = clientToCanvas(e.clientX, e.clientY);
    if (e.deltaY < 0) zoomIn(point);
    else zoomOut(point);
  }
}}
```

**Desde Controles UI**:
- Botones `ZoomIn` y `ZoomOut` en `ZoomControls`
- Porcentaje de zoom mostrado como texto clickeable
- Atajos de teclado: `Cmd/Ctrl + =` (zoom in), `Cmd/Ctrl + -` (zoom out), `Cmd/Ctrl + 0` (reset)

---

## 4. SISTEMA DE PAN (DESPLAZAMIENTO)

### 4.1 Pan con Rueda del Mouse

```tsx
onWheel={(e) => {
  if (!(e.ctrlKey || e.metaKey)) {
    panCanvas(0, -e.deltaY);
  }
}}
```

- Sin `Ctrl/Cmd`: Desplaza verticalmente
- `deltaY` negativo = desplazar hacia arriba
- `deltaY` positivo = desplazar hacia abajo

### 4.2 Pan con Modo Pan

**Activación**: Presionar `Espacio` o botón "Mover" en menú format

**Estado**: `panMode` en `useZoomPan`

**Comportamiento**:
- Cuando `panMode === true`, el cursor cambia a `cursor-grab-active`
- El arrastre del mouse desplaza el canvas en lugar de arrastrar elementos

### 4.3 Función panCanvas

```typescript
const panCanvas = (deltaX: number, deltaY: number) => {
  setOffset(prev => ({ 
    x: prev.x + deltaX, 
    y: prev.y + deltaY 
  }));
};
```

---

## 5. DRAG & DROP DE ELEMENTOS

### 5.1 Hook useCanvasDragAndDrop

**Ubicación**: `src/lib/hooks/useCanvasDragAndDrop.ts`

**Estados**:
- `draggedElementId`: ID del elemento siendo arrastrado
- `startDragPosition`: Posición inicial del mouse
- `startElementPosition`: Posiciones iniciales de elementos seleccionados

### 5.2 Flujo de Drag & Drop

#### 1. Inicio del Arrastre (`startDrag`)

```typescript
const startDrag = (event: React.MouseEvent) => {
  const clickedElement = target.closest('[data-element-id]');
  const elementId = clickedElement?.dataset.elementId;
  
  if (elementId) {
    setDraggedElementId(elementId);
    startDragPosition.current = { x: event.clientX, y: event.clientY };
    
    // Guardar posiciones iniciales de elementos seleccionados
    const initialPositions = {};
    selectedElementIds.forEach(id => {
      const el = elements.find(e => e.id === id);
      if (el) initialPositions[id] = { x: el.x, y: el.y };
    });
  }
};
```

#### 2. Durante el Arrastre (`handleDrag`)

```typescript
const handleDrag = (event: React.MouseEvent) => {
  const deltaX = (event.clientX - startDragPosition.current.x) / scale;
  const deltaY = (event.clientY - startDragPosition.current.y) / scale;
  
  // Actualizar posiciones de elementos seleccionados
  selectedElementIds.forEach(id => {
    const initialPos = startElementPosition.current[id];
    const newX = initialPos.x + deltaX;
    const newY = initialPos.y + deltaY;
    onElementUpdate(id, { x: newX, y: newY });
  });
};
```

**Importante**: Los deltas se dividen por `scale` para compensar el zoom.

#### 3. Fin del Arrastre (`handleDragStop`)

```typescript
const handleDragStop = () => {
  setDraggedElementId(null);
  startDragPosition.current = null;
  startElementPosition.current = null;
};
```

### 5.3 Identificación de Elementos

**Atributo `data-element-id`**:
- Cada elemento debe tener `data-element-id={id}`
- Se usa `closest('[data-element-id]')` para encontrar el elemento clickeado

**Clase `drag-handle`**:
- Elementos con esta clase pueden ser arrastrados
- Ejemplo: `GripVertical` en headers de elementos

---

## 6. REDIMENSIONAMIENTO

### 6.1 Handles de Redimensionamiento

**Componente**: `ResizeHandle`

**Tipos de Handles**:
- `tl`: Top-left (esquina superior izquierda)
- `tr`: Top-right (esquina superior derecha)
- `bl`: Bottom-left (esquina inferior izquierda)
- `br`: Bottom-right (esquina inferior derecha)

**Renderizado**:
```tsx
{selectedElementIds.length > 0 && selectionBounds && (
  <motion.div style={{ left, top, width, height, border: '1px dashed #6366F1' }}>
    <ResizeHandle type="tl" onResize={onResize} onResizeStop={onResizeStop} />
    <ResizeHandle type="tr" onResize={onResize} onResizeStop={onResizeStop} />
    <ResizeHandle type="bl" onResize={onResize} onResizeStop={onResizeStop} />
    <ResizeHandle type="br" onResize={onResize} onResizeStop={onResizeStop} />
  </motion.div>
)}
```

### 6.2 Funciones de Redimensionamiento

#### handleResize(elementId, delta)
- Actualiza tamaño en tiempo real durante el arrastre
- `delta` contiene `{ x, y, width, height }`

#### handleResizeStop(elementId, finalRect)
- Actualiza tamaño final cuando se suelta el mouse
- `finalRect` contiene `{ x, y, width, height }`

---

## 7. SELECCIÓN MÚLTIPLE

### 7.1 Hook useSelection

**Ubicación**: `src/lib/hooks/useSelection.ts`

**Funciones**:
- `clearSelection()`: Limpia todas las selecciones
- `addSelection(id)`: Agrega un elemento a la selección
- `removeSelection(id)`: Remueve un elemento de la selección
- `isSelected(id)`: Verifica si un elemento está seleccionado
- `updateSelectionBounds(bounds)`: Actualiza los bounds del rectángulo de selección

### 7.2 Selección con Teclado

**Shift/Ctrl/Cmd + Click**:
```tsx
onMouseDown={(e) => onSelectElement(id, e.shiftKey || e.ctrlKey || e.metaKey)}
```

- Sin modificadores: Selección única
- Con modificadores: Agrega a selección existente

### 7.3 Bounds de Selección

**Cálculo**: Se calcula el rectángulo que contiene todos los elementos seleccionados

**Visualización**: Borde punteado (`border: '1px dashed #6366F1'`) alrededor de la selección

---

## 8. FONDO CON PATRÓN DE PUNTOS

### 8.1 Clase CSS `bg-dot-grid`

**Definición en `globals.css`**:
```css
.bg-dot-grid {
  background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: 0 0;
}
```

**Características**:
- Puntos grises (`#cbd5e1`) de 1px
- Espaciado de 20px entre puntos
- Se repite infinitamente

### 8.2 Efecto Visual

- Proporciona referencia visual para alineación
- Se escala con el zoom del canvas
- No afecta el rendimiento (CSS puro)

---

## 9. IMPLEMENTACIÓN PASO A PASO

### Paso 1: Estructura Base

```tsx
import { useRef } from 'react';
import { useZoomPan } from '@/lib/hooks/useZoomPan';
import { useCanvasDragAndDrop } from '@/lib/hooks/useCanvasDragAndDrop';
import { useSelection } from '@/lib/hooks/useSelection';

const BoardContent = ({ elements, onElementUpdate, ... }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { scale, offset, panCanvas, zoomIn, zoomOut, resetZoomPan } = useZoomPan(canvasRef);
  const { startDrag, handleDrag, handleDragStop } = useCanvasDragAndDrop({ ... });
  const { isSelected, clearSelection } = useSelection({ ... });
  
  return (
    <div ref={canvasRef} className="relative w-full h-full overflow-hidden bg-dot-grid">
      {/* Contenido */}
    </div>
  );
};
```

### Paso 2: Aplicar Transformaciones

```tsx
<div
  style={{
    transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`,
    transformOrigin: '0 0',
  }}
  onMouseDown={startDrag}
  onMouseMove={handleDrag}
  onMouseUp={handleDragStop}
  onWheel={(e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const point = clientToCanvas(e.clientX, e.clientY);
      if (e.deltaY < 0) zoomIn(point);
      else zoomOut(point);
    } else {
      panCanvas(0, -e.deltaY);
    }
  }}
>
```

### Paso 3: Renderizar Elementos

```tsx
<div
  style={{
    transform: `scale(${1 / scale}) translate(${-offset.x}px, ${-offset.y}px)`,
    transformOrigin: '0 0',
  }}
>
  {elements.map(element => (
    <ElementComponent key={element.id} {...element} />
  ))}
</div>
```

### Paso 4: Agregar Selección Visual

```tsx
{selectedElementIds.length > 0 && selectionBounds && (
  <motion.div
    style={{
      left: selectionBounds.x,
      top: selectionBounds.y,
      width: selectionBounds.width,
      height: selectionBounds.height,
      border: '1px dashed #6366F1',
    }}
  >
    {/* Handles de redimensionamiento */}
  </motion.div>
)}
```

---

## 10. CONVERSIÓN DE COORDENADAS

### 10.1 clientToCanvas

**Función**: Convierte coordenadas del mouse (pantalla) a coordenadas del canvas

```typescript
const clientToCanvas = (clientX: number, clientY: number): Point => {
  const canvasRect = canvasRef.current.getBoundingClientRect();
  const x = (clientX - canvasRect.left - offset.x) / scale;
  const y = (clientY - canvasRect.top - offset.y) / scale;
  return { x, y };
};
```

**Uso**: Para zoom enfocado en un punto específico

---

## 11. CONSIDERACIONES TÉCNICAS

### 11.1 Rendimiento

- **Transformaciones CSS**: Usar `transform` en lugar de cambiar `left/top` para mejor rendimiento
- **Debounce**: No aplicar debounce en drag (debe ser fluido)
- **Virtualización**: No implementada (todos los elementos se renderizan)

### 11.2 Prevención de Eventos

- `onMouseDown` con `stopPropagation()` en elementos para evitar arrastrar el canvas
- `onClick` en canvas para limpiar selección cuando se hace clic fuera

### 11.3 Z-Index

- Canvas base: `z-index: 0`
- Elementos: `z-index` según `element.zIndex`
- Selección overlay: `z-index` alto (sin especificar, usa orden DOM)
- Controles UI: `z-index: 10000+`

---

## 12. ARCHIVOS RELACIONADOS

- `board-content.tsx`: Componente principal del tablero
- `useZoomPan.ts`: Hook de zoom y pan
- `useCanvasDragAndDrop.ts`: Hook de drag & drop
- `useSelection.ts`: Hook de selección múltiple
- `zoom-controls.tsx`: Controles UI de zoom
- `resize-handle.tsx`: Handles de redimensionamiento

---

**FIN DEL MANUAL**

