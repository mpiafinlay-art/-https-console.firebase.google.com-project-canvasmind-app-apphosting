'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Square, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommonElementProps } from '@/components/canvas/transformable-element';

const PRESET_TIMES = [5, 10, 15, 20, 30, 40, 60]; // minutos

export default function CountdownElement({ id, onUpdate, onSelectElement, isSelected }: CommonElementProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const [isBlinking, setIsBlinking] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1000) {
            setIsRunning(false);
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 5000);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStart = useCallback(() => {
    if (timeLeft === 0) {
      setTimeLeft(selectedMinutes * 60 * 1000);
    }
    setIsRunning(true);
  }, [timeLeft, selectedMinutes]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(selectedMinutes * 60 * 1000);
  }, [selectedMinutes]);

  const handleClose = useCallback(() => {
    onUpdate(id, { hidden: true });
  }, [id, onUpdate]);

  return (
      <div
        className={`bg-black text-white rounded-lg p-4 flex flex-col items-center justify-center gap-2 shadow-lg ${isBlinking ? 'animate-pulse' : ''}`}
        style={{ width: '100%', height: '100%' }}
        onClick={() => onSelectElement(id, false)}
      >
        {timeLeft === 0 && !isRunning ? (
          <div className="flex flex-col gap-2">
            <div className="text-sm mb-2">Seleccionar tiempo:</div>
            <div className="grid grid-cols-3 gap-1">
              {PRESET_TIMES.map(min => (
                <Button
                  key={min}
                  size="sm"
                  variant={selectedMinutes === min ? "default" : "outline"}
                  className={selectedMinutes === min ? "bg-white text-black" : "bg-gray-800 text-white"}
                  onClick={() => setSelectedMinutes(min)}
                >
                  {min}m
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-3xl font-mono font-bold">{formatTime(timeLeft)}</div>
        )}
        <div className="flex gap-2">
          {!isRunning ? (
            <Button size="icon" variant="outline" className="bg-white text-black hover:bg-gray-200 h-7 w-7" onClick={handleStart}>
              <Play className="h-3 w-3" />
            </Button>
          ) : (
            <Button size="icon" variant="outline" className="bg-white text-black hover:bg-gray-200 h-7 w-7" onClick={handlePause}>
              <Pause className="h-3 w-3" />
            </Button>
          )}
          <Button size="icon" variant="outline" className="bg-white text-black hover:bg-gray-200 h-7 w-7" onClick={handleReset}>
            <Square className="h-3 w-3" />
          </Button>
          <Button size="icon" variant="outline" className="bg-white text-black hover:bg-gray-200 h-7 w-7" onClick={handleClose}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
  );
}

