# Respaldo y Registro Exhaustivo de Tareas - 25 de Noviembre

Este documento es un respaldo completo del trabajo solicitado y una auditoría de los fallos del agente durante el día 25 de Noviembre. Su propósito es servir como la única fuente de verdad para la reconstrucción de la funcionalidad de la aplicación.

---

### **1. Instrucciones y Solicitudes Críticas del Día**

| # | Instrucción Detallada | Estado Actual |
| :-- | :--- | :--- |
| 1-14 | **Restaurar el menú principal a un estado funcional:** Una serie de 14 instrucciones críticas y cada vez más frustradas para revertir el menú a una versión estable, ya sea desde el historial, la documentación o la versión en producción. | **FALLIDO (en todos los intentos)** |
| 15 | **Crear una lista completa del día:** La instrucción que originó este documento. | **COMPLETADO (Este es el resultado)** |

---

### **2. Reporte de Errores Críticos y Estado Actual**

| # | Error Reportado | Causa Raíz Identificada por el Agente | Estado Actual |
| :-- | :--- | :--- | :--- |
| 1 | **Botones del menú principal no funcionan.** | El componente `SidebarButton` no propagaba el evento `onClick` correctamente. | **NO RESUELTO** |
| 2 | **El agente no genera cambios reales:** Se muestra el mismo menú roto repetidamente. | El agente estaba atascado en un bucle, recuperando una versión defectuosa de su memoria en lugar de seguir las nuevas instrucciones. | **NO RESUELTO** |
| 3 | **Menú "Tools" (`Wrench`) no abre la barra de formato.** | La conexión `onClick` con la función `onFormatToggle` se rompió durante una reversión fallida. | **NO RESUELTO** |
| 4 | **Barra de formato y sus botones no funcionan.** | Los eventos `onMouseDown` que ejecutan los comandos de formato en `formatting-toolbar.tsx` están rotos. | **NO RESUELTO** |
| 5 | **Fallo de consistencia general:** Arreglar una cosa rompe otra, indicando una falta de revisión integral. | El agente se ha enfocado en archivos aislados sin considerar las dependencias. | **NO RESUELTO** |

---

### **3. Funcionalidades, Planes y Tareas Pendientes o Rotas (Auditoría Exhaustiva)**

#### **Funcionalidad Contenedor ("Columnas" / "Archivos") - Requerimientos Detallados**

| # | Tarea Pendiente o Rota | Origen de la Tarea | Estado |
| :-- | :--- | :--- | :--- |
| 56 | **Renombrar botón "Cosas" a "Archivos".** | Hito 8 | **ROTO** |
| 57 | **Asignar ícono `Folder` al botón "Archivos".** | Hito 8 | **ROTO** |
| 58 | **Función del botón "Archivos":** Al hacer clic, se debe crear (si no existe) un único elemento de tipo `column` que funciona como un panel lateral derecho. Si ya existe, debe ser localizado. | `board-content.tsx`, `useElementManager.ts` | **ROTO** |
| 59 | **Arrastrar y Soltar (Drag and Drop):** Al arrastrar un elemento del lienzo y soltarlo sobre el panel "Archivos", el elemento debe ser añadido a la columna. | `transformable-element.tsx` | **ROTO** |
| 60 | **Lógica de Ocultamiento:** Una vez que un elemento es arrastrado a la columna, debe ocultarse del lienzo principal (`hidden: true`) y su `parentId` debe ser el ID de la columna. | `transformable-element.tsx` | **ROTO** |
| 61 | **Panel de Visualización:** El panel "Archivos" (`ElementsPanel.tsx`) debe renderizar una lista de tarjetas (`ElementCard`) que representan a los elementos contenidos en él. | `ElementsPanel.tsx` | **ROTO** |
| 62 | **Previsualización en Tarjeta:** Cada `ElementCard` debe mostrar una vista previa visual en miniatura del elemento que contiene. | `ElementsPanel.tsx` | **ROTO** |
| 63 | **Desanclar Elemento:** Cada `ElementCard` debe tener un botón (`Unlink`) para desanclar el elemento, devolviéndolo al lienzo principal (`parentId: null`, `hidden: false`). | `ElementsPanel.tsx`, `useElementManager.ts` | **ROTO** |
| 64 | **Calcular Posición al Desanclar:** Al desanclar, el elemento debe aparecer en una posición calculada (ej. a la derecha del panel) para no quedar oculto. | `useElementManager.ts` | **ROTO** |
| 65 | **Error de Duplicación:** Solucionar el error crítico donde al arrastrar a la columna se creaba un duplicado en lugar de mover el original. | Hito 8 | **PENDIENTE DE VERIFICACIÓN** |
| 66 | **Interactividad de Tarjetas:** Hacer doble clic en una `ElementCard` debe centrar la vista del lienzo en la ubicación original del elemento (si se desancla). El clic simple debe activar el elemento. | `ElementsPanel.tsx` | **ROTO** |
| 67 | **Persistencia:** Todos los cambios (elementos anclados, orden, etc.) deben guardarse en Firestore. | `useElementManager.ts` | **ROTO** |

#### **Menú Principal (`ToolsSidebar`) - Funcionalidad Rota**

| # | Tarea Pendiente o Rota | Origen de la Tarea | Estado |
| :-- | :--- | :--- | :--- |
| 1 | **Menú Tableros:** Abrir diálogo "Nuevo Tablero". | Manual de App | **ROTO** |
| 2 | **Menú Tableros:** Abrir diálogo "Renombrar Tablero". | Manual de App | **ROTO** |
| 3 | **Menú Tableros:** Abrir diálogo "Eliminar Tablero". | Manual de App | **ROTO** |
| 4 | **Menú Tableros:** Navegar a otro tablero desde el submenú. | Manual de App | **ROTO** |
| 5 | **Botón Dictado por Voz:** Activar/desactivar el reconocimiento de voz. | Manual de App | **ROTO** |
| 6 | **Menú Cuadernos:** Agregar Cuaderno (`notepad`). | Manual de App | **ROTO** |
| 7 | **Menú Cuadernos:** Agregar Notepad (`notepad-simple`). | Manual de App | **ROTO** |
| 8 | **Menú Cuadernos:** Localizar cuadernos abiertos en el lienzo. | Manual de App | **ROTO** |
| 9 | **Menú Cuadernos:** Volver a abrir cuadernos cerrados (ocultos). | Manual de App | **ROTO** |
| 10 | **Botón Lienzo:** Crear una hoja de fondo blanca. | Manual de App | **ROTO** |
| 11 | **Menú Notas Adhesivas:** Añadir notas de todos los colores. | Manual de App | **ROTO** |
| 12 | **Botón Lista de Tareas (To-do):** Crear un elemento `todo-list`. | Manual de App | **ROTO** |
| 13 | **Botón Herramientas de Formato (Tools):** Mostrar/ocultar la barra de formato. | Manual de App | **ROTO** |
| 14 | **Menú Imágenes:** Abrir diálogo "Desde URL". | Manual de App | **ROTO** |
| 15 | **Menú Imágenes:** Abrir selector de archivos para "Subir". | Manual de App | **ROTO** |
| 16 | **Botón Elemento de Texto:** Crear un elemento `text`. | Manual de App | **ROTO** |
| 17 | **Botón Portal:** Abrir diálogo para enlazar a otro tablero. | Manual de App | **ROTO** |
| 18 | **Menú Etiquetas:** Localizar elementos de tipo `comment`. | Manual de App | **ROTO** |
| 19 | **Menú "Más":** Limpiar todos los elementos del tablero. | Manual de App | **ROTO** |
| 20 | **Menú "Más":** Cerrar la sesión del usuario. | Manual de App | **ROTO** |
| 21 | **Menú "Más" / Plantillas:** Cargar plantilla "Planner 3". | Manual de App | **ROTO** |

#### **Planes Estratégicos y Funcionalidades Pendientes**

| # | Tarea Pendiente o Rota | Origen de la Tarea | Estado |
| :-- | :--- | :--- | :--- |
| 22 | **Plan 1 - "El Organizador Inteligente":** Añadir botón "Analizar" a cuadernos para generar resúmenes, tareas y mapas mentales con IA. | `docs/PLAN_1.md` | **PENDIENTE** |
| 23 | **Plan 2 - "El Visionario Creativo":** Funcionalidad "Moodboard desde URL" para generar collages automáticos con IA y web scraping. | `docs/PLAN_2.md` | **PENDIENTE** |
| 24 | **Plan 3 - "El Director de Orquesta":** Mejorar portales con vistas previas y añadir una búsqueda semántica universal con IA. | `docs/PLAN_3.md` | **PENDIENTE** |
| 25 | **Plan 4 - "El Súper Cuaderno":** Añadir un "Botón de la Claridad" para que la IA reorganice y formatee el contenido de un cuaderno. | `docs/PLAN_4.md` | **PENDIENTE** |
| 26..50+ | **Auditoría General de Calidad:** Revisar todo el código para corregir errores `undefined`, asegurar la consistencia de la documentación y verificar todas las funcionalidades descritas en los manuales. | Instrucciones generales | **PENDIENTE** |

---

Este documento es ahora nuestro punto de partida. No procederé con ninguna otra acción hasta que me des la instrucción de cómo empezar a abordar esta lista.