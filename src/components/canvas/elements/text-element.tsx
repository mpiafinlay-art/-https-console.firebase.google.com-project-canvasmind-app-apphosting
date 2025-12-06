
'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { CommonElementProps } from '@/lib/types'; // <-- IMPORTADO
import { cn } from '@/lib/utils';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { useAutoSave } from '@/hooks/use-auto-save';
import { SaveStatusIndicator } from '@/components/canvas/save-status-indicator';
import { useDictationInput } from '@/hooks/use-dictation-input';

// Acepta CommonElementProps
export default function TextElement(props: CommonElementProps) {
  const {
    id,
    content,
    properties,
    onUpdate,
    onEditElement,
    isSelected,
    isListening,
    liveTranscript,
    finalTranscript,
    interimTranscript,
  } = props;

  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const safeProperties = typeof properties === 'object' && properties !== null ? properties : {};
  const { fontSize, fontWeight, textAlign, fontStyle } = safeProperties;
  
  // Type guard para content: text elements usan string
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

  useEffect(() => {
    // CRÍTICO: Solo actualizar si NO está enfocado (preservar cursor)
    if (editorRef.current && textContent !== editorRef.current.innerHTML) {
      const isFocused = document.activeElement === editorRef.current;
      if (!isFocused) {
        editorRef.current.innerHTML = textContent || '';
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

  const handleContentChange = (e: ContentEditableEvent) => {
    // Programar auto-save con debounce
    handleChange();
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    onEditElement(id);
  };

  const handleBlur = async () => {
    setIsEditing(false);
    // Guardado inmediato y obligatorio en onBlur
    await handleAutoSaveBlur();
  };

  return (
    <div className="relative w-full h-full">
      <ContentEditable
        innerRef={editorRef as React.RefObject<HTMLElement>}
        html={textContent || ''}
        disabled={!isEditing}
        onChange={handleContentChange}
        onBlur={handleBlur}
        onDoubleClick={handleDoubleClick}
        className={cn(
          'w-full h-full outline-none break-words',
          (isEditing || isSelected) ? 'cursor-text' : 'cursor-grab drag-handle active:cursor-grabbing'
        )}
        style={{
          fontSize: `${fontSize || 24}px`,
          fontWeight: fontWeight || 'normal',
          textAlign: textAlign || 'left',
          fontStyle: fontStyle || 'normal',
          color: safeProperties.color || '#000000',
          backgroundColor: safeProperties.backgroundColor || '#ffffff',
        }}
      />
      {/* Indicador de estado de guardado */}
      {isEditing && (
        <div className="absolute top-2 right-2 z-10">
          <SaveStatusIndicator status={saveStatus} size="sm" />
        </div>
      )}
    </div>
  );
}
