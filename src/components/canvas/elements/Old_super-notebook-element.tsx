'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import type { CommonElementProps, NotepadContent } from '@/lib/types';
import {
  X, Minus, Maximize, GripVertical,
  FileImage, Settings,
  ChevronLeft, ChevronRight, Plus, Save,
  Info, Eraser, CalendarDays, Wrench, FileSignature, Trash2, Download
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
import { useAutoSave } from '@/hooks/use-auto-save';
import { SaveStatusIndicator } from '@/components/canvas/save-status-indicator';
import { useDictationInput } from '@/hooks/use-dictation-input';
import html2canvas from 'html2canvas';
import './Old_super-notebook-element.css';

export default function SuperNotebookElement(props: CommonElementProps) {
  const {
    id,
    content,
    properties,
    onUpdate,
    deleteElement,
    isPreview = false,
    onFormatToggle,
    isListening,
    liveTranscript,
    finalTranscript,
    interimTranscript,
    isSelected,
    minimized,
    onEditElement,
  } = props;

  const typedContent = (content || {}) as NotepadContent;
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  // CRÍTICO: startPos ya no se usa como state - se usa startPosRef en su lugar
  // Eliminado para evitar confusión y re-renders innecesarios

  const currentPageIndex = typedContent.currentPage ?? 0;

  // Hook de autoguardado para el contenido
  const { saveStatus: contentSaveStatus, handleChange: handleContentChange, handleBlur: handleContentBlur, forceSave: forceSaveContent } = useAutoSave({
    getContent: () => {
      if (isPreview || !contentRef.current) return '';
      const html = contentRef.current.innerHTML;
      // Normalizar HTML para comparación consistente
      return html.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
    },
    onSave: async (newHtml) => {
      if (isPreview || !contentRef.current) return;
      const currentPages = typedContent.pages || [''];
      const currentPageContent = (currentPages[currentPageIndex] || '').replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
      // Comparar contenido normalizado
      if (newHtml !== currentPageContent) {
        const newPages = [...currentPages];
        newPages[currentPageIndex] = newHtml;
        await onUpdate(id, { content: { ...typedContent, pages: newPages } });
      }
    },
    debounceMs: 2000,
    disabled: isPreview,
    compareContent: (oldContent, newContent) => {
      const currentPages = typedContent.pages || [''];
      const currentPageContent = (currentPages[currentPageIndex] || '').replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
      // Normalizar ambos para comparación
      const normalizedOld = (oldContent || '').replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
      const normalizedNew = (newContent || '').replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
      return normalizedOld === normalizedNew && normalizedOld === currentPageContent;
    },
  });

  // Hook de autoguardado para el título
  const { saveStatus: titleSaveStatus, handleChange: handleTitleInputChange, handleBlur: handleTitleInputBlur } = useAutoSave({
    getContent: () => titleRef.current?.innerText || '',
    onSave: async (newTitle) => {
      if (isPreview || !titleRef.current) return;
      if (typedContent.title !== newTitle) {
        onUpdate(id, { content: { ...typedContent, title: newTitle } });
      }
    },
    debounceMs: 1000,
    disabled: isPreview,
    compareContent: (oldTitle, newTitle) => newTitle === typedContent.title,
  });

  // CRÍTICO: Usar refs para startPos para evitar re-suscripciones constantes
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const positionRef = useRef(position);

  // Actualizar refs cuando cambian
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // Lógica de arrastre del encabezado
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.notebook-header button')) return;
    setIsDragging(true);
    const currentPos = positionRef.current;
    startPosRef.current = { x: e.clientX - currentPos.x, y: e.clientY - currentPos.y };
  }, []); // ✅ Sin dependencias - usa refs

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const currentStartPos = startPosRef.current;
      setPosition({
        x: e.clientX - currentStartPos.x,
        y: e.clientY - currentStartPos.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]); // ✅ Solo depende de isDragging - startPos usa ref

  // Sincronizar contenido
  useEffect(() => {
    if (contentRef.current) {
      const isFocused = document.activeElement === contentRef.current;
      if (isFocused) return; // NO actualizar si está enfocado
      
      const pageContent = typedContent.pages?.[currentPageIndex] ?? '<div><br></div>';
      if (contentRef.current.innerHTML !== pageContent) {
        const selection = window.getSelection();
        let savedRange: Range | null = null;
        if (selection && selection.rangeCount > 0) {
          try {
            savedRange = selection.getRangeAt(0).cloneRange();
          } catch (e) {}
        }
        
        contentRef.current.innerHTML = pageContent;
        
        if (savedRange && contentRef.current.firstChild) {
          try {
            const textNode = contentRef.current.firstChild;
            if (textNode.nodeType === Node.TEXT_NODE) {
              const maxPos = textNode.textContent?.length || 0;
              const newPos = Math.min(savedRange.startOffset, maxPos);
              const newRange = document.createRange();
              newRange.setStart(textNode, newPos);
              newRange.collapse(true);
              selection?.removeAllRanges();
              selection?.addRange(newRange);
            }
          } catch (e) {}
        }
      }
    }
  }, [typedContent.pages, currentPageIndex]);

  useEffect(() => {
    const titleEl = titleRef.current;
    if (titleEl && titleEl.innerText !== (typedContent.title || '')) {
      titleEl.innerText = typedContent.title || '';
    }
  }, [typedContent.title]);

  // Soporte para dictado usando hook helper
  useDictationInput({
    elementRef: contentRef as React.RefObject<HTMLElement | HTMLInputElement | HTMLTextAreaElement>,
    isListening: isListening || false,
    liveTranscript: liveTranscript || '',
    finalTranscript: finalTranscript || '',
    interimTranscript: interimTranscript || '',
    isSelected: isSelected || false,
    enabled: true,
  });

  const handlePageChange = useCallback(async (newPage: number) => {
    if (isPreview) return;
    if (newPage >= 0 && newPage < (typedContent.pages?.length || 0)) {
      await forceSaveContent();
      onUpdate(id, { content: { ...typedContent, currentPage: newPage } });
    }
  }, [isPreview, typedContent, onUpdate, id, forceSaveContent]);

  const handleAddPage = useCallback(async () => {
    if (isPreview) return;
    if ((typedContent.pages?.length || 0) < 20) {
      await forceSaveContent();
      const newPages = [...(typedContent.pages || []), '<div><br></div>'];
      onUpdate(id, { content: { ...typedContent, pages: newPages, currentPage: newPages.length - 1 } });
    }
  }, [isPreview, typedContent, onUpdate, id, forceSaveContent]);

  const handleCloseNotepad = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isPreview) return;
    await forceSaveContent();
    onUpdate(id, { hidden: true });
  }, [isPreview, forceSaveContent, onUpdate, id]);

  const handleExportToPng = useCallback(async () => {
    setIsExportingPng(true);
    toast({ title: 'Exportando...', description: 'Generando imagen PNG del super cuaderno.' });

    try {
      if (!contentRef.current) {
        throw new Error('No se encontró el contenido para exportar.');
      }

      const canvasImage = await html2canvas(contentRef.current, {
        backgroundColor: '#ffffff',
        scale: 3,
        useCORS: true,
        logging: false,
      });

      canvasImage.toBlob((blob: Blob | null) => {
        if (!blob) {
          toast({ variant: 'destructive', title: 'Error', description: 'No se pudo generar la imagen.' });
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${typedContent.title || 'super-cuaderno'}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({ title: 'Exportado', description: 'El super cuaderno se ha exportado como PNG de alta resolución.' });
      }, 'image/png', 1.0);
    } catch (error: any) {
      console.error('Error al exportar:', error);
      toast({ variant: 'destructive', title: 'Error al exportar', description: error.message || 'Ocurrió un error al exportar.' });
    } finally {
      setIsExportingPng(false);
    }
  }, [toast, typedContent.title]);

  const handleSelectAll = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.focus();
      const range = document.createRange();
      range.selectNodeContents(contentRef.current);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, []);

  const handleInsertDate = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.focus();
      const dateStr = format(new Date(), 'dd/MM/yyyy');
      document.execCommand('insertText', false, dateStr);
      handleContentChange();
    }
  }, [handleContentChange]);

  const handleRemoveFormat = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.focus();
      document.execCommand('removeFormat', false);
      handleContentChange();
    }
  }, [handleContentChange]);

  if (minimized) {
    return (
      <div className="super-notebook-minimized" data-element-id={id}>
        <div className="p-2 flex flex-row items-center gap-1 w-full cursor-grab active:cursor-grabbing drag-handle">
          <div className="p-1"><GripVertical className="size-5 text-muted-foreground" /></div>
          <p className="font-headline text-sm font-semibold truncate flex-grow">{typedContent.title || 'Super Cuaderno'}</p>
          <div className="flex items-center gap-1">
            <SaveStatusIndicator status={titleSaveStatus} size="sm" />
            <SaveStatusIndicator status={contentSaveStatus} size="sm" />
            <Button variant="ghost" size="icon" className="size-7" title="Maximizar" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onUpdate(id, { minimized: false }); }}>
              <Maximize className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="super-notebook-wrapper"
      data-element-id={id}
    >
      {/* Encabezado flotante */}
      <div className="notebook-header" onMouseDown={handleMouseDown}>
        <div className="drag-handle cursor-grab active:cursor-grabbing">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,6a2,2,0,1,0-2-2A2,2,0,0,0,14,6Zm-2,4a2,2,0,1,0,2,2A2,2,0,0,0,12,10Zm0,6a2,2,0,1,0,2,2A2,2,0,0,0,12,16Zm-6-4a2,2,0,1,0,2,2A2,2,0,0,0,6,12Zm0-6A2,2,0,1,0,8,4,2,2,0,0,0,6,6Zm0,10a2,2,0,1,0,2,2A2,2,0,0,0,6,16Z" />
          </svg>
        </div>
        <div
          ref={titleRef}
          contentEditable={!isPreview}
          spellCheck="true"
          suppressContentEditableWarning
          onInput={handleTitleInputChange}
          onBlur={handleTitleInputBlur}
          className="notebook-title-input"
          data-placeholder="Super Cuaderno"
        />
        <div className="header-actions">
          <Button variant="ghost" size="icon" className="size-7" title="Seleccionar Todo" onClick={handleSelectAll}>
            <FileSignature className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-7" title="Insertar Fecha" onClick={handleInsertDate}>
            <CalendarDays className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-7" title="Limpiar Formato" onClick={handleRemoveFormat}>
            <Eraser className="size-4" />
          </Button>
          {onFormatToggle && (
            <Button variant="ghost" size="icon" className="size-7" title="Herramientas de Formato" onClick={onFormatToggle}>
              <Wrench className="size-4" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <Settings className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExportToPng} disabled={isExportingPng}>
                <Download className="mr-2 h-4 w-4" />
                <span>Exportar a PNG: alta resolución</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="window-controls">
          <Button variant="ghost" size="icon" className="size-7" title="Minimizar" onClick={() => onUpdate(id, { minimized: true })}>
            <Minus className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-7" title="Cerrar" onMouseDown={handleCloseNotepad}>
            <X className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive" title="Eliminar" onClick={() => deleteElement(id)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Página del cuaderno */}
      <div className="notebook-container">
        <div className="page-background">
          <div
            ref={contentRef}
            contentEditable={!isPreview}
            spellCheck="true"
            suppressContentEditableWarning
            onFocus={() => onEditElement(id)}
            onInput={handleContentChange}
            onBlur={handleContentBlur}
            className="page-content"
          />
          <footer className="page-pagination">
            {currentPageIndex + 1} de {typedContent.pages?.length || 1}
          </footer>
        </div>
      </div>

      {/* Indicadores de guardado */}
      {!isPreview && (
        <div className="absolute top-12 right-2 z-20 flex gap-1">
          <SaveStatusIndicator status={titleSaveStatus} size="sm" />
          <SaveStatusIndicator status={contentSaveStatus} size="sm" />
        </div>
      )}

      {/* Controles de paginación */}
      {!isPreview && (
        <div className="pagination-controls">
          <Button variant="ghost" size="icon" onClick={() => handlePageChange(currentPageIndex - 1)} disabled={currentPageIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPageIndex + 1} de {typedContent.pages?.length || 1}
          </span>
          <Button variant="ghost" size="icon" onClick={() => handlePageChange(currentPageIndex + 1)} disabled={currentPageIndex >= (typedContent.pages?.length || 1) - 1}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleAddPage} disabled={(typedContent.pages?.length || 0) >= 20}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

