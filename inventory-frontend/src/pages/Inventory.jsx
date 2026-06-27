import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiDownload, FiSave } from 'react-icons/fi';
import { AppContext } from '../context/AppContext';
import * as XLSX from 'xlsx';

const Inventory = () => {
  const { inventoryData, setInventoryData, columns, setColumns, currentFileName, saveFile } = useContext(AppContext);
  const [activeCell, setActiveCell] = useState({ rowIndex: 0, colIndex: 0 });

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(inventoryData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, currentFileName);
  };

  const appendBlankRow = (currentData) => {
    const skeleton = {};
    columns.forEach(col => { skeleton[col] = ""; });
    return [...currentData, skeleton];
  };

  const appendBlankColumn = () => {
    const nextColNum = columns.length + 1;
    const newColName = `Column ${nextColNum}`;
    
    const updatedCols = [...columns, newColName];
    if (setColumns) setColumns(updatedCols);

    const updatedData = inventoryData.map(row => ({
      ...row,
      [newColName]: ""
    }));
    setInventoryData(updatedData);
  };

  const handleCellChange = (rowIndex, colKey, value) => {
    const updatedData = [...inventoryData];
    updatedData[rowIndex][colKey] = value;
    setInventoryData(updatedData);
  };

  const handleColumnNameChange = (oldKey, newKey) => {
    if (!newKey || oldKey === newKey || columns.includes(newKey)) return;

    const updatedCols = columns.map(col => col === oldKey ? newKey : col);
    if (setColumns) setColumns(updatedCols);

    const updatedData = inventoryData.map(row => {
      const newRow = { ...row };
      newRow[newKey] = newRow[oldKey] || "";
      delete newRow[oldKey];
      return newRow;
    });
    setInventoryData(updatedData);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (inventoryData.length === 0) return;

      const { rowIndex, colIndex } = activeCell;
      let nextRow = rowIndex;
      let nextCol = colIndex;

      if (e.key === 'ArrowUp') {
        nextRow = Math.max(0, rowIndex - 1);
        e.preventDefault();
      } else if (e.key === 'ArrowDown' || e.key === 'Enter') {
        if (rowIndex === inventoryData.length - 1) {
          const expandedData = appendBlankRow(inventoryData);
          setInventoryData(expandedData);
        }
        nextRow = rowIndex + 1;
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        nextCol = Math.max(0, colIndex - 1);
        e.preventDefault();
      } else if (e.key === 'ArrowRight' || e.key === 'Tab') {
        if (colIndex === columns.length - 1) {
          appendBlankColumn();
        }
        nextCol = colIndex + 1;
        e.preventDefault();
      }

      setActiveCell({ rowIndex: nextRow, colIndex: nextCol });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCell, inventoryData, columns]);

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

      {/* GridContainer wraps everything and handles scroll overflow */}
      <GridContainer>
        <TableGrid>
          <thead>
            <tr>
              {columns.map((col, cIdx) => (
                <th key={cIdx}>
                  <input 
                    type="text" 
                    className="header-input"
                    value={col} 
                    onChange={(e) => handleColumnNameChange(col, e.target.value)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((row, rIdx) => (
              <tr key={rIdx}>
                {columns.map((colKey, cIdx) => {
                  const isSelected = activeCell.rowIndex === rIdx && activeCell.colIndex === cIdx;
                  return (
                    <td key={cIdx} className={isSelected ? 'selected' : ''} onClick={() => setActiveCell({ rowIndex: rIdx, colIndex: cIdx })}>
                      <input 
                        type="text"
                        value={row[colKey] || ''}
                        onChange={(e) => handleCellChange(rIdx, colKey, e.target.value)}
                        autoFocus={isSelected}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </TableGrid>
      </GridContainer>
    </Workspace>
  );
};

export default Inventory;

// --- CSS Layout ---
const EmptyState = styled(motion.div)`
  height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
  h2 { font-size: 28px; color: var(--text-main); margin-bottom: 12px; font-weight: 700;}
  p { color: var(--text-muted); font-size: 16px; max-width: 400px; line-height: 1.5;}
`;

const Workspace = styled(motion.div)`
  display: flex; flex-direction: column; height: 100%; gap: 16px; overflow: hidden;
`;

const Toolbar = styled.div` display: flex; justify-content: space-between; align-items: center; `;
const Title = styled.h2`font-size: 20px; color: var(--text-main); font-weight: 600;`;
const Actions = styled.div` display: flex; gap: 12px; `;

const Button = styled.button`
  padding: 8px 16px; border-radius: 8px; font-weight: 500; font-size: 14px; display: flex; align-items: center; gap: 8px;
  background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-main); cursor: pointer;
  &:hover { background: var(--bg-hover); }
  &.primary { background: var(--primary); color: var(--primary-text); border: none; }
`;

// Container setup with auto scrolling enabled in both directions
const GridContainer = styled.div`
  flex: 1; 
  overflow: auto; 
  background: var(--bg-surface); 
  border: 1px solid var(--border-color); 
  border-radius: 8px;
  position: relative;

  /* Custom scrollbar styling for a cleaner look */
  &::-webkit-scrollbar { width: 10px; height: 10px; }
  &::-webkit-scrollbar-track { background: var(--bg-app); }
  &::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
  &::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
`;

const TableGrid = styled.table`
  border-collapse: collapse; 
  font-size: 14px;
  table-layout: fixed; /* Crucial for keeping columns locked at exact width values */
  width: max-content;   /* Forces width calculation to scale past wrapper container edges */

  th { 
    background: var(--bg-app); 
    padding: 4px; 
    border-right: 1px solid var(--border-color); 
    border-bottom: 2px solid var(--border-color); 
    text-align: left; 
    color: var(--text-muted); 
    font-weight: 600; 
    position: sticky; 
    top: 0;
    z-index: 5;
    width: 160px; /* Gives each column standard initial spacing width */
  }

  td { 
    padding: 0; 
    border-right: 1px solid var(--border-color); 
    border-bottom: 1px solid var(--border-color);
    width: 160px; /* Keeps cells proportional with matching headers */
    &.selected { outline: 2px solid var(--accent); z-index: 2; }
  }

  input { 
    width: 100%; 
    height: 36px; 
    padding: 0 8px; 
    border: none; 
    background: transparent; 
    color: var(--text-main); 
    outline: none; 
  }

  .header-input { 
    font-weight: 600; 
    color: var(--text-main); 
    background: transparent; 
    border: none; 
    text-align: left; 
    cursor: text;
    &:focus { background: var(--bg-surface); outline: 1px solid var(--accent); border-radius: 4px; }
  }
`;