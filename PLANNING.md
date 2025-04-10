# DoggyDay App Planning Document

## Project Overview
DoggyDay is a mobile application designed to help dog owners schedule and manage daycare, grooming, and boarding appointments for their pets. The app allows users to create profiles for their dogs, schedule various types of appointments, and receive updates about their pets.

## Technology Stack
- **Frontend**: React Native with Expo
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **State Management**: React Context API
- **Navigation**: Expo Router

## Project Structure
```
/
├── app/                  # Expo Router app directory
│   ├── index.tsx         # Home screen
│   ├── _layout.tsx       # Root layout with AuthProvider
│   ├── (auth)/           # Authentication screens
│   ├── (tabs)/           # Main app tabs
│   └── ...
├── assets/               # App images, fonts, etc.
├── components/           # Reusable UI components
├── context/              # React Context providers
│   └── AuthContext.js    # Authentication context
├── hooks/                # Custom React hooks
├── models/               # Data models
│   ├── Dog.js            # Dog model
│   └── Appointment.js    # Appointment model
├── services/             # Service functions
│   └── firebaseService.js# Firebase service functions
├── firebaseConfig.js     # Firebase configuration
└── ...
```

## Firebase Setup

### 1. Creating a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create a Firestore database
5. Set up Storage for pet images

### 2. Firebase Configuration
Update the `firebaseConfig.js` file with your Firebase project credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### 3. Firestore Database Structure

#### Collections:
1. `users`
   - User profiles and preferences

2. `dogs`
   - Dog profiles linked to owners
   - Fields: name, breed, age, weight, owner (user ID), notes, etc.

3. `appointments`
   - Scheduled appointments for dogs
   - Fields: dogId, date, startTime, endTime, service, notes, status, etc.

## Authentication Flow
The app uses Firebase Authentication for user management:

1. **Sign Up**: New users create an account with email and password
2. **Log In**: Existing users sign in with their credentials
3. **Persistence**: Authentication state is persisted between app launches
4. **Protected Routes**: Certain screens are only accessible to authenticated users

## Data Access Patterns

### Dog Management
- Create new dog profiles
- Update existing dog information
- View all dogs belonging to the logged-in user
- Delete a dog profile

### Appointment Management
- Schedule new appointments
- View upcoming and past appointments
- Filter appointments by dog, date, or service type
- Cancel or reschedule appointments

## Firebase Security Rules
Firestore security rules ensure that:
1. Users can only read and write their own data
2. Dog profiles can only be accessed by their owners
3. Appointments can only be viewed and modified by the owner of the associated dog

## Getting Started
1. Clone the repository
2. Install dependencies with `npm install`
3. Create a Firebase project and update `firebaseConfig.js`
4. Run the app with `npx expo start` 