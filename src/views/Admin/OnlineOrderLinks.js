import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CCard,
  CCardHeader,
  CCardBody,
  CAlert,
  CSpinner,
  CImage,
  CInputGroup,
  CInputGroupText,
  CFormLabel
} from '@coreui/react-pro';  // Changed from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilPlus, cilSearch, cilCloudUpload } from '@coreui/icons';

const OnlineOrderLinks = () => {
  const [links, setLinks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);

  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    logo: null,
    branch_id: '',
  });

  const [validationErrors, setValidationErrors] = useState({
    platform: '',
    url: '',
    branch_id: '',
    logo: ''
  });

  useEffect(() => {
    fetchLinks();
    fetchBranches();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/online-order-links/');
      setLinks(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch links:', err);
      setError('Failed to fetch links. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/branches');
      setBranches(response.data);
    } catch (err) {
      console.error('Failed to fetch branches:', err);
      setError('Failed to load branch data');
    }
  };

  const resetForm = () => {
    setFormData({
      platform: '',
      url: '',
      logo: null,
      branch_id: '',
    });
    setSelectedLink(null);
    setLogoPreview(null);
    setValidationErrors({
      platform: '',
      url: '',
      branch_id: '',
      logo: ''
    });
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.platform.trim()) {
      errors.platform = 'Platform name is required';
      isValid = false;
    }

    if (!formData.url.trim()) {
      errors.url = 'URL is required';
      isValid = false;
    } else if (!/^https?:\/\//i.test(formData.url)) {
      errors.url = 'URL must start with http:// or https://';
      isValid = false;
    }

    if (!formData.branch_id) {
      errors.branch_id = 'Branch selection is required';
      isValid = false;
    }

    if (!selectedLink && !formData.logo) {
      errors.logo = 'Logo is required for new links';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setValidationErrors({ ...validationErrors, logo: 'Please upload an image file' });
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setValidationErrors({ ...validationErrors, logo: 'File size must be less than 2MB' });
        return;
      }

      setFormData({ ...formData, logo: file });
      setValidationErrors({ ...validationErrors, logo: '' });

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (link) => {
    setSelectedLink(link);
    setFormData({
      platform: link.platform,
      url: link.url,
      logo: null,
      branch_id: link.branch_id,
    });
    setLogoPreview(link.logo ? `http://127.0.0.1:8000${link.logo}` : null);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        setLoading(true);
        await axios.delete(`http://127.0.0.1:8000/api/online-order-links/${id}`);
        fetchLinks();
        setSuccess('Link deleted successfully.');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Failed to delete link:', err);
        setError('Failed to delete link. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const form = new FormData();
      form.append('platform', formData.platform);
      form.append('url', formData.url);
      form.append('branch_id', formData.branch_id);
      
      if (formData.logo) {
        form.append('logo', formData.logo);
      }

      if (selectedLink) {
        await axios.put(
          `http://127.0.0.1:8000/api/online-order-links/${selectedLink.id}`,
          form,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setSuccess('Link updated successfully.');
      } else {
        await axios.post(
          'http://127.0.0.1:8000/api/online-order-links/',
          form,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setSuccess('Link created successfully.');
      }

      fetchLinks();
      setModalVisible(false);
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to save link:', err);
      setError(err.response?.data?.detail || 'Failed to save link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredLinks = links.filter(link => {
    const searchLower = searchTerm.toLowerCase();
    return (
      link.platform.toLowerCase().includes(searchLower) ||
      link.url.toLowerCase().includes(searchLower) ||
      (branches.find(b => b.id === link.branch_id)?.name || '').toLowerCase().includes(searchLower)
    );
  });

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Online Order Links</h2>
          <div className="d-flex">
            <CInputGroup className="me-3" style={{ width: '300px' }}>
              <CInputGroupText>
                <CIcon icon={cilSearch} />
              </CInputGroupText>
              <CFormInput
                type="text"
                placeholder="Search links..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CInputGroup>
            <CButton color="primary" onClick={openAddModal}>
              <CIcon icon={cilPlus} className="me-2" />
              Add New Link
            </CButton>
          </div>
        </div>
      </CCardHeader>
      <CCardBody>
        {error && <CAlert color="danger" dismissible onClose={() => setError('')}>{error}</CAlert>}
        {success && <CAlert color="success" dismissible onClose={() => setSuccess('')}>{success}</CAlert>}

        {loading && !links.length ? (
          <div className="text-center py-4">
            <CSpinner color="primary" />
            <p>Loading links...</p>
          </div>
        ) : (
          <CTable responsive hover striped>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell width="10%">Logo</CTableHeaderCell>
                <CTableHeaderCell width="20%">Platform</CTableHeaderCell>
                <CTableHeaderCell width="30%">URL</CTableHeaderCell>
                <CTableHeaderCell width="20%">Branch</CTableHeaderCell>
                <CTableHeaderCell width="20%">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredLinks.length > 0 ? (
                filteredLinks.map((link) => (
                  <CTableRow key={link.id}>
                    <CTableDataCell>
                      {link.logo ? (
                        <CImage
                          thumbnail
                          src={`http://127.0.0.1:8000${link.logo}`}
                          alt={link.platform}
                          width={50}
                          height={50}
                        />
                      ) : (
                        'N/A'
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{link.platform}</CTableDataCell>
                    <CTableDataCell>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.url.length > 40 ? `${link.url.substring(0, 40)}...` : link.url}
                      </a>
                    </CTableDataCell>
                    <CTableDataCell>
                      {branches.find((branch) => branch.id === link.branch_id)?.name || "N/A"}
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex">
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => openEditModal(link)}
                          disabled={loading}
                        >
                          <CIcon icon={cilPencil} /> Edit
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => handleDelete(link.id)}
                          disabled={loading}
                        >
                          <CIcon icon={cilTrash} /> Delete
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={5} className="text-center">
                    {searchTerm ? 'No matching links found' : 'No online order links available'}
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>

      <CModal
        visible={modalVisible}
        onClose={() => { setModalVisible(false); resetForm(); }}
        size="lg"
        backdrop="static"
      >
        <CModalHeader closeButton>
          <CModalTitle>{selectedLink ? "Edit" : "Add"} Online Order Link</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Platform Name *</CFormLabel>
              <CFormInput
                type="text"
                name="platform"
                placeholder="e.g. Uber Eats, DoorDash"
                value={formData.platform}
                onChange={handleInputChange}
                invalid={!!validationErrors.platform}
              />
              {validationErrors.platform && (
                <div className="invalid-feedback">{validationErrors.platform}</div>
              )}
            </div>

            <div className="mb-3">
              <CFormLabel>Order URL *</CFormLabel>
              <CFormInput
                type="url"
                name="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={handleInputChange}
                invalid={!!validationErrors.url}
              />
              {validationErrors.url && (
                <div className="invalid-feedback">{validationErrors.url}</div>
              )}
            </div>

            <div className="mb-3">
              <CFormLabel>Branch *</CFormLabel>
              <CFormSelect
                name="branch_id"
                value={formData.branch_id}
                onChange={handleInputChange}
                invalid={!!validationErrors.branch_id}
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </CFormSelect>
              {validationErrors.branch_id && (
                <div className="invalid-feedback">{validationErrors.branch_id}</div>
              )}
            </div>

            <div className="mb-3">
              <CFormLabel>
                {selectedLink ? 'Update Logo' : 'Upload Logo *'}
              </CFormLabel>
              <CFormInput
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                invalid={!!validationErrors.logo}
              />
              {validationErrors.logo && (
                <div className="invalid-feedback">{validationErrors.logo}</div>
              )}
              
              {(logoPreview || (selectedLink?.logo && !formData.logo)) && (
                <div className="mt-3">
                  <p className="small text-muted">Logo Preview:</p>
                  <CImage
                    thumbnail
                    src={logoPreview || `http://127.0.0.1:8000${selectedLink.logo}`}
                    width={100}
                    height={100}
                    className="border p-1"
                  />
                </div>
              )}
              
              {formData.logo && formData.logo instanceof File && (
                <div className="mt-2 small text-muted">
                  <CIcon icon={cilCloudUpload} /> Selected: {formData.logo.name}
                </div>
              )}
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => { setModalVisible(false); resetForm(); }}
            disabled={loading}
          >
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <CSpinner component="span" size="sm" aria-hidden="true" />
                {selectedLink ? ' Updating...' : ' Creating...'}
              </>
            ) : selectedLink ? (
              'Save Changes'
            ) : (
              'Add Link'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default OnlineOrderLinks;