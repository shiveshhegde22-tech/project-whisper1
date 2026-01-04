import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBBV94Nt0OT-xITA9zknNkPyj4tv3xnvJg",
  authDomain: "kirti-mistry.firebaseapp.com",
  projectId: "kirti-mistry",
  storageBucket: "kirti-mistry.firebasestorage.app",
  messagingSenderId: "847386170410",
  appId: "1:847386170410:web:75e4f6d63eeed5133b1f53",
  measurementId: "G-QZ0TFRB11R"
};

// Initialize Firebase (only for authentication)
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser)
export const initAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export default app;
