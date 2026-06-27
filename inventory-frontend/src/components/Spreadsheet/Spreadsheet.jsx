import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Spreadsheet = ({ data, columns, onDataChange }) => {
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);

  const saveCell = () => {
    if (!editing) return;
    const { r, c } = editing;
    const newData = [...data];
    if (!newData[r]) newData[r] = {}; // Auto-create row if missing
    newData[r][c] = editValue;
    onDataChange(newData);
    setEditing(null);
  };

  const handleKeyDown = (e, r, c, colIndex) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      saveCell();
      
      // Auto-add new row if at the very end
      if (r === data.length - 1 && e.key === 'Tab') {
        onDataChange([...data, {}]);
      }

      // Move focus
      if (e.key === 'Enter' && r < data.length - 1) setTimeout(() => startEdit(r + 1, c, data[r+1][c]), 0);
      if (e.key === 'Tab' && colIndex < columns.length - 1) setTimeout(() => startEdit(r, columns[colIndex + 1], data[r][columns[colIndex + 1]]), 0);
    } else if (e.key === 'Escape') setEditing(null);
  };

  const startEdit = (r, c, val) => { setEditing({r, c}); setEditValue(val || ""); };

  return (
    <SheetContainer>
      <Table>
        <thead>
          <tr>
            <Th className="index-col"></Th>
            {columns.map(col => <Th key={col}>{col}</Th>)}
            <Th><AddBtn onClick={() => { /* Logic to add column could go here */ }}>+</AddBtn></Th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, r) => (
            <tr key={r}>
              <Td className="index-col">{r + 1}</Td>
              {columns.map((col, cIndex) => {
                const isEditing = editing?.r === r && editing?.c === col;
                return (
                  <Td key={col} onClick={() => startEdit(r, col, row[col])} $editing={isEditing}>
                    {isEditing ? (
                      <Input ref={inputRef} value={editValue} onChange={e => setEditValue(e.target.value)}
                        onBlur={saveCell} onKeyDown={e => handleKeyDown(e, r, col, cIndex)} />
                    ) : ( <CellContent>{row[col]}</CellContent> )}
                  </Td>
                );
              })}
              <Td></Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </SheetContainer>
  );
};

export default Spreadsheet;

// --- CSS ---
const SheetContainer = styled.div`
  flex: 1; overflow: auto; background: var(--bg-surface); border: 1px solid var(--border-color); 
  border-radius: 12px; box-shadow: var(--shadow-sm); position: relative;
`;
const Table = styled.table` width: 100%; border-collapse: separate; border-spacing: 0; text-align: left; font-size: 14px; `;
const Th = styled.th`
  position: sticky; top: 0; background: var(--bg-surface); color: var(--text-muted); z-index: 10;
  font-weight: 600; padding: 12px 16px; border-bottom: 2px solid var(--border-color);
  border-right: 1px solid var(--border-color); white-space: nowrap; backdrop-filter: blur(10px);
`;
const Td = styled.td`
  padding: 0; border-bottom: 1px solid var(--border-color); border-right: 1px solid var(--border-color);
  position: relative; min-width: 140px; height: 38px; cursor: cell;
  background: ${props => props.$editing ? 'var(--bg-app)' : 'transparent'};
  box-shadow: ${props => props.$editing ? 'inset 0 0 0 2px var(--accent)' : 'none'};
  &:hover { background: var(--bg-hover); }
  &.index-col { width: 50px; min-width: 50px; background: var(--bg-app); color: var(--text-muted); text-align: center; cursor: default;}
`;
const CellContent = styled.div` padding: 8px 12px; height: 100%; width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-main);`;
const Input = styled.input` width: 100%; height: 100%; border: none; outline: none; padding: 8px 12px; background: transparent; color: var(--text-main); font-family: inherit; font-size: 14px;`;
const AddBtn = styled.button`background: none; border: none; color: var(--text-muted); font-size: 16px; cursor: pointer;`;