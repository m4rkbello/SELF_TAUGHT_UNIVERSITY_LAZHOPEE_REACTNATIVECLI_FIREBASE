import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/context/AuthContext';
import { configureGoogleSignIn } from './src/firebase/auth';
import LoginScreen from './src/screens/auth/LoginScreen';

const Stack = createStackNavigator();

function App() {
  // Configure Google Sign-In IMMEDIATELY when app starts
  useEffect(() => {
    console.log('🔧 Configuring Google Sign-In...');
    configureGoogleSignIn();
    console.log('✅ Google Sign-In configured');
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;