import { db, auth } from '../firebaseConfig';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';

// Authentication functions
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signInWithGoogle = async (idToken) => {
  try {
    // Create a Google credential with the token
    const googleCredential = GoogleAuthProvider.credential(idToken);
    
    // Sign in with the credential
    const userCredential = await signInWithCredential(auth, googleCredential);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (displayName, photoURL) => {
  try {
    await updateProfile(auth.currentUser, {
      displayName,
      photoURL
    });
    return auth.currentUser;
  } catch (error) {
    throw error;
  }
};

// Firestore functions
export const getDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const getCollection = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

export const queryCollection = async (collectionName, conditions = [], sortOptions = []) => {
  try {
    let q = collection(db, collectionName);
    
    if (conditions.length > 0) {
      const queryConstraints = conditions.map(condition => 
        where(condition.field, condition.operator, condition.value)
      );
      q = query(q, ...queryConstraints);
    }
    
    if (sortOptions.length > 0) {
      const orderByOptions = sortOptions.map(option => 
        orderBy(option.field, option.direction || 'asc')
      );
      q = query(q, ...orderByOptions);
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

export const addDocument = async (collectionName, data) => {
  try {
    const timestamp = serverTimestamp();
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const updateDocument = async (collectionName, documentId, data) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

export const deleteDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    throw error;
  }
}; 