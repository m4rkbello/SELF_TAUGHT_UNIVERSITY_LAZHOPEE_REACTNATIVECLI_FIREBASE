import { 
  ref, 
  set, 
  get, 
  update, 
  remove,
  onValue,
  push,
  child
} from 'firebase/database';
import { realtimeDb } from './config';

// Write data
export const writeData = async (path, data) => {
  try {
    await set(ref(realtimeDb, path), data);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Read data once
export const readData = async (path) => {
  try {
    const snapshot = await get(ref(realtimeDb, path));
    if (snapshot.exists()) {
      return {
        success: true,
        data: snapshot.val()
      };
    } else {
      return {
        success: false,
        error: 'No data available'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Listen to data changes
export const listenToData = (path, callback) => {
  const dataRef = ref(realtimeDb, path);
  return onValue(dataRef, (snapshot) => {
    callback(snapshot.val());
  });
};

// Update data
export const updateData = async (path, updates) => {
  try {
    await update(ref(realtimeDb, path), updates);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete data
export const deleteData = async (path) => {
  try {
    await remove(ref(realtimeDb, path));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Push new child
export const pushData = async (path, data) => {
  try {
    const newRef = push(ref(realtimeDb, path));
    await set(newRef, data);
    return {
      success: true,
      id: newRef.key
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};