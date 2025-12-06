# Guía: Crear Segunda API Key en Google Cloud Console

## ✅ SÍ, puedes crear múltiples API Keys

Puedes tener varias API Keys en el mismo proyecto de Google Cloud. Esto es útil para:
- Separar entornos (desarrollo/producción)
- Rotar claves sin interrumpir el servicio
- Tener claves específicas para diferentes servicios

---

## 📋 PASOS DETALLADOS

### 1. **Acceder a Google Cloud Console**

1. Ve a: https://console.cloud.google.com/
2. Asegúrate de estar en el proyecto correcto: **canvasmind-app**
   - Si no lo ves, selecciona el proyecto desde el selector en la parte superior

### 2. **Navegar a Credenciales**

1. En el menú lateral izquierdo, busca **"APIs y servicios"** (APIs & Services)
2. Haz clic en **"Credenciales"** (Credentials)
3. Verás una lista de todas tus credenciales existentes (incluyendo tu API Key antigua)

### 3. **Crear Nueva API Key**

1. En la parte superior, haz clic en el botón **"+ CREAR CREDENCIALES"** (Create Credentials)
2. Selecciona **"Clave de API"** (API Key)
3. Se creará automáticamente una nueva API Key

### 4. **Configurar la Nueva API Key**

Después de crear la clave, aparecerá un modal con la nueva API Key. **IMPORTANTE: Copia la clave ahora**, porque no podrás verla completa después.

#### **Opciones de Configuración:**

1. **Restringir la clave** (Recomendado para producción):
   - Haz clic en **"Restringir clave"** (Restrict key)
   - **Restricciones de aplicación:**
     - Selecciona **"Aplicaciones web"** (Web applications)
     - Agrega los dominios autorizados:
       - `localhost` (para desarrollo)
       - `app-micerebro.web.app`
       - `canvasmind-app.firebaseapp.com`
       - Cualquier otro dominio que uses

   - **Restricciones de API:**
     - Selecciona **"Limitar clave"** (Restrict key)
     - Marca las APIs que necesitas:
       - ✅ **Identity Toolkit API** (para Firebase Auth)
       - ✅ **Firebase Installations API**
       - ✅ **Firebase Cloud Messaging API** (si usas notificaciones)
       - ✅ Cualquier otra API de Firebase que uses

2. **Nombre de la clave:**
   - Haz clic en **"Editar clave"** (Edit key) o en el nombre de la clave
   - Cambia el nombre a algo descriptivo, por ejemplo:
     - `API Key - CanvasMind - Producción`
     - `API Key - CanvasMind - Desarrollo`
     - `API Key - CanvasMind - Nueva`

### 5. **Guardar la Configuración**

1. Haz clic en **"Guardar"** (Save)
2. La nueva API Key aparecerá en tu lista de credenciales

---

## 🔄 ACTUALIZAR FIREBASE CON LA NUEVA API KEY

### Opción A: Actualizar en `firebase.json` o configuración de Firebase

1. Ve a Firebase Console: https://console.firebase.google.com/
2. Selecciona tu proyecto: **canvasmind-app**
3. Ve a **Configuración del proyecto** (⚙️ > Project settings)
4. En la pestaña **"General"**, busca **"Tus aplicaciones web"**
5. Si tienes una app web configurada, verás la configuración actual
6. **NOTA:** La API Key en Firebase generalmente se genera automáticamente y está vinculada al proyecto

### Opción B: Actualizar en el código (si usas la API Key directamente)

Si estás usando la API Key directamente en tu código (no recomendado para producción), actualiza:

**Archivo:** `src/firebase/config.ts`

```typescript
const firebaseConfig = {
  apiKey: "TU_NUEVA_API_KEY_AQUI", // ← Reemplaza aquí
  authDomain: "canvasmind-app.firebaseapp.com",
  projectId: "canvasmind-app",
  storageBucket: "canvasmind-app.firebasestorage.app",
  messagingSenderId: "917199598510",
  appId: "1:917199598510:web:73840729e1333a07804e3f"
};
```

---

## ⚠️ IMPORTANTE: Seguridad

### ✅ Buenas Prácticas:

1. **NO expongas la API Key en código público**
   - Si tu repositorio es público, usa variables de entorno
   - Firebase Hosting maneja esto automáticamente

2. **Restringe la API Key**
   - Siempre configura restricciones de aplicación
   - Limita las APIs que puede usar

3. **Rota las claves periódicamente**
   - Si sospechas que una clave está comprometida, créala nueva y elimina la antigua

4. **Monitorea el uso**
   - En Google Cloud Console, puedes ver el uso de cada API Key
   - Revisa regularmente para detectar uso anormal

---

## 🔍 VERIFICAR LA NUEVA API KEY

### 1. Ver todas tus API Keys

En Google Cloud Console > APIs y servicios > Credenciales:
- Verás todas tus API Keys listadas
- Puedes ver cuándo se crearon, cuándo se usaron por última vez, etc.

### 2. Probar la nueva API Key

Puedes probar la nueva API Key en tu aplicación:
1. Actualiza la configuración de Firebase con la nueva clave
2. Prueba el login con Google
3. Verifica que todo funcione correctamente

### 3. Desactivar/Eliminar la API Key antigua (cuando estés seguro)

**IMPORTANTE:** Solo haz esto cuando estés 100% seguro de que la nueva clave funciona:

1. En la lista de credenciales, haz clic en la API Key antigua
2. Haz clic en **"Desactivar"** (Disable) o **"Eliminar"** (Delete)
3. Confirma la acción

---

## 📝 NOTAS ADICIONALES

### ¿Por qué crear una segunda API Key?

- **Separación de entornos:** Una para desarrollo, otra para producción
- **Seguridad:** Si una clave se compromete, puedes rotarla sin afectar la otra
- **Pruebas:** Probar cambios sin afectar la clave de producción
- **Límites:** Diferentes límites de cuota para diferentes claves

### ¿Cuántas API Keys puedo tener?

No hay un límite estricto, pero Google recomienda mantener solo las necesarias para evitar confusión.

### ¿La API Key antigua seguirá funcionando?

Sí, ambas API Keys funcionarán simultáneamente hasta que desactives o elimines una.

---

## ✅ CHECKLIST

- [ ] Accedí a Google Cloud Console
- [ ] Seleccioné el proyecto correcto (canvasmind-app)
- [ ] Navegué a APIs y servicios > Credenciales
- [ ] Creé una nueva API Key
- [ ] Configuré restricciones de aplicación (dominios)
- [ ] Configuré restricciones de API (Identity Toolkit, etc.)
- [ ] Guardé la configuración
- [ ] Copié la nueva API Key en un lugar seguro
- [ ] Actualicé la configuración en Firebase/código (si es necesario)
- [ ] Probé que la nueva clave funciona
- [ ] (Opcional) Desactivé la clave antigua cuando esté seguro

---

**Fecha:** 5 de Diciembre 2024  
**Proyecto:** canvasmind-app  
**Ubicación:** Google Cloud Console > APIs y servicios > Credenciales
