import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, Auth } from 'firebase/auth';

// --- 1. Definir Tipos ---
interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<User | null>;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- 2. Hook Personalizado (Corrige TS2305 em App.tsx) ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// --- 3. Provedor de Contexto ---
interface AuthProviderProps {
  children: ReactNode;
  auth: Auth; // Propriedade necessária para o index.tsx
}

// O componente AuthProvider deve retornar JSX (ReactNode), não void
export const AuthProvider: React.FC<AuthProviderProps> = ({ children, auth }) => {
  // Estados necessários (resolve TS2304)
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Observa o estado de autenticação do Firebase (resolve TS6133)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  // Funções de Autenticação (resolve TS6133)
  const register = async (email: string, password: string): Promise<User | null> => {
    const response = await createUserWithEmailAndPassword(auth, email, password);
    return response.user;
  };

  const login = async (email: string, password: string): Promise<User | null> => {
    const response = await signInWithEmailAndPassword(auth, email, password);
    return response.user;
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = { user, loading, register, login, logout };

  // Retorna JSX (resolve TS2322)
  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: 500, color: '#3b82f6' }}>Carregando autenticação...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};