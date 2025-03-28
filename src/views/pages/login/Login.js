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
  CImage,
  CAlert
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilUser, cilLockLocked } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
// import logo from '../../assets/img/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Password length validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
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

      // Store tokens securely
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('csrf_token', response.data.csrf_token);

      // Set default axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      axios.defaults.headers.common['X-CSRF-Token'] = response.data.csrf_token;

      // Fetch user details after successful login
      const userResponse = await axios.get('http://127.0.0.1:8000/users/me');
      const user = userResponse.data;

      // Store user data
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      if (user.role === 'admin' || user.role === 'superadmin') {
        navigate('/Admin/AdminDashboard');
      } else if (user.role === 'manager') {
        navigate('/Manager/Dashboard');
      } else {
        navigate('/User/Dashboard');
      }

    } catch (err) {
      console.error('Login error:', err);

      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError('Invalid request. Please check your input.');
            break;
          case 401:
            setError('Invalid email or password.');
            break;
          case 403:
            setError('Account is disabled or not authorized.');
            break;
          case 429:
            setError('Too many attempts. Please try again later.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError('Login failed. Please try again.');
        }
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
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
                    {/* <CImage src={logo} height={60} alt="Company Logo" /> */}
                  </div>

                  <CForm onSubmit={handleLogin}>
                    <h1 className="text-center mb-4">Login</h1>
                    <p className="text-medium-emphasis text-center mb-4">Enter your credentials to continue</p>

                    {/* Error message display */}
                    {error && (
                      <CAlert color="danger" className="text-center">
                        {error}
                      </CAlert>
                    )}

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
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

                    <CRow className="mt-3">
                      <CCol xs={12} className="text-center">
                        <a href="/forgot-password" className="text-decoration-none">
                          Forgot password?
                        </a>
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