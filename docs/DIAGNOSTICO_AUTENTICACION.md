# Diagnóstico de Autenticación con Google

## Problema Identificado
El login con Google no funciona. El usuario debe entrar como invitado.

## Análisis del Código Actual

### 1. Flujo de Autenticación
- `signInWithGoogle` usa `signInWithRedirect` ✅
- `getGoogleSignInResult` se llama en dos lugares:
  - `FirebaseClientProvider` (línea 64)
  - `HomePageContent` (línea 92)
  
**PROBLEMA POTENCIAL**: `getRedirectResult` solo puede llamarse UNA vez después de cada redirect. Si se llama dos veces, la segunda llamada devolverá `null`.

### 2. Configuración de Firebase
- Necesito verificar `config.ts` para ver si está correctamente configurado
- Necesito verificar que los dominios autorizados estén configurados

### 3. Flujo de Redirect
1. Usuario hace clic en "Iniciar Sesión con Google"
2. Se llama `signInWithRedirect` → Redirige a Google
3. Usuario selecciona cuenta → Google redirige de vuelta
4. `getRedirectResult` debe capturar el resultado
5. `onAuthStateChanged` debe detectar el cambio
6. `HomePageContent` debe redirigir al tablero

## Correcciones Necesarias

1. **Eliminar llamada duplicada a `getRedirectResult`**
   - Solo debe llamarse en `FirebaseClientProvider` ANTES de `onAuthStateChanged`
   - NO debe llamarse en `HomePageContent`

2. **Verificar configuración de Firebase**
   - Verificar que `apiKey`, `authDomain`, etc. estén correctos
   - Verificar que `authDomain` coincida con el dominio autorizado en Google Cloud

3. **Mejorar manejo de errores**
   - Capturar errores específicos de autenticación
   - Mostrar mensajes claros al usuario

4. **Verificar dominios autorizados**
   - `localhost:3000` debe estar autorizado para desarrollo
   - El dominio de producción debe estar autorizado

## Plan de Corrección

1. ✅ Leer `config.ts` para verificar configuración
2. ✅ Corregir llamada duplicada a `getRedirectResult`
3. ✅ Simplificar flujo de autenticación
4. ✅ Agregar logs detallados para debugging
5. ✅ Probar flujo completo

