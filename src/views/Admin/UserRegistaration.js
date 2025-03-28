import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CAlert,
  CSpinner,
  CInputGroup,
  CInputGroupText,
  CBadge
} from '@coreui/react-pro';
import CIcon from  '@coreui/icons-react';
import { cilPencil, cilTrash, cilPlus, cilUser, cilLockLocked, cilPhone, cilEnvelopeOpen } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';

const UserRegistaration = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    mobile_number: '',
    role: 'user',
  });

  // Fetch users from the database
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'X-CSRF-Token': localStorage.getItem('csrf_token')
        }
      });
      setUsers(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch users:', err);
      if (err.response?.status === 401) {
        try {
          // Attempt token refresh
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
          const retryResponse = await axios.get('http://127.0.0.1:8000/users');
          setUsers(retryResponse.data);
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);
          handleLogout();
        }
      } else {
        setError(err.response?.data?.detail || 'Failed to fetch users. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (formData.username.length < 3) errors.username = 'Username must be at least 3 characters';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.mobile_number.trim()) errors.mobile_number = 'Mobile number is required';
    if (!/^\+?[1-9]\d{1,14}$/.test(formData.mobile_number)) errors.mobile_number = 'Invalid mobile number format';
    if (!formData.role) errors.role = 'Role is required';
    
    // Only validate password for new user registration
    if (!selectedUser) {
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      } else if (!/[A-Z]/.test(formData.password)) {
        errors.password = 'Password must contain at least one uppercase letter';
      } else if (!/[a-z]/.test(formData.password)) {
        errors.password = 'Password must contain at least one lowercase letter';
      } else if (!/[0-9]/.test(formData.password)) {
        errors.password = 'Password must contain at least one number';
      } else if (!/[!@#$%^&*]/.test(formData.password)) {
        errors.password = 'Password must contain at least one special character';
      }
    } else if (formData.password && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/users/register',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'X-CSRF-Token': localStorage.getItem('csrf_token')
          }
        }
      );
      
      setSuccess('User registered successfully!');
      setError('');
      setModalVisible(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error('Failed to register user:', err);
      if (err.response?.status === 403) {
        setError('You do not have permission to register users');
      } else {
        setError(err.response?.data?.detail || 'Failed to register user. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: '', // Password is not pre-filled for security reasons
      email: user.email,
      mobile_number: user.mobile_number,
      role: user.role,
    });
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const updateData = { ...formData };
      // Don't send password if it's empty (not being changed)
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await axios.put(
        `http://127.0.0.1:8000/users/${selectedUser.id}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'X-CSRF-Token': localStorage.getItem('csrf_token')
          }
        }
      );
      
      setSuccess('User updated successfully!');
      setError('');
      setEditModalVisible(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error('Failed to update user:', err);
      if (err.response?.status === 403) {
        setError('You do not have permission to update this user');
      } else {
        setError(err.response?.data?.detail || 'Failed to update user. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    setLoading(true);
    try {
      await axios.delete(
        `http://127.0.0.1:8000/users/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'X-CSRF-Token': localStorage.getItem('csrf_token')
          }
        }
      );
      
      setSuccess('User deleted successfully!');
      setError('');
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
      if (err.response?.status === 403) {
        setError('You do not have permission to delete this user');
      } else {
        setError(err.response?.data?.detail || 'Failed to delete user. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('csrf_token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['X-CSRF-Token'];
    navigate('/login');
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      email: '',
      mobile_number: '',
      role: 'user',
    });
    setSelectedUser(null);
    setFormErrors({});
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'warning';
      case 'superadmin': return 'danger';
      case 'manager': return 'info';
      default: return 'primary';
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
        <CButton 
          color="primary" 
          onClick={() => setModalVisible(true)}
          className="d-flex align-items-center"
        >
          <CIcon icon={cilPlus} className="me-2" />
          Add User
        </CButton>
      </div>

      {error && <CAlert color="danger" className="mb-3">{error}</CAlert>}
      {success && <CAlert color="success" className="mb-3">{success}</CAlert>}

      {/* User Table */}
      {loading && !users.length ? (
        <div className="text-center py-5">
          <CSpinner color="primary" />
        </div>
      ) : (
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Username</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Mobile Number</CTableHeaderCell>
              <CTableHeaderCell>Role</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {users.map((user) => (
              <CTableRow key={user.id}>
                <CTableDataCell>{user.username}</CTableDataCell>
                <CTableDataCell>{user.email}</CTableDataCell>
                <CTableDataCell>{user.mobile_number}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <div className="d-flex gap-2">
                    <CButton 
                      color="warning" 
                      size="sm" 
                      onClick={() => handleEdit(user)}
                      disabled={loading}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton 
                      color="danger" 
                      size="sm" 
                      onClick={() => handleDelete(user.id)}
                      disabled={loading || user.role === 'superadmin'}
                      title={user.role === 'superadmin' ? 'Cannot delete superadmin' : ''}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}

      {/* Registration Modal */}
      <CModal 
        visible={modalVisible} 
        onClose={() => {
          setModalVisible(false);
          resetForm();
        }}
        backdrop="static"
      >
        <CModalHeader closeButton>
          <CModalTitle>Register New User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  name="username"
                  placeholder="Username (min 3 characters)"
                  value={formData.username}
                  onChange={handleInputChange}
                  invalid={!!formErrors.username}
                />
              </CInputGroup>
              {formErrors.username && <div className="text-danger small mt-1">{formErrors.username}</div>}
            </div>

            <div className="mb-3">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilLockLocked} />
                </CInputGroupText>
                <CFormInput
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  invalid={!!formErrors.password}
                />
              </CInputGroup>
              {formErrors.password && <div className="text-danger small mt-1">{formErrors.password}</div>}
              <div className="form-text">
                Password must be at least 8 characters with uppercase, lowercase, number, and special character
              </div>
            </div>

            <div className="mb-3">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilEnvelopeOpen} />
                </CInputGroupText>
                <CFormInput
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  invalid={!!formErrors.email}
                />
              </CInputGroup>
              {formErrors.email && <div className="text-danger small mt-1">{formErrors.email}</div>}
            </div>

            <div className="mb-3">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilPhone} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  name="mobile_number"
                  placeholder="Mobile Number (e.g., +1234567890)"
                  value={formData.mobile_number}
                  onChange={handleInputChange}
                  invalid={!!formErrors.mobile_number}
                />
              </CInputGroup>
              {formErrors.mobile_number && <div className="text-danger small mt-1">{formErrors.mobile_number}</div>}
            </div>

            <div className="mb-3">
              <CFormSelect
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                invalid={!!formErrors.role}
              >
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="superadmin">Superadmin</option>
              </CFormSelect>
              {formErrors.role && <div className="text-danger small mt-1">{formErrors.role}</div>}
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => {
              setModalVisible(false);
              resetForm();
            }}
            disabled={loading}
          >
            Cancel
          </CButton>
          <CButton 
            color="primary" 
            onClick={handleRegister} 
            disabled={loading}
          >
            {loading ? <CSpinner size="sm" /> : 'Register'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Modal */}
      <CModal 
        visible={editModalVisible} 
        onClose={() => {
          setEditModalVisible(false);
          resetForm();
        }}
        backdrop="static"
      >
        <CModalHeader closeButton>
          <CModalTitle>Edit User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  invalid={!!formErrors.username}
                />
              </CInputGroup>
              {formErrors.username && <div className="text-danger small mt-1">{formErrors.username}</div>}
            </div>

            <div className="mb-3">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilLockLocked} />
                </CInputGroupText>
                <CFormInput
                  type="password"
                  name="password"
                  placeholder="New Password (leave blank to keep current)"
                  value={formData.password}
                  onChange={handleInputChange}
                  invalid={!!formErrors.password}
                />
              </CInputGroup>
              {formErrors.password && <div className="text-danger small mt-1">{formErrors.password}</div>}
              <div className="form-text">Leave blank to keep current password</div>
            </div>

            <div className="mb-3">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilEnvelopeOpen} />
                </CInputGroupText>
                <CFormInput
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  invalid={!!formErrors.email}
                />
              </CInputGroup>
              {formErrors.email && <div className="text-danger small mt-1">{formErrors.email}</div>}
            </div>

            <div className="mb-3">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilPhone} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  name="mobile_number"
                  placeholder="Mobile Number (e.g., +1234567890)"
                  value={formData.mobile_number}
                  onChange={handleInputChange}
                  invalid={!!formErrors.mobile_number}
                />
              </CInputGroup>
              {formErrors.mobile_number && <div className="text-danger small mt-1">{formErrors.mobile_number}</div>}
            </div>

            <div className="mb-3">
              <CFormSelect
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                invalid={!!formErrors.role}
                disabled={selectedUser?.role === 'superadmin'}
              >
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="superadmin">Superadmin</option>
              </CFormSelect>
              {formErrors.role && <div className="text-danger small mt-1">{formErrors.role}</div>}
              {selectedUser?.role === 'superadmin' && (
                <div className="form-text text-warning">Superadmin role cannot be changed</div>
              )}
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => {
              setEditModalVisible(false);
              resetForm();
            }}
            disabled={loading}
          >
            Cancel
          </CButton>
          <CButton 
            color="primary" 
            onClick={handleUpdate} 
            disabled={loading}
          >
            {loading ? <CSpinner size="sm" /> : 'Save Changes'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default UserRegistaration;