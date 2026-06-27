import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'light');
  const [inventoryData, setInventoryData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [currentFileName, setCurrentFileName] = useState("Untitled");
  const [recentFiles, setRecentFiles] = useState(JSON.parse(localStorage.getItem('recent_files')) || []);
  const [userProfile, setUserProfile] = useState(JSON.parse(localStorage.getItem('user_profile')) || {
    name: 'Admin User',
    email: 'admin@stockflow.com',
    phone: '+1 234 567 8900'
  });

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const saveFile = (fileName, data, cols) => {
    setCurrentFileName(fileName);
    setInventoryData(data);
    setColumns(cols);
    localStorage.setItem(`excel_file_${fileName}`, JSON.stringify({ data, cols }));
    
    let updatedRecents = [fileName, ...recentFiles.filter(f => f !== fileName)].slice(0, 5);
    setRecentFiles(updatedRecents);
    localStorage.setItem('recent_files', JSON.stringify(updatedRecents));
  };

  const loadFile = (fileName) => {
    const file = JSON.parse(localStorage.getItem(`excel_file_${fileName}`));
    if (file) {
      setInventoryData(file.data);
      setColumns(file.cols);
      setCurrentFileName(fileName);
    }
  };

  const createBlank = () => {
    const defaultCols = ['ID', 'Product Name', 'Category', 'Quantity', 'Price', 'Supplier', 'Status'];
    const defaultData = Array.from({ length: 20 }, () => ({}));
    saveFile('New_Inventory.xlsx', defaultData, defaultCols);
  };

  const updateProfile = (newProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem('user_profile', JSON.stringify(newProfile));
  };

  const clearAllData = () => {
    localStorage.clear();
    setInventoryData([]);
    setColumns([]);
    setRecentFiles([]);
    setCurrentFileName("Untitled");
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      inventoryData, setInventoryData,
      columns, setColumns,
      currentFileName, setCurrentFileName,
      recentFiles, saveFile, loadFile, createBlank,
      userProfile, updateProfile, clearAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};