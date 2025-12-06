# Archivos y Código Necesarios para Implementar el Cuaderno Principal

**Fecha**: 4 de Diciembre 2024  
**Componente**: NotepadElement  
**Objetivo**: Lista completa de archivos, código y dependencias necesarias

---

## 📦 DEPENDENCIAS NPM

### Instalación Requerida

```bash
npm install html2canvas jspdf date-fns
```

### Dependencias Ya Incluidas (ShadCN UI)

- `@radix-ui/react-dialog`
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-radio-group`
- `@radix-ui/react-label`
- `lucide-react`

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
src/
├── components/
│   ├── canvas/
│   │   ├── elements/
│   │   │   ├── notepad-element.tsx          [ARCHIVO PRINCIPAL]
│   │   │   ├── notepad-element.css          [ESTILOS CSS]
│   │   │   ├── change-format-dialog.tsx     [DIÁLOGO FORMATO]
│   │   │   ├── export-pdf-dialog.tsx        [DIÁLOGO PDF]
│   │   │   └── delete-notepad-dialog.tsx    [DIÁLOGO ELIMINAR]
│   │   └── save-status-indicator.tsx        [INDICADOR GUARDADO]
│   └── ui/
│       ├── card.tsx                          [COMPONENTE CARD]
│       ├── button.tsx                        [COMPONENTE BUTTON]
│       ├── dialog.tsx                        [COMPONENTE DIALOG]
│       ├── dropdown-menu.tsx                 [COMPONENTE DROPDOWN]
│       ├── radio-group.tsx                   [COMPONENTE RADIO]
│       ├── label.tsx                         [COMPONENTE LABEL]
│       └── checkbox.tsx                      [COMPONENTE CHECKBOX]
├── hooks/
│   └── use-auto-save.ts                      [HOOK AUTOGUARDADO]
├── lib/
│   └── types.ts                              [TIPOS TYPESCRIPT]
└── app/
    └── globals.css                           [ESTILOS GLOBALES]
```

---

## 📄 ARCHIVO 1: notepad-element.tsx

**Ubicación**: `src/components/canvas/elements/notepad-element.tsx`

**Código Completo**: Ver archivo original (641 líneas)

**Imports Principales**:
```typescript
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Card, CardFooter, CardContent } from '@/components/ui/card';
import type { CommonElementProps, NotepadContent, CanvasElementProperties } from '@/lib/types';
import {
  MoreVertical, X, Minus, Maximize, GripVertical,
  FileImage, Settings,
  ChevronLeft, ChevronRight, Plus, Save,
  Info, Eraser, CalendarDays, Wrench, FileSignature, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import DeleteNotepadDialog from './delete-notepad-dialog';
import { useAutoSave } from '@/hooks/use-auto-save';
import { SaveStatusIndicator } from '@/components/canvas/save-status-indicator';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ExportPdfDialog from './export-pdf-dialog';
import './notepad-element.css';
```

---

## 📄 ARCHIVO 2: notepad-element.css

**Ubicación**: `src/components/canvas/elements/notepad-element.css`

**Código Completo**:

```css
/* Variables CSS para alineación perfecta */
:root {
  --notepad-line-height: 1.5rem; /* 24px - La clave de la alineación perfecta */
  --notepad-page-padding-top: 32px; /* Padding-top del notepad normal */
  --notepad-background-offset-y: calc(var(--notepad-page-padding-top) + 18px);
  --notepad-small-padding-top: 16px; /* Padding-top del notepad pequeño */
  --notepad-small-background-offset-y: calc(var(--notepad-small-padding-top) + 18px);
}

/* Contenedor del contenido del cuaderno con líneas horizontales perfectas */
.notepad-content-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Fondo con líneas horizontales - ALINEACIÓN PERFECTA: cada 1.5rem (24px) */
.notepad-lines-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  
  /* Líneas horizontales del cuaderno - ALINEACIÓN PERFECTA: cada 1.5rem (24px) */
  background-image: linear-gradient(#e2e8f0 1px, transparent 1px);
  background-size: 100% var(--notepad-line-height); /* 1.5rem = 24px - La clave de la alineación */
  background-position-y: var(--notepad-background-offset-y);
  background-repeat: repeat-y;
}

/* Versión para formato pequeño - Ajustar offset */
.notepad-lines-background.small-format {
  background-position-y: var(--notepad-small-background-offset-y);
}

/* Margen rojo - Del super cuaderno */
.notepad-lines-background::before {
  content: '';
  position: absolute;
  top: var(--notepad-page-padding-top);
  bottom: 16px; /* Padding-bottom del notepad */
  left: 50px; /* Posición del margen rojo */
  width: 1px;
  background-color: #fca5a5;
}

/* Margen rojo para formato pequeño */
.notepad-lines-background.small-format::before {
  top: var(--notepad-small-padding-top);
  bottom: 8px; /* Padding-bottom del notepad pequeño */
  left: 20px; /* Margen rojo más cerca para formato pequeño */
}

/* Área de contenido editable - ALINEACIÓN PERFECTA con Poppins */
/* IMPORTANTE: El texto debe iniciar DESPUÉS de la línea de margen */
.notepad-content-editable {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  min-height: 100%;
  outline: none;
  padding-left: 70px !important; /* 50px (margen rojo) + 20px (espacio después del margen) - Sobrescribe padding de Tailwind */
  font-family: 'Poppins', sans-serif !important; /* Fuente Poppins - Sobrescribe font-body */
  font-size: 16px !important; /* text-base en Tailwind - Sobrescribe cualquier tamaño */
  line-height: 1.5rem !important; /* leading-6 en Tailwind = 24px - LA CLAVE DE LA ALINEACIÓN - Sobrescribe leading */
  color: #1e293b;
  white-space: pre-wrap;
  word-wrap: break-word;
  box-sizing: border-box;
}

/* Permitir posicionamiento del cursor en cualquier línea - ALINEACIÓN PERFECTA */
.notepad-content-editable * {
  line-height: 1.5rem; /* 24px - Debe coincidir exactamente con background-size */
  min-height: 1.5rem; /* 24px */
}

.notepad-content-editable div {
  min-height: 1.5rem; /* 24px */
}

/* Versión para formato pequeño (10x15) */
.notepad-content-editable.small-format {
  padding-left: 40px !important; /* 20px (margen rojo pequeño) + 20px (espacio después del margen) */
  font-size: 12px !important;
  line-height: 1.5rem !important; /* Mantener la misma altura de línea para alineación */
}
```

---

## 📄 ARCHIVO 3: change-format-dialog.tsx

**Ubicación**: `src/components/canvas/change-format-dialog.tsx`

**Código Completo**:

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { CanvasElement, WithId, NotepadElementProperties } from '@/lib/types';

interface ChangeFormatDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  notepad: WithId<CanvasElement> | null;
  onSaveFormat: (id: string, format: 'letter' | '10x15') => void;
}

const formats = [
  { id: 'letter', label: 'Carta (8.5" x 11")', description: 'Formato estándar para documentos.' },
  { id: '10x15', label: 'Ficha (10cm x 15cm)', description: 'Ideal para notas rápidas y fichas de estudio.' },
];

export default function ChangeFormatDialog({
  isOpen,
  onOpenChange,
  notepad,
  onSaveFormat,
}: ChangeFormatDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<'letter' | '10x15'>('letter');

  useEffect(() => {
    if (notepad) {
      const currentFormat = (notepad.properties as NotepadElementProperties)?.format || 'letter';
      setSelectedFormat(currentFormat);
    }
  }, [notepad]);

  const handleSave = () => {
    if (notepad?.id) {
      onSaveFormat(notepad.id, selectedFormat);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar Formato del Cuaderno</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as 'letter' | '10x15')}>
            {formats.map((format) => (
              <Label
                key={format.id}
                htmlFor={format.id}
                className="flex items-start space-x-3 p-4 rounded-md border hover:bg-accent cursor-pointer"
              >
                <RadioGroupItem value={format.id} id={format.id} />
                <div className="grid gap-1.5">
                  <span className="font-semibold">{format.label}</span>
                  <span className="text-sm text-muted-foreground">{format.description}</span>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 📄 ARCHIVO 4: export-pdf-dialog.tsx

**Ubicación**: `src/components/canvas/elements/export-pdf-dialog.tsx`

**Código Completo**:

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ExportPdfDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  totalPages: number;
  onExport: (selectedPages: number[]) => void;
}

export default function ExportPdfDialog({
  isOpen,
  onOpenChange,
  totalPages,
  onExport,
}: ExportPdfDialogProps) {
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Por defecto, seleccionar todas las páginas
      setSelectedPages(Array.from({ length: totalPages }, (_, i) => i));
    }
  }, [isOpen, totalPages]);

  const handleTogglePage = (pageIndex: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageIndex)
        ? prev.filter((p) => p !== pageIndex)
        : [...prev, pageIndex].sort((a, b) => a - b)
    );
  };

  const handleSelectAll = () => {
    if (selectedPages.length === totalPages) {
      setSelectedPages([]);
    } else {
      setSelectedPages(Array.from({ length: totalPages }, (_, i) => i));
    }
  };

  const handleExport = () => {
    if (selectedPages.length === 0) {
      return;
    }
    onExport(selectedPages);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar Páginas a PDF</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="w-full"
            >
              {selectedPages.length === totalPages ? 'Deseleccionar Todas' : 'Seleccionar Todas'}
            </Button>
          </div>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Checkbox
                  id={`page-${i}`}
                  checked={selectedPages.includes(i)}
                  onCheckedChange={() => handleTogglePage(i)}
                />
                <Label
                  htmlFor={`page-${i}`}
                  className="flex-1 cursor-pointer"
                >
                  Página {i + 1}
                </Label>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {selectedPages.length === 0
              ? 'Selecciona al menos una página para exportar'
              : `Se exportarán ${selectedPages.length} página${selectedPages.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={selectedPages.length === 0}>
            Exportar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 📄 ARCHIVO 5: delete-notepad-dialog.tsx

**Ubicación**: `src/components/canvas/elements/delete-notepad-dialog.tsx`

**Código Completo**: (Ver archivo original - componente simple de confirmación)

---

## 📄 ARCHIVO 6: save-status-indicator.tsx

**Ubicación**: `src/components/canvas/save-status-indicator.tsx`

**Código Completo**: (Ver archivo original - componente visual de estado)

---

## 📄 ARCHIVO 7: use-auto-save.ts

**Ubicación**: `src/hooks/use-auto-save.ts`

**Código Completo**: (Ver archivo original - hook de autoguardado con debounce)

---

## 📄 ARCHIVO 8: Tipos TypeScript (types.ts)

**Ubicación**: `src/lib/types.ts`

**Tipos Necesarios**:

```typescript
export interface NotepadContent {
  title?: string;
  pages?: string[];
  currentPage?: number;
}

export interface NotepadElementProperties extends CanvasElementProperties {
  format?: 'letter' | '10x15';
}

export interface NotepadCanvasElement extends BaseVisualProperties {
  type: 'notepad';
  hidden?: boolean;
  content: NotepadContent;
  minimized?: boolean;
}
```

---

## 📄 ARCHIVO 9: globals.css (Fuentes)

**Ubicación**: `src/app/globals.css`

**Importación de Fuente Poppins**:

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
```

**Configuración de Fuentes**:

```css
:root {
  --font-headline: 'Space Grotesk', sans-serif; /* o la fuente que uses */
  --font-body: 'Roboto', sans-serif;
}
```

---

## 🔧 CONFIGURACIÓN DE TAMAÑOS

### Formato Letter
```typescript
const letterSize = {
  width: 794,  // 8.5" × 96 DPI
  height: 1021  // 11" × 96 DPI
};
```

### Formato 10x15
```typescript
const format10x15Size = {
  width: 378,   // 10cm × 37.8px/cm ≈ 378px
  height: 567   // 15cm × 37.8px/cm ≈ 567px
};
```

---

## 🎨 COLORES Y ESTILOS

### Colores Principales
```css
/* Líneas horizontales */
--line-color: #e2e8f0;

/* Margen rojo */
--margin-red: #fca5a5;

/* Texto */
--text-color: #1e293b;

/* Fecha insertada */
--date-color: #a0a1a6;
```

### Espaciado
```css
/* Letter */
--padding-top-letter: 32px;
--padding-right-letter: 24px;
--padding-bottom-letter: 16px;
--padding-left-text-letter: 70px;

/* 10x15 */
--padding-top-small: 16px;
--padding-right-small: 12px;
--padding-bottom-small: 8px;
--padding-left-text-small: 40px;
```

---

## 📦 PACKAGE.JSON DEPENDENCIES

```json
{
  "dependencies": {
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1",
    "date-fns": "^3.6.0",
    ",
    "lucide-react": "^0.400.0",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-checkbox": "^1.1.4"
  }
}
```

---

## 🔗 INTEGRACIÓN CON EL SISTEMA

### Registro en types.ts
```typescript
export type ElementType = 
  | 'notepad'  // ← Debe estar incluido
  | ...otros tipos;
```

### Registro en board-content.tsx o transformable-element.tsx
```typescript
import NotepadElement from './elements/notepad-element';

const ElementComponentMap = {
  notepad: NotepadElement,
  // ... otros elementos
};
```

### Handler en page.tsx
```typescript
const handleChangeNotepadFormat = useCallback((id: string) => {
  const element = elements.find(el => el.id === id);
  if (element) {
    setSelectedNotepadForFormat(element);
    setChangeFormatDialogOpen(true);
  }
}, [elements]);

const handleSaveFormat = useCallback((id: string, format: 'letter' | '10x15') => {
  const newSize = format === 'letter' 
    ? { width: 794, height: 1021 }
    : { width: 378, height: 567 };
  updateElement(id, { 
    width: newSize.width,
    height: newSize.height,
    properties: { 
      ...selectedNotepadForFormat?.properties, 
      format, 
      size: newSize 
    } 
  });
  setChangeFormatDialogOpen(false);
}, [selectedNotepadForFormat, updateElement]);
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Instalar dependencias: `html2canvas`, `jspdf`, `date-fns`
- [ ] Crear `notepad-element.tsx` con toda la estructura
- [ ] Crear `notepad-element.css` con estilos de líneas y margen
- [ ] Crear `change-format-dialog.tsx`
- [ ] Crear `export-pdf-dialog.tsx`
- [ ] Crear `delete-notepad-dialog.tsx`
- [ ] Verificar que `save-status-indicator.tsx` existe
- [ ] Verificar que `use-auto-save.ts` existe
- [ ] Agregar tipos en `types.ts`
- [ ] Registrar componente en `ElementComponentMap`
- [ ] Agregar handlers en `page.tsx`
- [ ] Importar fuente Poppins en `globals.css`
- [ ] Probar creación de cuaderno
- [ ] Probar cambio de formato
- [ ] Probar exportación PNG
- [ ] Probar exportación PDF
- [ ] Probar paginación
- [ ] Probar autoguardado

---

**FIN DEL DOCUMENTO DE ARCHIVOS**

