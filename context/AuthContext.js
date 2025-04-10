import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { signIn, signUp, logOut } from '../services/firebaseService';
import { useGoogleAuth } from '../services/googleAuthService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize Google authentication hook
  const googleAuth = useGoogleAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      const user = await signIn(email, password);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      const user = await signUp(email, password);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logOut();
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  const loginWithGoogle = async () => {
    try {
      return await googleAuth.signInWithGoogleAsync();
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
    isGoogleAuthReady: !!googleAuth.request
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 