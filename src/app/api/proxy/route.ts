
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('URL de imagen no proporcionada', { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Fallo al obtener la imagen: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new Response(imageBuffer, { headers });

  } catch (error: any) {
    console.error(`Error en el proxy de imagen para ${url}:`, error);
    return new NextResponse(`No se pudo obtener la imagen. ${error.message}`, { status: 500 });
  }
}
