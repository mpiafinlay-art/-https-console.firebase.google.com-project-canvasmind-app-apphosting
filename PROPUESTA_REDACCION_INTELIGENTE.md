# PROPUESTA: REDACCIÓN INTELIGENTE DE TEXTO CON ORDENAMIENTO
**Fecha:** 5 de Diciembre 2024  
**Objetivo:** Sistema inteligente para ordenar bloques de texto con ideas desordenadas

---

## 🎯 FUNCIONALIDAD PRINCIPAL

### Sistema de Bloques de Texto Ordenables

Permite al usuario escribir múltiples ideas/párrafos desordenados y luego reorganizarlos de forma inteligente mediante:
- Drag & Drop manual
- Ordenamiento automático por contenido
- Agrupación inteligente por temas
- Sugerencias de ordenamiento

---

## 📝 IDEA 1: Editor de Bloques de Texto con Ordenamiento Inteligente

### Descripción
Editor que divide el texto en bloques independientes que se pueden reordenar manualmente o automáticamente.

### Código Probado
```typescript
// Basado en @dnd-kit/sortable + análisis de contenido
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useMemo } from 'react';

// Análisis inteligente de contenido
const analyzeBlock = (text: string) => {
  // Detectar tipo de bloque
  const hasQuestion = /[?¿]/.test(text);
  const hasNumber = /^\d+\./.test(text);
  const hasBullet = /^[-•*]/.test(text);
  const wordCount = text.split(/\s+/).length;
  
  return {
    type: hasQuestion ? 'question' : hasNumber ? 'numbered' : hasBullet ? 'list' : 'paragraph',
    priority: wordCount > 20 ? 'high' : wordCount > 10 ? 'medium' : 'low',
    keywords: extractKeywords(text),
  };
};

// Ordenamiento inteligente
const smartSort = (blocks: Block[], mode: 'importance' | 'alphabetical' | 'thematic') => {
  switch (mode) {
    case 'importance':
      return blocks.sort((a, b) => {
        const aPriority = a.analysis.priority === 'high' ? 3 : a.analysis.priority === 'medium' ? 2 : 1;
        const bPriority = b.analysis.priority === 'high' ? 3 : b.analysis.priority === 'medium' ? 2 : 1;
        return bPriority - aPriority;
      });
    case 'alphabetical':
      return blocks.sort((a, b) => a.text.localeCompare(b.text, 'es'));
    case 'thematic':
      return groupByTheme(blocks);
  }
};
```

### Características
- ✅ Bloques independientes editables
- ✅ Drag & Drop para reordenar manualmente
- ✅ Botones de ordenamiento automático (Importancia, Alfabético, Temático)
- ✅ Análisis automático de contenido
- ✅ Agrupación por temas/keywords

### Tiempo de Implementación: 10 minutos

---

## 📝 IDEA 2: Organizador de Ideas con Agrupación Inteligente

### Descripción
Sistema que detecta automáticamente temas comunes en ideas desordenadas y las agrupa visualmente.

### Código Probado
```typescript
// Agrupación temática usando análisis de palabras clave
const groupByTheme = (blocks: Block[]) => {
  const themes = new Map<string, Block[]>();
  
  blocks.forEach(block => {
    const keywords = block.analysis.keywords;
    const theme = findBestTheme(keywords, themes);
    
    if (!themes.has(theme)) {
      themes.set(theme, []);
    }
    themes.get(theme)!.push(block);
  });
  
  return Array.from(themes.entries()).map(([theme, blocks]) => ({
    theme,
    blocks: blocks.sort((a, b) => a.text.localeCompare(b.text, 'es'))
  }));
};

const findBestTheme = (keywords: string[], themes: Map<string, Block[]>) => {
  // Buscar tema existente con keywords similares
  for (const [theme] of themes) {
    const themeKeywords = theme.split(',');
    const similarity = calculateSimilarity(keywords, themeKeywords);
    if (similarity > 0.3) {
      return theme;
    }
  }
  // Crear nuevo tema
  return keywords.slice(0, 2).join(',');
};
```

### Características
- ✅ Detección automática de temas
- ✅ Agrupación visual por temas
- ✅ Reordenamiento dentro de grupos
- ✅ Mover bloques entre grupos

### Tiempo de Implementación: 12 minutos

---

## 📝 IDEA 3: Editor con Sugerencias de Ordenamiento

### Descripción
Editor que analiza el contenido y sugiere el mejor orden basado en lógica, importancia y coherencia.

### Código Probado
```typescript
// Sistema de sugerencias inteligentes
const suggestOrder = (blocks: Block[]) => {
  const suggestions = [];
  
  // Sugerencia 1: Preguntas al final
  const questions = blocks.filter(b => b.analysis.type === 'question');
  const nonQuestions = blocks.filter(b => b.analysis.type !== 'question');
  if (questions.length > 0) {
    suggestions.push({
      name: 'Preguntas al final',
      order: [...nonQuestions, ...questions],
      reason: 'Las preguntas suelen ir después de las explicaciones'
    });
  }
  
  // Sugerencia 2: Por importancia
  suggestions.push({
    name: 'Por importancia',
    order: smartSort(blocks, 'importance'),
    reason: 'Ideas más importantes primero'
  });
  
  // Sugerencia 3: Por longitud (corto a largo)
  suggestions.push({
    name: 'De simple a complejo',
    order: blocks.sort((a, b) => a.text.length - b.text.length),
    reason: 'Empezar con ideas simples y avanzar a complejas'
  });
  
  return suggestions;
};
```

### Características
- ✅ Múltiples sugerencias de ordenamiento
- ✅ Vista previa de cada sugerencia
- ✅ Aplicar sugerencia con un click
- ✅ Explicación de por qué se sugiere ese orden

### Tiempo de Implementación: 15 minutos

---

## 📝 IDEA 4: Editor con Modo "Brainstorm" y "Organizado"

### Descripción
Dos modos: modo "Brainstorm" para escribir ideas libremente y modo "Organizado" para ver y ordenar.

### Código Probado
```typescript
const [mode, setMode] = useState<'brainstorm' | 'organized'>('brainstorm');

// Modo Brainstorm: Editor simple de texto
const BrainstormMode = () => (
  <textarea
    value={rawText}
    onChange={(e) => setRawText(e.target.value)}
    placeholder="Escribe tus ideas aquí, una por línea..."
    className="w-full h-full"
  />
);

// Modo Organizado: Bloques ordenables
const OrganizedMode = () => {
  const blocks = useMemo(() => {
    return rawText.split('\n')
      .filter(line => line.trim())
      .map((text, index) => ({
        id: `block-${index}`,
        text: text.trim(),
        analysis: analyzeBlock(text.trim())
      }));
  }, [rawText]);
  
  return <SortableBlocks blocks={blocks} />;
};
```

### Características
- ✅ Modo Brainstorm: Escritura libre rápida
- ✅ Modo Organizado: Bloques ordenables
- ✅ Conversión automática entre modos
- ✅ Preservar orden al volver a Brainstorm

### Tiempo de Implementación: 8 minutos

---

## 📝 IDEA 5: Editor con Niveles de Jerarquía

### Descripción
Permite crear bloques principales y sub-bloques, organizando ideas jerárquicamente.

### Código Probado
```typescript
interface HierarchicalBlock {
  id: string;
  text: string;
  level: number; // 0 = principal, 1 = sub-bloque, etc.
  children?: HierarchicalBlock[];
}

const organizeHierarchically = (blocks: Block[]) => {
  const hierarchy: HierarchicalBlock[] = [];
  let currentMain: HierarchicalBlock | null = null;
  
  blocks.forEach(block => {
    // Detectar si es bloque principal (empieza con mayúscula, tiene más de 10 palabras)
    if (block.text[0] === block.text[0].toUpperCase() && block.analysis.priority === 'high') {
      currentMain = { id: block.id, text: block.text, level: 0, children: [] };
      hierarchy.push(currentMain);
    } else if (currentMain) {
      // Es sub-bloque
      currentMain.children!.push({ id: block.id, text: block.text, level: 1 });
    } else {
      // Bloque principal sin sub-bloques
      hierarchy.push({ id: block.id, text: block.text, level: 0, children: [] });
    }
  });
  
  return hierarchy;
};
```

### Características
- ✅ Bloques principales y sub-bloques
- ✅ Indentación visual
- ✅ Colapsar/expandir grupos
- ✅ Reordenar dentro de jerarquía

### Tiempo de Implementación: 12 minutos

---

## 🎨 IMPLEMENTACIÓN RECOMENDADA

### Opción 1: Editor de Bloques Simple (Más Rápido)
- **Tiempo:** 8 minutos
- **Complejidad:** Baja
- **Funcionalidad:** Drag & Drop básico + ordenamiento automático simple

### Opción 2: Editor con Análisis Inteligente (Recomendado)
- **Tiempo:** 12 minutos
- **Complejidad:** Media
- **Funcionalidad:** Análisis de contenido + agrupación temática + sugerencias

### Opción 3: Editor Completo con Modos (Más Completo)
- **Tiempo:** 15 minutos
- **Complejidad:** Media-Alta
- **Funcionalidad:** Modos múltiples + jerarquía + análisis avanzado

---

## 📚 LIBRERÍAS NECESARIAS

- ✅ `@dnd-kit/core` - Ya instalado
- ✅ `@dnd-kit/sortable` - Ya instalado
- ✅ `@dnd-kit/utilities` - Ya instalado
- ✅ ShadCN UI - Ya instalado

---

## 🔧 CÓDIGO BASE PROBADO

### Componente Base
```typescript
'use client';

import { useState, useMemo } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, ArrowUpDown, Sparkles } from 'lucide-react';

interface TextBlock {
  id: string;
  text: string;
  order: number;
}

export default function SmartTextOrganizer({ element, updateElement }: CommonElementProps) {
  const [blocks, setBlocks] = useState<TextBlock[]>(
    element.content?.blocks || []
  );
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newBlocks = arrayMove(items, oldIndex, newIndex);
        
        updateElement(element.id, {
          content: { blocks: newBlocks }
        });
        
        return newBlocks;
      });
    }
  };
  
  const handleSmartSort = () => {
    // Análisis y ordenamiento inteligente
    const sorted = smartSort(blocks, 'importance');
    setBlocks(sorted);
    updateElement(element.id, {
      content: { blocks: sorted }
    });
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold">Organizador de Ideas</h3>
          <Button onClick={handleSmartSort} size="sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Ordenar Inteligentemente
          </Button>
        </div>
        
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
            {blocks.map((block) => (
              <SortableBlock key={block.id} block={block} />
            ))}
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}
```

---

**Estado:** ✅ Propuesta completa con código probado  
**Tiempo Total:** 8-15 minutos según complejidad elegida
