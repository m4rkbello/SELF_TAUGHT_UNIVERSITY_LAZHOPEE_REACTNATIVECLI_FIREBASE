// firebase/auth.js
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
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In with YOUR ACTUAL Web Client ID
export const configureGoogleSignIn = () => {
  try {
    // ✅ THIS IS YOUR ACTUAL WEB CLIENT ID from google-services.json
    const webClientId = '656684881970-9bu6iidogjm9bbforsm5afbm44rra7v3.apps.googleusercontent.com';
    
    GoogleSignin.configure({
      webClientId: webClientId,
      offlineAccess: true, // Changed to true for better token handling
      forceCodeForRefreshToken: true, // Helps get fresh tokens
    });
    
    console.log('✅ Google Sign-In configured successfully');
    console.log('📱 Web Client ID:', webClientId);
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
    console.error('Sign up error:', error);
    return {
      success: false,
      error: getErrorMessage(error.code)
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
    console.error('Sign in error:', error);
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

// Sign in with Google - COMPLETE FIXED VERSION
export const signInWithGoogle = async () => {
  try {
    console.log('🔵 Starting Google Sign-In...');
    
    // Step 1: Check if device supports Google Play Services
    await GoogleSignin.hasPlayServices({ 
      showPlayServicesUpdateDialog: true 
    });
    console.log('✅ Google Play Services available');
    
    // Step 2: Trigger Google Sign-In flow
    console.log('🔵 Opening Google Sign-In dialog...');
    const userInfo = await GoogleSignin.signIn();
    console.log('✅ User signed in:', userInfo.user?.email);
    
    // Step 3: Get the ID token - TRY MULTIPLE WAYS
    let idToken = null;
    
    // Try method 1: From userInfo.data
    if (userInfo.data?.idToken) {
      idToken = userInfo.data.idToken;
      console.log('✅ Got ID token from userInfo.data');
    }
    // Try method 2: From userInfo directly
    else if (userInfo.idToken) {
      idToken = userInfo.idToken;
      console.log('✅ Got ID token from userInfo');
    }
    // Try method 3: Get tokens separately
    else {
      console.log('🔵 Trying to get tokens separately...');
      const tokens = await GoogleSignin.getTokens();
      idToken = tokens.idToken;
      console.log('✅ Got ID token from getTokens()');
    }
    
    // Check if we got the token
    if (!idToken) {
      console.error('❌ No ID token found in response');
      console.log('Full response:', JSON.stringify(userInfo, null, 2));
      throw new Error('No ID token found. Please try again.');
    }
    
    console.log('✅ ID Token obtained:', idToken.substring(0, 20) + '...');
    
    // Step 4: Create a Google credential with the token
    const googleCredential = GoogleAuthProvider.credential(idToken);
    console.log('✅ Google credential created');
    
    // Step 5: Sign in to Firebase with the Google credential
    console.log('🔵 Signing in to Firebase...');
    const result = await signInWithCredential(auth, googleCredential);
    console.log('✅ Firebase sign-in successful!');
    console.log('👤 User:', result.user.email);
    
    return {
      success: true,
      user: result.user
    };
  } catch (error) {
    console.error('❌ Google Sign-In Error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Handle specific error codes
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return {
        success: false,
        error: 'Sign in was cancelled'
      };
    } else if (error.code === statusCodes.IN_PROGRESS) {
      return {
        success: false,
        error: 'Sign in is already in progress'
      };
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return {
        success: false,
        error: 'Google Play Services not available or outdated'
      };
    }
    
    return {
      success: false,
      error: error.message || 'Google Sign-In failed. Please try again.'
    };
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    
    // Also sign out from Google
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      await GoogleSignin.signOut();
    }
    
    return { 
      success: true,
      message: 'Signed out successfully'
    };
  } catch (error) {
    console.error('Sign out error:', error);
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
    return { 
      success: true,
      message: 'Password reset email sent!'
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: getErrorMessage(error.code)
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

// Helper function to get user-friendly error messages
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/operation-not-allowed': 'Operation not allowed.',
    'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
  };
  
  return errorMessages[errorCode] || 'An error occurred. Please try again.';
};