import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigation from './AuthNavigator';
// Import your main app screens here
// import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

function AppNavigation() {
  // You can add authentication state management here
  const isAuthenticated = false; // Replace with actual auth state

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigation />
      ) : (
        <Stack.Navigator>
          {/* Add your authenticated screens here */}
          {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default AppNavigation;