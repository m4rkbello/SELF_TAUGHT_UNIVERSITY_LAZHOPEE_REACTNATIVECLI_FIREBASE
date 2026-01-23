import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');

function DashboardScreen({ navigation }) {
  const { user, signOut } = useAuth();
  console.log(user,"TEST!");

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            const result = await signOut();
            if (result.success) {
              // Navigation will be handled by auth state change
              Alert.alert('Success', 'Logged out successfully');
            } else {
              Alert.alert('Error', result.error || 'Failed to logout');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* User Profile Card */}
      <View style={styles.profileCard}>
        {user?.photoURL ? (
          <Image
            source={{ uri: user.photoURL }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileImageText}>
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </Text>
          </View>
        )}

        <Text style={styles.displayName}>
          {user?.displayName || 'User'}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>

        {/* Authentication Provider Badge */}
        <View style={styles.providerBadge}>
          <Text style={styles.providerText}>
            {user?.providerData?.[0]?.providerId === 'google.com'
              ? '🔐 Signed in with Google'
              : '📧 Signed in with Email'}
          </Text>
        </View>
      </View>

      {/* User Information Card */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Account Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>User ID:</Text>
          <Text style={styles.infoValue} numberOfLines={1}>
            {user?.uid}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Display Name:</Text>
          <Text style={styles.infoValue}>
            {user?.displayName || 'Not set'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email Verified:</Text>
          <Text style={[
            styles.infoValue,
            user?.emailVerified ? styles.verified : styles.notVerified
          ]}>
            {user?.emailVerified ? '✓ Verified' : '✗ Not Verified'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Account Created:</Text>
          <Text style={styles.infoValue}>
            {user?.metadata?.creationTime
              ? new Date(user.metadata.creationTime).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Last Sign In:</Text>
          <Text style={styles.infoValue}>
            {user?.metadata?.lastSignInTime
              ? new Date(user.metadata.lastSignInTime).toLocaleString()
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Provider:</Text>
          <Text style={styles.infoValue}>
            {user?.provider || 'Unknown'}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsCard}>
        <Text style={styles.cardTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('Feature', 'Edit profile coming soon!')}
        >
          <Text style={styles.actionButtonText}>✏️ Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('Feature', 'Settings coming soon!')}
        >
          <Text style={styles.actionButtonText}>⚙️ Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('Feature', 'Help & Support coming soon!')}
        >
          <Text style={styles.actionButtonText}>❓ Help & Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: width * 0.035,
  },
  profileCard: {
    backgroundColor: '#fff',
    margin: width * 0.05,
    padding: width * 0.05,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#b1fd03',
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#b1fd03',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImageText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  displayName: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: width * 0.04,
    color: '#666',
    marginBottom: 15,
  },
  providerBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  providerText: {
    fontSize: width * 0.035,
    color: '#2e7d32',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: width * 0.05,
    marginBottom: width * 0.05,
    padding: width * 0.05,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: width * 0.04,
    color: '#666',
    fontWeight: '600',
    flex: 1,
  },
  infoValue: {
    fontSize: width * 0.04,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  verified: {
    color: '#4caf50',
    fontWeight: '600',
  },
  notVerified: {
    color: '#ff9800',
    fontWeight: '600',
  },
  actionsCard: {
    backgroundColor: '#fff',
    marginHorizontal: width * 0.05,
    marginBottom: width * 0.1,
    padding: width * 0.05,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionButtonText: {
    fontSize: width * 0.04,
    color: '#333',
    fontWeight: '600',
  },
});

export default DashboardScreen;