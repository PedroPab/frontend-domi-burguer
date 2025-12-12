import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

/**
 * Configuración de Firebase
 * En producción, estas variables deben estar en .env.local
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD8F6oYTMnQWwyMLwcl87-rg_DUJYD3CUg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "domiburguer.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "domiburguer",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "domiburguer.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "722900966985",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:722900966985:web:d16ef02fe7b8678745e998",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-RJVW3FJFX3"
};

/**
 * Inicializar Firebase solo si no hay instancias existentes
 */
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

/**
 * Servicios de Firebase
 */
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Configurar emuladores para desarrollo local si es necesario
 */
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  console.log('Firebase emulators connected');
}

export default app;