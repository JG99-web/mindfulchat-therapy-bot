'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [fontSize, setFontSize] = useState('medium');
  const [highContrast, setHighContrast] = useState(false);

  // Load saved preferences from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFontSize = localStorage.getItem('fontSize') || 'medium';
      const savedHighContrast = localStorage.getItem('highContrast') === 'true';
      
      setFontSize(savedFontSize);
      setHighContrast(savedHighContrast);
    }
  }, []);

  // Apply theme classes to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      
      // Remove existing font size classes
      html.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
      
      // Apply font size
      const fontSizeClasses = {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg',
        xlarge: 'text-xl'
      };
      html.classList.add(fontSizeClasses[fontSize]);
      
      // Apply high contrast
      if (highContrast) {
        html.classList.add('high-contrast');
      } else {
        html.classList.remove('high-contrast');
      }
    }
  }, [fontSize, highContrast]);

  const changeFontSize = (newSize) => {
    setFontSize(newSize);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fontSize', newSize);
    }
  };

  const toggleHighContrast = () => {
    const newHighContrast = !highContrast;
    setHighContrast(newHighContrast);
    if (typeof window !== 'undefined') {
      localStorage.setItem('highContrast', newHighContrast.toString());
    }
  };

  return (
    <ThemeContext.Provider value={{
      fontSize,
      highContrast,
      changeFontSize,
      toggleHighContrast
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
