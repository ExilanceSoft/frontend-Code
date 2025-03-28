import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import testimonialsbg from "../../assets/img/testimonials-bg.jpg";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("http://localhost:8000/testimonial/");
        if (!response.ok) throw new Error("Failed to fetch testimonials");

        const data = await response.json();
        // Filter to show only approved testimonials
        const approvedTestimonials = data.filter(
          (testimonial) => testimonial.status === "approved"
        );
        setTestimonials(approvedTestimonials);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="testimonials section dark-background">
      <img 
        src={testimonialsbg} 
        className="testimonials-bg" 
        alt="Testimonials Background" 
      />
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        {loading ? (
          <p className="text-center">Loading testimonials...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : testimonials.length === 0 ? (
          <p className="text-center">No approved testimonials yet</p>
        ) : (
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="testimonial-item">
                  {testimonial.image && (
                    <img 
                      src={`http://localhost:8000${testimonial.image}`}
                      className="testimonial-img" 
                      alt={testimonial.name} 
                      onError={(e) => {
                        e.target.src = "path/to/default/image.jpg";
                      }}
                    />
                  )}
                  <h3>{testimonial.name}</h3>
                  <div className="stars">
                    {Array.from({ length: testimonial.rating }).map((_, index) => (
                      <i key={index} className="bi bi-star-fill"></i>
                    ))}
                  </div>
                  <p>
                    <i className="bi bi-quote quote-icon-left"></i>
                    {testimonial.description}
                    <i className="bi bi-quote quote-icon-right"></i>
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default Testimonials;