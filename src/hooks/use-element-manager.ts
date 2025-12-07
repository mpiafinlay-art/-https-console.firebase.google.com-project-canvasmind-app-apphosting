'use client';

import { useCallback, useRef, useEffect } from 'react';
import { useBoardStore } from '@/lib/store/boardStore';
import { useFirestore, useUser } from '@/firebase/provider';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ElementType, CanvasElement, ElementContent, CanvasElementProperties } from '@/lib/types';

interface UseElementManagerReturn {
  addElement: (
    type: ElementType,
    options?: {
      content?: ElementContent;
      properties?: Partial<CanvasElementProperties>;
      position?: { x: number; y: number };
    }
  ) => Promise<void>;
}

export function useElementManager(
  boardId: string,
  getViewportCenter: () => { x: number; y: number },
  getNextZIndex: () => number
): UseElementManagerReturn {
  const firestore = useFirestore();
  const { user } = useUser();
  const { board, updateElement } = useBoardStore();
  
  const getViewportCenterRef = useRef(getViewportCenter);
  const getNextZIndexRef = useRef(getNextZIndex);

  useEffect(() => {
    getViewportCenterRef.current = getViewportCenter;
    getNextZIndexRef.current = getNextZIndex;
  }, [getViewportCenter, getNextZIndex]);

  const addElement = useCallback(async (
    type: ElementType,
    options?: {
      content?: ElementContent;
      properties?: Partial<CanvasElementProperties>;
      position?: { x: number; y: number };
    }
  ) => {
    if (!firestore || !user || !board) {
      console.error('No se puede agregar elemento: falta firestore, user o board');
      return;
    }

    try {
      const userId = board.userId || (board as { ownerId?: string }).ownerId;
      if (!userId) {
        console.error('No se pudo obtener userId para agregar elemento');
        return;
      }

      const center = options?.position || getViewportCenterRef.current();
      const zIndex = getNextZIndexRef.current();

      const newElement: Omit<CanvasElement, 'id'> = {
        type: type as ElementType,
        content: options?.content || {},
        properties: {
          position: { x: center.x, y: center.y },
          size: { width: 300, height: 200 },
          ...options?.properties,
        },
        zIndex,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const elementsCollection = collection(
        firestore,
        'users',
        userId,
        'canvasBoards',
        boardId,
        'canvasElements'
      );

      await addDoc(elementsCollection, newElement);
      console.log(`✅ Elemento ${type} agregado exitosamente`);
    } catch (error) {
      console.error('Error al agregar elemento:', error);
      throw error;
    }
  }, [firestore, user, board, boardId]);

  return {
    addElement,
  };
}

