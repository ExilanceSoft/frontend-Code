import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CAvatar,
  CDropdown,
  CDropdownMenu,
  CDropdownToggle,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CDropdownItem,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilUser, cilAccountLogout, cilSettings } from '@coreui/icons';
import axios from 'axios';

const AppHeaderDropdown = () => {
  const [user, setUser] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/users/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'X-CSRF-Token': localStorage.getItem('csrf_token')
          }
        });

        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          try {
            const refreshResponse = await axios.post(
              'http://127.0.0.1:8000/users/refresh-token',
              {},
              {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`
                }
              }
            );

            localStorage.setItem('access_token', refreshResponse.data.access_token);
            localStorage.setItem('csrf_token', refreshResponse.data.csrf_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshResponse.data.access_token}`;
            axios.defaults.headers.common['X-CSRF-Token'] = refreshResponse.data.csrf_token;

            // Retry the original request
            const retryResponse = await axios.get('http://127.0.0.1:8000/users/me');
            setUser(retryResponse.data);
          } catch (refreshError) {
            console.error('Refresh token failed:', refreshError);
            handleLogout();
          }
        } else {
          setError('Failed to load user profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.post(
        'http://127.0.0.1:8000/users/logout',
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'X-CSRF-Token': localStorage.getItem('csrf_token')
          }
        }
      );

      // Clear all auth-related data
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('csrf_token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['X-CSRF-Token'];

      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout API fails, clear local storage and redirect
      localStorage.clear();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CDropdown variant="nav-item" alignment="end">
        <CDropdownToggle className="py-0" caret={false}>
          <CAvatar
            color="primary"
            textColor="white"
            size="md"
          >
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </CAvatar>
        </CDropdownToggle>
        <CDropdownMenu className="pt-0">
          <CDropdownItem 
            onClick={() => setVisible(true)} 
            style={{ cursor: 'pointer' }}
            disabled={loading}
          >
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>
          <CDropdownItem 
            onClick={() => navigate('/settings')}
            style={{ cursor: 'pointer' }}
          >
            <CIcon icon={cilSettings} className="me-2" />
            Settings
          </CDropdownItem>
          <CDropdownItem 
            onClick={handleLogout} 
            style={{ cursor: 'pointer', color: 'red' }}
            disabled={loading}
          >
            <CIcon icon={cilAccountLogout} className="me-2 text-danger" />
            {loading ? 'Logging out...' : 'Logout'}
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader closeButton>
          <h5>User Profile</h5>
        </CModalHeader>
        <CModalBody className="text-center">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : user ? (
            <>
              <CAvatar
                color="primary"
                textColor="white"
                size="xl"
                className="mb-3"
              >
                {user.username?.charAt(0).toUpperCase()}
              </CAvatar>
              <h4>{user.username}</h4>
              <p className="text-medium-emphasis">{user.email}</p>
              <div className="mt-3">
                <p>
                  <strong>Role:</strong> {user.role}
                </p>
                <p>
                  <strong>Mobile:</strong> {user.mobile_number}
                </p>
              </div>
            </>
          ) : (
            <p>No user data available</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton 
            color="primary" 
            onClick={() => {
              setVisible(false);
              navigate('/profile/edit');
            }}
          >
            Edit Profile
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default AppHeaderDropdown;