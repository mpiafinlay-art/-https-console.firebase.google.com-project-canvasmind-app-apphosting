# COMPARACIÓN DE ORDEN DEL MENÚ PRINCIPAL

## 📋 ORDEN SEGÚN IMAGEN DE REFERENCIA

Según la imagen proporcionada, el orden del menú principal es:

1. **Tableros** (`LayoutDashboard`)
2. **Dictar** (`Mic`)
3. **Cuadernos** (`BookCopy`)
4. **Notas** (`StickyNote`)
5. **To-do** (`List`)
6. **Tools** (`Wrench`) - *Activo (morado)*
7. **Imagen** (`Image** (`ImageIcon`)
8. **Texto** (`FileText`)
9. **Columna** (`Columns`)
10. **Plantillas** (`LayoutTemplate`) - *Botón separado*
11. **Mover** (`Move`)
12. **Más** (`MoreHorizontal`)

---

## 📋 ORDEN ACTUAL EN EL CÓDIGO

El orden actual en `tools-sidebar.tsx` es:

1. **Tableros** (`LayoutDashboard`)
2. **Dictar** (`Mic`)
3. **Mover** (`Move`) ⚠️ *Debería estar más abajo*
4. **Cuadernos** (`BookCopy`)
5. **Archivos** (`Folder`) ⚠️ *No aparece en la imagen*
6. **Lienzo** (`RectangleHorizontal`) ⚠️ *No aparece en la imagen*
7. **Notas** (`StickyNote`)
8. **To-do** (`List`)
9. **Tools** (`Wrench`)
10. **Imagen** (`ImageIcon`)
11. **Texto** (`FileText`)
12. **Columna** (`Columns`) ✅ *Recién agregado*
13. **Portal** (`Link`) ⚠️ *No aparece en la imagen visible*
14. **Etiquetas** (`Tag`) - *Condicional (solo si hay comentarios)*
15. **Más** (`MoreHorizontal`)

**Nota**: "Plantillas" está dentro del menú "Más", no como botón separado.

---

## 📋 ORDEN SEGÚN DOCUMENTACIÓN

Según `readme_menuPricipal18` y `MANUAL_DE_APP.md`:

1. **Tableros** (`LayoutDashboard`)
2. **Dictar** (`Mic`)
3. **Mover** (`Move`) - *Según readme_menuPricipal18 línea 78-90*
4. **Cuadernos** (`BookCopy`)
5. **Archivos** (`Folder`) - *Según MANUAL_DE_APP.md línea 35-37*
6. **Lienzo** (`RectangleHorizontal`) - *Según MANUAL_DE_APP.md línea 39-41*
7. **Notas** (`StickyNote`)
8. **To-do** (`List`)
9. **Tools** (`Wrench`)
10. **Imagen** (`ImageIcon`)
11. **Texto** (`FileText`)
12. **Columna** (`Columns`) - *Según MANUAL_DE_APP.md línea 69-71*
13. **Portal** (`Link`)
14. **Etiquetas** (`Tag`)
15. **Más** (`MoreHorizontal`)

---

## 🔍 DIFERENCIAS IDENTIFICADAS

### 1. Posición de "Mover"
- **Imagen**: Posición 11 (antes de "Más")
- **Código actual**: Posición 3 (después de "Dictar")
- **Documentación**: Posición 3 (después de "Dictar")

### 2. Botones "Archivos" y "Lienzo"
- **Imagen**: ❌ No aparecen
- **Código actual**: ✅ Aparecen (posiciones 5 y 6)
- **Documentación**: ✅ Deben aparecer (posiciones 5 y 6)

### 3. Botón "Plantillas"
- **Imagen**: ✅ Botón separado (posición 10)
- **Código actual**: ❌ Dentro del menú "Más"
- **Documentación**: ⚠️ Dentro del menú "Más" (según MANUAL_DE_APP.md línea 88-89)

### 4. Botón "Portal"
- **Imagen**: ❓ No visible en la imagen
- **Código actual**: ✅ Aparece (posición 13)
- **Documentación**: ✅ Debe aparecer (posición 13)

### 5. Botón "Etiquetas"
- **Imagen**: ❓ No visible en la imagen
- **Código actual**: ✅ Condicional (solo si hay comentarios)
- **Documentación**: ✅ Debe aparecer condicionalmente

---

## ❓ PREGUNTAS PARA EL USUARIO

1. **¿Debemos mantener "Archivos" y "Lienzo" en el menú?**
   - La documentación dice que sí, pero no aparecen en la imagen.

2. **¿"Plantillas" debe ser un botón separado o estar dentro de "Más"?**
   - La imagen muestra un botón separado, pero la documentación lo pone dentro de "Más".

3. **¿Debemos mover "Mover" a la posición 11 (antes de "Más")?**
   - La imagen muestra "Mover" al final, pero la documentación lo pone después de "Dictar".

4. **¿Qué hacer con "Portal"?**
   - No aparece en la imagen visible, pero está en la documentación.

---

## 🎯 PROPUESTA DE ORDEN BASADA EN LA IMAGEN

Si seguimos estrictamente la imagen de referencia:

1. **Tableros** (`LayoutDashboard`)
2. **Dictar** (`Mic`)
3. **Cuadernos** (`BookCopy`)
4. **Notas** (`StickyNote`)
5. **To-do** (`List`)
6. **Tools** (`Wrench`)
7. **Imagen** (`ImageIcon`)
8. **Texto** (`FileText`)
9. **Columna** (`Columns`) ✅ *Ya agregado*
10. **Plantillas** (`LayoutTemplate`) - *Mover aquí como botón separado*
11. **Mover** (`Move`) - *Mover aquí desde posición 3*
12. **Más** (`MoreHorizontal`)

**Botones que NO aparecen en la imagen pero están en documentación:**
- **Archivos** (`Folder`)
- **Lienzo** (`RectangleHorizontal`)
- **Portal** (`Link`)
- **Etiquetas** (`Tag`) - *Condicional*

---

## ✅ CONCLUSIÓN

Necesito confirmación del usuario sobre:
1. Si mantener "Archivos" y "Lienzo"
2. Si "Plantillas" debe ser botón separado
3. Si mover "Mover" al final
4. Qué hacer con "Portal"

