import React from 'react';
import { AppAside, AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index';
import { Outlet } from 'react-router-dom'; // Import Outlet

const DefaultLayout = () => {
  return (
    <>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <Outlet /> {/* Render nested routes here */}
        </div>
        <AppFooter />
      </div>
      <AppAside />
    </>
  );
}

export default DefaultLayout;
