import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react-pro';
import { AppSidebarNav } from './AppSidebarNav';
import navigation from '../_nav';

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);

  return (
    <CSidebar
      colorScheme="light"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible });
      }}
    >
      {/* Sidebar Header */}
      <CSidebarHeader className="bg-primary border-bottom d-flex align-items-center justify-content-between">
        {/* Sidebar Brand */}
        <CSidebarBrand as={NavLink} to="/" className="d-flex align-items-center">
          <span className="sidebar-brand-full" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
            Banjos
          </span>
          <span className="sidebar-brand-narrow" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
            G
          </span>
        </CSidebarBrand>

        {/* Close Button (Always Visible) */}
        <CCloseButton
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
          style={{
            position: 'absolute',
            right: '15px',
            top: '15px',
            zIndex: 1000,
            display: sidebarShow ? 'block' : 'none',
          }}
        />
      </CSidebarHeader>

      {/* Sidebar Navigation */}
      <AppSidebarNav items={navigation} />

      {/* Sidebar Toggler (For Expand/Collapse) */}
      <CSidebarToggler
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
