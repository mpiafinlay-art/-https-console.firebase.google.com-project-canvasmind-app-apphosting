# Manual Completo: Menú Principal (ToolsSidebar)

**Fecha de creación**: 4 de Diciembre 2024  
**Componente**: `tools-sidebar.tsx`  
**Versión**: Completa con todos los botones y dropdowns

---

## 📋 TABLA DE CONTENIDOS

1. [Descripción General](#descripción-general)
2. [Estructura Visual](#estructura-visual)
3. [Botones Principales](#botones-principales)
4. [Dropdowns](#dropdowns)
5. [Posicionamiento](#posicionamiento)
6. [Implementación Paso a Paso](#implementación-paso-a-paso)

---

## 1. DESCRIPCIÓN GENERAL

El **ToolsSidebar** es la barra lateral flotante que contiene todos los controles principales de la aplicación:

- **Arrastrable**: Se puede mover por la pantalla
- **Persistente**: Guarda posición en localStorage
- **13 botones principales**: Cada uno con su funcionalidad
- **Dropdowns**: Menús desplegables con opciones adicionales
- **Responsive**: Adapta posición en móviles

---

## 2. ESTRUCTURA VISUAL

```
┌─────────────────┐
│   [Grip]        │ ← Drag Handle
├─────────────────┤
│   [Tableros]    │ ← Dropdown
│   [Dictar]      │ ← Botón simple
│   [Cuadernos]   │ ← Dropdown
│   [Notas]       │ ← Dropdown
│   [To-do]       │ ← Botón simple
│   [Tools]       │ ← Botón toggle
│   [Imagen]      │ ← Dropdown
│   [Texto]       │ ← Botón simple
│   [Columna]     │ ← Botón simple
│   [Etiquetas]   │ ← Dropdown
│   [Más]         │ ← Dropdown
└─────────────────┘
```

---

## 3. BOTONES PRINCIPALES

### 3.1 Componente SidebarButton

```tsx
const SidebarButton = forwardRef<HTMLButtonElement, {
  label: string;
  icon?: React.ElementType;
  isActive?: boolean;
}>(({ label, icon: Icon, isActive, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    className={cn(
      'flex flex-col items-center justify-center h-auto py-2 px-2 w-full text-[11px] gap-1',
      'hover:bg-slate-100',
      isActive && 'bg-purple-500 text-white hover:bg-purple-600',
    )}
  >
    {Icon && <Icon className={cn('size-[18px]', isActive ? 'text-white' : 'text-slate-800')} />}
    <span>{label}</span>
  </Button>
));
```

**Características**:
- **Tamaño**: `w-full` (72px de ancho)
- **Layout**: Flex column (icon arriba, texto abajo)
- **Texto**: `text-[11px]` (11px)
- **Icono**: `size-[18px]` (18px)
- **Estado activo**: Fondo morado (`bg-purple-500`)

### 3.2 Lista de Botones

#### 1. Tableros (LayoutDashboard)
- **Tipo**: Dropdown
- **Opciones**:
  - Nuevo Tablero
  - Renombrar Tablero
  - Eliminar Tablero
  - Abrir Tablero... (submenu con lista)

#### 2. Dictar (Mic)
- **Tipo**: Botón simple
- **Estado**: `isListening` (rojo cuando está activo)
- **Función**: `onToggleDictation()`
- **Estilo activo**: `bg-red-100 text-red-600`

#### 3. Cuadernos (BookCopy)
- **Tipo**: Dropdown
- **Opciones**:
  - + Super cuaderno
  - Agregar notepad
  - Nuevo Notepad
  - Cuaderno Test
  - Cuadernos Abiertos (submenu)
  - Cerrados (submenu)

#### 4. Notas (StickyNote)
- **Tipo**: Dropdown
- **Opciones**: 6 colores (Amarillo, Rosa, Azul, Verde, Naranja, Morado)
- **Función**: `handleAddElement('sticky', { color })`

#### 5. To-do (List)
- **Tipo**: Botón simple
- **Función**: `handleAddElement('todo')`

#### 6. Tools (Wrench)
- **Tipo**: Botón toggle
- **Estado**: `isFormatToolbarOpen`
- **Función**: `onFormatToggle()`
- **Estilo activo**: `bg-purple-500 text-white`

#### 7. Imagen (ImageIcon)
- **Tipo**: Dropdown
- **Opciones**:
  - Desde URL
  - Subir

#### 8. Texto (FileText)
- **Tipo**: Botón simple
- **Función**: `handleAddElement('text')`

#### 9. Columna (Columns)
- **Tipo**: Botón simple
- **Función**: `handleAddElement('column', { content, properties })`

#### 10. Etiquetas (Tag)
- **Tipo**: Dropdown
- **Contenido**: Lista de etiquetas existentes o "No hay etiquetas"
- **Función**: `onLocateElement(comment.id)`

#### 11. Más (MoreHorizontal)
- **Tipo**: Dropdown
- **Opciones**:
  - Formato de Texto
  - Exportar a PNG: alta resolución
  - Limpiar Tablero (con confirmación)
  - Cerrar Sesión

---

## 4. DROPDOWNS

### 4.1 Estructura de Dropdown

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <SidebarButton icon={Icon} label="Label" />
  </DropdownMenuTrigger>
  <DropdownMenuContent side="right" align="start" sideOffset={5}>
    <DropdownMenuItem onClick={handler}>
      <Icon className="mr-2 h-4 w-4" />
      <span>Texto</span>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### 4.2 Submenús

```tsx
<DropdownMenuSub>
  <DropdownMenuSubTrigger>
    <span>Texto</span>
  </DropdownMenuSubTrigger>
  <DropdownMenuSubContent>
    {items.map(item => (
      <DropdownMenuItem key={item.id} onClick={handler}>
        <span>{item.name}</span>
      </DropdownMenuItem>
    ))}
  </DropdownMenuSubContent>
</DropdownMenuSub>
```

---

## 5. POSICIONAMIENTO

### 5.1 Componente Rnd

```tsx
<Rnd
  default={{
    x: rndPosition.x,
    y: rndPosition.y,
    width: 72,
    height: 'auto',
  }}
  minWidth={72}
  maxWidth={72}
  bounds="window"
  dragHandleClassName="drag-handle"
  onDragStop={onDragStop}
  className="z-[10001]"
>
```

**Características**:
- **Ancho fijo**: 72px
- **Alto automático**: Se ajusta al contenido
- **Bounds**: Limitado a la ventana
- **Z-index**: `10001` (muy alto)
- **Drag handle**: Solo el grip vertical

### 5.2 Persistencia

```typescript
useEffect(() => {
  const savedPosition = localStorage.getItem('toolsSidebarPosition');
  if (savedPosition) {
    setRndPosition(JSON.parse(savedPosition));
  }
}, []);

const onDragStop = (e: any, d: { x: number; y: number }) => {
  const newPosition = { x: d.x, y: d.y };
  setRndPosition(newPosition);
  localStorage.setItem('toolsSidebarPosition', JSON.stringify(newPosition));
};
```

---

## 6. IMPLEMENTACIÓN PASO A PASO

### Paso 1: Estructura Base

```tsx
import { Rnd } from 'react-rnd';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export default function ToolsSidebar(props: ToolsSidebarProps) {
  const [rndPosition, setRndPosition] = useState({ x: 20, y: 80 });
  
  return (
    <Rnd default={{ x: 20, y: 80, width: 72, height: 'auto' }}>
      <div className="bg-canvas-teal rounded-lg shadow-lg p-2 flex flex-col gap-1">
        {/* Botones */}
      </div>
    </Rnd>
  );
}
```

### Paso 2: Drag Handle

```tsx
<div className="drag-handle cursor-grab active:cursor-grabbing py-1 flex justify-center">
  <GripVertical className="size-5" />
</div>
```

### Paso 3: Botones con Dropdowns

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <SidebarButton icon={LayoutDashboard} label="Tableros" />
  </DropdownMenuTrigger>
  <DropdownMenuContent side="right" align="start">
    <DropdownMenuItem onClick={handler}>
      <Plus className="mr-2 h-4 w-4" />
      <span>Nuevo Tablero</span>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Paso 4: Botones Simples

```tsx
<SidebarButton
  icon={List}
  label="To-do"
  onClick={() => handleAddElement('todo')}
/>
```

### Paso 5: Persistencia de Posición

```tsx
useEffect(() => {
  const saved = localStorage.getItem('toolsSidebarPosition');
  if (saved) setRndPosition(JSON.parse(saved));
}, []);

const onDragStop = (e: any, d: { x: number; y: number }) => {
  const pos = { x: d.x, y: d.y };
  setRndPosition(pos);
  localStorage.setItem('toolsSidebarPosition', JSON.stringify(pos));
};
```

---

## 7. PROPS

### 7.1 ToolsSidebarProps

```typescript
type ToolsSidebarProps = {
  elements: WithId<CanvasElement>[];
  boards: WithId<Board>[];
  onUploadImage: () => void;
  onAddImageFromUrl: () => void;
  onPanToggle: () => void;
  isListening?: boolean;
  onToggleDictation?: () => void;
  onRenameBoard: () => void;
  onDeleteBoard: () => void;
  onOpenNotepad: (id: string) => void;
  onLocateElement: (id: string) => void;
  addElement: (type: ElementType, props?: any) => Promise<string>;
  clearCanvas: () => void;
  onExportBoardToPng: () => void;
  onFormatToggle: () => void;
  isFormatToolbarOpen: boolean;
  isPanningActive?: boolean;
};
```

---

## 8. DEPENDENCIAS

- `react-rnd`: Componente arrastrable
- `lucide-react`: Iconos
- `@/components/ui/dropdown-menu`: Componentes de dropdown
- `@/components/ui/button`: Componente Button
- `localStorage`: Persistencia de posición

---

**FIN DEL MANUAL**

