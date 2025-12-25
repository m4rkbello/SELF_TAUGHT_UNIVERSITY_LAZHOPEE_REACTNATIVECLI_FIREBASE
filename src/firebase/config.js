const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Mock Firebase initialization (replace with actual Firebase in your project)
const initializeFirebase = () => {
  console.log('Firebase initialized with config:', firebaseConfig);
  return { config: firebaseConfig };
};