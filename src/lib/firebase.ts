import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';

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
 * Firebase Cloud Messaging
 * Solo disponible en el navegador y si el navegador soporta notificaciones
 */
let messaging: Messaging | null = null;

export const getMessagingInstance = async (): Promise<Messaging | null> => {
  if (typeof window === 'undefined') return null;

  const supported = await isSupported();
  if (!supported) return null;

  if (!messaging) {
    messaging = getMessaging(app);
  }
  return messaging;
};

/**
 * Obtener token de FCM para notificaciones push
 */
export const getFCMToken = async (): Promise<string | null> => {
  try {
    const messagingInstance = await getMessagingInstance();
    if (!messagingInstance) return null;

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.warn('VAPID key not configured');
      return null;
    }

    const token = await getToken(messagingInstance, { vapidKey });
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

/**
 * Escuchar mensajes en foreground
 */
export const onForegroundMessage = (callback: (payload: unknown) => void) => {
  getMessagingInstance().then((messagingInstance) => {
    if (messagingInstance) {
      onMessage(messagingInstance, callback);
    }
  });
};

/**
 * Configurar emuladores para desarrollo local si es necesario
 */
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {

  //miramos si estamos en que url estamos , pues  esa misma vamos a usar para el emulador de auth
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

  connectAuthEmulator(auth, `http://${hostname}:9099`);
  connectFirestoreEmulator(db, hostname, 8080);
  console.log('Firebase emulators connected');
}

export default app;