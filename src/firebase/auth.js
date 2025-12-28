import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from './config';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  try {

    const webClientId = '656684881970-xxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com';
    
    GoogleSignin.configure({
      webClientId: webClientId,
      offlineAccess: false,
    });
    
    console.log('✅ Google Sign-In configured with Web Client ID');
    console.log('Web Client ID:', webClientId);
  } catch (error) {
    console.error('❌ Error configuring Google Sign-In:', error);
    throw error;
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
    }
    
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Sign in with Google - FIXED FOR REACT NATIVE
export const signInWithGoogle = async () => {
  try {
    // Check if device supports Google Play Services
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    
    // Trigger Google Sign-In flow
    const response = await GoogleSignin.signIn();
    
    // Get the ID token from the response
    const idToken = response.data?.idToken;
    
    if (!idToken) {
      throw new Error('No ID token found');
    }
    
    // Create a Google credential with the token
    const googleCredential = GoogleAuthProvider.credential(idToken);
    
    // Sign in to Firebase with the Google credential
    const result = await signInWithCredential(auth, googleCredential);
    
    return {
      success: true,
      user: result.user
    };
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    return {
      success: false,
      error: error.message || 'Google Sign-In failed'
    };
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    // Also sign out from Google
    await GoogleSignin.signOut();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Password reset
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Auth state observer
export const observeAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};