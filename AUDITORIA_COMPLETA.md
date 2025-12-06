# 🔍 AUDITORÍA COMPLETA - CanvasMind App

## ✅ ARREGLOS COMPLETADOS:

1. ✅ **finalTranscript/interimTranscript** - Props agregados a CommonElementProps
2. ✅ **Acordeón tamaño** - Reducido a 320x240px (20% más pequeño)
3. ✅ **Acordeón paleta colores** - TwitterPicker agregado
4. ✅ **Exportar PNG** - Scale aumentado a 4x
5. ✅ **boardStore orderBy** - Fallback sin orderBy agregado
6. ✅ **Redirección tableros** - Lógica mejorada con espera de usuario
7. ✅ **Force logout** - Solo se ejecuta cuando corresponde

## 🔴 PROBLEMAS CRÍTICOS PENDIENTES:

### 1. **ACORDEÓN - MÚLTIPLES FALLAS**
- ❌ No se puede arrastrar
- ❌ Cursor vuelve al inicio después de pausa
- ❌ No se puede dictar
- ❌ No se guarda automáticamente

### 2. **EXPORTAR PNG TABLERO**
- ❌ Debe exportar solo el área visible del usuario
- ❌ Usar lógica de exportar PNG de cuadernos
- ❌ Disminuir tamaño en 30%

### 3. **MENÚ FORMATO**
- ❌ Borrar botón lupa
- ❌ Botón pincel: color desaparece, vuelve a negro
- ❌ Botón alinear: debe ser un solo botón con desplegable
- ❌ Botón enlace: debe abrir campo de texto para escribir URL

### 4. **CAMPOS EDITABLES - PROBLEMA CRÍTICO**
- ❌ Cursor vuelve al inicio después de pausa (TODOS los campos)
- ❌ Problema en escritura y dictado

### 5. **MENÚ PRINCIPAL - BOTÓN TEXTO**
- ❌ Debe tener paleta de color para fondo (iniciar blanco)
- ❌ Debe poder arrastrarse
- ❌ Borrar botón columna

### 6. **AUTOGUARDADO**
- ❌ Verificar que todos los elementos se guarden automáticamente
- ❌ Verificar autoguardado del tablero

### 7. **ELEMENTO LIENZO/CONTENEDOR**
- ❌ No detecta cuadernos para guardar
- ❌ Error al desanclar: "Unsupported field value: undefined"

## 📊 ARCHIVOS A REVISAR:

- `src/components/canvas/elements/accordion-element.tsx` - Arrastrar, cursor, dictado
- `src/components/canvas/formatting-toolbar.tsx` - Menú formato
- `src/hooks/use-auto-save.ts` - Autoguardado
- `src/components/canvas/elements/container-element.tsx` - Desanclar elementos
- `src/app/board/[boardId]/page.tsx` - Exportar PNG tablero
- `src/components/canvas/tools-sidebar.tsx` - Botón texto, columna
- `src/lib/dictation-helper.ts` - Cursor en campos editables

## 🎯 PRIORIDAD:

1. **URGENTE**: Cursor vuelve al inicio (todos los campos editables)
2. **ALTA**: Acordeón no funciona (arrastrar, dictado, guardado)
3. **ALTA**: Exportar PNG tablero
4. **MEDIA**: Menú formato
5. **MEDIA**: Autoguardado
6. **BAJA**: Botón texto paleta
