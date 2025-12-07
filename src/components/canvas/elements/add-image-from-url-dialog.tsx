'use client';

import React from 'react';

interface AddImageFromUrlDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddImage: (url: string) => void | Promise<void>;
}

export default function AddImageFromUrlDialog({
  isOpen,
  onOpenChange,
  onAddImage,
}: AddImageFromUrlDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2>Agregar Imagen desde URL</h2>
        <input
          type="text"
          placeholder="URL de la imagen"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const url = (e.target as HTMLInputElement).value;
              if (url) {
                onAddImage(url);
                onOpenChange(false);
              }
            }
          }}
        />
        <button onClick={() => onOpenChange(false)}>Cancelar</button>
      </div>
    </div>
  );
}

