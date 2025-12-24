import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // Add your registration logic here
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return;
    }
    console.log('Register:', fullName, email, password);
  };

  const handleGoogleSignup = () => {
    // Add your Google signup logic here
    console.log('Google Sign Up');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')} // Add your logo path
            style={styles.logo}
            resizeMode="contain"
          />
          {/* Or use a placeholder if you don't have a logo yet */}
          {/* <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>LazhoPee</Text>
          </View> */}
        </View>

        {/* Title */}
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        {/* Google Sign Up Button */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignup}
        >
          <Image
            source={require('../../assets/images/google.png')} // Add Google icon
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        {/* Full Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          autoCorrect={false}
        />

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        {/* Confirm Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        {/* Password Requirements */}
        <Text style={styles.passwordHint}>
          Password must be at least 8 characters
        </Text>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Terms and Conditions */}
        <Text style={styles.termsText}>
          By signing up, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* Back to Welcome */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back to Welcome</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: width * 0.08, // 8% of screen width
    paddingVertical: height * 0.04, // 4% of screen height
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  logo: {
    width: width * 0.35, // 35% of screen width
    height: width * 0.35,
    maxWidth: 130,
    maxHeight: 130,
  },
  // Use this if you don't have a logo image yet
  logoPlaceholder: {
    width: width * 0.35,
    height: width * 0.35,
    maxWidth: 130,
    maxHeight: 130,
    backgroundColor: '#b1fd03',
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: width * 0.08, // Responsive font size
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: height * 0.008,
  },
  subtitle: {
    fontSize: width * 0.04,
    textAlign: 'center',
    color: '#666',
    marginBottom: height * 0.025,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: height * 0.016,
    borderRadius: 10,
    marginBottom: height * 0.02,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#333',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: width * 0.035,
    color: '#999',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: height * 0.016,
    borderRadius: 10,
    marginVertical: height * 0.008,
    fontSize: width * 0.04,
    backgroundColor: '#f9f9f9',
  },
  passwordHint: {
    fontSize: width * 0.032,
    color: '#999',
    marginTop: height * 0.005,
    marginBottom: height * 0.01,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#b1fd03',
    padding: height * 0.018,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: height * 0.015,
    shadowColor: '#b1fd03',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: '600',
  },
  termsText: {
    fontSize: width * 0.032,
    color: '#999',
    textAlign: 'center',
    marginTop: height * 0.02,
    lineHeight: width * 0.05,
  },
  termsLink: {
    color: '#b1fd03',
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.025,
  },
  loginText: {
    fontSize: width * 0.04,
    color: '#666',
  },
  loginLink: {
    fontSize: width * 0.04,
    color: '#b1fd03',
    fontWeight: '600',
  },
  backButton: {
    marginTop: height * 0.02,
    alignItems: 'center',
    paddingBottom: height * 0.02,
  },
  backButtonText: {
    color: '#999',
    fontSize: width * 0.035,
  },
});

export default RegisterScreen;