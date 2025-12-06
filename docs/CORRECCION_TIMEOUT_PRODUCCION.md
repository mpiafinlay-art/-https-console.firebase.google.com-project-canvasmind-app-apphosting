# Corrección del Timeout en Producción

## Problema Identificado

El sitio en producción (https://canvasmind-app.web.app/) se quedaba atascado mostrando "Cargando..." indefinidamente.

**Causa**: Si Firebase no se inicializa correctamente o tarda demasiado, el código nunca sale del estado de carga porque la condición `if (isUserLoading || isRedirecting || !firestore || !auth)` nunca se resuelve.

## Solución Implementada

Se agregó un **timeout de seguridad de 5 segundos** que fuerza mostrar la página de login si Firebase no se inicializa a tiempo.

### Cambios Realizados

1. **Nuevo estado**: `firebaseInitTimeout` para rastrear si el timeout se activó
2. **useEffect con timeout**: Después de 5 segundos, si Firebase no está listo, fuerza mostrar login
3. **Condición actualizada**: La pantalla de carga ahora verifica `!firebaseInitTimeout` antes de mostrar el loading

### Código Agregado

```typescript
const [firebaseInitTimeout, setFirebaseInitTimeout] = useState(false);

// Timeout de seguridad: Si Firebase no se inicializa en 5 segundos, mostrar login
useEffect(() => {
  if (!isMounted) return;
  
  const timeout = setTimeout(() => {
    console.warn('⚠️ Timeout de seguridad: Firebase no se inicializó en 5 segundos, mostrando login');
    setFirebaseInitTimeout(true);
    setIsRedirecting(false);
  }, 5000);

  return () => clearTimeout(timeout);
}, [isMounted]);
```

### Condición Actualizada

```typescript
// Antes:
if (isUserLoading || isRedirecting || !firestore || !auth) {
  return <LoadingScreen />;
}

// Después:
if (!firebaseInitTimeout && (isUserLoading || isRedirecting || !firestore || !auth)) {
  return <LoadingScreen />;
}
```

## Resultado

✅ Si Firebase se inicializa normalmente (< 5 segundos): Funciona como antes  
✅ Si Firebase falla o tarda demasiado (> 5 segundos): Muestra la página de login automáticamente  
✅ El usuario nunca se queda atascado en "Cargando..."

## Próximos Pasos

1. Hacer commit de estos cambios
2. Hacer push al repositorio para que Firebase App Hosting despliegue automáticamente
3. Verificar que el sitio en producción ahora muestre la página de login después de máximo 5 segundos

## Notas

- El timeout de 5 segundos es suficiente para la mayoría de casos normales
- Si Firebase se inicializa después del timeout, el usuario aún podrá hacer login normalmente
- Los logs en consola ayudarán a diagnosticar si hay problemas de inicialización

