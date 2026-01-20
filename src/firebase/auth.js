import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithCredential,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config.js';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configure Google SignIn
GoogleSignin.configure({
  webClientId: '656684881970-9bu6iidogjm9bbforsm5afbm44rra7v3.apps.googleusercontent.com',
  offlineAccess: true,
  scopes: ['profile', 'email'],
});

console.log('✅ Auth module loaded, using auth from config');

// Helper function to ensure auth is initialized
const getAuth = () => {
  if (!auth) {
    console.error('❌ Auth is not initialized!');
    throw new Error('Authentication service is not available');
  }
  return auth;
};

// Sign Up with Email
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

// Sign In with Email
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

// Sign In with Google - FIXED VERSION
export const signInWithGoogle = async () => {
  try {
    console.log('🔵 Starting Google Sign-In...');
    
    // Check if Google Play Services are available
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    
    // Sign in and get user info
    const userInfo = await GoogleSignin.signIn();
    console.log('✅ Google Sign-In successful, user info:', userInfo);
    
    // IMPORTANT FIX: Get idToken from userInfo object
    const idToken = userInfo.data?.idToken || userInfo.idToken;
    
    if (!idToken) {
      console.error('❌ No idToken received from Google Sign-In');
      console.log('Full userInfo object:', JSON.stringify(userInfo, null, 2));
      throw new Error('No ID token received from Google Sign-In');
    }
    
    console.log('✅ ID Token received, creating Firebase credential...');

    const currentAuth = getAuth();
    const googleCredential = GoogleAuthProvider.credential(idToken);
    
    console.log('✅ Credential created, signing in to Firebase...');
    const result = await signInWithCredential(currentAuth, googleCredential);
    const user = result.user;
    
    console.log('✅ Firebase sign-in successful:', user.uid);

    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      console.log('🔵 Creating new user document...');
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
      console.log('✅ User document created');
      return { success: true, user: { uid: user.uid, email: user.email, ...userData } };
    }

    const userData = userDoc.data();
    console.log('✅ User document retrieved');
    return { success: true, user: { uid: user.uid, email: user.email, ...userData } };
    
  } catch (error) {
    console.error('❌ Google Sign-In error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    let errorMessage = 'Google Sign-In failed';
    
    if (error.code === 'CANCELED' || error.code === '-5') {
      errorMessage = 'Sign-in cancelled by user.';
    } else if (error.code === 'SIGN_IN_CANCELLED') {
      errorMessage = 'Sign-in cancelled.';
    } else if (error.code === 'IN_PROGRESS') {
      errorMessage = 'Sign-in already in progress.';
    } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
      errorMessage = 'Google Play Services not available.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

// Log Out
export const logOut = async () => {
  try {
    console.log('🔵 Logging out...');
    
    // Sign out from Google if signed in
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      await GoogleSignin.signOut();
      console.log('✅ Google sign-out successful');
    }
    
    const currentAuth = getAuth();
    await signOut(currentAuth);
    console.log('✅ Firebase logout successful');
    return { success: true };
  } catch (error) {
    console.error('❌ Logout error:', error);
    return { success: false, error: error.message || 'Logout failed' };
  }
};

// Observe Auth State
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
    return () => {};
  }
};

// Reset Password
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

export { auth };