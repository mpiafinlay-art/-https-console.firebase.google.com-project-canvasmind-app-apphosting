# ⚠️ Problema Detectado: Doble Sistema de Autenticación

**Fecha**: $(date)  
**Estado**: ⚠️ **PROBLEMA IDENTIFICADO**

---

## 🐛 Problema

Hay **DOS sistemas de autenticación** ejecutándose simultáneamente:

1. **`FirebaseClientProvider`** - Sistema principal (en `src/firebase/client-provider.tsx`)
2. **`AuthProvider`** - Sistema adicional (en `src/context/AuthContext.tsx`)

Ambos están activos en `src/components/providers.tsx`:

```typescript
<FirebaseClientProvider>
  <AuthProvider>  {/* ← Segundo sistema de auth */}
    {/* ... */}
  </AuthProvider>
</FirebaseClientProvider>
```

---

## 🔍 Análisis

### 1. `FirebaseClientProvider` (Sistema Principal)

**Ubicación**: `src/firebase/client-provider.tsx`

**Funcionalidad**:
- ✅ Inicializa Firebase (Auth, Firestore, Storage)
- ✅ Maneja `onAuthStateChanged`
- ✅ Exporta hooks: `useUser`, `useAuth`, `useFirestore`, `useStorage`
- ✅ Detecta usuarios anónimos
- ✅ Maneja redirects de Google

**Hooks disponibles**:
- `useUser()` - Usuario actual
- `useAuth()` - Instancia de Auth
- `useFirestore()` - Instancia de Firestore
- `useStorage()` - Instancia de Storage

---

### 2. `AuthProvider` (Sistema Adicional)

**Ubicación**: `src/context/AuthContext.tsx`

**Funcionalidad**:
- ⚠️ Inicializa Auth usando `app` de `config.ts`
- ⚠️ Maneja `onAuthStateChanged` (duplicado)
- ⚠️ Exporta hook: `useAuth()`

**Hooks disponibles**:
- `useAuth()` - Contexto de autenticación (diferente al de FirebaseClientProvider)

---

## ⚠️ Conflictos Potenciales

### 1. **Doble inicialización de Auth**
- `FirebaseClientProvider` inicializa Auth
- `AuthProvider` también inicializa Auth (usando `app` de `config.ts`)
- Ambos escuchan `onAuthStateChanged`

### 2. **Hooks con el mismo nombre**
- `FirebaseClientProvider` exporta `useAuth()` (retorna `Auth`)
- `AuthProvider` exporta `useAuth()` (retorna `{ user, loading }`)
- Dependiendo de qué se importe, puede haber confusión

### 3. **Estado duplicado**
- `FirebaseClientProvider` mantiene estado de usuario
- `AuthProvider` mantiene su propio estado de usuario
- Pueden estar desincronizados

---

## 🔍 Verificación de Uso

### `FirebaseClientProvider` se usa en:
- ✅ `src/app/home-page-content.tsx` - usa `useUser`, `useAuth`, `useFirestore`
- ✅ `src/app/board/[boardId]/page.tsx` - usa `useUser`
- ✅ Todos los componentes principales

### `AuthProvider` se usa en:
- ❓ Necesito verificar si algún componente usa `useAuth` de `AuthContext`

---

## 🎯 Solución Recomendada

### Opción 1: Eliminar `AuthProvider` (Recomendado)

Si `FirebaseClientProvider` ya maneja todo, `AuthProvider` es redundante:

1. Eliminar `src/context/AuthContext.tsx`
2. Eliminar `AuthProvider` de `src/components/providers.tsx`
3. Verificar que ningún componente use `useAuth` de `AuthContext`

### Opción 2: Mantener solo `AuthProvider`

Si `AuthProvider` es necesario, eliminar la lógica duplicada de `FirebaseClientProvider`.

---

## 📋 Próximos Pasos

1. **Verificar uso de `AuthProvider`**:
   - Buscar todos los imports de `useAuth` de `AuthContext`
   - Verificar si se está usando realmente

2. **Decidir qué mantener**:
   - Si `FirebaseClientProvider` es suficiente → Eliminar `AuthProvider`
   - Si `AuthProvider` es necesario → Refactorizar para evitar duplicación

3. **Limpiar código**:
   - Eliminar código no usado
   - Consolidar en un solo sistema

---

**⚠️ Problema identificado: Doble sistema de autenticación puede causar conflictos!**

