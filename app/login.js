import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, isGoogleAuthReady } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      if (user) {
        router.replace('/');
      }
    } catch (error) {
      Alert.alert('Google Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const goToDebug = () => {
    router.push('/debug-auth');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Login', headerShown: true }} />
      
      <Text style={styles.title}>DoggyDay</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>

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

        <Button
          title={loading ? "Signing in..." : "Sign In"}
          onPress={handleLogin}
          disabled={loading}
        />
        
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>
        
        <Button
          title="Sign in with Google"
          onPress={handleGoogleLogin}
          disabled={loading || !isGoogleAuthReady}
          color="#DB4437"
        />
        
        <TouchableOpacity 
          style={styles.linkContainer}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.link}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.linkContainer, { marginTop: 10 }]}
          onPress={goToDebug}
        >
          <Text style={[styles.link, { fontSize: 12 }]}>Debug Authentication</Text>
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