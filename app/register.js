import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle, isGoogleAuthReady } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      router.replace('/');
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      if (user) {
        router.replace('/');
      }
    } catch (error) {
      Alert.alert('Google Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Sign Up', headerShown: true }} />
      
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started with DoggyDay</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Button
          title={loading ? "Creating Account..." : "Create Account"}
          onPress={handleRegister}
          disabled={loading}
        />
        
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>
        
        <Button
          title="Sign up with Google"
          onPress={handleGoogleSignUp}
          disabled={loading || !isGoogleAuthReady}
          color="#DB4437"
        />
        
        <TouchableOpacity 
          style={styles.linkContainer}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.link}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    color: '#007BFF',
  },
}); 