# 🔍 PROCEDIMIENTO OBLIGATORIO DE TESTING

## ⚠️ IMPORTANTE: EJECUTAR ANTES DE CADA COMMIT O CAMBIO

Este procedimiento debe seguirse **SIEMPRE** antes de hacer `build` o `dev` después de cualquier cambio en el código.

---

## 📋 CHECKLIST OBLIGATORIO

### 1. ✅ Render Test del Componente Home

**Objetivo:** Verificar que la página principal se renderiza correctamente sin errores.

**Pasos:**
```bash
# 1. Verificar que el servidor de desarrollo inicia sin errores
npm run dev

# 2. Abrir http://localhost:3000 en el navegador
# 3. Verificar que:
#    - La página carga completamente
#    - No hay errores en la consola del navegador
#    - No hay errores en la terminal del servidor
#    - El componente HomePageContent se renderiza correctamente
```

**Archivos a verificar:**
- `src/app/page.tsx`
- `src/app/home-page-content.tsx`
- `src/app/layout.tsx`

**Errores comunes a detectar:**
- `TypeError: Cannot read properties of undefined`
- `Hydration errors`
- `Module not found` errors
- Errores de importación

---

### 2. ✅ Revisión de Imports, Rutas y Context Providers

**Objetivo:** Asegurar que todas las importaciones, rutas y providers están correctamente configurados.

**Checklist de Imports:**
- [ ] Todos los imports de componentes existen y están en las rutas correctas
- [ ] No hay imports circulares
- [ ] Los imports de tipos (`@/lib/types`) están actualizados
- [ ] Los imports de hooks (`@/hooks/...`) son correctos
- [ ] Los imports de componentes UI (`@/components/ui/...`) son válidos

**Checklist de Rutas:**
- [ ] Las rutas de Next.js están correctamente definidas
- [ ] Los archivos `page.tsx` existen en las rutas esperadas
- [ ] Los parámetros dinámicos (`[boardId]`) están correctamente tipados
- [ ] Las rutas de navegación (`router.push`, `router.replace`) son válidas

**Checklist de Context Providers:**
- [ ] `FirebaseClientProvider` está correctamente configurado
- [ ] `AuthProvider` está presente y funcional
- [ ] `NextThemesProvider` está configurado
- [ ] `TooltipProvider` está presente
- [ ] El orden de los providers es correcto (ver `src/components/providers.tsx`)

**Archivos críticos a revisar:**
- `src/components/providers.tsx`
- `src/firebase/client-provider.tsx`
- `src/context/AuthContext.tsx` (si existe)
- `src/app/layout.tsx`

**Comando de verificación:**
```bash
# Verificar que no hay errores de importación
npm run build 2>&1 | grep -E "(Cannot find|Module not found|Failed to resolve)"
```

---

### 3. ✅ Verificación del Estado Global y Props Requeridas

**Objetivo:** Asegurar que el estado global (Zustand, Context) y las props están correctamente definidas.

**Checklist de Estado Global (Zustand):**
- [ ] `useBoardStore` está correctamente inicializado
- [ ] Los selectores del store funcionan correctamente
- [ ] Las acciones del store (`loadBoard`, `updateElement`, etc.) están disponibles
- [ ] No hay errores de "Cannot read properties of undefined" relacionados con el store

**Checklist de Props Requeridas:**
- [ ] Todos los componentes reciben las props necesarias
- [ ] Las props opcionales tienen valores por defecto
- [ ] Los tipos de props (`CommonElementProps`, etc.) están actualizados
- [ ] No hay props faltantes que causen errores en runtime

**Archivos críticos a revisar:**
- `src/lib/store/boardStore.ts`
- `src/lib/types.ts` (interfaces de props)
- Componentes que usan `CommonElementProps`

**Verificación de tipos:**
```bash
# Verificar tipos TypeScript
npm run build 2>&1 | grep -E "(Type error|Property.*does not exist|is missing)"
```

---

## 🚀 PROCESO COMPLETO ANTES DE BUILD O DEV

### Paso 0: Limpieza Inicial (SI HAY ERRORES 404)

**⚠️ IMPORTANTE**: Si ves errores 404 de archivos estáticos, ejecuta primero:

```bash
# Opción 1: Usar el script de limpieza
./scripts/clean-and-restart.sh

# Opción 2: Limpieza manual
pkill -f "next dev"
lsof -ti:3000 | xargs kill -9 2>/dev/null
rm -rf .next
```

**Documentación completa**: Ver `docs/SOLUCION_404_ESTATICOS.md`

### Paso 1: Verificación Estática
```bash
# 1. Verificar linter
npm run lint

# 2. Verificar tipos TypeScript
npm run build 2>&1 | grep -E "(error|Error|ERROR)" | head -20
```

### Paso 2: Render Test Manual
```bash
# 1. Iniciar servidor de desarrollo
npm run dev

# 2. Abrir navegador en http://localhost:3000
# 3. Verificar:
#    - Página carga sin errores
#    - Consola del navegador sin errores críticos
#    - Funcionalidad básica funciona (login, navegación)
```

### Paso 3: Verificación de Componentes Críticos
- [ ] Home page se renderiza
- [ ] Login funciona
- [ ] Redirección a board funciona
- [ ] Canvas se carga correctamente
- [ ] Elementos se renderizan sin errores

### Paso 4: Build Final
```bash
# Solo después de pasar todos los checks anteriores
npm run build
```

---

## 📝 TEMPLATE DE VERIFICACIÓN RÁPIDA

Copia y pega esto después de cada cambio importante:

```markdown
## Verificación Post-Cambio - [FECHA]

### ✅ Render Test Home
- [ ] Servidor inicia sin errores
- [ ] Página principal carga correctamente
- [ ] No hay errores en consola del navegador

### ✅ Imports y Rutas
- [ ] Todos los imports son válidos
- [ ] No hay imports circulares
- [ ] Rutas de Next.js funcionan
- [ ] Context providers están correctos

### ✅ Estado Global y Props
- [ ] Store de Zustand funciona
- [ ] Props requeridas están presentes
- [ ] Tipos TypeScript son correctos

### ✅ Build
- [ ] `npm run build` completa sin errores
- [ ] No hay warnings críticos
```

---

## 🔗 ARCHIVOS RELACIONADOS

- **Componente Home:** `src/app/page.tsx`, `src/app/home-page-content.tsx`
- **Providers:** `src/components/providers.tsx`, `src/firebase/client-provider.tsx`
- **Store Global:** `src/lib/store/boardStore.ts`
- **Tipos:** `src/lib/types.ts`
- **Layout:** `src/app/layout.tsx`

---

## ⚠️ RECORDATORIO

**NUNCA hacer commit o push sin completar este checklist.**

**NUNCA hacer `npm run build` o `npm run dev` sin verificar primero los puntos críticos.**

---

**Última actualización:** 4 de Diciembre 2024  
**Estado:** ✅ **ACTIVO - OBLIGATORIO**

