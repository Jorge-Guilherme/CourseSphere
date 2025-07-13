import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiGet } from '@/shared/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário já está logado
    const token = localStorage.getItem('coursesphere_token');
    const userData = localStorage.getItem('coursesphere_user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('coursesphere_token');
        localStorage.removeItem('coursesphere_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Busca usuário na API
      const users = await apiGet(`/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      if (users && users.length > 0) {
        const userData = users[0];
        localStorage.setItem('coursesphere_token', 'demo-token');
        localStorage.setItem('coursesphere_user', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('coursesphere_token');
    localStorage.removeItem('coursesphere_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};