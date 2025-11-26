import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

const firebaseConfig = {

  apiKey: "AIzaSyD8F6oYTMnQWwyMLwcl87-rg_DUJYD3CUg",

  authDomain: "domiburguer.firebaseapp.com",

  projectId: "domiburguer",

  storageBucket: "domiburguer.firebasestorage.app",

  messagingSenderId: "722900966985",

  appId: "1:722900966985:web:d16ef02fe7b8678745e998",

  measurementId: "G-RJVW3FJFX3"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized:', app, firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
// export const db = getFirestore(app);

export default app;