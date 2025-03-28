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
  CAlert,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CBadge,
  CInputGroup,
  CInputGroupText,
  CToaster,
  CToast,
  CToastBody,
  CToastClose,
  CFormLabel,
  CFormTextarea,
  CCallout
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilPencil, cilTrash, cilSearch, cilInfo, cilWarning } from '@coreui/icons';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const BASE_URL = "http://127.0.0.1:8000";

  // Fetch categories
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/categories`);
      setCategories(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to fetch categories. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post(`${BASE_URL}/categories`, formData);
      if (response.status === 200) {
        fetchCategories();
        setModalVisible(false);
        resetForm();
        setToast(<CToast color="success" visible={true}>
          <CToastBody>
            <CIcon icon={cilInfo} className="me-2" />
            Category added successfully!
          </CToastBody>
          <CToastClose onClick={() => setToast(null)} />
        </CToast>);
      }
    } catch (err) {
      console.error('Failed to add category:', err);
      setError(err.response?.data?.detail || 'Failed to add category. Please try again.');
      setToast(<CToast color="danger" visible={true}>
        <CToastBody>
          <CIcon icon={cilWarning} className="me-2" />
          {err.response?.data?.detail || 'Failed to add category'}
        </CToastBody>
        <CToastClose onClick={() => setToast(null)} />
      </CToast>);
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.put(
        `${BASE_URL}/categories/${selectedCategory.id}`,
        formData
      );
      if (response.status === 200) {
        fetchCategories();
        setEditModalVisible(false);
        setSelectedCategory(null);
        resetForm();
        setToast(<CToast color="success" visible={true}>
          <CToastBody>
            <CIcon icon={cilInfo} className="me-2" />
            Category updated successfully!
          </CToastBody>
          <CToastClose onClick={() => setToast(null)} />
        </CToast>);
      }
    } catch (err) {
      console.error('Failed to update category:', err);
      setError(err.response?.data?.detail || 'Failed to update category. Please try again.');
      setToast(<CToast color="danger" visible={true}>
        <CToastBody>
          <CIcon icon={cilWarning} className="me-2" />
          {err.response?.data?.detail || 'Failed to update category'}
        </CToastBody>
        <CToastClose onClick={() => setToast(null)} />
      </CToast>);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) return;
    
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${BASE_URL}/categories/${id}`);
      fetchCategories();
      setToast(<CToast color="success" visible={true}>
        <CToastBody>
          <CIcon icon={cilInfo} className="me-2" />
          Category deleted successfully!
        </CToastBody>
        <CToastClose onClick={() => setToast(null)} />
      </CToast>);
    } catch (err) {
      console.error('Failed to delete category:', err);
      setError(err.response?.data?.detail || 'Failed to delete category. Please try again.');
      setToast(<CToast color="danger" visible={true}>
        <CToastBody>
          <CIcon icon={cilWarning} className="me-2" />
          {err.response?.data?.detail || 'Failed to delete category'}
        </CToastBody>
        <CToastClose onClick={() => setToast(null)} />
      </CToast>);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredCategories = categories
    .filter(category => category.name.toLowerCase().includes(searchTerm))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="categories-management">
      <CCard className="mb-4">
        <CCardHeader className="bg-white">
          <CRow className="align-items-center">
            <CCol xs={12} md={6}>
              <h4 className="mb-0">
                <CIcon icon={cilInfo} className="me-2 text-primary" />
                Categories Management
              </h4>
              <small className="text-muted">Manage your restaurant menu categories</small>
            </CCol>
            <CCol xs={12} md={6} className="text-md-end mt-3 mt-md-0">
              <CButton 
                color="primary" 
                onClick={() => setModalVisible(true)}
                shape="rounded-pill"
              >
                <CIcon icon={cilPlus} className="me-2" />
                Add New Category
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          <CCallout color="info" className="mb-4">
            <strong>Tip:</strong> Categories help organize your menu items. Create clear, distinct categories for better customer experience.
          </CCallout>

          <CRow className="mb-4">
            <CCol xs={12} lg={6}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="rounded-end"
                />
              </CInputGroup>
            </CCol>
            <CCol xs={12} lg={6} className="mt-3 mt-lg-0">
              <div className="d-flex justify-content-lg-end">
                <CBadge color="info" className="me-2">
                  Total Categories: {categories.length}
                </CBadge>
                
              </div>
            </CCol>
          </CRow>

          {isLoading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-2">Loading categories...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <CTable striped hover responsive className="table-borderless">
                <CTableHead className="bg-light">
                  <CTableRow>
                    <CTableHeaderCell width={60}>#</CTableHeaderCell>
                    <CTableHeaderCell>Category Name</CTableHeaderCell>
                    <CTableHeaderCell>Created</CTableHeaderCell>
                    <CTableHeaderCell width={150} className="text-center">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category, index) => (
                      <CTableRow key={category.id} className="align-middle">
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>
                          <strong>{category.name}</strong>
                          {category.description && (
                            <div className="text-muted small mt-1">
                              {category.description}
                            </div>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="small text-muted">
                            {new Date(category.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton
                            color="outline-warning"
                            size="sm"
                            onClick={() => {
                              setSelectedCategory(category);
                              setFormData({
                                name: category.name,
                                description: category.description || ''
                              });
                              setEditModalVisible(true);
                            }}
                            className="me-2"
                            title="Edit"
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton
                            color="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            title="Delete"
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={4} className="text-center py-5">
                        <CIcon icon={cilWarning} size="xl" className="text-warning mb-2" />
                        <h5>No categories found</h5>
                        <p className="text-muted">
                          {searchTerm ? 'Try a different search term' : 'Add your first category to get started'}
                        </p>
                        <CButton 
                          color="primary" 
                          onClick={() => setModalVisible(true)}
                          className="mt-2"
                        >
                          <CIcon icon={cilPlus} className="me-2" />
                          Add Category
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Add Category Modal */}
      <CModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        size="lg"
        backdrop="static"
      >
        <CModalHeader closeButton>
          <CModalTitle>Add New Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleAddCategory}>
            <div className="mb-4">
              <CFormLabel htmlFor="name">Category Name *</CFormLabel>
              <CFormInput
                type="text"
                id="name"
                name="name"
                placeholder="e.g., Appetizers, Main Course, Desserts"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="form-control-lg"
              />
            </div>
            <div className="mb-4">
              <CFormLabel htmlFor="description">Description (Optional)</CFormLabel>
              <CFormTextarea
                id="description"
                name="description"
                placeholder="Add a short description about this category"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <CModalFooter>
              <CButton 
                color="secondary" 
                onClick={() => setModalVisible(false)}
                variant="outline"
              >
                Cancel
              </CButton>
              <CButton 
                color="primary" 
                type="submit"
                className="px-4"
              >
                Save Category
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>

      {/* Edit Category Modal */}
      <CModal 
        visible={editModalVisible} 
        onClose={() => setEditModalVisible(false)} 
        size="lg"
        backdrop="static"
      >
        <CModalHeader closeButton>
          <CModalTitle>Edit Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleEditCategory}>
            <div className="mb-4">
              <CFormLabel htmlFor="editName">Category Name *</CFormLabel>
              <CFormInput
                type="text"
                id="editName"
                name="name"
                placeholder="Category name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="form-control-lg"
              />
            </div>
            <div className="mb-4">
              <CFormLabel htmlFor="editDescription">Description</CFormLabel>
              <CFormTextarea
                id="editDescription"
                name="description"
                placeholder="Category description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <CModalFooter>
              <CButton 
                color="secondary" 
                onClick={() => setEditModalVisible(false)}
                variant="outline"
              >
                Cancel
              </CButton>
              <CButton 
                color="primary" 
                type="submit"
                className="px-4"
              >
                Update Category
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>

      <CToaster placement="top-end">
        {toast}
      </CToaster>
    </div>
  );
};

export default CategoriesManagement;