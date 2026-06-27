import React, { useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiDownload, FiSave } from 'react-icons/fi';
import Spreadsheet from '../components/Spreadsheet/Spreadsheet';import { AppContext } from '../context/AppContext';
import * as XLSX from 'xlsx';

const Inventory = () => {
  const { inventoryData, setInventoryData, columns, currentFileName, saveFile } = useContext(AppContext);

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(inventoryData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, currentFileName);
  };

  if (inventoryData.length === 0) {
    return (
      <EmptyState initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2>Welcome to StockFlow</h2>
        <p>Your workspace is empty. Open the sidebar to upload a file or create a blank canvas.</p>
      </EmptyState>
    );
  }

  return (
    <Workspace initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Toolbar>
        <Title>{currentFileName}</Title>
        <Actions>
          <Button onClick={() => saveFile(currentFileName, inventoryData, columns)}><FiSave /> Save Draft</Button>
          <Button className="primary" onClick={handleDownload}><FiDownload /> Export Excel</Button>
        </Actions>
      </Toolbar>
      <Spreadsheet data={inventoryData} columns={columns} onDataChange={setInventoryData} />
    </Workspace>
  );
};

export default Inventory;

// --- CSS ---
const EmptyState = styled(motion.div)`
  height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
  h2 { font-size: 28px; color: var(--text-main); margin-bottom: 12px; font-weight: 700;}
  p { color: var(--text-muted); font-size: 16px; max-width: 400px; line-height: 1.5;}
`;
const Workspace = styled(motion.div)`display: flex; flex-direction: column; height: 100%; gap: 16px;`;
const Toolbar = styled.div` display: flex; justify-content: space-between; align-items: center; `;
const Title = styled.h2`font-size: 20px; color: var(--text-main); font-weight: 600;`;
const Actions = styled.div` display: flex; gap: 12px; `;
const Button = styled.button`
  padding: 8px 16px; border-radius: 8px; font-weight: 500; font-size: 14px; display: flex; align-items: center; gap: 8px;
  background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-main);
  &:hover { background: var(--bg-hover); }
  &.primary { background: var(--primary); color: var(--primary-text); border: none; }
  &.primary:hover { background: var(--primary-hover); }
`;