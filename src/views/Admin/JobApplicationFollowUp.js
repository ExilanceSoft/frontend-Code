import React, { useState, useEffect, useMemo } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CCard,
  CCardHeader,
  CCardBody,
  CInputGroup,
  CFormInput,
  CPagination,
  CPaginationItem,
  CSpinner,
  CAlert,
  CTooltip,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CForm,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CProgress,
  CLink
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { 
  cilTrash, 
  cilInfo, 
  cilSearch, 
  cilFilter, 
  cilArrowCircleBottom, 
  cilArrowCircleTop,
  cilFile,
  cilReload,
  cilChevronRight,
  cilChevronBottom,
  cilUser,
  cilList,
  cilDescription
} from '@coreui/icons';

const JobApplicationFollowUp = () => {
  // State management
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedRows, setExpandedRows] = useState({});

  // Status options
  const statusOptions = useMemo(() => [
    'Pending',
    'Under Review',
    'Interview Scheduled',
    'Interviewed',
    'Selected',
    'Rejected',
    'On Hold',
    'Withdrawn',
  ], []);

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  // Filter and sort applications when dependencies change
  useEffect(() => {
    filterAndSortApplications();
  }, [applications, searchTerm, sortConfig, statusFilter]);

  // Format status for display
  const formatStatus = (status) => {
    if (!status) return 'Pending';
    
    const statusMap = {
      'pending': 'Pending',
      'under review': 'Under Review',
      'interview scheduled': 'Interview Scheduled',
      'interviewed': 'Interviewed',
      'selected': 'Selected',
      'rejected': 'Rejected',
      'on hold': 'On Hold',
      'withdrawn': 'Withdrawn'
    };
    
    return statusMap[status.toLowerCase()] || status;
  };

  // Format date for display (without time)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Fetch applications from API
  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/job-applications/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Format statuses and dates for display
      const formattedData = data.map(app => ({
        ...app,
        status: formatStatus(app.status),
        formattedDate: formatDate(app.created_at),
        resume_url: app.resume_url ? app.resume_url.replace('http://127.0.0.1:8000', '') : null
      }));
      
      setApplications(formattedData);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to fetch applications. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort applications
  const filterAndSortApplications = () => {
    let filtered = [...applications];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.full_name.toLowerCase().includes(term) ||
        app.email.toLowerCase().includes(term) ||
        app.job_position_title.toLowerCase().includes(term) ||
        app.phone.includes(term)
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredApplications(filtered);
    setCurrentPage(1);
  };

  // Handle sorting requests
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Update application status
  const updateApplicationStatus = async (id, status) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/job-applications/${id}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status })
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update status');
      }
      
      const updatedApp = await response.json();
      setSuccessMessage(`Status updated successfully to ${status}`);
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchApplications();
      return updatedApp;
    } catch (error) {
      console.error('Error updating application status:', error);
      setError(error.message || 'Failed to update application status. Please try again.');
      throw error;
    }
  };

  // Delete application
  const deleteApplication = async (id) => {
    if (window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/job-applications/${id}`, 
          { method: 'DELETE' }
        );
        
        if (!response.ok) {
          throw new Error('Failed to delete application');
        }
        
        setSuccessMessage('Application deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchApplications();
      } catch (error) {
        console.error('Error deleting application:', error);
        setError('Failed to delete application. Please try again.');
      }
    }
  };

  // Toggle row expansion
  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Open status modal
  const openStatusModal = (application) => {
    setSelectedApplication(application);
    setSelectedStatus(application.status);
    setIsStatusModalOpen(true);
  };

  // Open view modal
  const openViewModal = (application) => {
    setSelectedApplication(application);
    setIsViewModalOpen(true);
  };

  // Close all modals
  const closeModals = () => {
    setIsStatusModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedApplication(null);
  };

  // Handle status change
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  // Submit status change
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApplication || !selectedStatus) return;
    
    try {
      await updateApplicationStatus(selectedApplication.id, selectedStatus);
      closeModals();
    } catch (error) {
      // Error is already handled in updateApplicationStatus
    }
  };

  // Get badge color based on status
  const getBadgeColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Under Review': return 'info';
      case 'Interview Scheduled': return 'primary';
      case 'Interviewed': return 'secondary';
      case 'Selected': return 'success';
      case 'Rejected': return 'danger';
      case 'On Hold': return 'dark';
      case 'Withdrawn': return 'light';
      default: return 'secondary';
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <CCard className="mb-4">
      <CCardHeader className="bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Job Applications</h3>
          <CButton color="primary" onClick={fetchApplications} className="d-flex align-items-center">
            <CIcon icon={cilReload} className="me-2" />
            Refresh
          </CButton>
        </div>
        
        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
          <CInputGroup style={{ minWidth: '250px', flex: '1 1 auto' }}>
            <CFormInput
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search applications"
            />
            <CButton color="secondary" variant="outline">
              <CIcon icon={cilSearch} />
            </CButton>
          </CInputGroup>
          
          <div className="d-flex gap-2">
            <CDropdown>
              <CDropdownToggle color="secondary" variant="outline" className="d-flex align-items-center">
                <CIcon icon={cilFilter} className="me-2" />
                Status: {statusFilter === 'all' ? 'All' : statusFilter}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => setStatusFilter('all')}>All</CDropdownItem>
                {statusOptions.map(status => (
                  <CDropdownItem key={status} onClick={() => setStatusFilter(status)}>
                    {status}
                  </CDropdownItem>
                ))}
              </CDropdownMenu>
            </CDropdown>
          </div>
        </div>
      </CCardHeader>
      
      <CCardBody>
        {/* Status indicators */}
        {error && <CAlert color="danger" dismissible onClose={() => setError(null)}>{error}</CAlert>}
        {successMessage && <CAlert color="success" dismissible onClose={() => setSuccessMessage('')}>{successMessage}</CAlert>}
        
        {isLoading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
            <p className="mt-2">Loading applications...</p>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p className="mb-0">
                Showing <strong>{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredApplications.length)}</strong> of <strong>{filteredApplications.length}</strong> applications
              </p>
              <CProgress
                color="info"
                className="w-50"
                value={(filteredApplications.length / applications.length) * 100}
                animated
              >
                {Math.round((filteredApplications.length / applications.length) * 100)}%
              </CProgress>
            </div>
            
            <div className="table-responsive">
              <CTable striped hover responsive className="mb-0">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: '40px' }}></CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '50px' }}>#</CTableHeaderCell>
                    <CTableHeaderCell 
                      onClick={() => requestSort('full_name')}
                      style={{ cursor: 'pointer', width: '15%' }}
                    >
                      <div className="d-flex align-items-center">
                        Name
                        <CIcon 
                          icon={sortConfig.key === 'full_name' ? 
                            (sortConfig.direction === 'asc' ? cilArrowCircleBottom : cilArrowCircleTop) : 
                            cilArrowCircleBottom} 
                          className="ms-1 opacity-50" 
                        />
                      </div>
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '20%' }}>Email</CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '10%' }}>Phone</CTableHeaderCell>
                    <CTableHeaderCell 
                      onClick={() => requestSort('job_position_title')}
                      style={{ cursor: 'pointer', width: '15%' }}
                    >
                      <div className="d-flex align-items-center">
                        Position
                        <CIcon 
                          icon={sortConfig.key === 'job_position_title' ? 
                            (sortConfig.direction === 'asc' ? cilArrowCircleBottom : cilArrowCircleTop) : 
                            cilArrowCircleBottom} 
                          className="ms-1 opacity-50" 
                        />
                      </div>
                    </CTableHeaderCell>
                    <CTableHeaderCell 
                      onClick={() => requestSort('status')}
                      style={{ cursor: 'pointer', width: '12%' }}
                    >
                      <div className="d-flex align-items-center">
                        Status
                        <CIcon 
                          icon={sortConfig.key === 'status' ? 
                            (sortConfig.direction === 'asc' ? cilArrowCircleBottom : cilArrowCircleTop) : 
                            cilArrowCircleBottom} 
                          className="ms-1 opacity-50" 
                        />
                      </div>
                    </CTableHeaderCell>
                    <CTableHeaderCell 
                      onClick={() => requestSort('created_at')}
                      style={{ cursor: 'pointer', width: '10%' }}
                    >
                      <div className="d-flex align-items-center">
                        Applied
                        <CIcon 
                          icon={sortConfig.key === 'created_at' ? 
                            (sortConfig.direction === 'asc' ? cilArrowCircleBottom : cilArrowCircleTop) : 
                            cilArrowCircleBottom} 
                          className="ms-1 opacity-50" 
                        />
                      </div>
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '13%' }}>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((app, index) => (
                      <React.Fragment key={app.id}>
                        <CTableRow>
                          <CTableDataCell>
                            <CButton 
                              color="link" 
                              size="sm" 
                              onClick={() => toggleRowExpansion(app.id)}
                              aria-label={expandedRows[app.id] ? 'Collapse details' : 'Expand details'}
                            >
                              <CIcon icon={expandedRows[app.id] ? cilChevronBottom : cilChevronRight} />
                            </CButton>
                          </CTableDataCell>
                          <CTableDataCell>{indexOfFirstItem + index + 1}</CTableDataCell>
                          <CTableDataCell className="text-truncate" style={{ maxWidth: '150px' }}>{app.full_name}</CTableDataCell>
                          <CTableDataCell className="text-truncate" style={{ maxWidth: '200px' }}>
                            <CLink href={`mailto:${app.email}`}>{app.email}</CLink>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CLink href={`tel:${app.phone}`}>{app.phone}</CLink>
                          </CTableDataCell>
                          <CTableDataCell className="text-truncate" style={{ maxWidth: '150px' }}>{app.job_position_title}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getBadgeColor(app.status)}>{app.status}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            {app.formattedDate}
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex gap-1">
                              <CTooltip content="View details">
                                <CButton
                                  color="info"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openViewModal(app)}
                                >
                                  <CIcon icon={cilUser} />
                                </CButton>
                              </CTooltip>
                              <CTooltip content="Change status">
                                <CButton
                                  color="warning"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openStatusModal(app)}
                                >
                                  <CIcon icon={cilList} />
                                </CButton>
                              </CTooltip>
                              <CTooltip content="Delete">
                                <CButton
                                  color="danger"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteApplication(app.id)}
                                >
                                  <CIcon icon={cilTrash} />
                                </CButton>
                              </CTooltip>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                        {expandedRows[app.id] && (
                          <CTableRow className="bg-light">
                            <CTableDataCell colSpan="9" className="p-0">
                              <div className="p-3">
                                <CAccordion alwaysOpen>
                                  <CAccordionItem>
                                    <CAccordionHeader>Application Details</CAccordionHeader>
                                    <CAccordionBody>
                                      <div className="row">
                                        <div className="col-md-6">
                                          <p><strong>Address:</strong> {app.address || 'Not provided'}</p>
                                          <p><strong>Experience:</strong> {app.experience || 'Not provided'}</p>
                                        </div>
                                        <div className="col-md-6">
                                          <p><strong>Skills:</strong> {app.skills || 'Not provided'}</p>
                                          {app.resume_url && (
                                            <p>
                                              <strong>Resume:</strong> 
                                              <CButton 
                                                color="link" 
                                                href={`http://127.0.0.1:8000${app.resume_url}`} 
                                                target="_blank"
                                                className="p-0 ms-2"
                                              >
                                                <CIcon icon={cilFile} className="me-1" />
                                                View Resume
                                              </CButton>
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="mt-3">
                                        <h6>Cover Letter:</h6>
                                        <div className="border p-3 bg-white rounded">
                                          {app.cover_letter || 'No cover letter provided'}
                                        </div>
                                      </div>
                                    </CAccordionBody>
                                  </CAccordionItem>
                                </CAccordion>
                              </div>
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="9" className="text-center py-5">
                        <div className="text-muted">
                          <CIcon icon={cilSearch} size="xl" className="mb-2" />
                          <h5>No applications found</h5>
                          <p>Try adjusting your search or filter criteria</p>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </div>

            {totalPages > 1 && (
              <CPagination align="center" className="mt-4">
                <CPaginationItem 
                  disabled={currentPage === 1} 
                  onClick={() => paginate(currentPage - 1)}
                  aria-label="Previous page"
                >
                  Previous
                </CPaginationItem>
                {[...Array(totalPages).keys()].map(number => (
                  <CPaginationItem
                    key={number + 1}
                    active={number + 1 === currentPage}
                    onClick={() => paginate(number + 1)}
                    aria-label={`Page ${number + 1}`}
                  >
                    {number + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem 
                  disabled={currentPage === totalPages} 
                  onClick={() => paginate(currentPage + 1)}
                  aria-label="Next page"
                >
                  Next
                </CPaginationItem>
              </CPagination>
            )}
          </>
        )}
      </CCardBody>

      {/* Status Update Modal */}
      <CModal visible={isStatusModalOpen} onClose={closeModals} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Update Application Status</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleStatusSubmit}>
          <CModalBody>
            {selectedApplication && (
              <>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p><strong>Candidate:</strong> {selectedApplication.full_name}</p>
                    <p><strong>Position:</strong> {selectedApplication.job_position_title}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Current Status:</strong> <CBadge color={getBadgeColor(selectedApplication.status)}>{selectedApplication.status}</CBadge></p>
                    <p><strong>Applied On:</strong> {selectedApplication.formattedDate}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="statusSelect" className="form-label fw-bold">New Status:</label>
                  <CFormSelect
                    id="statusSelect"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    required
                    aria-label="Select status"
                  >
                    <option value="">Select a status...</option>
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </CFormSelect>
                </div>
              </>
            )}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={closeModals}>Cancel</CButton>
            <CButton 
              color="primary" 
              type="submit"
              disabled={!selectedStatus || selectedStatus === selectedApplication?.status}
            >
              Update Status
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      {/* View Application Modal */}
      <CModal visible={isViewModalOpen} onClose={closeModals} size="xl">
        <CModalHeader closeButton>
          <CModalTitle>Application Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedApplication && (
            <div className="row">
              <div className="col-md-6">
                <h5 className="mb-3">Personal Information</h5>
                <div className="mb-3">
                  <p><strong>Full Name:</strong> {selectedApplication.full_name}</p>
                  <p><strong>Email:</strong> <CLink href={`mailto:${selectedApplication.email}`}>{selectedApplication.email}</CLink></p>
                  <p><strong>Phone:</strong> <CLink href={`tel:${selectedApplication.phone}`}>{selectedApplication.phone}</CLink></p>
                  <p><strong>Address:</strong> {selectedApplication.address || 'Not provided'}</p>
                </div>
                
                <h5 className="mb-3">Position Information</h5>
                <div className="mb-3">
                  <p><strong>Job Title:</strong> {selectedApplication.job_position_title}</p>
                  <p><strong>Status:</strong> <CBadge color={getBadgeColor(selectedApplication.status)}>{selectedApplication.status}</CBadge></p>
                  <p><strong>Applied On:</strong> {selectedApplication.formattedDate}</p>
                </div>
              </div>
              
              <div className="col-md-6">
                <h5 className="mb-3">Qualifications</h5>
                <div className="mb-3">
                  <p><strong>Experience:</strong></p>
                  <div className="border p-3 bg-light rounded">
                    {selectedApplication.experience || 'No experience provided'}
                  </div>
                </div>
                
                <p><strong>Skills:</strong></p>
                <div className="mb-3">
                  {selectedApplication.skills ? (
                    <div className="d-flex flex-wrap gap-2">
                      {selectedApplication.skills.split(',').map((skill, i) => (
                        <CBadge color="info" key={i} className="text-dark">
                          {skill.trim()}
                        </CBadge>
                      ))}
                    </div>
                  ) : 'No skills provided'}
                </div>
                
                {selectedApplication.resume_url && (
                  <div className="mb-3">
                    <p><strong>Resume:</strong></p>
                    <CButton 
                      color="primary" 
                      href={`http://127.0.0.1:8000${selectedApplication.resume_url}`} 
                      target="_blank"
                      className="d-inline-flex align-items-center"
                    >
                      <CIcon icon={cilDescription} className="me-2" />
                      View Resume
                    </CButton>
                  </div>
                )}
              </div>
              
              <div className="col-12 mt-3">
                <h5 className="mb-3">Cover Letter</h5>
                <div className="border p-3 bg-light rounded">
                  {selectedApplication.cover_letter || 'No cover letter provided'}
                </div>
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModals}>Close</CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default JobApplicationFollowUp;