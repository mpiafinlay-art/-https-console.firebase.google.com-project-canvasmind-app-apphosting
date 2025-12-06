# INFORME TÉCNICO ACTUAL - CanvasMind App
**Fecha de Análisis:** Diciembre 2024  
**Metodología:** Análisis Forense de Código (Code Forensics)  
**Alcance:** Carpeta `src/` completa (componentes, hooks, lib)

---

## 1. ARQUITECTURA GENERAL

### 1.1 Stack Tecnológico Principal

**Framework y Librerías Core:**
- **Next.js 14.2.33** (App Router)
- **React 18** (Client Components con `'use client'`)
- **TypeScript 5**
- **Firebase 11.10.0** (Firestore, Auth, Storage)
- **Tailwind CSS 3.4.1** + **tailwindcss-animate**
- **ShadCN UI** (componentes Radix UI)

**Gestión de Estado:**
- **Zustand 5.0.8** (`src/lib/store/boardStore.ts`) - Estado global de tableros y elementos
- **React Context** (`src/context/AuthContext.tsx`, `src/firebase/client-provider.tsx`) - Autenticación y Firebase
- **Hooks personalizados** (`src/hooks/`) - Lógica de negocio encapsulada

**Interacción y UI:**
- **react-rnd 10.4.11** - Elementos arrastrables y redimensionables
- **@hello-pangea/dnd 18.0.1** - Drag & Drop para listas (To-Do)
- **react-contenteditable 3.3.7** - Contenido editable en tiempo real
- **react-color 2.19.3** - Selector de colores
- **framer-motion 12.23.24** - Animaciones
- **lucide-react 0.475.0** - Iconos

**Utilidades:**
- **date-fns 3.6.0** - Manipulación de fechas
- **react-hotkeys-hook 5.2.1** - Atajos de teclado
- **use-debounce 10.0.6** - Debounce para callbacks
- **class-variance-authority** + **clsx** + **tailwind-merge** - Utilidades CSS

### 1.2 Gestión de Estado Global

**Zustand Store (`src/lib/store/boardStore.ts`):**
```typescript
interface BoardState {
  elements: WithId<CanvasElement>[];
  board: WithId<Board> | null;
  selectedElementIds: string[];
  isLoading: boolean;
  error: string | null;
  
  // Métodos principales:
  loadBoard: (boardId: string, userId: string) => Promise<string | null>;
  createBoard: (userId: string, boardName?: string) => Promise<string>;
  addElement: (element: Omit<CanvasElement, 'id'>) => Promise<void>;
  updateElement: (elementId: string, updates: Partial<CanvasElement>) => Promise<void>;
  deleteElement: (elementId: string) => Promise<void>;
  setSelectedElementIds: (ids: string[]) => void;
}
```

**Estructura de Datos en Firestore:**
```
users/{userId}/
  ├── canvasBoards/{boardId}/
  │   ├── (metadata: name, userId, createdAt, updatedAt)
  │   └── canvasElements/{elementId}/
  │       └── (element data: type, content, properties, zIndex, etc.)
```

**Hooks de Estado:**
- `useBoardState` (`src/hooks/use-board-state.ts`) - Suscripción en tiempo real a Firestore
- `useElementManager` (`src/hooks/use-element-manager.ts`) - CRUD de elementos
- `useBoardStore` (`src/lib/store/boardStore.ts`) - Store Zustand (legacy, parcialmente usado)

---

## 2. CATÁLOGO DE COMPONENTES VISUALES

### 2.1 ToolsSidebar (Menú Principal)

**Ubicación:** `src/components/canvas/tools-sidebar.tsx`  
**Tipo:** Componente flotante arrastrable (`react-rnd`)  
**Posición:** Lateral izquierdo (por defecto: x: 20, y: 80)  
**Ancho:** 72px (reducido 10% desde 80px)  
**Fondo:** `#b7ddda` (teal claro)

#### Botones del Menú Principal (Orden de Arriba a Abajo):

1. **Tableros** (`LayoutDashboard`)
   - **Tipo:** DropdownMenu
   - **Sub-opciones:**
     - "Nuevo Tablero" (`Plus`) → Abre `CreateBoardDialog`
     - "Renombrar Tablero" (`Save`) → Ejecuta `onRenameBoard`
     - "Eliminar Tablero" (`Trash2`) → Ejecuta `onDeleteBoard`
     - Separador
     - "Abrir Tablero..." → Submenu con lista de tableros disponibles

2. **Dictar** (`Mic`)
   - **Tipo:** Botón toggle
   - **Estado activo:** Fondo rojo (`bg-red-100 text-red-600`)
   - **Función:** `onToggleDictation` → Activa/desactiva reconocimiento de voz
   - **Lógica:** Usa `useSpeechRecognition` hook

3. **Mover** (`Move`)
   - **Tipo:** Botón toggle
   - **Estado activo:** `bg-purple-500 text-white`
   - **Función:** `onPanToggle` → Activa modo de paneo del canvas
   - **Lógica:** Cambia `isPanningActive` en `Canvas`

4. **Cuadernos** (`BookCopy`)
   - **Tipo:** DropdownMenu
   - **Sub-opciones:**
     - "Nuevo Cuaderno" → `addElement('notepad')`
     - "Nuevo Notepad" → `addElement('notepad-simple')`
     - Separador
     - "Cuadernos Abiertos (N)" → Submenu con lista de cuadernos visibles (`hidden !== true`)
     - "Cerrados (N)" → Submenu con lista de cuadernos minimizados (`hidden === true`)

5. **Lienzo** (`RectangleHorizontal`)
   - **Tipo:** Botón simple
   - **Función:** Crea una columna con título "Lienzo" (794x1021px, fondo blanco)

6. **Notas** (`StickyNote`)
   - **Tipo:** DropdownMenu con colores
   - **Sub-opciones:** 6 colores predefinidos (Amarillo, Rosa, Azul, Verde, Naranja, Morado)
   - **Función:** `addElement('sticky', { color: colorName })`

7. **Tools** (`Wrench`)
   - **Tipo:** Botón toggle
   - **Estado activo:** `bg-purple-500 text-white`
   - **Función:** `onFormatToggle` → Muestra/oculta `FormattingToolbar`
   - **Nota:** El FormattingToolbar está siempre visible según código actual (`isOpen={true}`)

8. **Imagen** (`ImageIcon`)
   - **Tipo:** DropdownMenu
   - **Sub-opciones:**
     - "Desde URL" (`LinkIcon`) → Abre `AddImageFromUrlDialog`
     - "Subir" (`Upload`) → Ejecuta `onUploadImage` (input file)

9. **Texto** (`FileText`)
   - **Tipo:** Botón simple
   - **Función:** `addElement('text')` → Crea elemento de texto editable

10. **Columna** (`Columns`)
    - **Tipo:** Botón simple
    - **Función:** `addElement('column', { content: { title: 'Columna', elementIds: [] }, properties: { size: { width: 300, height: 600 }, backgroundColor: 'white' } })`

11. **Portal** (`Link`)
    - **Tipo:** Botón simple
    - **Función:** `onAddPortal` → Abre `AddPortalDialog` para crear enlace a otro tablero

12. **Etiquetas** (`Tag`)
    - **Tipo:** DropdownMenu
    - **Estado:** Siempre visible (incluso si no hay etiquetas)
    - **Contenido:** Lista de elementos tipo `comment` con `label` o `title`
    - **Si no hay etiquetas:** Muestra "No hay etiquetas" (disabled)

13. **Más** (`MoreHorizontal`)
    - **Tipo:** DropdownMenu
    - **Sub-opciones:**
      - "Formato de Texto" (`Wrench`) → `onFormatToggle`
      - "Exportar IMG tablero" (`FileImage`) → `onExportBoardToPng`
      - Separador
      - "Plantillas" (`LayoutTemplate`) → Submenu:
        - "Planner 3" → `onLoadTemplate('planner-3')`
        - "Planificador Semanal" → `onLoadTemplate('weekly-planner')`
      - Separador
      - "Limpiar Tablero" (`Trash2`) → Abre `AlertDialog` de confirmación → `clearCanvas`
      - "Cerrar Sesión" (`LogOut`) → `handleSignOut` → Redirige a `/`

---

### 2.2 FormattingToolbar (Menú de Formato)

**Ubicación:** `src/components/canvas/formatting-toolbar.tsx`  
**Tipo:** Barra fija en la parte superior  
**Posición:** `position: fixed, top: 0, left: 0, right: 0`  
**Z-Index:** 60000  
**Fondo:** `#000000` (negro)  
**Estado:** Siempre visible (`isOpen={true}`)

#### Botones del FormattingToolbar (Orden de Izquierda a Derecha):

1. **Más Opciones** (`MoreVertical`)
   - **Estilo:** Cuadrado gris oscuro (`#2a2a2a`)
   - **Estado:** Sin lógica asignada (placeholder)

2. **Etiquetas** (`Tag`)
   - **Estilo:** Botón blanco redondeado
   - **Función:** `onAddComment()` → Crea elemento `comment` vinculado al elemento seleccionado

3. **Tamaño de Texto** (`Type` + `ChevronDown`)
   - **Tipo:** Popover con dropdown
   - **Opciones:** 12px, 14px, 16px, 18px, 20px, 24px, 32px
   - **Función:** Aplica `fontSize` al texto seleccionado usando `document.execCommand`

4. **Estilo de Fuente** (Símbolo `&`)
   - **Estilo:** Botón blanco redondeado
   - **Estado:** Sin lógica asignada (placeholder)

5. **Separador** (línea vertical gris)

6. **Subrayado de Color** (`Underline`)
   - **Tipo:** Popover con paleta de colores
   - **Colores:** Teal (#14b8a6), Orange-red (#f97316), Lime green (#84cc16), Yellow (#eab308), Goldenrod (#f59e0b), Bright blue (#3b82f6), Dark gray (#1f2937), Slate blue (#475569)
   - **Función:** `applyColoredUnderline()` → Crea `<span>` con `text-decoration-color`

7. **Negrita** (`Bold`)
   - **Función:** `document.execCommand('bold')`

8. **Cursiva** (`Italic`)
   - **Función:** `document.execCommand('italic')`

9. **Tachado** (`Strikethrough`)
   - **Función:** `document.execCommand('strikeThrough')`

10. **Separador**

11. **Lista** (`List` + `ChevronDown`)
    - **Tipo:** Popover con opciones
    - **Opciones:** "Lista Desordenada", "Lista Ordenada"
    - **Función:** `document.execCommand('insertUnorderedList')` o `insertOrderedList`

12. **Calendario** (`Calendar`)
    - **Función:** `handleInsertDate()` → Inserta fecha formateada (`-- dd/MM/yy `) con color `#a0a1a6`

13. **Borrador** (`Eraser`)
    - **Función:** `clearFormatting()` → `document.execCommand('removeFormat')` + elimina `<span>` con decoraciones

14. **Cerrar** (`X`)
    - **Estilo:** Cuadrado gris oscuro (`#2a2a2a`)
    - **Estado:** Deshabilitado (menú siempre visible)

---

### 2.3 ZoomControls (Menú de Zoom)

**Ubicación:** `src/components/canvas/zoom-controls.tsx`  
**Tipo:** Barra flotante en la esquina inferior derecha (móvil: centrada abajo)  
**Z-Index:** 10002

#### Botones del ZoomControls:

1. **Alejar** (`ZoomOut`)
   - **Función:** `zoomOut()` → Reduce `scale` en factor 1.1

2. **Porcentaje** (Texto: `{scale * 100}%`)
   - **Función:** `resetZoom()` → Restablece `scale` a 1.0

3. **Acercar** (`ZoomIn`)
   - **Función:** `zoomIn()` → Aumenta `scale` en factor 1.1

4. **Separador vertical**

5. **Centrar en Contenido** (`Focus`)
   - **Función:** `centerOnElements()` → Calcula bounding box de todos los elementos y centra la vista

6. **Ir al Inicio** (`Home`)
   - **Función:** `goToHome()` → Restablece scroll a (0, 0) y zoom a 1.0

7. **Separador vertical** (solo si hay elemento seleccionado)

8. **Traer al Frente** (`ChevronsUp`) - Solo si hay elemento seleccionado
   - **Función:** `onBringToFront(id)` → Aumenta `zIndex` al máximo

9. **Enviar hacia Atrás** (`ChevronDown`) - Solo si hay elemento seleccionado
   - **Función:** `onMoveBackward(id)` → Reduce `zIndex` en 1

10. **Enviar al Fondo** (`ChevronsDown`) - Solo si hay elemento seleccionado
    - **Función:** `onSendToBack(id)` → Establece `zIndex` a 0

---

### 2.4 Elementos del Lienzo (CanvasElements)

#### 2.4.1 Notepad (Cuaderno)

**Ubicación:** `src/components/canvas/elements/notepad-element.tsx`  
**Tamaño por defecto:** 794x978px (formato Letter) o 302x491px (formato 10x15)  
**Componente base:** ShadCN `Card`

**Header (Barra Superior):**
- **Drag Handle** (`GripVertical`) - Clase `drag-handle`
- **Título** (`contentEditable`) - Editable directamente, guarda en `content.title`
- **Botones (solo cuando no está en preview):**
  1. **Guardar** (`Save`) → `saveContent()` → Guarda contenido HTML del editor
  2. **Info** (`Info`) → Toggle `isInfoOpen` → Muestra overlay con "Comandos de Dictado por Voz" (WIP)
  3. **Seleccionar Todo** (`FileSignature`) → `handleSelectAllText()` → Selecciona todo el texto del editor
  4. **Limpiar Formato** (`Eraser`) → `handleRemoveFormat()` → `document.execCommand('removeFormat')`
  5. **Herramientas de Formato** (`Wrench`) → `onFormatToggle()` → Muestra FormattingToolbar
  6. **Insertar Fecha** (`CalendarDays`) → `handleInsertDate()` → Inserta fecha formateada
  7. **Más Opciones** (`MoreVertical`) → DropdownMenu:
     - "Exportar a PNG" (`FileImage`) → `handleExportNotepadToPng()` → Convierte cuaderno a imagen
     - "Cambiar formato..." (`Settings`) → `onChangeNotepadFormat(id)` → Abre `ChangeFormatDialog`
  8. **Minimizar/Maximizar** (`Minus`/`Maximize`) → `toggleMinimize()` → Guarda contenido antes de minimizar, restaura tamaño original al maximizar
  9. **Eliminar** (`Trash2`) → Abre `DeleteNotepadDialog` de confirmación → `deleteElement(id)`
  10. **Cerrar** (`X`) → `handleCloseNotepad()` → Establece `hidden: true`

**Contenido:**
- Editor `contentEditable` con fondo de líneas (simula papel rayado)
- Paginación en footer (`PaginationControls`):
  - Botón "Anterior" (deshabilitado en página 0)
  - Indicador "Página X/Y"
  - Botón "Siguiente" (deshabilitado en última página)
  - Botón "Agregar Página" (máximo 20 páginas)

**Estado Minimizado:**
- Muestra solo header con título y botón "Maximizar"
- Altura: 48px

---

#### 2.4.2 StickyNote (Nota Adhesiva)

**Ubicación:** `src/components/canvas/elements/sticky-note-element.tsx`  
**Tamaño por defecto:** 224x224px  
**Componente base:** ShadCN `Card`  
**Colores disponibles:** Yellow (#fffb8b), Pink (#ffc2d4), Blue (#bce8f1), Green (#d4edda), Orange (#ffeeba), Purple (#e9d5ff)

**Header (Esquina Superior Derecha, visible en hover):**
- **Drag Handle** (`GripVertical`) - Clase `drag-handle`
- **Agregar Contenido** (`Plus`) → Inserta `<br>` en el editor
- **Cambiar Color** (`Paintbrush`) - Solo si está seleccionado → Popover con `TwitterPicker` (react-color)
- **Rotar** (`RotateCw`) - Solo si está seleccionado → `handleRotate()` → Incrementa `properties.rotation` en 15° (módulo 360)
- **Cerrar/Eliminar** (`X`) → `deleteElement(id)` (sin confirmación)

**Contenido:**
- Editor `contentEditable` con fondo del color seleccionado
- Guarda automáticamente en `onBlur`

**REGLA #4:** Las notas adhesivas se pueden rotar (implementado)

---

#### 2.4.3 TodoList (Lista de Tareas)

**Ubicación:** `src/components/canvas/elements/todo-list-element.tsx`  
**Tamaño por defecto:** 300x150px (mínimo: 250x200px, máximo: 500x600px)  
**Componente base:** ShadCN `Card`, `CardHeader`, `CardContent`

**Header:**
- **Drag Handle** (`GripVertical`) - Clase `drag-handle`
- **Título** (`Input`) - Editable, guarda en `content.title`

**Contenido:**
- Lista de tareas usando `@hello-pangea/dnd` (DragDropContext)
- Cada tarea tiene:
  - **Drag Handle** (`GripVertical`) - Para reordenar
  - **Checkbox** - Marca como completada (`item.completed`)
  - **Texto** (`Input`) - Editable, muestra `line-through` si está completada
  - **Eliminar** (`Trash2`) - Solo visible si está seleccionado y en hover → `handleDeleteItem(index)`
- Si no hay tareas: Muestra "No hay tareas. Agrega una nueva..."

**Footer (solo si está seleccionado):**
- Input para nueva tarea + Botón `Plus` → `handleAddItem()`

---

#### 2.4.4 Column (Columna)

**Ubicación:** `src/components/canvas/elements/column-element.tsx`  
**Tamaño por defecto:** 300x500px (mínimo: 200x300px)  
**Componente base:** ShadCN `Card`, `CardHeader`, `CardContent`

**Header:**
- **Drag Handle** (`GripVertical`) - Visible en hover
- **Título** (`input type="text"`) - Editable, guarda en `content.title`
- **Cerrar/Eliminar** (`X`) - Solo visible si está seleccionado y en hover → `deleteElement(id)` (sin confirmación)

**Contenido:**
- Si está vacía (`elementIds.length === 0`): Muestra "Arrastra elementos aquí"
- **Lógica de anclaje:** Los elementos arrastrados sobre la columna se anclan automáticamente (ver sección Drag & Drop)

**Nota:** La funcionalidad de anclaje está implementada en `transformable-element.tsx` usando `elementFromPoint` para detectar el drop target.

---

#### 2.4.5 Text (Texto)

**Ubicación:** `src/components/canvas/elements/text-element.tsx`  
**Tamaño por defecto:** Variable (según props)  
**Componente base:** `react-contenteditable`

**Características:**
- Editor `ContentEditable` (react-contenteditable)
- Doble clic para activar edición (`setIsEditing(true)`)
- Estilos dinámicos desde `properties`: `fontSize`, `fontWeight`, `textAlign`, `fontStyle`, `color`
- Guarda automáticamente en `onChange`

**Sin header visible** - El elemento completo es el editor

---

#### 2.4.6 Image (Imagen)

**Ubicación:** `src/components/canvas/elements/image-element.tsx`  
**Tamaño:** Variable (según imagen o props)  
**Componente base:** `div` con `next/image`

**Controles (visibles en hover o cuando está seleccionado):**
- **Etiqueta** (`Tag`) - Esquina superior izquierda → `handleToggleFloatingTag()` → Muestra `FloatingTagInput`
- **Abrir Original** (`ArrowDownLeft`) - Esquina inferior izquierda → `handleOpenOriginalImage()` → Abre imagen en nueva pestaña

**Características:**
- Doble clic para editar etiqueta (`setIsEditingLabel(true)`)
- Rotación soportada (`properties.rotation`)
- Etiqueta flotante editable (`FloatingTagInput`)

---

#### 2.4.7 Planner-3 (Planificador Semanal)

**Ubicación:** `src/components/canvas/elements/planner-3-element.tsx`  
**Tamaño por defecto:** 1450x950px  
**Componente base:** `div` con grid

**Estructura:**
- 8 tarjetas (`card1` a `card8`)
- Navegación de semanas: Botones "Semana Anterior" y "Siguiente Semana"
- Cada tarjeta es `ContentEditable`
- Enter (sin Shift) inserta divisor visual (`border-top: 2px solid #14b8a6`)

**Header (si existe):**
- Botones de navegación de semana
- Botón "Duplicar" (`onDuplicateElement`)
- Botón "Eliminar" (`deleteElement`)

---

#### 2.4.8 Otros Elementos

**Comment (Comentario/Etiqueta):**
- Tamaño: 32x32px
- Contenido: `{ title, label, comment }`
- Se vincula a elementos mediante `parentId`

**Portal:**
- Tamaño: 200x150px
- Contenido: `{ boardId, boardName }`
- Función: Enlace a otro tablero

**Weekly Planner:**
- Similar a Planner-3 pero con estructura diferente
- Tamaño: 983x794px

**Notepad Simple:**
- Versión simplificada del cuaderno
- Tamaño: 302x491px
- Sin paginación

---

## 3. LÓGICA DE INTERACCIÓN

### 3.1 Arrastrar y Soltar (Drag & Drop)

**Implementación Principal:** `react-rnd` (`src/components/canvas/transformable-element.tsx`)

**Flujo de Arrastre:**

1. **Inicio del Arrastre:**
   - El usuario hace clic en el `drag-handle` o en el elemento
   - `Rnd` detecta el inicio del drag
   - `onDragStop` se ejecuta cuando se suelta

2. **Detección de Drop Target:**
   ```typescript
   const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
   const columnElement = dropTarget.closest('[data-element-type="column"]');
   ```
   - Si se suelta sobre una columna (`data-element-type="column"`):
     - El elemento se ancla a la columna (`parentId = columnId`)
     - Se calcula `relativePosition` dentro de la columna
     - Se agrega el `elementId` al array `elementIds` de la columna

3. **Actualización de Posición:**
   - Si no hay `parentId`: Se actualiza `properties.position` directamente
   - Si hay `parentId`: Se actualiza `properties.relativePosition` y se mantiene `position` absoluta

4. **Persistencia:**
   - `updateElement()` llama a `updateDoc()` de Firestore
   - Se actualiza `updatedAt: serverTimestamp()`

**Drag & Drop Interno (To-Do Lists):**
- Usa `@hello-pangea/dnd` (`DragDropContext`, `Droppable`, `Draggable`)
- Reordena items dentro del array `content.items`
- Guarda automáticamente en `onDragEnd`

---

### 3.2 Zoom y Paneo del Lienzo

**Hook Principal:** `useZoomPan` (`src/lib/hooks/useZoomPan.ts`)

**Estado:**
```typescript
const [scale, setScale] = useState<number>(1.0); // Factor de zoom
const [offset, setOffset] = useState<Point>({ x: 0, y: 0 }); // Offset de pan
const [panMode, setPanMode] = useState<boolean>(false); // Modo paneo activo
```

**Funciones de Zoom:**
- `zoomIn(focusPoint?)`: Multiplica `scale` por `ZOOM_FACTOR` (1.1)
  - Si hay `focusPoint`, ajusta `offset` para mantener el punto enfocado
- `zoomOut(focusPoint?)`: Divide `scale` por `ZOOM_FACTOR`
- `resetZoomPan()`: Restablece `scale = 1.0` y `offset = { x: 0, y: 0 }`

**Funciones de Paneo:**
- `panCanvas(deltaX, deltaY)`: Suma `deltaX` y `deltaY` al `offset`
- Modo paneo activado por botón "Mover" en `ToolsSidebar`

**Implementación en Canvas (`src/components/canvas/canvas.tsx`):**
- **Paneo con mouse:**
  - Botón medio (rueda presionada) o `Alt + clic izquierdo`
  - `handleMouseDown` detecta el trigger
  - `handleMouseMove` actualiza `scrollLeft` y `scrollTop` del contenedor
- **Zoom con rueda:**
  - `handleWheel` detecta `e.deltaY`
  - Calcula nuevo `scale` y ajusta scroll para mantener posición del mouse

**Aplicación de Transformaciones:**
```typescript
// En TransformableElement (Rnd)
scale={scale} // Aplica zoom a los elementos

// En Canvas
style={{
  transform: `scale(${scale})`,
  transformOrigin: '0 0',
}}
```

**Inicialización del Scroll:**
- REGLA #1: El tablero siempre se inicia en scroll (0, 0)
- Implementado en `canvas.tsx` con `useEffect` que fuerza scroll a origen

---

### 3.3 Selección de Elementos

**Hook:** `useSelection` (`src/lib/hooks/useSelection.ts`)

**Mecánica:**
- Clic simple: Selecciona un elemento (deselecciona otros)
- `Shift + Clic` o `Ctrl/Cmd + Clic`: Selección múltiple
- Clic en canvas vacío: Deselecciona todos

**Estado:**
- `selectedElementIds: string[]` almacenado en `useBoardStore`
- `setSelectedElementIds(ids)` actualiza la selección

**Visualización:**
- Elementos seleccionados muestran borde azul (`border: 2px solid hsl(var(--primary))`)
- Implementado en `TransformableElement` con `style.border`

---

## 4. ESTADO ACTUAL Y DEPENDENCIAS

### 4.1 Archivos Clave de Lógica de Negocio

**Gestión de Elementos:**
- `src/hooks/use-element-manager.ts` - CRUD completo de elementos
  - `addElement(type, props)` - Crea elementos centrados en viewport
  - `updateElement(id, updates)` - Actualiza propiedades
  - `deleteElement(id, allElements)` - Elimina elemento (y hijos si es columna)
  - `unanchorElement(id)` - Desancla elemento de columna
  - `loadTemplate(templateName)` - Carga plantillas JSON

**Gestión de Tableros:**
- `src/hooks/use-board-state.ts` - Suscripción en tiempo real a Firestore
  - `handleRenameBoard(newName)` - Renombra tablero
  - `handleDeleteBoard()` - Elimina tablero completo
  - `clearCanvas(elementsToClear)` - Limpia todos los elementos

**Componente Principal del Tablero:**
- `src/app/board/[boardId]/page.tsx` - Página principal del tablero
  - Integra `Canvas`, `ToolsSidebar`, `FormattingToolbar`, `ZoomControls`
  - Maneja estado de dictado, diálogos, y coordinación entre componentes

**Renderizado de Elementos:**
- `src/components/board-content.tsx` - Componente legacy (parcialmente usado)
- `src/components/canvas/canvas.tsx` - Componente principal del canvas
- `src/components/canvas/transformable-element.tsx` - Wrapper para elementos arrastrables

**Autenticación:**
- `src/firebase/auth.ts` - Funciones de autenticación (Google, Anonymous, Email/Password)
- `src/firebase/client-provider.tsx` - Provider de Firebase (inicialización)
- `src/context/AuthContext.tsx` - Context de autenticación

---

### 4.2 Hooks Personalizados

**`src/hooks/use-speech-recognition.ts`:**
- Integración con Web Speech API (`webkitSpeechRecognition`)
- `startListening()` / `stopListening()`
- Callback `onTranscript(transcript, isFinal)`
- Manejo de permisos de micrófono

**`src/hooks/use-user-preferences.ts`:**
- Almacena preferencias del usuario en localStorage
- `micPermission`, `theme`, etc.

**`src/hooks/use-toast.ts`:**
- Wrapper para ShadCN Toast
- `toast({ title, description, variant })`

**`src/lib/hooks/useKeyboardNavigation.ts`:**
- Atajos de teclado (Delete, Escape, Arrow keys, etc.)
- Integrado con `react-hotkeys-hook`

---

### 4.3 Tipos y Interfaces

**`src/lib/types.ts`:**
- `ElementType` - Union type de todos los tipos de elementos
- `CanvasElement` - Interface base de elementos
- `WithId<T>` - Utility type que agrega `id: string`
- Interfaces de contenido: `NotepadContent`, `TodoContent`, `ColumnContent`, etc.
- `CommonElementProps` - Props compartidas por todos los elementos

**Estructura de `CanvasElement`:**
```typescript
{
  type: ElementType;
  userId: string;
  content: ContentType; // Varía según el tipo
  properties: CanvasElementProperties; // { position, size, zIndex, rotation, color, etc. }
  parentId?: string | null; // Para elementos anclados
  hidden?: boolean; // Para elementos minimizados
  zIndex?: number; // Nivel de apilamiento
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## 5. OBSERVACIONES Y NOTAS TÉCNICAS

### 5.1 Migración de Estructura de Datos

**Legacy vs Nueva Estructura:**
- **Legacy:** `x`, `y`, `width`, `height`, `zIndex` en raíz del elemento
- **Nueva:** Todo dentro de `properties: { position: { x, y }, size: { width, height }, zIndex }`
- **Función de migración:** `migrateElement()` en `transformable-element.tsx` convierte elementos legacy automáticamente

### 5.2 Lazy Loading

**Componentes con Lazy Loading:**
- `TransformableElement` usa `React.lazy()` para cargar elementos bajo demanda
- `Suspense` con `ElementSuspenseFallback` muestra spinner durante carga

### 5.3 Optimizaciones

**Debounce:**
- `useDebouncedCallback` en `board-content.tsx` para actualizaciones de scroll
- Evita actualizaciones excesivas durante paneo

**Memoización:**
- `useMemo` para filtrar elementos (notepads, comments) en `tools-sidebar.tsx`
- `useCallback` para funciones pasadas como props

### 5.4 Funcionalidades Pendientes o Incompletas

**Sin Lógica Asignada:**
- Botón "Más Opciones" (`MoreVertical`) en `FormattingToolbar`
- Botón "Estilo de Fuente" (símbolo `&`) en `FormattingToolbar`
- Overlay "Comandos de Dictado por Voz" en `NotepadElement` (marca "WIP")

**Funcionalidades Parciales:**
- Anclaje de elementos a columnas funciona, pero la visualización dentro de la columna puede mejorar
- Exportación a PNG implementada pero puede tener limitaciones de tamaño

---

## 6. RESUMEN EJECUTIVO

### Tecnologías Principales:
- **Frontend:** Next.js 14 + React 18 + TypeScript
- **Backend:** Firebase (Firestore, Auth, Storage)
- **UI:** Tailwind CSS + ShadCN UI
- **Estado:** Zustand + React Context + Hooks personalizados
- **Interacción:** react-rnd, @hello-pangea/dnd

### Componentes Clave:
- **ToolsSidebar:** 13 botones principales con dropdowns y submenús
- **FormattingToolbar:** 14 botones de formato de texto (siempre visible)
- **ZoomControls:** 10 botones de zoom y navegación
- **Elementos:** 12 tipos diferentes (Notepad, StickyNote, TodoList, Column, Text, Image, Planner-3, Weekly Planner, Comment, Portal, Notepad Simple, Connector)

### Funcionalidades Implementadas:
✅ Drag & Drop completo con anclaje a columnas  
✅ Zoom y paneo del canvas  
✅ Selección múltiple de elementos  
✅ Dictado por voz (Web Speech API)  
✅ Rotación de notas adhesivas  
✅ Eliminación con confirmación  
✅ Redimensionamiento de elementos  
✅ Paginación en cuadernos  
✅ Exportación a PNG  

### Funcionalidades Pendientes:
⚠️ Botones placeholder sin lógica  
⚠️ Visualización mejorada de elementos anclados  
⚠️ Documentación de comandos de dictado  

---

**Fin del Informe Técnico**

