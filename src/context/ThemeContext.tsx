
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Theme } from '../models/types';
import { defaultTheme, themes } from '../theme/themes';
import { additionalThemes } from '../theme/additionalThemes';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themes: Record<string, Theme>;
  addCustomTheme: (theme: Theme) => void;
  removeCustomTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Combine built-in themes with additional themes
const allThemes = { ...themes, ...additionalThemes };

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);
  const [customThemes, setCustomThemes] = useState<Record<string, Theme>>({});
  
  // Load custom themes from localStorage on initial mount
  useEffect(() => {
    try {
      const savedThemes = localStorage.getItem('custom-themes');
      if (savedThemes) {
        setCustomThemes(JSON.parse(savedThemes));
      }
      
      // Load the last selected theme
      const savedThemeId = localStorage.getItem('selected-theme');
      if (savedThemeId) {
        const savedTheme = allThemes[savedThemeId] || 
                          (customThemes && customThemes[savedThemeId]);
        
        if (savedTheme) {
          setCurrentTheme(savedTheme);
          applyThemeToDocument(savedTheme);
        }
      }
    } catch (error) {
      console.error('Error loading themes from localStorage:', error);
    }
  }, []);
  
  // Save custom themes to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('custom-themes', JSON.stringify(customThemes));
    } catch (error) {
      console.error('Error saving themes to localStorage:', error);
    }
  }, [customThemes]);

  const applyThemeToDocument = (theme: Theme) => {
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    document.documentElement.style.setProperty('--background-color', theme.backgroundColor);
    document.documentElement.style.setProperty('--text-color', theme.textColor);
    document.documentElement.style.setProperty('--accent-color', theme.accentColor);
  };

  const setTheme = (themeId: string) => {
    // Check built-in themes first, then custom themes
    const theme = allThemes[themeId] || customThemes[themeId];
    
    if (theme) {
      setCurrentTheme(theme);
      applyThemeToDocument(theme);
      
      // Save selected theme to localStorage
      localStorage.setItem('selected-theme', themeId);
    }
  };
  
  const addCustomTheme = (theme: Theme) => {
    setCustomThemes(prev => ({
      ...prev,
      [theme.id]: theme
    }));
  };
  
  const removeCustomTheme = (themeId: string) => {
    setCustomThemes(prev => {
      const updated = { ...prev };
      delete updated[themeId];
      return updated;
    });
    
    // If the removed theme was currently active, switch to default theme
    if (currentTheme.id === themeId) {
      setTheme(defaultTheme.id);
    }
  };

  // Combine built-in and custom themes for the context
  const combinedThemes = { ...allThemes, ...customThemes };

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      setTheme, 
      themes: combinedThemes,
      addCustomTheme,
      removeCustomTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
