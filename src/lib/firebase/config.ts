// File: src/lib/firebase/config.ts

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIZXifgdbJaXaXCYDCbiaEjhtK_EmRx6Y",
  authDomain: "pro8link.firebaseapp.com",
  projectId: "pro8link",
  storageBucket: "pro8link.firebasestorage.app",
  messagingSenderId: "774283933568",
  appId: "1:774283933568:web:782caec5caab818e26b365"
};

// Initialize Firebase
let app: FirebaseApp | null = null;

// Check if all required Firebase config keys are present
const hasAllKeys = 
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId;

if (hasAllKeys) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
} else {
    console.error("Firebase config is missing or incomplete. Please check your environment variables.");
}

export { app };
