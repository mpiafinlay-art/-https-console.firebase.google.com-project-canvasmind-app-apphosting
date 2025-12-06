# Manual de Funcionalidad de Dictado - 4 de Diciembre 2024

## 📝 Uso de la Función Dictar

**Referencia:** Readme_App18 (64-68)

**Dictar:**
1. **Haz clic** en cualquier lugar donde se pueda escribir (un cuaderno, una nota, etc.).
2. Haz clic en el icono `Mic`. El botón se volverá rojo.
3. Comienza a hablar. El texto aparecerá donde estaba tu cursor.
4. Vuelve a hacer clic en el icono `Mic` para detener el dictado.

**Nota Importante:** En todos los elementos que tengan campos de texto o input se puede usar la función dictar.

---

## 🎯 Plan Detallado: Botón de Dictado Perfecto en React

Para seguir las mejores prácticas de React, no pondremos toda la lógica directamente en el componente de la interfaz. En su lugar, crearemos un Hook personalizado (`useDictation`). Esto hace que toda la lógica de dictado sea completamente independiente y reutilizable en cualquier parte de tu aplicación.

---

## Paso 1: El Corazón de la Lógica - El Hook useDictation

Este hook encapsulará toda la complejidad de la Web Speech API.

**Crea una carpeta `src/hooks` en tu proyecto si no existe.**

**Dentro, crea un archivo llamado `useDictation.js`.**

### `src/hooks/useDictation.js`

```javascript
import { useState, useRef, useEffect, useCallback } from 'react';

// 1. Verificamos si el navegador soporta la API una sola vez al cargar el archivo.
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const isSupported = !!SpeechRecognition;

export const useDictation = () => {
  // 2. Definimos los estados que nuestro hook manejará.
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(''); // El último fragmento de texto FINAL
  const [interimTranscript, setInterimTranscript] = useState(''); // La VISTA PREVIA en tiempo real
  
  // Usamos useRef para mantener una instancia persistente del objeto de reconocimiento.
  const recognitionRef = useRef(null);

  // 3. useEffect se encarga de configurar y limpiar la API.
  useEffect(() => {
    if (!isSupported) {
      console.warn('El reconocimiento de voz no es compatible con este navegador.');
      return;
    }

    // Creamos la instancia y la configuramos.
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Sigue escuchando incluso después de pausas.
    recognition.lang = 'es-ES';      // Idioma español.
    recognition.interimResults = true; // ¡Esta es la clave para la vista previa en tiempo real!

    recognitionRef.current = recognition;

    // 4. Configuramos el manejador de eventos 'onresult'.
    // Este evento se dispara cada vez que el motor de reconocimiento tiene un resultado.
    recognition.onresult = (event) => {
      let final = '';
      let interim = '';
      
      // Iteramos sobre los resultados para separar el texto final del de vista previa.
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      
      setInterimTranscript(interim); // Actualizamos el estado de la vista previa.
      setTranscript(final); // Actualizamos el estado del texto final.
    };
    
    // 5. Manejadores para errores y fin de la escucha.
    recognition.onerror = (event) => {
      console.error('Error en el reconocimiento de voz:', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript(''); // Limpiamos la vista previa al detener.
    };

    // 6. Función de limpieza: se ejecuta cuando el componente que usa el hook se desmonta.
    return () => {
      recognition.stop();
    };
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez.

  // 7. Creamos funciones para iniciar y detener, envueltas en useCallback para optimizar.
  const start = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  // 8. Devolvemos una API limpia desde nuestro hook.
  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    start,
    stop,
  };
};
```

### Explicación Detallada del Hook:

- **`isSupported`**: Una bandera simple para saber si el navegador es compatible.
- **`transcript` vs `interimTranscript`**: Esta separación es crucial. `interimTranscript` se actualiza constantemente mientras hablas (la vista previa). `transcript` solo se actualiza cuando haces una pausa y el motor confirma una frase.
- **`useRef`**: Es perfecto para guardar la instancia de `recognition` porque esta no debe cambiar con cada renderizado y no queremos que su creación dispare un nuevo renderizado.
- **`useEffect` con `[]`**: Garantiza que la configuración de la API se realice una sola vez, evitando crear múltiples listeners. La función de retorno es la clave para evitar fugas de memoria.

---

## Paso 2: La Interfaz de Usuario - Integrando el Hook

Ahora que la lógica está encapsulada, usarla en nuestra interfaz es muy sencillo y limpio.

**Crea un archivo `src/App.jsx`.**

### `src/App.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { useDictation } from './hooks/useDictation';
import './App.css';

// Componente SVG para el ícono del micrófono
const MicrophoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>
);

function App() {
  // Estado para el contenido completo y permanente del editor.
  const [editorText, setEditorText] = useState('');

  // 1. Usamos nuestro hook personalizado.
  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    start,
    stop,
  } = useDictation();

  // 2. Este efecto se ejecuta cada vez que 'transcript' (el texto final) cambia.
  useEffect(() => {
    if (transcript) {
      // Añadimos el nuevo fragmento de texto al contenido ya existente.
      setEditorText(prevText => prevText + transcript + ' ');
    }
  }, [transcript]);

  // 3. Si el navegador no es compatible, mostramos un mensaje claro.
  if (!isSupported) {
    return <div className="unsupported">Lo sentimos, tu navegador no soporta el dictado por voz.</div>;
  }
  
  // 4. ¡LA MAGIA DE LA VISTA PREVIA!
  // El valor que mostramos en el textarea es la combinación del texto ya guardado
  // más la vista previa en tiempo real.
  const displayValue = `${editorText}${interimTranscript}`;

  return (
    <div className="container">
      <h1>Cuaderno Virtual con Dictado</h1>
      
      <div className="toolbar">
        <button 
          onClick={isListening ? stop : start}
          className={`toolbar-button ${isListening ? 'recording' : ''}`}
          title={isListening ? 'Detener dictado' : 'Iniciar dictado'}
        >
          <MicrophoneIcon />
          <span>{isListening ? 'Escuchando...' : 'Dictar'}</span>
        </button>
      </div>

      <textarea
        className="editor"
        value={displayValue}
        onChange={(e) => setEditorText(e.target.value)}
        rows="15"
        placeholder="Haz clic en 'Dictar' y empieza a hablar..."
      />
    </div>
  );
}

export default App;
```

### Explicación Detallada de la Interfaz:

- El componente `App` no sabe nada sobre la Web Speech API. Solo consume el hook `useDictation`, lo que lo mantiene limpio y enfocado en la presentación.
- El `useEffect` que observa `transcript` actúa como un "pegamento", tomando el texto finalizado del dictado y añadiéndolo al estado principal del editor.
- La variable `displayValue` es la clave de todo. Al renderizar, siempre muestra el contenido estable (`editorText`) seguido de la vista previa (`interimTranscript`), creando una experiencia fluida y sin parpadeos.

---

## Paso 3: El Toque Final - Estilos y Feedback de UX

Una buena interfaz debe comunicar su estado claramente.

**Crea el archivo `src/App.css`.**

### `src/App.css`

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f4f4f5;
  color: #18181b;
  margin: 0;
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.toolbar {
  margin-bottom: 1rem;
}

.editor {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  line-height: 1.6;
  border: 1px solid #d4d4d8;
  border-radius: 8px;
  box-sizing: border-box;
  resize: vertical;
}

.toolbar-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  border: 1px solid #d4d4d8;
  background-color: #ffffff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toolbar-button:hover {
  background-color: #f4f4f5;
}

/* === FEEDBACK VISUAL CLAVE === */
.toolbar-button.recording {
  background-color: #fee2e2; /* Rojo claro */
  color: #dc2626;          /* Rojo oscuro */
  border-color: #fca5a5;
  animation: pulse 1.5s infinite cubic-bezier(0.66, 0, 0, 1);
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
  70% { box-shadow: 0 0 0 12px rgba(220, 38, 38, 0); }
  100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
}

.unsupported {
  text-align: center;
  padding: 40px;
  background-color: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  color: #b45309;
}
```

---

## 📋 Resumen para Implementarlo sin Errores

### Estructura de Archivos:

```
src/
  App.jsx
  App.css
  hooks/
    useDictation.js
```

### Consideraciones Importantes:

1. **Permisos del Navegador**: La primera vez que un usuario haga clic en "Dictar", el navegador pedirá permiso para usar el micrófono. Tu aplicación no necesita gestionar esto, pero es bueno saber que ocurrirá.

2. **Contexto Seguro (HTTPS)**: La Web Speech API casi siempre requiere que tu sitio se sirva a través de HTTPS. Al desarrollar en `localhost`, esto suele funcionar sin problemas, pero al desplegarlo a producción, asegúrate de que sea en un dominio seguro o no funcionará.

3. **Compatibilidad del Navegador**: 
   - ✅ Chrome/Edge: Soporte completo
   - ✅ Safari: Soporte completo (requiere prefijo `webkit`)
   - ⚠️ Firefox: Soporte limitado
   - ❌ Opera: Sin soporte nativo

4. **Idioma**: El código está configurado para español (`es-ES`). Puedes cambiarlo según tus necesidades.

---

**Documento Generado**: 4 de Diciembre 2024  
**Estado**: ✅ **DOCUMENTACIÓN COMPLETA**

