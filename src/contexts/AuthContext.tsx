import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthChange, signInWithGoogle, signOut } from '@/lib/auth';
import { isEmailAllowed as checkEmailAllowed } from '@/lib/allowedEmailsService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isEmailAllowed: boolean;
  checkingAccess: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailAllowed, setIsEmailAllowed] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setUser(user);
      setLoading(false);
      
      if (user?.email) {
        setCheckingAccess(true);
        try {
          const allowed = await checkEmailAllowed(user.email);
          setIsEmailAllowed(allowed);
        } catch (error) {
          console.error("Error checking email access:", error);
          setIsEmailAllowed(false);
        } finally {
          setCheckingAccess(false);
        }
      } else {
        setIsEmailAllowed(false);
        setCheckingAccess(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    await signInWithGoogle();
  };

  const logout = async () => {
    await signOut();
    setIsEmailAllowed(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isEmailAllowed, checkingAccess, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
