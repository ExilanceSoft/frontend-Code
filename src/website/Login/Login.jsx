import React, { useState } from 'react';
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CImage
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilUser, cilLockLocked } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation for email and password
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/users/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      // Store tokens in localStorage or secure storage
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('csrf_token', response.data.csrf_token);

      // Set default Authorization header for subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      
      // For CSRF protection on state-changing requests
      axios.defaults.headers.common['X-CSRF-Token'] = response.data.csrf_token;

      // Get user details after successful login
      const userResponse = await axios.get('http://127.0.0.1:8000/users/me');
      const user = userResponse.data;

      // Store user data
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      if (user.role === 'admin' || user.role === 'superadmin') {
        navigate('/Admin/AdminDashboard');
      } else {
        navigate('/User/Dashboard');
      }

    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);

      if (err.response) {
        if (err.response.status === 401) {
          setError('Invalid email or password.');
        } else if (err.response.status === 403) {
          setError('Account disabled or not authorized.');
        } else {
          setError(err.response.data.detail || 'Login failed. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  {/* Logo Section */}
                  <div className="text-center mb-4">
                    <CImage src={logo} height={60} alt="Logo" />
                  </div>

                  <CForm onSubmit={handleLogin}>
                    <h1 className="text-center mb-4">Login</h1>
                    <p className="text-center mb-4">Enter your credentials to login</p>

                    {/* Error message display */}
                    {error && (
                      <div className="alert alert-danger text-center" role="alert">
                        {error}
                      </div>
                    )}

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        aria-label="Email"
                        autoComplete="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        aria-label="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="8"
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol xs={12}>
                        <CButton 
                          color="primary" 
                          className="px-4 w-100" 
                          type="submit" 
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Logging in...
                            </>
                          ) : 'Login'}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;