import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'auto';
type ThemePreset = 'default' | 'midnight-blue' | 'forest-green' | 'warm-sunset' | 'royal-purple' | 'minimal-light';

interface ThemeContextType {
  theme: Theme;
  preset: ThemePreset;
  primaryColor: string;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setPreset: (preset: ThemePreset) => void;
  setPrimaryColor: (color: string) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  });
  
  const [preset, setPresetState] = useState<ThemePreset>(() => {
    const saved = localStorage.getItem('themePreset');
    return (saved as ThemePreset) || 'default';
  });
  
  const [primaryColor, setPrimaryColorState] = useState<string>(() => {
    return localStorage.getItem('primaryColor') || '#6366f1';
  });

  const applyTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    if (newTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const setPreset = (newPreset: ThemePreset) => {
    setPresetState(newPreset);
    localStorage.setItem('themePreset', newPreset);
    
    // Apply preset-specific theme
    const presetThemes: Record<ThemePreset, Theme> = {
      'default': 'light',
      'midnight-blue': 'dark',
      'forest-green': 'dark',
      'warm-sunset': 'light',
      'royal-purple': 'dark',
      'minimal-light': 'light',
    };
    
    setTheme(presetThemes[newPreset]);
  };

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color);
    localStorage.setItem('primaryColor', color);
    
    // Apply CSS custom property
    document.documentElement.style.setProperty('--primary-color', color);
  };

  const resetTheme = () => {
    setTheme('light');
    setPresetState('default');
    setPrimaryColorState('#6366f1');
    localStorage.removeItem('themePreset');
    localStorage.removeItem('primaryColor');
    document.documentElement.style.removeProperty('--primary-color');
  };

  useEffect(() => {
    applyTheme(theme);
    if (primaryColor !== '#6366f1') {
      document.documentElement.style.setProperty('--primary-color', primaryColor);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      preset, 
      primaryColor,
      toggleTheme, 
      setTheme, 
      setPreset, 
      setPrimaryColor,
      resetTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
