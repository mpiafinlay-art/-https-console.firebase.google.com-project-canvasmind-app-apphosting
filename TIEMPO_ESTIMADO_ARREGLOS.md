# ⏱️ TIEMPO ESTIMADO - Arreglos y Mejoras
## Fecha: 6 de Diciembre 2024

---

## 🔴 PROBLEMA CRÍTICO: DICTADO EN TODOS LOS CAMPOS EDITABLES

### ⚠️ ENFASIS: El problema de dictado (cursor vuelve al inicio) se presenta en **TODOS** los campos de texto editables:
- ✅ TextElement (parcialmente corregido)
- ✅ StickyNoteElement (parcialmente corregido)
- ✅ NotepadElement (parcialmente corregido)
- ✅ AccordionElement (parcialmente corregido)
- ❌ TabbedNotepadElement (PENDIENTE)
- ❌ SuperNotebookElement (parcialmente corregido)
- ❌ CommentElement (PENDIENTE)
- ❌ TodoListElement (PENDIENTE - verificar)

**Solución**: Aplicar verificación `isFocused` y restauración de cursor en TODOS.

---

## 📊 TIEMPO ESTIMADO POR TAREA:

### FASE 1: CRÍTICOS (2.5 horas)

#### 1.1 Dictado - TODOS los campos editables ⚠️ URGENTE
- **Tiempo**: 1 hora
- **Archivos**:
  - `tabbed-notepad-element.tsx` - 15 min
  - `super-notebook-element.tsx` - 10 min (ya parcialmente corregido)
  - `comment-element.tsx` - 15 min
  - `todo-list-element.tsx` - 10 min (verificar si tiene contentEditable)
  - Verificar todos los demás - 10 min

#### 1.2 Acordeón - Completar arreglos
- **Tiempo**: 30 min
- **Tareas**:
  - Verificar arrastrar funciona - 5 min
  - Verificar dictado funciona - 10 min
  - Verificar guardado automático - 10 min
  - Testing - 5 min

#### 1.3 Exportar PNG - Correcciones
- **Tiempo**: 15 min
- **Tareas**:
  - Tablero: Mantener scale 4x (NO reducir) - 5 min
  - Lista de tareas: Reducir a scale 2.1x (30% menos) - 5 min
  - Verificar área visible - 5 min

#### 1.4 Botón Pincel - Color persiste
- **Tiempo**: 15 min
- **Estado**: Ya corregido parcialmente
- **Verificar**: Que funcione en todos los campos

---

### FASE 2: ALTA PRIORIDAD (1 hora)

#### 2.1 Menú Formato - Verificar enlace
- **Tiempo**: 10 min
- **Estado**: Ya implementado con Dialog

#### 2.2 Botón Texto - Paleta de color
- **Tiempo**: 15 min
- **Estado**: Ya implementado
- **Verificar**: Que funcione correctamente

#### 2.3 Autoguardado - Verificar todos
- **Tiempo**: 20 min
- **Archivos a verificar**:
  - `todo-list-element.tsx`
  - `comment-element.tsx`
  - Todos los demás

#### 2.4 Contenedor - Guardar elementos
- **Tiempo**: 15 min
- **Estado**: Parcialmente corregido (parentId: null)

---

### FASE 3: MEJORAS PENDIENTES (19-20.5 horas)

#### 3.1 Planificador Semanal ⚠️ CRÍTICO
- **Tiempo**: 1.5 horas
- **Especificaciones**: 21 x 27 cm editable, selector primer día, exportar PNG
- **Ubicación**: Menú principal (segunda columna)
- **Estado**: Pendiente
- **⚠️ CRÍTICO**: NO usar planner-3-element.tsx, BORRAR todo referente a planner-3, buscar código nuevo limpio
- **Nota**: Buscar plantilla en recursos web o Firebase

#### 3.2 Tooltip Mejorado
- **Tiempo**: 30 min
- **Ubicación**: Mejorar tooltips existentes
- **Estado**: Pendiente

#### 3.3 Elemento Texto con Fondo de Color (Destacador)
- **Tiempo**: 1 hora
- **Colores**: Amarillo, Verde, Azul, Calipso, Naranja, Morado (pastel)
- **Ubicación**: Menú principal (segunda columna)
- **Estado**: Pendiente
- **Funcionalidad**: Como destacador, editable, arrastrable

#### 3.4 Elemento Mapa Mental
- **Tiempo**: 6-8 horas
- **Características**: Nodo central, nodos hijos, líneas conectores, colores por rama, exportar imagen
- **Ubicación**: Menú principal (segunda columna)
- **Estado**: Pendiente
- **Dependencias**: react-flow o react-d3-tree
- **Nota**: Buscar código probado

#### 3.5 Galería de Comparación Antes/Después
- **Tiempo**: 1.5 horas
- **Ubicación**: Menú desplegable botón imagen
- **Estado**: Pendiente

#### 3.6 Contenedor de Archivos con Vista Previa
- **Tiempo**: 1.5 horas
- **Ubicación**: Menú principal (segunda columna)
- **Estado**: Pendiente
- **Nota**: Buscar código aprobado para subir archivos

#### 3.7 Galería de Imágenes con Miniaturas
- **Tiempo**: 1 hora
- **Ubicación**: Menú principal (segunda columna)
- **Estado**: Pendiente

#### 3.8 Organizador de Ideas con Agrupación
- **Tiempo**: 1.5 horas
- **Ubicación**: Header de cuadernos + menú formato
- **Funcionalidad**: Seleccionar texto → presionar botón → activa organizador
- **Opciones**: Deshacer
- **Estado**: Pendiente

#### 3.9 Notepads Amarillos Americanos (3 opciones)
- **Tiempo**: 2 horas
- **Ubicación**: Menú principal (segunda columna)
- **Estado**: Pendiente
- **Requisitos**: Código listo, diseño profesional, visualmente bien hecho

#### 3.10 Notas Adhesivas (2 sistemas distintos)
- **Tiempo**: 1.5 horas
- **Ubicación**: Menú principal (segunda columna)
- **Estado**: Pendiente
- **Requisitos**: Diferentes al actual sticky-note-element

#### 3.11 Cronómetro/Temporizador
- **Tiempo**: 1 hora
- **Ubicación**: Menú principal (segunda columna)
- **Estado**: Pendiente
- **Nota**: Buscar código listo, hacer app asombrosa

---

### FASE 4: TESTING Y DEPLOY (1 hora)

#### 4.1 Testing completo
- **Tiempo**: 30 min
- **Verificar**:
  - Login funciona
  - Redirección funciona
  - Todos los elementos se arrastran
  - Dictado funciona en TODOS los campos
  - Cursor NO vuelve al inicio
  - Autoguardado funciona
  - Exportar PNG funciona

#### 4.2 Build y Deploy
- **Tiempo**: 30 min

---

## ⏱️ RESUMEN DE TIEMPOS:

### Arreglos Críticos:
- **Fase 1**: 2.5 horas
- **Fase 2**: 1 hora
- **Fase 4**: 1 hora
- **Total arreglos**: 4.5 horas

### Mejoras Nuevas:
- **Fase 3**: 3 horas (mínimo)
- **Total mejoras**: 3-4 horas

### **TOTAL ESTIMADO**: 
- **Arreglos críticos**: 4.5 horas
- **Mejoras nuevas**: 19-20.5 horas
- **TOTAL**: 23.5 - 25 horas

---

## 🎯 PRIORIZACIÓN:

### URGENTE (Hacer primero):
1. ✅ Dictado en TODOS los campos - 1 hora
2. ✅ Acordeón completo - 30 min
3. ✅ Exportar PNG correcciones - 15 min
4. ✅ Build y deploy - 30 min
**Subtotal**: 2.25 horas

### ALTA PRIORIDAD (Después):
5. Verificar autoguardado - 20 min
6. Verificar contenedor - 15 min
7. Testing completo - 30 min
**Subtotal**: 1.1 horas

### MEJORAS (Luego):
8. Todas las mejoras de Fase 3 - 3-4 horas

---

## 📝 NOTAS IMPORTANTES:

### Corrección Exportar PNG:
- ❌ **NO reducir** tablero PNG (mantener scale 4x)
- ✅ **SÍ reducir** lista de tareas PNG (scale 2.1x - 30% menos)

### Dictado:
- ⚠️ Problema presente en **TODOS** los campos editables
- Solución: Verificación `isFocused` + restauración cursor

---

**Fecha**: 6 de Diciembre 2024
**Tiempo total estimado**: 7.5 - 8.5 horas
**Tiempo crítico (urgente)**: 2.25 horas
