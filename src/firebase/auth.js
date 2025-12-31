import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithCredential,
  updateProfile,
  getReactNativePersistence
} from '../firebase/auth.js';
import { doc, setDoc, getDoc, serverTimestamp } from '../firebase/firestore';
import { initializeAuth } from '../firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { app, db } from './config';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// 🔥 CRITICAL: Initialize auth here to avoid circular dependency
let auth;

// Initialize auth if it's not already initialized
try {
  if (app) {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
    console.log('✅ Auth initialized in auth.js');
  } else {
    console.error('❌ App not initialized');
  }
} catch (error) {
  console.error('❌ Error initializing auth in auth.js:', error);
}

// Configure Google SignIn
GoogleSignin.configure({
  webClientId: '656684881970-9bu6iidogjm9bbforsm5afbm44rra7v3.apps.googleusercontent.com',
});

// Helper function to ensure auth is initialized
const getAuth = () => {
  if (!auth) {
    console.error('❌ Auth is not initialized!');
    throw new Error('Authentication service is not available');
  }
  return auth;
};

// Export functions that use auth and db
export const signUpWithEmail = async (email, password, userData) => {
  try {
    console.log('🔵 Creating user account...');
    
    const currentAuth = getAuth();
    
    const userCredential = await createUserWithEmailAndPassword(currentAuth, email, password);
    const user = userCredential.user;

    console.log('✅ Auth account created:', user.uid);

    const displayName = `${userData.firstName} ${userData.lastName}`;
    await updateProfile(user, { displayName });

    const userDocData = {
      firstName: userData.firstName,
      middleName: userData.middleName || '',
      lastName: userData.lastName,
      email: email.toLowerCase(),
      contactNo: userData.contactNo,
      displayName,
      createdAt: serverTimestamp(),
      provider: 'email',
      uid: user.uid
    };

    await setDoc(doc(db, 'users', user.uid), userDocData);
    console.log('✅ User data saved to Firestore');

    return { success: true, user: { uid: user.uid, email: user.email, ...userDocData } };
  } catch (error) {
    console.error('❌ Sign up error:', error);
    let errorMessage = 'Registration failed';
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already registered. Please login instead.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address format.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password must be at least 6 characters long.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password sign-up is not enabled. Please contact support.';
        break;
      default:
        errorMessage = error.message || 'Registration failed';
    }
    return { success: false, error: errorMessage };
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    console.log('🔵 Signing in with email...');
    
    const currentAuth = getAuth();
    
    const userCredential = await signInWithEmailAndPassword(currentAuth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.exists() ? userDoc.data() : { displayName: user.displayName };

    console.log('✅ Sign in successful');
    return { success: true, user: { uid: user.uid, email: user.email, ...userData } };
  } catch (error) {
    console.error('❌ Sign in error:', error);
    let errorMessage = 'Login failed';
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        errorMessage = 'Invalid email or password.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address format.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later.';
        break;
      default:
        errorMessage = error.message || 'Login failed';
    }
    return { success: false, error: errorMessage };
  }
};

export const signInWithGoogle = async () => {
  try {
    console.log('🔵 Starting Google Sign-In...');
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { idToken } = await GoogleSignin.signIn();

    const currentAuth = getAuth();
    const googleCredential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(currentAuth, googleCredential);
    const user = result.user;

    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      const nameParts = user.displayName?.split(' ') || [];
      const userData = {
        firstName: nameParts[0] || '',
        middleName: '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email,
        contactNo: user.phoneNumber || '',
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        provider: 'google',
        uid: user.uid
      };
      await setDoc(doc(db, 'users', user.uid), userData);
      return { success: true, user: { uid: user.uid, email: user.email, ...userData } };
    }

    const userData = userDoc.data();
    return { success: true, user: { uid: user.uid, email: user.email, ...userData } };
  } catch (error) {
    console.error('❌ Google Sign-In error:', error);
    let errorMessage = 'Google Sign-In failed';
    if (error.code === 'CANCELED') errorMessage = 'Sign-in cancelled.';
    return { success: false, error: errorMessage || 'Google Sign-In failed' };
  }
};

export const logOut = async () => {
  try {
    console.log('🔵 Logging out...');
    const currentAuth = getAuth();
    await signOut(currentAuth);
    console.log('✅ Logout successful');
    return { success: true };
  } catch (error) {
    console.error('❌ Logout error:', error);
    return { success: false, error: error.message || 'Logout failed' };
  }
};

export const observeAuthState = (callback) => {
  try {
    const currentAuth = getAuth();
    
    console.log('👂 Setting up auth state listener...');
    return onAuthStateChanged(currentAuth, async (firebaseUser) => {
      console.log('🔔 Auth state changed:', firebaseUser ? firebaseUser.email : 'No user');
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : { displayName: firebaseUser.displayName };
          callback({ uid: firebaseUser.uid, email: firebaseUser.email, ...userData });
        } catch (error) {
          console.error('❌ Error fetching user data:', error);
          callback({ uid: firebaseUser.uid, email: firebaseUser.email, displayName: firebaseUser.displayName });
        }
      } else {
        callback(null);
      }
    });
  } catch (error) {
    console.error('❌ Error setting up auth listener:', error);
    // Return empty unsubscribe function
    return () => {};
  }
};

export const resetPassword = async (email) => {
  try {
    const currentAuth = getAuth();
    await sendPasswordResetEmail(currentAuth, email);
    return { success: true };
  } catch (error) {
    let errorMessage = 'Failed to send reset email';
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address format.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many requests. Please try again later.';
        break;
      default:
        errorMessage = error.message || 'Failed to send reset email';
    }
    return { success: false, error: errorMessage };
  }
};

// Export auth for other files to use
export { auth };