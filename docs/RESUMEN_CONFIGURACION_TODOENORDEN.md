# Resumen: Configuración todoenorden.cl

**Fecha**: 2025-12-06  
**Estado**: DNS configurado ✅ | Configuraciones pendientes ⏳

---

## ✅ COMPLETADO

### 1. DNS en nic.cl
- ✅ Nameservers configurados:
  - `ns-cloud-d1.googledomains.com`
  - `ns-cloud-d2.googledomains.com`
  - `ns-cloud-d3.googledomains.com`
  - `ns-cloud-d4.googledomains.com`

---

## ⏳ PENDIENTE (Configuración Manual)

### 2. Firebase Authentication

**URL**: https://console.firebase.google.com/project/canvasmind-app/authentication/settings

**Pasos**:
1. Haz clic en la pestaña **"Dominios autorizados"**
2. Busca el botón **"Agregar dominio"** o **"+"** (puede estar arriba de la tabla o en un menú)
3. Ingresa: `todoenorden.cl`
4. Guarda

**Nota**: Si no encuentras el botón, puede que necesites hacer scroll o que la interfaz haya cambiado. En ese caso, el dominio puede agregarse automáticamente cuando se use por primera vez.

---

### 3. Google Cloud OAuth

**URL**: https://console.cloud.google.com/apis/credentials?project=canvasmind-app

**Pasos**:
1. Busca **"OAuth 2.0 Client IDs"** en la lista
2. Haz clic en el cliente OAuth (probablemente "Web client")
3. En **"Authorized JavaScript origins"**:
   - Agrega: `https://todoenorden.cl`
   - Agrega: `https://www.todoenorden.cl`
4. En **"Authorized redirect URIs"**:
   - Agrega: `https://todoenorden.cl/__/auth/handler`
   - Agrega: `https://www.todoenorden.cl/__/auth/handler`
5. Guarda

---

### 4. Firebase App Hosting (Opcional)

**URL**: https://console.firebase.google.com/project/canvasmind-app/apphosting/backends/canvasmind-backend/locations/us-central1/overview

**Nota**: Firebase App Hosting puede no requerir configuración manual del dominio si los DNS están correctos. El dominio debería funcionar automáticamente después de la propagación DNS.

Si hay una sección "Custom domains":
1. Haz clic en "Add custom domain" o "Agregar dominio personalizado"
2. Ingresa: `todoenorden.cl`
3. Sigue las instrucciones

---

## ⏱️ Tiempo de Propagación

Los cambios DNS pueden tardar **24-48 horas** en propagarse completamente.

---

## ✅ Verificación

Después de 24-48 horas:

1. **Verifica DNS:**
   ```bash
   dig todoenorden.cl NS
   dig todoenorden.cl A
   ```

2. **Accede a la aplicación:**
   - `https://todoenorden.cl`
   - Debería cargar la aplicación

3. **Prueba autenticación:**
   - Intenta hacer login con Google
   - Debería funcionar correctamente

---

## 📝 Notas

- Los nameservers ya están configurados correctamente
- Las configuraciones de Firebase Authentication y Google Cloud OAuth son necesarias para que la autenticación funcione
- Firebase App Hosting puede funcionar automáticamente después de la propagación DNS

