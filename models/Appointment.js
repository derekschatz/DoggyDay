// Appointment Model
/*
  Fields:
  - id: string (auto-generated by Firestore)
  - dogId: string (reference to a dog)
  - date: timestamp
  - startTime: timestamp
  - endTime: timestamp
  - service: string (e.g., "daycare", "grooming", "boarding")
  - notes: string
  - status: string (e.g., "scheduled", "confirmed", "completed", "canceled")
  - paymentStatus: string (e.g., "pending", "paid", "refunded")
  - createdAt: timestamp
  - updatedAt: timestamp
*/

import { addDocument, updateDocument, deleteDocument, getDocument, queryCollection } from '../services/firebaseService';

const COLLECTION_NAME = 'appointments';

export const createAppointment = async (appointmentData) => {
  return await addDocument(COLLECTION_NAME, appointmentData);
};

export const updateAppointment = async (appointmentId, appointmentData) => {
  return await updateDocument(COLLECTION_NAME, appointmentId, appointmentData);
};

export const deleteAppointment = async (appointmentId) => {
  return await deleteDocument(COLLECTION_NAME, appointmentId);
};

export const getAppointment = async (appointmentId) => {
  return await getDocument(COLLECTION_NAME, appointmentId);
};

export const getAppointmentsByDog = async (dogId) => {
  const conditions = [
    { field: 'dogId', operator: '==', value: dogId }
  ];
  const sortOptions = [
    { field: 'date', direction: 'asc' },
    { field: 'startTime', direction: 'asc' }
  ];
  
  return await queryCollection(COLLECTION_NAME, conditions, sortOptions);
};

export const getAppointmentsByDate = async (startDate, endDate) => {
  const conditions = [
    { field: 'date', operator: '>=', value: startDate },
    { field: 'date', operator: '<=', value: endDate }
  ];
  const sortOptions = [
    { field: 'date', direction: 'asc' },
    { field: 'startTime', direction: 'asc' }
  ];
  
  return await queryCollection(COLLECTION_NAME, conditions, sortOptions);
};

export const getAppointmentsByOwner = async (ownerId) => {
  // This function requires a join between dogs and appointments
  // For simplicity, we'll need to first get all dogs owned by this user
  // Then get all appointments for each dog
  // This would be better handled with a cloud function or a more complex query
  // But for now, we'll keep it simple with client-side joining
  
  const dogsConditions = [
    { field: 'owner', operator: '==', value: ownerId }
  ];
  
  const dogsSnapshot = await queryCollection('dogs', dogsConditions);
  const dogIds = dogsSnapshot.map(dog => dog.id);
  
  if (dogIds.length === 0) {
    return [];
  }
  
  // Now get all appointments for these dogs
  const appointmentsConditions = [
    { field: 'dogId', operator: 'in', value: dogIds }
  ];
  const sortOptions = [
    { field: 'date', direction: 'asc' },
    { field: 'startTime', direction: 'asc' }
  ];
  
  return await queryCollection(COLLECTION_NAME, appointmentsConditions, sortOptions);
}; 