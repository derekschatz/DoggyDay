import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { db, auth, storage } from '../firebaseConfig';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, getBytes, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Stack } from 'expo-router';

export default function TestFirebase() {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLogMessage = (message, isSuccess = true) => {
    setTestResults(prev => [...prev, { message, isSuccess, timestamp: new Date().toISOString() }]);
  };

  const runFirebaseTest = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      // Test 1: Check if Firebase is initialized
      addLogMessage('Starting Firebase connection test...');
      
      if (db) {
        addLogMessage('✅ Firebase Firestore is initialized');
      } else {
        addLogMessage('❌ Firebase Firestore initialization failed', false);
        return;
      }
      
      if (auth) {
        addLogMessage('✅ Firebase Auth is initialized');
      } else {
        addLogMessage('❌ Firebase Auth initialization failed', false);
        return;
      }
      
      if (storage) {
        addLogMessage('✅ Firebase Storage is initialized');
      } else {
        addLogMessage('❌ Firebase Storage initialization failed', false);
        return;
      }
      
      // Test 2: Write to Firestore
      addLogMessage('Testing write operation to Firestore...');
      
      try {
        const docRef = await addDoc(collection(db, 'tests'), {
          message: 'Test message',
          createdAt: serverTimestamp()
        });
        
        addLogMessage(`✅ Successfully wrote to Firestore. Document ID: ${docRef.id}`);
      } catch (error) {
        addLogMessage(`❌ Firestore write test failed: ${error.message}`, false);
      }
      
      // Test 3: Read from Firestore
      addLogMessage('Testing read operation from Firestore...');
      
      try {
        const querySnapshot = await getDocs(collection(db, 'tests'));
        const documentsCount = querySnapshot.size;
        
        addLogMessage(`✅ Successfully read from Firestore. Found ${documentsCount} test documents.`);
      } catch (error) {
        addLogMessage(`❌ Firestore read test failed: ${error.message}`, false);
      }

      // Test 4: Test Firebase Storage
      addLogMessage('Testing Firebase Storage...');
      
      try {
        // Create a simple text file to upload
        const testData = 'This is a test file for Firebase Storage';
        const bytes = new Uint8Array([...testData].map(char => char.charCodeAt(0)));
        
        // Upload the file
        const storageRef = ref(storage, 'tests/test-file.txt');
        await uploadBytes(storageRef, bytes);
        
        addLogMessage('✅ Successfully uploaded file to Firebase Storage');
        
        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);
        addLogMessage(`✅ Successfully generated download URL: ${downloadURL.substring(0, 50)}...`);
        
      } catch (error) {
        addLogMessage(`❌ Firebase Storage test failed: ${error.message}`, false);
      }
      
      addLogMessage('Firebase connection tests completed.');
      
    } catch (error) {
      addLogMessage(`❌ An unexpected error occurred: ${error.message}`, false);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Firebase Test', headerShown: true }} />
      
      <Text style={styles.title}>Firebase Connection Test</Text>
      
      <Button 
        title={isLoading ? "Testing..." : "Run Firebase Test"} 
        onPress={runFirebaseTest} 
        disabled={isLoading}
      />
      
      <ScrollView style={styles.logContainer}>
        {testResults.map((result, index) => (
          <Text 
            key={index} 
            style={[
              styles.logMessage, 
              result.isSuccess ? styles.successMessage : styles.errorMessage
            ]}
          >
            {result.message}
          </Text>
        ))}
        
        {testResults.length === 0 && !isLoading && (
          <Text style={styles.placeholderText}>
            Press the button above to test Firebase connection
          </Text>
        )}
        
        {isLoading && (
          <Text style={styles.placeholderText}>
            Running tests...
          </Text>
        )}
      </ScrollView>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  logContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    flex: 1,
  },
  logMessage: {
    fontSize: 14,
    marginBottom: 6,
    paddingVertical: 4,
  },
  successMessage: {
    color: '#28a745',
  },
  errorMessage: {
    color: '#dc3545',
  },
  placeholderText: {
    textAlign: 'center',
    color: '#6c757d',
    marginTop: 20,
  },
}); 