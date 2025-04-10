# Fixing Google OAuth Issues

## Overview of the Problem
If you're seeing an "access denied" error when trying to sign in with Google, it's likely due to a misconfiguration in one of these areas:

1. Google Cloud Platform project settings
2. Firebase Authentication configuration
3. Expo/React Native app configuration

## Step 1: Check your Redirect URIs

When testing with Expo Go or development builds, the Google authentication system uses a proxy with a specific redirect URI. This URI must be registered in your Google Cloud Platform project.

From the debug screen, you should see a redirect URI that looks something like:
```
https://auth.expo.io/@your-expo-username/doggy-day
```

## Step 2: Google Cloud Platform Configuration

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "Credentials"
4. Find and edit your OAuth 2.0 Client ID

Make sure you have:
- Added the redirect URI from Step 1 to the "Authorized redirect URIs" list
- Added the correct iOS/Android app bundle identifiers as appropriate
- Set up the OAuth consent screen properly (especially if testing with a development account)

## Step 3: Firebase Configuration

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to "Authentication" > "Sign-in method"
4. Find and edit the Google provider

Make sure:
- The Google Sign-in provider is enabled
- The Web SDK configuration is using the correct Web Client ID
- The SHA-1 certificate fingerprint is added (for Android)
- The Google Cloud project is properly linked to your Firebase project

## Step 4: App Configuration

1. Check `app.json` to make sure your app's scheme is set correctly:
```json
{
  "expo": {
    "scheme": "doggyday"
    // other settings...
  }
}
```

2. Check `services/googleAuthService.js` to ensure your client IDs are correct:
```javascript
const GOOGLE_CLIENT_ID_IOS = 'your-ios-client-id.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_ANDROID = 'your-android-client-id.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_WEB = 'your-web-client-id.apps.googleusercontent.com';
```

3. For iOS, make sure your app's bundle identifier in Xcode matches what's registered in Firebase and Google Cloud.

4. For Android, ensure your package name and SHA-1 fingerprint match what's in Firebase.

## Step 5: Testing and Debugging

1. Use the debug screen (`/debug-auth`) to:
   - Verify your configuration
   - Test the Google sign-in flow
   - View detailed error messages

2. Common error messages and solutions:

   - **"access_denied"**: The OAuth consent screen is rejecting your request. Check that your redirect URI is properly registered and your OAuth consent screen is configured correctly.
   
   - **"invalid_client"**: Your client ID is incorrect or not properly set up. Double-check all client IDs in your app.
   
   - **"redirect_uri_mismatch"**: The URI in your auth request doesn't match one registered in Google Cloud. Add the exact URI from your debug screen to your Google Cloud configuration.

3. For development, consider adding test users to your OAuth consent screen if you're still in testing mode.

## Final Notes

- Remember that Google OAuth configurations can take a few minutes to propagate after changes.
- If testing on a physical device, ensure you're using the correct client ID for the platform.
- The Expo auth proxy (auth.expo.io) is used for development. For production builds, you'll need to configure direct URIs. 