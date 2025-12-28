// App.js
import React, { useEffect } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { configureGoogleSignIn } from './src/firebase/auth';

function App() {
  useEffect(() => {
    // Configure Google Sign-In when app starts
    console.log('🚀 Initializing Google Sign-In...');
    try {
      configureGoogleSignIn();
      console.log('✅ App initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Google Sign-In:', error);
    }
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

export default App;