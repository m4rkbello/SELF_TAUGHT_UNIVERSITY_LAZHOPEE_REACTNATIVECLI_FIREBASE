// App.js
import React, { useEffect } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  useEffect(() => {
    // Google Sign-In is already configured in auth.js
    console.log('🚀 App initialized successfully');
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

export default App;