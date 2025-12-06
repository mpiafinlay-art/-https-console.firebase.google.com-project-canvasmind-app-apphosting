'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BoardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Error en tablero:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-canvas-teal">
      <AlertCircle className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-2xl font-bold mb-2">Error al cargar el tablero</h2>
      <p className="text-muted-foreground mb-4 text-center max-w-md">
        {error.message || 'No se pudo cargar el tablero. Verifica tus permisos o intenta más tarde.'}
      </p>
      <div className="flex gap-2">
        <Button onClick={reset}>Intentar de nuevo</Button>
        <Button variant="outline" onClick={() => router.push('/')}>
          Volver al inicio
        </Button>
      </div>
    </div>
  );
}

