import React from 'react';
import { FiSave, FiDownload, FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';

const Toolbar = ({ onSave, onDownload, onSearch }) => {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button className="toolbar-btn primary" onClick={onSave}><FiSave /> Save</button>
        <button className="toolbar-btn" onClick={onDownload}><FiDownload /> Download</button>
        <button className="toolbar-btn"><FiRefreshCw /> Refresh</button>
      </div>
      <div className="toolbar-right">
        <div className="search-box">
          <FiSearch className="search-icon"/>
          <input type="text" placeholder="Search inventory..." onChange={(e) => onSearch(e.target.value)} />
        </div>
        <button className="toolbar-btn"><FiFilter /> Filter</button>
      </div>
    </div>
  );
};

export default Toolbar;