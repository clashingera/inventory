import React, { createContext, useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(StorageService.getTheme() === 'dark');

  useEffect(() => {
    document.body.className = isDark ? 'dark-theme' : 'light-theme';
    StorageService.saveTheme(isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};