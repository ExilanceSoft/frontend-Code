import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FiSearch, FiX, FiExternalLink, FiCheckCircle, FiUpload, FiClock } from 'react-icons/fi';

// Make sure to set the app element for accessibility
Modal.setAppElement('#root');

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobTitleFilter, setJobTitleFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/job-positions/');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        setJobs(data);
        setFilteredJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on user input
  useEffect(() => {
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(jobTitleFilter.toLowerCase()) &&
        job.job_type.toLowerCase().includes(positionFilter.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [jobTitleFilter, positionFilter, jobs]);

  const openModal = (job) => {
    if (job.status === 'inactive') return;
    setSelectedJob(job);
    setModalIsOpen(true);
    setSubmitSuccess(false);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedJob(null);
    setModalIsOpen(false);
    setResumeFile(null);
    document.body.style.overflow = 'auto';
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('full_name', e.target.full_name.value);
    formData.append('email', e.target.email.value);
    formData.append('phone', e.target.phone.value);
    formData.append('address', e.target.address.value || '');
    formData.append('job_position_id', selectedJob.id);
    formData.append('job_position_title', selectedJob.title);
    formData.append('experience', e.target.experience.value || '');
    formData.append('skills', e.target.skills.value || '');
    formData.append('cover_letter', e.target.cover_letter.value || '');
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/job-applications/', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      const result = await response.json();
      console.log('Application submitted:', result);
      setSubmitSuccess(true);
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section id="jobs" style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading job opportunities...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="jobs" style={styles.errorContainer}>
        <p style={styles.errorText}>Error: {error}</p>
      </section>
    );
  }

  return (
    <section id="jobs" className="jobs abc" style={styles.portfolio}>
      {/* Section Title */}
      <div className="section-title" style={styles.sectionTitle}>
        <h2 style={styles.sectionTitleH2}>Career Opportunities</h2>
        <div className="title-shape" style={styles.titleShape}>
          <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10" fill="none" stroke="#e4141c" strokeWidth="2"></path>
          </svg>
        </div>
        <p style={styles.sectionTitleP}>Join our team and grow your career with exciting opportunities</p>
      </div>

      <div className="container" style={styles.container}>
        {/* Search and Filter */}
        <div style={styles.searchContainer}>
          <div style={styles.searchInputContainer}>
            <FiSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by job title..."
              value={jobTitleFilter}
              onChange={(e) => setJobTitleFilter(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.searchInputContainer}>
            <FiSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Filter by position type..."
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* Results Count */}
        <div style={styles.resultsCount}>
          {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} available
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div style={styles.jobsGrid}>
            {filteredJobs.map((job) => (
              <div key={job.id} style={styles.jobCard}>
                <div style={styles.jobCardHeader}>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <div style={styles.jobStatusContainer}>
                    <span style={{
                      ...styles.jobType,
                      backgroundColor: job.job_type.toLowerCase() === 'full-time' ? '#e4141c' : 
                                      job.job_type.toLowerCase() === 'part-time' ? '#2196F3' : '#4CAF50'
                    }}>
                      {job.job_type}
                    </span>
                    {job.status === 'inactive' && (
                      <span style={styles.jobStatusInactive}>
                        <FiClock style={{ marginRight: '5px' }} /> Closed
                      </span>
                    )}
                  </div>
                </div>
                <div style={styles.jobCardDetails}>
                  <div style={styles.jobDetail}>
                    <span style={styles.detailLabel}>Department:</span>
                    <span>{job.branch_name}</span>
                  </div>
                  <div style={styles.jobDetail}>
                    <span style={styles.detailLabel}>Location:</span>
                    <span>{job.location}</span>
                  </div>
                  {job.status === 'inactive' && (
                    <div style={styles.jobClosedNotice}>
                      <p>This position is no longer accepting applications</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => openModal(job)}
                  style={{
                    ...styles.applyButton,
                    backgroundColor: job.status === 'inactive' ? '#cccccc' : '#e4141c',
                    cursor: job.status === 'inactive' ? 'not-allowed' : 'pointer'
                  }}
                  disabled={job.status === 'inactive'}
                >
                  {job.status === 'inactive' ? 'Position Closed' : 'Apply Now'} <FiExternalLink />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noResults}>
            <h3>No positions match your search criteria</h3>
            <p>Try adjusting your filters or check back later for new opportunities</p>
          </div>
        )}
      </div>

      {/* Application Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel="Job Application"
        
      >
        {!submitSuccess ? (
          <>
            <div style={styles.modalHeader} className='abc' >
              <h2 style={styles.modalTitle}>Apply for {selectedJob?.title}</h2>
              <div style={styles.jobMeta}>
                <span style={styles.jobMetaItem}>{selectedJob?.job_type}</span>
                <span style={styles.jobMetaItem}>{selectedJob?.branch_name}</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} style={styles.applicationForm}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label htmlFor="full_name" style={styles.formLabel}>Full Name *</label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    placeholder="John Doe"
                    required
                    style={styles.formInput}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="email" style={styles.formLabel}>Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    required
                    style={styles.formInput}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="phone" style={styles.formLabel}>Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+1 (123) 456-7890"
                    required
                    style={styles.formInput}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="address" style={styles.formLabel}>Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="123 Main St, City, Country"
                    style={styles.formInput}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="experience" style={styles.formLabel}>Experience</label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    placeholder="Years of experience in this field"
                    style={styles.formInput}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="skills" style={styles.formLabel}>Skills</label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    placeholder="List your relevant skills"
                    style={styles.formInput}
                  />
                </div>
                
                <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                  <label htmlFor="resume" style={styles.formLabel}>Resume Upload *</label>
                  <div style={styles.fileUploadWrapper}>
                    <label htmlFor="resume" style={styles.fileUploadLabel}>
                      <FiUpload style={styles.uploadIcon} />
                      <span>{resumeFile ? resumeFile.name : 'Choose file or drag here (PDF, DOC, DOCX)'}</span>
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        required
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
                
                <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                  <label htmlFor="cover_letter" style={styles.formLabel}>Cover Letter (Optional)</label>
                  <textarea
                    id="cover_letter"
                    name="cover_letter"
                    placeholder={"Tell us why you'd be a great fit for this position..."}
                    rows="5"
                    style={styles.formTextarea}
                  />
                </div>
              </div>
              
              <div style={styles.formActions}>
                <button
                  type="submit"
                  style={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div style={styles.submitSuccess}>
            <FiCheckCircle style={styles.successIcon} />
            <h3 style={styles.successTitle}>Application Submitted!</h3>
            <p style={styles.successMessage}>Thank you for applying to {selectedJob?.title}. We&apos;ll review your application and get back to you soon.</p>
          </div>
        )}
        <button onClick={closeModal} style={styles.closeModalButton}>
          <FiX />
        </button>
      </Modal>
    </section>
  );
};

// Styles
const styles = {
  portfolio: {
    color: '#333',
    backgroundColor: '#f9f9f9',
    padding: '60px 0',
    scrollMarginTop: '90px',
    overflow: 'hidden',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '300px',
  },
  spinner: {
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #e4141c',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  errorContainer: {
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#ffe6e6',
    margin: '20px',
    borderRadius: '8px',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: '18px',
  },
  sectionTitle: {
    textAlign: 'center',
    paddingBottom: '60px',
    position: 'relative',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 15px',
  },
  sectionTitleH2: {
    fontSize: '42px',
    fontWeight: '700',
    marginBottom: '10px',
    background: 'linear-gradient(120deg, #333, #e4141c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    position: 'relative',
  },
  titleShape: {
    width: '200px',
    height: '20px',
    margin: '0 auto',
    color: '#e4141c',
    opacity: '0.5',
  },
  sectionTitleP: {
    margin: '15px auto 0',
    fontSize: '16px',
    maxWidth: '700px',
    color: 'rgba(51, 51, 51, 0.75)',
    lineHeight: '1.8',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 15px',
  },
  searchContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  searchInputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '15px',
    color: '#666',
    fontSize: '18px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 15px 12px 40px',
    borderRadius: '30px',
    border: '1px solid #ddd',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    '&:focus': {
      outline: 'none',
      borderColor: '#e4141c',
      boxShadow: '0 0 0 2px rgba(228, 20, 28, 0.2)',
    },
  },
  resultsCount: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
  },
  jobsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '25px',
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
    },
  },
  jobCardHeader: {
    padding: '20px',
    borderBottom: '1px solid #eee',
  },
  jobTitle: {
    fontSize: '18px',
    margin: '0 0 10px',
    fontWeight: '600',
    color: '#333',
  },
  jobStatusContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  jobType: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#fff',
    textTransform: 'uppercase',
  },
  jobStatusInactive: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    color: '#666',
  },
  jobCardDetails: {
    padding: '20px',
    flex: '1',
  },
  jobDetail: {
    display: 'flex',
    marginBottom: '12px',
    fontSize: '14px',
  },
  detailLabel: {
    fontWeight: '500',
    color: '#333',
    minWidth: '100px',
  },
  jobClosedNotice: {
    backgroundColor: '#fff8e1',
    padding: '10px',
    borderRadius: '4px',
    marginTop: '15px',
    fontSize: '13px',
    color: '#666',
  },
  applyButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    border: 'none',
    color: '#fff',
    fontWeight: '600',
    fontSize: '14px',
    borderRadius: '0 0 12px 12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    gap: '8px',
    '&:hover': {
      backgroundColor: '#c01118',
    },
  },
  noResults: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  // Modal styles
  modalHeader: {
    textAlign: 'center',
    marginBottom: '25px',
  },
  modalTitle: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
  },
  jobMeta: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '15px',
  },
  jobMetaItem: {
    fontSize: '14px',
    color: '#666',
    backgroundColor: '#f0f0f0',
    padding: '4px 12px',
    borderRadius: '20px',
  },
  applicationForm: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '25px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  formLabel: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  formInput: {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    '&:focus': {
      outline: 'none',
      borderColor: '#e4141c',
      boxShadow: '0 0 0 2px rgba(228, 20, 28, 0.2)',
    },
  },
  formTextarea: {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    resize: 'vertical',
    minHeight: '100px',
    '&:focus': {
      outline: 'none',
      borderColor: '#e4141c',
      boxShadow: '0 0 0 2px rgba(228, 20, 28, 0.2)',
    },
  },
  fileUploadWrapper: {
    width: '100%',
  },
  fileUploadLabel: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 15px',
    borderRadius: '6px',
    border: '1px dashed #ddd',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    color: '#666',
    '&:hover': {
      borderColor: '#e4141c',
      backgroundColor: '#fff',
    },
  },
  uploadIcon: {
    marginRight: '10px',
    fontSize: '18px',
  },
  formActions: {
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#e4141c',
    color: '#fff',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '30px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#c01118',
    },
    '&:disabled': {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed',
    },
  },
  submitSuccess: {
    textAlign: 'center',
    padding: '30px',
  },
  successIcon: {
    fontSize: '60px',
    color: '#4CAF50',
    marginBottom: '20px',
  },
  successTitle: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
  },
  successMessage: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.6',
  },
  closeModalButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    '&:hover': {
      color: '#333',
    },
  },
};

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '800px',
    width: '90%',
    maxHeight: '90vh',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    border: 'none',
    overflowY: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1000
  }
};

export default Jobs;