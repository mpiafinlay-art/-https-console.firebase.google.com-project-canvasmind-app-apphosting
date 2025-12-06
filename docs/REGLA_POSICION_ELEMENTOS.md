# REGLA #1: POSICIÓN DE ELEMENTOS AL ABRIR

## 📋 REGLA ESTABLECIDA

**Cuando el usuario abre un elemento en su tablero, el elemento se abre exactamente en la posición visual en que se encuentra el usuario.**

## ✅ IMPLEMENTACIÓN

### Comportamiento Esperado
- Los elementos se abren **centrados** en el viewport del usuario
- El centro del elemento coincide con el centro del viewport visible
- Esto aplica a TODOS los tipos de elementos

### Tipos de Elementos Afectados
- ✅ Notas adhesivas (`sticky`)
- ✅ Listas de tareas (`todo`)
- ✅ Texto (`text`)
- ✅ Imágenes (`image`)
- ✅ Cuadernos (`notepad`, `notepad-simple`)
- ✅ Columnas (`column`)
- ✅ Comentarios (`comment`)
- ✅ Planificadores (`weekly-planner`, `planner-3`)
- ✅ Portales (`portal`)

## 🔧 IMPLEMENTACIÓN TÉCNICA

### Función Helper
Se creó una función helper `getCenteredPosition` que calcula la posición para centrar cualquier elemento:

```typescript
const getCenteredPosition = (width: number, height: number) => ({
  x: viewportCenter.x - (width / 2),
  y: viewportCenter.y - (height / 2)
});
```

### Cálculo del Viewport Center
El centro del viewport se calcula usando `getViewportCenter()`:

```typescript
const getViewportCenter = useCallback((): Point => {
  if (!canvasContainerRef.current) return { x: 200, y: 200 };
  const { scrollLeft, scrollTop, clientWidth, clientHeight } = canvasContainerRef.current;
  return { 
    x: (scrollLeft + clientWidth / 2) / scale, 
    y: (scrollTop + clientHeight / 2) / scale 
  };
}, [scale]);
```

### Ejemplo de Uso
```typescript
case 'sticky':
  const stickySize = { width: 224, height: 224 };
  const stickyPos = getCenteredPosition(stickySize.width, stickySize.height);
  // stickyPos.x y stickyPos.y ahora contienen la posición centrada
```

## 📍 COORDENADAS

- **Antes**: Los elementos se posicionaban con su esquina superior izquierda en el centro del viewport
- **Ahora**: Los elementos se posicionan de manera que su **centro** coincide con el centro del viewport

## 🎯 RESULTADO

Cuando un usuario:
1. Navega por el tablero (pan/zoom)
2. Hace clic en un botón para agregar un elemento
3. El elemento aparece **centrado** en su vista actual

Esto mejora significativamente la experiencia de usuario, ya que siempre puede ver inmediatamente el elemento que acaba de crear sin necesidad de buscarlo.

