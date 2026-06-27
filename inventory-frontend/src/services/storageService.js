export const StorageService = {
  saveFile: (fileName, data) => {
    localStorage.setItem(`excel_file_${fileName}`, JSON.stringify(data));
    const recentFiles = StorageService.getRecentFiles();
    if (!recentFiles.includes(fileName)) {
      localStorage.setItem('recent_files', JSON.stringify([fileName, ...recentFiles]));
    }
  },
  getFile: (fileName) => {
    const data = localStorage.getItem(`excel_file_${fileName}`);
    return data ? JSON.parse(data) : null;
  },
  getRecentFiles: () => {
    const files = localStorage.getItem('recent_files');
    return files ? JSON.parse(files) : [];
  },
  saveTheme: (theme) => localStorage.setItem('app_theme', theme),
  getTheme: () => localStorage.getItem('app_theme') || 'light',
};