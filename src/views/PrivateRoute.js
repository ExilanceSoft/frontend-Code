import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const currentPath = window.location.pathname;

  console.log("Token:", token);
  console.log("User Role:", userRole);
  console.log("Expected Role:", role);
  console.log("Current Path:", currentPath);

  // Define public routes
  const publicRoutes = ['/GoshalaPage', '/login', '/register', '/404', '/500'];

  // Allow access to public routes
  if (publicRoutes.some((route) => currentPath.startsWith(route))) {
    return <Outlet />;
  }

  // Redirect to login if no token
  if (!token) {
    console.log("Redirecting to login (No token)");
    return <Navigate to="/login" />;
  }

  // Redirect if role mismatch
  if (role && userRole !== role) {
    console.log("Role mismatch. Redirecting based on user role...");
    if (userRole === 'admin') return <Navigate to="/dashboard" />;
    if (userRole === 'doctor') return <Navigate to="/Doctor/DoctorDashboard" />;
    if (userRole === 'visitor') return <Navigate to="/visitor/VisitorDashboard" />;
    return <Navigate to="/404" />;
  }

  // Render nested route
  return <Outlet />;
};

PrivateRoute.propTypes = {
  role: PropTypes.string, 
};

export default PrivateRoute;
