import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signUpWithEmail, 
  signInWithEmail, 
  signInWithGoogle, 
  logOut, 
  observeAuthState 
} from '../firebase/auth';
import { 
  createUserProfile, 
  getUserProfile, 
  updateUserProfile 
} from '../firebase/firestore';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = observeAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Fetch user profile from Firestore
        const profileResult = await getUserProfile(firebaseUser.uid);
        if (profileResult.success) {
          setUserProfile(profileResult.data);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up function
  const signUp = async (email, password, displayName, userType = 'user') => {
    try {
      setError(null);
      const result = await signUpWithEmail(email, password, displayName);
      
      if (result.success) {
        // Create user profile in Firestore
        const profileData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: displayName || result.user.email.split('@')[0],
          userType: userType,
          photoURL: result.user.photoURL || null,
          createdAt: new Date().toISOString()
        };
        
        await createUserProfile(result.user.uid, profileData);
        setUserProfile(profileData);
        
        return { success: true, user: result.user };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmail(email, password);
      
      if (result.success) {
        return { success: true, user: result.user };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Google sign in function
  const googleSignIn = async () => {
    try {
      setError(null);
      const result = await signInWithGoogle();
      
      if (result.success) {
        // Check if user profile exists
        const profileResult = await getUserProfile(result.user.uid);
        
        if (!profileResult.success) {
          // Create profile if it doesn't exist
          const profileData = {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            userType: 'user',
            photoURL: result.user.photoURL,
            provider: 'google',
            createdAt: new Date().toISOString()
          };
          
          await createUserProfile(result.user.uid, profileData);
          setUserProfile(profileData);
        }
        
        return { success: true, user: result.user };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setError(null);
      await logOut();
      setUser(null);
      setUserProfile(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Update profile function
  const updateProfile = async (updates) => {
    try {
      setError(null);
      if (!user) throw new Error('No user logged in');
      
      const result = await updateUserProfile(user.uid, updates);
      
      if (result.success) {
        setUserProfile({ ...userProfile, ...updates });
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    googleSignIn,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};