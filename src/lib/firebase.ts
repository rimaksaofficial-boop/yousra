import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration provided by user
export const firebaseConfig = {
  apiKey: "AIzaSyDSjb0gBCbKmnH65SKoEf16kef-xr89Bxw",
  authDomain: "yusradb-1d948.firebaseapp.com",
  projectId: "yusradb-1d948",
  storageBucket: "yusradb-1d948.firebasestorage.app",
  messagingSenderId: "487559591386",
  appId: "1:487559591386:web:eb5dabdc663aed92e67ce3",
  measurementId: "G-D74L8YTSGG"
};

// Initialize Firebase safely (avoid re-initialization)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with settings
export const db = getFirestore(app);
