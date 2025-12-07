
'use client';

import React, { useEffect, useState, useMemo, type ReactNode } from 'react';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, type Auth, type User } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

import { firebaseConfig } from '@/firebase/config';
import { FirebaseContext, type FirebaseContextState } from '@/firebase/provider';
import FirebaseErrorListener from '@/components/FirebaseErrorListener';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [firebaseState, setFirebaseState] = useState<{
    firebaseApp: FirebaseApp | null;
    auth: Auth | null;
    firestore: Firestore | null;
    storage: FirebaseStorage | null;
    initialized: boolean;
    initError: Error | null;
  }>({
    firebaseApp: null,
    auth: null,
    firestore: null,
    storage: null,
    initialized: false,
    initError: null,
  });

  const [userState, setUserState] = useState<{
    user: User | null;
    isUserLoading: boolean;
    userError: Error | null;
  }>({
    user: null,
    isUserLoading: true,
    userError: null,
  });

  // Inicializar Firebase en el cliente
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (firebaseState.initialized) return;

    try {
      let app: FirebaseApp;
      if (!getApps().length) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApp();
      }

      const authInstance = getAuth(app);
      // CRÍTICO: Configurar persistencia para usuarios anónimos (localStorage por defecto)
      // Esto asegura que los usuarios anónimos persistan después de redirects
      // Firebase Auth usa browserLocalPersistence por defecto, pero lo configuramos explícitamente
      const firestoreInstance = getFirestore(app);
      const storageInstance = getStorage(app);

      console.log('✅ Firebase inicializado correctamente en el cliente');
      
      setFirebaseState({
        firebaseApp: app,
        auth: authInstance,
        firestore: firestoreInstance,
        storage: storageInstance,
        initialized: true,
        initError: null,
      });
    } catch (error) {
      console.error('❌ Error al inicializar Firebase:', error);
      setFirebaseState({
        firebaseApp: null,
        auth: null,
        firestore: null,
        storage: null,
        initialized: true,
        initError: error instanceof Error ? error : new Error('Error desconocido al inicializar Firebase'),
      });
      // Si Firebase falla, establecer estado sin usuario inmediatamente
      setUserState({ user: null, isUserLoading: false, userError: null });
    }
  }, [firebaseState.initialized]);

  // Manejar cambios de autenticación (SOLO UNA VEZ - evita errores en cascada)
  useEffect(() => {
    if (!firebaseState.auth || !firebaseState.initialized) {
      if (firebaseState.initialized) {
        setUserState({ user: null, isUserLoading: false, userError: null });
      }
      return;
    }

    let isMounted = true;
    const unsubscribe = onAuthStateChanged(
      firebaseState.auth,
      async (user) => {
        if (!isMounted) return;
        
        if (user && typeof window !== 'undefined') {
          const hasRecentLogin = sessionStorage.getItem('hasRecentLogin') === 'true';
          if (!hasRecentLogin) {
            sessionStorage.setItem('hasRecentLogin', 'true');
            sessionStorage.setItem('loginTimestamp', Date.now().toString());
            if (user.isAnonymous) {
              sessionStorage.setItem('anonymousUserId', user.uid);
            }
          }
        }
        
        if (isMounted) {
          setUserState({ user, isUserLoading: false, userError: null });
        }
      },
      (error) => {
        if (isMounted) {
          setUserState({ user: null, isUserLoading: false, userError: error });
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [firebaseState.auth, firebaseState.initialized]);

  // CRÍTICO: Depender de valores primitivos específicos, no de objetos completos
  // Esto previene re-creaciones innecesarias del contexto y re-renders en cascada
  const contextValue = useMemo(
    (): FirebaseContextState => ({
      firebaseApp: firebaseState.firebaseApp,
      firestore: firebaseState.firestore,
      auth: firebaseState.auth,
      storage: firebaseState.storage,
      ...userState,
    }),
    [
      firebaseState.firebaseApp,
      firebaseState.firestore,
      firebaseState.auth,
      firebaseState.storage,
      firebaseState.initialized,
      userState.user,
      userState.isUserLoading,
      userState.userError,
    ] // ✅ Dependencias primitivas específicas
  );

  return (
    <FirebaseContext.Provider value={contextValue}>
      {contextValue.auth && <FirebaseErrorListener />}
      {children}
    </FirebaseContext.Provider>
  );
}
