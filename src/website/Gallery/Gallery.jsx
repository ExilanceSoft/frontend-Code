import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import GLightbox from "glightbox";
import axios from "axios";
import "swiper/swiper-bundle.css";
import "glightbox/dist/css/glightbox.min.css";

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch gallery images from API
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/images/images/");
        setGalleryImages(response.data); // Assuming API returns an array of { id, src, alt }
      } catch (err) {
        setError("Failed to load gallery images.");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  // Initialize GLightbox
  useEffect(() => {
    const lightbox = GLightbox({
      selector: ".glightbox",
    });

    return () => {
      lightbox.destroy(); // Cleanup on component unmount
    };
  }, [galleryImages]);

  return (
    <section id="gallery" className="gallery section light-background">
      <div className="container section-title" data-aos="fade-up">
        <h2>Gallery</h2>
        <p>
          <span>Check</span> <span className="description-title">Our Gallery</span>
        </p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        {loading ? (
          <p className="text-center">Loading images...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            loop={true}
            speed={600}
            autoplay={{ delay: 5000 }}
            slidesPerView="auto"
            centeredSlides={true}
            pagination={{ clickable: true }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 0 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1200: { slidesPerView: 5, spaceBetween: 20 },
            }}
          >
            {galleryImages.map((image) => (
              <SwiperSlide key={image.id}>
                <a href={image.src} className="glightbox" data-gallery="images-gallery">
              
                  <img
                  src={`http://127.0.0.1:8000/${image.file_path}`} className="img-fluid"
                  alt={image.name}
                />
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default Gallery;
