# INICIALIZACIÓN DEL SCROLL EN (0, 0)

## 📋 IMPLEMENTACIÓN

Se ha actualizado la lógica del componente `Canvas` para asegurar que **el tablero siempre se inicie en scroll (0, 0)**, es decir, en la esquina superior izquierda.

---

## 🔧 CAMBIOS REALIZADOS

### 1. **Función Helper `forceScrollToOrigin`**

Se creó una función helper reutilizable que fuerza el scroll a (0, 0):

```typescript
const forceScrollToOrigin = useCallback((container: HTMLDivElement) => {
  container.scrollLeft = 0;
  container.scrollTop = 0;
  // Verificación adicional usando scrollTo si la asignación directa no funcionó
  if (container.scrollLeft !== 0 || container.scrollTop !== 0) {
    container.scrollTo(0, 0);
  }
}, []);
```

**Ventajas**:
- Reutilizable en múltiples lugares
- Doble verificación para asegurar que se aplica
- Usa tanto asignación directa como `scrollTo()` como fallback

### 2. **Actualización de `goToHome`**

La función `goToHome` ahora también usa `forceScrollToOrigin`:

```typescript
const goToHome = useCallback(() => {
  const container = canvasContainerRef.current;
  if (!container) return;

  const newScale = isMobile ? 0.3 : 1.0;
  setScale(newScale);

  // Asegurar que el scroll siempre vaya a (0, 0)
  requestAnimationFrame(() => {
    if (container) {
      forceScrollToOrigin(container);
    }
  });
}, [isMobile, forceScrollToOrigin]);
```

**Cambios**:
- Usa la escala correcta según dispositivo (`isMobile ? 0.3 : 1.0`)
- Usa `forceScrollToOrigin` para garantizar scroll a (0, 0)

### 3. **Mejora del `useEffect` de Inicialización**

El `useEffect` que se ejecuta cuando cambia `board.id` ahora es más robusto:

```typescript
useEffect(() => {
  const container = canvasContainerRef.current;
  if (!container) return;

  // Inicializar escala según dispositivo
  const initialScale = isMobile ? 0.3 : 1.0;
  setScale(initialScale);

  // Forzar scroll a (0, 0) - esquina superior izquierda
  // Ejecutar inmediatamente
  forceScrollToOrigin(container);
  
  // También usar requestAnimationFrame para asegurar que se ejecute después del render
  requestAnimationFrame(() => {
    if (container) {
      forceScrollToOrigin(container);
    }
  });

  // Verificación adicional después de un pequeño delay para asegurar que se mantiene
  const timeoutId = setTimeout(() => {
    if (container && (container.scrollLeft !== 0 || container.scrollTop !== 0)) {
      forceScrollToOrigin(container);
    }
  }, 100);

  return () => {
    clearTimeout(timeoutId);
  };
}, [board.id, isMobile, forceScrollToOrigin]);
```

**Características**:
- **Triple verificación**: Ejecuta `forceScrollToOrigin` inmediatamente, en `requestAnimationFrame`, y después de 100ms
- **Limpieza**: Limpia el timeout en el cleanup
- **Dependencias**: Incluye `forceScrollToOrigin` en las dependencias

---

## 🎯 COMPORTAMIENTO ESPERADO

### Al Cargar un Tablero:
1. El scroll se inicializa en **(0, 0)** - esquina superior izquierda
2. La escala se establece según el dispositivo:
   - **Móvil**: `0.3` (30%)
   - **Desktop**: `1.0` (100%)

### Al Usar "Ir al Inicio" (`goToHome`):
1. La escala se restablece según el dispositivo
2. El scroll se mueve a **(0, 0)** - esquina superior izquierda

### Verificaciones Múltiples:
- **Inmediata**: Al montar el componente
- **Después del render**: En `requestAnimationFrame`
- **Verificación final**: Después de 100ms para asegurar que se mantiene

---

## ✅ GARANTÍAS

1. **Siempre inicia en (0, 0)**: No importa qué tablero se cargue, siempre comenzará en la esquina superior izquierda
2. **Robustez**: Triple verificación asegura que el scroll se establezca correctamente incluso si hay delays en el renderizado
3. **Consistencia**: Tanto la inicialización como `goToHome` usan la misma lógica
4. **Limpieza**: El timeout se limpia correctamente para evitar memory leaks

---

## 🔍 ARCHIVOS MODIFICADOS

- `src/components/canvas/canvas.tsx`
  - Función `forceScrollToOrigin` agregada
  - `goToHome` actualizado
  - `useEffect` de inicialización mejorado

---

## 📝 NOTAS TÉCNICAS

### ¿Por qué triple verificación?

1. **Inmediata**: Para casos donde el contenedor ya está disponible
2. **requestAnimationFrame**: Para asegurar que se ejecute después del render del DOM
3. **Timeout 100ms**: Para casos donde hay delays adicionales en la inicialización del scroll

### ¿Por qué usar tanto `scrollLeft/scrollTop` como `scrollTo()`?

- `scrollLeft` y `scrollTop` son más directos y rápidos
- `scrollTo()` es más confiable en algunos navegadores
- La combinación asegura compatibilidad máxima

---

## 🚀 RESULTADO

Ahora el tablero **SIEMPRE** se inicia en scroll **(0, 0)**, garantizando una experiencia consistente para el usuario, independientemente del tablero que cargue o del dispositivo que use.

