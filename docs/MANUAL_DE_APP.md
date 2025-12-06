
# Manual de Usuario y Guía Técnica de CanvasMind

Este documento sirve como el registro central y la fuente de verdad para cada componente, función, botón y elemento de la interfaz de la aplicación CanvasMind. Su propósito es mantener un inventario detallado y actualizado para evitar ambigüedades y asegurar un desarrollo consistente.

---

## 1.0 Barra de Herramientas Principal (`ToolsSidebar`)

La barra de herramientas es el centro de control principal para la creación y gestión de contenido en el lienzo. A continuación se detalla cada uno de sus elementos.

### 1.1 Menú de Tableros
- **Icono:** `LayoutDashboard` (Tableros)
- **Función:** Abre un menú desplegable para gestionar los tableros.
- **Opciones:**
    - **Nuevo Tablero:** Abre un diálogo para crear un nuevo tablero.
    - **Renombrar Tablero:** Abre un diálogo para cambiar el nombre del tablero actual.
    - **Eliminar Tablero:** Abre un diálogo de confirmación para eliminar el tablero actual.
    - **Abrir Tablero... (Submenú):** Muestra una lista de todos los tableros del usuario para navegación rápida.

### 1.2 Dictado por Voz
- **Icono:** `Mic` (Dictar)
- **Función:** Activa o desactiva el servicio de reconocimiento de voz.
- **Estado Activo:** Cuando está activo, el botón muestra un efecto de pulso rojo y la etiqueta cambia a "Detener". El texto reconocido se inserta en el elemento de texto que tenga el foco.

### 1.3 Menú de Cuadernos
- **Icono:** `BookCopy` (Cuadernos)
- **Función:** Gestiona los cuadernos (`notepad` y `notepad-simple`).
- **Opciones:**
    - **Agregar Cuaderno:** Crea un nuevo `NotepadElement` (formato carta, con páginas).
    - **Agregar Notepad:** Crea un nuevo `NotepadSimpleElement` (formato nota amarilla, sin páginas).
    - **Cuadernos Abiertos:** Lista los cuadernos visibles en el lienzo para localizarlos rápidamente (`onLocateElement`).
    - **Cerrados:** Lista los cuadernos que han sido ocultados (`hidden: true`) y permite volver a abrirlos (`onOpenNotepad`).

### 1.4 Menú de Archivos
- **Icono:** `Folder` (Archivos)
- **Función:** Muestra una lista de todos los elementos del tablero, ordenados por fecha de actualización, para localizarlos rápidamente.

### 1.5 Lienzo de Fondo
- **Icono:** `RectangleHorizontal` (Lienzo)
- **Función:** Crea un elemento de tipo `column` que actúa como una hoja de fondo blanca, de tamaño carta y redimensionable. Por defecto, se crea con un `zIndex` de 0 para asegurar que esté detrás de todos los demás elementos.

### 1.6 Menú de Notas Adhesivas
- **Icono:** `StickyNote` (Notas)
- **Función:** Abre un submenú para añadir notas adhesivas de diferentes colores.
- **Opciones:** Contiene una lista de colores (amarillo, rosa, azul, etc.). Al seleccionar un color, se crea un nuevo `StickyNoteElement` con ese color de fondo.

### 1.7 Lista de Tareas (To-do)
- **Icono:** `List` (To-do)
- **Función:** Crea un nuevo elemento de tipo `todo-list` en el lienzo.

### 1.8 Herramientas de Formato (Tools)
- **Icono:** `Wrench` (Tools)
- **Función:** Muestra u oculta la barra de herramientas de formato de texto.
- **Estado Activo:** El botón se resalta cuando la barra de formato está visible.

### 1.9 Menú de Imágenes
- **Icono:** `ImageIcon` (Imagen)
- **Función:** Abre un submenú para añadir imágenes.
- **Opciones:**
    - **Desde URL:** Abre un diálogo para pegar la URL de una imagen.
    - **Subir:** Abre el selector de archivos del sistema para subir una imagen local.
    - **Moodboard desde URL:** Abre un diálogo para pegar una URL de una página web, activando un flujo de IA que extrae imágenes, colores y palabras clave para crear un moodboard.

### 1.10 Elemento de Texto
- **Icono:** `FileText` (Texto)
- **Función:** Crea un nuevo elemento de tipo `text` en el lienzo.

### 1.11 Columna / Contenedor
- **Icono:** `Columns` (Columna)
- **Función:** Crea un nuevo elemento de tipo `column` que funciona como un contenedor vertical para agrupar otros elementos.

### 1.12 Portal
- **Icono:** `Link` (Portal)
- **Función:** Abre un diálogo que permite seleccionar otro tablero del usuario para crear un enlace (`PortalElement`) hacia él.

### 1.13 Menú de Etiquetas
- **Icono:** `Tag` (Etiquetas)
- **Función:** Muestra una lista de todos los elementos de tipo `comment` (etiquetas) que existen en el tablero para localizarlos rápidamente.

### 1.14 Menú "Más"
- **Icono:** `MoreHorizontal` (Más)
- **Función:** Abre un submenú con acciones adicionales.
- **Opciones:**
    - **Exportar IMG tablero:** (Función no implementada) Intenta exportar la vista actual del tablero como una imagen PNG.
    - **Limpiar Tablero:** Elimina todos los elementos del lienzo actual, previa confirmación.
    - **Cerrar Sesión:** Cierra la sesión del usuario actual y lo redirige a la página de inicio.
    - **Plantillas (Submenú):** Ofrece una selección de plantillas pre-diseñadas para añadir al lienzo.
        - **Planner 3:** Añade un planificador semanal interactivo con un diseño de 8 tarjetas distribuidas en una cuadrícula de 2x4.
