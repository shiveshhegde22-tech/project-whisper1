import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface AppSettings {
  emailNotifications: boolean;
  instantAlerts: boolean;
  dailyDigest: boolean;
  notificationEmail: string;
  ccEmail: string;
  statusLabels: {
    new: string;
    replied: string;
    archived: string;
  };
}

const SETTINGS_DOC_ID = "app_settings";
const COLLECTION_NAME = "settings";

// Default settings
const defaultSettings: AppSettings = {
  emailNotifications: true,
  instantAlerts: false,
  dailyDigest: true,
  notificationEmail: "kdmistryinteriors@yahoo.com",
  ccEmail: "",
  statusLabels: {
    new: "New",
    replied: "Replied",
    archived: "Archived"
  }
};

// Get settings from Firestore
export const getFirebaseSettings = async (): Promise<AppSettings> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { ...defaultSettings, ...docSnap.data() } as AppSettings;
    }
    
    // If no settings exist, create default settings
    await setDoc(docRef, defaultSettings);
    return defaultSettings;
  } catch (error) {
    console.error("Error fetching settings from Firebase:", error);
    return defaultSettings;
  }
};

// Save settings to Firestore
export const saveFirebaseSettings = async (settings: Partial<AppSettings>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID);
    const currentSettings = await getFirebaseSettings();
    await setDoc(docRef, { ...currentSettings, ...settings });
  } catch (error) {
    console.error("Error saving settings:", error);
    throw new Error("Failed to save settings.");
  }
};
