'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CommonElementProps, ContainerContent, CanvasElementProperties, WithId, CanvasElement } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { GripVertical, X, Palette, Columns2, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAutoSave } from '@/hooks/use-auto-save';
import { SaveStatusIndicator } from '@/components/canvas/save-status-indicator';
// Importar TwitterPicker directamente - react-color es compatible con SSR si se usa correctamente
import { TwitterPicker } from 'react-color';

// Paleta de colores igual que lista de tareas
const COLOR_PALETTE = [
  { name: 'white', label: 'Blanco', value: '#ffffff' },
  { name: 'yellow', label: 'Amarillo', value: '#fffb8b' },
  { name: 'pink', label: 'Rosa', value: '#ffc2d4' },
  { name: 'blue', label: 'Azul', value: '#bce8f1' },
  { name: 'green', label: 'Verde', value: '#d4edda' },
  { name: 'orange', label: 'Naranja', value: '#ffeeba' },
  { name: 'purple', label: 'Morado', value: '#e9d5ff' },
];

// Type guard para ContainerContent
function isContainerContent(content: unknown): content is ContainerContent {
  return typeof content === 'object' && content !== null && 'elementIds' in content;
}

interface ElementCard {
  elementId: string;
  element: WithId<CanvasElement>;
}

export default function ContainerElement(props: CommonElementProps & { unanchorElement?: (id: string) => void }) {
  const { 
    id, 
    properties, 
    isSelected, 
    onSelectElement, 
    onEditElement,
    content,
    onUpdate,
    deleteElement,
    allElements = [],
    onLocateElement,
    unanchorElement
  } = props;

  const safeProperties = typeof properties === 'object' && properties !== null ? properties : {};
  const containerContent: ContainerContent = isContainerContent(content) 
    ? content 
    : { title: 'Nuevo Contenedor', elementIds: [], layout: 'single' };
  
  const backgroundColor = safeProperties?.backgroundColor || '#ffffff';
  const layout = containerContent.layout || 'single';
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Obtener elementos que están dentro del contenedor
  const containedElements: ElementCard[] = containerContent.elementIds
    .map(elementId => {
      const element = allElements.find(el => el.id === elementId);
      return element ? { elementId, element } : null;
    })
    .filter((card): card is ElementCard => card !== null);

  // Hook de autoguardado para el título
  const { saveStatus: titleSaveStatus, handleBlur: handleTitleBlur, handleChange: handleTitleChange } = useAutoSave({
    getContent: () => titleInputRef.current?.value || containerContent.title || '',
    onSave: async (newTitle) => {
      if (newTitle !== containerContent.title) {
        onUpdate(id, { content: { ...containerContent, title: newTitle } });
      }
    },
    debounceMs: 1000,
  });

  // Manejar cambio de color de fondo
  const handleColorChange = useCallback((color: { hex: string }) => {
    onUpdate(id, { 
      properties: { 
        ...safeProperties, 
        backgroundColor: color.hex 
      } 
    });
    setColorPopoverOpen(false);
  }, [id, safeProperties, onUpdate]);

  // Manejar cambio de layout (dividir en dos columnas)
  const handleLayoutToggle = useCallback(() => {
    const newLayout = layout === 'single' ? 'two-columns' : 'single';
    onUpdate(id, { content: { ...containerContent, layout: newLayout } });
  }, [id, containerContent, layout, onUpdate]);

  // Manejar cerrar contenedor
  const handleClose = useCallback(() => {
    onUpdate(id, { hidden: true });
  }, [id, onUpdate]);

  // Manejar soltar elemento (icono de enlace)
  const handleReleaseElement = useCallback((elementId: string) => {
    // Remover elemento del contenedor
    const newElementIds = containerContent.elementIds.filter(id => id !== elementId);
    onUpdate(id, { content: { ...containerContent, elementIds: newElementIds } });
    
    // Desanclar el elemento y colocarlo cerca del contenedor
    const containerElement = allElements.find(el => el.id === id);
    if (containerElement && unanchorElement) {
      const containerProps = typeof containerElement.properties === 'object' && containerElement.properties !== null 
        ? containerElement.properties 
        : {};
      const containerPosition = containerProps.position || { x: 0, y: 0 };
      const containerSize = containerProps.size || { width: 378, height: 567 };
      
      const releasedElement = allElements.find(el => el.id === elementId);
      if (releasedElement) {
        // Colocar elemento cerca del contenedor (a la derecha)
        const releasePosition = {
          x: containerPosition.x + (typeof containerSize.width === 'number' ? containerSize.width : parseInt(String(containerSize.width))) + 20,
          y: containerPosition.y
        };
        
        onUpdate(elementId, {
          parentId: undefined, // Usar undefined en lugar de null
          hidden: false,
          properties: {
            ...(typeof releasedElement.properties === 'object' && releasedElement.properties !== null ? releasedElement.properties : {}),
            position: releasePosition
          }
        });
      }
    }
  }, [id, containerContent, allElements, onUpdate, unanchorElement]);

  // Obtener nombre del elemento para mostrar en la tarjeta
  const getElementName = (element: WithId<CanvasElement>): string => {
    if (element.type === 'text') {
      return typeof element.content === 'string' ? element.content.substring(0, 30) : 'Texto';
    }
    if (element.type === 'sticky') {
      return typeof element.content === 'string' ? element.content.substring(0, 30) : 'Nota';
    }
    if (element.type === 'notepad' || element.type === 'notepad-simple') {
      const notepadContent = element.content as any;
      return notepadContent?.title || 'Cuaderno';
    }
    if (element.type === 'todo') {
      const todoContent = element.content as any;
      return todoContent?.title || 'Lista de Tareas';
    }
    if (element.type === 'image') {
      return 'Imagen';
    }
    return element.type.charAt(0).toUpperCase() + element.type.slice(1);
  };

  // Obtener vista miniatura mejorada del elemento
  const getElementThumbnail = (element: WithId<CanvasElement>): React.ReactNode => {
    const size = typeof element.properties === 'object' && element.properties !== null && element.properties.size
      ? element.properties.size
      : { width: element.width || 100, height: element.height || 100 };
    
    const elementWidth = typeof size.width === 'number' ? size.width : parseInt(String(size.width));
    const elementHeight = typeof size.height === 'number' ? size.height : parseInt(String(size.height));
    
    // Calcular tamaño de miniatura manteniendo proporción
    const maxThumbnailSize = 100;
    const aspectRatio = elementWidth / elementHeight;
    let thumbWidth = maxThumbnailSize;
    let thumbHeight = maxThumbnailSize;
    
    if (aspectRatio > 1) {
      thumbHeight = maxThumbnailSize / aspectRatio;
    } else {
      thumbWidth = maxThumbnailSize * aspectRatio;
    }
    
    // Vista previa para imágenes
    if (element.type === 'image') {
      const imageContent = element.content as any;
      return (
        <div className="relative w-full h-full rounded overflow-hidden bg-gray-100">
          <img 
            src={imageContent?.url || ''} 
            alt="Preview"
            className="w-full h-full object-cover"
            style={{ width: thumbWidth, height: thumbHeight }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      );
    }
    
    // Vista previa para notas adhesivas
    if (element.type === 'sticky') {
      const stickyColor = (element.properties as any)?.color || element.color || 'yellow';
      const colorMap: { [key: string]: string } = {
        yellow: '#fffb8b',
        pink: '#ffc2d4',
        blue: '#bce8f1',
        green: '#d4edda',
        orange: '#ffeeba',
        purple: '#e9d5ff',
      };
      const colorHex = colorMap[stickyColor] || (stickyColor.startsWith('#') ? stickyColor : '#fffb8b');
      const stickyText = typeof element.content === 'string' ? element.content.substring(0, 50) : 'Nota';
      return (
        <div 
          className="w-full h-full rounded p-2 text-xs overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: colorHex, minHeight: thumbHeight }}
        >
          <p className="line-clamp-3 text-center">{stickyText}</p>
        </div>
      );
    }
    
    // Vista previa para texto
    if (element.type === 'text') {
      const textContent = typeof element.content === 'string' ? element.content.substring(0, 100) : 'Texto';
      return (
        <div className="w-full h-full rounded p-2 bg-white border border-gray-200 flex items-center justify-center text-xs text-gray-600">
          <p className="line-clamp-4 text-center">{textContent}</p>
        </div>
      );
    }
    
    // Vista previa para cuadernos
    if (element.type === 'notepad' || element.type === 'notepad-simple' || element.type === 'super-notebook') {
      const notepadContent = element.content as any;
      const title = notepadContent?.title || 'Cuaderno';
      const preview = notepadContent?.content || notepadContent?.text || '';
      return (
        <div className="w-full h-full rounded p-2 bg-white border border-gray-200 flex flex-col">
          <div className="font-semibold text-xs mb-1 truncate">{title}</div>
          <div className="text-xs text-gray-500 line-clamp-2">{preview.substring(0, 60)}</div>
        </div>
      );
    }
    
    // Vista previa para lista de tareas
    if (element.type === 'todo') {
      const todoContent = element.content as any;
      const items = todoContent?.items || [];
      const completedCount = items.filter((item: any) => item.completed).length;
      return (
        <div className="w-full h-full rounded p-2 bg-white border border-gray-200 flex flex-col">
          <div className="font-semibold text-xs mb-1">{todoContent?.title || 'Lista'}</div>
          <div className="text-xs text-gray-500">
            {completedCount}/{items.length} completadas
          </div>
        </div>
      );
    }
    
    // Vista previa genérica para otros tipos
    return (
      <div 
        className="bg-gradient-to-br from-gray-100 to-gray-200 rounded flex flex-col items-center justify-center text-xs text-gray-500 p-2"
        style={{ minHeight: thumbHeight }}
      >
        <div className="text-lg mb-1">{element.type.charAt(0).toUpperCase()}</div>
        <div className="text-center capitalize">{element.type}</div>
      </div>
    );
  };

  return (
    <Card
      id={id}
      data-element-type="container"
      data-element-id={id}
      ref={containerRef}
      className={cn(
        'w-full h-full flex flex-col overflow-hidden',
        'min-w-[200px] min-h-[300px]',
        'rounded-lg shadow-lg border border-gray-200/50',
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : '',
        'hover:shadow-xl transition-shadow'
      )}
      style={{
        backgroundColor: backgroundColor === 'transparent' ? '#ffffff' : backgroundColor,
        pointerEvents: 'auto',
      }}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest('.drag-handle')) {
          // REGLA ESPECIAL: Lienzo K85hC8M5spfsgRITnEQR - Al hacer click sube a primera capa para editar
          if (id === 'K85hC8M5spfsgRITnEQR') {
            const currentZIndex = safeProperties?.zIndex || -1;
            // Subir a primera capa temporalmente (zIndex alto)
            onUpdate(id, { properties: { ...safeProperties, zIndex: 9999 } });
            onEditElement(id);
            // Después de editar, volver a zIndex original (usar setTimeout para permitir edición)
            setTimeout(() => {
              onUpdate(id, { properties: { ...safeProperties, zIndex: currentZIndex } });
            }, 1000); // Volver después de 1 segundo
          } else {
            onEditElement(id);
          }
        }
      }}
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).closest('.drag-handle')) {
          return;
        }
        e.stopPropagation();
        // REGLA ESPECIAL: Lienzo K85hC8M5spfsgRITnEQR - Al hacer click sube a primera capa
        if (id === 'K85hC8M5spfsgRITnEQR') {
          const currentZIndex = safeProperties?.zIndex || -1;
          onUpdate(id, { properties: { ...safeProperties, zIndex: 9999 } });
          onSelectElement(id, e.shiftKey || e.ctrlKey || e.metaKey);
          // Volver a zIndex original después de un tiempo
          setTimeout(() => {
            if (!isSelected) { // Solo volver si no está seleccionado
              onUpdate(id, { properties: { ...safeProperties, zIndex: currentZIndex } });
            }
          }, 2000);
        } else {
          onSelectElement(id, e.shiftKey || e.ctrlKey || e.metaKey);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget) {
          (e.currentTarget as HTMLElement).style.opacity = '0.9';
        }
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget) {
          (e.currentTarget as HTMLElement).style.opacity = '1';
        }
      }}
    >
      {/* HEADER */}
      <CardHeader className="p-3 border-b border-gray-200 bg-white flex flex-row items-center justify-between group/header">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="drag-handle cursor-grab active:cursor-grabbing flex-shrink-0">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          <input
            ref={titleInputRef}
            type="text"
            value={containerContent.title || ''}
            onChange={(e) => {
              handleTitleChange();
              const newContent: ContainerContent = { ...containerContent, title: e.target.value };
              onUpdate(id, { content: newContent });
            }}
            onBlur={handleTitleBlur}
            className="flex-1 min-w-0 text-sm font-semibold bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-1"
            placeholder="Título del contenedor..."
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
        </div>
        
        {/* Botones de acción */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Indicador de guardado */}
          <SaveStatusIndicator status={titleSaveStatus} size="sm" />
          
          {/* Botón dividir en dos columnas */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            title={layout === 'single' ? 'Dividir en dos columnas' : 'Una sola columna'}
            onClick={(e) => {
              e.stopPropagation();
              handleLayoutToggle();
            }}
          >
            <Columns2 className={cn("h-4 w-4", layout === 'two-columns' && "text-blue-600")} />
          </Button>
          
          {/* Botón paleta de colores */}
          <Popover open={colorPopoverOpen} onOpenChange={setColorPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                title="Cambiar color de fondo"
                onClick={(e) => e.stopPropagation()}
              >
                <Palette className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" onClick={(e) => e.stopPropagation()}>
              <TwitterPicker
                colors={COLOR_PALETTE.map(c => c.value)}
                color={backgroundColor}
                onChange={handleColorChange}
                triangle="hide"
              />
            </PopoverContent>
          </Popover>
          
          {/* Botón cerrar */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-gray-600"
            title="Cerrar contenedor"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {/* CONTENEDOR INTERNO - Recibe elementos */}
      <CardContent 
        className="flex-1 p-3 overflow-y-auto"
        style={{ minHeight: 0 }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('📦 Drop en CardContent del contenedor');
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.dropEffect = 'move';
        }}
      >
        {containedElements.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-gray-400">
            Arrastra elementos aquí para guardarlos
          </div>
        ) : (
          <div className={cn(
            "grid gap-3",
            layout === 'two-columns' ? "grid-cols-2" : "grid-cols-1"
          )}>
            {containedElements.map(({ elementId, element }) => (
              <div
                key={elementId}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex flex-col gap-2 group/card hover:shadow-md transition-shadow"
              >
                {/* Vista miniatura */}
                <div className="flex items-center justify-center bg-gray-50 rounded p-2 min-h-[80px]">
                  {getElementThumbnail(element)}
                </div>
                
                {/* Nombre del elemento */}
                <div className="text-xs font-medium text-gray-700 truncate">
                  {getElementName(element)}
                </div>
                
                {/* Botón de enlace para soltar */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 self-end opacity-0 group-hover/card:opacity-100 transition-opacity"
                  title="Soltar elemento del contenedor"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReleaseElement(elementId);
                  }}
                >
                  <LinkIcon className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
