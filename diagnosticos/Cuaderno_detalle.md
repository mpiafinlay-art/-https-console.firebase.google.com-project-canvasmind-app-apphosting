# Manual Completo: Cuaderno Principal (NotepadElement)

**Fecha de creación**: 4 de Diciembre 2024  
**Componente**: `notepad-element.tsx`  
**Versión**: Completa con 2 formatos (Letter y 10x15)

---

## 📋 TABLA DE CONTENIDOS

1. [Descripción General](#descripción-general)
2. [Estructura Visual](#estructura-visual)
3. [Formatos Disponibles](#formatos-disponibles)
4. [Header y Botones](#header-y-botones)
5. [Área de Contenido](#área-de-contenido)
6. [Paginación](#paginación)
7. [Tipografía y Estilos](#tipografía-y-estilos)
8. [Funcionalidades](#funcionalidades)
9. [Estados y Props](#estados-y-props)
10. [Implementación Paso a Paso](#implementación-paso-a-paso)

---

## 1. DESCRIPCIÓN GENERAL

El **NotepadElement** es un componente React complejo que simula un cuaderno físico con:
- **Paginación múltiple** (hasta 20 páginas)
- **2 formatos intercambiables** (Letter y 10x15)
- **Líneas horizontales de fondo** perfectamente alineadas
- **Margen rojo** a la izquierda
- **Editor de texto rico** con ContentEditable
- **Autoguardado** automático
- **Exportación** a PNG y PDF

---

## 2. ESTRUCTURA VISUAL

### 2.1 Componente Principal

```
┌─────────────────────────────────────────────────────────┐
│ HEADER (Drag Handle + Título + Botones)                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ CONTENIDO EDITABLE                                       │
│ (con líneas horizontales y margen rojo)                │
│                                                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ FOOTER (Controles de Paginación)                        │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Dimensiones por Formato

#### Formato Letter (Carta)
- **Ancho**: 794px (8.5 pulgadas a 96 DPI)
- **Alto**: 1021px (11 pulgadas a 96 DPI)
- **Margen rojo**: 50px desde la izquierda
- **Padding izquierdo del texto**: 70px (50px margen + 20px espacio)
- **Padding superior**: 32px
- **Padding derecho**: 24px
- **Padding inferior**: 16px

#### Formato 10x15 (Ficha)
- **Ancho**: 378px (10cm a 96 DPI)
- **Alto**: 567px (15cm a 96 DPI)
- **Margen rojo**: 20px desde la izquierda
- **Padding izquierdo del texto**: 40px (20px margen + 20px espacio)
- **Padding superior**: 16px
- **Padding derecho**: 12px
- **Padding inferior**: 8px

---

## 3. FORMATOS DISPONIBLES

### 3.1 Formato Letter (Por Defecto)
- **ID**: `'letter'`
- **Etiqueta**: "Carta (8.5" x 11")"
- **Descripción**: "Formato estándar para documentos."
- **Dimensiones**: 794px × 1021px
- **Fuente**: 16px
- **Line-height**: 24px (1.5rem)

### 3.2 Formato 10x15
- **ID**: `'10x15'`
- **Etiqueta**: "Ficha (10cm x 15cm)"
- **Descripción**: "Ideal para notas rápidas y fichas de estudio."
- **Dimensiones**: 378px × 567px
- **Fuente**: 12px
- **Line-height**: 24px (1.5rem) - **MANTIENE** la misma altura de línea para alineación perfecta

---

## 4. HEADER Y BOTONES

### 4.1 Estructura del Header

El header tiene la siguiente estructura de izquierda a derecha:

```
[GripVertical] [Título Editable] [Save] [Info] [SelectAll] [Eraser] [Wrench] [Calendar] [MoreVertical] [Minus] [Trash] [X]
```

### 4.2 Botones del Header (Detalle)

#### 1. **GripVertical** (Drag Handle)
- **Icono**: `GripVertical` de lucide-react
- **Tamaño**: `size-5` (20px)
- **Color**: `text-muted-foreground`
- **Función**: Permite arrastrar el cuaderno por el canvas
- **Clase CSS**: `drag-handle`
- **Cursor**: `cursor-grab active:cursor-grabbing`

#### 2. **Título Editable**
- **Tipo**: `contentEditable` div
- **Fuente**: `font-headline text-sm font-semibold`
- **Placeholder**: "Título"
- **Autoguardado**: Se guarda automáticamente con debounce de 1000ms
- **Eventos**: `onFocus`, `onBlur`, `onMouseDown` (stopPropagation)

#### 3. **Save** (Guardar Manual)
- **Icono**: `Save`
- **Tamaño**: `size-7` (28px)
- **Variant**: `ghost`
- **Función**: Guarda el contenido manualmente llamando a `saveContent()`
- **Tooltip**: "Guardar"

#### 4. **Info** (Información)
- **Icono**: `Info`
- **Tamaño**: `size-7`
- **Variant**: `ghost`
- **Función**: Muestra/oculta overlay con información de comandos de dictado
- **Estado**: `isInfoOpen` (toggle)
- **Tooltip**: "Info"

#### 5. **FileSignature** (Seleccionar Todo)
- **Icono**: `FileSignature`
- **Tamaño**: `size-7`
- **Variant**: `ghost`
- **Función**: Selecciona todo el texto del contenido editable
- **Implementación**: Usa `document.createRange()` y `window.getSelection()`
- **Tooltip**: "Seleccionar Todo"

#### 6. **Eraser** (Limpiar Formato)
- **Icono**: `Eraser`
- **Tamaño**: `size-7`
- **Variant**: `ghost`
- **Función**: Ejecuta `document.execCommand('removeFormat')`
- **Tooltip**: "Limpiar Formato"

#### 7. **Wrench** (Herramientas de Formato)
- **Icono**: `Wrench`
- **Tamaño**: `size-7`
- **Variant**: `ghost`
- **Función**: Abre la barra de herramientas de formato (`onFormatToggle`)
- **Condición**: Solo se muestra si `onFormatToggle` está definido
- **Tooltip**: "Herramientas de Formato"

#### 8. **CalendarDays** (Insertar Fecha)
- **Icono**: `CalendarDays`
- **Tamaño**: `size-7`
- **Variant**: `ghost`
- **Función**: Inserta fecha actual en formato `-- dd/MM/yy `
- **Color del texto**: `#a0a1a6` (gris claro)
- **Formato**: Usa `date-fns` con `format(new Date(), 'dd/MM/yy')`
- **Tooltip**: "Insertar Fecha"

#### 9. **MoreVertical** (Menú Desplegable)
- **Icono**: `MoreVertical`
- **Tamaño**: `size-7`
- **Variant**: `ghost`
- **Dropdown Menu Items**:
  - **Exportar a PNG**: `handleExportNotepadToPng`
    - Icono: `FileImage`
    - Estado: `isExportingPng` (disabled cuando está exportando)
  - **Exportar páginas a PDF**: Abre `ExportPdfDialog`
    - Icono: `FileImage`
    - Estado: `isExportingPdf` (disabled cuando está exportando)
  - **Cambiar formato...**: Abre `ChangeFormatDialog`
    - Icono: `Settings`
    - Condición: Solo si `onChangeNotepadFormat` está definido

#### 10. **Minus/Maximize** (Minimizar/Maximizar)
- **Icono**: `Minus` cuando está expandido, `Maximize` cuando está minimizado
- **Tamaño**: `size-7`
- **Variant**: `ghost`
- **Función**: `toggleMinimize()`
  - **Al minimizar**: Guarda tamaño actual en `originalSize`, reduce altura a 48px
  - **Al maximizar**: Restaura tamaño desde `originalSize`
- **Tooltip**: "Minimizar" / "Maximizar"

#### 11. **Trash2** (Eliminar)
- **Icono**: `Trash2`
- **Tamaño**: `size-7`
- **Variant**: `ghost`
- **Color**: `text-destructive hover:text-destructive`
- **Función**: Abre `DeleteNotepadDialog` para confirmación
- **Tooltip**: "Eliminar Cuaderno"

#### 12. **X** (Cerrar)
- **Icono**: `X`
- **Tamaño**: `size-7`
- **Variant**: `ghost`
- **Función**: `handleCloseNotepad()` - Marca el cuaderno como `hidden: true`
- **Tooltip**: "Cerrar"

---

## 5. ÁREA DE CONTENIDO

### 5.1 Estructura del Contenido

El área de contenido tiene 3 capas superpuestas:

1. **Capa de fondo** (`.notepad-lines-background`):
   - Líneas horizontales cada 24px
   - Margen rojo vertical (`#fca5a5`)
   - `z-index: 1`
   - `pointer-events: none`

2. **Capa de contenido editable** (`.notepad-content-editable`):
   - `contentEditable={true}`
   - `z-index: 10`
   - Padding izquierdo según formato
   - Fuente Poppins, 16px (letter) o 12px (10x15)
   - Line-height: 24px (1.5rem)

3. **Indicador de guardado** (`SaveStatusIndicator`):
   - Posición: `absolute top-2 right-2`
   - `z-index: 20`
   - Muestra estado: `idle`, `saving`, `saved`, `error`

### 5.2 Líneas Horizontales

- **Color**: `#e2e8f0` (gris claro)
- **Grosor**: 1px
- **Espaciado**: 24px (1.5rem) - **CRÍTICO** para alineación perfecta
- **Posición inicial**:
  - Letter: `calc(32px + 18px) = 50px` desde arriba
  - 10x15: `calc(16px + 18px) = 34px` desde arriba

### 5.3 Margen Rojo

- **Color**: `#fca5a5`
- **Grosor**: 1px
- **Posición**:
  - Letter: 50px desde la izquierda
  - 10x15: 20px desde la izquierda
- **Altura**: Desde padding-top hasta padding-bottom

### 5.4 Contenido Editable

- **Tipo**: `div` con `contentEditable={true}`
- **Fuente**: `'Poppins', sans-serif`
- **Tamaño de fuente**:
  - Letter: 16px
  - 10x15: 12px
- **Line-height**: 24px (1.5rem) - **MISMO** para ambos formatos
- **Color**: `#1e293b` (gris oscuro)
- **Padding izquierdo**:
  - Letter: 70px (después del margen rojo)
  - 10x15: 40px (después del margen rojo)
- **Eventos**:
  - `onPaste`: Maneja pegado de texto plano
  - `onFocus`: Llama a `onEditElement(id)`
  - `onInput`: Trigger de autoguardado (`handleChange`)
  - `onBlur`: Guardado inmediato (`handleAutoSaveBlur`)

---

## 6. PAGINACIÓN

### 6.1 Controles de Paginación

Los controles están en el footer (`CardFooter`):

```
[◀ Anterior] [Página X / Total] [Siguiente ▶] [+ Agregar Página]
```

#### Botón Anterior (`ChevronLeft`)
- **Función**: `onPageChange(currentPage - 1)`
- **Disabled**: Cuando `currentPage === 0`
- **Tamaño**: `h-7 w-7`

#### Contador de Páginas
- **Formato**: `{currentPage + 1} / {totalPages}`
- **Estilo**: `text-sm font-medium text-muted-foreground`

#### Botón Siguiente (`ChevronRight`)
- **Función**: `onPageChange(currentPage + 1)`
- **Disabled**: Cuando `currentPage >= totalPages - 1`
- **Tamaño**: `h-7 w-7`

#### Botón Agregar Página (`Plus`)
- **Función**: `onAddPage()`
- **Disabled**: Cuando `totalPages >= 20` (límite máximo)
- **Tamaño**: `h-7 w-7`

### 6.2 Gestión de Páginas

- **Estructura de datos**: `pages: string[]` (array de HTML strings)
- **Página actual**: `currentPage: number` (índice 0-based)
- **Página inicial**: `'<div><br></div>'` (div vacío con salto de línea)
- **Máximo de páginas**: 20
- **Al cambiar de página**: Se guarda automáticamente el contenido actual antes de cambiar

---

## 7. TIPOGRAFÍA Y ESTILOS

### 7.1 Fuentes

#### Fuente Principal: Poppins
- **Familia**: `'Poppins', sans-serif`
- **Importación**: Google Fonts en `globals.css`
- **Uso**: Solo en el área de contenido editable
- **Tamaños**:
  - Letter: 16px
  - 10x15: 12px

#### Fuente del Título: font-headline
- **Familia**: Definida en `globals.css` (probablemente Space Grotesk o similar)
- **Tamaño**: `text-sm` (14px)
- **Peso**: `font-semibold` (600)

### 7.2 Colores

- **Fondo del cuaderno**: `bg-card` (blanco por defecto)
- **Bordes**: `border` (gris claro)
- **Líneas horizontales**: `#e2e8f0` (gris claro)
- **Margen rojo**: `#fca5a5` (rosa/rojo claro)
- **Texto**: `#1e293b` (gris oscuro)
- **Texto del título**: Color por defecto del tema
- **Fecha insertada**: `#a0a1a6` (gris medio)

### 7.3 Espaciado y Padding

#### Formato Letter
- **Padding superior**: 32px
- **Padding derecho**: 24px
- **Padding inferior**: 16px
- **Padding izquierdo del texto**: 70px (50px margen + 20px espacio)

#### Formato 10x15
- **Padding superior**: 16px
- **Padding derecho**: 12px
- **Padding inferior**: 8px
- **Padding izquierdo del texto**: 40px (20px margen + 20px espacio)

### 7.4 Sombras y Bordes

- **Sombra del Card**: `shadow-lg` (sombra grande)
- **Bordes redondeados**: `rounded-lg` (8px)
- **Borde cuando está minimizado**: `border-2 border-primary/50`

---

## 8. FUNCIONALIDADES

### 8.1 Autoguardado

#### Autoguardado del Contenido
- **Hook**: `useAutoSave`
- **Debounce**: 2000ms (2 segundos)
- **Trigger**: `onInput` y `onBlur`
- **Función**: Guarda el HTML del contenido editable en `pages[currentPageIndex]`
- **Indicador visual**: `SaveStatusIndicator` muestra el estado

#### Autoguardado del Título
- **Hook**: `useAutoSave` separado
- **Debounce**: 1000ms (1 segundo)
- **Trigger**: `onBlur` del título
- **Función**: Actualiza `content.title`

### 8.2 Dictado por Voz

- **Soporte**: Integrado con Web Speech API
- **Props**: `isListening`, `liveTranscript`
- **Funcionamiento**: Cuando `isListening === true` y el contenido está enfocado, inserta texto con `document.execCommand('insertText')`

### 8.3 Exportación

#### Exportar a PNG
- **Librería**: `html2canvas`
- **Resolución**: `scale: 3` (alta resolución)
- **Fondo**: Blanco (`#ffffff`)
- **Nombre del archivo**: `{título}_{timestamp}.png`

#### Exportar a PDF
- **Librería**: `jsPDF`
- **Formato**: Portrait, tamaño carta (794px × 1021px)
- **Selector de páginas**: Diálogo `ExportPdfDialog` permite elegir páginas
- **Resolución**: `scale: 2` por página
- **Nombre del archivo**: `{título}_{timestamp}.pdf`

### 8.4 Minimizar/Maximizar

- **Al minimizar**:
  - Guarda tamaño actual en `properties.originalSize`
  - Cambia altura a 48px
  - Marca `minimized: true`
  - Muestra solo título y botón maximizar

- **Al maximizar**:
  - Restaura tamaño desde `properties.originalSize`
  - Marca `minimized: false`
  - Muestra contenido completo

### 8.5 Cambio de Formato

- **Diálogo**: `ChangeFormatDialog`
- **Opciones**: Letter o 10x15
- **Al cambiar**:
  - Actualiza `properties.format`
  - Actualiza `width` y `height`
  - Actualiza `properties.size`
  - Aplica clases CSS correspondientes (`small-format`)

---

## 9. ESTADOS Y PROPS

### 9.1 Props Requeridas (`CommonElementProps`)

```typescript
{
  id: string;
  content: NotepadContent;
  properties?: CanvasElementProperties;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  onEditElement: (id: string) => void;
  isSelected: boolean;
  minimized?: boolean;
  isPreview?: boolean;
  onChangeNotepadFormat?: (id: string) => void;
  onFormatToggle?: () => void;
  isListening?: boolean;
  liveTranscript?: string;
}
```

### 9.2 Estados Locales

```typescript
const [isExportingPng, setIsExportingPng] = useState(false);
const [isExportingPdf, setIsExportingPdf] = useState(false);
const [isExportPdfDialogOpen, setIsExportPdfDialogOpen] = useState(false);
const [isInfoOpen, setIsInfoOpen] = useState(false);
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
```

### 9.3 Refs

```typescript
const titleRef = useRef<HTMLDivElement>(null);
const contentRef = useRef<HTMLDivElement>(null);
```

### 9.4 Tipo de Contenido (`NotepadContent`)

```typescript
interface NotepadContent {
  title?: string;
  pages?: string[]; // Array de HTML strings
  currentPage?: number; // Índice 0-based
}
```

---

## 10. IMPLEMENTACIÓN PASO A PASO

### Paso 1: Estructura Base

```tsx
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Card, CardFooter, CardContent } from '@/components/ui/card';
import type { CommonElementProps, NotepadContent, CanvasElementProperties } from '@/lib/types';

export default function NotepadElement(props: CommonElementProps) {
  const { id, content, properties, onUpdate, ... } = props;
  
  return (
    <Card data-element-id={id} className="notepad-card w-full h-full flex flex-col">
      {/* Header */}
      {/* Contenido */}
      {/* Footer */}
    </Card>
  );
}
```

### Paso 2: Header con Drag Handle y Título

```tsx
<div className="p-2 border-b flex flex-row items-center gap-1 cursor-grab drag-handle">
  <div className="p-1">
    <GripVertical className="size-5 text-muted-foreground" />
  </div>
  <div
    ref={titleRef}
    contentEditable={!isPreview}
    className="bg-transparent flex-grow outline-none font-headline text-sm font-semibold p-1"
  >
    {typedContent.title || 'Título'}
  </div>
  {/* Botones */}
</div>
```

### Paso 3: Botones del Header

Implementar cada botón según la lista del punto 4.2, usando:
- `Button` de `@/components/ui/button`
- Iconos de `lucide-react`
- Handlers correspondientes

### Paso 4: Área de Contenido con Líneas

```tsx
<CardContent className="p-0 flex-grow relative bg-card overflow-y-auto">
  <div className="notepad-content-container">
    {/* Fondo con líneas */}
    <div className="notepad-lines-background" />
    
    {/* Contenido editable */}
    <div
      ref={contentRef}
      contentEditable={!isPreview}
      className="notepad-content-editable"
    />
    
    {/* Indicador de guardado */}
    <SaveStatusIndicator status={saveStatus} />
  </div>
</CardContent>
```

### Paso 5: CSS para Líneas y Margen

Crear `notepad-element.css` con:
- Variables CSS para line-height y padding
- `.notepad-lines-background` con `background-image` de líneas
- `.notepad-lines-background::before` para margen rojo
- `.notepad-content-editable` con padding y tipografía

### Paso 6: Paginación

```tsx
<CardFooter className="p-2 border-t justify-center">
  <PaginationControls
    currentPage={currentPageIndex}
    totalPages={typedContent.pages?.length || 1}
    onPageChange={handlePageChange}
    onAddPage={handleAddPage}
  />
</CardFooter>
```

### Paso 7: Autoguardado

Integrar `useAutoSave` hook:
- Para contenido: debounce 2000ms
- Para título: debounce 1000ms
- Usar `forceSave()` para guardado manual

### Paso 8: Exportación

Implementar:
- `handleExportNotepadToPng` con `html2canvas`
- `handleExportNotepadToPdf` con `jsPDF`
- `ExportPdfDialog` para selección de páginas

### Paso 9: Cambio de Formato

- Integrar `ChangeFormatDialog`
- Implementar `handleSaveFormat` que actualiza dimensiones
- Aplicar clases CSS condicionales (`small-format`)

### Paso 10: Estados Especiales

- **Minimizado**: Renderizar solo título y botón maximizar
- **Preview**: Deshabilitar edición y algunos botones
- **Info abierto**: Mostrar overlay con información

---

## 11. CONSIDERACIONES TÉCNICAS IMPORTANTES

### 11.1 Alineación Perfecta

**CRÍTICO**: La alineación perfecta depende de:
- `line-height: 1.5rem` (24px) en el contenido editable
- `background-size: 100% 1.5rem` (24px) en las líneas de fondo
- Ambos deben coincidir **exactamente**

### 11.2 Padding Izquierdo

El padding izquierdo del texto debe ser:
- **Margen rojo** + **20px de espacio**
- Letter: 50px + 20px = 70px
- 10x15: 20px + 20px = 40px

### 11.3 Guardado de Contenido

- Siempre guardar antes de cambiar de página
- Usar `forceSave()` antes de minimizar o cerrar
- El autoguardado usa debounce para evitar guardados excesivos

### 11.4 Manejo de Eventos

- Todos los botones deben usar `onMouseDown` con `stopPropagation()` para evitar conflictos con drag
- El título y contenido deben usar `stopPropagation()` en sus eventos

---

## 12. DEPENDENCIAS EXTERNAS

- `html2canvas`: Para exportar a PNG
- `jsPDF`: Para exportar a PDF
- `date-fns`: Para formatear fechas
- `lucide-react`: Para iconos
- `@/components/ui/*`: Componentes de ShadCN UI
- `@/hooks/use-auto-save`: Hook de autoguardado
- `@/components/canvas/save-status-indicator`: Indicador visual

---

## 13. ARCHIVOS RELACIONADOS

- `notepad-element.tsx`: Componente principal
- `notepad-element.css`: Estilos CSS
- `change-format-dialog.tsx`: Diálogo de cambio de formato
- `export-pdf-dialog.tsx`: Diálogo de exportación PDF
- `delete-notepad-dialog.tsx`: Diálogo de confirmación de eliminación
- `save-status-indicator.tsx`: Indicador de estado de guardado
- `use-auto-save.ts`: Hook de autoguardado

---

**FIN DEL MANUAL**

