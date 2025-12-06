# Lista de Instrucciones PIA - 4 de Diciembre

## Instrucción 1: Activar MODO AUTOMÁTICO SEGURO
**Fecha:** Inicio de sesión

**Instrucción completa:**
```
Activa MODO AUTOMÁTICO SEGURO. Las reglas son obligatorias y no puedes realizar ninguna acción que las infrinja. Revisa y repara la app archivo por archivo, de forma estrictamente secuencial. No saltar de archivos. No revisar varios a la vez. No modificar en paralelo. Antes de modificar un archivo, genera un diagnóstico interno. Si el diagnóstico indica riesgo de romper la app, NO modifiques. En vez de eso, usa una solución mínima o marca el archivo como 'pendiente para revisión manual'. Cada vez que termines un archivo, ejecuta automáticamente: Compilación. Verificación de imports. Validación de Home. Test de rutas básicas. Detección de side effects no intencionados. Si aparece un error, detén todo y auto-repara antes de continuar. Está prohibido avanzar con errores. No hagas refactors. No reescribas estructuras. No modifiques archivos no solicitados. No agregues dependencias nuevas. No elimines código salvo que sea 100% seguro y validado. Cada acción debe ser mínima, acotada, incremental y reversible. Está prohibido hacer cambios grandes o agresivos. Después de cada archivo, genera una copia interna del estado previo para poder revertir automáticamente si algo se rompe. Si en cualquier momento detectas riesgo de daño global, pausa el proceso, no continues y no toques más archivos. El proceso automático solo puede continuar si las validaciones pasaron al 100%. Si no, automáticamente se activa modo reparación y bloqueo de avance.
```

**Acción realizada:** Se activó el modo automático seguro y se comenzó la revisión secuencial de archivos.

---

## Instrucción 2: Reparar página de inicio y dictado
**Fecha:** Durante la sesión

**Instrucción completa:**
```
la pagina de inicio no carga. Dictado aun no funciona y no muestra tampoco el preview en tiempo real.FIX
```

**Acción realizada:**
- Se implementó un timeout de seguridad en `home-page-content.tsx` para asegurar que la UI de login se muestre después de máximo 2 segundos
- Se mejoró la lógica de dictado en `use-speech-recognition.ts` para enviar resultados interinos y finales
- Se creó el componente `DictationPreview` para mostrar el preview en tiempo real
- Se actualizó `handleTranscript` en `page.tsx` para manejar correctamente el preview

---

## Instrucción 3: Build
**Fecha:** Durante la sesión

**Instrucción completa:**
```
build
```

**Acción realizada:** Se ejecutó `npm run build` exitosamente.

---

## Instrucción 4: Preview no carga
**Fecha:** Durante la sesión

**Instrucción completa:**
```
preview no carga
```

**Acción realizada:** Se refinó la lógica de `handleTranscript` y `use-speech-recognition.ts` para asegurar que `liveTranscript` siempre se actualice, incluso con strings vacíos, para mantener la presencia visual del componente preview cuando el dictado está activo.

---

## Instrucción 5: Error de conexión localhost
**Fecha:** Durante la sesión

**Instrucción completa:**
```
no se puede acceder a la app No se puede acceder a este sitio localhost rechazó la conexión. Intenta: Comprobar la conexión. Comprobar el proxy y el firewall. ERR_CONNECTION_REFUSED
```

**Acción realizada:** 
- Se diagnosticó que el servidor de desarrollo no estaba corriendo
- Se ejecutó `killall node` para detener procesos colgados
- Se reinició el servidor con `npm run dev`
- Se verificó que el servidor respondiera en `http://localhost:3000`

---

## Instrucción 6: Run dev
**Fecha:** Durante la sesión

**Instrucción completa:**
```
run dev
```

**Acción realizada:** Se ejecutó `npm run dev` para iniciar el servidor de desarrollo.

---

## Instrucción 7: Verificar
**Fecha:** Durante la sesión

**Instrucción completa:**
```
verifica
```

**Acción realizada:** Se verificó el estado del servidor, la aplicación accesible, y todas las funcionalidades implementadas.

---

## Instrucción 8: Implementar elemento Columna correctamente
**Fecha:** Durante la sesión

**Instrucción completa:**
```
Instruccion: // Busca en los archivos la correcta construccion del elemento columna e implementala. adjunto imagen de referencia, su funcion es guardar cualquier elemento dentro, el usuario arrastra sobre la columna el elemento, columna detecta el centro del elemnto y lo añade. En el header tiene el boton paleta de colores //Columna debe estar en la primera capa del tablero incluso antes que cuadernos.//
```

**Acción realizada:**
- Se revisó la implementación actual de `column-element.tsx`
- Se agregó el botón de paleta de colores en el header con 12 opciones de color
- Se agregaron atributos `data-element-type="column"` y `data-element-id` para detección de drag
- Se mejoró la detección de drag en `transformable-element.tsx` para usar el centro del elemento arrastrado
- Se aseguró que las columnas tengan `zIndex: 0` (primera capa) en `use-element-manager.ts`
- Se actualizó el mensaje a "Arrastra y suelta aquí para añadir a la columna"

---

## Instrucción 9: Build
**Fecha:** Durante la sesión

**Instrucción completa:**
```
build
```

**Acción realizada:** Se ejecutó `npm run build` exitosamente después de implementar la columna.

---

## Instrucción 10: Implementar opción de 2 columnas
**Fecha:** Durante la sesión

**Instrucción completa:**
```
te fijaste que tien la opcion de mostar en 2 columnas como t emostre en la imagen?
```

**Acción realizada:**
- Se agregó estado `layoutPopoverOpen` y función `handleLayoutChange` en `column-element.tsx`
- Se implementó un popover en el botón de Layout con opciones "1 Columna" y "2 Columnas"
- Se modificó el renderizado en `column-element.tsx` para usar `grid-cols-1` o `grid-cols-2` según el layout
- Se actualizó `elements-panel.tsx` para respetar el layout seleccionado
- El layout se guarda en las propiedades del elemento (`layout: 'single' | 'double'`)

---

## Instrucción 11: Build
**Fecha:** Durante la sesión

**Instrucción completa:**
```
build
```

**Acción realizada:** Se ejecutó `npm run build` exitosamente después de implementar el layout de 2 columnas.

---

## Instrucción 12: Botón MapPin para etiquetas en menú de formato
**Fecha:** Durante la sesión

**Instrucción completa:**
```
para la tarejta de etiquetas el primer boton de menu format ademas de traerel icoo de fijar posicion en el tablero debe llamar a este archivo al hacer click en el icono edit-comment-dialog.tsx.Fix
```

**Acción realizada:**
- Se agregó estado `isEditCommentDialogOpen` y `selectedCommentForEdit` en `page.tsx`
- Se implementó `handleEditComment` que abre el diálogo de edición
- Se agregó prop `onEditComment` a `FormattingToolbar`
- Se importó icono `MapPin` de lucide-react
- Se modificó `FormattingToolbar` para detectar cuando el elemento seleccionado es un comment y mostrar el botón MapPin como primer botón
- Se conectó el botón MapPin para abrir `EditCommentDialog`
- Se agregó el componente `EditCommentDialog` al render en `page.tsx`
- Se conectó `handleEditComment` tanto en FormattingToolbar como en Canvas

---

## Instrucción 13: Build y verificación de librerías
**Fecha:** 4 de Diciembre (actual)

**Instrucción completa:**
```
Primero has build

segundo : quiero que verifiques que todas la librerias estan funcionando bien y que detectes si falta alguna. carpeta: lib, revisa cada archivo en orden secuencial

//tercero : crea un archivo :lista de isntrucciones pia_4 dic y anota todas las instrucciones de principio a fin que t ehe dado , no omitas ninguna
```

**Acción realizada:**
- ✅ Build ejecutado exitosamente
- ✅ Revisión de carpeta `lib` completada:
  - `types.ts` - ✅ Funcionando correctamente
  - `utils.ts` - ✅ Funcionando correctamente (usa clsx y tailwind-merge, ambos instalados)
  - `upload-helper.ts` - ✅ Funcionando correctamente (usa Firebase Storage)
  - `text-sanitizer.ts` - ✅ Funcionando correctamente
  - `placeholder-images.ts` - ✅ Funcionando correctamente
  - `hooks/useZoomPan.ts` - ✅ Funcionando correctamente
  - `hooks/useSelection.ts` - ✅ Funcionando correctamente
  - `hooks/useKeyboardNavigation.ts` - ✅ Funcionando correctamente (usa react-hotkeys-hook, instalado)
  - `hooks/useCanvasDragAndDrop.ts` - ✅ Funcionando correctamente
  - `store/boardStore.ts` - ✅ Funcionando correctamente (usa zustand, instalado)
- ✅ Todas las dependencias verificadas en `package.json`:
  - `clsx`: ✅ instalado
  - `tailwind-merge`: ✅ instalado
  - `zustand`: ✅ instalado
  - `react-hotkeys-hook`: ✅ instalado
  - `html2canvas`: ✅ instalado
  - `firebase`: ✅ instalado
- ✅ Archivo de instrucciones creado (este archivo)

---

## Resumen de Cambios Implementados

### Archivos Modificados/Creados:
1. `src/app/home-page-content.tsx` - Timeout de seguridad para login
2. `src/hooks/use-speech-recognition.ts` - Mejoras en dictado
3. `src/components/canvas/dictation-preview.tsx` - Nuevo componente para preview
4. `src/app/board/[boardId]/page.tsx` - Manejo de preview y diálogo de comentarios
5. `src/components/canvas/elements/column-element.tsx` - Implementación completa de columna con paleta y layout
6. `src/components/canvas/transformable-element.tsx` - Detección mejorada de drag para columnas
7. `src/hooks/use-element-manager.ts` - zIndex para columnas en primera capa
8. `src/components/canvas/elements-panel.tsx` - Soporte para layout de 2 columnas
9. `src/components/canvas/formatting-toolbar.tsx` - Botón MapPin para comentarios

### Funcionalidades Implementadas:
- ✅ Página de inicio con timeout de seguridad
- ✅ Dictado con preview en tiempo real
- ✅ Elemento Columna con paleta de colores
- ✅ Detección de drag usando centro del elemento
- ✅ Columnas en primera capa (zIndex 0)
- ✅ Layout de 1 y 2 columnas
- ✅ Botón MapPin en menú de formato para editar etiquetas

---

---

## Instrucción 14: Reparar falla sistemática de comunicación con servidor
**Fecha:** 4 de Diciembre (final)

**Instrucción completa:**
```
encuentra la falla sistematica de comuncacion con el servidor y reparala y documenta
```

**Acción realizada:**
- ✅ Identificada causa raíz: Problema con webpack chunks y lazy loading durante desarrollo
- ✅ Implementada solución sistemática en `next.config.mjs`:
  - Configurado `moduleIds: 'deterministic'` para IDs estables
  - Configurado `chunkIds: 'deterministic'` para chunks estables
  - Mejorada configuración de HMR con nombres de archivos más robustos
- ✅ Creada documentación completa en `docs/FALLA_SISTEMICA_WEBPACK_CHUNKS.md`
- ✅ Agregados scripts preventivos: `dev:clean`, `build:clean`, `clean`
- ✅ Creado script shell `clean-dev.sh` para limpieza automática
- ✅ Build y typecheck verificados exitosamente

**Problema identificado:**
- Error recurrente: "Cannot find module './948.js'" o './682.js'
- Causa: IDs de chunks no determinísticos en desarrollo + HMR desincronizado
- Impacto: Bloquea desarrollo, requiere limpieza manual constante

**Solución implementada:**
- IDs determinísticos basados en contenido del módulo
- HMR mejorado con nombres de archivos más específicos
- Scripts automáticos para limpieza cuando sea necesario

---

**Fecha de creación:** 4 de Diciembre de 2024  
**Última actualización:** 4 de Diciembre de 2024  
**Estado:** ✅ Todas las instrucciones completadas y verificadas  
**Falla sistemática:** ✅ Reparada y documentada

