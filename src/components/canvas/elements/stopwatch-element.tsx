'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommonElementProps } from '@/components/canvas/transformable-element';

export default function StopwatchElement({ id, onUpdate, onSelectElement, isSelected }: CommonElementProps) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 10);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const handleStart = useCallback(() => {
    setIsRunning(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);


  const handleClose = useCallback(() => {
    onUpdate(id, { hidden: true });
  }, [id, onUpdate]);

  return (
      <div
        className="bg-black text-white rounded-lg p-4 flex flex-col items-center justify-center gap-2 shadow-lg relative"
        style={{ width: '100%', height: '100%' }}
        onClick={() => onSelectElement(id, false)}
      >
        {/* Botón X arriba a la derecha */}
        <Button 
          size="icon" 
          variant="ghost" 
          className="absolute top-2 right-2 h-6 w-6 text-white hover:bg-gray-800 hover:text-white p-0"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="text-3xl font-mono font-bold">{formatTime(time)}</div>
        <div className="flex gap-2">
          {!isRunning ? (
            <Button 
              size="icon" 
              variant="outline" 
              className="bg-white text-black hover:bg-gray-200 h-7 w-7" 
              onClick={(e) => {
                e.stopPropagation();
                handleStart();
              }}
            >
              <Play className="h-3 w-3" />
            </Button>
          ) : (
            <Button 
              size="icon" 
              variant="outline" 
              className="bg-white text-black hover:bg-gray-200 h-7 w-7" 
              onClick={(e) => {
                e.stopPropagation();
                handlePause();
              }}
            >
              <Pause className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
  );
}

