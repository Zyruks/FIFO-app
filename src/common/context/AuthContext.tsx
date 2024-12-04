// src/contexts/AuthContext.tsx

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth } from '../../api/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AuthContextType {
  /**
   * The current user object if logged in, or null if not.
   */
  currentUser: User | null;

  /**
   * Whether the authentication state is still loading.
   */
  isLoading: boolean;

  /**
   * Whether the user is logged in as a guest.
   */
  isGuest: boolean;

  /**
   * Logs the user in as a guest.
   */
  loginAsGuest: () => void;

  /**
   * Logs the user out.
   */
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);

      if (user) setIsGuest(false);
    });

    return () => unsubscribe();
  }, []);

  const loginAsGuest = () => {
    setIsGuest(true);
    setCurrentUser(null);
  };

  const logout = async () => {
    if (currentUser) {
      try {
        await auth.signOut();
        console.log('User logged out successfully');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
    setIsGuest(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, isGuest, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
