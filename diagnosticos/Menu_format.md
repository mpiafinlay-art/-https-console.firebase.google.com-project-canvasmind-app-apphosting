# Manual Completo: Menú Format (FormattingToolbar)

**Fecha de creación**: 4 de Diciembre 2024  
**Componente**: `formatting-toolbar.tsx`  
**Versión**: Completa con 17 botones de formato

---

## 📋 TABLA DE CONTENIDOS

1. [Descripción General](#descripción-general)
2. [Estructura Visual](#estructura-visual)
3. [Botones del Toolbar](#botones-del-toolbar)
4. [Posicionamiento](#posicionamiento)
5. [Implementación Paso a Paso](#implementación-paso-a-paso)

---

## 1. DESCRIPCIÓN GENERAL

El **FormattingToolbar** es una barra de herramientas flotante para formatear texto con:

- **17 botones**: Cada uno con su función específica
- **Fondo negro**: `bg-black` con texto/iconos blancos
- **Arrastrable**: Se puede mover por la pantalla
- **Persistente**: Guarda posición en localStorage
- **Tamaño reducido**: 20% más pequeño que el diseño original

---

## 2. ESTRUCTURA VISUAL

```
┌─────────────────────────────────────────────────────────────┐
│ [Pin] [⋮] [Tag] [T] [|] [Link] [|] [&] [|] [U] [B] [I] [S] │
│ [|] [←] [=] [→] [≡] [|] [📅] [🔍] [|] [Eraser] [Move] [Lienzo] [X] │
└─────────────────────────────────────────────────────────────┘
```

**Fondo**: Negro (`bg-black`)  
**Botones blancos**: Fondo blanco con iconos negros  
**Botones grises**: Fondo gris oscuro (`#2a2a2a`) con iconos blancos

---

## 3. BOTONES DEL TOOLBAR

### 3.1 Botón 0: MapPin (Fijar Posición)
- **Tipo**: Botón blanco
- **Visibilidad**: Solo para elementos `comment`
- **Función**: `onEditComment(selectedComment)`
- **Tooltip**: "Fijar posición en el tablero / Editar Etiqueta"

### 3.2 Botón 1: MoreVertical (Más Opciones)
- **Tipo**: Cuadrado gris oscuro
- **Dropdown**: Vacío (sin funcionalidad aún)
- **Tooltip**: "Más opciones"

### 3.3 Botón 2: Tag (Agregar Etiqueta)
- **Tipo**: Botón blanco
- **Función**: `onAddComment()`
- **Tooltip**: "Agregar Etiqueta"

### 3.4 Botón 3: Type (Tamaño de Fuente)
- **Tipo**: Botón blanco con Popover
- **Popover**: Lista de tamaños (12px, 14px, 16px, 18px, 20px, 24px, 32px)
- **Función**: Envuelve selección en `<span style="font-size: Xpx">`
- **Tooltip**: "Tamaño de Texto"

### 3.5 Separador Visual
- **Tipo**: Línea vertical
- **Estilo**: `w-px h-6 bg-white/30 mx-1`

### 3.6 Botón 4: LinkIcon (Insertar Enlace)
- **Tipo**: Botón blanco
- **Función**: Prompt para URL, crea `<a>` tag
- **Tooltip**: "Insertar Enlace"

### 3.7 Botón 5: & (Estilo de Fuente)
- **Tipo**: Botón blanco
- **Función**: Sin implementar (TODO)
- **Tooltip**: "Estilo de Fuente"

### 3.8 Botón 6: Underline (Subrayado con Color)
- **Tipo**: Botón blanco con Popover
- **Popover**: Grid de 8 colores
- **Función**: `applyColoredUnderline(color)`
- **Colores**: Teal, Orange-red, Lime green, Yellow, Goldenrod, Bright blue, Dark gray, Slate blue
- **Tooltip**: "Subrayado"

### 3.9 Botón 7: Bold (Negrita)
- **Tipo**: Botón blanco
- **Función**: `document.execCommand('bold')`
- **Tooltip**: "Negrita"

### 3.10 Botón 8: Italic (Cursiva)
- **Tipo**: Botón blanco
- **Función**: `document.execCommand('italic')`
- **Tooltip**: "Cursiva"

### 3.11 Botón 9: Strikethrough (Tachado)
- **Tipo**: Botón blanco
- **Función**: `document.execCommand('strikeThrough')`
- **Tooltip**: "Tachado"

### 3.12 Botón 10-13: Alineación
- **AlignLeft**: `justifyLeft`
- **AlignCenter**: `justifyCenter`
- **AlignRight**: `justifyRight`
- **AlignJustify**: `justifyFull`

### 3.13 Botón 14: Calendar (Insertar Fecha)
- **Tipo**: Botón blanco
- **Función**: Inserta fecha en formato `-- dd/MM/yy `
- **Color**: `#a0a1a6` (gris claro)
- **Tooltip**: "Insertar Fecha"

### 3.14 Botón 15: Search (Búsqueda)
- **Tipo**: Botón blanco
- **Función**: Sin implementar (TODO)
- **Tooltip**: "Buscar"

### 3.15 Botón 16: Eraser (Limpiar Formato)
- **Tipo**: Botón blanco
- **Función**: `clearFormatting()` - Remueve formato y subrayados coloreados
- **Tooltip**: "Limpiar Formato"

### 3.16 Botón 17: Move (Mover/Pan)
- **Tipo**: Botón blanco
- **Estado**: Activo cuando `isPanningActive === true`
- **Función**: `onPanToggle()`
- **Tooltip**: "Mover"

### 3.17 Botón 18: RectangleHorizontal (Lienzo)
- **Tipo**: Botón blanco
- **Función**: `handleAddLienzo()` - Crea columna con título "Lienzo"
- **Tooltip**: "Lienzo"

### 3.18 Botón 19: X (Cerrar)
- **Tipo**: Cuadrado gris oscuro
- **Función**: `onClose()`
- **Tooltip**: "Cerrar"

---

## 4. POSICIONAMIENTO

### 4.1 Componente Rnd

```tsx
<Rnd
  size={{ width: 'auto', height: 'auto' }}
  position={rndPosition}
  onDragStop={onDragStop}
  dragHandleClassName="drag-handle"
  bounds="window"
  enableResizing={false}
  className="z-[60000] pointer-events-auto"
>
```

**Características**:
- **Tamaño**: Automático (se ajusta al contenido)
- **Z-index**: `60000` (muy alto)
- **Bounds**: Limitado a la ventana
- **Resizing**: Deshabilitado

### 4.2 Posición Inicial

```typescript
useEffect(() => {
  const savedPosition = localStorage.getItem('formattingToolbarPosition');
  if (savedPosition) {
    setRndPosition(JSON.parse(savedPosition));
  } else {
    const centerX = (window.innerWidth - 600) / 2;
    setRndPosition({ x: centerX, y: 20 });
  }
}, [isOpen]);
```

**Por defecto**: Centrado arriba (`y: 20`)

---

## 5. ESTILOS

### 5.1 Toolbar Container

```tsx
<div className={cn(
  "bg-black text-white py-1.5 px-2.5",
  "flex items-center justify-center w-full min-h-[38px] gap-0.5",
  "text-sm"
)}>
```

### 5.2 Botones Blancos

```tsx
const whiteButtonClassName = cn(
  "bg-white border-none rounded-md px-2.5 py-1.5",
  "cursor-pointer flex items-center justify-center",
  "min-w-[29px] h-7 transition-colors",
  "hover:bg-gray-100"
);
```

### 5.3 Botones Grises Oscuros

```tsx
const darkSquareClassName = cn(
  "bg-[#2a2a2a] border-none rounded",
  "cursor-pointer flex items-center justify-center",
  "w-7 h-7 p-1.5 transition-colors",
  "hover:bg-[#3a3a3a]"
);
```

### 5.4 Iconos

```tsx
const iconClassName = "w-[14px] h-[14px] text-black"; // Para botones blancos
// Para botones grises: "w-[14px] h-[14px] text-white"
```

---

## 6. FUNCIONES DE FORMATO

### 6.1 handleFormat

```typescript
const handleFormat = (e: React.MouseEvent, command: string, value?: string) => {
  e.preventDefault();
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    // Si no hay selección, aplicar al elemento activo
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement.isContentEditable) {
      activeElement.focus();
      document.execCommand(command, false, value);
    }
    return;
  }
  document.execCommand(command, false, value);
};
```

### 6.2 applyColoredUnderline

```typescript
const applyColoredUnderline = (e: React.MouseEvent, color: string) => {
  e.preventDefault();
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return;
  }
  const range = selection.getRangeAt(0);
  const span = document.createElement('span');
  span.style.textDecoration = 'underline';
  span.style.textDecorationColor = color;
  span.style.textDecorationThickness = '2px';
  span.appendChild(range.extractContents());
  range.insertNode(span);
};
```

### 6.3 clearFormatting

```typescript
const clearFormatting = (e: React.MouseEvent) => {
  e.preventDefault();
  document.execCommand('removeFormat', false);
  
  // Remover subrayados coloreados manualmente
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    if (container.nodeType === Node.ELEMENT_NODE) {
      const element = container as HTMLElement;
      const spans = element.querySelectorAll('span[style*="text-decoration"]');
      spans.forEach(span => {
        const parent = span.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(span.textContent || ''), span);
          parent.normalize();
        }
      });
    }
  }
};
```

---

## 7. IMPLEMENTACIÓN PASO A PASO

### Paso 1: Estructura Base

```tsx
import { Rnd } from 'react-rnd';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function FormattingToolbar({ isOpen, onClose, ... }) {
  const [rndPosition, setRndPosition] = useState({ x: 0, y: 0 });
  
  if (!isOpen) return null;
  
  return (
    <Rnd position={rndPosition} onDragStop={onDragStop}>
      <div className="bg-black text-white">
        {/* Botones */}
      </div>
    </Rnd>
  );
}
```

### Paso 2: Botones Blancos

```tsx
<button
  className={whiteButtonClassName}
  onMouseDown={(e) => handleFormat(e, 'bold')}
  title="Negrita"
>
  <Bold className={iconClassName} />
</button>
```

### Paso 3: Botones con Popover

```tsx
<Popover open={popoverOpen === 'fontSize'} onOpenChange={...}>
  <PopoverTrigger asChild>
    <button className={whiteButtonClassName}>
      <Type className={iconClassName} />
    </button>
  </PopoverTrigger>
  <PopoverContent>
    {/* Lista de tamaños */}
  </PopoverContent>
</Popover>
```

### Paso 4: Separadores

```tsx
<div className="w-px h-6 bg-white/30 mx-1" />
```

### Paso 5: Botón Cerrar

```tsx
<button
  className={darkSquareClassName}
  onClick={onClose}
  title="Cerrar"
>
  <X className="w-[14px] h-[14px] text-white" />
</button>
```

---

## 8. DEPENDENCIAS

- `react-rnd`: Componente arrastrable
- `lucide-react`: Iconos
- `@/components/ui/popover`: Componente Popover
- `date-fns`: Formateo de fechas
- `document.execCommand`: API nativa del navegador (deprecated pero funcional)

---

**FIN DEL MANUAL**

