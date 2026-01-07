import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import type { Database } from '@/integrations/supabase/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserRole = Database['public']['Enums']['app_role'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  role: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const mountedRef = useRef(true);

  const fetchProfile = async (userId: string) => {
    try {
      // Fetch profile directly
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Fetch role directly
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      // Set data even if there were errors
      if (mountedRef.current) {
        setProfile(profileData ?? null);
        setRole(roleData?.role ?? 'prospect');
      }
    } catch (error) {
      if (mountedRef.current) {
        setProfile(null);
        setRole('prospect');
      }
      // Optionally log the error, but don't throw.
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    const initAuth = async () => {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();

      if (!mountedRef.current) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id);
      }

      setLoading(false);
    };

    initAuth();

    // Set up listener for future auth changes, but avoid async listener pitfalls
    // by not making the callback itself async, and calling async code within.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Use an IIFE for async logic to avoid returning a Promise to the event.
        (async () => {
          if (!mountedRef.current) return;

          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            setProfile(null);
            setRole(null);
          }
        })();
      }
    );

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setRole(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      role,
      loading,
      signOut,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};