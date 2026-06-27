const BASE_URL = "http://localhost:8000/api/inventory";

export const InventoryApi = {
  getRecentFiles: async () => {
    const res = await fetch(`${BASE_URL}/files`);
    return res.json();
  },

  getFileData: async (filename) => {
    const res = await fetch(`${BASE_URL}/data/${filename}`);
    return res.json();
  },

  createBlank: async (filename) => {
    const res = await fetch(`${BASE_URL}/create-blank/${filename}`, { method: 'POST' });
    return res.json();
  },

  saveFile: async (filename, columns, data) => {
    const res = await fetch(`${BASE_URL}/save/${filename}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ columns, data })
    });
    return res.json();
  },

  deleteFile: async (filename) => {
    const res = await fetch(`${BASE_URL}/delete/${filename}`, { method: 'DELETE' });
    return res.json();
  },

  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },

  getDownloadUrl: (filename) => `${BASE_URL}/download/${filename}`
};