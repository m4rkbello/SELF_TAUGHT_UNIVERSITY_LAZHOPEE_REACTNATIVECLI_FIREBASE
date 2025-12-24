import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <Image
          source={require('../assets/images/logo.png')} // Add your logo path
          style={styles.logo}
          resizeMode="contain"
        />
        {/* Or use a placeholder if you don't have a logo yet */}
        {/* <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>LP</Text>
        </View> */}
        
        <Text style={styles.title}>Welcome to LazhoPee</Text>
        <Text style={styles.subtitle}>
          Your one-stop shop for everything you need
        </Text>
      </View>

      {/* Button Section */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, styles.buttonOutlineText]}>
            Sign Up
          </Text>
        </TouchableOpacity>

        {/* Optional: Guest/Browse Button */}
        <TouchableOpacity
          style={styles.guestButton}
          onPress={() => {
            // Navigate to main app or browse as guest
            console.log('Browse as guest');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.guestButtonText}>Browse as Guest</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our{' '}
          <Text style={styles.footerLink}>Terms</Text> &{' '}
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.08, // 8% padding
    paddingVertical: height * 0.05, // 5% padding
  },
  logoSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.5, // 50% of screen width
    height: width * 0.5,
    maxWidth: 200,
    maxHeight: 200,
    marginBottom: height * 0.03,
  },
  // Use this if you don't have a logo image yet
  logoPlaceholder: {
    width: width * 0.5,
    height: width * 0.5,
    maxWidth: 200,
    maxHeight: 200,
    backgroundColor: '#b1fd03',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.03,
    shadowColor: '#b1fd03',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  logoText: {
    fontSize: width * 0.15,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: width * 0.08, // Responsive font size
    fontWeight: 'bold',
    marginBottom: height * 0.015,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: width * 0.04,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: width * 0.1,
    lineHeight: width * 0.06,
  },
  buttonSection: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#b1fd03',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginVertical: height * 0.01,
    shadowColor: '#b1fd03',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#b1fd03',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#333',
    fontSize: width * 0.045,
    fontWeight: '700',
  },
  buttonOutlineText: {
    color: '#b1fd03',
  },
  guestButton: {
    marginTop: height * 0.015,
    alignItems: 'center',
    paddingVertical: height * 0.015,
  },
  guestButtonText: {
    color: '#999',
    fontSize: width * 0.038,
    fontWeight: '500',
  },
  footer: {
    paddingVertical: height * 0.02,
    alignItems: 'center',
  },
  footerText: {
    fontSize: width * 0.032,
    color: '#999',
    textAlign: 'center',
    lineHeight: width * 0.05,
  },
  footerLink: {
    color: '#b1fd03',
    fontWeight: '600',
  },
});

export default WelcomeScreen;