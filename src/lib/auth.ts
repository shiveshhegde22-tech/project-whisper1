import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import app from "./firebase";

export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error("Sign-in was cancelled. Please try again.");
    }
    if (error.code === 'auth/popup-blocked') {
      throw new Error("Pop-up was blocked. Please allow pop-ups for this site.");
    }
    if (error.code === 'auth/unauthorized-domain') {
      throw new Error("This domain is not authorized. Please add it to Firebase Console > Authentication > Settings > Authorized domains.");
    }
    throw new Error(error.message || "Failed to sign in. Please try again.");
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error("Failed to sign out. Please try again.");
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export type { User };
