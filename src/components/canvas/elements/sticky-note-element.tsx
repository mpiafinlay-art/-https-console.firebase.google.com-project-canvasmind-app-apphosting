
'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { CommonElementProps, CanvasElementProperties } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TwitterPicker } from 'react-color';
import { Paintbrush, GripVertical, Plus, X, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAutoSave } from '@/hooks/use-auto-save';
import { SaveStatusIndicator } from '@/components/canvas/save-status-indicator';
import { useDictationInput } from '@/hooks/use-dictation-input';

const COLORS = [
  '#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3',
  '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF'
];

// Mapeo de nombres de color a códigos hex
const colorMap: { [key: string]: string } = {
  yellow: '#fffb8b',
  pink: '#ffc2d4',
  blue: '#bce8f1',
  green: '#d4edda',
  orange: '#ffeeba',
  purple: '#e9d5ff',
  white: '#ffffff',
};

export default function StickyNoteElement(props: CommonElementProps) {
  const {
    id,
    content,
    properties,
    isSelected,
    onUpdate,
    onEditElement,
    deleteElement,
    isListening,
    liveTranscript,
    finalTranscript,
    interimTranscript,
  } = props;

  const safeProperties: CanvasElementProperties = typeof properties === 'object' && properties !== null ? properties : {};
  const colorValue = (typeof safeProperties.color === 'string' ? safeProperties.color : 'yellow') || 'yellow';
  // Si el color es un nombre (yellow, pink, etc.), usar el mapa; si es un hex, usarlo directamente
  const colorHex = colorMap[colorValue] || (colorValue.startsWith('#') ? colorValue : '#fffb8b');
  
  // REGLA #4: Rotación para notas adhesivas
  const rotation = safeProperties.rotation || 0;

  const editorRef = useRef<HTMLDivElement>(null);
  
  // Type guard para content: sticky notes usan string
  const textContent = typeof content === 'string' ? content : '';

  // Hook de autoguardado robusto
  const { saveStatus, handleBlur: handleAutoSaveBlur, handleChange } = useAutoSave({
    getContent: () => {
      const html = editorRef.current?.innerHTML || '';
      // Normalizar HTML para comparación consistente
      return html.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
    },
    onSave: async (newContent) => {
      // Normalizar también el contenido guardado para comparar
      const normalizedTextContent = (textContent || '').replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
      if (newContent !== normalizedTextContent) {
        await onUpdate(id, { content: newContent });
      }
    },
    debounceMs: 2000,
    compareContent: (oldContent, newContent) => {
      // Normalizar ambos para comparación
      const normalizedOld = (oldContent || '').replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
      const normalizedNew = (newContent || '').replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
      return normalizedOld === normalizedNew;
    },
  });

  // Ref para almacenar el contenido anterior y evitar loops
  const prevContentRef = useRef<string>('');
  
  useEffect(() => {
    // CRÍTICO: Solo actualizar si NO está enfocado (preservar cursor y formato)
    if (editorRef.current) {
      const isFocused = document.activeElement === editorRef.current;
      
      // Solo actualizar si realmente cambió
      if (prevContentRef.current === textContent) {
        return;
      }
      prevContentRef.current = textContent;
      
      if (!isFocused) {
        // Usar helper para preservar cursor y formato
        const { updateInnerHTMLPreservingCursor } = require('@/lib/cursor-helper');
        const hasHTML = /<[^>]+>/.test(textContent);
        if (hasHTML) {
          updateInnerHTMLPreservingCursor(editorRef.current, textContent);
        } else {
          updateInnerHTMLPreservingCursor(editorRef.current, textContent || '');
        }
      }
    }
  }, [textContent]);

  // Soporte para dictado usando hook helper
  useDictationInput({
    elementRef: editorRef as React.RefObject<HTMLElement | HTMLInputElement | HTMLTextAreaElement>,
    isListening: isListening || false,
    liveTranscript: liveTranscript || '',
    finalTranscript: finalTranscript || '',
    interimTranscript: interimTranscript || '',
    isSelected: isSelected || false,
    enabled: true,
  });

  const handleContentChange = () => {
    // Programar auto-save con debounce
    handleChange();
  };

  const handleBlurWithSave = async () => {
    // Guardado inmediato y obligatorio en onBlur
    await handleAutoSaveBlur();
  };

  const handleColorChange = (newColor: { hex: string }) => {
    onUpdate(id, { properties: { ...safeProperties, color: newColor.hex } });
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (deleteElement) {
      deleteElement(id);
    }
  };

  const handleAddContent = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.collapse(false);
        const br = document.createElement('br');
        range.insertNode(br);
        range.setStartAfter(br);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  // REGLA #4: Manejar rotación
  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newRotation = ((rotation || 0) + 15) % 360;
    onUpdate(id, { properties: { ...safeProperties, rotation: newRotation } });
  };

  return (
    <Card
      className={cn(
        'w-full h-full flex flex-col relative group overflow-hidden',
        'min-w-[200px] min-h-[150px] max-w-[400px] max-h-[500px]',
        'rounded-lg shadow-md border-none'
      )}
      style={{ 
        backgroundColor: colorHex,
      }}
      onClick={() => onEditElement(id)}
    >
      {/* Header con iconos en la esquina superior derecha */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <div className="drag-handle cursor-grab active:cursor-grabbing p-1 hover:bg-black/10 rounded">
          <GripVertical className="h-4 w-4 text-gray-700" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-1 hover:bg-black/10 rounded"
          onClick={handleAddContent}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Plus className="h-4 w-4 text-gray-700" />
        </Button>
        {isSelected && (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-1 hover:bg-black/10 rounded"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Paintbrush className="h-4 w-4 text-gray-700" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                onClick={(e) => e.stopPropagation()}
                className="w-auto p-0 border-none"
              >
                <TwitterPicker colors={COLORS} color={colorHex} onChangeComplete={handleColorChange} />
              </PopoverContent>
            </Popover>
            {/* REGLA #4: Botón de rotación */}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-1 hover:bg-black/10 rounded"
              onClick={handleRotate}
              onMouseDown={(e) => e.stopPropagation()}
              title="Rotar 15°"
            >
              <RotateCw className="h-4 w-4 text-gray-700" />
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-1 hover:bg-black/10 rounded"
          onClick={handleClose}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <X className="h-4 w-4 text-gray-700" />
        </Button>
      </div>

      {/* Contenido editable */}
      <div className="relative flex-grow">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleContentChange}
          onBlur={handleBlurWithSave}
          className="text-base font-medium break-words outline-none cursor-text p-4 pt-6"
          style={{ color: '#333', minHeight: 'calc(100% - 1rem)' }}
        />
        {/* Indicador de estado de guardado */}
        <div className="absolute top-2 right-2 z-10">
          <SaveStatusIndicator status={saveStatus} size="sm" />
        </div>
      </div>
    </Card>
  );
}
