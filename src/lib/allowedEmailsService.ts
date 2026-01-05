import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export interface AllowedEmail {
  id: string;
  email: string;
}

// Get all allowed emails from Firebase
export const getAllowedEmails = async (): Promise<string[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "allowed_emails"));
    return querySnapshot.docs.map(doc => doc.data().email?.toLowerCase() || "");
  } catch (error) {
    console.error("Error fetching allowed emails:", error);
    return [];
  }
};

// Check if an email is allowed
export const isEmailAllowed = async (email: string): Promise<boolean> => {
  if (!email) return false;
  const allowedEmails = await getAllowedEmails();
  return allowedEmails.includes(email.toLowerCase());
};
