import React, { useState, useEffect, useCallback } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CCol,
  CFormCheck,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CAlert,
  CTooltip,
  CBadge,
  CContainer,
  CImage,
  CInputGroup,
  CInputGroupText,
  CFormTextarea,
  CNav,
  CNavItem,
  CNavLink,
  CListGroup,
  CListGroupItem,
} from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import {
  cilPencil,
  cilTrash,
  cilPlus,
  cilSave,
  cilX,
  cilInfo,
  cilSearch,
  cilMap,
  cilPhone,
  cilEnvelopeOpen,
  cilCalendar,
  cilUser,
  cilClock,
  cilCheckCircle,
  cilLocationPin,
  cilBuilding,
  cilChart,
} from "@coreui/icons";

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const BASE_URL = "http://127.0.0.1:8000";

  const initialFormState = {
    name: "",
    latitude: "",
    longitude: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    phone_number: "",
    email: "",
    opening_hours: "",
    manager_name: "",
    branch_opening_date: "",
    branch_status: "open",
    seating_capacity: "",
    parking_availability: false,
    wifi_availability: false,
    image: null,
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchBranches = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch(`${BASE_URL}/branches/`);
      if (!response.ok) {
        throw new Error("Failed to fetch branches");
      }
      const data = await response.json();
      setBranches(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorMsg(err.message);
      console.error("Error fetching branches:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Branch name is required";
    if (!formData.latitude) errors.latitude = "Latitude is required";
    if (!formData.longitude) errors.longitude = "Longitude is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.country.trim()) errors.country = "Country is required";
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openModal = (branch = null) => {
    if (branch) {
      setCurrentBranch(branch);
      setFormData({
        ...branch,
        image: null,
      });
    } else {
      setCurrentBranch(null);
      setFormData(initialFormState);
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openViewModal = (branch) => {
    setCurrentBranch(branch);
    setIsViewModalOpen(true);
  };

  const confirmDelete = (branch) => {
    setCurrentBranch(branch);
    setIsDeleteModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const url = currentBranch
      ? `${BASE_URL}/branches/${currentBranch.id}`
      : `${BASE_URL}/branches/`;
    const method = currentBranch ? "PUT" : "POST";

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(
          currentBranch ? "Failed to update branch" : "Failed to create branch"
        );
      }

      setSuccessMsg(
        currentBranch ? "Branch updated successfully!" : "Branch created successfully!"
      );
      fetchBranches();
      setIsModalOpen(false);
    } catch (err) {
      setErrorMsg(err.message);
      console.error("Error saving branch:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch(
        `${BASE_URL}/branches/${currentBranch.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete branch");
      }

      setSuccessMsg("Branch deleted successfully!");
      fetchBranches();
      setIsDeleteModalOpen(false);
    } catch (err) {
      setErrorMsg(err.message);
      console.error("Error deleting branch:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBranches = branches.filter((branch) => {
    const matchesSearch = Object.values(branch).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && branch.branch_status === activeTab;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "open":
        return <CBadge color="success" shape="rounded-pill">Open</CBadge>;
      case "closed":
        return <CBadge color="danger" shape="rounded-pill">Closed</CBadge>;
      case "under_maintenance":
        return <CBadge color="warning" shape="rounded-pill">Under Maintenance</CBadge>;
      default:
        return <CBadge color="secondary" shape="rounded-pill">{status}</CBadge>;
    }
  };

  // Statistics for the summary card
  const totalBranches = branches.length;
  const openBranches = branches.filter(b => b.branch_status === 'open').length;
  const closedBranches = branches.filter(b => b.branch_status === 'closed').length;
  const maintenanceBranches = branches.filter(b => b.branch_status === 'under_maintenance').length;

  return (
    <div className="branches-management-container">
    
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="mb-2 mb-md-0">
              <h2 className="mb-0">
                <CIcon icon={cilLocationPin} className="me-2 text-primary" />
                Branches Management
              </h2>
            </div>
            
               <CCol xs={12} lg={6} className="mt-3 mt-lg-0">
                          <div className="d-flex justify-content-lg-end">
                            <CBadge color="info" className="me-2">
                              Total Branches:  {totalBranches}
                            </CBadge>
                            
                          </div>
                        </CCol>
            <div className="d-flex flex-wrap gap-2">
             
              <CInputGroup className="me-2" style={{ minWidth: '250px' }}>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Search branches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
              
               <CCol xs={12} md={6} className="text-md-end mt-3 mt-md-0">
                            <CButton 
                              color="primary" 
                              onClick={() => openModal()}
                              shape="rounded-pill"
                            >
                              <CIcon icon={cilPlus} className="me-2" />
                              Add New Branch
                            </CButton>
                          </CCol>
                          
                        
            </div>
          </CCardHeader>
          <CCardBody>
            {/* Status Filter Tabs */}
            <CNav variant="tabs" className="mb-4">
              <CNavItem>
                <CNavLink active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
                  All Branches
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 'open'} onClick={() => setActiveTab('open')}>
                  Open
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 'closed'} onClick={() => setActiveTab('closed')}>
                  Closed
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 'under_maintenance'} onClick={() => setActiveTab('under_maintenance')}>
                  Maintenance
                </CNavLink>
              </CNavItem>
            </CNav>

            {/* Alerts */}
            {errorMsg && (
              <CAlert color="danger" dismissible onClose={() => setErrorMsg(null)} className="mb-4">
                <strong>Error!</strong> {errorMsg}
              </CAlert>
            )}
            {successMsg && (
              <CAlert color="success" dismissible onClose={() => setSuccessMsg(null)} className="mb-4">
                <strong>Success!</strong> {successMsg}
              </CAlert>
            )}

            {/* Branches Table */}
            {isLoading && !branches.length ? (
              <div className="text-center py-5">
                <CSpinner color="primary" />
                <p className="mt-2">Loading branches...</p>
              </div>
            ) : filteredBranches.length === 0 ? (
              <div className="text-center py-5">
                <CIcon icon={cilMap} size="xl" className="text-muted mb-3" />
                <h4>No branches found</h4>
                <p className="text-muted mb-4">
                  {searchTerm ? 'Try a different search term' : 'Add your first branch to get started'}
                </p>
                <CButton color="primary" onClick={() => openModal()}>
                  <CIcon icon={cilPlus} className="me-2" />
                  Add New Branch
                </CButton>
              </div>
            ) : (
              <div className="table-responsive">
                <CTable striped hover responsive className="align-middle">
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell className="w-25">Branch</CTableHeaderCell>
                      <CTableHeaderCell>Location</CTableHeaderCell>
                      <CTableHeaderCell>Contact</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredBranches.map((branch) => (
                      <CTableRow key={branch.id} className="branch-row">
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            {branch.image_url ? (
                              <CImage
                                src={`${BASE_URL}${branch.image_url}`}
                                alt={branch.name}
                                thumbnail
                                className="me-3 branch-image"
                                width={60}
                                height={60}
                              />
                            ) : (
                              <div className="branch-image-placeholder me-3">
                                <CIcon icon={cilBuilding} size="xl" />
                              </div>
                            )}
                            <div>
                              <strong>{branch.name}</strong>
                              {branch.manager_name && (
                                <div className="small text-muted">
                                  <CIcon icon={cilUser} className="me-1" />
                                  {branch.manager_name}
                                </div>
                              )}
                            </div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>
                            <CIcon icon={cilMap} className="me-2 text-primary" />
                            {branch.city}, {branch.country}
                          </div>
                          <div className="small text-muted text-truncate" style={{ maxWidth: '200px' }}>
                            {branch.address}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          {branch.phone_number && (
                            <div className="d-flex align-items-center mb-1">
                              <CIcon icon={cilPhone} className="me-2 text-info" />
                              <a href={`tel:${branch.phone_number}`}>{branch.phone_number}</a>
                            </div>
                          )}
                          {branch.email && (
                            <div className="d-flex align-items-center">
                              <CIcon icon={cilEnvelopeOpen} className="me-2 text-info" />
                              <a href={`mailto:${branch.email}`}>{branch.email}</a>
                            </div>
                          )}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {getStatusBadge(branch.branch_status)}
                        </CTableDataCell>
                        <CTableDataCell className="text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <CTooltip content="View details">
                              <CButton
                                color="info"
                                variant="ghost"
                                shape="rounded-pill"
                                size="sm"
                                onClick={() => openViewModal(branch)}
                              >
                                <CIcon icon={cilInfo} />
                              </CButton>
                            </CTooltip>
                            <CTooltip content="Edit branch">
                              <CButton
                                color="warning"
                                variant="ghost"
                                shape="rounded-pill"
                                size="sm"
                                onClick={() => openModal(branch)}
                              >
                                <CIcon icon={cilPencil} />
                              </CButton>
                            </CTooltip>
                            <CTooltip content="Delete branch">
                              <CButton
                                color="danger"
                                variant="ghost"
                                shape="rounded-pill"
                                size="sm"
                                onClick={() => confirmDelete(branch)}
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </CTooltip>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            )}
          </CCardBody>
        </CCard>

        {/* Create/Edit Modal */}
        <CModal
          visible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          size="xl"
          backdrop="static"
        >
          <CModalHeader closeButton>
            <CModalTitle>
              {currentBranch ? (
                <>
                  <CIcon icon={cilPencil} className="me-2 text-warning" />
                  Edit Branch: {currentBranch.name}
                </>
              ) : (
                <>
                  <CIcon icon={cilPlus} className="me-2 text-primary" />
                  Add New Branch
                </>
              )}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={handleSubmit} className="row g-3">
              <CCol md={6}>
                <CCard className="mb-4">
                  <CCardHeader>Basic Information</CCardHeader>
                  <CCardBody>
                    <CFormInput
                      name="name"
                      label="Branch Name*"
                      placeholder="Enter branch name"
                      value={formData.name}
                      onChange={handleInputChange}
                      invalid={!!formErrors.name}
                      feedback={formErrors.name}
                      className="mb-3"
                    />
                    
                    <CRow>
                      <CCol md={6}>
                        <CFormInput
                          name="latitude"
                          label="Latitude*"
                          type="number"
                          step="0.000001"
                          placeholder="Enter latitude"
                          value={formData.latitude}
                          onChange={handleInputChange}
                          invalid={!!formErrors.latitude}
                          feedback={formErrors.latitude}
                          className="mb-3"
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          name="longitude"
                          label="Longitude*"
                          type="number"
                          step="0.000001"
                          placeholder="Enter longitude"
                          value={formData.longitude}
                          onChange={handleInputChange}
                          invalid={!!formErrors.longitude}
                          feedback={formErrors.longitude}
                          className="mb-3"
                        />
                      </CCol>
                    </CRow>
                    
                    <CFormTextarea
                      name="address"
                      label="Address*"
                      placeholder="Enter full address"
                      value={formData.address}
                      onChange={handleInputChange}
                      invalid={!!formErrors.address}
                      feedback={formErrors.address}
                      rows={3}
                      className="mb-3"
                    />
                    
                    <CRow>
                      <CCol md={6}>
                        <CFormInput
                          name="city"
                          label="City*"
                          placeholder="Enter city"
                          value={formData.city}
                          onChange={handleInputChange}
                          invalid={!!formErrors.city}
                          feedback={formErrors.city}
                          className="mb-3"
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          name="state"
                          label="State/Province"
                          placeholder="Enter state or province"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="mb-3"
                        />
                      </CCol>
                    </CRow>
                    
                    <CRow>
                      <CCol md={6}>
                        <CFormInput
                          name="country"
                          label="Country*"
                          placeholder="Enter country"
                          value={formData.country}
                          onChange={handleInputChange}
                          invalid={!!formErrors.country}
                          feedback={formErrors.country}
                          className="mb-3"
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          name="zipcode"
                          label="Postal/Zip Code"
                          placeholder="Enter postal code"
                          value={formData.zipcode}
                          onChange={handleInputChange}
                          className="mb-3"
                        />
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>
              
              <CCol md={6}>
                <CCard className="mb-4">
                  <CCardHeader>Contact & Details</CCardHeader>
                  <CCardBody>
                    <CRow>
                      <CCol md={6}>
                        <CFormInput
                          name="phone_number"
                          label="Phone Number"
                          placeholder="Enter phone number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          className="mb-3"
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          name="email"
                          label="Email"
                          type="email"
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={handleInputChange}
                          invalid={!!formErrors.email}
                          feedback={formErrors.email}
                          className="mb-3"
                        />
                      </CCol>
                    </CRow>
                    
                    <CFormTextarea
                      name="opening_hours"
                      label="Opening Hours"
                      placeholder="Enter opening hours (e.g., Mon-Fri: 9AM-9PM)"
                      value={formData.opening_hours}
                      onChange={handleInputChange}
                      rows={3}
                      className="mb-3"
                    />
                    
                    <CFormInput
                      name="manager_name"
                      label="Manager Name"
                      placeholder="Enter manager's name"
                      value={formData.manager_name}
                      onChange={handleInputChange}
                      className="mb-3"
                    />
                    
                    <CRow>
                      <CCol md={6}>
                        <CFormInput
                          name="branch_opening_date"
                          label="Opening Date"
                          type="date"
                          value={formData.branch_opening_date}
                          onChange={handleInputChange}
                          className="mb-3"
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect
                          name="branch_status"
                          label="Branch Status"
                          value={formData.branch_status}
                          onChange={handleInputChange}
                          className="mb-3"
                        >
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                          <option value="under_maintenance">Under Maintenance</option>
                        </CFormSelect>
                      </CCol>
                    </CRow>
                    
                    <CFormInput
                      name="seating_capacity"
                      label="Seating Capacity"
                      type="number"
                      placeholder="Enter seating capacity"
                      value={formData.seating_capacity}
                      onChange={handleInputChange}
                      className="mb-3"
                    />
                    
                    <div className="d-flex gap-4 mb-3">
                      <CFormCheck
                        type="checkbox"
                        name="wifi_availability"
                        label="WiFi Available"
                        checked={formData.wifi_availability}
                        onChange={handleInputChange}
                        id="wifiCheck"
                      />
                      <CFormCheck
                        type="checkbox"
                        name="parking_availability"
                        label="Parking Available"
                        checked={formData.parking_availability}
                        onChange={handleInputChange}
                        id="parkingCheck"
                      />
                    </div>
                    
                    <CFormInput
                      type="file"
                      name="image"
                      label="Branch Image"
                      onChange={handleInputChange}
                      accept="image/*"
                      className="mb-3"
                    />
                    {currentBranch?.image_url && (
                      <div className="mt-2">
                        <small>Current Image:</small>
                        <CImage
                          src={`${BASE_URL}${currentBranch.image_url}`}
                          alt="Current branch"
                          thumbnail
                          width={100}
                          className="d-block mt-1"
                        />
                      </div>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
              
              <CCol xs={12} className="text-end">
                <CButton
                  color="secondary"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  className="me-2"
                >
                  <CIcon icon={cilX} className="me-2" />
                  Cancel
                </CButton>
                <CButton type="submit" color="primary" disabled={isLoading}>
                  {isLoading ? (
                    <CSpinner size="sm" />
                  ) : (
                    <>
                      <CIcon icon={cilSave} className="me-2" />
                      {currentBranch ? "Update Branch" : "Create Branch"}
                    </>
                  )}
                </CButton>
              </CCol>
            </CForm>
          </CModalBody>
        </CModal>

        {/* View Details Modal */}
        <CModal
          visible={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          size="xl"
        >
          <CModalHeader closeButton>
            <CModalTitle>
              <CIcon icon={cilInfo} className="me-2 text-info" />
              Branch Details: {currentBranch?.name}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {currentBranch && (
              <CRow>
                <CCol md={5}>
                  <CCard className="h-100">
                    <CCardBody className="text-center">
                      {currentBranch.image_url ? (
                        <CImage
                          src={`${BASE_URL}${currentBranch.image_url}`}
                          alt={currentBranch.name}
                          fluid
                          thumbnail
                          className="mb-3 img-fluid"
                          style={{ maxHeight: '300px' }}
                        />
                      ) : (
                        <div className="text-center py-5 bg-light mb-3 rounded">
                          <CIcon icon={cilBuilding} size="xxl" className="text-muted" />
                          <p className="mt-2">No Image Available</p>
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <h4>{currentBranch.name}</h4>
                        <div className="d-flex justify-content-center mb-3">
                          {getStatusBadge(currentBranch.branch_status)}
                        </div>
                        
                        <CListGroup flush>
                          {currentBranch.manager_name && (
                            <CListGroupItem>
                              <div className="d-flex align-items-center">
                                <CIcon icon={cilUser} className="me-3 text-primary" />
                                <div>
                                  <small className="text-muted">Manager</small>
                                  <div>{currentBranch.manager_name}</div>
                                </div>
                              </div>
                            </CListGroupItem>
                          )}
                          
                          {currentBranch.branch_opening_date && (
                            <CListGroupItem>
                              <div className="d-flex align-items-center">
                                <CIcon icon={cilCalendar} className="me-3 text-primary" />
                                <div>
                                  <small className="text-muted">Opening Date</small>
                                  <div>{currentBranch.branch_opening_date}</div>
                                </div>
                              </div>
                            </CListGroupItem>
                          )}
                          
                          {currentBranch.opening_hours && (
                            <CListGroupItem>
                              <div className="d-flex align-items-center">
                                <CIcon icon={cilClock} className="me-3 text-primary" />
                                <div>
                                  <small className="text-muted">Opening Hours</small>
                                  <div>{currentBranch.opening_hours}</div>
                                </div>
                              </div>
                            </CListGroupItem>
                          )}
                          
                          <CListGroupItem>
                            <div className="d-flex align-items-center">
                              <CIcon icon={cilCheckCircle} className="me-3 text-primary" />
                              <div>
                                <small className="text-muted">Seating Capacity</small>
                                <div>{currentBranch.seating_capacity || "Not specified"}</div>
                              </div>
                            </div>
                          </CListGroupItem>
                          
                          <CListGroupItem>
                            <div className="d-flex align-items-center">
                              <CIcon icon={cilCheckCircle} className="me-3 text-primary" />
                              <div>
                                <small className="text-muted">Facilities</small>
                                <div>
                                  {currentBranch.parking_availability && (
                                    <CBadge color="success" className="me-1">Parking</CBadge>
                                  )}
                                  {currentBranch.wifi_availability && (
                                    <CBadge color="success" className="me-1">WiFi</CBadge>
                                  )}
                                  {!currentBranch.parking_availability && !currentBranch.wifi_availability && (
                                    <span>No special facilities</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CListGroupItem>
                        </CListGroup>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
                
                <CCol md={7}>
                  <CCard className="h-100">
                    <CCardBody>
                      <h5 className="mb-4">
                        <CIcon icon={cilMap} className="me-2 text-primary" />
                        Location Information
                      </h5>
                      
                      <div className="mb-4">
                        <p>
                          <strong>Address:</strong><br />
                          {currentBranch.address}, {currentBranch.city}, {currentBranch.state} {currentBranch.zipcode}
                        </p>
                        <p>
                          <strong>Country:</strong> {currentBranch.country}
                        </p>
                        <p>
                          <strong>Coordinates:</strong> {currentBranch.latitude}, {currentBranch.longitude}
                        </p>
                      </div>
                      
                      <h5 className="mb-4">
                        <CIcon icon={cilPhone} className="me-2 text-primary" />
                        Contact Information
                      </h5>
                      
                      <div className="mb-4">
                        {currentBranch.phone_number && (
                          <p>
                            <strong>Phone:</strong> <a href={`tel:${currentBranch.phone_number}`}>{currentBranch.phone_number}</a>
                          </p>
                        )}
                        {currentBranch.email && (
                          <p>
                            <strong>Email:</strong> <a href={`mailto:${currentBranch.email}`}>{currentBranch.email}</a>
                          </p>
                        )}
                      </div>
                      
                      <div className="text-center mt-4">
                        <CButton
                          color="warning"
                          onClick={() => {
                            setIsViewModalOpen(false);
                            openModal(currentBranch);
                          }}
                          className="me-2"
                        >
                          <CIcon icon={cilPencil} className="me-2" />
                          Edit Branch
                        </CButton>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            )}
          </CModalBody>
        </CModal>

        {/* Delete Confirmation Modal */}
        <CModal
          visible={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          alignment="center"
        >
          <CModalHeader closeButton>
            <CModalTitle>
              <CIcon icon={cilTrash} className="me-2 text-danger" />
              Confirm Deletion
            </CModalTitle>
          </CModalHeader>
          <CModalBody className="text-center">
            {currentBranch && (
              <>
                <div className="mb-4">
                  <CIcon icon={cilTrash} size="3xl" className="text-danger" />
                </div>
                <h5>Are you sure you want to delete this branch?</h5>
                <p className="text-muted">
                  <strong>{currentBranch.name}</strong> in {currentBranch.city}, {currentBranch.country}
                </p>
                <p className="text-danger">
                  <strong>This action cannot be undone.</strong>
                </p>
              </>
            )}
          </CModalBody>
          <CModalFooter className="justify-content-center">
            <CButton
              color="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isLoading}
              className="me-3"
            >
              <CIcon icon={cilX} className="me-2" />
              Cancel
            </CButton>
            <CButton
              color="danger"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <CSpinner size="sm" />
              ) : (
                <>
                  <CIcon icon={cilTrash} className="me-2" />
                  Delete Branch
                </>
              )}
            </CButton>
          </CModalFooter>
        </CModal>
     
      
      <style>{`
        .branches-management-container {
          background-color: #f8f9fa;
        }
        .summary-card {
          border-top: 3px solid #321fdb;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .branch-image {
          object-fit: cover;
          border-radius: 8px;
        }
        .branch-image-placeholder {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f0f0f0;
          border-radius: 8px;
          color: #6c757d;
        }
        .branch-row:hover {
          background-color: rgba(50, 31, 219, 0.05) !important;
        }
        .modal-header {
          border-bottom: none;
          padding-bottom: 0;
        }
        .modal-footer {
          border-top: none;
          padding-top: 0;
        }
      `}</style>
    </div>
  );
};

export default Branches;