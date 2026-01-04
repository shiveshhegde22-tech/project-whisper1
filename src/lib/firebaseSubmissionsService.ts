import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  addDoc,
  deleteDoc,
  Timestamp
} from "firebase/firestore";
import { sendSubmissionNotification } from "@/lib/notificationService";

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

const COLLECTION_NAME = "contacts";

// Get all submissions from Firestore
export const getFirebaseSubmissions = async (): Promise<Submission[]> => {
  try {
    const submissionsRef = collection(db, COLLECTION_NAME);
    const q = query(submissionsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        projectType: data.projectType || '',
        budgetRange: data.budget || data.budgetRange || '',
        projectDetails: data.message || data.projectDetails || '',
        status: (data.status as 'new' | 'replied' | 'archived') || 'new',
        submittedAt: data.createdAt?.toDate?.() || new Date(data.createdAt) || new Date(),
        notes: data.notes || undefined
      };
    });
  } catch (error) {
    console.error("Error fetching submissions from Firebase:", error);
    return [];
  }
};

// Add a new submission
export const addFirebaseSubmission = async (submission: Omit<Submission, 'id'>): Promise<string> => {
  try {
    const submissionsRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(submissionsRef, {
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      projectType: submission.projectType,
      budget: submission.budgetRange,
      message: submission.projectDetails,
      status: submission.status,
      createdAt: Timestamp.fromDate(submission.submittedAt),
      notes: submission.notes
    });

    // Send notification email (fire and forget - don't block submission)
    sendSubmissionNotification({
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      projectType: submission.projectType,
      budget: submission.budgetRange,
      message: submission.projectDetails
    }).catch(err => console.error("Failed to send notification:", err));

    return docRef.id;
  } catch (error) {
    console.error("Error adding submission:", error);
    throw new Error("Failed to add submission.");
  }
};

// Update submission status
export const updateFirebaseSubmissionStatus = async (id: string, status: Submission['status']): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error("Error updating status:", error);
    throw new Error("Failed to update submission status.");
  }
};

// Update submission notes
export const updateFirebaseSubmissionNotes = async (id: string, notes: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { notes });
  } catch (error) {
    console.error("Error updating notes:", error);
    throw new Error("Failed to update submission notes.");
  }
};

// Delete a submission
export const deleteFirebaseSubmission = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting submission:", error);
    throw new Error("Failed to delete submission.");
  }
};

// Get submission stats
export const getFirebaseSubmissionStats = (submissions: Submission[]) => {
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
