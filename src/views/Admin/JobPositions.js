import React, { useState, useEffect } from "react";
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
  CSpinner,
  CAlert,
  CToaster,
  CToast,
  CToastBody,
  CToastClose,
  CImage,
  CCard,
  CCardBody,
  CCardHeader,
  CCollapse,
  CBadge,
  CTooltip
} from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import { 
  cilPencil, 
  cilTrash, 
  cilPlus, 
  cilSave, 
  cilX, 
  cilInfo,
  cilChevronTop,
  cilChevronBottom,
  cilCheckCircle,
  cilWarning 
} from "@coreui/icons";

const JobPositions = () => {
  const [jobPositions, setJobPositions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState({
    id: "",
    title: "",
    description: "",
    min_salary: "",
    max_salary: "",
    branch_name: "",
    job_type: "full_time",
    status: "active",
    image: null,
    image_url: ""
  });
  const [viewJob, setViewJob] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    color: "success"
  });
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterJobType, setFilterJobType] = useState("all");

  useEffect(() => {
    fetchJobPositions();
    fetchBranches();
  }, []);

  const showToast = (message, color = "success") => {
    setToast({ visible: true, message, color });
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
  };

  const fetchJobPositions = async () => {
    setIsTableLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/job-positions/");
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const data = await response.json();
      setJobPositions(data);
    } catch (error) {
      showToast(error.message, "danger");
      console.error("Error:", error);
    } finally {
      setIsTableLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/branches/");
      if (!response.ok) throw new Error("Failed to fetch branches");
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      showToast(error.message, "danger");
      console.error("Error:", error);
    }
  };

  const openModal = (job = null) => {
    setCurrentJob(
      job || {
        title: "",
        description: "",
        min_salary: "",
        max_salary: "",
        branch_name: "",
        job_type: "full_time",
        status: "active",
        image: null,
        image_url: ""
      }
    );
    setIsEditMode(!!job);
    setIsModalOpen(true);
  };

  const openViewModal = (job) => {
    setViewJob(job);
    setIsViewModalOpen(true);
  };

  const toggleDescription = (jobId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setCurrentJob(prev => ({ 
        ...prev, 
        [name]: files[0],
        image_url: "" // Clear image_url when new file is selected
      }));
    } else {
      setCurrentJob(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const job = jobPositions.find(j => j.id === jobId);
      if (!job) throw new Error("Job not found");

      const response = await fetch(`http://127.0.0.1:8000/job-positions/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: job.title,
          description: job.description,
          min_salary: job.min_salary,
          max_salary: job.max_salary,
          branch_name: job.branch_name,
          job_type: job.job_type,
          status: newStatus,
          image_url: job.image_url || ""
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update status");
      }

      showToast("Status updated successfully");
      fetchJobPositions();
    } catch (error) {
      showToast(error.message, "danger");
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const url = isEditMode
      ? `http://127.0.0.1:8000/job-positions/${currentJob.id}`
      : "http://127.0.0.1:8000/job-positions/";
    const method = isEditMode ? "PUT" : "POST";

    const formData = new FormData();
    formData.append("title", currentJob.title);
    formData.append("description", currentJob.description);
    formData.append("min_salary", currentJob.min_salary);
    formData.append("max_salary", currentJob.max_salary);
    formData.append("branch_name", currentJob.branch_name);
    formData.append("job_type", currentJob.job_type);
    formData.append("status", currentJob.status);

    // Handle image upload
    if (currentJob.image) {
      formData.append("image", currentJob.image);
    } else if (isEditMode && currentJob.image_url) {
      // Keep existing image if no new image is selected
      formData.append("image_url", currentJob.image_url);
    }

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to save job");
      }

      showToast(isEditMode ? "Job updated successfully" : "Job created successfully");
      fetchJobPositions();
      setIsModalOpen(false);
    } catch (error) {
      showToast(error.message, "danger");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job position?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/job-positions/${jobId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete job");
      }

      showToast("Job deleted successfully");
      fetchJobPositions();
    } catch (error) {
      showToast(error.message, "danger");
      console.error("Error:", error);
    }
  };

  const filteredJobs = jobPositions.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.branch_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || job.status === filterStatus;
    const matchesJobType = filterJobType === "all" || job.job_type === filterJobType;
    
    return matchesSearch && matchesStatus && matchesJobType;
  });

  const formatSalary = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="job-positions-container">
      <CCard>
        <CCardHeader>
          <h2 className="mb-0">Job Positions Management</h2>
          <p className="text-muted mb-0">Manage all job positions in your organization</p>
        </CCardHeader>
        <CCardBody>
          <CToaster placement="top-end">
            <CToast visible={toast.visible} color={toast.color} className="text-white">
              <CToastBody>
                <div className="d-flex align-items-center">
                  {toast.color === "success" ? (
                    <CIcon icon={cilCheckCircle} className="me-2" />
                  ) : (
                    <CIcon icon={cilWarning} className="me-2" />
                  )}
                  {toast.message}
                </div>
              </CToastBody>
              <CToastClose className="me-2 m-auto" />
            </CToast>
          </CToaster>

          <CRow className="mb-4">
            <CCol md={4}>
              <CFormInput
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>
            <CCol md={2}>
              <CFormSelect
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </CFormSelect>
            </CCol>
            <CCol md={2}>
              <CFormSelect
                value={filterJobType}
                onChange={(e) => setFilterJobType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
              </CFormSelect>
            </CCol>
            <CCol md={4} className="text-end">
              <CButton color="primary" onClick={() => openModal()} className="mb-3">
                <CIcon icon={cilPlus} className="me-2" />
                Add New Position
              </CButton>
            </CCol>
          </CRow>

          {isTableLoading ? (
            <div className="text-center py-5">
              <CSpinner />
              <p className="mt-2">Loading job positions...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <CAlert color="info" className="text-center">
              No job positions found matching your criteria.
            </CAlert>
          ) : (
            <div className="table-responsive">
              <CTable striped hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Title</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell>Salary Range</CTableHeaderCell>
                    <CTableHeaderCell>Branch</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Image</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredJobs.map((job) => (
                    <CTableRow key={job.id}>
                      <CTableDataCell>
                        <strong>{job.title}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div 
                          className="description-preview"
                          onClick={() => toggleDescription(job.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          {expandedDescriptions[job.id] ? (
                            <>
                              {job.description}
                              <CIcon icon={cilChevronTop} className="ms-2" />
                            </>
                          ) : (
                            <>
                              {job.description.length > 50 
                                ? `${job.description.substring(0, 50)}...` 
                                : job.description}
                              {job.description.length > 50 && (
                                <CIcon icon={cilChevronBottom} className="ms-2" />
                              )}
                            </>
                          )}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {formatSalary(job.min_salary)} - {formatSalary(job.max_salary)}
                      </CTableDataCell>
                      <CTableDataCell>{job.branch_name}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={job.job_type === 'full_time' ? 'primary' : 'warning'}>
                          {job.job_type.replace("_", " ")}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={job.status === 'active' ? 'success' : 'secondary'}>
                          {job.status}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {job.image_url && (
                          <CImage
                            src={`http://127.0.0.1:8000${job.image_url}`}
                            alt="Job"
                            thumbnail
                            width={50}
                            height={50}
                          />
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex">
                          <CTooltip content="View Details">
                            <CButton
                              color="info"
                              size="sm"
                              onClick={() => openViewModal(job)}
                              className="me-2"
                            >
                              <CIcon icon={cilInfo} />
                            </CButton>
                          </CTooltip>
                          <CTooltip content="Edit">
                            <CButton
                              color="warning"
                              size="sm"
                              onClick={() => openModal(job)}
                              className="me-2"
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                          </CTooltip>
                          <CTooltip content="Delete">
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => handleDelete(job.id)}
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

      {/* Add/Edit Modal */}
      <CModal 
        visible={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        size="lg"
        backdrop="static"
      >
        <CModalHeader closeButton>
          <CModalTitle>
            {isEditMode ? "Edit Job Position" : "Add New Job Position"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput
                  label="Job Title"
                  name="title"
                  value={currentJob.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter job title (e.g., Sous Chef)"
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  label="Minimum Salary"
                  name="min_salary"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentJob.min_salary}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 40000"
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Maximum Salary"
                  name="max_salary"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentJob.max_salary}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 60000"
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput
                  label="Description"
                  name="description"
                  value={currentJob.description}
                  onChange={handleChange}
                  required
                  placeholder="Enter detailed job description"
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormSelect
                  label="Branch"
                  name="branch_name"
                  value={currentJob.branch_name}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.name}>
                      {branch.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormSelect
                  label="Job Type"
                  name="job_type"
                  value={currentJob.job_type}
                  onChange={handleChange}
                  required
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormSelect
                  label="Status"
                  name="status"
                  value={currentJob.status}
                  onChange={handleChange}
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="file"
                  label="Job Image"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                />
                {isEditMode && currentJob.image_url && !currentJob.image && (
                  <div className="mt-2">
                    <small>Current Image:</small>
                    <CImage
                      src={`http://127.0.0.1:8000${currentJob.image_url}`}
                      alt="Current"
                      thumbnail
                      width={100}
                      className="mt-1 d-block"
                    />
                  </div>
                )}
                {currentJob.image && (
                  <div className="mt-2">
                    <small>New Image Selected:</small>
                    <div className="text-muted">Image will be updated on save</div>
                  </div>
                )}
              </CCol>
            </CRow>

            <CModalFooter>
              <CButton
                color="secondary"
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
              >
                <CIcon icon={cilX} className="me-1" />
                Cancel
              </CButton>
              <CButton type="submit" color="primary" disabled={isLoading}>
                {isLoading ? (
                  <CSpinner size="sm" />
                ) : (
                  <>
                    <CIcon icon={cilSave} className="me-1" />
                    {isEditMode ? "Update" : "Create"}
                  </>
                )}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>

      {/* View Details Modal */}
      <CModal 
        visible={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>Job Position Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {viewJob && (
            <div>
              <CRow className="mb-3">
                <CCol md={6}>
                  <h5>{viewJob.title}</h5>
                  <p className="text-muted">{viewJob.branch_name}</p>
                </CCol>
                <CCol md={6} className="text-end">
                  <CBadge color={viewJob.status === 'active' ? 'success' : 'secondary'}>
                    {viewJob.status}
                  </CBadge>
                  <CBadge color={viewJob.job_type === 'full_time' ? 'primary' : 'warning'} className="ms-2">
                    {viewJob.job_type.replace("_", " ")}
                  </CBadge>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <h6>Salary Range</h6>
                  <p>{formatSalary(viewJob.min_salary)} - {formatSalary(viewJob.max_salary)}</p>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <h6>Description</h6>
                  <p>{viewJob.description}</p>
                </CCol>
              </CRow>

              {viewJob.image_url && (
                <CRow className="mb-3">
                  <CCol md={12}>
                    <h6>Image</h6>
                    <CImage
                      src={`http://127.0.0.1:8000${viewJob.image_url}`}
                      alt="Job"
                      thumbnail
                      className="img-fluid"
                    />
                  </CCol>
                </CRow>
              )}

              <CRow>
                <CCol md={6}>
                  <h6>Created At</h6>
                  <p>{new Date(viewJob.created_at).toLocaleString()}</p>
                </CCol>
                <CCol md={6}>
                  <h6>Last Updated</h6>
                  <p>{new Date(viewJob.updated_at).toLocaleString()}</p>
                </CCol>
              </CRow>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setIsViewModalOpen(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default JobPositions;