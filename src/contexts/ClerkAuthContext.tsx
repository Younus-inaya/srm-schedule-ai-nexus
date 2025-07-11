
import React, { createContext, useContext } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'main_admin' | 'dept_admin' | 'staff';
  department_id?: string;
  staff_role?: 'assistant_professor' | 'professor' | 'hod';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerkAuth();

  const user: User | null = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    name: clerkUser.fullName || clerkUser.firstName || 'User',
    role: (clerkUser.publicMetadata?.role as 'main_admin' | 'dept_admin' | 'staff') || 'staff',
    department_id: clerkUser.publicMetadata?.department_id as string,
    staff_role: clerkUser.publicMetadata?.staff_role as 'assistant_professor' | 'professor' | 'hod'
  } : null;

  const signOut = async () => {
    await clerkSignOut();
  };

  const value = {
    user,
    loading: !isLoaded,
    isAuthenticated: !!clerkUser,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
