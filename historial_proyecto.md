# DOCUMENTACIÓN MAESTRA Y MEMORIA DEL PROYECTO: CANVASMIND

ESTE ARCHIVO ES LA FUENTE DE VERDAD. CUALQUIER CÓDIGO GENERADO DEBE RESPETAR ESTAS REGLAS.

## 1. HITOS DE DESARROLLO Y LÓGICA PROBADA

### Hito 1: Arquitectura Base
- **Backend:** Firebase (Auth, Firestore, Storage). Esquema en `docs/backend.json`.
- **Reglas:** Los usuarios solo leen/escriben en `/users/{userId}`.
- **Client Provider:** `FirebaseClientProvider` aísla la inicialización para evitar errores SSR en Next.js.

### Hito 2: Auth y Home
- **Auth:** Google y Anónimo.
- **Home:** Redirección automática al último tablero (`updatedAt`, `desc`). Si no hay, crea uno.

### Hito 3: Lienzo (Canvas)
- **Tecnología:** `react-rnd` para elementos transformables.
- **Zoom/Paneo:** Implementado en `canvas.tsx`. Zoom con Ctrl+Rueda.
- **Migración:** Función `migrateElement` convierte datos viejos (x, y root) a estructura nueva (properties).

### Hito 4: Componentes de UI
- **ZoomControls:** Fijo abajo-derecha. Botones: +, -, Focus, Home. Muestra %.
- **ToolsSidebar:** Flotante, usa ShadCN. Botones: Tableros, Cuadernos, Notas, To-do, Imagen, Dictar, Más.

### Hito 5: Reparación del Cuaderno (NotepadElement)
- **Lógica CRÍTICA:** NO usar paginación en tiempo real.
- **Scroll:** `overflow-y: hidden` OBLIGATORIO para evitar doble barra de scroll.
- **Guardado:** La función `repaginateContent` se ejecuta SOLO en `onBlur`. Une todo el contenido y lo redistribuye.

### Hito 6: Estabilización
- **Hooks:** `useSpeechRecognition` usa `stopListeningRef` para no reiniciarse solo.
- **Renderizado:** Se eliminaron bucles infinitos en `board-content.tsx` corrigiendo dependencias de `useEffect`.

### Hito 7: Planner 3 (Plantilla Interactiva)
- **NO es un JSON estático.** Es un componente: `planner-3-element.tsx`.
- **Diseño:** Grid CSS simétrico (2 filas, 4 columnas).
- **Funcionalidad:** Tarjetas editables. `Enter` inserta línea divisoria de color.

---

## 2. MANUAL TÉCNICO DE COMPONENTES

### ToolsSidebar (Menú Principal)
- Debe ser arrastrable (usando `react-rnd` o wrapper).
- **Estilo:** Fondo blanco, iconos Lucide, ShadCN Buttons.
- **Botón Dictar:** Rojo y pulsando cuando está activo. `onMouseDown` debe tener `e.preventDefault()` para no robar foco.

### FormattingToolbar (Formato de Texto)
- Flotante y contextual (solo aparece al pedirlo).
- Usa `document.execCommand` para negrita, cursiva, color.
- **Colores permitidos:** Teal (#16b5a8), Rojo (#cb400a), Verde Lima (#aac208), Amarillo Maíz (#f1c40f), Naranja (#f39c12), Azul (#2980b9), Casi Negro (#2c3e50), Gris (#7f8c8d).

### NotepadElement (Cuaderno)
- **Header:** Título editable, botones para IA, Limpiar Formato, Fecha, Menú (Exportar PDF/PNG), Minimizar, Cerrar.
- **Cuerpo:** Pages container. Paginación automática al salir del foco.

### ZoomControls
- Botones: ZoomOut, Display %, ZoomIn, Separator, Focus (Centrar), Home (Ir a 0,0).

---

## 3. ESTILO VISUAL (SHADCN + TAILWIND)
- **Color Principal:** Teal (#16b5a8).
- **Fuente:** Sans-serif (Inter o Poppins para títulos).
- **Elementos:** Bordes redondeados (`rounded-lg`), sombras suaves (`shadow-md`).
- **Estado:** Evitar clases dinámicas rotas. Usar clases completas de Tailwind.

