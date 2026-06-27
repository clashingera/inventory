import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiBox, FiPieChart, FiUploadCloud, FiClock, FiSun, FiMoon, FiSettings, FiUser, FiX, FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { useDropzone } from 'react-dropzone';
import { InventoryApi } from '../services/inventoryApi';

const Sidebar = () => {
const {
  theme,
  toggleTheme,
  recentFiles,
  loadFile,
  createBlank,
  userProfile,
  updateProfile,
  saveFile,
  currentFileName,
  renameFile,
  deleteFile,
  clearAllData
} = useContext(AppContext);  const [modalType, setModalType] = useState(null); 
  const [editingFile, setEditingFile] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  
  const [settingsPrefs, setSettingsPrefs] = useState({
    defaultRows: 20, enableAutoSave: true, excelNavigation: true
  });

  // Uses FastAPI to upload instead of frontend parsing
  const handleUpload = async (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    try {
      const res = await InventoryApi.uploadFile(acceptedFiles[0]);
      saveFile(res.filename, res.data, res.columns);
      setModalType(null);
    } catch (error) {
      console.error("Backend Upload Failed", error);
      alert("Failed to upload file to server.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop: handleUpload,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false
  });

  const startRename = (e, file) => {
    e.stopPropagation();
    setEditingFile(file);
    setRenameValue(file.replace(/\.[^/.]+$/, "")); // Strip extension for cleaner editing
  };

  const confirmRename = async (e, oldName) => {
    e.stopPropagation();
    // Ensure the new name retains an Excel extension
    const finalNewName = renameValue.trim().endsWith('.xlsx') ? renameValue.trim() : `${renameValue.trim()}.xlsx`;
    
    if (finalNewName && oldName !== finalNewName) {
      await renameFile(oldName, finalNewName);
    }
    setEditingFile(null);
  };

  const handleDeleteFile = async (e, fileToRemove) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to permanently delete "${fileToRemove}" from the server?`)) {
      await deleteFile(fileToRemove);
    }
  };

return (
    <>
      <SidebarContainer>
        <SidebarHeader>
          <Logo>StockFlow</Logo>
          <IconButton onClick={toggleTheme}>{theme === 'dark' ? <FiSun /> : <FiMoon />}</IconButton>
        </SidebarHeader>

        <NavMenu>
          <NavItem to="/" end><FiBox /> Inventory</NavItem>
          <NavItem to="/analysis"><FiPieChart /> Analysis</NavItem>
          
          <SectionTitle><FiClock /> Recent Files</SectionTitle>
          
          <RecentListContainer>
            {recentFiles.map(file => (
              <RecentItemRow key={file} onClick={() => loadFile(file)}>
                {editingFile === file ? (
                  <RenameInputWrapper>
                    <input 
                      type="text" 
                      value={renameValue} 
                      onChange={(e) => setRenameValue(e.target.value)}
                      onClick={(e) => e.stopPropagation()} 
                      autoFocus
                    />
                    <ActionIconButton onClick={(e) => confirmRename(e, file)} className="success">
                      <FiCheck size={12} />
                    </ActionIconButton>
                  </RenameInputWrapper>
                ) : (
                  <>
                    <span className="file-name">{file}</span>
                    <ItemActions className="actions-trigger">
                      <ActionIconButton onClick={(e) => startRename(e, file)}>
                        <FiEdit2 size={12} />
                      </ActionIconButton>
                      <ActionIconButton onClick={(e) => handleDeleteFile(e, file)} className="danger">
                        <FiTrash2 size={12} />
                      </ActionIconButton>
                    </ItemActions>
                  </>
                )}
              </RecentItemRow>
            ))}
          </RecentListContainer>

          <UploadBtn onClick={() => setModalType('upload')}>
            <FiUploadCloud /> Upload / Create
          </UploadBtn>
        </NavMenu>
        <SidebarFooter>
          <UserInfo>
            <div className="name">{userProfile.name}</div>
            <div className="role">Admin</div>
          </UserInfo>
          <IconButton onClick={() => setModalType('profile')}><FiUser /></IconButton>
          <IconButton onClick={() => setModalType('settings')}><FiSettings /></IconButton>
        </SidebarFooter>
      </SidebarContainer>

      {/* Global Modals */}
      <AnimatePresence>
        {modalType && (
          <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModalContent initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.9 }}>
              <CloseBtn onClick={() => setModalType(null)}><FiX /></CloseBtn>
              
              {modalType === 'upload' && (
                <div>
                  <h2>Upload or Create</h2>
                  <DropZone {...getRootProps()} $active={isDragActive}>
                    <input {...getInputProps()} />
                    <FiUploadCloud size={48} />
                    <p>{isDragActive ? "Drop file here..." : "Drag & drop an Excel file, or click here to select"}</p>
                  </DropZone>
                  <Divider>OR</Divider>
                  <Button onClick={() => { createBlank(settingsPrefs.defaultRows, 7); setModalType(null); }}>
                    Create Blank Sheet ({settingsPrefs.defaultRows}x7)
                  </Button>
                </div>
              )}

              {modalType === 'profile' && (
                <div>
                  <h2>Edit Profile</h2>
                  <Input type="text" value={userProfile.name} onChange={e => updateProfile({...userProfile, name: e.target.value})} placeholder="Name" />
                  <Input type="email" value={userProfile.email} onChange={e => updateProfile({...userProfile, email: e.target.value})} placeholder="Email" />
                  <Input type="text" value={userProfile.phone} onChange={e => updateProfile({...userProfile, phone: e.target.value})} placeholder="Phone" />
                  <Button onClick={() => setModalType(null)}>Save</Button>
                </div>
              )}

              {modalType === 'settings' && (
                <div>
                  <h2>Settings</h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Manage your application preferences and data safety.</p>
                  
                  <SettingRow>
                    <label>Default Canvas Rows</label>
                    <input 
                      type="number" 
                      value={settingsPrefs.defaultRows} 
                      onChange={e => setSettingsPrefs({...settingsPrefs, defaultRows: parseInt(e.target.value) || 20})}
                    />
                  </SettingRow>

                  <SettingRow>
                    <label>Enable Autosave Simulation</label>
                    <input 
                      type="checkbox" 
                      checked={settingsPrefs.enableAutoSave} 
                      onChange={e => setSettingsPrefs({...settingsPrefs, enableAutoSave: e.target.checked})}
                    />
                  </SettingRow>

                  <SettingRow>
                    <label>Excel Navigation (Arrow Keys & Auto-Rows)</label>
                    <input 
                      type="checkbox" 
                      checked={settingsPrefs.excelNavigation} 
                      onChange={e => setSettingsPrefs({...settingsPrefs, excelNavigation: e.target.checked})}
                    />
                  </SettingRow>

                  <Divider>DANGER ZONE</Divider>
                  
                  <DangerButton onClick={() => { clearAllData(); setModalType(null); }}>Clear All Data & Recents</DangerButton>
                </div>
              )}
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;

// --- CSS (Styled Components) ---
const SidebarContainer = styled.aside`
  width: 280px; height: 100vh; background: var(--bg-surface);
  border-right: 1px solid var(--border-color); display: flex; flex-direction: column;
`;
const SidebarHeader = styled.div`
  height: 70px; display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px; border-bottom: 1px solid var(--border-color);
`;
const Logo = styled.h1`font-size: 20px; font-weight: 700; color: var(--text-main); letter-spacing: -0.5px;`;
const IconButton = styled.button`
  background: transparent; border: none; color: var(--text-muted); padding: 8px; border-radius: 6px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  &:hover { background: var(--bg-hover); color: var(--text-main); }
`;
const NavMenu = styled.nav`flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;`;
const NavItem = styled(NavLink)`
  display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 8px;
  color: var(--text-muted); text-decoration: none; font-weight: 500; font-size: 15px;
  &.active { background: var(--accent); color: white; }
  &:hover:not(.active) { background: var(--bg-hover); color: var(--text-main); }
`;
const SectionTitle = styled.div`
  display: flex; align-items: center; gap: 8px; font-size: 12px; text-transform: uppercase;
  color: var(--text-muted); font-weight: 600; margin-top: 24px; margin-bottom: 8px; padding-left: 8px;
`;

// Recent items structure layout updates
const RecentListContainer = styled.div`
  display: flex; flex-direction: column; gap: 4px; max-height: 200px; overflow-y: auto;
`;

const RecentItemRow = styled.div`
  display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; 
  font-size: 13px; color: var(--text-main); cursor: pointer; border-radius: 6px; position: relative;
  
  &:hover { 
    background: var(--bg-hover); 
    .actions-trigger { opacity: 1; display: flex; }
  }

  .file-name {
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 170px;
  }
`;

const ItemActions = styled.div`
  display: none; gap: 6px; opacity: 0; transition: opacity 0.15s ease-in-out;
`;

const ActionIconButton = styled.button`
  background: transparent; border: none; color: var(--text-muted); padding: 4px; border-radius: 4px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  
  &:hover { 
    background: var(--bg-surface); 
    color: var(--text-main); 
  }
  &.danger:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
  &.success:hover { color: #10b981; background: rgba(16, 185, 129, 0.1); }
`;

const RenameInputWrapper = styled.div`
  display: flex; align-items: center; gap: 6px; width: 100%;
  input {
    flex: 1; background: var(--bg-app); border: 1px solid var(--border-color); color: var(--text-main);
    font-size: 12px; padding: 4px 6px; border-radius: 4px; outline: none;
    &:focus { border-color: var(--accent); }
  }
`;

const UploadBtn = styled.button`
  margin-top: 16px; width: 100%; padding: 12px; background: transparent; border: 1px dashed var(--border-color);
  color: var(--text-main); border-radius: 8px; font-weight: 500; display: flex; justify-content: center; gap: 8px;
  cursor: pointer;
  &:hover { border-color: var(--accent); color: var(--accent); background: rgba(37, 99, 235, 0.05); }
`;
const SidebarFooter = styled.div`
  padding: 20px 24px; border-top: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px;
`;
const UserInfo = styled.div`
  flex: 1;
  .name { font-size: 14px; font-weight: 600; color: var(--text-main); }
  .role { font-size: 12px; color: var(--text-muted); }
`;
const ModalOverlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 100;
`;
const ModalContent = styled(motion.div)`
  background: var(--bg-surface); width: 450px; padding: 32px; border-radius: 16px; position: relative;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border: 1px solid var(--border-color);
  h2 { margin-bottom: 24px; color: var(--text-main); font-weight: 600;}
`;
const CloseBtn = styled.button` position: absolute; top: 16px; right: 16px; background: transparent; border: none; color: var(--text-muted); cursor: pointer; `;
const DropZone = styled.div`
  border: 2px dashed ${props => props.$active ? 'var(--accent)' : 'var(--border-color)'};
  background: ${props => props.$active ? 'rgba(37, 99, 235, 0.05)' : 'var(--bg-app)'};
  border-radius: 12px; padding: 40px 20px; text-align: center; cursor: pointer; transition: all 0.2s;
  color: var(--text-muted);
  &:hover { border-color: var(--accent); }
  svg { margin-bottom: 12px; color: var(--accent); }
`;
const Divider = styled.div`text-align: center; margin: 24px 0; color: var(--text-muted); font-size: 12px; font-weight: 600;`;
const Button = styled.button`width: 100%; padding: 12px; background: var(--primary); color: var(--primary-text); border: none; border-radius: 8px; font-weight: 500; font-size: 14px; cursor: pointer;`;
const DangerButton = styled(Button)`background: #ef4444; color: white; margin-top: 16px; &:hover{background: #dc2626;}`;
const Input = styled.input`
  width: 100%; padding: 12px; margin-bottom: 16px; border: 1px solid var(--border-color); background: var(--bg-app);
  color: var(--text-main); border-radius: 8px; outline: none; &:focus{ border-color: var(--accent); }
`;
const SettingRow = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; color: var(--text-main); font-size: 14px;
  input[type="number"] { width: 80px; padding: 6px; border: 1px solid var(--border-color); background: var(--bg-app); color: var(--text-main); border-radius: 4px; text-align: center; }
  input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--accent); }
`;