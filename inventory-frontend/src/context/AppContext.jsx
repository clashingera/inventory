import React, { createContext, useState, useEffect } from "react";
import { InventoryApi } from "../services/inventoryApi";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("app_theme") || "light",
  );
  const [inventoryData, setInventoryData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [currentFileName, setCurrentFileName] = useState("Untitled");
  const [recentFiles, setRecentFiles] = useState([]);
  const [userProfile, setUserProfile] = useState(
    JSON.parse(localStorage.getItem("user_profile")) || {
      name: "Admin User",
      email: "admin@stockflow.com",
      phone: "+1 234 567 8900",
    },
  );

  // Apply Theme
  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "light-theme";
    localStorage.setItem("app_theme", theme);
  }, [theme]);

  // Initial Data Fetch (Get Recent Files on Load)
  useEffect(() => {
    InventoryApi.getRecentFiles()
      .then((files) => setRecentFiles(files || []))
      .catch((err) => console.error("Failed to load recents", err));
  }, []);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const loadFile = async (fileName) => {
    try {
      const res = await InventoryApi.getFileData(fileName);
      setInventoryData(res.data);
      setColumns(res.columns);
      setCurrentFileName(fileName);
    } catch (e) {
      console.error("Error loading file", e);
    }
  };

  const saveFile = async (fileName, data, cols) => {
    try {
      await InventoryApi.saveFile(fileName, cols, data);
      setCurrentFileName(fileName);
      setInventoryData(data);
      setColumns(cols);
      // Refresh sidebar list
      const files = await InventoryApi.getRecentFiles();
      setRecentFiles(files);
    } catch (e) {
      console.error("Error saving file", e);
    }
  };

  const createBlank = async (rows = 20, cols = 7) => {
    try {
      const res = await InventoryApi.createBlank("New_Inventory.xlsx");
      setInventoryData(res.data);
      setColumns(res.columns);
      setCurrentFileName(res.filename);
      const files = await InventoryApi.getRecentFiles();
      setRecentFiles(files);
    } catch (e) {
      console.error("Error creating blank", e);
    }
  };

  const renameFile = async (oldName, newName) => {
    try {
      // Fetch old data, save as new file, delete old file
      const res = await InventoryApi.getFileData(oldName);
      await InventoryApi.saveFile(newName, res.columns, res.data);
      await InventoryApi.deleteFile(oldName);

      const files = await InventoryApi.getRecentFiles();
      setRecentFiles(files);
      if (currentFileName === oldName) setCurrentFileName(newName);
    } catch (e) {
      console.error("Error renaming", e);
    }
  };

  const deleteFile = async (fileName) => {
    try {
      await InventoryApi.deleteFile(fileName);
      const files = await InventoryApi.getRecentFiles();
      setRecentFiles(files);

      // If deleting the currently open file, clear the workspace
      if (currentFileName === fileName) {
        setInventoryData([]);
        setColumns([]);
        setCurrentFileName("Untitled");
      }
    } catch (e) {
      console.error("Error deleting", e);
    }
  };

  const updateProfile = (newProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem("user_profile", JSON.stringify(newProfile));
  };

  const clearAllData = async () => {
    try {
      // Delete all files from the server
      for (const file of recentFiles) {
        await InventoryApi.deleteFile(file);
      }

      // Clear state
      setRecentFiles([]);
      setInventoryData([]);
      setColumns([]);
      setCurrentFileName("Untitled");

      // Clear local profile if desired
      localStorage.removeItem("user_profile");
      // Or use localStorage.clear() if you want to remove everything
    } catch (e) {
      console.error("Error clearing data", e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        inventoryData,
        setInventoryData,
        columns,
        setColumns,
        currentFileName,
        setCurrentFileName,
        recentFiles,
        saveFile,
        loadFile,
        createBlank,
        renameFile,
        deleteFile,
        clearAllData,   // <-- add this
        userProfile,
        updateProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
