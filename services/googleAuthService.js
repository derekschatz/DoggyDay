import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Platform } from 'react-native';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import {
  GOOGLE_CLIENT_ID_IOS,
  GOOGLE_CLIENT_ID_WEB
} from '@env';

// WebBrowser.maybeCompleteAuthSession() needs to be called at the top level
// This should be called in your App.js or _layout.tsx
WebBrowser.maybeCompleteAuthSession();

// Debug redirect URI to see what's being used
const logRedirectUri = (uri) => {
  console.log('Generated Redirect URI:', uri);
  return uri;
};

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: GOOGLE_CLIENT_ID_IOS,
    expoClientId: GOOGLE_CLIENT_ID_WEB,
  });

  const signInWithGoogleAsync = async () => {
    try {
      const result = await promptAsync();
      
      if (result.type === 'success') {
        const { id_token, access_token } = result.params;
        
        // Create a Google credential with the tokens
        const credential = GoogleAuthProvider.credential(id_token, access_token);
        
        // Sign in with Firebase using the credential
        const userCredential = await signInWithCredential(auth, credential);
        return userCredential.user;
      } else {
        console.log('Google Sign In was cancelled or failed:', result);
        return null;
      }
    } catch (error) {
      console.error('Error in Google sign in flow:', error);
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