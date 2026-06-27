import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './layout/Layout';
import Inventory from './pages/Inventory';
import Analysis from './pages/Analysis';
import './styles/global.css'; // Keep your global CSS variables here

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Inventory />} />
            <Route path="analysis" element={<Analysis />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;