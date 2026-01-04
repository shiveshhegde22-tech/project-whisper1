import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc,
  query,
  orderBy,
  Timestamp
} from "firebase/firestore";
import { db } from "./firebase";

export interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
  projectDetails: string;
  status: 'new' | 'replied' | 'archived';
  submittedAt: Date;
  notes?: string;
}

const COLLECTION_NAME = "submissions";

// Get all submissions
export const getSubmissions = async (): Promise<Submission[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("submittedAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate() || new Date()
    })) as Submission[];
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }
};

// Update submission status
export const updateSubmissionStatus = async (id: string, status: Submission['status']): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { status });
};

// Update submission notes
export const updateSubmissionNotes = async (id: string, notes: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { notes });
};

// Get submission stats
export const getSubmissionStats = (submissions: Submission[]) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const newSubmissions = submissions.filter(s => s.submittedAt >= sevenDaysAgo);
  
  const budgetValues: Record<string, number> = {
    "₹10L - 30L": 20,
    "₹30L - 50L": 40,
    "₹50L - 1CR": 75,
    "₹1CR - 2CR": 150,
    "₹2CR+": 250,
  };
  
  const avgBudget = submissions.length > 0
    ? submissions.reduce((acc, s) => acc + (budgetValues[s.budgetRange] || 50), 0) / submissions.length
    : 0;
  
  return {
    total: submissions.length,
    newCount: newSubmissions.length,
    avgBudget: `₹${avgBudget.toFixed(0)}L avg`
  };
};
