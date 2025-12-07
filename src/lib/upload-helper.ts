'use client';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { FirebaseStorage } from 'firebase/storage';

export async function uploadFile(
  storage: FirebaseStorage | null,
  file: File,
  userId: string,
  path: string = 'images'
): Promise<string> {
  if (!storage) {
    throw new Error('Storage no está disponible');
  }

  const storageRef = ref(storage, `users/${userId}/${path}/${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

