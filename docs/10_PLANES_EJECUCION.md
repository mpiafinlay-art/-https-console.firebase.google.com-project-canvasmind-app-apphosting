# 10 PLANES DE EJECUCIÓN Y VERIFICACIÓN

## PLAN 1: VERIFICACIÓN DE COLORES Y ESTILOS VISUALES
- [ ] Canvas background: #b7ddda
- [ ] Menú principal fondo: #b7ddda
- [ ] Menú principal iconos inactivos: text-slate-800
- [ ] Menú principal botón Tools activo: bg-purple-500 text-white
- [ ] FormattingToolbar fondo: #000000 (negro)
- [ ] FormattingToolbar iconos: blanco
- [ ] StickyNote: rounded-lg shadow-lg
- [ ] TodoList: rounded-lg shadow-lg
- [ ] Column: rounded-lg shadow-lg

## PLAN 2: VERIFICACIÓN DE ESTRUCTURA DE ELEMENTOS
- [ ] StickyNote tiene header con iconos (GripVertical, Plus, Paintbrush, X)
- [ ] TodoList tiene header con título editable
- [ ] Column tiene header con título editable, GripVertical, X
- [ ] Todos los elementos tienen drag handle
- [ ] Todos los elementos tienen botón close cuando están seleccionados

## PLAN 3: VERIFICACIÓN DE PROPS Y PROPERTIES
- [ ] TransformableElement extrae position de properties.position
- [ ] TransformableElement extrae size de properties.size
- [ ] TransformableElement extrae zIndex de properties.zIndex
- [ ] Todos los elementos nuevos tienen properties.position
- [ ] Todos los elementos nuevos tienen properties.size
- [ ] Migración de elementos legacy funciona

## PLAN 4: VERIFICACIÓN DE FUNCIONES DE MENÚ PRINCIPAL
- [ ] Tableros: Nuevo, Renombrar, Eliminar, Abrir
- [ ] Dictar: Activa/desactiva correctamente
- [ ] Cuadernos: Agregar, Abrir, Localizar
- [ ] Archivos: Crea columna o localiza existente
- [ ] Lienzo: Crea columna fondo
- [ ] Notas: Todos los colores funcionan
- [ ] To-do: Crea lista
- [ ] Tools: Toggle FormatToolbar
- [ ] Imagen: URL y Subir
- [ ] Texto: Crea elemento
- [ ] Columna: Crea columna
- [ ] Portal: Crea portal
- [ ] Plantillas: Carga weekly-planner y planner-3
- [ ] Etiquetas: Localiza comentarios
- [ ] Mover: Activa paneo
- [ ] Más: Exportar, Limpiar, Cerrar Sesión

## PLAN 5: VERIFICACIÓN DE FORMATTING TOOLBAR
- [ ] Tag: Agrega comentario
- [ ] Tamaño fuente: Dropdown funciona
- [ ] Link: Inserta enlace
- [ ] Underline: Paleta de colores funciona
- [ ] Bold, Italic, Strikethrough: Funcionan
- [ ] Alineación: 4 botones funcionan
- [ ] Calendar: Inserta fecha
- [ ] Eraser: Limpia formato
- [ ] Close: Cierra toolbar

## PLAN 6: VERIFICACIÓN DE ZOOM CONTROLS
- [ ] ZoomIn: Funciona
- [ ] ZoomOut: Funciona
- [ ] Porcentaje: Muestra y resetea
- [ ] Focus: Centra en elementos
- [ ] Home: Va al inicio
- [ ] Traer al frente: Solo si hay selección
- [ ] Enviar atrás: Solo si hay selección
- [ ] Enviar al fondo: Solo si hay selección

## PLAN 7: VERIFICACIÓN DE AUTENTICACIÓN
- [ ] signInWithGoogle usa signInWithRedirect
- [ ] getGoogleSignInResult en FirebaseClientProvider
- [ ] signInAsGuest funciona
- [ ] signInWithEmail funciona
- [ ] createUserWithEmail funciona
- [ ] ensureUserDocument se llama después de login
- [ ] Redirección funciona después de login

## PLAN 8: VERIFICACIÓN DE CREACIÓN DE ELEMENTOS
- [ ] notepad: Tiene properties.position y properties.size
- [ ] notepad-simple: Tiene properties.position y properties.size
- [ ] sticky: Tiene properties.position, properties.size, properties.color
- [ ] todo: Tiene properties.position y properties.size
- [ ] image: Tiene properties.position y properties.size
- [ ] text: Tiene properties.position y properties.size
- [ ] column: Tiene properties.position y properties.size
- [ ] comment: Tiene properties.position y properties.size
- [ ] weekly-planner: Tiene properties.position y properties.size
- [ ] planner-3: Tiene properties.position y properties.size
- [ ] portal: Tiene properties.position y properties.size

## PLAN 9: VERIFICACIÓN DE FUNCIONES DE ZINDEX
- [ ] handleBringToFront actualiza properties.zIndex
- [ ] handleSendToBack actualiza properties.zIndex a 0
- [ ] handleMoveBackward decrementa properties.zIndex
- [ ] getNextZIndex funciona correctamente

## PLAN 10: VERIFICACIÓN DE INTERACCIONES Y EVENTOS
- [ ] Click en canvas deselecciona elementos
- [ ] Drag funciona en todos los elementos
- [ ] Resize funciona en todos los elementos
- [ ] Double click edita elementos de texto
- [ ] Enter en todo agrega item
- [ ] Enter en sticky agrega línea
- [ ] Pan funciona con mouse wheel o Alt+drag
- [ ] Zoom funciona con Ctrl/Cmd+wheel

