import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/context/AuthContext'; // ✅ Named import with {}
import LoginScreen from './src/screens/auth/LoginScreen';
// Import your other screens here

const Stack = createStackNavigator();

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          {/* Add your other screens here */}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;