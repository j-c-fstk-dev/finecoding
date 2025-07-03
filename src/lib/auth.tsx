"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User, type Auth } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase';
import { LoadingSpinner } from '@/components/layout/LoadingSpinner';

let auth: Auth | null = null;
if (firebaseApp) {
  try {
    auth = getAuth(firebaseApp);
  } catch (error) {
    console.error("Firebase Auth could not be initialized:", error);
  }
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, password: string) => {
    if (!auth) return Promise.reject(new Error("Auth is not initialized."));
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    if (!auth) return Promise.reject(new Error("Auth is not initialized."));
    return signOut(auth);
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {/* 
        The initial loading UI is now handled exclusively by the SplashScreen 
        in the root layout to prevent conflicting loaders.
      */}
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
