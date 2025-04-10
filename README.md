# DoggyDay App

A mobile application to help dog owners schedule and manage daycare, grooming, and boarding appointments for their pets.

## Google OAuth Authentication Setup

To fix the "Access blocked: Authorization Error" when signing in with Google, follow these steps:

1. **Google Cloud Console Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Select your project (ID: 599403821410)
   - Find your OAuth 2.0 Client ID or create a new one
   - Add these authorized redirect URIs:
     - `https://auth.expo.io/@your-expo-username/doggy-day`
     - `https://auth.expo.io/`
   - Make sure your app's bundle identifier is added to the iOS application list
   - Save the changes

2. **Firebase Console Setup**:
   - Go to [Firebase Console](https://console.firebase.google.com/project/doggyday-f0a8d/authentication/providers)
   - Select Authentication → Sign-in method
   - Make sure Google is enabled as a sign-in provider
   - In the Google provider settings, ensure the correct Web Client ID is selected

3. **App Configuration**:
   - Make sure your app.json has the correct scheme configured (currently "doggyday")
   - Check that the Google client IDs in services/googleAuthService.js are correct

## Debugging Authentication

If you're still experiencing authentication issues, use the built-in debug screen:
1. Open the app
2. Tap on "Debug Authentication" link at the bottom of the login screen
3. Use the "Check Config" button to verify your setup
4. Try the "Test Google Auth" button to test the authentication flow
5. Review the logs for any error messages

## Running the App

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npx expo start
   ```

3. Follow the instructions in the terminal to open the app on your device or simulator

## Development

- Firebase is used for authentication, data storage, and file storage
- Expo Router is used for navigation
- The app follows a modular structure with services, models, and components 