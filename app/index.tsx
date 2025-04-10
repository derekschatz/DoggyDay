import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to DoggyDay!</Text>
      
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>
            Hello, {user.displayName || user.email || 'User'}!
          </Text>
          <Text style={styles.emailText}>{user.email}</Text>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <Button title="Test Firebase Connection" onPress={() => router.push('/test-firebase')} />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={handleLogout} color="#DB4437" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  userInfo: {
    marginBottom: 30,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '500',
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 10,
  },
}); 