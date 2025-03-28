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
  CFormLabel,
  CImage,
  CBadge,
} from '@coreui/react-pro';

const GalleryCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    image: null
  });
   const BASE_URL = "http://127.0.0.1:8000"
  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/gallery_cat/categories');
      setCategories(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to fetch categories. Please try again later.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      image: null
    });
    setImagePreview(null);
    setCurrentImage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle adding a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await axios.post('http://127.0.0.1:8000/gallery_cat/categories/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      fetchCategories();
      setModalVisible(false);
      resetForm();
    } catch (err) {
      console.error('Failed to add category:', err);
      setError('Failed to add category. Please try again.');
    }
  };

  // Handle editing a category
  const handleEditCategory = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await axios.put(
        `http://127.0.0.1:8000/gallery_cat/categories/${selectedCategory.id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      fetchCategories();
      setEditModalVisible(false);
      setSelectedCategory(null);
      resetForm();
    } catch (err) {
      console.error('Failed to update category:', err);
      setError('Failed to update category. Please try again.');
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/gallery_cat/categories/${id}`);
        fetchCategories();
      } catch (err) {
        console.error('Failed to delete category:', err);
        setError('Failed to delete category. Please try again.');
      }
    }
  };

  // Open edit modal with category data
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      image: null
    });
    setCurrentImage(category.image_url);
    setEditModalVisible(true);
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gallery Categories</h2>
        <CButton color="primary" onClick={() => setModalVisible(true)}>
          Add New Category
        </CButton>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Add Category Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle>Add New Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleAddCategory}>
            <div className="mb-3">
              <CFormLabel>Category Name</CFormLabel>
              <CFormInput
                type="text"
                name="name"
                placeholder="Enter category name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Category Image</CFormLabel>
              <CFormInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-3">
                  <CImage thumbnail src={imagePreview} width={200} />
                </div>
              )}
            </div>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setModalVisible(false)}>
                Cancel
              </CButton>
              <CButton type="submit" color="primary">
                Save Category
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>

      {/* Edit Category Modal */}
      {selectedCategory && (
        <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
          <CModalHeader onClose={() => setEditModalVisible(false)}>
            <CModalTitle>Edit Category</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={handleEditCategory}>
              <div className="mb-3">
                <CFormLabel>Category Name</CFormLabel>
                <CFormInput
                  type="text"
                  name="name"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Current Image</CFormLabel>
                {currentImage && (
                  <div className="mb-2">
                    <CImage thumbnail src={currentImage} width={200} />
                    
                  </div>
                )}
                <CFormLabel>Upload New Image</CFormLabel>
                <CFormInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-3">
                    <CImage thumbnail src={imagePreview} width={200} />
                  </div>
                )}
              </div>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
                  Cancel
                </CButton>
                <CButton type="submit" color="primary">
                  Update Category
                </CButton>
              </CModalFooter>
            </CForm>
          </CModalBody>
        </CModal>
      )}

      {/* Categories Table */}
      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Image</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Created At</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {categories.map((category) => (
            <CTableRow key={category.id}>
              <CTableDataCell>
              
                {category.image_url ? (
                  <CImage thumbnail src={`${BASE_URL}${category.image_url}`} width={100} />
                ) : (
                  <CBadge color="secondary">No Image</CBadge>
                )}
              </CTableDataCell>
              <CTableDataCell>{category.name}</CTableDataCell>
              <CTableDataCell>
                {new Date(category.created_at).toLocaleDateString()}
              </CTableDataCell>
              <CTableDataCell>
                <div className="d-flex gap-2">
                  <CButton color="warning" onClick={() => openEditModal(category)}>
                    Edit
                  </CButton>
                  <CButton color="danger" onClick={() => handleDeleteCategory(category.id)}>
                    Delete
                  </CButton>
                </div>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default GalleryCategoriesPage;