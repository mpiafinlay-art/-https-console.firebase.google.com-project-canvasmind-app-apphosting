'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFirestore, useUser } from '@/firebase/provider';
import { collection, query, getDocs, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { WithId, Board, CanvasElement } from '@/lib/types';
import { serverTimestamp } from 'firebase/firestore';

interface UseBoardStateReturn {
  boards: WithId<Board>[];
  handleRenameBoard: (newName: string) => Promise<void>;
  handleDeleteBoard: () => Promise<void>;
  clearCanvas: (elements: WithId<CanvasElement>[]) => Promise<void>;
}

export function useBoardState(boardId: string): UseBoardStateReturn {
  const firestore = useFirestore();
  const { user } = useUser();
  const [boards, setBoards] = useState<WithId<Board>[]>([]);

  // Cargar boards del usuario
  useEffect(() => {
    if (!firestore || !user) return;

    const loadBoards = async () => {
      try {
        const userId = user.uid;
        const boardsCollection = collection(firestore, 'users', userId, 'canvasBoards');
        const boardsQuery = query(boardsCollection);
        const boardsSnapshot = await getDocs(boardsQuery);
        
        const boardsData = boardsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as WithId<Board>));
        
        setBoards(boardsData);
      } catch (error) {
        console.error('Error al cargar boards:', error);
      }
    };

    loadBoards();
  }, [firestore, user]);

  const handleRenameBoard = useCallback(async (newName: string) => {
    if (!firestore || !user || !boardId) return;

    try {
      const userId = user.uid;
      const boardRef = doc(firestore, 'users', userId, 'canvasBoards', boardId);
      await updateDoc(boardRef, {
        name: newName,
        updatedAt: serverTimestamp(),
      });
      
      // Actualizar estado local
      setBoards(prev => prev.map(board => 
        board.id === boardId ? { ...board, name: newName } : board
      ));
    } catch (error) {
      console.error('Error al renombrar board:', error);
      throw error;
    }
  }, [firestore, user, boardId]);

  const handleDeleteBoard = useCallback(async () => {
    if (!firestore || !user || !boardId) return;

    try {
      const userId = user.uid;
      const boardRef = doc(firestore, 'users', userId, 'canvasBoards', boardId);
      
      // Eliminar todos los elementos del board primero
      const elementsCollection = collection(firestore, 'users', userId, 'canvasBoards', boardId, 'canvasElements');
      const elementsSnapshot = await getDocs(elementsCollection);
      const batch = writeBatch(firestore);
      
      elementsSnapshot.docs.forEach(elementDoc => {
        batch.delete(elementDoc.ref);
      });
      
      await batch.commit();
      
      // Eliminar el board
      await deleteDoc(boardRef);
      
      // Actualizar estado local
      setBoards(prev => prev.filter(board => board.id !== boardId));
    } catch (error) {
      console.error('Error al eliminar board:', error);
      throw error;
    }
  }, [firestore, user, boardId]);

  const clearCanvas = useCallback(async (elements: WithId<CanvasElement>[]) => {
    if (!firestore || !user || !boardId || elements.length === 0) return;

    try {
      const userId = user.uid;
      const batch = writeBatch(firestore);
      
      elements.forEach(element => {
        const elementRef = doc(firestore, 'users', userId, 'canvasBoards', boardId, 'canvasElements', element.id);
        batch.delete(elementRef);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error al limpiar canvas:', error);
      throw error;
    }
  }, [firestore, user, boardId]);

  return {
    boards,
    handleRenameBoard,
    handleDeleteBoard,
    clearCanvas,
  };
}

