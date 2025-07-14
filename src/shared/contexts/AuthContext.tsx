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
      let users;
      
      // Tenta primeiro a função serverless (produção)
      try {
        const response = await fetch('/api/getData');
        if (response.ok) {
          const json = await response.json();
          users = json.users; // Acessa a propriedade users do objeto
        } else {
          throw new Error('Serverless function not available');
        }
      } catch (error) {
        // Fallback para ambiente local (JSON Server)
        console.log('Usando JSON Server local para autenticação...');
        users = await apiGet(`/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      }
      
      // Filtra o usuário correto
      const userData = users.find((user: any) => 
        user.email === email && user.password === password
      );
      
      if (userData) {
        localStorage.setItem('coursesphere_token', 'demo-token');
        localStorage.setItem('coursesphere_user', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
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