
'use client';

import React, { useCallback, useState } from 'react';
import type { CanvasElement, WithId, ElementType, CanvasElementProperties, ContainerContent, CommonElementProps, Point, ElementContent, BaseVisualProperties, StickyCanvasElement, NotepadCanvasElement, NotepadSimpleCanvasElement } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { Rnd, type DraggableData, type ResizableDelta, type Position, type RndDragEvent } from 'react-rnd';
import { Button } from '@/components/ui/button';
import DeleteElementDialog from './elements/delete-element-dialog';

// IMPORTACIONES DIRECTAS: Cambiar de lazy a imports directos para evitar problemas con chunks de webpack
// Esto previene errores como "Cannot find module './948.js'" durante desarrollo
import NotepadElement from './elements/notepad-element';
import StickyNoteElement from './elements/sticky-note-element';
import TodoListElement from './elements/todo-list-element';
import ImageElement from './elements/image-element';
import TextElement from './elements/text-element';
import ContainerElement from './elements/container-element';
import CommentElement from './elements/comment-element';
import NotepadSimpleElement from './elements/notepad-simple-element';
// import SuperNotebookElement from './elements/Old_super-notebook-element'; // DESACTIVADO TEMPORALMENTE
import MoodboardElement from './elements/moodboard-element';
import TabbedNotepadElement from './elements/tabbed-notepad-element';
import AccordionElement from './elements/accordion-element';
import YellowNotepadElement from './elements/yellow-notepad-element';
import TestNotepadElement from './elements/test-notepad-element';
import StopwatchElement from './elements/stopwatch-element';
import CountdownElement from './elements/countdown-element';
import HighlightTextElement from './elements/highlight-text-element';

const ElementComponentMap: { [key: string]: React.FC<CommonElementProps> } = {
  notepad: NotepadElement,
  'notepad-simple': NotepadSimpleElement,
  // 'super-notebook': SuperNotebookElement, // DESACTIVADO TEMPORALMENTE
  'test-notepad': TestNotepadElement,
  sticky: StickyNoteElement,
  todo: TodoListElement,
  image: ImageElement,
  text: TextElement,
  container: ContainerElement,
  comment: CommentElement,
  moodboard: MoodboardElement,
  'tabbed-notepad': TabbedNotepadElement,
  accordion: AccordionElement,
  'yellow-notepad': YellowNotepadElement,
  stopwatch: StopwatchElement,
  countdown: CountdownElement,
  'highlight-text': HighlightTextElement,
};

type TransformableElementProps = {
  element: WithId<CanvasElement>;
  allElements: WithId<CanvasElement>[];
  scale: number;
  offset?: Point;
  isSelected: boolean;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  unanchorElement: (id: string) => void;
  deleteElement: (id: string) => void;
  onFormatToggle: () => void;
  onChangeNotepadFormat: (id: string) => void;
  onLocateElement: (elementId: string) => void;
  onSelectElement: (id: string | null, isMultiSelect: boolean) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onMoveBackward: (id: string) => void;
  onEditElement: (id: string) => void;
  onGroupElements: (frameId: string) => void;
  addElement: (type: ElementType, props?: { color?: string; content?: ElementContent; properties?: CanvasElementProperties; parentId?: string; tags?: string[] }) => Promise<string>;
  activatedElementId: string | null;
  onActivateDrag: (id: string) => void;
  onEditComment: (element: WithId<CanvasElement>) => void;
  onDuplicateElement: (elementId: string) => void;
  onUngroup: (groupId: string) => void;
  setIsDirty: (isDirty: boolean) => void;
  boardId: string;
  isListening: boolean;
  liveTranscript: string;
  finalTranscript?: string;
  interimTranscript?: string;
};

const migrateElement = (element: WithId<CanvasElement>): WithId<CanvasElement> => {
    if (typeof element.properties === 'object' && element.properties !== null && 'position' in element.properties && 'size' in element.properties && 'zIndex' in element.properties) {
      return element;
    }
    
    const existingProps = (typeof element.properties === 'object' && element.properties !== null) ? element.properties : {};
    const legacyX = 'x' in element ? (element as BaseVisualProperties).x : undefined;
    const legacyY = 'y' in element ? (element as BaseVisualProperties).y : undefined;
    const legacyWidth = 'width' in element ? (element as BaseVisualProperties).width : undefined;
    const legacyHeight = 'height' in element ? (element as BaseVisualProperties).height : undefined;
    const legacyZIndex = 'zIndex' in element ? (element as BaseVisualProperties).zIndex : undefined;

    return {
      ...element,
      properties: {
        position: existingProps.position || { x: legacyX || 100, y: legacyY || 100 },
        size: existingProps.size || { width: legacyWidth || 200, height: legacyHeight || 150 },
        zIndex: existingProps.zIndex ?? legacyZIndex ?? 1,
        rotation: existingProps.rotation || 0,
        ...existingProps,
      },
    };
};


export default function TransformableElement({
  element: initialElement,
  allElements,
  scale,
  offset = { x: 0, y: 0 },
  isSelected,
  updateElement,
  unanchorElement,
  deleteElement,
  onFormatToggle,
  onChangeNotepadFormat,
  onLocateElement,
  onSelectElement,
  onBringToFront,
  onSendToBack,
  onMoveBackward,
  onEditElement,
  onGroupElements,
  addElement,
  activatedElementId,
  onActivateDrag,
  onEditComment,
  onDuplicateElement,
  onUngroup,
  setIsDirty,
  boardId,
  isListening,
  liveTranscript,
  finalTranscript = '',
  interimTranscript = '',
}: TransformableElementProps) {
  
  const element = migrateElement(initialElement);
  
  // ✅ CRÍTICO: TODOS LOS HOOKS DEBEN IR ANTES DE CUALQUIER EARLY RETURN
  // REGLA #2: Estado para diálogo de confirmación de eliminación
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Extraer posición y tamaño de properties para uso consistente
  const elementProps = typeof element.properties === 'object' && element.properties !== null ? element.properties : {};
  const position = (element.parentId && elementProps.relativePosition) ? elementProps.relativePosition : (elementProps.position || { x: element.x || 0, y: element.y || 0 });
  const size = elementProps.size || { width: element.width || 200, height: element.height || 150 };
  const rotation = elementProps.rotation ?? element.rotation ?? 0;
  const zIndex = elementProps.zIndex ?? element.zIndex ?? 1;
  
  // Asegurar que size tenga valores numéricos válidos
  const safeSize = {
    width: typeof size.width === 'number' && size.width > 0 ? size.width : 200,
    height: typeof size.height === 'number' && size.height > 0 ? size.height : 150
  };
  
  const handleMouseDown = (e: MouseEvent) => {
    onSelectElement(element.id, e.altKey || e.shiftKey || e.metaKey || e.ctrlKey);
  };
  
  const onDragStop = useCallback((e: RndDragEvent, d: DraggableData) => {
    const newPosition = { x: d.x, y: d.y };
    const safeProperties = (typeof element.properties === 'object' && element.properties !== null ? element.properties : {}) as CanvasElementProperties;

    // MEJORADA: Detectar contenedor usando el punto donde se soltó el elemento
    // Usar las coordenadas del evento de mouse/touch para detectar detectar el drop target
    if (element.type !== 'container') {
      // Obtener las coordenadas del evento de drop
      const clientX = (e as any).clientX || (e as any).touches?.[0]?.clientX || 0;
      const clientY = (e as any).clientY || (e as any).touches?.[0]?.clientY || 0;
      
      // Si no hay coordenadas del evento, usar el centro del elemento arrastrado
      let testX = clientX;
      let testY = clientY;
      
      if (!testX || !testY) {
        const draggedElement = document.querySelector(`[data-element-id="${element.id}"]`) as HTMLElement;
        if (draggedElement) {
          const rect = draggedElement.getBoundingClientRect();
          testX = rect.left + rect.width / 2;
          testY = rect.top + rect.height / 2;
        }
      }
      
      // Probar múltiples puntos para asegurar detección
      const testPoints = [
        { x: testX, y: testY },
        { x: testX - 10, y: testY },
        { x: testX + 10, y: testY },
        { x: testX, y: testY - 10 },
        { x: testX, y: testY + 10 },
      ];
      
      for (const point of testPoints) {
        const dropTarget = document.elementFromPoint(point.x, point.y);
        if (dropTarget) {
          // Buscar el elemento contenedor más cercano
          const containerElement = dropTarget.closest('[data-element-type="container"]') as HTMLElement;
          if (containerElement) {
            const containerId = containerElement.getAttribute('data-element-id');
            if (containerId && containerId !== element.id) {
              const targetContainer = allElements.find(el => el.id === containerId && el.type === 'container');
              if (targetContainer) {
                const containerContent = targetContainer.content as ContainerContent | undefined;
                
                // MEJORADO: Verificar si el elemento se soltó dentro del área del contenedor
                // No solo cerca del centro, sino en cualquier parte del contenedor
                const containerRect = containerElement.getBoundingClientRect();
                const dropX = point.x;
                const dropY = point.y;
                
                // Verificar si el punto de drop está dentro de los límites del contenedor
                const isInsideContainer = 
                  dropX >= containerRect.left &&
                  dropX <= containerRect.right &&
                  dropY >= containerRect.top &&
                  dropY <= containerRect.bottom;
                
                if (isInsideContainer) {
                  // Solo agregar si no está ya en el contenedor
                  if (containerContent && !containerContent.elementIds?.includes(element.id)) {
                    const newElementIds = [...(containerContent.elementIds || []), element.id];
                    updateElement(targetContainer.id, { content: { ...containerContent, elementIds: newElementIds } });
                    
                    // Ocultar el elemento original (se mostrará como tarjeta en el contenedor)
                    updateElement(element.id, { 
                      parentId: targetContainer.id, 
                      hidden: true,
                      properties: { 
                        ...safeProperties, 
                        position: newPosition
                      } 
                    });
                    
                    console.log('✅ Elemento guardado en contenedor:', { elementId: element.id, containerId, dropX, dropY, containerRect });
                    return;
                  }
                }
              }
            }
          }
        }
      }
    }
    
    // Si no se soltó sobre un contenedor, actualizar posición normalmente
    // Si tenía parentId, desanclar
    if (element.parentId) {
      // Desanclar del elemento padre
      const parentContainer = allElements.find(el => el.id === element.parentId);
      if (parentContainer && parentContainer.type === 'container') {
        const parentContent = parentContainer.content as ContainerContent | undefined;
        if (parentContent && parentContent.elementIds?.includes(element.id)) {
          const newElementIds = parentContent.elementIds.filter(id => id !== element.id);
          updateElement(parentContainer.id, { content: { ...parentContent, elementIds: newElementIds } });
        }
      }
      
      updateElement(element.id, { 
        parentId: undefined,
        hidden: false,
        properties: { ...safeProperties, position: newPosition } 
      });
    } else {
      updateElement(element.id, { properties: { ...safeProperties, position: newPosition } });
    }

  }, [element, allElements, updateElement, safeSize]);

  const onResizeStop = useCallback((e: MouseEvent | TouchEvent, direction: string, ref: HTMLElement, delta: ResizableDelta, newPosition: Position) => {
    const safeProperties = typeof element.properties === 'object' && element.properties !== null ? element.properties : {};
    
    const newSize = { width: parseFloat(ref.style.width), height: parseFloat(ref.style.height) };
    const finalPosition = element.parentId ? newPosition : { x: newPosition.x, y: newPosition.y };
    const updates: Partial<CanvasElement> = { 
      properties: { 
        ...safeProperties, 
        size: newSize, 
        ...(element.parentId ? { relativePosition: finalPosition } : { position: finalPosition })
      } 
    };

    updateElement(element.id, updates);
  }, [element, updateElement]);
  
  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDeleteDialogOpen(true);
  }, []);
  
  const handleDeleteConfirm = useCallback(() => {
    if (deleteElement) {
      deleteElement(element.id);
    }
    setIsDeleteDialogOpen(false);
  }, [deleteElement, element.id]);

  // ✅ EARLY RETURNS DESPUÉS DE TODOS LOS HOOKS
  const ElementComponent = ElementComponentMap[element.type as keyof typeof ElementComponentMap];
  
  if (!ElementComponent) {
    console.warn(`ElementComponent no encontrado para tipo: ${element.type}`);
    return null;
  }
  
  if (!safeSize || typeof safeSize.width !== 'number' || typeof safeSize.height !== 'number') {
    console.warn(`Tamaño inválido para elemento ${element.id}:`, safeSize);
    return null;
  }

  const isGroupedFrame = false;

  const rndProps = {
      style: {
        zIndex: zIndex,
        border: isSelected ? '2px solid hsl(var(--primary))' : 'none',
        boxSizing: 'border-box' as 'border-box',
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
      },
      size: { width: safeSize.width, height: safeSize.height },
      position: position,
      onDragStop: onDragStop,
      onResizeStop: onResizeStop,
      minWidth: 50,
      minHeight: 50,
      dragHandleClassName: 'drag-handle',
      className: cn("focus:outline-none"),
      onMouseDown: handleMouseDown,
      enableResizing: !isGroupedFrame,
      scale: scale,
      bounds: element.parentId && element.type !== 'container' ? `[data-element-id="${element.parentId}"]` : undefined
  };
  
  return (
    <>
      <Rnd {...rndProps}>
        <div
          data-element-id={element.id}
          data-element-type={element.type}
          className="w-full h-full relative group"
        >
          {/* REGLA #2: Icono de basurero flotante */}
          {isSelected && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-3 -right-3 z-50 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleDeleteClick}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          
          <ElementComponent
              id={element.id}
              type={element.type}
              x={position.x}
              y={position.y}
                  width={size.width as number}
                  height={size.height as number}
                  rotation={rotation}
                  zIndex={zIndex}
                  content={element.content}
                  properties={element.properties}
                  color={element.color}
                  backgroundColor={element.backgroundColor}
                  hidden={element.hidden}
                  minimized={element.type === 'notepad' ? (element as NotepadCanvasElement).minimized : undefined}
                  tags={element.type === 'sticky' ? (element as StickyCanvasElement).tags : undefined}
                  parentId={element.parentId}
                  isSelected={isSelected}
                  onUpdate={updateElement}
                  deleteElement={deleteElement}
                  onSelectElement={onSelectElement}
                  onEditElement={onEditElement}
                  onFormatToggle={onFormatToggle}
                  onChangeNotepadFormat={onChangeNotepadFormat}
                  onLocateElement={onLocateElement}
                  allElements={allElements}
                  onBringToFront={onBringToFront}
                  onSendToBack={onSendToBack}
                  onMoveBackward={onMoveBackward}
                  onGroupElements={onGroupElements}
                  addElement={addElement}
                  activatedElementId={activatedElementId}
                  onActivateDrag={onActivateDrag}
                  onEditComment={onEditComment}
                  onDuplicateElement={onDuplicateElement}
                  onUngroup={() => onUngroup(element.id)}
                  setIsDirty={() => {}}
                  scale={scale}
                  offset={offset}
                  boardId={boardId}
                  isListening={isListening}
                  liveTranscript={liveTranscript}
                  finalTranscript={finalTranscript}
                  interimTranscript={interimTranscript}
                  {...(element.type === 'container' && { unanchorElement })}
              />
        </div>
      </Rnd>
      
      {/* REGLA #2: Diálogo de confirmación de eliminación */}
      <DeleteElementDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
