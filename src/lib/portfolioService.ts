import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  Timestamp
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { db, storage } from "./firebase";

export interface PortfolioItem {
  id?: string;
  title: string;
  roomType: string;
  projectType: string;
  budgetRange: string;
  imageUrl: string;
  imagePath?: string;
  createdAt?: Date;
}

const COLLECTION_NAME = "portfolio";

// Helper to add timeout to promises
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, errorMsg: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(errorMsg)), timeoutMs)
    )
  ]);
};

// Upload image to Firebase Storage
export const uploadImage = async (file: File): Promise<{ url: string; path: string }> => {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const path = `portfolio/${timestamp}_${safeName}`;
  const storageRef = ref(storage, path);
  
  try {
    await withTimeout(
      uploadBytes(storageRef, file),
      30000,
      "Image upload timed out. Please check if Firebase Storage is enabled in your Firebase Console."
    );
    
    const url = await withTimeout(
      getDownloadURL(storageRef),
      10000,
      "Failed to get image URL. Please try again."
    );
    
    return { url, path };
  } catch (error: any) {
    if (error?.code === 'storage/unauthorized') {
      throw new Error("Storage access denied. Please update Firebase Storage security rules to allow uploads.");
    }
    if (error?.code === 'storage/object-not-found') {
      throw new Error("Firebase Storage is not configured. Please enable Storage in Firebase Console.");
    }
    throw error;
  }
};

// Delete image from Firebase Storage
export const deleteImage = async (imagePath: string): Promise<void> => {
  if (!imagePath) return;
  try {
    const storageRef = ref(storage, imagePath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

// Get all portfolio items
export const getPortfolioItems = async (): Promise<PortfolioItem[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const querySnapshot = await withTimeout(
      getDocs(q),
      15000,
      "Failed to load portfolio. Please check if Firestore database exists in Firebase Console."
    );
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    })) as PortfolioItem[];
  } catch (error: any) {
    if (error?.message?.includes('not exist') || error?.code === 'not-found') {
      throw new Error("Firestore database not found. Please create it in Firebase Console.");
    }
    throw error;
  }
};

// Add a new portfolio item
export const addPortfolioItem = async (item: Omit<PortfolioItem, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await withTimeout(
      addDoc(collection(db, COLLECTION_NAME), {
        ...item,
        createdAt: Timestamp.now()
      }),
      15000,
      "Failed to save portfolio item. Please check if Firestore database exists in Firebase Console."
    );
    return docRef.id;
  } catch (error: any) {
    if (error?.message?.includes('not exist') || error?.code === 'not-found') {
      throw new Error("Firestore database not found. Please create it in Firebase Console.");
    }
    if (error?.code === 'permission-denied') {
      throw new Error("Permission denied. Please update Firestore security rules.");
    }
    throw error;
  }
};

// Update a portfolio item
export const updatePortfolioItem = async (id: string, item: Partial<PortfolioItem>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, item);
};

// Delete a portfolio item
export const deletePortfolioItem = async (id: string, imagePath?: string): Promise<void> => {
  if (imagePath) {
    await deleteImage(imagePath);
  }
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};

// Room type options for filters
export const ROOM_TYPES = [
  "All",
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Dining"
] as const;

// Project type options
export const PROJECT_TYPES = [
  "3BHK Residence",
  "2BHK Residence",
  "Villa",
  "Penthouse",
  "Kitchen Remodel",
  "Bathroom Remodel",
  "Renovation"
] as const;

// Budget range options
export const BUDGET_RANGES = [
  "₹10L - 30L",
  "₹30L - 50L",
  "₹50L - 1CR",
  "₹1CR - 2CR",
  "₹2CR+"
] as const;
