
'use client';

import {
  type Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type UserCredential,
} from 'firebase/auth';

/**
 * Initiates the Google sign-in process using popup (como en la versión exitosa original).
 * @param auth The Firebase Auth instance.
 * @returns A promise that resolves with the user credential.
 */
export async function signInWithGoogle(auth: Auth): Promise<UserCredential> {
  if (typeof window === 'undefined') {
    throw new Error('signInWithGoogle solo puede ejecutarse en el cliente');
  }

  const provider = new GoogleAuthProvider();
  // Se establece explícitamente el ID de cliente de OAuth para asegurar la correcta
  // autorización con la configuración de Google Cloud.
  provider.setCustomParameters({
    prompt: 'select_account',
    client_id: '917199598510-14h0c930cobfvnig8kdfj5i42untd7rg.apps.googleusercontent.com'
  });
  
  try {
    console.log('🔄 Iniciando sesión con Google (popup)...');
    console.log('🔄 Llamando a signInWithPopup...');
    const result = await signInWithPopup(auth, provider);
    console.log('✅ signInWithPopup exitoso:', result.user.email);
    return result;
  } catch (error: any) {
    console.error("❌ Error during Google sign-in popup:", error);
    console.error("❌ Error code:", error.code);
    console.error("❌ Error message:", error.message);
    
    // Re-lanzar el error original para que el componente pueda manejarlo específicamente
    if (error.code && error.code.startsWith('auth/')) {
      throw error; // Firebase ya proporciona un error descriptivo
    }
    
    // Para errores de popup bloqueado
    if (error.code === 'auth/popup-blocked') {
      throw new Error('El popup fue bloqueado. Por favor, permite popups para este sitio e intenta de nuevo.');
    }
    
    // Para errores de popup cerrado
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('El popup fue cerrado antes de completar el login. Por favor, intenta de nuevo.');
    }
    
    // Error genérico solo si no es un error de Firebase
    throw new Error(error.message || 'No se pudo completar el inicio de sesión con Google. Por favor, intenta de nuevo.');
  }
}

/**
 * Signs in the user anonymously.
 * @param auth The Firebase Auth instance.
 * @returns A promise that resolves with the user credential.
 */
export const signInAsGuest = async (auth: Auth): Promise<UserCredential> => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential;
  } catch (error) {
    console.error('Error signing in as guest:', error);
    throw error;
  }
};

/**
 * Signs in the user with email and password.
 * @param auth The Firebase Auth instance.
 * @param email The user's email address.
 * @param password The user's password.
 * @returns A promise that resolves with the user credential.
 */
export const signInWithEmail = async (auth: Auth, email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    console.error('Error signing in with email:', error);
    throw error;
  }
};

/**
 * Creates a new user account with email and password.
 * @param auth The Firebase Auth instance.
 * @param email The user's email address.
 * @param password The user's password.
 * @returns A promise that resolves with the user credential.
 */
export const createUserWithEmail = async (auth: Auth, email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    console.error('Error creating user with email:', error);
    throw error;
  }
};

/**
 * Signs the current user out.
 * @param {Auth} auth - The Firebase Auth instance.
 * @returns {Promise<void>} A promise that resolves when sign-out is complete.
 */
export const signOut = async (auth: Auth): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};
