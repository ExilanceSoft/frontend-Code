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
  CFormCheck,
  CAlert,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CImage,
  CBadge,
  CInputGroup,
  CInputGroupText
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilPencil, cilTrash, cilSearch, cilImage, cilInfo } from '@coreui/icons';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_name: '',
    price: '',
    parcel_price: '',
    image: null,
    is_available: true,
    is_veg: true,
  });

  const BASE_URL = "http://127.0.0.1:8000";

  // Fetch menu items
  const fetchMenuItems = async (category = '') => {
    setIsLoading(true);
    try {
      const url = category
        ? `${BASE_URL}/menu/category/${category}`
        : `${BASE_URL}/menu`;
      const response = await axios.get(url);
      setMenuItems(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch menu items:', err);
      setError('Failed to fetch menu items. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories`);
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to fetch categories. Please try again later.');
    }
  };

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category_name: '',
      price: '',
      parcel_price: '',
      image: null,
      is_available: true,
      is_veg: true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category_name', formData.category_name);
      
      // Handle price
      const priceValue = parseFloat(formData.price);
      if (isNaN(priceValue)) {
        throw new Error('Price must be a valid number');
      }
      formDataToSend.append('price', priceValue);
      
      // Handle parcel price
      const parcelPriceValue = formData.parcel_price === '' ? null : parseFloat(formData.parcel_price);
      formDataToSend.append('parcel_price', parcelPriceValue === null || isNaN(parcelPriceValue) ? null : parcelPriceValue);
      
      // Boolean values
      formDataToSend.append('is_available', formData.is_available);
      formDataToSend.append('is_veg', formData.is_veg);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await axios.post(`${BASE_URL}/menu/add`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        fetchMenuItems();
        setModalVisible(false);
        resetForm();
        setSuccess('Menu item added successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error adding menu item:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to add menu item. Please try again.');
    }
  };

  const handleEditMenuItem = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category_name', formData.category_name);
      
      // Handle price
      const priceValue = parseFloat(formData.price);
      if (isNaN(priceValue)) {
        throw new Error('Price must be a valid number');
      }
      formDataToSend.append('price', priceValue);
      
      // Handle parcel price
      const parcelPriceValue = formData.parcel_price === '' ? null : parseFloat(formData.parcel_price);
      formDataToSend.append('parcel_price', parcelPriceValue === null || isNaN(parcelPriceValue) ? null : parcelPriceValue);
      
      // Boolean values
      formDataToSend.append('is_available', formData.is_available);
      formDataToSend.append('is_veg', formData.is_veg);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await axios.put(
        `${BASE_URL}/menu/${selectedMenuItem.id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        fetchMenuItems();
        setEditModalVisible(false);
        setSelectedMenuItem(null);
        resetForm();
        setSuccess('Menu item updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error updating menu item:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to update menu item. Please try again.');
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${BASE_URL}/menu/${id}`);
      fetchMenuItems();
      setSuccess('Menu item deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting menu item:', err);
      setError(err.response?.data?.detail || 'Failed to delete menu item. Please try again.');
    }
  };

  const handleCategoryFilter = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    fetchMenuItems(category);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                         item.description.toLowerCase().includes(searchTerm) ||
                         item.category_name.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory ? item.category_name === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const openViewModal = (item) => {
    setSelectedMenuItem(item);
    setViewModalVisible(true);
  };

  return (
    <CCard>
      <CCardHeader>
        <CRow className="align-items-center">
          <CCol xs={12} md={6}>
            <h2 className="mb-0">Menu Management</h2>
          </CCol>
          <CCol xs={12} md={6} className="text-md-end mt-2 mt-md-0">
            <CButton color="primary" onClick={() => setModalVisible(true)}>
              <CIcon icon={cilPlus} className="me-2" />
              Add Menu Item
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        {success && <CAlert color="success">{success}</CAlert>}

        <CRow className="mb-3">
          <CCol xs={12} md={6} className="mb-2 mb-md-0">
            <CInputGroup>
              <CInputGroupText>
                <CIcon icon={cilSearch} />
              </CInputGroupText>
              <CFormInput
                type="text"
                placeholder="Search by name, description or category..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </CInputGroup>
          </CCol>
          <CCol xs={12} md={6}>
            <CFormSelect
              value={selectedCategory}
              onChange={handleCategoryFilter}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>
        </CRow>

        {isLoading ? (
          <div className="text-center">
            <CSpinner color="primary" />
          </div>
        ) : (
          <div className="table-responsive">
            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Category</CTableHeaderCell>
                  <CTableHeaderCell>Price (₹)</CTableHeaderCell>
                  <CTableHeaderCell>Parcel Price (₹)</CTableHeaderCell>
                  <CTableHeaderCell>Image</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredMenuItems.length > 0 ? (
                  filteredMenuItems.map((item) => (
                    <CTableRow key={item.id}>
                      <CTableDataCell>{item.name}</CTableDataCell>
                      <CTableDataCell className="text-truncate" style={{ maxWidth: '200px' }}>
                        {item.description}
                      </CTableDataCell>
                      <CTableDataCell>{item.category_name}</CTableDataCell>
                      <CTableDataCell>₹{item.price.toFixed(2)}</CTableDataCell>
                      <CTableDataCell>
                        {item.parcel_price !== null ? `₹${item.parcel_price.toFixed(2)}` : '-'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {item.image_url ? (
                          <CImage
                            src={`${BASE_URL}${item.image_url}`}
                            alt={item.name}
                            thumbnail
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        ) : (
                          <CIcon icon={cilImage} size="xl" className="text-muted" />
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={item.is_veg ? 'success' : 'danger'}>
                          {item.is_veg ? 'Veg' : 'Non-Veg'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={item.is_available ? 'success' : 'secondary'}>
                          {item.is_available ? 'Available' : 'Unavailable'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="info"
                          size="sm"
                          onClick={() => openViewModal(item)}
                          className="me-2"
                        >
                          <CIcon icon={cilInfo} />
                        </CButton>
                        <CButton
                          color="warning"
                          size="sm"
                          onClick={() => {
                            setSelectedMenuItem(item);
                            setFormData({
                              name: item.name,
                              description: item.description,
                              category_name: item.category_name,
                              price: item.price.toString(),
                              parcel_price: item.parcel_price !== null ? item.parcel_price.toString() : '',
                              image: null,
                              is_available: item.is_available,
                              is_veg: item.is_veg,
                            });
                            setEditModalVisible(true);
                          }}
                          className="me-2"
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => handleDeleteMenuItem(item.id)}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={9} className="text-center">
                      No menu items found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        )}

        {/* Add Menu Item Modal */}
        <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
          <CModalHeader closeButton>
            <CModalTitle>Add New Menu Item</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={handleAddMenuItem}>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormInput
                      type="text"
                      name="name"
                      label="Name"
                      placeholder="Enter item name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <CFormInput
                      as="textarea"
                      name="description"
                      label="Description"
                      placeholder="Enter description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                    />
                  </div>
                  <div className="mb-3">
                    <CFormSelect
                      name="category_name"
                      label="Category"
                      value={formData.category_name}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormInput
                      type="number"
                      name="price"
                      label="Price (₹)"
                      placeholder="Enter price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="mb-3">
                    <CFormInput
                      type="number"
                      name="parcel_price"
                      label="Parcel Price (₹) - Optional"
                      placeholder="Enter parcel price"
                      value={formData.parcel_price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="mb-3">
                    <CFormInput
                      type="file"
                      accept="image/*"
                      label="Item Image"
                      onChange={handleImageUpload}
                      required
                    />
                    {formData.image && (
                      <div className="mt-2">
                        <CImage
                          src={URL.createObjectURL(formData.image)}
                          alt="Preview"
                          thumbnail
                          style={{ maxWidth: '150px', maxHeight: '150px' }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <CFormCheck
                      label="Vegetarian"
                      name="is_veg"
                      checked={formData.is_veg}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                  <div className="mb-3">
                    <CFormCheck
                      label="Available"
                      name="is_available"
                      checked={formData.is_available}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                </CCol>
              </CRow>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setModalVisible(false)}>
                  Cancel
                </CButton>
                <CButton color="primary" type="submit">
                  Add Item
                </CButton>
              </CModalFooter>
            </CForm>
          </CModalBody>
        </CModal>

        {/* Edit Menu Item Modal */}
        <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} size="lg">
          <CModalHeader closeButton>
            <CModalTitle>Edit Menu Item</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={handleEditMenuItem}>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormInput
                      type="text"
                      name="name"
                      label="Name"
                      placeholder="Enter item name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <CFormInput
                      as="textarea"
                      name="description"
                      label="Description"
                      placeholder="Enter description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                    />
                  </div>
                  <div className="mb-3">
                    <CFormSelect
                      name="category_name"
                      label="Category"
                      value={formData.category_name}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormInput
                      type="number"
                      name="price"
                      label="Price (₹)"
                      placeholder="Enter price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="mb-3">
                    <CFormInput
                      type="number"
                      name="parcel_price"
                      label="Parcel Price (₹) - Optional"
                      placeholder="Enter parcel price"
                      value={formData.parcel_price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="mb-3">
                    <CFormInput
                      type="file"
                      accept="image/*"
                      label="Item Image (leave empty to keep current)"
                      onChange={handleImageUpload}
                    />
                    {selectedMenuItem?.image_url && !formData.image && (
                      <div className="mt-2">
                        <CImage
                          src={`${BASE_URL}${selectedMenuItem.image_url}`}
                          alt="Current"
                          thumbnail
                          style={{ maxWidth: '150px', maxHeight: '150px' }}
                        />
                        <small className="text-muted d-block">Current image</small>
                      </div>
                    )}
                    {formData.image && (
                      <div className="mt-2">
                        <CImage
                          src={URL.createObjectURL(formData.image)}
                          alt="New"
                          thumbnail
                          style={{ maxWidth: '150px', maxHeight: '150px' }}
                        />
                        <small className="text-muted d-block">New image</small>
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <CFormCheck
                      label="Vegetarian"
                      name="is_veg"
                      checked={formData.is_veg}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                  <div className="mb-3">
                    <CFormCheck
                      label="Available"
                      name="is_available"
                      checked={formData.is_available}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                </CCol>
              </CRow>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
                  Cancel
                </CButton>
                <CButton color="primary" type="submit">
                  Update Item
                </CButton>
              </CModalFooter>
            </CForm>
          </CModalBody>
        </CModal>

        {/* View Menu Item Modal */}
        <CModal visible={viewModalVisible} onClose={() => setViewModalVisible(false)} size="lg">
          <CModalHeader closeButton>
            <CModalTitle>Menu Item Details</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {selectedMenuItem && (
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <h5>{selectedMenuItem.name}</h5>
                    <p className="text-muted">{selectedMenuItem.description}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Category:</strong> {selectedMenuItem.category_name}
                  </div>
                  <div className="mb-3">
                    <strong>Dine-in Price:</strong> ₹{selectedMenuItem.price.toFixed(2)}
                  </div>
                  <div className="mb-3">
                    <strong>Parcel Price:</strong> {selectedMenuItem.parcel_price ? `₹${selectedMenuItem.parcel_price.toFixed(2)}` : 'Not specified'}
                  </div>
                  <div className="mb-3">
                    <strong>Type:</strong> 
                    <CBadge color={selectedMenuItem.is_veg ? 'success' : 'danger'} className="ms-2">
                      {selectedMenuItem.is_veg ? 'Vegetarian' : 'Non-Vegetarian'}
                    </CBadge>
                  </div>
                  <div className="mb-3">
                    <strong>Status:</strong> 
                    <CBadge color={selectedMenuItem.is_available ? 'success' : 'secondary'} className="ms-2">
                      {selectedMenuItem.is_available ? 'Available' : 'Unavailable'}
                    </CBadge>
                  </div>
                  <div className="mb-3">
                    <strong>Created At:</strong> {new Date(selectedMenuItem.created_at).toLocaleString()}
                  </div>
                  <div className="mb-3">
                    <strong>Last Updated:</strong> {new Date(selectedMenuItem.updated_at).toLocaleString()}
                  </div>
                </CCol>
                <CCol md={6} className="text-center">
                  {selectedMenuItem.image_url ? (
                    <CImage
                      src={`${BASE_URL}${selectedMenuItem.image_url}`}
                      alt={selectedMenuItem.name}
                      fluid
                      style={{ maxHeight: '300px', objectFit: 'contain' }}
                    />
                  ) : (
                    <div className="text-muted p-5 border rounded">
                      <CIcon icon={cilImage} size="xxl" />
                      <p>No image available</p>
                    </div>
                  )}
                </CCol>
              </CRow>
            )}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setViewModalVisible(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      </CCardBody>
    </CCard>
  );
};

export default MenuManagement;