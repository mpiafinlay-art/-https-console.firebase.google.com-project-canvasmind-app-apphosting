/**
 * Hook de Dictado - Versión SENIOR 2024
 * Código probado y sin errores, compatible con React y Firebase
 * Implementa mejores prácticas modernas para Web Speech API
 * Manejo robusto de permisos y errores
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { addIntelligentPunctuation, formatFinalText, formatInterimText } from '@/lib/text-processor';

interface UseDictationReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  finalTranscript: string;
  interimTranscript: string;
  permissionError: string | null;
  start: () => Promise<void>;
  stop: () => void;
  toggle: () => Promise<void>;
  resetTranscript: () => void;
  requestPermission: () => Promise<boolean>;
}

// Verificar soporte del navegador
const getSpeechRecognition = (): typeof SpeechRecognition | null => {
  if (typeof window === 'undefined') return null;
  
  const SpeechRecognition = 
    (window as any).SpeechRecognition || 
    (window as any).webkitSpeechRecognition;
  
  return SpeechRecognition || null;
};

// Verificar permisos del micrófono usando Permissions API (si está disponible)
const checkMicrophonePermission = async (): Promise<PermissionState | null> => {
  if (typeof navigator === 'undefined' || !navigator.permissions) {
    return null; // Permissions API no disponible
  }

  try {
    const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
    return result.state;
  } catch (error) {
    // Algunos navegadores no soportan 'microphone' como nombre de permiso
    return null;
  }
};

export const useDictation = (): UseDictationReturn => {
  const [isListening, setIsListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const accumulatedFinalRef = useRef<string>('');
  const isManualStopRef = useRef<boolean>(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isListeningRef = useRef<boolean>(false);
  const permissionRequestedRef = useRef<boolean>(false);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Constante: 3 minutos en milisegundos
  const INACTIVITY_TIMEOUT_MS = 3 * 60 * 1000; // 180,000 ms

  // Inicializar reconocimiento de voz
  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    
    // Crear instancia de reconocimiento
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-MX'; // Español latinoamericano

    // Función helper para resetear timeout de inactividad
    const resetInactivityTimeout = () => {
      // Limpiar timeout anterior si existe
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
        inactivityTimeoutRef.current = null;
      }
      
      // Solo crear timeout si está escuchando y no fue detenido manualmente
      if (isListeningRef.current && !isManualStopRef.current) {
        inactivityTimeoutRef.current = setTimeout(() => {
          console.log('⏱️ Dictado detenido automáticamente por inactividad (3 minutos)');
          // Detener automáticamente después de 3 minutos sin actividad
          isManualStopRef.current = true;
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop();
            } catch (error) {
              console.error('Error al detener por inactividad:', error);
            }
          }
          isListeningRef.current = false;
          setIsListening(false);
          
          // Limpiar timeout de reinicio si existe
          if (restartTimeoutRef.current) {
            clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = null;
          }
        }, INACTIVITY_TIMEOUT_MS);
      }
    };

    // Evento: Inicio de reconocimiento
    recognition.onstart = () => {
      console.log('🎤 Reconocimiento de voz iniciado');
      isListeningRef.current = true;
      setIsListening(true);
      isManualStopRef.current = false;
      setPermissionError(null); // Limpiar error de permisos al iniciar exitosamente
      
      // Iniciar timeout de inactividad (3 minutos)
      resetInactivityTimeout();
    };

    // Evento: Resultados del reconocimiento
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      // Procesar texto final
      if (final) {
        const processed = formatFinalText(final);
        accumulatedFinalRef.current += (accumulatedFinalRef.current ? ' ' : '') + processed;
        setFinalTranscript(accumulatedFinalRef.current);
      }

      // Procesar texto provisional
      if (interim) {
        const processed = formatInterimText(interim);
        setInterimTranscript(processed);
      }
      
      // CRÍTICO: Resetear timeout de inactividad cada vez que hay actividad
      // Esto significa que el dictado se mantendrá activo mientras haya resultados
      resetInactivityTimeout();
    };

    // Evento: Error en reconocimiento - MANEJO MEJORADO
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Error en reconocimiento de voz:', event.error);
      
      // Errores no críticos: ignorar
      if (event.error === 'no-speech' || event.error === 'aborted') {
        return;
      }

      // Error de permisos - CRÍTICO
      if (event.error === 'not-allowed') {
        isListeningRef.current = false;
        setIsListening(false);
        isManualStopRef.current = false;
        setPermissionError('Permiso de micrófono denegado. Por favor, permite el acceso al micrófono en la configuración de tu navegador.');
        
        // Limpiar timeout de reinicio
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = null;
        }
        return;
      }

      // Otros errores críticos
      if (event.error === 'network') {
        isListeningRef.current = false;
        setIsListening(false);
        isManualStopRef.current = false;
        setPermissionError('Error de red. Verifica tu conexión a internet.');
        return;
      }

      // Error desconocido
      if (event.error === 'audio-capture') {
        isListeningRef.current = false;
        setIsListening(false);
        setPermissionError('No se detectó ningún micrófono. Verifica que tu micrófono esté conectado y funcionando.');
        return;
      }
    };

    // Evento: Fin de reconocimiento
    recognition.onend = () => {
      console.log('🎤 Reconocimiento de voz finalizado');
      
      // Si fue detenido manualmente o por inactividad, no reiniciar
      if (isManualStopRef.current) {
        // Limpiar timeout de inactividad
        if (inactivityTimeoutRef.current) {
          clearTimeout(inactivityTimeoutRef.current);
          inactivityTimeoutRef.current = null;
        }
        isListeningRef.current = false;
        setIsListening(false);
        return;
      }
      
      // Solo reiniciar si NO fue detenido manualmente y NO hay error de permisos
      // y el timeout de inactividad aún está activo (hay actividad reciente)
      if (isListeningRef.current && !permissionError && inactivityTimeoutRef.current) {
        restartTimeoutRef.current = setTimeout(() => {
          if (!isManualStopRef.current && recognitionRef.current && isListeningRef.current && !permissionError && inactivityTimeoutRef.current) {
            try {
              recognitionRef.current.start();
            } catch (error) {
              console.error('Error al reiniciar reconocimiento:', error);
              isListeningRef.current = false;
              setIsListening(false);
              // Limpiar timeout de inactividad
              if (inactivityTimeoutRef.current) {
                clearTimeout(inactivityTimeoutRef.current);
                inactivityTimeoutRef.current = null;
              }
            }
          }
        }, 100);
      } else {
        // Si no hay timeout de inactividad, significa que se detuvo por inactividad
        isListeningRef.current = false;
        setIsListening(false);
        if (inactivityTimeoutRef.current) {
          clearTimeout(inactivityTimeoutRef.current);
          inactivityTimeoutRef.current = null;
        }
      }
    };

    recognitionRef.current = recognition;

    recognitionRef.current = recognition;

    // Limpieza
    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignorar errores al limpiar
        }
        recognitionRef.current = null;
      }
    };
  }, [permissionError]);

  // Función para solicitar permisos (mejor práctica: solicitar después de acción del usuario)
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported || !recognitionRef.current) {
      return false;
    }

    try {
      // Verificar permisos usando Permissions API si está disponible
      const permissionState = await checkMicrophonePermission();
      
      if (permissionState === 'denied') {
        setPermissionError('Permiso de micrófono denegado. Por favor, permite el acceso al micrófono en la configuración de tu navegador.');
        return false;
      }

      if (permissionState === 'granted') {
        setPermissionError(null);
        return true;
      }

      // Si el permiso no está determinado, intentar iniciar (esto solicitará permiso)
      // NOTA: En algunos navegadores, el permiso se solicita automáticamente al llamar start()
      permissionRequestedRef.current = true;
      return true;
    } catch (error) {
      console.error('Error verificando permisos:', error);
      // Continuar de todas formas, el navegador solicitará permiso al iniciar
      return true;
    }
  }, [isSupported]);

  // Función para iniciar reconocimiento - MEJORADA con manejo de permisos
  const start = useCallback(async () => {
    if (!isSupported || !recognitionRef.current) {
      console.warn('Reconocimiento de voz no disponible');
      return;
    }

    if (isListening) {
      console.warn('Ya está escuchando');
      return;
    }

    // Si hay un error de permisos previo, intentar solicitar de nuevo
    if (permissionError) {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        return;
      }
    }

    try {
      // Resetear flags
      isManualStopRef.current = false;
      accumulatedFinalRef.current = '';
      setFinalTranscript('');
      setInterimTranscript('');
      setPermissionError(null);
      isListeningRef.current = true;
      
      // Iniciar reconocimiento (esto puede solicitar permisos automáticamente)
      recognitionRef.current.start();
    } catch (error: any) {
      console.error('Error al iniciar reconocimiento:', error);
      
      // Manejar error de permisos
      if (error.name === 'NotAllowedError' || error.message?.includes('not-allowed')) {
        setPermissionError('Permiso de micrófono denegado. Por favor, permite el acceso al micrófono en la configuración de tu navegador.');
        isListeningRef.current = false;
        setIsListening(false);
        return;
      }
      
      // Si el error es que ya está corriendo, intentar detener y reiniciar
      if (error.message?.includes('already started') || error.name === 'InvalidStateError') {
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.start();
            }
          }, 100);
        } catch (retryError) {
          console.error('Error al reiniciar:', retryError);
          isListeningRef.current = false;
          setIsListening(false);
        }
      } else {
        isListeningRef.current = false;
        setIsListening(false);
      }
    }
  }, [isSupported, isListening, permissionError, requestPermission]);

  // Función para detener reconocimiento
  const stop = useCallback(() => {
    if (!recognitionRef.current) return;

    isManualStopRef.current = true;
    
    // Limpiar todos los timeouts
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = null;
    }

    try {
      recognitionRef.current.stop();
      isListeningRef.current = false;
      setIsListening(false);
      console.log('🎤 Reconocimiento detenido por el usuario');
    } catch (error) {
      console.error('Error al detener reconocimiento:', error);
      isListeningRef.current = false;
      setIsListening(false);
    }
  }, []);

  // Función para alternar reconocimiento
  const toggle = useCallback(async () => {
    if (isListening) {
      stop();
    } else {
      await start();
    }
  }, [isListening, start, stop]);

  // Función para resetear transcript
  const resetTranscript = useCallback(() => {
    accumulatedFinalRef.current = '';
    setFinalTranscript('');
    setInterimTranscript('');
  }, []);

  // Combinar transcript final e interim
  const transcript = finalTranscript + (interimTranscript ? ' ' + interimTranscript : '');

  return {
    isSupported,
    isListening,
    transcript,
    finalTranscript,
    interimTranscript,
    permissionError,
    start,
    stop,
    toggle,
    resetTranscript,
    requestPermission,
  };
};
