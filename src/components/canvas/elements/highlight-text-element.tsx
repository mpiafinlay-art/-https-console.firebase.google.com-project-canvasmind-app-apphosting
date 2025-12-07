'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { CommonElementProps } from '@/lib/types';
import { useDictationInput } from '@/hooks/use-dictation-input';
import ContentEditable from 'react-contenteditable';

const HIGHLIGHT_COLORS = [
  { name: 'yellow', value: '#fffb8b', label: 'Amarillo' },
  { name: 'green', value: '#d4edda', label: 'Verde' },
  { name: 'blue', value: '#bce8f1', label: 'Azul' },
  { name: 'cyan', value: '#cae3e1', label: 'Calipso' },
  { name: 'orange', value: '#ffeeba', label: 'Naranjo' },
  { name: 'purple', value: '#e9d5ff', label: 'Morado' },
];

export default function HighlightTextElement({ id, content, properties, onUpdate, onSelectElement, isSelected, isListening, liveTranscript, finalTranscript, interimTranscript }: CommonElementProps) {
  const [text, setText] = useState((content as any)?.text || '');
  const [highlightColor, setHighlightColor] = useState(properties?.backgroundColor || HIGHLIGHT_COLORS[0].value);
  const contentRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useDictationInput({
    elementRef: elementRef as React.RefObject<HTMLElement>,
    isListening: isListening || false,
    liveTranscript: liveTranscript || '',
    finalTranscript: finalTranscript || '',
    interimTranscript: interimTranscript || '',
    isSelected: isSelected || false,
    enabled: true,
  });

  useEffect(() => {
    const contentData = content as any;
    if (contentData?.text !== text) {
      setText(contentData?.text || '');
    }
    if (properties?.backgroundColor !== highlightColor) {
      setHighlightColor(properties?.backgroundColor || HIGHLIGHT_COLORS[0].value);
    }
  }, [content, properties?.backgroundColor]);

  const handleTextChange = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.textContent || '';
    setText(newText);
    onUpdate(id, {
      content: { ...(content as any), text: newText },
    });
  }, [id, content, onUpdate]);

  const handleColorChange = useCallback((color: string) => {
    setHighlightColor(color);
    onUpdate(id, {
      properties: { ...properties, backgroundColor: color },
    });
  }, [id, properties, onUpdate]);

  return (
    <div
      className="rounded-lg p-4 shadow-lg"
      style={{ 
        width: '100%', 
        height: '100%', 
        backgroundColor: highlightColor,
        border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb'
      }}
      onClick={() => onSelectElement(id, false)}
    >
        {isSelected && (
          <div className="mb-2 flex gap-1 flex-wrap">
            {HIGHLIGHT_COLORS.map(color => (
              <button
                key={color.name}
                className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color.value }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleColorChange(color.value);
                }}
                title={color.label}
              />
            ))}
          </div>
        )}
        <ContentEditable
          innerRef={elementRef}
          html={text}
          onChange={handleTextChange}
          className="outline-none min-h-[100px] w-full"
          style={{ backgroundColor: 'transparent' }}
        />
      </div>
  );
}

