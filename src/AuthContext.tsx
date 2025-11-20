// src/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, Auth } from 'firebase/auth';

// ... (Outras interfaces e hook useAuth)

interface AuthProviderProps {
  children: ReactNode;
  auth: Auth; // <-- Esta linha resolve o TS2322 no index.tsx
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, auth }) => {
  // ... (Restante da lógica que usa 'auth')
  
  // Observa o estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { 
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  // ... (Restante do componente)
};