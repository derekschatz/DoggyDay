import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Platform, TextInput } from 'react-native';
import { useAuth } from '../context/AuthContext';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Clipboard from 'expo-clipboard';

export default function DebugAuthScreen() {
  const { user, loginWithGoogle, isGoogleAuthReady } = useAuth();
  const [debugInfo, setDebugInfo] = useState({});
  const [error, setError] = useState(null);
  const [testEmail, setTestEmail] = useState('');
  const [showTestUserSection, setShowTestUserSection] = useState(false);

  // Get debug information for OAuth
  useEffect(() => {
    async function getDebugInfo() {
      try {
        // Get redirect URI info
        const redirectUri = AuthSession.makeRedirectUri({
          useProxy: true,
          scheme: 'doggyday'
        });

        // Get platform info
        const platformInfo = {
          OS: Platform.OS,
          Version: Platform.Version,
          isExpo: !!global.expo,
          constants: Platform.constants,
        };

        // Get discovery info
        const discovery = {
          authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
          tokenEndpoint: 'https://oauth2.googleapis.com/token',
        };

        // Check client IDs from googleAuthService
        const clientIds = {
          current: Platform.select({
            ios: '599403821410-up67qso1eilohnd465571rvp722o1il8.apps.googleusercontent.com',
            android: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
            default: '599403821410-5t5nbo9ktiotf0dfhh8bfrn2kigk9ip3.apps.googleusercontent.com',
          }),
          ios: '599403821410-up67qso1eilohnd465571rvp722o1il8.apps.googleusercontent.com',
          web: '599403821410-5t5nbo9ktiotf0dfhh8bfrn2kigk9ip3.apps.googleusercontent.com',
        };

        setDebugInfo({
          redirectUri,
          platformInfo,
          discovery,
          clientIds,
          appScheme: process.env.EXPO_PUBLIC_APP_SCHEME || 'doggyday',
          user: user ? {
            uid: user.uid,
            email: user.email,
            providerData: user.providerData,
          } : 'Not signed in',
        });
      } catch (err) {
        console.error('Error getting debug info:', err);
        setError(err.message);
      }
    }

    getDebugInfo();
  }, [user]);

  const testGoogleAuth = async () => {
    try {
      setError(null);
      console.log('Testing Google Auth...');
      const result = await loginWithGoogle();
      console.log('Google Auth Result:', result ? 'Success' : 'Failed');
    } catch (err) {
      console.error('Google Auth Error:', err);
      setError(err.message);
    }
  };

  const openGoogleConsole = () => {
    WebBrowser.openBrowserAsync('https://console.cloud.google.com/apis/credentials');
  };

  const openFirebaseConsole = () => {
    WebBrowser.openBrowserAsync('https://console.firebase.google.com/project/_/authentication/providers');
  };

  const openOAuthConsentScreen = () => {
    WebBrowser.openBrowserAsync('https://console.cloud.google.com/apis/credentials/consent');
  };

  const copyToClipboard = async (text) => {
    if (text) {
      try {
        await Clipboard.setStringAsync(text);
        alert('Copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        alert('Failed to copy to clipboard');
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Auth Debug Info</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>OAuth Test</Text>
        <Button
          title="Test Google Sign In"
          onPress={testGoogleAuth}
          disabled={!isGoogleAuthReady}
        />
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Error:</Text>
            <Text style={styles.errorText}>{error}</Text>
            
            {error.includes('access_denied') && (
              <View style={styles.errorHint}>
                <Text style={styles.hintText}>
                  ⚠️ "access_denied" usually means you need to add test users to your OAuth consent screen
                  or check that your OAuth consent screen is properly configured.
                </Text>
                <Button 
                  title="Go to OAuth Consent Screen"
                  onPress={openOAuthConsentScreen}
                />
                <Button 
                  title="Show Test User Section" 
                  onPress={() => setShowTestUserSection(true)}
                />
              </View>
            )}
          </View>
        )}
      </View>

      {showTestUserSection && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Users</Text>
          <Text style={styles.guideText}>
            If your OAuth consent screen is in Testing mode, you need to add test users:
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter test user email"
            value={testEmail}
            onChangeText={setTestEmail}
            keyboardType="email-address"
          />
          <Button 
            title="Copy to Clipboard"
            onPress={() => copyToClipboard(testEmail)}
          />
          <Text style={styles.guideText}>
            1. Go to Google Cloud Console OAuth consent screen
          </Text>
          <Text style={styles.guideText}>
            2. Scroll down to "Test users" section
          </Text>
          <Text style={styles.guideText}>
            3. Click "+ ADD USERS"
          </Text>
          <Text style={styles.guideText}>
            4. Add the email address you're trying to use for testing
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuration Links</Text>
        <Button
          title="Open Google API Console"
          onPress={openGoogleConsole}
        />
        <View style={styles.buttonSpacer} />
        <Button
          title="Open OAuth Consent Screen"
          onPress={openOAuthConsentScreen}
        />
        <View style={styles.buttonSpacer} />
        <Button
          title="Open Firebase Auth Console"
          onPress={openFirebaseConsole}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Debug Information</Text>
        {Object.entries(debugInfo).map(([key, value]) => (
          <View key={key} style={styles.debugItem}>
            <Text style={styles.debugLabel}>{key}:</Text>
            <Text style={styles.debugValue}>
              {typeof value === 'object' 
                ? JSON.stringify(value, null, 2) 
                : String(value)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Access Denied Troubleshooting</Text>
        <Text style={styles.guideText}>
          1. Make sure you've added the exact redirect URI shown above to the "Authorized redirect URIs" list in your Google Cloud OAuth client configuration.
        </Text>
        <Text style={styles.guideText}>
          2. If your OAuth consent screen is in "Testing" mode, you must add test users:
          - Go to OAuth consent screen
          - Add your Google account email as a test user
        </Text>
        <Text style={styles.guideText}>
          3. Verify you have the correct client ID for your platform (iOS/Android/Web).
        </Text>
        <Text style={styles.guideText}>
          4. Try clearing your Google account's permissions:
          - Visit https://myaccount.google.com/permissions
          - Remove your app from the list and try again
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  debugItem: {
    marginBottom: 10,
  },
  debugLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  debugValue: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  errorContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#ffeeee',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ff8888',
  },
  errorTitle: {
    fontWeight: 'bold',
    color: '#cc0000',
    marginBottom: 5,
  },
  errorText: {
    color: '#cc0000',
  },
  errorHint: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fffaed',
    borderRadius: 5,
  },
  hintText: {
    marginBottom: 10,
  },
  buttonSpacer: {
    height: 10,
  },
  guideText: {
    marginBottom: 8,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
}); 