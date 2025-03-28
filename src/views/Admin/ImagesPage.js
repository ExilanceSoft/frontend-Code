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
} from '@coreui/react-pro';

const ImagesPage = () => {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState('');

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    image: null, // Use null for file input
    categoryName: '', // Selected category name
    description: '', // Optional description
  });

  // Fetch images and categories
  const fetchImages = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/images/images/');
      setImages(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch images:', err);
      setError('Failed to fetch images. Please try again later.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/gallery_cat/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to fetch categories. Please try again later.');
    }
  };

  useEffect(() => {
    fetchImages();
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      image: null,
      categoryName: '',
      description: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  // Handle adding a new image
  const handleAddImage = async (e) => {
    e.preventDefault();

    // Find the category ID based on the selected category name
    const selectedCategory = categories.find((cat) => cat.name === formData.categoryName);
    if (!selectedCategory) {
      setError('Please select a valid category.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('file', formData.image); // Append the image file
    if (formData.description) {
      formDataToSend.append('description', formData.description); // Optional description
    }

    try {
      await axios.post(
        `http://127.0.0.1:8000/images/images/add?name=${formData.name}&category_id=${selectedCategory.id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      fetchImages(); // Refresh the list
      setModalVisible(false); // Close the modal
      resetForm(); // Reset the form
    } catch (err) {
      console.error('Failed to add image:', err);
      if (err.response) {
        console.error('Server response:', err.response.data);
      }
      setError('Failed to add image. Please try again.');
    }
  };

  // Handle editing an image
  const handleEditImage = async (e) => {
    e.preventDefault();

    // Find the category ID based on the selected category name
    const selectedCategory = categories.find((cat) => cat.name === formData.categoryName);
    if (!selectedCategory) {
      setError('Please select a valid category.');
      return;
    }

    const formDataToSend = new FormData();
    if (formData.image instanceof File) {
      formDataToSend.append('file', formData.image); // Append the image file only if it's a new file
    }
    if (formData.description) {
      formDataToSend.append('description', formData.description); // Optional description
    }

    try {
      await axios.put(
        `http://127.0.0.1:8000/images/images/${selectedImage.id}?name=${formData.name}&category_id=${selectedCategory.id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      fetchImages(); // Refresh the list
      setEditModalVisible(false); // Close the edit modal
      setSelectedImage(null); // Clear the selected image
      resetForm(); // Reset the form
    } catch (err) {
      console.error('Failed to update image:', err);
      if (err.response) {
        console.error('Server response:', err.response.data);
      }
      setError('Failed to update image. Please try again.');
    }
  };

  // Handle deleting an image
  const handleDeleteImage = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/images/images/${id}`);
      fetchImages(); // Refresh the list
    } catch (err) {
      console.error('Failed to delete image:', err);
      setError('Failed to delete image. Please try again.');
    }
  };

  return (
    <div>
      <h2>Images Management</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <CButton color="primary" onClick={() => setModalVisible(true)} className="mb-3">
        Add Image
      </CButton>

      {/* Add Image Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle>Add Image</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleAddImage}>
            <div className="mb-3">
              <CFormInput
                type="text"
                name="name"
                placeholder="Enter image name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <CFormInput
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                required
              />
              {formData.image instanceof File && (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  style={{ width: '100px', marginTop: '10px' }}
                />
              )}
            </div>
            <div className="mb-3">
              <CFormSelect
                name="categoryName"
                value={formData.categoryName}
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
            <div className="mb-3">
              <CFormInput
                type="text"
                name="description"
                placeholder="Enter description (optional)"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <CModalFooter>
              <CButton type="submit" color="primary">
                Add Image
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>

      {/* Edit Image Modal */}
      {selectedImage && (
        <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
          <CModalHeader onClose={() => setEditModalVisible(false)}>
            <CModalTitle>Edit Image</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={handleEditImage}>
              <div className="mb-3">
                <CFormInput
                  type="text"
                  name="name"
                  placeholder="Enter image name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <CFormInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {formData.image instanceof File && (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    style={{ width: '100px', marginTop: '10px' }}
                  />
                )}
              </div>
              <div className="mb-3">
                <CFormSelect
                  name="categoryName"
                  value={formData.categoryName}
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
              <div className="mb-3">
                <CFormInput
                  type="text"
                  name="description"
                  placeholder="Enter description (optional)"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <CModalFooter>
                <CButton type="submit" color="primary">
                  Update
                </CButton>
              </CModalFooter>
            </CForm>
          </CModalBody>
        </CModal>
      )}

      {/* Images Table */}
      <CTable hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Category</CTableHeaderCell>
            <CTableHeaderCell>Image</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {images.map((image) => (
            <CTableRow key={image.id}>
              <CTableDataCell>{image.name}</CTableDataCell>
              <CTableDataCell>
                {categories.find((cat) => String(cat.id) === String(image.category_id))?.name || 'Uncategorized'}
              </CTableDataCell>
              <CTableDataCell>
                <img
                  src={`http://127.0.0.1:8000/${image.file_path}`}
                  alt={image.name}
                  style={{ width: '50px' }}
                />
              </CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="warning"
                  onClick={() => {
                    setSelectedImage(image);
                    setFormData({
                      name: image.name,
                      image: null, // Reset the image file
                      categoryName: categories.find((cat) => String(cat.id) === String(image.category_id))?.name || '',
                      description: image.description || '',
                    });
                    setEditModalVisible(true);
                  }}
                >
                  Edit
                </CButton>
                <CButton
                  color="danger"
                  onClick={() => handleDeleteImage(image.id)}
                  className="ml-2"
                >
                  Delete
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default ImagesPage;