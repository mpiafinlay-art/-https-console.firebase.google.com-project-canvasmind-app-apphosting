"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth, useFirestore } from '@/firebase/provider';
import { signInWithGoogle, signInWithEmail, createUserWithEmail, signInAsGuest } from '@/firebase/auth';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export default function HomePage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [error, setError] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  // Timeout para mostrar login si Firebase tarda mucho
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isUserLoading) {
        setShowLogin(true);
      }
    }, 2000); // 2 segundos máximo de espera
    
    return () => clearTimeout(timer);
  }, [isUserLoading]);

  // Si ya hay usuario, redirigir a /board/new
  useEffect(() => {
    if (user && !isUserLoading) {
      router.replace('/board/new');
    }
  }, [user, isUserLoading, router]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      if (isCreatingAccount) {
        await createUserWithEmail(auth, email, password);
      } else {
        await signInWithEmail(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    
    setIsLoadingGoogle(true);
    setError('');
    
    try {
      const result = await signInWithGoogle(auth);
      if (result?.user && firestore) {
        const userDocRef = doc(firestore, 'users', result.user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName || 'Usuario',
            photoURL: result.user.photoURL,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }, { merge: true });
        }
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Error al iniciar sesión con Google');
      }
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleGuestAccess = async () => {
    if (!auth || !firestore) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signInAsGuest(auth);
      if (result?.user) {
        const userDocRef = doc(firestore, 'users', result.user.uid);
        await setDoc(userDocRef, {
          uid: result.user.uid,
          displayName: 'Invitado',
          isAnonymous: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }
    } catch (err: any) {
      setError(err.message || 'Error al acceder como invitado');
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading inicial solo por 2 segundos
  if (isUserLoading && !showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto" />
          <p className="mt-4 text-white text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si hay usuario, mostrar loading mientras redirige
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto" />
          <p className="mt-4 text-white text-lg">Entrando a tu tablero...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Canvas Mind</h1>
          <p className="text-gray-600">Tu espacio creativo ilimitado</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="••••••"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || isLoadingGoogle}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold shadow-lg"
          >
            {isLoading ? 'Cargando...' : isCreatingAccount ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="text-center my-4">
          <button
            type="button"
            onClick={() => setIsCreatingAccount(!isCreatingAccount)}
            className="text-sm text-gray-600 hover:text-blue-600 underline"
          >
            {isCreatingAccount ? '¿Ya tienes cuenta? Inicia sesión' : 'Crear cuenta'}
          </button>
        </div>

        <Button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading || isLoadingGoogle}
          className="w-full bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-semibold shadow-md flex items-center justify-center gap-2"
        >
          {isLoadingGoogle ? (
            'Cargando...'
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Ingresar con Google
            </>
          )}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">O</span>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleGuestAccess}
          disabled={isLoading || isLoadingGoogle}
          variant="outline"
          className="w-full py-3 rounded-lg font-semibold"
        >
          Continuar sin cuenta (Invitado)
        </Button>

        <p className="mt-4 text-center text-xs text-gray-500">
          Como invitado podrás usar el tablero, pero tus cambios no se guardarán.
        </p>
      </div>
    </div>
  );
}
