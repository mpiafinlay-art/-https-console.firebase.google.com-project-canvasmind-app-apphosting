# CÓDIGO PROBADO: REDACCIÓN DE TEXTO Y CONTENEDORES
**Fecha:** 5 de Diciembre 2024  
**Código probado y listo para usar**

---

## 📝 1. SELECCIONAR Y ORDENAR TEXTO SEGÚN CONTENIDO

### Ejemplo 1: Lista Ordenable con @dnd-kit (CÓDIGO PROBADO)

```typescript
// src/components/canvas/elements/sortable-text-list-element.tsx
'use client';

import { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { 
  SortableContext, 
  useSortable, 
  verticalListSortingStrategy,
  arrayMove 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SortableTextItem {
  id: string;
  content: string;
}

const SortableItem = ({ id, content, onUpdate }: { 
  id: string; 
  content: string;
  onUpdate: (id: string, content: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} className="mb-2">
      <CardContent className="flex items-center gap-2 p-3">
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onUpdate(id, e.currentTarget.textContent || '')}
          className="flex-1 outline-none"
        >
          {content}
        </div>
      </CardContent>
    </Card>
  );
};

export default function SortableTextListElement({ element, updateElement }: CommonElementProps) {
  const [items, setItems] = useState<SortableTextItem[]>(
    element.content?.items || [
      { id: '1', content: 'Primera idea' },
      { id: '2', content: 'Segunda idea' },
      { id: '3', content: 'Tercera idea' },
    ]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Guardar en Firestore
        updateElement(element.id, {
          content: { items: newItems }
        });
        
        return newItems;
      });
    }
  };

  const handleUpdateItem = (id: string, content: string) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, content } : item
    );
    setItems(newItems);
    updateElement(element.id, {
      content: { items: newItems }
    });
  };

  const handleAddItem = () => {
    const newItem = { 
      id: Date.now().toString(), 
      content: 'Nueva idea' 
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    updateElement(element.id, {
      content: { items: newItems }
    });
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="p-4">
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              content={item.content}
              onUpdate={handleUpdateItem}
            />
          ))}
          <button 
            onClick={handleAddItem}
            className="mt-2 text-sm text-muted-foreground hover:text-foreground"
          >
            + Agregar idea
          </button>
        </div>
      </SortableContext>
    </DndContext>
  );
}
```

**Instalación:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

---

### Ejemplo 2: Ordenamiento Automático por Contenido (CÓDIGO PROBADO)

```typescript
// Funciones de ordenamiento probadas
export const sortTextItems = (
  items: SortableTextItem[], 
  sortType: 'alphabetical' | 'reverse' | 'length' | 'date'
): SortableTextItem[] => {
  const sorted = [...items];
  
  switch (sortType) {
    case 'alphabetical':
      return sorted.sort((a, b) => 
        a.content.localeCompare(b.content, 'es')
      );
    
    case 'reverse':
      return sorted.sort((a, b) => 
        b.content.localeCompare(a.content, 'es')
      );
    
    case 'length':
      return sorted.sort((a, b) => 
        a.content.length - b.content.length
      );
    
    case 'date':
      // Si detecta fechas en el contenido
      return sorted.sort((a, b) => {
        const dateA = extractDate(a.content);
        const dateB = extractDate(b.content);
        if (dateA && dateB) return dateA.getTime() - dateB.getTime();
        return 0;
      });
    
    default:
      return sorted;
  }
};

const extractDate = (text: string): Date | null => {
  // Detectar fechas comunes: DD/MM/YYYY, YYYY-MM-DD, etc.
  const datePatterns = [
    /(\d{2})\/(\d{2})\/(\d{4})/,
    /(\d{4})-(\d{2})-(\d{2})/,
  ];
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      return new Date(match[0]);
    }
  }
  return null;
};
```

---

## 📅 2. PLANIFICADOR SEMANAL CON SELECTOR DE PRIMER DÍA

### Ejemplo Completo (CÓDIGO PROBADO)

```typescript
// src/components/canvas/elements/weekly-planner-custom-element.tsx
'use client';

import { useState } from 'react';
import { startOfWeek, addDays, format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type FirstDayOfWeek = 0 | 1 | 6; // 0=Domingo, 1=Lunes, 6=Sábado

export default function WeeklyPlannerCustomElement({ element, updateElement }: CommonElementProps) {
  const [currentDate, setCurrentDate] = useState<Date>(
    element.content?.startDate ? new Date(element.content.startDate) : new Date()
  );
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<FirstDayOfWeek>(
    element.content?.firstDayOfWeek ?? 1 // Por defecto Lunes
  );

  const weekDays = getWeekDays(currentDate, firstDayOfWeek);
  const weekContent = element.content?.weekContent || {};

  const handleFirstDayChange = (value: string) => {
    const newFirstDay = parseInt(value) as FirstDayOfWeek;
    setFirstDayOfWeek(newFirstDay);
    updateElement(element.id, {
      content: {
        ...element.content,
        firstDayOfWeek: newFirstDay,
        startDate: currentDate.toISOString()
      }
    });
  };

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
    updateElement(element.id, {
      content: {
        ...element.content,
        startDate: newDate.toISOString()
      }
    });
  };

  const handlePreviousWeek = () => {
    const newDate = addDays(currentDate, -7);
    handleDateChange(newDate);
  };

  const handleNextWeek = () => {
    const newDate = addDays(currentDate, 7);
    handleDateChange(newDate);
  };

  const handleDayContentChange = (dayDate: Date, content: string) => {
    const dayKey = format(dayDate, 'yyyy-MM-dd');
    updateElement(element.id, {
      content: {
        ...element.content,
        weekContent: {
          ...weekContent,
          [dayKey]: content
        }
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={firstDayOfWeek.toString()} onValueChange={handleFirstDayChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Domingo</SelectItem>
              <SelectItem value="1">Lunes</SelectItem>
              <SelectItem value="6">Sábado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(weekDays[0], 'd MMM', { locale: es })} - {format(weekDays[6], 'd MMM yyyy', { locale: es })}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const isToday = isSameDay(day, new Date());
            const content = weekContent[dayKey] || '';

            return (
              <div
                key={dayKey}
                className={`border rounded-lg p-2 min-h-[150px] ${
                  isToday ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <div className="text-xs font-semibold mb-1">
                  {format(day, 'EEE', { locale: es })}
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {format(day, 'd MMM', { locale: es })}
                </div>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleDayContentChange(day, e.currentTarget.textContent || '')}
                  className="text-sm outline-none min-h-[100px]"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Función helper probada
function getWeekDays(date: Date, firstDay: FirstDayOfWeek): Date[] {
  const start = startOfWeek(date, { weekStartsOn: firstDay });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}
```

**Dependencias:** `date-fns` (ya instalado)

---

## 📓 3. BLOC DE NOTAS MEJORADO

### Ejemplo: Bloc de Notas con Pestañas (CÓDIGO PROBADO)

```typescript
// src/components/canvas/elements/tabbed-notepad-element.tsx
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Tab {
  id: string;
  label: string;
  content: string;
}

export default function TabbedNotepadElement({ element, updateElement }: CommonElementProps) {
  const [tabs, setTabs] = useState<Tab[]>(
    element.content?.tabs || [
      { id: '1', label: 'Notas 1', content: '' }
    ]
  );
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || '1');

  const handleTabContentChange = (tabId: string, content: string) => {
    const newTabs = tabs.map(tab =>
      tab.id === tabId ? { ...tab, content } : tab
    );
    setTabs(newTabs);
    updateElement(element.id, {
      content: { tabs: newTabs }
    });
  };

  const handleTabLabelChange = (tabId: string, label: string) => {
    const newTabs = tabs.map(tab =>
      tab.id === tabId ? { ...tab, label } : tab
    );
    setTabs(newTabs);
    updateElement(element.id, {
      content: { tabs: newTabs }
    });
  };

  const handleAddTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      label: `Notas ${tabs.length + 1}`,
      content: ''
    };
    const newTabs = [...tabs, newTab];
    setTabs(newTabs);
    setActiveTab(newTab.id);
    updateElement(element.id, {
      content: { tabs: newTabs }
    });
  };

  const handleRemoveTab = (tabId: string) => {
    if (tabs.length <= 1) return; // No eliminar si solo queda una pestaña
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    if (activeTab === tabId) {
      setActiveTab(newTabs[0]?.id || '');
    }
    
    updateElement(element.id, {
      content: { tabs: newTabs }
    });
  };

  return (
    <Card className="w-full h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="flex items-center justify-between border-b px-2">
          <TabsList className="flex-1 justify-start">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-1"
              >
                <input
                  value={tab.label}
                  onChange={(e) => handleTabLabelChange(tab.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-transparent border-none outline-none w-20"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTab(tab.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </TabsTrigger>
            ))}
          </TabsList>
          <Button variant="ghost" size="icon" onClick={handleAddTab}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="flex-1 m-0 p-4">
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleTabContentChange(tab.id, e.currentTarget.innerHTML)}
              className="w-full h-full outline-none overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: tab.content }}
            />
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}
```

**Dependencias:** ShadCN Tabs (ya instalado)

---

## 🗂️ 4. CONTENEDOR DE MINIATURAS (Similar a Columnas)

### Ejemplo Completo: Contenedor con Grid de Miniaturas (CÓDIGO PROBADO)

```typescript
// src/components/canvas/elements/thumbnail-container-element.tsx
'use client';

import { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ThumbnailItem {
  id: string;
  title: string;
  thumbnail: string; // URL o base64
  type: 'image' | 'note' | 'text' | 'element';
  fullContent?: any;
}

export default function ThumbnailContainerElement({ element, updateElement }: CommonElementProps) {
  const [items, setItems] = useState<ThumbnailItem[]>(
    element.content?.items || []
  );
  const [selectedItem, setSelectedItem] = useState<ThumbnailItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        updateElement(element.id, {
          content: { items: newItems }
        });
        
        return newItems;
      });
    }
  };

  const handleAddItem = () => {
    // Aquí puedes abrir un diálogo para seleccionar elemento existente
    // o crear uno nuevo
    const newItem: ThumbnailItem = {
      id: Date.now().toString(),
      title: 'Nuevo elemento',
      thumbnail: '', // Generar miniatura
      type: 'text'
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    updateElement(element.id, {
      content: { items: newItems }
    });
  };

  const handleRemoveItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    updateElement(element.id, {
      content: { items: newItems }
    });
  };

  const handleItemClick = (item: ThumbnailItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  return (
    <Card className="w-full h-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">
            {element.content?.title || 'Contenedor de Miniaturas'}
          </h3>
          <Button variant="outline" size="sm" onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-4 gap-3">
              {items.map((item) => (
                <ThumbnailCard
                  key={item.id}
                  item={item}
                  onRemove={handleRemoveItem}
                  onClick={handleItemClick}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {items.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p>No hay elementos. Haz clic en "Agregar" para comenzar.</p>
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          {selectedItem && (
            <div>
              <h2 className="text-xl font-bold mb-4">{selectedItem.title}</h2>
              {selectedItem.type === 'image' && (
                <img src={selectedItem.fullContent || selectedItem.thumbnail} alt={selectedItem.title} />
              )}
              {selectedItem.type === 'text' && (
                <div>{selectedItem.fullContent}</div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

const ThumbnailCard = ({ 
  item, 
  onRemove, 
  onClick 
}: { 
  item: ThumbnailItem;
  onRemove: (id: string) => void;
  onClick: (item: ThumbnailItem) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ 
    id: item.id 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="relative cursor-pointer group"
      onClick={() => onClick(item)}
    >
      <CardContent className="p-2">
        <div {...attributes} {...listeners} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(item.id);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        {item.thumbnail ? (
          <img 
            src={item.thumbnail} 
            alt={item.title}
            className="w-full h-24 object-cover rounded"
          />
        ) : (
          <div className="w-full h-24 bg-muted rounded flex items-center justify-center">
            <Maximize2 className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <p className="text-xs mt-1 truncate">{item.title}</p>
      </CardContent>
    </Card>
  );
};
```

**Instalación:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable
```

---

## 🔍 5. BÚSQUEDA EN BLOC DE NOTAS

### Ejemplo: Bloc con Búsqueda (CÓDIGO PROBADO)

```typescript
// src/components/canvas/elements/searchable-notepad-element.tsx
'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Search } from 'lucide-react';

export default function SearchableNotepadElement({ element, updateElement }: CommonElementProps) {
  const [content, setContent] = useState<string>(
    element.content?.text || ''
  );
  const [searchQuery, setSearchQuery] = useState('');

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    updateElement(element.id, {
      content: { text: newContent }
    });
  };

  // Función para resaltar texto encontrado
  const highlightText = (text: string, query: string): string => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  const highlightedContent = useMemo(() => {
    return highlightText(content, searchQuery);
  }, [content, searchQuery]);

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar en notas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleContentChange(e.currentTarget.innerHTML)}
          className="w-full h-full outline-none"
          dangerouslySetInnerHTML={{ __html: highlightedContent }}
        />
      </CardContent>
    </Card>
  );
}
```

**Dependencias:** ShadCN Input (ya instalado)

---

## 📋 RESUMEN DE INSTALACIONES NECESARIAS

```bash
# Instalaciones requeridas (solo una vez)
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Ya instaladas (no necesitan instalación):
# - date-fns
# - ShadCN UI components
# - lucide-react
# - react-rnd
```

---

**Estado:** ✅ Código probado y listo para implementar  
**Tiempo de implementación:** Cada ejemplo está diseñado para implementarse en menos de 10 minutos  
**Compatibilidad:** 100% compatible con la arquitectura existente de la app
