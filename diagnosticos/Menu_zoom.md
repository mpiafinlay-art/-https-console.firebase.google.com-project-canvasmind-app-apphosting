# Manual Completo: Menú Zoom (ZoomControls)

**Fecha de creación**: 4 de Diciembre 2024  
**Componente**: `zoom-controls.tsx`  
**Versión**: Completa con 10 controles

---

## 📋 TABLA DE CONTENIDOS

1. [Descripción General](#descripción-general)
2. [Estructura Visual](#estructura-visual)
3. [Controles de Zoom](#controles-de-zoom)
4. [Controles de Navegación](#controles-de-navegación)
5. [Controles de Capas](#controles-de-capas)
6. [Posicionamiento](#posicionamiento)
7. [Implementación Paso a Paso](#implementación-paso-a-paso)

---

## 1. DESCRIPCIÓN GENERAL

El **ZoomControls** es un componente de controles flotantes para gestionar el zoom y navegación del canvas:

- **10 controles**: Zoom, navegación, y gestión de capas
- **Posición fija**: Esquina inferior derecha (o centrado abajo en móvil)
- **Responsive**: Se adapta a dispositivos móviles
- **Indicador de zoom**: Muestra porcentaje actual

---

## 2. ESTRUCTURA VISUAL

```
┌─────────────────────────────────────────────────────────────┐
│ [−] [100%] [+] [|] [Focus] [Home] [|] [↑↑] [↓] [↓↓] │
└─────────────────────────────────────────────────────────────┘
```

**Posición**: Esquina inferior derecha (o centrado abajo en móvil)  
**Fondo**: `bg-background` con borde y sombra

---

## 3. CONTROLES DE ZOOM

### 3.1 Zoom Out (ZoomOut)
- **Icono**: `ZoomOut`
- **Función**: `zoomOut()`
- **Tamaño**: `h-8 w-8`
- **Tooltip**: "Alejar"

### 3.2 Indicador de Zoom
- **Tipo**: Botón de texto
- **Contenido**: `{Math.round(scale * 100)}%`
- **Función**: `resetZoom()` al hacer clic
- **Estilo**: `h-8 w-12 text-sm font-medium text-muted-foreground`

### 3.3 Zoom In (ZoomIn)
- **Icono**: `ZoomIn`
- **Función**: `zoomIn()`
- **Tamaño**: `h-8 w-8`
- **Tooltip**: "Acercar"

### 3.4 Separador
- **Tipo**: Línea vertical
- **Componente**: `<Separator orientation="vertical" className="h-6" />`

---

## 4. CONTROLES DE NAVEGACIÓN

### 4.1 Focus (Centrar en Contenido)
- **Icono**: `Focus`
- **Función**: `centerOnElements()`
- **Tamaño**: `h-8 w-8`
- **Tooltip**: "Centrar en Contenido"
- **Comportamiento**: Ajusta zoom y offset para mostrar todos los elementos

### 4.2 Home (Ir al Inicio)
- **Icono**: `Home`
- **Función**: `goToHome()`
- **Tamaño**: `h-8 w-8`
- **Tooltip**: "Ir al Inicio"
- **Comportamiento**: Restaura posición inicial del canvas

---

## 5. CONTROLES DE CAPAS

### 5.1 Visibilidad Condicional

Los controles de capas solo se muestran cuando:
- `selectedElement !== null`
- `selectedElement.type !== 'frame'`

### 5.2 Traer al Frente (ChevronsUp)
- **Icono**: `ChevronsUp` (doble flecha arriba)
- **Función**: `onBringToFront(selectedElement.id)`
- **Tamaño**: `h-8 w-8`
- **Tooltip**: "Traer al frente"
- **Comportamiento**: Establece `zIndex` al máximo

### 5.3 Enviar Hacia Atrás (ChevronDown)
- **Icono**: `ChevronDown` (flecha abajo)
- **Función**: `onMoveBackward(selectedElement.id)`
- **Tamaño**: `h-8 w-8`
- **Tooltip**: "Enviar hacia atrás"
- **Comportamiento**: Reduce `zIndex` en 1

### 5.4 Enviar al Fondo (ChevronsDown)
- **Icono**: `ChevronsDown` (doble flecha abajo)
- **Función**: `onSendToBack(selectedElement.id)`
- **Tamaño**: `h-8 w-8`
- **Tooltip**: "Enviar al fondo"
- **Comportamiento**: Establece `zIndex` al mínimo

---

## 6. POSICIONAMIENTO

### 6.1 Estilos Base

```tsx
<div className={cn(
  "absolute z-[10002] flex items-center gap-1 rounded-lg border bg-background p-1 shadow-md",
  isMobile ? "bottom-4 left-1/2 -translate-x-1/2" : "bottom-4 right-4"
)}>
```

**Características**:
- **Z-index**: `10002` (muy alto)
- **Desktop**: Esquina inferior derecha (`bottom-4 right-4`)
- **Móvil**: Centrado abajo (`bottom-4 left-1/2 -translate-x-1/2`)
- **Layout**: Flex horizontal con gap

---

## 7. IMPLEMENTACIÓN PASO A PASO

### Paso 1: Estructura Base

```tsx
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ZoomIn, ZoomOut, Focus, Home, ChevronsUp, ChevronDown, ChevronsDown } from 'lucide-react';

export default function ZoomControls({
  zoomIn,
  zoomOut,
  resetZoom,
  scale,
  centerOnElements,
  goToHome,
  selectedElement,
  onBringToFront,
  BringToFront,
  onSendToBack,
  onMoveBackward,
  isMobile,
}) {
  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-1">
      {/* Controles */}
    </div>
  );
}
```

### Paso 2: Controles de Zoom

```tsx
<Button variant="ghost" size="icon" onClick={zoomOut}>
  <ZoomOut className="h-4 w-4" />
</Button>
<button onClick={resetZoom} className="h-8 w-12 text-sm">
  {Math.round(scale * 100)}%
</button>
<Button variant="ghost" size="icon" onClick={zoomIn}>
  <ZoomIn className="h-4 w-4" />
</Button>
<Separator orientation="vertical" className="h-6" />
```

### Paso 3: Controles de Navegación

```tsx
<Button variant="ghost" size="icon" onClick={centerOnElements}>
  <Focus className="h-4 w-4" />
</Button>
<Button variant="ghost" size="icon" onClick={goToHome}>
  <Home className="h-4 w-4" />
</Button>
```

### Paso 4: Controles de Capas (Condicionales)

```tsx
{selectedElement && selectedElement.type !== 'frame' && (
  <>
    <Separator orientation="vertical" className="h-6 mx-1" />
    <Button variant="ghost" size="icon" onClick={() => onBringToFront(selectedElement.id)}>
      <ChevronsUp className="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="icon" onClick={() => onMoveBackward(selectedElement.id)}>
      <ChevronDown className="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="icon" onClick={() => onSendToBack(selectedElement.id)}>
      <ChevronsDown className="h-4 w-4" />
    </Button>
  </>
)}
```

---

## 8. PROPS

### 8.1 ZoomControlsProps

```typescript
type ZoomControlsProps = {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  scale: number;
  centerOnElements: () => void;
  goToHome: () => void;
  selectedElement: WithId<CanvasElement> | null;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onMoveBackward: (id: string) => void;
  isMobile: boolean;
};
```

---

## 9. DEPENDENCIAS

- `lucide-react`: Iconos
- `@/components/ui/button`: Componente Button
- `@/components/ui/separator`: Componente Separator

---

**FIN DEL MANUAL**

