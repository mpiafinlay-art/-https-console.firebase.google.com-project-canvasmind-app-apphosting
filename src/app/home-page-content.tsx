/**
 * HomePageContent - Versión DEFINITIVA con redirección funcional
 * SOLUCIÓN CRÍTICA: Prevenir re-ejecuciones después de redirección
 */

'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestore, useUser, useAuth } from '@/firebase/provider';
import {
  collection,
  query,
  getDocs,
  addDoc,
  serverTimestamp,
  limit,
  orderBy,
  doc,
  setDoc,
  getDoc,
  type Firestore,
} from 'firebase/firestore';
import type { User, UserCredential } from 'firebase/auth';
import { Clapperboard, Loader2, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInWithGoogle, signInAsGuest, signInWithEmail, createUserWithEmail, signOut } from '@/firebase/auth';
import { Button } from '@/components/ui/button';
import EmailAuthDialog from '@/components/auth/email-auth-dialog';
import { PopupBlockedAlert } from '@/components/auth/popup-blocked-alert';

// Helper function to ensure user document exists in Firestore
const ensureUserDocument = async (firestore: Firestore, userToEnsure: User) => {
  const userDocRef = doc(firestore, 'users', userToEnsure.uid);
  try {
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: userToEnsure.uid,
        email: userToEnsure.email,
        displayName: userToEnsure.displayName || 'Invitado',
        photoURL: userToEnsure.photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }
  } catch (error) {
    console.error('Error ensuring user document:', error);
  }
};

// Helper function para acceder a sessionStorage de forma segura
const safeSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(key) : null;
    } catch (error) {
      console.error(`❌ Error accediendo a sessionStorage.getItem(${key}):`, error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(`❌ Error accediendo a sessionStorage.setItem(${key}):`, error);
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`❌ Error accediendo a sessionStorage.removeItem(${key}):`, error);
    }
  },
  clear: (): void => {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
      }
    } catch (error) {
      console.error('❌ Error accediendo a sessionStorage.clear():', error);
    }
  }
};

export default function HomePageContent() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading, userError } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  // CRÍTICO: Usar refs para router, toast y processUser para evitar re-creaciones infinitas
  const routerRef = useRef(router);
  const toastRef = useRef(toast);
  const processUserRef = useRef<((user: User) => Promise<void>) | null>(null);
  
  // Actualizar refs cuando cambian
  useEffect(() => {
    routerRef.current = router;
    toastRef.current = toast;
  }, [router, toast]);
  
  // Estados mínimos necesarios
  const [isMounted, setIsMounted] = useState(false);
  const [emailAuthDialogOpen, setEmailAuthDialogOpen] = useState(false);
  const [emailAuthMode, setEmailAuthMode] = useState<'login' | 'signup'>('login');
  const [showLogin, setShowLogin] = useState(true); // SIEMPRE mostrar login por defecto
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Estado para prevenir múltiples clics
  const [showPopupBlockedAlert, setShowPopupBlockedAlert] = useState(false); // Alerta para pop-ups bloqueados
  
  // REFS CRÍTICOS: Flags persistentes que NO causan re-renders
  const hasProcessedUserRef = useRef<string | null>(null);
  const isProcessingRef = useRef<boolean>(false);
  const hasRedirectedRef = useRef<boolean>(false);
  const redirectingToRef = useRef<string | null>(null); // Guardar a dónde se está redirigiendo
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userJustLoggedInRef = useRef<boolean>(false); // Flag para detectar login explícito
  const hasCleanedOnMountRef = useRef<boolean>(false); // Flag para evitar limpieza múltiple

  // CRÍTICO: SIEMPRE limpiar sesión cuando se visita la página de inicio (/)
  // La página de inicio debe estar SIEMPRE limpia, sin usuario autenticado
  // EXCEPTO: Durante redirect de Google (no limpiar para permitir login)
  // IMPORTANTE: Solo ejecutar una vez al montar, no en cada cambio de user/auth
  useEffect(() => {
    if (typeof window === 'undefined' || !isMounted) return;
    
    // Solo limpiar una vez al montar
    if (hasCleanedOnMountRef.current) return;
    
    // Verificar que document esté disponible antes de acceder
    if (typeof document === 'undefined') return;
    
    try {
      // Verificar que estamos EXACTAMENTE en la página de inicio
      const currentPath = window.location?.pathname || '/';
      const isHomePage = currentPath === '/' || currentPath === '';
      
      if (!isHomePage) {
        return; // No estamos en home, no hacer nada
      }
      
      // Verificar si hay redirect de Google activo (más exhaustivo)
      const referrer = document.referrer || '';
      const search = window.location?.search || '';
      const hasGoogleRedirect = 
        referrer.includes('accounts.google.com') || 
        referrer.includes('firebaseapp.com') ||
        referrer.includes('canvasmind-app.firebaseapp.com') ||
        search.includes('code=') ||
        search.includes('state=') ||
        search.includes('authType=') ||
        safeSessionStorage.getItem('googleRedirectCompleted') === 'true';
      
      // Si hay redirect de Google activo, NO limpiar (permitir que el login se complete)
      if (hasGoogleRedirect) {
        console.log('⏭️ Redirect de Google activo, NO limpiando sesión (permitir login)', {
          referrer,
          search,
          googleRedirectCompleted: safeSessionStorage.getItem('googleRedirectCompleted') || 'N/A'
        });
        hasCleanedOnMountRef.current = true; // Marcar como procesado para no ejecutar de nuevo
        return;
      }
      
      // CRÍTICO: Verificar si hay un login en progreso ANTES de limpiar
      const hasRecentLoginFromStorage = safeSessionStorage.getItem('hasRecentLogin') === 'true';
      const userJustLoggedInFromStorage = safeSessionStorage.getItem('userJustLoggedIn') === 'true';
      const isLoginInProgress = hasRecentLoginFromStorage || userJustLoggedInFromStorage || userJustLoggedInRef.current;
      
      // Si hay un login en progreso, NO limpiar (permitir que el login se complete)
      if (isLoginInProgress) {
        console.log('⏭️ Login en progreso detectado, NO limpiando sesión (permitir que se complete)', {
          hasRecentLoginFromStorage,
          userJustLoggedInFromStorage,
          userJustLoggedInRef: userJustLoggedInRef.current
        });
        hasCleanedOnMountRef.current = true; // Marcar como procesado para no ejecutar de nuevo
        return;
      }
      
      // SIEMPRE limpiar cuando se visita la página de inicio (excepto durante redirect de Google o login en progreso)
      console.log('🔄 Limpiando sesión al cargar página de inicio (página debe estar limpia)...');
      
      // CRÍTICO: Resetear todos los refs PRIMERO
      hasProcessedUserRef.current = null;
      isProcessingRef.current = false;
      hasRedirectedRef.current = false;
      redirectingToRef.current = null;
      userJustLoggedInRef.current = false;
      
      // Limpiar TODOS los flags y storage (con verificación de disponibilidad)
      if (typeof sessionStorage !== 'undefined') {
        safeSessionStorage.clear();
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.clear();
      }
      
      // Forzar mostrar login
      setShowLogin(true);
      
      // Marcar como limpiado ANTES de hacer logout
      hasCleanedOnMountRef.current = true;
      
      // SIEMPRE hacer logout si hay usuario autenticado (sin esperar)
      if (auth && auth.currentUser) {
        console.log('🚪 Haciendo logout automático al visitar página de inicio...', {
          userId: auth.currentUser.uid,
          isAnonymous: auth.currentUser.isAnonymous
        });
        // Hacer logout sin await para que no bloquee
        signOut(auth).catch((error) => {
          console.error('Error al hacer logout:', error);
        });
      }
    } catch (error) {
      console.error('❌ Error en useEffect de limpieza de sesión:', error);
      hasCleanedOnMountRef.current = true; // Marcar como procesado incluso si hay error
    }
  }, [isMounted, auth]);

  // Marcar como montado después de la hidratación (solo una vez)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // TIMEOUT ELIMINADO: Ya no forzamos mostrar login después de timeout
  // El login se muestra solo si no hay usuario autenticado

  // FUNCIÓN: Procesar usuario después de login
  // FLUJO: Buscar tablero existente o crear uno nuevo → Redirigir a /board/[boardId]
  const processUser = useCallback(async (userToProcess: User) => {
    // CRÍTICO: Verificar si el componente está montado antes de actualizar estado
    if (!isMounted) {
      console.log('⏭️ Componente no montado, saltando processUser...');
      return;
    }
    
    // PREVENCIÓN: Si ya se está procesando o ya se procesó este usuario, salir
    if (isProcessingRef.current || hasProcessedUserRef.current === userToProcess.uid) {
      console.log('⏭️ Usuario ya procesado o en proceso, saltando...', { uid: userToProcess.uid });
      return;
    }

    // PREVENCIÓN: Si ya se está redirigiendo, NO hacer nada
    if (hasRedirectedRef.current || redirectingToRef.current) {
      console.log('⏭️ Ya se está redirigiendo, saltando procesamiento...');
      return;
    }

    // Marcar como procesando ANTES de cualquier operación asíncrona
    isProcessingRef.current = true;
    hasProcessedUserRef.current = userToProcess.uid;

    try {
      console.log('🔄 [processUser] Iniciando...', { uid: userToProcess.uid });
      
      if (!firestore) {
        throw new Error('Firestore no disponible');
      }

      // Asegurar documento de usuario
      await ensureUserDocument(firestore, userToProcess);
      console.log('✅ [processUser] Documento de usuario asegurado');
      
      // Buscar tablero más reciente - LÓGICA ORIGINAL
      const boardsCollection = collection(firestore, 'users', userToProcess.uid, 'canvasBoards');
      console.log('🔍 [processUser] Buscando tableros en:', `users/${userToProcess.uid}/canvasBoards`);
      
      let querySnapshot;
      try {
        const q = query(boardsCollection, orderBy('updatedAt', 'desc'), limit(1));
        querySnapshot = await getDocs(q);
        console.log('📊 [processUser] Consulta con orderBy exitosa. Tableros encontrados:', querySnapshot.size);
      } catch (orderByError: any) {
        console.warn('⚠️ [processUser] Error con orderBy, intentando sin orden:', orderByError);
        console.warn('⚠️ [processUser] Detalles del error:', {
          code: orderByError.code,
          message: orderByError.message
        });
        const allBoardsSnapshot = await getDocs(boardsCollection);
        console.log('📊 [processUser] Consulta sin orderBy. Tableros encontrados:', allBoardsSnapshot.size);
        
        if (allBoardsSnapshot.size > 0) {
          console.log('📋 [processUser] Tableros encontrados (sin orden):', allBoardsSnapshot.docs.map(d => ({
            id: d.id,
            name: d.data().name,
            updatedAt: d.data().updatedAt?.toMillis?.() || d.data().createdAt?.toMillis?.() || 'sin fecha'
          })));
          
          const sortedDocs = allBoardsSnapshot.docs.sort((a, b) => {
            const aTime = a.data().updatedAt?.toMillis?.() || a.data().createdAt?.toMillis?.() || 0;
            const bTime = b.data().updatedAt?.toMillis?.() || b.data().createdAt?.toMillis?.() || 0;
            return bTime - aTime;
          });
          
          querySnapshot = {
            empty: false,
            size: sortedDocs.length,
            docs: [sortedDocs[0]],
            docChanges: () => [],
            forEach: allBoardsSnapshot.forEach.bind(allBoardsSnapshot),
            // isEqual no existe en QuerySnapshot, usar comparación manual si es necesario
            // isEqual: allBoardsSnapshot.isEqual?.bind(allBoardsSnapshot) || (() => false),
            metadata: allBoardsSnapshot.metadata,
          } as any;
        } else {
          console.log('📭 [processUser] No se encontraron tableros para el usuario');
          querySnapshot = allBoardsSnapshot;
        }
      }

      // LÓGICA ORIGINAL QUE FUNCIONABA: Buscar tablero o crear uno nuevo
      console.log('🔍 [processUser] Verificando resultados:', {
        empty: querySnapshot.empty,
        size: querySnapshot.size,
        hasDocs: !!querySnapshot.docs?.[0]
      });
      
      if (!querySnapshot.empty && querySnapshot.docs[0]) {
        const boardId = querySnapshot.docs[0].id;
        console.log('➡️ [processUser] Redirigiendo a tablero existente:', { boardId });
        
        // CRÍTICO: Establecer flags en sessionStorage ANTES de marcar como redirigido
        const timestamp = Date.now().toString();
        try {
          if (typeof sessionStorage !== 'undefined') {
            safeSessionStorage.setItem('hasRecentLogin', 'true');
            safeSessionStorage.setItem('loginTimestamp', timestamp);
            safeSessionStorage.setItem('redirectingToBoard', boardId);
          }
        } catch (error) {
          console.error('❌ Error estableciendo flags en sessionStorage:', error);
        }
        
        console.log('✅ [processUser] Flags de sessionStorage establecidos antes de redirigir:', {
          hasRecentLogin: safeSessionStorage.getItem('hasRecentLogin') || 'N/A',
          loginTimestamp: safeSessionStorage.getItem('loginTimestamp') || 'N/A',
          redirectingToBoard: boardId
        });
        
        // CRÍTICO: Verificar si el componente sigue montado antes de actualizar estado
        if (!isMounted) {
          console.log('⏭️ Componente desmontado durante processUser, cancelando redirección...');
          return;
        }
        
        // CRÍTICO: Marcar DESPUÉS de establecer flags para prevenir re-ejecuciones
        hasRedirectedRef.current = true;
        redirectingToRef.current = boardId;
        isProcessingRef.current = false; // Permitir que se complete
        hasProcessedUserRef.current = userToProcess.uid; // Marcar como procesado
        
        // CRÍTICO: Usar window.location.href para producción estática (Firebase Hosting)
        // IMPORTANTE: Guardar el UID del usuario anónimo en sessionStorage para restaurarlo después del redirect
        if (userToProcess.isAnonymous) {
          safeSessionStorage.setItem('anonymousUserId', userToProcess.uid);
          console.log('💾 Guardando UID de usuario anónimo para restaurar después del redirect:', userToProcess.uid);
        }
        // CRÍTICO: Establecer flags de login reciente ANTES de redirigir
        safeSessionStorage.setItem('hasRecentLogin', 'true');
        safeSessionStorage.setItem('loginTimestamp', Date.now().toString());
        safeSessionStorage.setItem('redirectingToBoard', boardId);
        console.log('🚀 Redirigiendo a tablero:', boardId);
        // CRÍTICO: Usar window.location.href para forzar recarga completa y mantener sesión anónima
        // router.push no funciona bien con usuarios anónimos en producción estática
        window.location.href = `/board/${boardId}`;
        return;
      } else {
        console.log('➕ [processUser] No se encontraron tableros, creando nuevo tablero...');
        console.log('➕ [processUser] Datos del nuevo tablero:', {
          name: 'Mi Primer Tablero',
          userId: userToProcess.uid,
          collection: `users/${userToProcess.uid}/canvasBoards`
        });
        
        const newBoardRef = await addDoc(boardsCollection, {
          name: 'Mi Primer Tablero',
          userId: userToProcess.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        
        console.log('✅ [processUser] Nuevo tablero creado exitosamente:', {
          boardId: newBoardRef.id,
          path: newBoardRef.path
        });
        
        toastRef.current({
          title: "¡Bienvenido/a a Mi cerebro!",
          description: "Hemos creado tu primer tablero para que empieces a crear.",
        });
        
        // CRÍTICO: Establecer flags en sessionStorage ANTES de marcar como redirigido
        const timestamp = Date.now().toString();
        safeSessionStorage.setItem('hasRecentLogin', 'true');
        safeSessionStorage.setItem('loginTimestamp', timestamp);
        safeSessionStorage.setItem('redirectingToBoard', newBoardRef.id);
        
        console.log('✅ [processUser] Flags de sessionStorage establecidos antes de redirigir (nuevo tablero):', {
          hasRecentLogin: safeSessionStorage.getItem('hasRecentLogin'),
          loginTimestamp: safeSessionStorage.getItem('loginTimestamp'),
          redirectingToBoard: newBoardRef.id
        });
        
        // CRÍTICO: Verificar si el componente sigue montado antes de actualizar estado
        if (!isMounted) {
          console.log('⏭️ Componente desmontado durante processUser, cancelando redirección...');
          return;
        }
        
        // CRÍTICO: Marcar DESPUÉS de establecer flags para prevenir re-ejecuciones
        hasRedirectedRef.current = true;
        redirectingToRef.current = newBoardRef.id;
        isProcessingRef.current = false;
        hasProcessedUserRef.current = userToProcess.uid; // Marcar como procesado
        
        // CRÍTICO: Usar window.location.href para producción estática (Firebase Hosting)
        // IMPORTANTE: Guardar el UID del usuario anónimo en sessionStorage para restaurarlo después del redirect
        if (userToProcess.isAnonymous) {
          safeSessionStorage.setItem('anonymousUserId', userToProcess.uid);
          console.log('💾 Guardando UID de usuario anónimo para restaurar después del redirect:', userToProcess.uid);
        }
        // CRÍTICO: Establecer flags de login reciente ANTES de redirigir
        safeSessionStorage.setItem('hasRecentLogin', 'true');
        safeSessionStorage.setItem('loginTimestamp', Date.now().toString());
        safeSessionStorage.setItem('redirectingToBoard', newBoardRef.id);
        console.log('🚀 Redirigiendo a nuevo tablero:', newBoardRef.id);
        // CRÍTICO: Usar window.location.href para forzar recarga completa y mantener sesión anónima
        window.location.href = `/board/${newBoardRef.id}`;
        return;
      }
    } catch (err) {
      console.error("❌ [processUser] ERROR:", err);
      
      // CRÍTICO: Verificar si el componente sigue montado antes de actualizar estado
      if (!isMounted) {
        console.log('⏭️ Componente desmontado durante error en processUser, cancelando actualizaciones...');
        return;
      }
      
      // Resetear flags para permitir reintento
      isProcessingRef.current = false;
      hasProcessedUserRef.current = null;
      hasRedirectedRef.current = false;
      redirectingToRef.current = null;
      // NO resetear userJustLoggedInRef aquí si ya se inició la redirección
      if (!hasRedirectedRef.current) {
        userJustLoggedInRef.current = false;
      }
      
      toastRef.current({ 
        variant: 'destructive', 
        title: 'Error al buscar tableros', 
        description: `No se pudieron cargar tus tableros: ${err instanceof Error ? err.message : 'Error desconocido'}`
      });
      
      setShowLogin(true);
    }
  }, [firestore, isMounted]); // CRÍTICO: Agregar isMounted a dependencias para verificar montaje
  
  // CRÍTICO: Actualizar ref de processUser cuando cambia
  useEffect(() => {
    processUserRef.current = processUser;
  }, [processUser]);

  // EFECTO PRINCIPAL: Manejar cambios de autenticación
  // FLUJO ORDENADO:
  // 1. Usuario entra a / → Se limpia sesión (solo una vez al montar)
  // 2. Usuario hace login → Se detecta usuario → Se procesa → Se redirige a /board/[boardId]
  useEffect(() => {
    // CRÍTICO: Si ya se redirigió, NO hacer nada más
    if (hasRedirectedRef.current || redirectingToRef.current) {
      console.log('⏭️ Ya redirigido, ignorando cambios de auth...');
      return;
    }

    // No hacer nada hasta que esté montado
    if (!isMounted) {
      return;
    }
    
    // Si hay error, mostrar login
    if (userError) {
      console.error('❌ Error de usuario:', userError);
      setShowLogin(true);
      hasProcessedUserRef.current = null;
      isProcessingRef.current = false;
      hasRedirectedRef.current = false;
      redirectingToRef.current = null;
      return;
    }

    // Si aún está cargando, esperar
    if (isUserLoading) {
      return;
    }
    
    // Si no hay Firebase disponible, esperar
    if (!firestore || !auth) {
      return;
    }

    // CRÍTICO: Verificar si estamos en una ruta de tablero
    // Si estamos en /board/[boardId], NO hacer nada aquí
    try {
      const isOnBoardPage = typeof window !== 'undefined' && 
                            window.location?.pathname?.startsWith('/board/');
      
      if (isOnBoardPage) {
        // Si estamos en una página de tablero, no hacer nada aquí
        // Dejar que la página del tablero maneje la autenticación
        return;
      }
      
      // CRÍTICO: Verificar si estamos en la página de inicio
      const isOnHomePage = typeof window !== 'undefined' && 
                          (window.location?.pathname === '/' || window.location?.pathname === '');
      
      if (!isOnHomePage) {
        return;
      }
    } catch (error) {
      console.error('❌ Error verificando ruta:', error);
      return;
    }
    
    // CRÍTICO: Si ya se limpió la sesión al montar, SIEMPRE hacer logout de usuarios residuales
    // La página de inicio DEBE estar siempre limpia
    // EXCEPCIÓN: NO hacer logout si el usuario acaba de hacer login (verificar sessionStorage también)
    if (hasCleanedOnMountRef.current) {
      // Verificar si hay login reciente en sessionStorage (para casos donde el ref no se actualizó a tiempo)
      const hasRecentLoginFromStorage = safeSessionStorage.getItem('hasRecentLogin') === 'true';
      const userJustLoggedInFromStorage = safeSessionStorage.getItem('userJustLoggedIn') === 'true';
      const isRecentLogin = hasRecentLoginFromStorage || userJustLoggedInFromStorage;
      
      // Si hay usuario y NO fue un login explícito DESPUÉS de la limpieza, hacer logout
      // PERO: Si hay login reciente en sessionStorage, NO hacer logout (puede ser un login en progreso)
      if (user && user.uid && !userJustLoggedInRef.current && !isRecentLogin) {
        console.log('🚪 Usuario residual detectado después de limpieza, haciendo logout inmediato...', {
          userId: user.uid,
          isAnonymous: user.isAnonymous,
          hasCleanedOnMount: hasCleanedOnMountRef.current,
          userJustLoggedIn: userJustLoggedInRef.current,
          hasRecentLoginFromStorage,
          userJustLoggedInFromStorage
        });
        // Hacer logout inmediatamente sin procesar
        signOut(auth).catch(console.error);
        setShowLogin(true);
        // Resetear todos los flags
        hasProcessedUserRef.current = null;
        isProcessingRef.current = false;
        hasRedirectedRef.current = false;
        redirectingToRef.current = null;
        userJustLoggedInRef.current = false;
        return; // NO procesar este usuario
      }
      
      // Si no hay usuario, asegurar que se muestre login
      if (!user || !user.uid) {
        setShowLogin(true);
        return;
      }
    }
    
    // CRÍTICO: En la página de inicio, verificar si es login explícito
    // Verificar sessionStorage también para detectar login de Google redirect
    let userJustLoggedInFromStorage = false;
    try {
      userJustLoggedInFromStorage = typeof window !== 'undefined' && 
        typeof sessionStorage !== 'undefined' &&
        safeSessionStorage.getItem('userJustLoggedIn') === 'true';
    } catch (error) {
      console.error('❌ Error accediendo a sessionStorage:', error);
    }
    
    if (user && user.uid) {
      // Si hay usuario, verificar si fue login explícito (ref o sessionStorage)
      const isExplicitLogin = userJustLoggedInRef.current || userJustLoggedInFromStorage;
      
      if (!isExplicitLogin) {
        console.log('🚪 Usuario detectado en página de inicio sin login explícito, haciendo logout...', {
          userJustLoggedInRef: userJustLoggedInRef.current,
          userJustLoggedInFromStorage,
          userId: user.uid,
          isAnonymous: user.isAnonymous,
          hasCleanedOnMount: hasCleanedOnMountRef.current
        });
        signOut(auth).catch(console.error);
        setShowLogin(true);
        // Resetear flags para evitar procesamiento
        hasProcessedUserRef.current = null;
        isProcessingRef.current = false;
        hasRedirectedRef.current = false;
        redirectingToRef.current = null;
        return;
      }
      
      // Solo procesar si fue un login explícito
      const alreadyProcessed = hasProcessedUserRef.current === user.uid;
      
      if (!alreadyProcessed && !isProcessingRef.current) {
        console.log('✅ [FLUJO] Usuario detectado después de login explícito, procesando...', { 
          uid: user.uid, 
          email: user.email || 'anónimo',
          isAnonymous: user.isAnonymous,
          hasGoogleProvider: user.providerData?.some(p => p.providerId === 'google.com')
        });
        // NO mostrar login durante el procesamiento
        setShowLogin(false);
        // Asegurar que el flag esté establecido
        userJustLoggedInRef.current = true;
        // Establecer flags en sessionStorage (con verificación)
        try {
          if (typeof sessionStorage !== 'undefined') {
            safeSessionStorage.setItem('hasRecentLogin', 'true');
            safeSessionStorage.setItem('loginTimestamp', Date.now().toString());
            safeSessionStorage.setItem('userJustLoggedIn', 'true');
          }
        } catch (error) {
          console.error('❌ Error estableciendo flags en sessionStorage:', error);
        }
        // Procesar usuario inmediatamente - esto buscará/creará tablero y redirigirá a /board/[boardId]
        // CRÍTICO: Usar ref para evitar dependencias en useEffect
        if (processUserRef.current) {
          processUserRef.current(user).catch((error) => {
            console.error('❌ Error en processUser:', error);
            setShowLogin(true);
          });
        }
      }
    } else if (!user && !isUserLoading) {
      // No hay usuario - FORZAR mostrar login
      setShowLogin(true);
      hasProcessedUserRef.current = null;
      isProcessingRef.current = false;
      hasRedirectedRef.current = false;
      redirectingToRef.current = null;
      userJustLoggedInRef.current = false;
      // Limpiar sessionStorage (con verificación)
      try {
        if (typeof sessionStorage !== 'undefined') {
          safeSessionStorage.clear();
        }
      } catch (error) {
        console.error('❌ Error limpiando sessionStorage:', error);
      }
    }
  }, [isMounted, user, isUserLoading, userError, firestore, auth]); // CRÍTICO: Removido processUser de dependencias, usar processUserRef.current

  // Handlers de login (memoizados para evitar recreaciones)
  // CRÍTICO: Marcar que el usuario hizo login EXPLÍCITO antes de autenticar
  const handleLogin = useCallback(async (provider: 'google' | 'guest') => {
    console.log('🔵 handleLogin llamado con provider:', provider);
    
    // Prevenir múltiples clics simultáneos
    if (isLoggingIn) {
      console.log('⚠️ Login ya en proceso, ignorando clic adicional');
      return;
    }
    
    if (!auth) {
      console.error('❌ Auth no disponible');
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'Servicio de autenticación no disponible. Por favor, recarga la página.' 
      });
      return;
    }
    
    try {
      setIsLoggingIn(true); // Marcar que el login está en proceso
      console.log('🔄 Iniciando proceso de login...');
      
      // CRÍTICO: Marcar que el usuario acaba de hacer login explícitamente
      userJustLoggedInRef.current = true;
      
      // CRÍTICO: Guardar en sessionStorage para mantener el estado entre navegaciones
      safeSessionStorage.setItem('hasRecentLogin', 'true');
      safeSessionStorage.setItem('loginTimestamp', Date.now().toString());
      
      // Resetear flags antes de login
      hasProcessedUserRef.current = null;
      isProcessingRef.current = false;
      hasRedirectedRef.current = false;
      redirectingToRef.current = null;
      
      if (provider === 'google') {
        // signInWithPopup abre un popup y retorna el resultado directamente
        console.log('🔄 Iniciando sesión con Google (popup)...');
        const result = await signInWithGoogle(auth);
        
        if (!result?.user) {
          throw new Error('No se pudo obtener información del usuario después del login');
        }
        
        // CRÍTICO: Marcar que el usuario acaba de hacer login explícitamente
        userJustLoggedInRef.current = true;
        safeSessionStorage.setItem('userJustLoggedIn', 'true');
        
        // Asegurar documento de usuario inmediatamente después del login
        if (firestore && result.user) {
          await ensureUserDocument(firestore, result.user);
        }
        
        // El onAuthStateChanged detectará el cambio y processUser se ejecutará
        // No necesitamos hacer nada más aquí, el flujo continúa automáticamente
        setIsLoggingIn(false);
      } else {
        // Para invitado, sigue usando signInAnonymously (no necesita redirect)
        const result = await signInAsGuest(auth);
        
        if (!result?.user) {
          throw new Error('No se pudo obtener información del usuario después del login');
        }
        
        if (firestore && result.user) {
          await ensureUserDocument(firestore, result.user);
        }
        
        console.log('✅ Login exitoso (invitado), procesando usuario...', { uid: result.user.uid });
        // Procesar usuario inmediatamente después del login con invitado
        if (firestore && result.user && processUserRef.current) {
          // NO esperar al useEffect, procesar inmediatamente usando ref
          processUserRef.current(result.user);
        }
        setIsLoggingIn(false); // Resetear solo para invitado (Google redirige la página)
      }
    } catch (error: any) {
      console.error('❌ Error en handleLogin:', error);
      setIsLoggingIn(false); // Resetear en caso de error
      
      let errorMessage = 'No se pudo completar el proceso de login.';
      if (error.code === 'auth/popup-blocked') {
        errorMessage = 'El popup fue bloqueado por el navegador. Por favor, permite popups para este sitio.';
        setShowPopupBlockedAlert(true); // Mostrar alerta persistente
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'El popup fue cerrado antes de completar el login. Por favor, intenta de nuevo.';
      } else if (error.code === 'auth/redirect-cancelled-by-user') {
        errorMessage = 'El proceso de login fue cancelado. Por favor, intenta de nuevo.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({ 
        variant: 'destructive', 
        title: 'Error de inicio de sesión', 
        description: errorMessage
      });
    }
  }, [auth, firestore, toast, isLoggingIn, setIsLoggingIn]);

  const handleEmailAuth = useCallback(async (email: string, password: string) => {
    if (!auth) {
      throw new Error('Servicio de autenticación no disponible.');
    }

    try {
      // CRÍTICO: Resetear flags ANTES de autenticación
      hasProcessedUserRef.current = null;
      isProcessingRef.current = false;
      hasRedirectedRef.current = false;
      redirectingToRef.current = null;
      
      let result: UserCredential;
      
      if (emailAuthMode === 'login') {
        result = await signInWithEmail(auth, email, password);
      } else {
        result = await createUserWithEmail(auth, email, password);
        toast({
          title: '¡Cuenta creada!',
          description: 'Tu cuenta ha sido creada exitosamente.',
        });
      }
      
      if (!result?.user) {
        throw new Error('No se pudo obtener información del usuario después del login');
      }
      
      // CRÍTICO: Marcar que el usuario acaba de hacer login explícitamente DESPUÉS del login exitoso
      userJustLoggedInRef.current = true;
      
      // CRÍTICO: Guardar en sessionStorage para mantener el estado entre navegaciones
      safeSessionStorage.setItem('hasRecentLogin', 'true');
      safeSessionStorage.setItem('loginTimestamp', Date.now().toString());
      safeSessionStorage.setItem('userJustLoggedIn', 'true');
      
      console.log('✅ Autenticación con email exitosa, asegurando documento de usuario...', { 
        uid: result.user.uid,
        email: result.user.email 
      });
      
      // Asegurar documento de usuario
      if (firestore && result.user) {
        await ensureUserDocument(firestore, result.user);
      }
      
      console.log('✅ Autenticación con email exitosa, procesando usuario...', { uid: result.user.uid });
      // Procesar usuario inmediatamente después del login con email
      if (firestore && result.user && processUserRef.current) {
        // NO esperar al useEffect, procesar inmediatamente usando ref
        processUserRef.current(result.user);
      }
    } catch (error: any) {
      console.error('❌ Error en handleEmailAuth:', error);
      // Resetear flags en caso de error
      userJustLoggedInRef.current = false;
      hasProcessedUserRef.current = null;
      isProcessingRef.current = false;
      hasRedirectedRef.current = false;
      redirectingToRef.current = null;
      toast({
        variant: 'destructive',
        title: 'Error de autenticación',
        description: error.message || 'No se pudo completar la autenticación.',
      });
      throw error;
    }
  }, [auth, firestore, emailAuthMode, toast]); // CRÍTICO: Removido processUser de dependencias, usar processUserRef.current

  // RENDERIZADO: Lógica simple y directa
  // CRÍTICO: Verificar sessionStorage también para mostrar loading
  const hasRecentLogin = safeSessionStorage.getItem('hasRecentLogin') === 'true';
  const loginTimestamp = safeSessionStorage.getItem('loginTimestamp');
  const isLoginRecent = hasRecentLogin && loginTimestamp && (Date.now() - parseInt(loginTimestamp)) < 60000; // 60 segundos
  
  // Restaurar flag desde sessionStorage si es necesario (para el renderizado)
  const effectiveUserJustLoggedIn = userJustLoggedInRef.current || isLoginRecent;
  
  // Mostrar loading si:
  // 1. Hay usuario Y
  // 2. (Hay login explícito O hay login reciente en sessionStorage) Y
  // 3. (Está procesando O está redirigiendo O está cargando usuario) Y
  // 4. NO se debe mostrar login
  const shouldShowLoading = user && user.uid && 
    effectiveUserJustLoggedIn && 
    (isProcessingRef.current || hasRedirectedRef.current || redirectingToRef.current || isUserLoading) &&
    !showLogin;
  
  if (shouldShowLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center" style={{ backgroundColor: '#96e4e6' }}>
        <Clapperboard className="mb-4 h-16 w-16 animate-pulse text-slate-900" />
        <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
        <p className="mt-4 text-lg font-semibold text-slate-900">Cargando tu tablero...</p>
      </div>
    );
  }

  // En TODOS los demás casos (sin login explícito, sin redirección, etc.), FORZAR mostrar login
  return (
    <>
      <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden font-sans text-slate-900" style={{ backgroundColor: '#96e4e6' }}>
        {/* Fondo decorativo */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" 
             style={{ 
               backgroundImage: 'radial-gradient(#2c3e50 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
             }}>
        </div>

        <div className="z-10 w-full max-w-md px-6">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="h-16 w-16 bg-black rounded-full flex items-center justify-center mb-4 shadow-lg">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00ffaa" />
                    <stop offset="50%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#0066ff" />
                  </linearGradient>
                </defs>
                {/* Forma ondulada interconectada - similar a la imagen */}
                <path 
                  d="M6 18C6 14, 8 12, 12 12C14 12, 16 13, 18 14C20 15, 22 16, 24 16C26 16, 28 15, 30 14C32 13, 34 14, 34 18C34 22, 32 24, 30 24C28 24, 26 23, 24 22C22 21, 20 20, 18 20C16 20, 14 21, 12 22C10 23, 8 22, 6 18Z" 
                  fill="url(#logoGradient)"
                />
                <path 
                  d="M8 16C8 14, 9 12, 12 12C13 12, 14 13, 16 14C18 15, 20 16, 22 16C23 16, 24 15, 26 14C27 13, 28 14, 28 16C28 18, 27 20, 26 20C25 20, 24 19, 22 18C20 17, 18 16, 16 16C14 16, 12 17, 10 18C9 19, 8 18, 8 16Z" 
                  fill="url(#logoGradient)"
                  opacity="0.85"
                />
                <path 
                  d="M10 20C10 18, 11 16, 14 16C15 16, 16 17, 18 18C20 19, 22 20, 24 20C25 20, 26 19, 28 18C29 17, 30 18, 30 20C30 22, 29 24, 28 24C27 24, 26 23, 24 22C22 21, 20 20, 18 20C16 20, 14 21, 12 22C11 23, 10 22, 10 20Z" 
                  fill="url(#logoGradient)"
                  opacity="0.7"
                />
                <path 
                  d="M12 14C12 12, 13 10, 16 10C17 10, 18 11, 20 12C22 13, 24 14, 26 14C27 14, 28 13, 30 12C31 11, 32 12, 32 14C32 16, 31 18, 30 18C29 18, 28 17, 26 16C24 15, 22 14, 20 14C18 14, 16 15, 14 16C13 17, 12 16, 12 14Z" 
                  fill="url(#logoGradient)"
                  opacity="0.6"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
              Mi cerebro
            </h1>
            <p className="text-slate-500 text-lg">
              Tu lienzo de ideas infinitas.
            </p>
          </div>

          {/* Tarjeta Login */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <div className="space-y-4">
              {/* Botón Google */}
              <Button
                onClick={() => handleLogin('google')}
                disabled={isLoggingIn}
                size="lg"
                className="w-full"
              >
                {isLoggingIn ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <img src="/google-logo.svg" alt="Google" width={20} height={20} className="mr-2 inline-block" />
                )}
                {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar Sesión con Google'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400">O continúa como</span>
                </div>
              </div>

              {/* Botón Invitado */}
              <Button
                onClick={() => handleLogin('guest')}
                disabled={isLoggingIn}
                size="lg"
                variant="default"
                className="w-full bg-[#16b5a8] hover:bg-[#139c91] text-white"
              >
                {isLoggingIn ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <UserIcon className="h-5 w-5 mr-2" />
                )}
                {isLoggingIn ? 'Iniciando sesión...' : 'Invitado'}
              </Button>
            </div>

            {/* Links adicionales */}
            <div className="mt-6 text-center space-x-2">
              <button
                onClick={() => {
                  setEmailAuthMode('login');
                  setEmailAuthDialogOpen(true);
                }}
                className="text-blue-600 italic hover:text-blue-700 underline text-sm"
              >
                Log in
              </button>
              <span className="text-blue-600 italic text-sm">/</span>
              <button
                onClick={() => {
                  setEmailAuthMode('signup');
                  setEmailAuthDialogOpen(true);
                }}
                className="text-blue-600 italic hover:text-blue-700 underline text-sm"
              >
                Crear Cuenta
              </button>
              {auth?.currentUser && (
                <>
                  <span className="text-blue-600 italic text-sm mx-2">/</span>
                  <button
                    onClick={async () => {
                      try {
                        await signOut(auth);
                        safeSessionStorage.clear();
                        hasProcessedUserRef.current = null;
                        isProcessingRef.current = false;
                        hasRedirectedRef.current = false;
                        redirectingToRef.current = null;
                        userJustLoggedInRef.current = false;
                        setShowLogin(true);
                        toast({
                          title: 'Sesión cerrada',
                          description: 'Has cerrado sesión correctamente.',
                        });
                      } catch (error) {
                        console.error('Error al cerrar sesión:', error);
                        toast({
                          variant: 'destructive',
                          title: 'Error',
                          description: 'No se pudo cerrar la sesión.',
                        });
                      }
                    }}
                    className="text-red-600 italic hover:text-red-700 underline text-sm"
                  >
                    Cerrar Sesión
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <EmailAuthDialog
        isOpen={emailAuthDialogOpen}
        onOpenChange={setEmailAuthDialogOpen}
        mode={emailAuthMode}
        onAuth={handleEmailAuth}
      />
      
      {showPopupBlockedAlert && (
        <PopupBlockedAlert onDismiss={() => setShowPopupBlockedAlert(false)} />
      )}
    </>
  );
}
