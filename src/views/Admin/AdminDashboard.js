import React, { useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CCardSubtitle,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAvatar,
  CProgress,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilPeople, cilUser, cilCart, cilArrowTop, cilArrowBottom } from '@coreui/icons';

import avatar1 from 'src/assets/images/avatars/1.jpg';
import avatar2 from 'src/assets/images/avatars/2.jpg';
import avatar3 from 'src/assets/images/avatars/3.jpg';
import avatar4 from 'src/assets/images/avatars/4.jpg';
import avatar5 from 'src/assets/images/avatars/5.jpg';
import avatar6 from 'src/assets/images/avatars/6.jpg';

const AdminDashboard = () => {
  const [visible, setVisible] = useState(false);
  const [newUser, setNewUser] = useState({
    image: '',
    name: '',
    place: '',
    stars: '',
    date: '',
  });

  const [users, setUsers] = useState([
    { avatar: avatar1, name: 'John Doe', place: 'New York', stars: 5, date: '2024-03-10' },
    { avatar: avatar2, name: 'Jane Smith', place: 'Los Angeles', stars: 4, date: '2024-03-09' },
    { avatar: avatar3, name: 'Michael Johnson', place: 'Chicago', stars: 3, date: '2024-03-08' },
    { avatar: avatar4, name: 'Emily Davis', place: 'Houston', stars: 2, date: '2024-03-07' },
    { avatar: avatar5, name: 'William Brown', place: 'Phoenix', stars: 1, date: '2024-03-06' },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = () => {
    setUsers([...users, newUser]);
    setVisible(false);
  };

  return (
    <>
      <CRow>
        <CCol xs={12} md={4}>
          <CCard className="mb-4">
            <CCardBody>
              <CCardTitle className="fs-4 fw-semibold">Total Users</CCardTitle>
              <div className="fs-2 fw-bold">{users.length}</div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mb-4">
        <CCol xs={12}>
          <CButton color="primary" onClick={() => setVisible(true)}>
            Add Users
          </CButton>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardBody>
              <CCardTitle className="fs-4 fw-semibold">Users</CCardTitle>
              <CTable align="middle" className="mb-0" hover responsive>
                <CTableHead className="fw-semibold text-body-secondary">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell>User</CTableHeaderCell>
                    <CTableHeaderCell>Place</CTableHeaderCell>
                    <CTableHeaderCell>Stars</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.map((user, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={user.avatar} />
                      </CTableDataCell>
                      <CTableDataCell>{user.name}</CTableDataCell>
                      <CTableDataCell>{user.place}</CTableDataCell>
                      <CTableDataCell>{user.stars}</CTableDataCell>
                      <CTableDataCell>{user.date}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add New User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              name="name"
              label="User Name"
              placeholder="Enter user name"
              value={newUser.name}
              onChange={handleInputChange}
            />
            <CFormInput
              type="text"
              name="place"
              label="Place"
              placeholder="Enter place"
              value={newUser.place}
              onChange={handleInputChange}
            />
            <CFormSelect
              name="stars"
              label="Stars"
              value={newUser.stars}
              onChange={handleInputChange}
            >
              <option value="">Select stars</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </CFormSelect>
            <CFormInput
              type="date"
              name="date"
              label="Date"
              value={newUser.date}
              onChange={handleInputChange}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSubmit}>
            Save changes
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default AdminDashboard;
