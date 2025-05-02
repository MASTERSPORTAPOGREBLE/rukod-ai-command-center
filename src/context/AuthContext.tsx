
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  displayName: string;
  email: string;
  role: 'user' | 'admin' | 'developer';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

// Mock users for demo purposes
const mockUsers = [
  {
    id: '1',
    email: 'demo@rukod.com',
    password: 'password123',
    displayName: 'Демо Пользователь',
    role: 'developer' as const,
    avatar: 'https://i.pravatar.cc/150?u=demo@rukod.com'
  }
];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session
    const storedUser = localStorage.getItem('rukod_user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        localStorage.removeItem('rukod_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('rukod_user', JSON.stringify(userWithoutPassword));
        toast.success('Вход выполнен успешно!');
        return true;
      } else {
        toast.error('Неверный email или пароль');
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      if (mockUsers.some(u => u.email === email)) {
        toast.error('Пользователь с таким email уже существует');
        return false;
      }
      
      // In a real app, we'd create a user via an API
      const newUser = {
        id: String(Math.random()).slice(2, 10),
        email,
        displayName: name,
        role: 'user' as const,
        avatar: `https://i.pravatar.cc/150?u=${email}`
      };
      
      setUser(newUser);
      localStorage.setItem('rukod_user', JSON.stringify(newUser));
      toast.success('Регистрация выполнена успешно!');
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rukod_user');
    toast.success('Вы успешно вышли из системы');
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      if (!user) return false;
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('rukod_user', JSON.stringify(updatedUser));
      toast.success('Профиль обновлен успешно');
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user,
        login, 
        register, 
        logout, 
        updateProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
