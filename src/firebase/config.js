import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBXMqv7fmnLN8NvybRAMdLKlhRHYiP0jXc",
  authDomain: "lazhopee-1b1bf.firebaseapp.com",
  projectId: "lazhopee-1b1bf",
  storageBucket: "lazhopee-1b1bf.firebasestorage.app",
  messagingSenderId: "656684881970",
  appId: "1:656684881970:android:1dd7970db23600120e842b",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDb = getDatabase(app);

console.log('✅ Firebase initialized:', {
  auth: !!auth,
  db: !!db,
  storage: !!storage,
  realtimeDb: !!realtimeDb,
  app: !!app
});

export default app;