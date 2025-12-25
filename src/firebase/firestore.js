import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  setDoc,
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

// ===== CREATE =====

// Create a new document with auto-generated ID
export const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      success: true,
      id: docRef.id,
      data: { id: docRef.id, ...data }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Create a document with custom ID
export const createDocumentWithId = async (collectionName, docId, data) => {
  try {
    await setDoc(doc(db, collectionName, docId), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      success: true,
      id: docId,
      data: { id: docId, ...data }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// ===== READ =====

// Get a single document by ID
export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        success: true,
        data: { id: docSnap.id, ...docSnap.data() }
      };
    } else {
      return {
        success: false,
        error: 'Document not found'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Get all documents from a collection
export const getAllDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return {
      success: true,
      data: documents
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Query documents with conditions
export const queryDocuments = async (collectionName, conditions = []) => {
  try {
    let q = collection(db, collectionName);
    
    // Add where conditions
    conditions.forEach(condition => {
      if (condition.type === 'where') {
        q = query(q, where(condition.field, condition.operator, condition.value));
      } else if (condition.type === 'orderBy') {
        q = query(q, orderBy(condition.field, condition.direction || 'asc'));
      } else if (condition.type === 'limit') {
        q = query(q, limit(condition.value));
      }
    });
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return {
      success: true,
      data: documents
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// ===== UPDATE =====

// Update a document
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    return {
      success: true,
      id: docId,
      data: { id: docId, ...data }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// ===== DELETE =====

// Delete a document
export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    
    return {
      success: true,
      id: docId
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// ===== USER-SPECIFIC FUNCTIONS =====

// Create user profile in Firestore
export const createUserProfile = async (uid, userData) => {
  return await createDocumentWithId('users', uid, userData);
};

// Get user profile
export const getUserProfile = async (uid) => {
  return await getDocument('users', uid);
};

// Update user profile
export const updateUserProfile = async (uid, userData) => {
  return await updateDocument('users', uid, userData);
};

// Create user type
export const createUserType = async (typeData) => {
  return await createDocument('userTypes', typeData);
};

// Get all user types
export const getAllUserTypes = async () => {
  return await getAllDocuments('userTypes');
};
