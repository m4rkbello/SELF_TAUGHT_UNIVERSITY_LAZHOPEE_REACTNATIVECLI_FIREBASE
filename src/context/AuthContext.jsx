import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle,
  logOut, 
  observeAuthState,
  resetPassword 
} from '../firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    console.log('👂 AuthProvider: Setting up auth state listener...');
    
    const initTimeout = setTimeout(() => {
      // Listen to auth state changes
      const unsubscribe = observeAuthState((user) => {
        console.log('🔔 AuthProvider: Auth state changed:', user ? user.email : 'No user');
        setUser(user);
        setLoading(false);
        setAuthReady(true);
      });

      // Cleanup subscription on unmount
      return () => {
        console.log('👋 AuthProvider: Cleaning up auth listener');
        unsubscribe();
      };
    }, 1000);

    return () => clearTimeout(initTimeout);
  }, []);

  const signIn = async (email, password) => {
    if (!authReady) {
      console.error('❌ Auth not ready yet');
      return { success: false, error: 'Authentication service is initializing, please wait...' };
    }
    
    setError(null);
    setLoading(true);
    
    console.log('🔵 AuthProvider: Signing in with email:', email);
    const result = await signInWithEmail(email, password);
    
    if (!result.success) {
      console.error('❌ AuthProvider: Sign in failed:', result.error);
      setError(result.error);
    } else {
      console.log('✅ AuthProvider: Sign in successful');
      setUser(result.user);
    }
    
    setLoading(false);
    return result;
  };

  const signUp = async (email, password, userData) => {
    if (!authReady) {
      console.error('❌ Auth not ready yet');
      return { success: false, error: 'Authentication service is initializing, please wait...' };
    }
    
    setError(null);
    setLoading(true);
    
    console.log('🔵 AuthProvider: Signing up with email:', email);
    const result = await signUpWithEmail(email, password, userData);
    
    if (!result.success) {
      console.error('❌ AuthProvider: Sign up failed:', result.error);
      setError(result.error);
    } else {
      console.log('✅ AuthProvider: Sign up successful');
      setUser(result.user);
    }
    
    setLoading(false);
    return result;
  };

  const googleSignIn = async () => {
    if (!authReady) {
      console.error('❌ Auth not ready yet');
      return { success: false, error: 'Authentication service is initializing, please wait...' };
    }
    
    setError(null);
    setLoading(true);
    
    console.log('🔵 AuthProvider: Starting Google Sign-In...');
    const result = await signInWithGoogle();
    
    if (!result.success) {
      console.error('❌ AuthProvider: Google Sign-In failed:', result.error);
      setError(result.error);
    } else {
      console.log('✅ AuthProvider: Google Sign-In successful:', result.user.email);
      setUser(result.user);
    }
    
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    if (!authReady) {
      console.error('❌ Auth not ready yet');
      return { success: false, error: 'Authentication service is initializing, please wait...' };
    }
    
    setError(null);
    setLoading(true);
    
    console.log('🔵 AuthProvider: Signing out...');
    const result = await logOut();
    
    if (!result.success) {
      console.error('❌ AuthProvider: Sign out failed:', result.error);
      setError(result.error);
    } else {
      console.log('✅ AuthProvider: Sign out successful');
      setUser(null);
    }
    
    setLoading(false);
    return result;
  };

  const forgotPassword = async (email) => {
    if (!authReady) {
      console.error('❌ Auth not ready yet');
      return { success: false, error: 'Authentication service is initializing, please wait...' };
    }
    
    setError(null);
    
    console.log('🔵 AuthProvider: Sending password reset to:', email);
    const result = await resetPassword(email);
    
    if (!result.success) {
      console.error('❌ AuthProvider: Password reset failed:', result.error);
      setError(result.error);
    } else {
      console.log('✅ AuthProvider: Password reset email sent');
    }
    
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        authReady,
        signIn,
        signUp,
        googleSignIn,
        signOut,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};