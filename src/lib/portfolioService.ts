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

// Upload image to Firebase Storage
export const uploadImage = async (file: File): Promise<{ url: string; path: string }> => {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const path = `portfolio/${timestamp}_${safeName}`;
  const storageRef = ref(storage, path);
  
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  
  return { url, path };
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
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate()
  })) as PortfolioItem[];
};

// Add a new portfolio item
export const addPortfolioItem = async (item: Omit<PortfolioItem, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...item,
    createdAt: Timestamp.now()
  });
  return docRef.id;
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
