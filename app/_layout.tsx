import React, { useEffect } from 'react';
import { Stack, Redirect, useSegments, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { AuthProvider, useAuth } from '../context/AuthContext';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

// Initialize the WebBrowser for OAuth authentication
WebBrowser.maybeCompleteAuthSession();

// This is a wrapper component that redirects based on auth state
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const router = useRouter();
  const { user, loading } = useAuth();

  // When auth state changes, check if the user needs to be redirected
  useEffect(() => {
    if (loading) return;

    const isAuthRoute = segments[0] === 'login' || segments[0] === 'register' || segments[0] === 'debug-auth';
    
    // If not authenticated and not on an auth route, redirect to login
    if (!user && !isAuthRoute) {
      router.replace('/login');
    } 
    // If authenticated and on an auth route (except debug), redirect to home
    else if (user && isAuthRoute && segments[0] !== 'debug-auth') {
      router.replace('/');
    }
  }, [user, loading, segments, router]);

  if (loading) {
    // You could add a loading screen here if desired
    return null;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  // Make sure we're ready for auth
  useFrameworkReady();
  
  // Ensure WebBrowser is initialized for auth
  useEffect(() => {
    // Log important information to help debug OAuth issues
    console.log('App scheme:', process.env.EXPO_PUBLIC_APP_SCHEME || 'doggyday');
    console.log('Platform:', Platform.OS);
  }, []);

  return (
    <AuthProvider>
      <AuthWrapper>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" options={{ headerShown: true, title: 'Sign In' }} />
          <Stack.Screen name="register" options={{ headerShown: true, title: 'Sign Up' }} />
          <Stack.Screen name="index" options={{ headerShown: true, title: 'DoggyDay' }} />
          <Stack.Screen name="debug-auth" options={{ headerShown: true, title: 'Auth Debug' }} />
          <Stack.Screen name="+not-found" options={{ headerShown: true, title: 'Not Found' }} />
          <Stack.Screen name="test-firebase" options={{ headerShown: true, title: 'Firebase Test' }} />
        </Stack>
      </AuthWrapper>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
