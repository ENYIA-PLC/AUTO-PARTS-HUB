import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  accessToken: null,
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (!isSigningIn && !cachedAccessToken) {
          // If we reloaded the page, we lost the in-memory token.
          // In a real app we might force re-login or use a refresh flow,
          // but for now we just keep the user logged in but without the token.
        }
        setUser(currentUser);
        setAccessToken(cachedAccessToken);
        // Ensure user document exists in firestore
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (!userDoc.exists()) {
             await setDoc(userRef, {
                 userId: currentUser.uid,
                 email: currentUser.email || '',
                 fullName: currentUser.displayName || 'Anonymous User',
                 createdAt: Date.now(),
                 updatedAt: Date.now()
             });
          }
        } catch (error) {
            console.error("Error creating user profile", error);
            handleFirestoreError(error, OperationType.WRITE, 'users');
        }
      } else {
        setUser(null);
        setAccessToken(null);
        cachedAccessToken = null;
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    isSigningIn = true;
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
    provider.addScope('https://www.googleapis.com/auth/gmail.send');
    provider.addScope('https://www.googleapis.com/auth/gmail.modify');

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        cachedAccessToken = credential.accessToken;
        setAccessToken(cachedAccessToken);
      }
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error("Error signing in with Google", error);
      }
      throw error;
    } finally {
      isSigningIn = false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      cachedAccessToken = null;
      setAccessToken(null);
    } catch (error) {
      console.error("Error signing out", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, accessToken, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
