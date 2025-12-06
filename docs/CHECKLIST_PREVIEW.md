# CHECKLIST PARA VERIFICAR EN PREVIEW

## 🎨 VERIFICACIÓN VISUAL

### 1. PÁGINA DE INICIO
- [ ] Botón "Iniciar sesión con Google" visible
- [ ] Botón "Log in" (invitado) visible
- [ ] Link "Entrar como invitado / Crear Cuenta" visible
- [ ] No se queda en "Cargando..." indefinidamente

### 2. CANVAS (Después de login)
- [ ] Fondo teal claro (#b7ddda)
- [ ] Patrón de puntos sutil visible
- [ ] Canvas infinito funciona

### 3. MENÚ PRINCIPAL (ToolsSidebar)
- [ ] Fondo teal (#b7ddda)
- [ ] Iconos oscuros (text-slate-800) cuando están inactivos
- [ ] Botón "Tools" activo tiene fondo morado (bg-purple-500) y texto blanco
- [ ] Todos los botones visibles y funcionan

### 4. FORMATTING TOOLBAR
- [ ] Fondo NEGRO (#000000) - CRÍTICO
- [ ] Iconos blancos visibles
- [ ] Aparece cuando se hace click en "Tools"
- [ ] Todos los botones funcionan

### 5. ELEMENTOS EN EL CANVAS

#### StickyNote (Nota Adhesiva)
- [ ] Bordes redondeados (rounded-lg)
- [ ] Sombra visible (shadow-lg)
- [ ] Iconos en esquina superior derecha (GripVertical, Plus, Paintbrush, X)
- [ ] Iconos aparecen al hacer hover

#### TodoList (Lista de Tareas)
- [ ] Bordes redondeados (rounded-lg)
- [ ] Sombra visible (shadow-lg)
- [ ] Título editable
- [ ] Botón para agregar tareas

#### Column (Columna)
- [ ] Bordes redondeados (rounded-lg)
- [ ] Sombra visible (shadow-lg)
- [ ] Header con título editable
- [ ] GripVertical y X en header
- [ ] Mensaje "Arrastra elementos aquí" cuando está vacía

## 🔧 VERIFICACIÓN FUNCIONAL

### AUTENTICACIÓN
- [ ] Login con Google redirige correctamente
- [ ] Login como invitado funciona
- [ ] Login con email/password funciona
- [ ] Después de login, redirige al tablero más reciente o crea uno nuevo

### CREACIÓN DE ELEMENTOS
- [ ] Crear nota adhesiva funciona (todos los colores)
- [ ] Crear lista de tareas funciona
- [ ] Crear columna funciona
- [ ] Crear texto funciona
- [ ] Crear imagen funciona (URL y subir)

### INTERACCIONES
- [ ] Click en canvas deselecciona elementos
- [ ] Pan funciona con mouse wheel presionado
- [ ] Pan funciona con Alt+drag
- [ ] Zoom funciona con Ctrl/Cmd+wheel
- [ ] Drag de elementos funciona
- [ ] Resize de elementos funciona

### MENÚS
- [ ] Menú principal: Todos los botones ejecutan acciones
- [ ] FormatToolbar: Todos los botones ejecutan acciones
- [ ] ZoomControls: Todas las funciones funcionan

## 🚨 PROBLEMAS CONOCIDOS A VERIFICAR

1. **FormattingToolbar fondo**: Debe ser NEGRO (#000000), no gris oscuro
2. **Autenticación Google**: Debe redirigir, no usar popup
3. **Elementos**: Deben tener bordes redondeados y sombras

## 📝 NOTAS

Si algo no coincide con este checklist, documenta el problema específico para corregirlo.

