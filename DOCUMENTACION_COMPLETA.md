# DOCUMENTACIÓN MAESTRA Y MANUAL TÉCNICO: CANVASMIND

ESTE ARCHIVO CONTIENE LA LÓGICA EXACTA Y PROBADA DE LA APLICACIÓN.
CUALQUIER RECONSTRUCCIÓN DEBE BASARSE ESTRICTAMENTE EN ESTAS DEFINICIONES.

---

## 1. HISTORIAL DE CAMBIOS Y MEJORAS EXITOSAS (HITOS 1-8)

### Hito 1: Arquitectura Fundamental
- **Backend:** Definido en `docs/backend.json` (User, CanvasBoard, CanvasElement).
- **Seguridad:** `firestore.rules` asegura aislamiento por usuario (`/users/{userId}`).
- **Provider:** `FirebaseClientProvider` para evitar errores de hidratación en Next.js.
- **Errores:** `FirebaseErrorListener` centraliza manejo de permisos.

### Hito 2: Autenticación y Home
- **Auth:** Google y Anónimo.
- **Home Logic:** `ensureUserDocument` verifica existencia en DB. Redirección automática al último tablero (`orderBy('updatedAt', 'desc')`) o creación de uno nuevo.

### Hito 3: Lienzo (Canvas)
- **Core:** `board-content.tsx` orquesta el estado.
- **Realtime:** `onSnapshot` para suscripción en tiempo real a `canvasElements`.
- **Canvas:** Espacio de 80000x80000px. Zoom y Paneo implementados.
- **Migración:** `migrateElement` convierte datos legacy (x,y root) a `properties` on-the-fly.

### Hito 4: Refactorización de Hooks
- Separación de lógica en: `useBoardState`, `useElementManager`, `useCanvasInteractions`, `useSpeech`, `useUserPreferences`.
- **Paleta de Colores (Texto):** Teal (#16b5a8), Rojo (#cb400a), Verde Lima (#aac208), Amarillo Maíz (#f1c40f), Naranja (#f39c12), Azul (#2980b9), Casi Negro (#2c3e50), Gris (#7f8c8d).

### Hito 5: Reparación del Cuaderno (CRÍTICO)
- **Problema:** Paginación en tiempo real rompía el texto.
- **Solución:** `overflow-y: hidden` OBLIGATORIO.
- **Lógica:** `repaginateContent` solo se ejecuta en `onBlur`. Une todo el contenido y lo redistribuye en páginas nuevas.

### Hito 6: Estabilización
- **Dictado:** `useSpeechRecognition` usa `stopListeningRef` para control manual real.
- **Renderizado:** Eliminación de bucles infinitos en `useEffect` de `board-content.tsx`.
- **UI:** Eliminación permanente del botón de rotar en elementos transformables.

### Hito 7: Planner 3 (Plantilla Interactiva)
- **Componente:** `planner-3-element.tsx` (NO es JSON estático).
- **Diseño:** Grid 2 filas x 4 columnas simétricas.
- **Funcionalidad:** Tarjetas editables. `Enter` inserta línea divisoria de color.
- **Header:** Botones funcionales (Calendario, Duplicar, Eliminar).

### Hito 8: Refinamiento UI
- **Contenedores:** Corrección de lógica de `column` (drag & drop dentro de columnas).
- **ToolsSidebar:** Renombrado "Cosas" a "Archivos" (Icono Folder). "Texto" usa icono FileText.
- **Lienzo:** Crea hoja blanca tamaño carta zIndex:0.

---

## 2. GUÍA DE CONSTRUCCIÓN DE COMPONENTES

### ZOOM CONTROLS (`ZoomControls.tsx`)
- **Posición:** `absolute bottom-4 right-4`.
- **Botones:**
  1. `ZoomOut` (Alejar 10%).
  2. Texto `%` (Click = Reset 100%).
  3. `ZoomIn` (Acercar 10%).
  4. Separator.
  5. `Focus` (Centrar en contenido).
  6. `Home` (Ir a 0,0).

### TOOLS SIDEBAR (`ToolsSidebar.tsx`)
- **Diseño:** Flotante, arrastrable (`react-rnd` o similar), ShadCN + Lucide.
- **Items:**
  1. `GripVertical` (Handle).
  2. `LayoutDashboard` (Tableros: Nuevo, Renombrar, Abrir).
  3. `Move` (Paneo Toggle).
  4. `BookCopy` (Cuadernos: Notepad, NotepadSimple, Lista de abiertos).
  5. `StickyNote` (Notas: Selector de color).
  6. `List` (To-do).
  7. `ImageIcon` (Imagen: URL, Subir).
  8. `Mic` (Dictar: Toggle, rojo si activo).
  9. `MoreHorizontal` (Más: Formato, PNG, PDF, Limpiar, Logout).

### FORMATTING TOOLBAR (`FormattingToolbar.tsx`)
- **Comportamiento:** Flotante, contextual.
- **Botones:**
  - `Type` (Color texto - Paleta Hito 4).
  - `Highlighter` (Resaltar).
  - `Underline` (Subrayado color).
  - `Bold`, `Italic`, `Strikethrough`.
  - `List` (Ordenada/Desordenada).
  - `CalendarDays` (Insertar fecha).
  - `Eraser` (Limpiar formato).
  - `X` (Cerrar).

### NOTEPAD HEADER (`NotepadElement` Header)
- **Controles (Izq a Der):**
  1. `GripVertical` (Drag).
  2. Título Editable (`contentEditable`).
  3. `Wand` (IA corrección).
  4. `ClipboardCopy` (Select All).
  5. `Eraser` (Clear format).
  6. `CaseSensitive` (Toggle Format Toolbar).
  7. `CalendarDays` (Fecha).
  8. `MoreVertical` (Menu: Export PDF/PNG, Resize).
  9. `Maximize2` (Restaurar tamaño).
  10. `Minus`/`Maximize` (Minimizar).
  11. `Trash2` (Eliminar).
  12. `X` (Ocultar/Cerrar).

---

## 3. MANUAL DE USUARIO (RESUMEN FUNCIONAL)

### Navegación
- **Paneo:** Icono `Move` o Barra Espaciadora.
- **Zoom:** Ctrl + Rueda o Menú inferior.

### Elementos
- **Seleccionar:** Un clic (borde azul).
- **Mover:** Arrastrar desde header/handle.
- **Redimensionar:** Manijas en esquinas.
- **Controles:** Esquina sup-der (Borrar), sup-izq (Duplicar/Tag).

### Cuaderno (Notepad)
- **Escritura:** Paginación automática al salir del foco.
- **Navegación:** Flechas `<` `>` en pie de página.
- **Nueva Página:** Botón `+`.

### Autenticación
- Google y Invitado.
- Datos persisten en Firestore.

---

## 4. INSTRUCCIONES DE ESTILO (TAILWIND + SHADCN)
- **Color Principal:** #16b5a8 (Teal).
- **Tipografía:** Sans-serif (Inter/Poppins).
- **Sombras:** `shadow-md` o `shadow-lg` para elementos flotantes.
- **Bordes:** `rounded-lg` o `rounded-xl`.
- **Z-Index:**
  - Fondo (Lienzo blanco): 0
  - Elementos normales: 1+
  - Menús flotantes: 50+