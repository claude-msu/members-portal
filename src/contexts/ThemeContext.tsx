import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type Theme = 'dark' | 'light';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  storageKey = 'claude-builder-theme',
  ...props
}: ThemeProviderProps) {
  const { user, profile } = useAuth();

  const [theme, setTheme] = useState<Theme>(() => {
    // If user is authenticated and has a profile theme, use it
    if (user && profile?.theme) {
      return profile.theme;
    }
    // Otherwise, fall back to localStorage or default
    return 'light'
  });

  // Update theme when profile changes (e.g., from real-time updates)
  useEffect(() => {
    if (user && profile?.theme && profile.theme !== theme) {
      setTheme(profile.theme);
    }
  }, [user, profile?.theme, theme]);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    root.classList.add(theme);
  }, [theme]);

  const handleSetTheme = async (newTheme: Theme) => {
    setTheme(newTheme);

    if (user) {
      // Update profile in database
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ theme: newTheme })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating theme in database:', error);
        }
      } catch (error) {
        console.error('Error updating theme:', error);
      }
    } else {
      // Fall back to localStorage for non-authenticated users
      localStorage.setItem(storageKey, newTheme);
    }
  };

  const value = {
    theme,
    setTheme: handleSetTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};