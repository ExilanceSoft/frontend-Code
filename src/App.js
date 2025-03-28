import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CSpinner } from '@coreui/react-pro';
import './scss/style.scss';
import './scss/examples.scss';

// Layouts
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// Public Pages
const WebIndex = React.lazy(() => import('./website/WebIndex'));
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

// Admin Pages
const MenuManagement = React.lazy(() => import('./views/Admin/MenuManagement'));
const VisitorTestimonialsPage = React.lazy(() => import('./views/Admin/VisitorTestimonialsPage'));
const FranchiseRequests = React.lazy(() => import('./views/Admin/FranchiseRequests'));
const JobPositions = React.lazy(() => import('./views/Admin/JobPositions'));
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const JobApplicationFollowUp = React.lazy(() => import('./views/Admin/JobApplicationFollowUp'));
const Branches = React.lazy(() => import('./views/Admin/Branches'));
const GalleryCategoriesPage = React.lazy(() => import('./views/Admin/GalleryCategoriesPage'));
const OnlineOrderLinks = React.lazy(() => import('./views/Admin/OnlineOrderLinks'));
const ImagesPage = React.lazy(() => import('./views/Admin/ImagesPage'));
const TestimonialsPage = React.lazy(() => import('./views/Admin/TestimonialsPage'));
const AdminDashboard = React.lazy(() => import('./views/Admin/AdminDashboard'));
const CategoriesManagement = React.lazy(() => import('./views/Admin/CategoriesManagement'));
 const UserRegistaration = React.lazy(() => import('./views/Admin/UserRegistaration'));

const App = () => {
  return (
    <Router> {/* Changed from HashRouter to BrowserRouter */}
      <Suspense fallback={<div className="pt-3 text-center"><CSpinner color="primary" variant="grow" /></div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/WebIndex/*" element={<WebIndex />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          <Route path="/" element={<Navigate to="/WebIndex" />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={<DefaultLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="MenuManagement" element={<MenuManagement />} />
            <Route path="VisitorTestimonialsPage" element={<VisitorTestimonialsPage />} />
            <Route path="FranchiseRequests" element={<FranchiseRequests />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="JobPositions" element={<JobPositions />} />
            <Route path="Branches" element={<Branches />} />
            <Route path="JobApplicationFollowUp" element={<JobApplicationFollowUp />} />
            <Route path="GalleryCategoriesPage" element={<GalleryCategoriesPage />} />
            <Route path="OnlineOrderLinks" element={<OnlineOrderLinks />} />
            <Route path="ImagesPage" element={<ImagesPage />} />
            <Route path="CategoriesManagement" element={<CategoriesManagement />} />
            <Route path="TestimonialsPage" element={<TestimonialsPage />} />
            <Route path="UserRegistaration" element={<UserRegistaration />} />

          </Route>

          {/* Catch-All Route for 404 */}
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
