# 📝 ESPECIFICACIONES DETALLADAS - Elementos Nuevos

## 🔴 FASE 1: ULTRA-RÁPIDOS

### 1. Temporizador
**Código**: Buscar código probado sin errores
**Especificaciones**:
- Tiempos predefinidos: 5 min, 10 min, 20 min, 30 min, 40 min, 1 hora
- Elemento flotante (arrastrable)
- Fondo: Negro (#000000)
- Números: Blanco (#ffffff)
- Botones: Cerrar (X), Detener (⏸)
- Al llegar a cero: Parpadear (animación)
- Sonido opcional al llegar a cero

**Ubicación**: Menú principal (segunda columna)
**Tiempo**: 5 minutos

---

### 2. Cronómetro
**Código**: Buscar código probado sin errores
**Especificaciones**:
- Activar cronómetro (iniciar desde 00:00:00)
- Fondo: Negro (#000000)
- Números: Blanco (#ffffff)
- Botones: Detener (⏸), Cerrar (X)
- Formato: HH:MM:SS o MM:SS
- Guardar tiempo máximo alcanzado

**Ubicación**: Menú principal (segunda columna)
**Tiempo**: 5 minutos

---

### 3. Calendario Mini
**Código**: Buscar código probado sin errores
**Especificaciones**:
- Vista mensual compacta
- Seleccionar fecha
- Editable
- Arrastrable

**Ubicación**: Menú principal (segunda columna)
**Tiempo**: 5 minutos

---

## 🔴 FASE 2: ELEMENTOS NUEVOS

### 4. Etiqueta/Tag Mejorado
**Código**: Buscar código nuevo (NO usar comment-element.tsx)
**Especificaciones**:
- Paleta de colores amplia
- Tamaño editable
- Texto editable
- Arrastrable
- Diseño moderno

**Ubicación**: Menú principal (segunda columna)
**Tiempo**: 30 minutos

---

### 5. Cita/Quote Block
**Código**: Buscar código probado
**Especificaciones**:
- Bloque de cita estilizado
- Borde izquierdo destacado
- Texto editable
- Autor editable (opcional)
- Arrastrable
- Formato profesional

**Ubicación**: Menú principal (segunda columna)
**Tiempo**: 30 minutos

---

### 6. Botón Accionable
**Código**: Buscar código probado
**Especificaciones**:
- Texto editable
- Color personalizable
- Acción configurable (URL, función)
- Estilos: Primario, Secundario, Outline
- Arrastrable

**Ubicación**: Menú principal (segunda columna)
**Tiempo**: 30 minutos

---

### 7. Tabs/Pestañas
**Código**: Buscar código probado
**Especificaciones**:
- Usar paleta de colores de lista de tareas:
  - Blanco, Amarillo, Rosa, Azul, Verde, Naranja, Morado
- Múltiples pestañas editables
- Contenido editable por pestaña
- Agregar/eliminar pestañas
- Arrastrable

**Paleta de colores** (de todo-list-element):
```typescript
const COLOR_PALETTE = [
  { name: 'white', value: '#ffffff' },
  { name: 'yellow', value: '#fffb8b' },
  { name: 'pink', value: '#ffc2d4' },
  { name: 'blue', value: '#bce8f1' },
  { name: 'green', value: '#d4edda' },
  { name: 'orange', value: '#ffeeba' },
  { name: 'purple', value: '#e9d5ff' },
];
```

**Ubicación**: Menú principal (segunda columna)
**Tiempo**: 45 minutos

---

## 📋 CHECKLIST IMPLEMENTACIÓN:

### Temporizador:
- [ ] Buscar código probado
- [ ] Implementar tiempos predefinidos
- [ ] Fondo negro, números blancos
- [ ] Botones cerrar/detener
- [ ] Animación parpadeo a cero
- [ ] Agregar botón a menú principal

### Cronómetro:
- [ ] Buscar código probado
- [ ] Implementar inicio/detener
- [ ] Fondo negro, números blancos
- [ ] Botones detener/cerrar
- [ ] Agregar botón a menú principal

### Calendario Mini:
- [ ] Buscar código probado
- [ ] Vista mensual compacta
- [ ] Agregar botón a menú principal

### Etiqueta/Tag:
- [ ] Buscar código nuevo (NO comment-element)
- [ ] Paleta de colores
- [ ] Tamaño editable
- [ ] Agregar botón a menú principal

### Cita/Quote:
- [ ] Buscar código probado
- [ ] Estilo profesional
- [ ] Agregar botón a menú principal

### Botón Accionable:
- [ ] Buscar código probado
- [ ] Configurar acciones
- [ ] Agregar botón a menú principal

### Tabs/Pestañas:
- [ ] Buscar código probado
- [ ] Usar COLOR_PALETTE de todo-list-element
- [ ] Agregar botón a menú principal

---

**Fecha**: 6 de Diciembre 2024
