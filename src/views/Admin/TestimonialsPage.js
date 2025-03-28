import React, { useState, useEffect, useCallback } from 'react';
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
  CImage,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CAlert,
  CSpinner,
  CBadge,
  CPagination,
  CPaginationItem,
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilTrash, cilCheckCircle, cilWarning, cilOptions } from '@coreui/icons';

const AdminTestimonialsPage = () => {
  // State
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    rating: 5,
    image: null,
    status: 'pending',
  });

  const BASE_URL = 'http://localhost:8000';

  // Status badge colors
  const statusColors = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
  };

  // Status options for dropdown
  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: cilWarning, color: 'warning' },
    { value: 'approved', label: 'Approved', icon: cilCheckCircle, color: 'success' },
    { value: 'rejected', label: 'Rejected', icon: cilWarning, color: 'danger' },
  ];

  // Show toast notification
  const showToast = (message, color) => {
    setToast(
      <CToast autohide={true} delay={3000} color={color}>
        <CToastHeader closeButton>
          <strong className="me-auto">Notification</strong>
        </CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>
    );
  };

  // Fetch testimonials
  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/testimonial/`);
      setTestimonials(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
      setError('Failed to fetch testimonials. Please try again later.');
      showToast('Failed to fetch testimonials', 'danger');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      description: '',
      rating: 5,
      image: null,
      status: 'pending',
    });
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    setFormData({ ...formData, image: file });
    
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Submit testimonial
  const handleAddTestimonial = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('rating', formData.rating.toString());
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await axios.post(`${BASE_URL}/testimonial/`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      fetchTestimonials();
      setModalVisible(false);
      resetForm();
      showToast('Testimonial added successfully!', 'success');
    } catch (err) {
      console.error('Failed to add testimonial:', err);
      setError(err.response?.data?.detail || 'Failed to add testimonial. Please try again.');
      showToast('Failed to add testimonial', 'danger');
    }
  };

  // Update status
  const handleUpdateStatus = async (testimonialId, status) => {
    try {
      await axios.patch(
        `${BASE_URL}/testimonial/${testimonialId}/status?status=${status}`,
        null,
        { headers: { 'Content-Type': 'application/json' } }
      );
      fetchTestimonials();
      showToast('Status updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update status:', err);
      showToast('Failed to update status', 'danger');
    }
  };

  // Delete testimonial
  const handleDeleteTestimonial = async (testimonialId) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      await axios.delete(`${BASE_URL}/testimonial/${testimonialId}`);
      fetchTestimonials();
      showToast('Testimonial deleted successfully!', 'success');
    } catch (err) {
      console.error('Failed to delete testimonial:', err);
      showToast('Failed to delete testimonial', 'danger');
    }
  };

  // View testimonial
  const handleViewTestimonial = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setViewModalVisible(true);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = testimonials.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <CContainer fluid>
      <CToaster placement="top-end">
        {toast}
      </CToaster>
      
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-0">Testimonials Management</h2>
                <p className="text-medium-emphasis small mb-0">
                  Manage customer testimonials and their approval status
                </p>
              </div>
              <CButton 
                color="primary" 
                onClick={() => setModalVisible(true)}
              >
                <CIcon icon={cilPlus} className="me-2" />
                Add Testimonial
              </CButton>
            </CCardHeader>
            
            <CCardBody>
              {error && <CAlert color="danger">{error}</CAlert>}

              <div className="d-flex justify-content-between mb-3">
                <div className="d-flex align-items-center">
                  <span className="me-2">Show:</span>
                  <CFormSelect 
                    size="sm" 
                    style={{ width: '80px' }}
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    {[5, 10, 20, 50].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </CFormSelect>
                </div>
              </div>

              {/* Add Testimonial Modal */}
              <CModal 
                visible={modalVisible} 
                onClose={() => {
                  setModalVisible(false);
                  resetForm();
                }}
                size="lg"
              >
                <CModalHeader closeButton>
                  <CModalTitle>Add New Testimonial</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CForm onSubmit={handleAddTestimonial}>
                    <div className="mb-3">
                      <CFormInput
                        type="text"
                        name="name"
                        label="Name"
                        placeholder="Enter customer name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <CFormInput
                        type="email"
                        name="email"
                        label="Email"
                        placeholder="Enter customer email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <CFormTextarea
                        name="description"
                        label="Testimonial"
                        placeholder="Enter testimonial content"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <CFormSelect
                        name="rating"
                        label="Rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        required
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                        ))}
                      </CFormSelect>
                    </div>
                    <div className="mb-3">
                      <CFormInput
                        type="file"
                        label="Customer Photo (Optional)"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <p className="small text-medium-emphasis">Preview:</p>
                          <CImage 
                            src={imagePreview} 
                            thumbnail 
                            width={100} 
                            height={100} 
                            alt="Preview" 
                          />
                        </div>
                      )}
                    </div>
                    <CModalFooter>
                      <CButton 
                        type="button" 
                        color="secondary" 
                        onClick={() => {
                          setModalVisible(false);
                          resetForm();
                        }}
                      >
                        Cancel
                      </CButton>
                      <CButton type="submit" color="primary">
                        Submit Testimonial
                      </CButton>
                    </CModalFooter>
                  </CForm>
                </CModalBody>
              </CModal>

              {/* View Testimonial Modal */}
              <CModal 
                visible={viewModalVisible} 
                onClose={() => setViewModalVisible(false)}
                size="lg"
              >
                <CModalHeader closeButton>
                  <CModalTitle>Testimonial Details</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  {selectedTestimonial && (
                    <div>
                      <div className="mb-4">
                        <div className="d-flex align-items-center">
                          {selectedTestimonial.image && (
                            <CImage
                              src={`${BASE_URL}${selectedTestimonial.image}`}
                              alt={selectedTestimonial.name}
                              thumbnail
                              width={80}
                              height={80}
                              className="me-3"
                            />
                          )}
                          <div>
                            <h4>{selectedTestimonial.name}</h4>
                            <p className="text-medium-emphasis">{selectedTestimonial.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h5>Rating</h5>
                        <div>
                          {[...Array(5)].map((_, i) => (
                            <span 
                              key={i} 
                              style={{ 
                                color: i < selectedTestimonial.rating ? '#ffc107' : '#e4e5e9',
                                fontSize: '1.5rem'
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h5>Testimonial</h5>
                        <div className="p-3 bg-light rounded">
                          <p style={{ whiteSpace: 'pre-line' }}>{selectedTestimonial.description}</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <h5>Status</h5>
                        <CBadge color={statusColors[selectedTestimonial.status]}>
                          {selectedTestimonial.status}
                        </CBadge>
                      </div>
                    </div>
                  )}
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setViewModalVisible(false)}>
                    Close
                  </CButton>
                </CModalFooter>
              </CModal>

              {/* Loading State */}
              {loading && (
                <div className="text-center my-5">
                  <CSpinner color="primary" />
                  <p>Loading testimonials...</p>
                </div>
              )}

              {/* Empty State */}
              {!loading && testimonials.length === 0 && (
  <div className="text-center my-5">
    <h4>No testimonials found</h4>
    <p>Click the &quot;Add Testimonial&quot; button to create one</p>
  </div>
)}

              {/* Testimonials Table */}
              {!loading && testimonials.length > 0 && (
                <>
                  <div className="table-responsive">
                    <CTable striped hover responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Customer</CTableHeaderCell>
                          <CTableHeaderCell>Testimonial</CTableHeaderCell>
                          <CTableHeaderCell>Rating</CTableHeaderCell>
                          <CTableHeaderCell>Photo</CTableHeaderCell>
                          <CTableHeaderCell>Status</CTableHeaderCell>
                          <CTableHeaderCell>Actions</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {currentItems.map((item) => (
                          <CTableRow key={item.id}>
                            <CTableDataCell>
                              <strong>{item.name}</strong>
                              <div className="small text-medium-emphasis">
                                {item.email}
                              </div>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div 
                                className="text-truncate" 
                                style={{ maxWidth: '200px', cursor: 'pointer' }}
                                onClick={() => handleViewTestimonial(item)}
                              >
                                {item.description}
                              </div>
                            </CTableDataCell>
                            <CTableDataCell>
                              {[...Array(5)].map((_, i) => (
                                <span 
                                  key={i} 
                                  style={{ color: i < item.rating ? '#ffc107' : '#e4e5e9' }}
                                >
                                  ★
                                </span>
                              ))}
                            </CTableDataCell>
                            <CTableDataCell>
                              {item.image && (
                                <CImage
                                  src={`${BASE_URL}${item.image}`}
                                  alt={item.name}
                                  thumbnail
                                  width={60}
                                  height={60}
                                />
                              )}
                            </CTableDataCell>
                            <CTableDataCell>
                              <CBadge color={statusColors[item.status]}>
                                {item.status}
                              </CBadge>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div className="d-flex gap-2">
                                <CDropdown>
                                  <CDropdownToggle color="secondary" size="sm">
                                    <CIcon icon={cilOptions} />
                                  </CDropdownToggle>
                                  <CDropdownMenu>
                                    {statusOptions.map((option) => (
                                      <CDropdownItem 
                                        key={option.value}
                                        onClick={() => handleUpdateStatus(item.id, option.value)}
                                        className={`text-${option.color}`}
                                      >
                                        <CIcon icon={option.icon} className="me-2" />
                                        {option.label}
                                      </CDropdownItem>
                                    ))}
                                    <CDropdownItem divider />
                                    <CDropdownItem 
                                      onClick={() => handleDeleteTestimonial(item.id)}
                                      className="text-danger"
                                    >
                                      <CIcon icon={cilTrash} className="me-2" />
                                      Delete
                                    </CDropdownItem>
                                  </CDropdownMenu>
                                </CDropdown>
                              </div>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <CPagination className="mt-3 justify-content-center">
                      <CPaginationItem 
                        disabled={currentPage === 1}
                        onClick={() => paginate(currentPage - 1)}
                        aria-label="Previous"
                      >
                        Previous
                      </CPaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <CPaginationItem
                          key={i + 1}
                          active={i + 1 === currentPage}
                          onClick={() => paginate(i + 1)}
                        >
                          {i + 1}
                        </CPaginationItem>
                      ))}
                      <CPaginationItem 
                        disabled={currentPage === totalPages}
                        onClick={() => paginate(currentPage + 1)}
                        aria-label="Next"
                      >
                        Next
                      </CPaginationItem>
                    </CPagination>
                  )}
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default AdminTestimonialsPage;