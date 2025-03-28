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
} from '@coreui/react-pro';
import CIcon from "@coreui/icons-react";
import { cilCheckCircle, cilTrash } from "@coreui/icons";

const VisitorTestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/visitor/testimonials');
      setTestimonials(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
      setError('Failed to fetch testimonials. Please try again later.');
    }
  };

  const handleApprove = async (id, email) => {
    try {
      await axios.post(`http://localhost:5001/api/admin/testimonials/${id}/approve`);
      await axios.post('http://localhost:5001/api/send-email', { 
        email, 
        subject: 'Testimonial Approved', 
        message: 'Your testimonial has been approved and published!'
      });
      fetchTestimonials();
    } catch (err) {
      console.error('Failed to approve testimonial:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/visitor/testimonials/${id}`);
      fetchTestimonials();
    } catch (err) {
      console.error('Failed to delete testimonial:', err);
    }
  };

  return (
    <div>
      <h2>Visitor Testimonials</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <CTable hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Image</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell>Description</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {testimonials.map((testimonial) => (
            <CTableRow key={testimonial.id}>
              <CTableDataCell>
                <img src={testimonial.image} alt={testimonial.name} style={{ width: '50px' }} />
              </CTableDataCell>
              <CTableDataCell>{testimonial.name}</CTableDataCell>
              <CTableDataCell>{testimonial.email}</CTableDataCell>
              <CTableDataCell>{testimonial.description}</CTableDataCell>
              <CTableDataCell>
                <CButton color="success" size="sm" className="me-2" onClick={() => handleApprove(testimonial.id, testimonial.email)}>
                  <CIcon icon={cilCheckCircle} /> Approve
                </CButton>
                <CButton color="danger" size="sm" onClick={() => handleDelete(testimonial.id)}>
                  <CIcon icon={cilTrash} /> Delete
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default VisitorTestimonialsPage;
