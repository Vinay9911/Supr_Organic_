import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ADMIN_EMAIL } from '../lib/config';
import { AuthUser } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string, name: string) => Promise<any>;
  signOut: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      updateUser(session);
      setLoading(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      updateUser(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateUser = (session: any) => {
    if (session?.user) {
      setUser({ id: session.user.id, email: session.user.email, full_name: session.user.user_metadata?.full_name });
      setIsAdmin(session.user.email === ADMIN_EMAIL);
    } else {
      setUser(null);
      setIsAdmin(false);
    }
  };

  const signIn = (email: string, pass: string) => supabase.auth.signInWithPassword({ email, password: pass });
  const signUp = (email: string, pass: string, name: string) => supabase.auth.signUp({ email, password: pass, options: { data: { full_name: name } } });
  const signOut = async () => { await supabase.auth.signOut(); };

  return (
    <AuthContext.Provider value={{ user, isAdmin, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};