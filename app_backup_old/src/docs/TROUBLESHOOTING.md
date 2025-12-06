# Guía de Solución de Problemas de CanvasMind

Este documento cataloga problemas complejos y sus soluciones definitivas que van más allá de los errores de código comunes.

---

## **Problema Nº 1: Error 403 genérico de Google durante el inicio de sesión**

### **Manifestación:**
Después de seleccionar una cuenta en la página de inicio de sesión de Google, en lugar de volver a la aplicación, se muestra una página de error de Google con el mensaje: "Error 403. Lo sentimos, pero no tienes acceso a esta página."

### **Causa Raíz:**
Este error indica que la configuración de seguridad de tu proyecto en Google Cloud no reconoce el dominio desde el cual estás intentando iniciar sesión. Para que la autenticación funcione, debes autorizar explícitamente tanto el lugar desde donde se origina la solicitud de login (**origen de JavaScript**) como el lugar al que Google debe devolver al usuario (**URI de redireccionamiento**).

La causa más común es tener `http://localhost:5000` en la lista de orígenes autorizados en lugar de la URL real de tu entorno de desarrollo en la nube.

### **Solución Definitiva (Pasos a Seguir):**

#### **Paso 1: Obtener la URI de Redirección y el ID de Cliente desde Firebase**

1.  Ve a la **Consola de Firebase** de tu proyecto (`canvasmind-app`).
2.  En el menú de la izquierda, navega a **Authentication**.
3.  Selecciona la pestaña **Sign-in method** (Método de inicio de sesión).
4.  En la lista de proveedores, haz clic en **Google**.
5.  Desde aquí, copia dos valores clave:
    *   **ID de cliente web (Web client ID):** Cópialo para identificar el cliente correcto en el siguiente paso.
    *   **URI de redireccionamiento de OAuth:** Cópiala. Tendrá un formato como `https://canvasmind-app.firebaseapp.com/__/auth/handler`.

#### **Paso 2: Corregir las Credenciales en la Consola de Google Cloud**

1.  Abre la página de **Credenciales** en la Consola de Google Cloud: [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials).
2.  Asegúrate de que el proyecto seleccionado en la parte superior de la página sea el correcto (`canvasmind-app`).
3.  Bajo la sección **"ID de cliente de OAuth 2.0"**, busca en la lista el cliente cuyo "ID de cliente" coincida con el que copiaste en el Paso 1. Haz clic en el **nombre** de ese cliente para editarlo.
4.  Ahora, revisa y corrige las dos listas siguientes:

    **A. Orígenes de JavaScript autorizados**
    *   Esta lista le dice a Google qué dominios tienen permiso para *iniciar* el proceso de login.
    *   **ELIMINA** cualquier entrada que contenga `localhost`.
    *   Haz clic en **"+ AGREGAR URI"** y añade las siguientes dos URIs, una por una:
        *   `https://canvasmind-app.web.app` (para tu aplicación en producción)
        *   `https://6000-firebase-studio-1762742666712.cluster-c72u3gwiofapkvxrcwjq5zllcu.cloudworkstations.dev` (para tu entorno de desarrollo actual)

    **B. URIs de redireccionamiento autorizadas**
    *   Esta lista le dice a Google a dónde puede *devolver* al usuario después de un inicio de sesión exitoso.
    *   Haz clic en **"+ AGREGAR URI"**.
    *   Pega la URI completa que copiaste de la consola de Firebase en el Paso 1 (debe ser `https://canvasmind-app.firebaseapp.com/__/auth/handler`).

5.  Haz clic en el botón **"GUARDAR"** en la parte inferior de la página.

Una vez que guardes el cambio, el problema debería resolverse. Puede que los cambios tarden uno o dos minutos en propagarse. Después de eso, el flujo de inicio de sesión con redirección funcionará correctamente.
