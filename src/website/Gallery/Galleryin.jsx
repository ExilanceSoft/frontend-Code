import React, { useState, useEffect } from 'react';

const Gallery = () => {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('http://127.0.0.1:8000/gallery_cat/categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch images
        const imagesResponse = await fetch('http://127.0.0.1:8000/images/images/');
        const imagesData = await imagesResponse.json();
        setImages(imagesData);

        // Set first category as active by default
        if (categoriesData.length > 0) {
          setActiveCategory(categoriesData[0].id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredImages = activeCategory 
    ? images.filter(img => img.category_id === activeCategory)
    : images;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading gallery...</p>
      </div>
    );
  }

  return (
    <section style={styles.gallerySection}>
      <div style={styles.container}>
        <h2 style={styles.mainTitle}>Our Gallery</h2>
        <div style={styles.titleUnderline}></div>
        
        {/* Category Filter */}
        <div style={styles.categoryFilter}>
          {categories.map(category => (
            <button
              key={category.id}
              style={activeCategory === category.id ? 
                {...styles.categoryButton, ...styles.activeCategoryButton} : 
                styles.categoryButton}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div style={styles.galleryGrid}>
          {filteredImages.map(image => (
            <div key={image.id} style={styles.galleryItem}>
              <div style={styles.imageContainer}>
              <img 
  src={`http://127.0.0.1:8000${image.file_path.startsWith('/') ? '' : '/'}${image.file_path}`} 
  alt={image.name} 
  style={styles.galleryImage}
  loading="lazy"
/>
                <div style={styles.imageOverlay}>
                  <h3 style={styles.imageTitle}>{image.name}</h3>
                  {image.description && (
                    <p style={styles.imageDescription}>{image.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Styles
const styles = {
  gallerySection: {
    padding: '60px 0',
    backgroundColor: '#f9f9f9',
    fontFamily: "'Poppins', sans-serif",
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 15px',
  },
  mainTitle: {
    textAlign: 'center',
    fontSize: '36px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '15px',
    position: 'relative',
  },
  titleUnderline: {
    width: '80px',
    height: '3px',
    backgroundColor: '#e4141c',
    margin: '0 auto 40px',
  },
  categoryFilter: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '30px',
  },
  categoryButton: {
    padding: '8px 20px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    '&:hover': {
      backgroundColor: '#e4141c',
      color: '#fff',
      borderColor: '#e4141c',
    },
  },
  activeCategoryButton: {
    backgroundColor: '#e4141c',
    color: '#fff',
    borderColor: '#e4141c',
  },
  galleryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  galleryItem: {
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '250px',
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  imageOverlay: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
    color: '#fff',
    padding: '20px',
    transform: 'translateY(100%)',
    transition: 'transform 0.3s ease',
    'div:hover &': {
      transform: 'translateY(0)',
    },
  },
  imageTitle: {
    margin: '0 0 10px',
    fontSize: '18px',
  },
  imageDescription: {
    margin: '0',
    fontSize: '14px',
    opacity: '0.8',
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
  // Animation for spinner
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

export default Gallery;