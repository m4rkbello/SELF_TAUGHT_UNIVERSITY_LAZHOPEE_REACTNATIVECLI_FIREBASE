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

  useEffect(() => {
    console.log('👂 Setting up auth state listener...');
    
    // Listen to auth state changes
    const unsubscribe = observeAuthState((user) => {
      console.log('🔔 Auth state changed:', user ? user.email : 'No user');
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    setError(null);
    setLoading(true);
    
    console.log('🔵 Signing in with email:', email);
    const result = await signInWithEmail(email, password);
    
    if (!result.success) {
      console.error('❌ Sign in failed:', result.error);
      setError(result.error);
    } else {
      console.log('✅ Sign in successful');
    }
    
    setLoading(false);
    return result;
  };

  const signUp = async (email, password, displayName) => {
    setError(null);
    setLoading(true);
    
    console.log('🔵 Signing up with email:', email);
    const result = await signUpWithEmail(email, password, displayName);
    
    if (!result.success) {
      console.error('❌ Sign up failed:', result.error);
      setError(result.error);
    } else {
      console.log('✅ Sign up successful');
    }
    
    setLoading(false);
    return result;
  };

  const googleSignIn = async () => {
    setError(null);
    setLoading(true);
    
    console.log('🔵 Starting Google Sign-In...');
    const result = await signInWithGoogle();
    
    if (!result.success) {
      console.error('❌ Google Sign-In failed:', result.error);
      setError(result.error);
    } else {
      console.log('✅ Google Sign-In successful:', result.user.email);
    }
    
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setError(null);
    setLoading(true);
    
    console.log('🔵 Signing out...');
    const result = await logOut();
    
    if (!result.success) {
      console.error('❌ Sign out failed:', result.error);
      setError(result.error);
    } else {
      console.log('✅ Sign out successful');
    }
    
    setLoading(false);
    return result;
  };

  const forgotPassword = async (email) => {
    setError(null);
    
    console.log('🔵 Sending password reset to:', email);
    const result = await resetPassword(email);
    
    if (!result.success) {
      console.error('❌ Password reset failed:', result.error);
      setError(result.error);
    } else {
      console.log('✅ Password reset email sent');
    }
    
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
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