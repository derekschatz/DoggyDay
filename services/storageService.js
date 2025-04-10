import { storage } from '../firebaseConfig';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

/**
 * Upload a file to Firebase Storage
 * @param {File|Blob} file - The file to upload
 * @param {string} path - The path in storage to upload to (e.g., 'dogs/image1.jpg')
 * @param {Function} progressCallback - Optional callback for upload progress
 * @returns {Promise<string>} - A promise that resolves with the download URL
 */
export const uploadFile = (file, path, progressCallback = null) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        // Progress updates
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progressCallback) {
          progressCallback(progress);
        }
      },
      (error) => {
        // Error handling
        reject(error);
      },
      () => {
        // Upload completed successfully
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL);
          })
          .catch((error) => {
            reject(error);
          });
      }
    );
  });
};

/**
 * Get the download URL for a file in Firebase Storage
 * @param {string} path - The path of the file in storage
 * @returns {Promise<string>} - A promise that resolves with the download URL
 */
export const getFileUrl = async (path) => {
  try {
    const fileRef = ref(storage, path);
    return await getDownloadURL(fileRef);
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 * @param {string} path - The path of the file to delete
 * @returns {Promise<boolean>} - A promise that resolves when the file is deleted
 */
export const deleteFile = async (path) => {
  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Generate a unique file path for storage
 * @param {string} userId - The user ID
 * @param {string} directory - The directory to store in (e.g., 'dogs', 'profiles')
 * @param {string} fileExtension - The file extension (e.g., '.jpg', '.png')
 * @returns {string} - A unique file path
 */
export const generateFilePath = (userId, directory, fileExtension) => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${directory}/${userId}_${timestamp}_${randomString}${fileExtension}`;
}; 