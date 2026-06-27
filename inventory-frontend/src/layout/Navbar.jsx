import React, { useContext } from 'react';
import { FiSun, FiMoon, FiSettings, FiUser } from 'react-icons/fi';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="navbar">
      <div className="navbar-left">
         {/* Breadcrumbs or Contextual Title could go here */}
      </div>
      <div className="navbar-right">
        <button className="icon-btn" onClick={toggleTheme}>
          {isDark ? <FiSun /> : <FiMoon />}
        </button>
        <button className="icon-btn"><FiSettings /></button>
        <button className="icon-btn profile-btn"><FiUser /></button>
      </div>
    </header>
  );
};

export default Navbar;