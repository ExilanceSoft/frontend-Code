import React, { useEffect, useState } from "react";
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
  CSpinner,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CCard,
  CCardBody,
  CCardHeader,
  CAlert,
  CFormInput,
  CPagination,
  CPaginationItem,
  CProgress,
  CTooltip,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilFilter, cilInfo, cilTrash, cilCheckCircle, cilXCircle, cilOptions } from '@coreui/icons';
import axios from "axios";
import { format } from 'date-fns';

const FranchiseRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://127.0.0.1:8000/franchise/requests/");
      setRequests(response.data);
    } catch (error) {
      setError("Failed to fetch franchise requests. Please try again later.");
      console.error("Error fetching franchise requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let result = [...requests];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(request => 
        request.user_name.toLowerCase().includes(term) ||
        request.user_email.toLowerCase().includes(term) ||
        request.requested_city.toLowerCase().includes(term) ||
        request.requested_country.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(request => request.request_status === statusFilter);
    }
    
    setFilteredRequests(result);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const updateRequestStatus = async (id, status) => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.put(
        `http://127.0.0.1:8000/franchise/requests/${id}/status/${status}`
      );
      
      setSuccess(`Request status updated to ${status} successfully`);
      fetchRequests();
    } catch (error) {
      setError("Failed to update request status. Please try again.");
      console.error("Error updating request status:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const viewRequestDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const handleDeleteRequest = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://127.0.0.1:8000/franchise/requests/${id}`);
      setSuccess("Request deleted successfully");
      fetchRequests();
      setDeleteConfirm(null);
    } catch (error) {
      setError("Failed to delete request. Please try again.");
      console.error("Error deleting request:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: "warning", text: "Pending" },
      approved: { color: "success", text: "Approved" },
      rejected: { color: "danger", text: "Rejected" }
    };
    return statusMap[status] || { color: "secondary", text: status };
  };

  return (
    <div className="franchise-requests-container">
      <CCard className="mb-4">
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Franchise Requests Management</h2>
            <div className="d-flex">
              <CButton color="primary" onClick={fetchRequests} disabled={loading}>
                {loading ? <CSpinner size="sm" /> : "Refresh"}
              </CButton>
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          {error && <CAlert color="danger" dismissible onClose={() => setError(null)}>{error}</CAlert>}
          {success && <CAlert color="success" dismissible onClose={() => setSuccess(null)}>{success}</CAlert>}
          
          <div className="mb-4">
            <div className="row g-3">
              <div className="col-md-6">
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilSearch} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Search by name, email, city or country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </CInputGroup>
              </div>
              <div className="col-md-3">
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilFilter} />
                  </CInputGroupText>
                  <CFormSelect
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </CFormSelect>
                </CInputGroup>
              </div>
            </div>
          </div>

          {loading && !requests.length ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-2">Loading franchise requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-5">
              <h4>No franchise requests found</h4>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <CProgress
                  color="info"
                  value={(filteredRequests.length / requests.length) * 100}
                  className="mb-2"
                />
                <small className="text-medium-emphasis">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredRequests.length)} of {filteredRequests.length} requests
                  {searchTerm || statusFilter !== "all" ? " (filtered)" : ""}
                </small>
              </div>

              <div className="table-responsive">
                <CTable striped hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Name</CTableHeaderCell>
                      <CTableHeaderCell>Contact</CTableHeaderCell>
                      <CTableHeaderCell>Location</CTableHeaderCell>
                      <CTableHeaderCell>Budget</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Submitted</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {currentItems.map((request) => (
                      <CTableRow key={request.id}>
                        <CTableDataCell>
                          <strong>{request.user_name}</strong>
                          <div className="small text-medium-emphasis">
                            {request.user_email}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          {request.user_phone}
                        </CTableDataCell>
                        <CTableDataCell>
                          {request.requested_city}, {request.requested_state || ''} {request.requested_country}
                        </CTableDataCell>
                        <CTableDataCell>
                          ${request.investment_budget.toLocaleString()}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getStatusBadge(request.request_status).color}>
                            {getStatusBadge(request.request_status).text}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          {format(new Date(request.created_at), 'MMM dd, yyyy')}
                        </CTableDataCell>
                        <CTableDataCell className="text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <CTooltip content="View details">
                              <CButton
                                color="info"
                                size="sm"
                                onClick={() => viewRequestDetails(request)}
                              >
                                <CIcon icon={cilInfo} />
                              </CButton>
                            </CTooltip>
                            
                            {request.request_status === "pending" && (
                              <>
                                <CTooltip content="Approve">
                                  <CButton
                                    color="success"
                                    size="sm"
                                    onClick={() => updateRequestStatus(request.id, "approved")}
                                    disabled={loading}
                                  >
                                    <CIcon icon={cilCheckCircle} />
                                  </CButton>
                                </CTooltip>
                                <CTooltip content="Reject">
                                  <CButton
                                    color="danger"
                                    size="sm"
                                    onClick={() => updateRequestStatus(request.id, "rejected")}
                                    disabled={loading}
                                  >
                                    <CIcon icon={cilXCircle} />
                                  </CButton>
                                </CTooltip>
                              </>
                            )}
                            
                            <CTooltip content="Delete">
                              <CButton
                                color="danger"
                                size="sm"
                                onClick={() => setDeleteConfirm(request.id)}
                                disabled={loading}
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </CTooltip>
                          </div>
                          
                          {deleteConfirm === request.id && (
                            <div className="mt-2 p-2 bg-light rounded">
                              <p className="mb-2 small">Are you sure?</p>
                              <div className="d-flex gap-2">
                                <CButton
                                  size="sm"
                                  color="danger"
                                  onClick={() => handleDeleteRequest(request.id)}
                                >
                                  Yes, delete
                                </CButton>
                                <CButton
                                  size="sm"
                                  color="secondary"
                                  onClick={() => setDeleteConfirm(null)}
                                >
                                  Cancel
                                </CButton>
                              </div>
                            </div>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <CPagination>
                    <CPaginationItem
                      disabled={currentPage === 1}
                      onClick={() => paginate(currentPage - 1)}
                    >
                      Previous
                    </CPaginationItem>
                    {[...Array(totalPages).keys()].map((number) => (
                      <CPaginationItem
                        key={number + 1}
                        active={number + 1 === currentPage}
                        onClick={() => paginate(number + 1)}
                      >
                        {number + 1}
                      </CPaginationItem>
                    ))}
                    <CPaginationItem
                      disabled={currentPage === totalPages}
                      onClick={() => paginate(currentPage + 1)}
                    >
                      Next
                    </CPaginationItem>
                  </CPagination>
                </div>
              )}
            </>
          )}
        </CCardBody>
      </CCard>

      {/* Request Details Modal */}
      <CModal size="lg" visible={showModal} onClose={closeModal}>
        <CModalHeader closeButton>
          <CModalTitle>Franchise Request Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedRequest && (
            <div className="row">
              <div className="col-md-6">
                <h5>Personal Information</h5>
                <dl className="row">
                  <dt className="col-sm-4">Name</dt>
                  <dd className="col-sm-8">{selectedRequest.user_name}</dd>
                  
                  <dt className="col-sm-4">Email</dt>
                  <dd className="col-sm-8">{selectedRequest.user_email}</dd>
                  
                  <dt className="col-sm-4">Phone</dt>
                  <dd className="col-sm-8">{selectedRequest.user_phone}</dd>
                </dl>
                
                <h5 className="mt-4">Location Details</h5>
                <dl className="row">
                  <dt className="col-sm-4">City</dt>
                  <dd className="col-sm-8">{selectedRequest.requested_city}</dd>
                  
                  <dt className="col-sm-4">State</dt>
                  <dd className="col-sm-8">{selectedRequest.requested_state || "-"}</dd>
                  
                  <dt className="col-sm-4">Country</dt>
                  <dd className="col-sm-8">{selectedRequest.requested_country}</dd>
                </dl>
              </div>
              
              <div className="col-md-6">
                <h5>Business Information</h5>
                <dl className="row">
                  <dt className="col-sm-4">Investment Budget</dt>
                  <dd className="col-sm-8">${selectedRequest.investment_budget.toLocaleString()}</dd>
                  
                  <dt className="col-sm-4">Experience</dt>
                  <dd className="col-sm-8">{selectedRequest.experience_in_food_business || "None"}</dd>
                  
                  <dt className="col-sm-4">Status</dt>
                  <dd className="col-sm-8">
                    <CBadge color={getStatusBadge(selectedRequest.request_status).color}>
                      {getStatusBadge(selectedRequest.request_status).text}
                    </CBadge>
                  </dd>
                  
                  <dt className="col-sm-4">Submitted</dt>
                  <dd className="col-sm-8">
                    {format(new Date(selectedRequest.created_at), 'MMM dd, yyyy HH:mm')}
                  </dd>
                  
                  <dt className="col-sm-4">Last Updated</dt>
                  <dd className="col-sm-8">
                    {format(new Date(selectedRequest.updated_at), 'MMM dd, yyyy HH:mm')}
                  </dd>
                </dl>
                
                <h5 className="mt-4">Additional Details</h5>
                <div className="bg-light p-3 rounded">
                  {selectedRequest.additional_details || "No additional details provided"}
                </div>
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default FranchiseRequests;