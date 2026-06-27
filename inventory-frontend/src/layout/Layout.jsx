import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import styled from 'styled-components';

const Layout = () => {
  return (
    <LayoutWrapper>
      <Sidebar />
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutWrapper>
  );
};

export default Layout;

const LayoutWrapper = styled.div`display: flex; height: 100vh; overflow: hidden; background: var(--bg-app);`;
const MainContent = styled.main`flex: 1; padding: 24px 32px; overflow: hidden;`;