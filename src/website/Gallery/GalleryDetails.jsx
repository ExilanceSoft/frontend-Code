import React from 'react';
import { useLocation } from 'react-router-dom';
import './Gallery.css';

const GalleryDetails = () => {
  const location = useLocation();
  const { galleryItem } = location.state || {};

  console.log('Received state:', galleryItem); // Debugging

  if (!galleryItem) {
    return <div>No gallery item found.</div>;
  }

  return (
    <section id="gallery" className="gallery section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Gallery Details</h2>
        <div>
          <span>Details for</span> <span className="description-title">{galleryItem.category}</span>
        </div>
      </div>

      <div className="container-fluid" data-aos="fade-up" data-aos-delay="100">
        <div className="row g-0">
          <div className="col-lg-12">
            <div className="gallery-item">
              <img src={galleryItem.image} alt={galleryItem.category} className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryDetails;