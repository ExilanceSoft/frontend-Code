import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

// Make sure to set the app element for accessibility
Modal.setAppElement('#root');

const Branches = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [branches, setBranches] = useState([]);
  const [orderLinks, setOrderLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch branches from API
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/branches/');
        if (!response.ok) {
          throw new Error('Failed to fetch branches');
        }
        const data = await response.json();
        setBranches(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // Fetch order links from API
  useEffect(() => {
    const fetchOrderLinks = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/online-order-links/');
        if (!response.ok) {
          throw new Error('Failed to fetch order links');
        }
        const data = await response.json();
        setOrderLinks(data);
      } catch (err) {
        console.error('Error fetching order links:', err);
      }
    };

    fetchOrderLinks();
  }, []);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const openOrderModal = (branch) => {
    setCurrentBranch(branch);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openLightbox = (imageUrl) => {
    setLightboxImage(`http://127.0.0.1:8000${imageUrl}`);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const filteredBranches = activeFilter === 'all' 
    ? branches 
    : branches.filter(branch => branch.city === activeFilter);

  if (loading) {
    return (
      <section id="branches" style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading branches...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="branches" style={styles.errorContainer}>
        <p style={styles.errorText}>Error: {error}</p>
      </section>
    );
  }

  return (
    <section id="branches" className="branches abc" style={styles.portfolio}>
      {/* Section Title */}
      <div className="section-title" style={styles.sectionTitle}>
        <h2 style={styles.sectionTitleH2}>Our Branches</h2>
        <div className="title-shape" style={styles.titleShape}>
          <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10" fill="none" stroke="#e4141c" strokeWidth="2"></path>
          </svg>
        </div>
        <p style={styles.sectionTitleP}>Find your nearest branch and enjoy our signature dishes anytime.</p>
      </div>

      <div className="container" style={styles.container}>
        {/* Filter Buttons */}
        <div className="portfolio-filters-container" style={styles.filtersContainer}>
          <ul className="portfolio-filters" style={styles.filtersList}>
            <li 
              style={activeFilter === 'all' ? {...styles.filterItem, ...styles.filterItemActive} : styles.filterItem}
              onClick={() => handleFilterClick('all')}
            >
              All Branches
            </li>
            {[...new Set(branches.map(branch => branch.city))].map(city => (
              <li 
                key={city}
                style={activeFilter === city ? {...styles.filterItem, ...styles.filterItemActive} : styles.filterItem}
                onClick={() => handleFilterClick(city)}
              >
                {city}
              </li>
            ))}
          </ul>
        </div>

        {/* Branch Cards */}
        <div className="portfolio-grid" style={styles.portfolioGrid}>
          {filteredBranches.map(branch => (
            <div key={branch.id} className="portfolio-item" style={styles.portfolioItem}>
              <div className="portfolio-card" style={styles.portfolioCard}>
                <div className="portfolio-image" style={styles.portfolioImage}>
                  <img 
                    src={`http://127.0.0.1:8000${branch.image_url}`} 
                    className="img-fluid" 
                    alt={branch.name} 
                    loading="lazy" 
                    style={styles.portfolioImg}
                  />
                  <div className="portfolio-overlay" style={styles.portfolioOverlay}>
                    <div className="portfolio-actions" style={styles.portfolioActions}>
                      <button 
                        className="preview-link"
                        style={styles.portfolioActionBtn}
                        onClick={() => openLightbox(branch.image_url)}
                      >
                        <i className="bi bi-eye" style={styles.portfolioActionIcon}></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="portfolio-content" style={styles.portfolioContent}>
                  <span className="category" style={styles.portfolioCategory}>
                    {branch.city}, {branch.state}
                  </span>
                  <h3 style={styles.portfolioTitle}>{branch.name}</h3>
                  <div style={styles.branchDetails}>
                    <p style={styles.portfolioDescription}>
                      <i className="bi bi-geo-alt" style={styles.icon}></i> {branch.address}
                    </p>
                    <p style={styles.portfolioDescription}>
                      <i className="bi bi-clock" style={styles.icon}></i> {branch.opening_hours}
                    </p>
                    <p style={styles.portfolioDescription}>
                      <i className="bi bi-telephone" style={styles.icon}></i> {branch.phone_number}
                    </p>
                    <div style={styles.amenities}>
                      {branch.wifi_availability && (
                        <span style={styles.amenity} title="WiFi Available">
                          <i className="bi bi-wifi" style={styles.icon}></i>
                        </span>
                      )}
                      {branch.parking_availability && (
                        <span style={styles.amenity} title="Parking Available">
                          <i className="bi bi-p-circle" style={styles.icon}></i>
                        </span>
                      )}
                      <span style={styles.amenity} title={`Seating Capacity: ${branch.seating_capacity}`}>
                        <i className="bi bi-people" style={styles.icon}></i> {branch.seating_capacity}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => openOrderModal(branch)}
                    style={styles.orderNowButton}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel="Order Options"
      >
        <h2 style={styles.modalTitle}>Order from {currentBranch?.name}</h2>
        <p style={styles.modalSubtitle}>{currentBranch?.address}</p>
        <div style={styles.modalButtonsContainer}>
          {orderLinks
            .filter(link => link.branch_id === currentBranch?.id)
            .map(link => (
              <a 
                key={link.id}
                href={link.url}
                target="_blank" 
                rel="noopener noreferrer"
                style={styles.foodAppButton}
                title={`Order on ${link.platform}`}
              >
                <img 
                  src={`http://127.0.0.1:8000${link.logo}`}
                  alt={link.platform} 
                  style={styles.foodAppLogo}
                />
              </a>
            ))}
        </div>
        <button onClick={closeModal} style={styles.closeModalButton}>
          Close
        </button>
      </Modal>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="lightbox-overlay" style={styles.lightboxOverlay} onClick={closeLightbox}>
          <div className="lightbox-content" style={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" style={styles.lightboxClose} onClick={closeLightbox}>
              &times;
            </button>
            <img src={lightboxImage} alt="Branch" style={styles.lightboxImg} />
          </div>
        </div>
      )}
    </section>
  );
};
// Enhanced styles
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
  filtersContainer: {
    marginBottom: '40px',
  },
  filtersList: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap',
    padding: '0',
    margin: '0',
    listStyle: 'none',
  },
  filterItem: {
    fontSize: '15px',
    fontWeight: '500',
    padding: '8px 20px',
    cursor: 'pointer',
    borderRadius: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    color: '#333',
    transition: 'all 0.3s ease-in-out',
    border: 'none',
  },
  filterItemActive: {
    backgroundColor: '#e4141c',
    color: '#fff',
  },
  portfolioGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '25px',
  },
  portfolioItem: {
    transition: 'all 0.3s ease',
  },
  portfolioCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease-in-out',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  portfolioImage: {
    position: 'relative',
    overflow: 'hidden',
    height: '200px',
    width: '100%',
  },
  portfolioImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s ease-in-out',
  },
  portfolioOverlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)',
    opacity: '0',
    visibility: 'hidden',
    transition: 'all 0.4s ease-in-out',
    display: 'flex',
    alignItems: 'flex-end',
    padding: '20px',
  },
  portfolioActions: {
    transform: 'translateY(20px)',
    transition: 'all 0.4s ease-in-out',
    display: 'flex',
    gap: '15px',
  },
  portfolioActionBtn: {
    width: '45px',
    height: '45px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#e4141c',
    fontSize: '20px',
    transition: 'all 0.3s ease',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  portfolioActionIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  portfolioContent: {
    padding: '25px',
    flex: '1',
  },
  portfolioCategory: {
    fontSize: '14px',
    color: '#e4141c',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '500',
    display: 'block',
    marginBottom: '10px',
  },
  portfolioTitle: {
    fontSize: '20px',
    margin: '0 0 15px',
    fontWeight: '600',
    transition: 'color 0.3s ease',
    color: '#333',
  },
  branchDetails: {
    marginBottom: '15px',
  },
  portfolioDescription: {
    fontSize: '14px',
    color: 'rgba(51, 51, 51, 0.7)',
    margin: '0 0 10px',
    lineHeight: '1.6',
    display: 'flex',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: '8px',
    color: '#e4141c',
    fontSize: '16px',
    minWidth: '20px',
  },
  amenities: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px',
  },
  amenity: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: 'rgba(51, 51, 51, 0.7)',
  },
  orderNowButton: {
    backgroundColor: '#e4141c',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '15px',
    transition: 'all 0.3s ease',
    width: '100%',
    '&:hover': {
      backgroundColor: '#c01118'
    }
  },
  modalTitle: {
    color: '#333',
    textAlign: 'center',
    marginBottom: '10px',
    fontSize: '22px',
    fontWeight: '600'
  },
  modalSubtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '16px'
  },
  modalButtonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginBottom: '30px'
  },
  foodAppButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    backgroundColor: '#fc8019',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.1)'
    }
  },
  foodAppLogo: {
    width: '50px',
    height: '50px',
    objectFit: 'contain'
  },
  closeModalButton: {
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '20px',
    width: '100%',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#e0e0e0'
    }
  },
  lightboxOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '9999',
  },
  lightboxContent: {
    position: 'relative',
    maxWidth: '90%',
    maxHeight: '90%',
  },
  lightboxImg: {
    maxWidth: '100%',
    maxHeight: '90vh',
    display: 'block',
    borderRadius: '8px',
  },
  lightboxClose: {
    position: 'absolute',
    top: '-40px',
    right: '0',
    color: 'white',
    background: 'rgba(0, 0, 0, 0.5)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '400px',
    width: '90%',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    border: 'none',
    textAlign: 'center'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1000
  }
};

// Add this to your global CSS
const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default Branches;