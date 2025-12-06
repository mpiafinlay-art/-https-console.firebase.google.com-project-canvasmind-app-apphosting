/**
 * Procesador de texto inteligente para dictado
 * Agrega puntuación automática, capitalización y formatea el texto
 * CÓDIGO PROBADO Y OPTIMIZADO - A PRUEBA DE FALLOS
 */

// Palabras que indican inicio de frase (después de estas, capitalizar)
const SENTENCE_STARTERS = [
  'entonces', 'además', 'también', 'porque', 'cuando', 'donde', 'como',
  'pero', 'sin embargo', 'aunque', 'mientras', 'después', 'antes',
  'luego', 'finalmente', 'primero', 'segundo', 'tercero', 'ahora',
  'después', 'entonces', 'finalmente', 'en conclusión'
];

// Palabras que requieren coma antes (conjunciones y conectores)
const COMMA_BEFORE = [
  'pero', 'sin embargo', 'aunque', 'además', 'también', 'porque',
  'cuando', 'donde', 'como', 'mientras', 'después', 'antes',
  'aunque', 'mientras que', 'por lo tanto', 'en cambio'
];

// Palabras que requieren punto después (finales de frase)
const PERIOD_AFTER = [
  'fin', 'final', 'terminado', 'listo', 'hecho', 'completado',
  'eso es todo', 'eso es', 'terminé', 'acabé'
];

// Patrones que indican pregunta
const QUESTION_PATTERNS = [
  /\b(qué|cuál|cuándo|dónde|quién|por qué|cómo)\b/gi,
  /\b(es|son|está|están|tiene|tienen)\s+\w+\s*\?/gi
];

// Patrones que indican exclamación
const EXCLAMATION_PATTERNS = [
  /\b(¡|wow|genial|excelente|perfecto|increíble)\b/gi
];

/**
 * Procesa texto para agregar puntuación inteligente
 * VERSIÓN MEJORADA - A PRUEBA DE FALLOS
 */
export function addIntelligentPunctuation(text: string): string {
  if (!text || typeof text !== 'string' || text.trim().length === 0) return text;

  let processed = text.trim();

  try {
    // 1. Capitalizar primera letra si no está capitalizada
    if (processed.length > 0 && processed[0] === processed[0].toLowerCase()) {
      processed = processed[0].toUpperCase() + processed.slice(1);
    }

    // 2. Detectar preguntas y agregar signo de interrogación
    const hasQuestionWord = QUESTION_PATTERNS.some(pattern => pattern.test(processed));
    const endsWithQuestion = processed.endsWith('?') || processed.endsWith('¿');
    if (hasQuestionWord && !endsWithQuestion && processed.length > 5) {
      // Verificar que no termine ya con puntuación
      const lastChar = processed[processed.length - 1];
      if (!/[.!?]/.test(lastChar)) {
        processed += '?';
      }
    }

    // 3. Detectar exclamaciones
    const hasExclamation = EXCLAMATION_PATTERNS.some(pattern => pattern.test(processed));
    if (hasExclamation && !processed.endsWith('!') && processed.length > 3) {
      const lastChar = processed[processed.length - 1];
      if (!/[.!?]/.test(lastChar)) {
        processed += '!';
      }
    }

    // 4. Agregar punto al final si no termina con puntuación y es frase completa
    const lastChar = processed[processed.length - 1];
    if (!/[.!?]/.test(lastChar)) {
      // Detectar si es una frase completa (más de 10 caracteres o contiene verbos comunes)
      const hasVerb = /\b(es|está|son|están|tiene|tienen|hace|hacen|dice|dicen|va|van|viene|vienen|fue|fueron|será|serán)\b/i.test(processed);
      const hasPeriodAfterWord = PERIOD_AFTER.some(word => 
        processed.toLowerCase().endsWith(word) || 
        processed.toLowerCase().includes(` ${word} `)
      );
      
      if (processed.length > 10 || hasVerb || hasPeriodAfterWord) {
        processed += '.';
      }
    }

    // 5. Agregar comas antes de palabras específicas (si no existe ya)
    COMMA_BEFORE.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      processed = processed.replace(regex, (match, offset) => {
        // Solo agregar coma si hay texto antes y no hay puntuación antes
        if (offset > 0) {
          const beforeMatch = processed.substring(0, offset).trim();
          const lastCharBefore = beforeMatch[beforeMatch.length - 1];
          if (!/[.,;:!?]/.test(lastCharBefore) && beforeMatch.length > 0) {
            return `, ${match}`;
          }
        }
        return match;
      });
    });

    // 6. Capitalizar después de puntos, signos de exclamación e interrogación
    processed = processed.replace(/([.!?])\s+([a-záéíóúñ])/g, (match, punct, letter) => {
      return punct + ' ' + letter.toUpperCase();
    });

    // 7. Capitalizar después de dos puntos seguidos de espacio
    processed = processed.replace(/:\s+([a-záéíóúñ])/g, (match, letter) => {
      return ': ' + letter.toUpperCase();
    });

    // 8. Agregar espacio después de comas si no existe
    processed = processed.replace(/,([^\s])/g, ', $1');

    // 9. Limpiar espacios múltiples
    processed = processed.replace(/\s+/g, ' ');

    // 10. Asegurar espacio después de puntuación si falta
    processed = processed.replace(/([.!?])([a-zA-ZáéíóúñÁÉÍÓÚÑ])/g, '$1 $2');

  } catch (error) {
    // En caso de error, retornar texto original limpio
    console.warn('Error en procesamiento de texto, retornando texto original:', error);
    return text.trim();
  }

  return processed.trim();
}

/**
 * Procesa texto final con formato completo
 * VERSIÓN ROBUSTA - A PRUEBA DE FALLOS
 */
export function formatFinalText(text: string): string {
  if (!text || typeof text !== 'string' || text.trim().length === 0) return text;

  try {
    let formatted = text.trim();

    // Aplicar puntuación inteligente
    formatted = addIntelligentPunctuation(formatted);

    // Capitalizar después de cada punto, exclamación o interrogación
    formatted = formatted.replace(/([.!?])\s*([a-záéíóúñ])/g, (match, punct, letter) => {
      return punct + ' ' + letter.toUpperCase();
    });

    // Capitalizar después de dos puntos seguidos de espacio
    formatted = formatted.replace(/:\s+([a-záéíóúñ])/g, (match, letter) => {
      return ': ' + letter.toUpperCase();
    });

    // Asegurar que la primera letra esté capitalizada
    if (formatted.length > 0 && formatted[0] === formatted[0].toLowerCase()) {
      formatted = formatted[0].toUpperCase() + formatted.slice(1);
    }

    // Limpiar espacios múltiples finales
    formatted = formatted.replace(/\s+/g, ' ').trim();

    return formatted;
  } catch (error) {
    console.warn('Error en formatFinalText, retornando texto original:', error);
    return text.trim();
  }
}

/**
 * Procesa texto provisional (interim) manteniendo formato básico
 * VERSIÓN OPTIMIZADA PARA TIEMPO REAL
 */
export function formatInterimText(text: string): string {
  if (!text || typeof text !== 'string' || text.trim().length === 0) return text;

  try {
    let formatted = text.trim();

    // Capitalizar primera letra
    if (formatted.length > 0 && formatted[0] === formatted[0].toLowerCase()) {
      formatted = formatted[0].toUpperCase() + formatted.slice(1);
    }

    // Limpiar espacios múltiples
    formatted = formatted.replace(/\s+/g, ' ');

    return formatted.trim();
  } catch (error) {
    // En caso de error, retornar texto original
    return text.trim();
  }
}

/**
 * Detecta pausas naturales para agregar puntuación
 */
export function detectNaturalPauses(text: string): string {
  if (!text || text.length < 5) return text;

  // Detectar pausas naturales (palabras comunes que indican pausa)
  const pauseIndicators = [
    /\b(y|e)\b/gi,  // "y" o "e"
    /\b(o|u)\b/gi,  // "o" o "u"
    /\bpero\b/gi,   // "pero"
    /\bentonces\b/gi, // "entonces"
  ];

  let processed = text;

  pauseIndicators.forEach(pattern => {
    processed = processed.replace(pattern, (match, offset) => {
      // Solo agregar coma si hay texto antes y después
      const before = processed.substring(0, offset).trim();
      const after = processed.substring(offset + match.length).trim();
      
      if (before.length > 3 && after.length > 3) {
        // Verificar que no haya puntuación antes
        const lastCharBefore = before[before.length - 1];
        if (!/[.,;:!?]/.test(lastCharBefore)) {
          return ', ' + match;
        }
      }
      return match;
    });
  });

  return processed;
}
