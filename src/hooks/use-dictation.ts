'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseDictationReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  finalTranscript: string;
  interimTranscript: string;
  permissionError: string | null;
  toggle: () => Promise<void>;
}

export function useDictation(): UseDictationReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [permissionError, setPermissionError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';

    recognition.onstart = () => {
      isListeningRef.current = true;
      setIsListening(true);
      setPermissionError(null);
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      if (final) {
        setFinalTranscript(prev => prev + final);
        setInterimTranscript('');
      } else {
        setInterimTranscript(interim);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Error en reconocimiento de voz:', event.error);
      isListeningRef.current = false;
      setIsListening(false);
      
      if (event.error === 'not-allowed' || event.error === 'no-speech') {
        setPermissionError('Permisos de micrófono denegados o no se detectó voz.');
      } else {
        setPermissionError(`Error: ${event.error}`);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current && isListeningRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggle = useCallback(async () => {
    if (!recognitionRef.current || !isSupported) {
      setPermissionError('El reconocimiento de voz no está disponible.');
      return;
    }

    try {
      if (isListeningRef.current) {
        recognitionRef.current.stop();
        isListeningRef.current = false;
        setIsListening(false);
      } else {
        setFinalTranscript('');
        setInterimTranscript('');
        setPermissionError(null);
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error al alternar reconocimiento de voz:', error);
      setPermissionError('Error al iniciar el reconocimiento de voz.');
    }
  }, [isSupported]);

  return {
    isSupported,
    isListening,
    transcript: finalTranscript + interimTranscript,
    finalTranscript,
    interimTranscript,
    permissionError,
    toggle,
  };
}

// Extender Window interface para TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

