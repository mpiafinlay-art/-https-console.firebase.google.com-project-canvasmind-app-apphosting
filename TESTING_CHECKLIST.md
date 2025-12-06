# ⚠️ CHECKLIST DE TESTING OBLIGATORIO

## 🔴 EJECUTAR ANTES DE CADA COMMIT O CAMBIO

**Documentación completa:** `docs/PROCEDIMIENTO_TESTING.md`

---

## ✅ CHECKLIST RÁPIDO

### 1. Render Test del Componente Home
```bash
npm run dev
# Verificar: http://localhost:3000 carga sin errores
```

### 2. Revisión de Imports, Rutas y Context Providers
```bash
npm run build 2>&1 | grep -E "(Cannot find|Module not found|Failed to resolve)"
# Debe retornar vacío (sin errores)
```

### 3. Verificación del Estado Global y Props
```bash
npm run build 2>&1 | grep -E "(Type error|Property.*does not exist|is missing)"
# Debe retornar vacío (sin errores)
```

### 4. Build Final
```bash
npm run build
# Debe completar sin errores
```

---

## 📋 TEMPLATE RÁPIDO

```
✅ Render Test Home
✅ Imports y Rutas
✅ Estado Global y Props
✅ Build exitoso
```

---

**⚠️ NUNCA hacer commit sin completar este checklist**

