import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Platform } from 'react-native';
import { makeRedirectUri } from 'expo-auth-session';
import { signInWithGoogle } from './firebaseService';

// WebBrowser.maybeCompleteAuthSession() needs to be called at the top level
// This should be called in your App.js or _layout.tsx
WebBrowser.maybeCompleteAuthSession();

// These need to be registered in your Firebase console and Google Cloud Console
const GOOGLE_CLIENT_ID_IOS = '599403821410-up67qso1eilohnd465571rvp722o1il8.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_ANDROID = 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_WEB = '599403821410-5t5nbo9ktiotf0dfhh8bfrn2kigk9ip3.apps.googleusercontent.com';

// Debug redirect URI to see what's being used
const logRedirectUri = (uri) => {
  console.log('Redirect URI:', uri);
  return uri;
};

export const useGoogleAuth = () => {
  // Use the appropriate client ID based on platform
  const clientId = Platform.select({
    ios: GOOGLE_CLIENT_ID_IOS,
    android: GOOGLE_CLIENT_ID_ANDROID,
    default: GOOGLE_CLIENT_ID_WEB,
  });

  console.log('Using client ID for platform:', Platform.OS, clientId);

  // Create the redirect URI using Expo's proxy
  const redirectUri = logRedirectUri(makeRedirectUri({
    useProxy: true,
    // Make sure this scheme matches what's in app.json
    scheme: 'doggyday'
  }));

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId,
    redirectUri,
    // Add any additional scopes you need
    scopes: ['profile', 'email'],
    // Use Expo auth proxy to handle the redirect
    useProxy: true,
    // Add this to see the response for debugging
    responseType: 'id_token',
  });

  const signInWithGoogleAsync = async () => {
    try {
      console.log('Starting Google Auth flow');
      const result = await promptAsync();
      console.log('Google Auth result type:', result.type);
      
      if (result.type === 'success') {
        // Get the access token from the response
        const { id_token } = result.params;
        console.log('Got ID token, signing in with Firebase');
        
        // Use the token to sign in with Firebase
        const user = await signInWithGoogle(id_token);
        return user;
      } else {
        // Better error logging for debugging
        console.log("Sign in was not successful:", result);
        if (result.type === 'error') {
          console.error('OAuth Error:', result.error);
        }
        return null;
      }
    } catch (error) {
      console.error('Error with Google sign in:', error);
      throw error;
    }
  };

  return {
    request,
    response,
    signInWithGoogleAsync,
    isLoading: !!request,
  };
};

// We can remove this function since it's not being used and could cause issues
// export const initGoogleAuth = async () => { ... } 