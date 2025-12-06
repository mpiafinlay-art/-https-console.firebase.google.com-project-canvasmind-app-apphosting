import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from '@/firebase/config';

// Inicializar Firebase en el servidor si no está inicializado
let serverApp: FirebaseApp;
if (!getApps().length) {
  serverApp = initializeApp(firebaseConfig);
} else {
  serverApp = getApp();
}

export async function POST(request: NextRequest) {
  try {
    // Obtener el userId del header o del body
    // El cliente debe enviar el userId después de autenticarse
    const userIdHeader = request.headers.get('x-user-id');
    
    // Obtener el archivo del FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const userIdFromBody = formData.get('userId') as string | null;
    
    const userId = userIdHeader || userIdFromBody;

    if (!userId) {
      return NextResponse.json(
        { error: 'No se proporcionó el ID de usuario. Incluye el header "x-user-id" o el campo "userId" en el FormData' },
        { status: 401 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validar el tipo de archivo (solo imágenes)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP, SVG)' },
        { status: 400 }
      );
    }

    // Validar el tamaño del archivo (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. El tamaño máximo es 10MB' },
        { status: 400 }
      );
    }

    // Convertir el archivo a Uint8Array para Firebase Storage
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Generar un nombre único para el archivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}_${randomString}.${fileExtension}`;
    const storagePath = `users/${userId}/images/${fileName}`;

    // Subir el archivo a Firebase Storage usando el SDK del cliente
    const storage = getStorage(serverApp);
    const storageRef = ref(storage, storagePath);
    
    // Crear metadatos personalizados
    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
      },
    };

    // Subir el archivo
    const snapshot = await uploadBytes(storageRef, bytes, metadata);

    // Obtener la URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref);

    return NextResponse.json({
      success: true,
      url: downloadURL,
      path: storagePath,
      fileName: fileName,
      size: file.size,
      type: file.type,
    });

  } catch (error: any) {
    console.error('Error en la subida de archivo:', error);
    return NextResponse.json(
      { error: 'Error al subir el archivo: ' + (error.message || 'Error desconocido') },
      { status: 500 }
    );
  }
}

// Método GET para obtener información sobre un archivo (opcional)
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      message: 'Use POST para subir archivos',
      instructions: 'Envía un FormData con el campo "file" y el header "x-user-id" con el ID del usuario autenticado'
    },
    { status: 405 }
  );
}

