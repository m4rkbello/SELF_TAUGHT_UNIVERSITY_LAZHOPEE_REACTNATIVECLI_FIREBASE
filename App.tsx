import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
 
// Login Component
const LoginScreen = ({ onNavigate }) => {
  const { signIn, googleSignIn, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    
    if (result.success) {
      // Navigation will be handled automatically by AuthProvider
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await googleSignIn();
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Login to Lazhopee</h1>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        
        <button 
          onClick={handleLogin} 
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
        
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          style={styles.googleButton}
        >
          Sign in with Google
        </button>
        
        <p>
          Don't have an account?{' '}
          <span 
            onClick={() => onNavigate('signup')} 
            style={styles.link}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

// Signup Component
const SignupScreen = ({ onNavigate }) => {
  const { signUp, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [userType, setUserType] = useState('user');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    const result = await signUp(email, password, displayName, userType);
    setLoading(false);
    
    if (result.success) {
      // Will auto-navigate to dashboard
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Sign Up for Lazhopee</h1>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          style={styles.input}
        />
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          style={styles.input}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="seller">Seller</option>
        </select>
        
        <button 
          onClick={handleSignup}
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
        
        <p>
          Already have an account?{' '}
          <span 
            onClick={() => onNavigate('login')}
            style={styles.link}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};