# APRENDIZAJES DE LOS ARCHIVOS REVISADOS

## 📚 RESUMEN DE LO APRENDIDO

Después de revisar exhaustivamente todos los archivos de `src/` y la documentación, he aprendido lo siguiente:

---

## 1. ARQUITECTURA GENERAL DE LA APLICACIÓN

### Estructura de Next.js App Router
- **Página Principal**: `src/app/page.tsx` → Redirige a `HomePageContent`
- **Página de Tablero**: `src/app/board/[boardId]/page.tsx` → Componente principal del tablero
- **Providers**: Separados en `src/components/providers.tsx` (cliente) y `src/app/layout.tsx` (servidor)

### Separación Cliente/Servidor
- Firebase solo se inicializa en el cliente (`FirebaseClientProvider`)
- Los componentes de servidor no pueden usar hooks de Firebase directamente
- Se usa `'use client'` en todos los componentes interactivos

---

## 2. SISTEMA DE AUTENTICACIÓN

### Flujo de Login
- **Google**: Usa `signInWithPopup` (NO `signInWithRedirect` como intenté antes)
- **Invitado**: Usa `signInAnonymously`
- **Email/Password**: Implementado pero no es el método principal

### Gestión de Usuario
- `ensureUserDocument`: Crea documento en Firestore después del login
- `useUser`, `useAuth`, `useFirestore`: Hooks personalizados para acceder a Firebase
- Redirección automática al tablero más reciente después del login

---

## 3. ESTRUCTURA DE DATOS EN FIRESTORE

### Jerarquía de Colecciones
```
/users/{userId}/
  ├── canvasBoards/{boardId}/
  │   └── canvasElements/{elementId}/
  └── (user document)
```

### Tipos de Elementos (`ElementType`)
- `sticky`: Notas adhesivas con colores
- `notepad`: Cuadernos con paginación
- `notepad-simple`: Notepads simples sin paginación
- `todo`: Listas de tareas
- `text`: Elementos de texto
- `image`: Imágenes
- `column`: Columnas/contenedores
- `comment`: Etiquetas/comentarios
- `portal`: Enlaces a otros tableros
- `planner-3`: Plantilla de planificador
- `weekly-planner`: Planificador semanal
- `frame`: Marcos para agrupar
- `connector`: Conectores entre elementos
- `drawing`: Dibujos

### Estructura de `CanvasElement`
```typescript
{
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
  properties?: {
    color?: string;
    backgroundColor?: string;
    size?: { width: number; height: number };
    position?: { x: number; y: number };
    zIndex?: number;
  };
  content: any; // Específico según el tipo
  hidden?: boolean;
  parentId?: string;
}
```

**IMPORTANTE**: Las propiedades visuales (`x`, `y`, `width`, `height`, `zIndex`) pueden estar en la raíz O en `properties`. El código maneja ambos casos con `migrateElement`.

---

## 4. CANVAS INFINITO

### Características
- **Tamaño**: 80000x80000px (infinito con padding de 2000px)
- **Fondo**: Teal (#b7ddda) con patrón de puntos (`radial-gradient`)
- **Zoom**: Ctrl/Cmd + rueda del mouse (escala 0.1 a 5x)
- **Pan**: 
  - Alt + drag
  - Rueda del mouse presionada
  - Space + drag
- **Selección**: Click en fondo deselecciona elementos

### Implementación
- Usa `transform: scale()` para zoom
- Usa `scrollLeft` y `scrollTop` para pan
- `getViewportCenter()` calcula el centro de la vista actual
- `centerOnElement()` centra la vista en un elemento específico

---

## 5. MENÚ PRINCIPAL (ToolsSidebar)

### Características Visuales
- **Fondo**: Teal (#b7ddda)
- **Iconos inactivos**: Color slate-800
- **Botón Tools activo**: Fondo morado (bg-purple-500)
- **Botón Dictar activo**: Fondo rojo con animación pulse
- **Arrastrable**: Usa `react-rnd` con `GripVertical` como handle

### Orden de Botones (según documentación)
1. Tableros (LayoutDashboard) - Dropdown
2. Dictar (Mic) - Toggle con estado rojo
3. Mover (Move) - Toggle de pan mode
4. Cuadernos (BookCopy) - Dropdown
5. Archivos (Folder) - Crea/localiza columna
6. Lienzo (RectangleHorizontal) - Crea columna de fondo
7. Notas (StickyNote) - Dropdown con colores
8. To-do (List) - Crea lista
9. Tools (Wrench) - Toggle del menú format
10. Imagen (ImageIcon) - Dropdown
11. Texto (FileText) - Crea texto
12. Portal (Link) - Crea portal
13. Etiquetas (Tag) - Dropdown con lista
14. Más (MoreHorizontal) - Dropdown con opciones adicionales

### Funcionalidades Clave
- Cada botón ejecuta `addElement(type, props)` para crear elementos
- Los dropdowns muestran listas de elementos existentes
- `onLocateElement(id)` centra la vista en un elemento
- `onOpenNotepad(id)` muestra un cuaderno oculto

---

## 6. MENÚ FORMAT (FormattingToolbar)

### Características Visuales
- **Fondo**: Negro (#000000)
- **Iconos**: Blancos
- **Arrastrable**: Con `GripVertical` como handle
- **Posición**: Guardada en localStorage

### Botones (en orden)
1. Tag (Etiquetas)
2. Tamaño de Fuente (Type + ChevronDown) - Dropdown
3. Link (Enlaces)
4. Estilo de Fuente (&) - Placeholder
5. Subrayado de Color (Underline) - Popover con colores
6. Negrita (Bold)
7. Cursiva (Italic)
8. Tachado (Strikethrough)
9. Alinear Izquierda (AlignLeft)
10. Centrar (AlignCenter)
11. Alinear Derecha (AlignRight)
12. Justificar (AlignJustify)
13. Calendario (Calendar) - Inserta fecha
14. Búsqueda (Search) - Placeholder
15. Cerrar (X)

### Implementación
- Usa `document.execCommand()` para aplicar formato
- Funciona con texto seleccionado en elementos editables
- Los popovers usan componentes de ShadCN

---

## 7. MENÚ ZOOM (ZoomControls)

### Características
- **Posición**: Esquina inferior derecha (centro inferior en móvil)
- **Fondo**: Blanco con borde
- **Botones**: Pequeños y compactos

### Funcionalidades
- Zoom In/Out
- Porcentaje clickeable (resetea a 100%)
- Centrar en Contenido
- Ir al Inicio
- Traer al Frente / Enviar Atrás / Enviar al Fondo (solo con elemento seleccionado)

---

## 8. ELEMENTOS TRANSFORMABLES

### TransformableElement
- Envuelve todos los elementos del canvas
- Usa `react-rnd` para drag & resize
- Muestra controles contextuales cuando está seleccionado
- Maneja `zIndex` para capas

### Propiedades Comunes (`CommonElementProps`)
```typescript
{
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: any;
  properties: any;
  isSelected: boolean;
  scale: number;
  offset: Point;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  onSelectElement: (id: string, multi: boolean) => void;
  // ... más props
}
```

---

## 9. GESTIÓN DE ESTADO

### Zustand Store (`boardStore.ts`)
- `useBoardStore`: Hook principal para estado del tablero
- `elements`: Array de elementos del tablero
- `board`: Tablero actual
- `selectedElementIds`: IDs de elementos seleccionados
- `loadBoard`, `addElement`, `updateElement`, `deleteElement`: Funciones principales

### Hooks Personalizados
- `useElementManager`: Gestiona creación y carga de elementos
- `useBoardState`: Gestiona estado del tablero (boards, rename, delete)
- `useSpeechRecognition`: Reconocimiento de voz
- `useUserPreferences`: Preferencias del usuario (mic permission)
- `useZoomPan`: Zoom y pan del canvas
- `useSelection`: Selección de elementos
- `useCanvasDragAndDrop`: Drag and drop en el canvas

---

## 10. SISTEMA DE DICTADO POR VOZ

### Funcionalidad
- Usa Web Speech API del navegador
- `useSpeechRecognition`: Hook que maneja el reconocimiento
- `onTranscript`: Callback que recibe el texto reconocido
- Se inserta en el elemento de texto que tiene el foco
- Botón "Dictar" en ToolsSidebar con estado rojo cuando activo
- `onMouseDown={(e) => e.preventDefault()}` previene que robe el foco

---

## 11. ESTILOS Y DISEÑO

### Colores Principales
- **Fondo Canvas**: #b7ddda (teal claro)
- **Fondo Menú Principal**: #b7ddda (teal claro)
- **Fondo Menú Format**: #000000 (negro)
- **Texto/Iconos Inactivos**: slate-800
- **Botón Tools Activo**: purple-500
- **Botón Dictar Activo**: red-100 con texto red-500

### Notas Adhesivas - Colores
```typescript
{
  yellow: '#fffb8b',
  pink: '#ffc2d4',
  blue: '#bce8f1',
  green: '#d4edda',
  orange: '#ffeeba',
  purple: '#e9d5ff'
}
```

### Estilos de Elementos
- Todos tienen `rounded-lg` y `shadow-lg`
- Bordes redondeados de 8px
- Sombras consistentes

---

## 12. FLUJO DE CREACIÓN DE ELEMENTOS

### Proceso
1. Usuario hace clic en botón del menú
2. Se llama `addElement(type, props)` desde `useElementManager`
3. Se calcula posición en el centro del viewport
4. Se calcula `zIndex` siguiente
5. Se crea documento en Firestore con `addDoc`
6. `onSnapshot` detecta el cambio y actualiza el estado
7. El elemento aparece en el canvas

### Manejo de Errores
- Todos los `addElement` están envueltos en try-catch
- Se muestran toasts de éxito/error
- Los errores se logean en consola

---

## 13. PAGINACIÓN DE CUADERNOS

### NotepadElement
- **Formato Carta**: 26 líneas por página
- **Formato 10x15**: 15 líneas por página
- **Repaginación**: Se ejecuta en `onBlur` (no en tiempo real)
- **Función `repaginateContent`**: Redistribuye el contenido en páginas
- **Navegación**: Botones `<` y `>` para cambiar de página
- **Agregar Página**: Botón `+` en el footer

---

## 14. PLANTILLAS

### Templates Disponibles
- `weekly-planner.json`: Planificador semanal
- `planner-3`: Elemento Planner 3 (8 tarjetas en grid 2x4)

### Carga de Plantillas
- `loadTemplate(templateName)`: Carga desde `public/templates/`
- Usa `fetch()` para cargar JSON
- Crea múltiples elementos según la plantilla

---

## 15. LECCIONES IMPORTANTES

### Errores Comunes Evitados
1. **No usar `signInWithRedirect`**: La documentación original usa `signInWithPopup`
2. **Propiedades en `properties`**: `x`, `y`, `width`, `height` deben estar en `properties` (nueva estructura)
3. **Migración de datos**: `migrateElement` maneja elementos antiguos
4. **Prevenir foco**: `onMouseDown={(e) => e.preventDefault()}` en botones de dictado
5. **Lazy loading**: Elementos pesados usan `lazy()` y `Suspense`

### Mejores Prácticas Encontradas
- Separación clara entre cliente y servidor
- Hooks personalizados para lógica reutilizable
- Manejo de errores consistente con toasts
- Estado centralizado con Zustand
- Componentes modulares y reutilizables

---

## 16. INTEGRACIÓN CON FIREBASE

### Firestore
- Reglas de seguridad: Usuario solo puede acceder a sus propios datos
- `onSnapshot`: Escucha cambios en tiempo real
- `serverTimestamp()`: Para timestamps consistentes
- `orderBy('updatedAt', 'desc')`: Para obtener tableros más recientes

### Storage
- Subida de imágenes a `/users/{userId}/images/`
- Reglas de seguridad: Usuario solo puede subir a su carpeta
- URLs públicas para acceso a imágenes

---

## CONCLUSIÓN

La aplicación es una **SPA compleja** con:
- Canvas infinito interactivo
- Sistema de elementos transformables
- Autenticación con Firebase
- Base de datos en tiempo real
- Reconocimiento de voz
- Múltiples tipos de elementos
- Sistema de plantillas
- Menús flotantes y arrastrables

La arquitectura está bien estructurada con separación de responsabilidades, hooks personalizados, y manejo de estado centralizado.

